<?php

namespace App\Services;

use App\DTOs\Dashboard\DashboardFilterDTO;
use App\DTOs\Dashboard\DashboardTransactionByCategoryDTO;
use App\DTOs\Transactions\TransactionDTO;
use App\DTOs\Transactions\TransactionFilterDTO;
use App\DTOs\Transactions\TransactionsByMonthDTO;
use App\Enums\CategoryType;
use App\Exceptions\ResourceNotFoundException;
use App\Models\Transaction;
use App\Models\User;
use App\DTOs\Dashboard\DashboardTransactionVariationDTO;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class TransactionService
{
    /**
     * @throws ResourceNotFoundException
     */
    public function findOrFail(int $id): Transaction
    {
        return Auth::user()->transactions()->findOrFail($id)
            ?? throw new ResourceNotFoundException('Transação não encontrada!');
    }

    public function getTransactions(User $user, TransactionFilterDTO $filters): LengthAwarePaginator
    {
        return $user->transactions()
            ->when($filters->search ?? null, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($filters->minValue ?? null, function ($query, $minValue) {
                $query->where('value', '>=', max($minValue, 0));
            })
            ->when($filters->maxValue ?? null, function ($query, $maxValue) {
                $query->where('value', '<=', $maxValue);
            })
            ->when($filters->categories ?? null, function ($query, $categories) {
                $query->whereIn('category_id', $categories);
            })
            ->when($filters->period ?? null, function ($query, $period) {
                $query->whereBetween('date', $this->getPeriod($period));
            })
            ->with('category')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($transaction) => TransactionDTO::fromModel($transaction));
    }

    public function getTransactionByMonthAndType(User $user): Collection|\Illuminate\Support\Collection
    {
        return $user->transactions()
            ->selectRaw('
                MONTH(date) as month,
                SUM(CASE WHEN categories.type = "REVENUE" THEN value ELSE 0 END) AS revenue,
                SUM(CASE WHEN categories.type = "EXPENSE" THEN value ELSE 0 END) AS expense
            ')
            ->leftJoin('categories', 'transactions.category_id', '=', 'categories.id')
            ->whereYear('date', now()->year)
            ->groupByRaw('MONTH(date)')
            ->orderByRaw('MONTH(date)')
            ->get()
            ->keyBy('month')
            ->map(fn ($transaction) => TransactionsByMonthDTO::from($transaction));
    }

    public function getVariationByPeriodAndType(User $user, DashboardFilterDTO $filter, string $type): DashboardTransactionVariationDTO
    {
        [$start, $end] = $this->getPeriod($filter->period);
        [$previousStart, $previousEnd] = $this->getPreviousPeriod($filter->period);

        return DashboardTransactionVariationDTO::from(
            $user->transactions()
                ->selectRaw('
                    SUM(CASE WHEN date BETWEEN ? AND ? THEN value ELSE 0 END) as current_total,
                    SUM(CASE WHEN date BETWEEN ? AND ? THEN value ELSE 0 END) as previous_total
                ', [
                    $start, $end, $previousStart, $previousEnd,
                ])
                ->leftJoin('categories', 'transactions.category_id', '=', 'categories.id')
                ->where('categories.type', $type)
                ->first()
        );
    }

    public function getAmountByPeriodAndCategory(User $user, DashboardFilterDTO $filter, CategoryType $type): Collection|\Illuminate\Support\Collection
    {
        return $user->transactions()
            ->selectRaw('SUM(value) as value, categories.name as name')
            ->leftJoin('categories', 'transactions.category_id', '=', 'categories.id')
            ->whereBetween('date', $this->getPeriod($filter->period))
            ->where('categories.type', $type)
            ->groupBy('categories.id')
            ->get()
            ->map(fn ($item) => DashboardTransactionByCategoryDTO::from($item));
    }

    private function getPeriod(string $period): array
    {
        return match ($period) {
            'LAST_3_MONTHS' => [
                now()->subMonths(2)->startOfMonth(),
                now()->endOfMonth(),
            ],
            'LAST_6_MONTHS' => [
                now()->subMonths(5)->startOfMonth(),
                now()->endOfMonth(),
            ],
            'LAST_YEAR' => [
                now()->startOfYear(),
                now()->endOfYear(),
            ],
            default => [
                now()->startOfMonth(),
                now()->endOfMonth(),
            ],
        };
    }

    private function getPreviousPeriod(string $period): array
    {
        [$start, $end] = $this->getPeriod($period);

        $diff = $start->diffInMonths($end);

        return [
            $start->copy()->subMonths($diff)->startOfMonth(),
            $start->copy()->subMonth()->endOfMonth(),
        ];
    }
}
