<?php

namespace App\DTOs\Dashboard;

use App\Enums\CategoryType;
use App\Enums\TransactionPeriod;
use Illuminate\Http\Request;

class DashboardFilterDTO
{
    public function __construct(
        public ?string $beginDate,
        public ?string $endDate,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            beginDate: $request->input('beginDate', now()->startOfMonth()->toDateString()),
            endDate: $request->input('endDate', now()->endOfMonth()->toDateString()),
        );
    }
}
