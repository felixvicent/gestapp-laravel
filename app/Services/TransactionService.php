<?php

namespace App\Services;

use App\DTOs\Dashboard\DashboardFilterDTO;
use App\DTOs\Dashboard\DashboardTransactionByCategoryDTO;
use App\DTOs\Dashboard\DashboardTransactionByTagDTO;
use App\DTOs\Dashboard\DashboardTransactionVariationDTO;
use App\DTOs\Transactions\TransactionDTO;
use App\DTOs\Transactions\TransactionFilterDTO;
use App\DTOs\Transactions\TransactionsByMonthDTO;
use App\Enums\CategoryType;
use App\Exceptions\ResourceNotFoundException;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Models\Transaction;
use App\Models\User;
use Carbon\CarbonImmutable;
use DateMalformedStringException;
use DateTimeImmutable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

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
            ->select('transactions.*')
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
            ->when($filters->tags ?? null, function ($query, $tags) {
                $query->whereIn('tags.id', $tags);
            })
            ->when($filters->beginDate && $filters->endDate, function ($query) use ($filters) {
                $query->whereBetween('date', [$filters->beginDate, $filters->endDate]);
            })
            ->with(['category', 'tags'])
            ->leftJoin('tag_transaction', 'transactions.id', '=', 'tag_transaction.transaction_id')
            ->leftJoin('tags', 'tag_transaction.tag_id', '=', 'tags.id')
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
        [$previousStart, $previousEnd] = $this->getPreviousPeriod($filter->beginDate, $filter->endDate);

        return DashboardTransactionVariationDTO::from(
            $user->transactions()
                ->selectRaw('
                    SUM(CASE WHEN date BETWEEN ? AND ? THEN value ELSE 0 END) as current_total,
                    SUM(CASE WHEN date BETWEEN ? AND ? THEN value ELSE 0 END) as previous_total
                ', [
                    $filter->beginDate, $filter->endDate, $previousStart, $previousEnd,
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
            ->whereBetween('date', [$filter->beginDate, $filter->endDate])
            ->where('categories.type', $type)
            ->groupBy('categories.id')
            ->get()
            ->map(fn ($item) => DashboardTransactionByCategoryDTO::from($item));
    }

    public function getTransactionsByTags(User $user, DashboardFilterDTO $filter, CategoryType $type): Collection|\Illuminate\Support\Collection
    {
        return $user->transactions()
            ->selectRaw('SUM(value) as value, tags.name as tag, tags.color as color')
            ->join('tag_transaction', 'transactions.id', '=', 'tag_transaction.transaction_id')
            ->leftJoin('tags', 'tag_transaction.tag_id', '=', 'tags.id')
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->whereBetween('date', [$filter->beginDate, $filter->endDate])
            ->where('categories.type', $type)
            ->groupBy('tags.name', 'tags.color')
            ->get()
            ->map(fn ($item) => DashboardTransactionByTagDTO::from($item));
    }

    /**
     * @throws Throwable
     */
    public function create(StoreTransactionRequest $request): void
    {
        $data = $request->validated();

        DB::transaction(function () use ($request, $data) {
            $tags = $data['tags'] ?? [];

            unset($data['tags']);

            $transaction = $request->user()->transactions()->create($data);
            $transaction->tags()->sync($tags);
        });

    }

    /**
     * @throws ResourceNotFoundException
     * @throws Throwable
     */
    public function update(UpdateTransactionRequest $request, int $transactionId): void
    {
        $transaction = $this->findOrFail($transactionId);
        $data = $request->validated();

        DB::transaction(function () use ($transaction, $data) {
            $tags = $data['tags'] ?? [];

            unset($data['tags']);

            $transaction->update($data);
            $transaction->tags()->sync($tags);
        });

        $transaction->update($request->validated());
    }

    /**
     * @throws DateMalformedStringException
     */
    private function getPreviousPeriod(string $beginDate, string $endDate): array
    {
        $start = CarbonImmutable::parse($beginDate);
        $end = CarbonImmutable::parse($endDate);

        $diff = (($end->year - $start->year) * 12)
            + ($end->month - $start->month) + 1;

        $previousEnd = $start->subDay();

        $previousStart = $previousEnd
            ->subMonths($diff - 1)
            ->startOfMonth();

        return [
            $previousStart,
            $previousEnd,
        ];
    }
}
