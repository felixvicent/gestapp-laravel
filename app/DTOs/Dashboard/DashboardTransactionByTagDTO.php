<?php

namespace App\DTOs\Dashboard;

readonly class DashboardTransactionByTagDTO
{
    public function __construct(
        public float $total,
        public string $tag,
        public string $color,
    ) {}

    public static function from(object $data): DashboardTransactionByTagDTO
    {
        return new self(
            total: (float) $data->value,
            tag: (string) $data->tag,
            color: (string) $data->color,
        );
    }
}
