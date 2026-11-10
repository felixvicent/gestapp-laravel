<?php

namespace App\Http\Controllers;

use App\DTOs\Transactions\TransactionFilterDTO;
use App\Enums\CategoryType;
use App\Enums\TransactionPeriod;
use App\Exceptions\ResourceNotFoundException;
use App\Http\Requests\Transaction\FilterTransactionRequest;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Services\TransactionService;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function __construct(private readonly TransactionService $transactionService) {}

    public function index(FilterTransactionRequest $request)
    {
        $filters = TransactionFilterDTO::fromRequest($request);

        return Inertia::render('transactions', [
            'transactions' => $this->transactionService->getTransactions($request->user(), $filters),
            'categories' => $request->user()->categories()->get(),
            'filters' => $filters,
            'period' => collect(TransactionPeriod::cases())
                ->map(fn ($type) => [
                    'value' => $type->value,
                    'label' => $type->label(),
                ])
                ->values(),
        ]);
    }

    public function store(StoreTransactionRequest $request)
    {
        $request->user()->transactions()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transação criada com sucesso!.']);

        return redirect()->route('transactions');
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function update(UpdateTransactionRequest $request, int $categoryId)
    {
        $transaction = $this->transactionService->findOrFail($categoryId);
        $transaction->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transação atualizada com sucesso!.']);

        return redirect()->route('transactions');
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function destroy(int $categoryId)
    {
        $transaction = $this->transactionService->findOrFail($categoryId);

        $transaction->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transação deletada com sucesso!.']);

        return back();
    }
}
