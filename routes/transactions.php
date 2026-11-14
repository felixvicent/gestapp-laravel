<?php

use App\Http\Controllers\TransactionController;

Route::middleware(['auth'])
    ->prefix('transactions')
    ->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('transactions');
        Route::post('/', [TransactionController::class, 'store'])->name('transactions.store');
        Route::put('//{transactionId}', [TransactionController::class, 'update'])->name('transactions.update');
        Route::delete('//{transactionId}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
    });
