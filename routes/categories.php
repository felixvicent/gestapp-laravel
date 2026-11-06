<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('categories', [CategoryController::class, 'index'])->name('categories');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{categoryId}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{categoryId}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});
