<?php

use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])
    ->prefix('tags')
    ->group(function () {
        Route::get('/', [TagController::class, 'index'])->name('tags');
        Route::post('/', [TagController::class, 'store'])->name('tags.store');
        Route::put('/{tagId}', [TagController::class, 'update'])->name('tags.update');
        Route::delete('/{tagId}', [TagController::class, 'destroy'])->name('tags.destroy');
    });
