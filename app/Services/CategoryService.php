<?php

namespace App\Services;

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

    public function getCategories(User $user, array $filters = []): LengthAwarePaginator|AbstractPaginator
    {
        return $user->categories()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('name', 'like', '%'.$search.'%');
            })
            ->when(isset($filters['type']) && $filters['type'] !== 'ALL', function ($query, $type) {
                $query->where('type', $type);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }
}
