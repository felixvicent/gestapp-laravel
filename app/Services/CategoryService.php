<?php

namespace App\Services;

use App\DTOs\Categories\CategoryDTO;
use App\DTOs\Categories\CategoryFilterDTO;
use App\Exceptions\ResourceNotFoundException;
use App\Models\Category;
use App\Models\User;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class CategoryService
{
    /**
     * @throws ResourceNotFoundException
     */
    public function findOrFail(int $id): Category
    {
        return Auth::user()->categories()->findOrFail($id)
            ?? throw new ResourceNotFoundException('Categoria não encontrada!');
    }

    public function getCategories(User $user): LengthAwarePaginator|AbstractPaginator
    {
        return $user->categories()
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Category $category) => CategoryDTO::fromModel($category));
    }
}
