<?php

namespace App\DTOs\Dashboard;

readonly class DashboardTransactionVariationDTO
{
    public ?float $variation;

    public function __construct(
        public float $currentTotal,
        public float $previousTotal
    ) {
        $this->variation = $this->previousTotal > 0
            ? (($this->currentTotal - $this->previousTotal) / $this->previousTotal) * 100
            : null;

    }

    public static function from(object $data): DashboardTransactionVariationDTO
    {
        return new self(
            currentTotal: (float) $data->current_total,
            previousTotal: (float) $data->previous_total,
        );
    }
}
