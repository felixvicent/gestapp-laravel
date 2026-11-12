<?php

namespace App\DTOs\Transactions;

readonly class TransactionsByMonthDTO
{
    public function __construct(
        public int $month, public float $revenue, public float $expense
    ) {}

    public static function from(object $data): self
    {
        return new self(
            month: (int) $data->month,
            revenue: (float) $data->revenue,
            expense: (float) $data->expense,
        );
    }
}
