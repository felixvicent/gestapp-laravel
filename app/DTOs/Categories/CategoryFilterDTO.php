<?php

namespace App\DTOs\Categories;

use Illuminate\Http\Request;

readonly class CategoryFilterDTO
{
    public function __construct(
        public ?string $search,
        public ?string $type,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            search: $request->input('search'),
            type: $request->input('type'),
        );
    }
}
