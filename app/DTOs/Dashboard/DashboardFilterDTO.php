<?php

namespace App\DTOs\Dashboard;

use App\Enums\CategoryType;
use App\Enums\TransactionPeriod;
use Illuminate\Http\Request;

class DashboardFilterDTO
{
    public function __construct(
        public ?string $period,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            period: $request->input('period', TransactionPeriod::CURRENT_MONTH->name),
        );
    }
}
