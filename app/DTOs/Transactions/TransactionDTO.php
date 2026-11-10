<?php

namespace App\DTOs\Transactions;

use App\DTOs\Categories\CategoryDTO;
use App\Models\Transaction;

class TransactionDTO
{
    public static function fromModel(Transaction $transaction): array
    {
        return [
            'id' => $transaction->id,
            'title' => $transaction->title,
            'description' => $transaction->description,
            'value' => $transaction->value,
            'date' => $transaction->date,
            'created_at' => $transaction->created_at,
            'category' => CategoryDTO::fromModel($transaction->category),
        ];
    }
}
