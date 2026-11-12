<?php

namespace App\DTOs\Dashboard;

readonly class DashboardTransactionByCategoryDTO
{
    public function __construct(
        public float $total,
        public string $category
    ) {}

    public static function from(object $data): DashboardTransactionByCategoryDTO
    {
        return new self(
            total: (float) $data->value,
            category: (string) $data->name,
        );
    }
}
