<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', 'dashboard')->name('home');

require __DIR__.'/dashboard.php';
require __DIR__.'/categories.php';
require __DIR__.'/transactions.php';
require __DIR__.'/settings.php';
