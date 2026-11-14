<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])
    ->prefix('categories')
    ->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('categories');
        Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/{categoryId}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/{categoryId}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });
