<?php

namespace App\DTOs;

use App\Models\Category;

class CategoryDTO
{
    public static function fromModel(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'description' => $category->description,
            'type' => $category->type,
            'created_at' => $category->created_at,
        ];
    }
}
