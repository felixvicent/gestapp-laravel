<?php

namespace App\DTOs\Transactions;

class TransactionCountDTO
{
    public function __construct(
        public float $total_revenue,
        public float $total_expense
    ) {}

    public static function from(object $data)
    {
        return new self(
            total_revenue: $data->total_revenue,
            total_expense: $data->total_expense
        );
    }
}
