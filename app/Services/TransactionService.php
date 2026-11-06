<?php

namespace App\Services;

use App\DTOs\TransactionDTO;
use App\Exceptions\ResourceNotFoundException;
use App\Models\Transaction;
use App\Models\User;
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

    public function getTransactions(User $user, array $filters = []): LengthAwarePaginator
    {
        return $user->transactions()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($filters['minValue'] ?? null, function ($query, $minValue) {
                $query->where('value', '>=', max($minValue, 0));
            })
            ->when($filters['maxValue'] ?? null, function ($query, $maxValue) {
                $query->where('value', '<=', $maxValue);
            })
            ->when($filters['categories'] ?? null, function ($query, $categories) {
                $query->whereIn('category_id', $categories);
            })
            ->when($filters['period'] ?? null, function ($query, $period) {
                $query->whereBetween('date', $this->getPeriod($period));
            })
            ->with('category')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($transaction) => TransactionDTO::fromModel($transaction));
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
}
