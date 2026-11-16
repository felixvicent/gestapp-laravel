<?php

namespace App\Http\Controllers;

use App\DTOs\Categories\CategoryDTO;
use App\DTOs\Tags\TagDTO;
use App\DTOs\Transactions\TransactionFilterDTO;
use App\Enums\TransactionPeriod;
use App\Exceptions\ResourceNotFoundException;
use App\Http\Requests\Transaction\FilterTransactionRequest;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Services\TransactionService;
use Inertia\Inertia;
use Throwable;

class TransactionController extends Controller
{
    public function __construct(private readonly TransactionService $transactionService) {}

    public function index(FilterTransactionRequest $request)
    {
        $filters = TransactionFilterDTO::fromRequest($request);

        return Inertia::render('transactions', [
            'transactions' => $this->transactionService->getTransactions($request->user(), $filters),
            'categories' => $request->user()->categories()->get()->map(fn ($category) => CategoryDTO::fromModel($category)),
            'tags' => $request->user()->tags()->get()->map(fn ($tag) => TagDTO::fromModel($tag)),
            'filters' => $filters,
        ]);
    }

    /**
     * @throws Throwable
     */
    public function store(StoreTransactionRequest $request)
    {
        $this->transactionService->create($request);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transação criada com sucesso!.']);

        return back();
    }

    /**
     * @throws ResourceNotFoundException|Throwable
     */
    public function update(UpdateTransactionRequest $request, int $transactionId)
    {
        $this->transactionService->update($request, $transactionId);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Transação atualizada com sucesso!.']);

        return back();
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
