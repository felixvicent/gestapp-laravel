<?php

use App\Http\Controllers\TransactionController;

Route::middleware(['auth'])->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::put('/transactions/{transactionId}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/transactions/{transactionId}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
});
