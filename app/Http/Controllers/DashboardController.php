<?php

namespace App\Http\Controllers;

use App\DTOs\Dashboard\DashboardFilterDTO;
use App\DTOs\Transactions\TransactionsByMonthDTO;
use App\Enums\CategoryType;
use App\Enums\TransactionPeriod;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private readonly TransactionService $transactionService) {}

    public function index(Request $request)
    {
        $filters = DashboardFilterDTO::fromRequest($request);

        $transactionByMonth = $this->transactionService->getTransactionByMonthAndType($request->user());
        $revenueVariation = $this->transactionService->getVariationByPeriodAndType($request->user(), $filters, CategoryType::REVENUE->name);
        $expenseVariation = $this->transactionService->getVariationByPeriodAndType($request->user(), $filters, CategoryType::EXPENSE->name);
        $expenseByCategory = $this->transactionService->getAmountByPeriodAndCategory($request->user(), $filters, CategoryType::EXPENSE);
        $revenueByCategory = $this->transactionService->getAmountByPeriodAndCategory($request->user(), $filters, CategoryType::REVENUE);
        $expenseByTag = $this->transactionService->getTransactionsByTags($request->user(), $filters, CategoryType::EXPENSE);
        $revenueByTag = $this->transactionService->getTransactionsByTags($request->user(), $filters, CategoryType::REVENUE);

        $transactionByMonthData = collect(range(1, 12))
            ->map(fn (int $month) => TransactionsByMonthDTO::from(
                (object) [
                    'month' => $month,
                    'revenue' => $transactionByMonth->get($month)?->revenue ?? 0,
                    'expense' => $transactionByMonth->get($month)?->expense ?? 0,
                ]
            ));

        return Inertia::render('dashboard', [
            'transactionByMonth' => $transactionByMonthData,
            'revenueVariation' => $revenueVariation,
            'expenseVariation' => $expenseVariation,
            'expenseByCategory' => $expenseByCategory,
            'revenueByCategory' => $revenueByCategory,
            'expenseByTag' => $expenseByTag,
            'revenueByTag' => $revenueByTag,
            'period' => collect(TransactionPeriod::cases())
                ->map(fn ($type) => [
                    'value' => $type->value,
                    'label' => $type->label(),
                ])
                ->values(),
            'filters' => $filters,
        ]);
    }
}
