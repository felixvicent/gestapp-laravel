<?php

namespace App\DTOs\Transactions;

use App\Enums\TransactionPeriod;
use Illuminate\Http\Request;

readonly class TransactionFilterDTO
{
    public function __construct(
        public ?string $search,
        public ?float $maxValue,
        public ?float $minValue,
        public ?string $beginDate,
        public ?string $endDate,
        public array $categories = [],
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            search: $request->input('search'),
            maxValue: $request->filled('maxValue') ? (float) $request->input('maxValue') : null,
            minValue: $request->filled('minValue') ? (float) $request->input('minValue') : null,
            beginDate: $request->input('beginDate', now()->startOfMonth()->toDateString()),
            endDate: $request->input('endDate', now()->endOfMonth()->toDateString()),
            categories: array_map('intval', $request->input('categories', [])),
        );
    }
}
