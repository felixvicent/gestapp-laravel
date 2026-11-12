<?php

namespace App\DTOs\Categories;

use App\Models\Category;

class CategoryDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $description,
        public string $type,
        public string $created_at,
    ) {}

    public static function fromModel(Category $category): CategoryDTO
    {
        return new self(
            id : $category->id,
            name : $category->name,
            description : $category->description,
            type : $category->type,
            created_at : $category->created_at,
        );
    }
}
