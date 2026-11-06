<?php

namespace App\Http\Controllers;

use App\Exceptions\ResourceNotFoundException;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function __construct(private readonly TransactionService $transactionService) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'maxValue', 'minValue', 'period', 'categories']);

        return Inertia::render('transactions', [
            'transactions' => $this->transactionService->getTransactions($request->user(), $filters),
            'categories' => $request->user()->categories()->get(),
            'filters' => $filters,
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
