<?php

namespace App\Http\Controllers;

use App\Enums\CategoryType;
use App\Exceptions\ResourceNotFoundException;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryService $categoryService) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'type']);
        return Inertia::render('categories', [
            'categories' => $this->categoryService->getCategories($request->user(), $filters),
            'types' => collect(CategoryType::cases())
                ->map(fn ($type) => [
                    'value' => $type->value,
                    'label' => $type->label(),
                ])
                ->values(),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $request->user()->categories()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Categoria criada com sucesso!.']);

        return redirect()->route('categories');
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function update(UpdateCategoryRequest $request, int $categoryId)
    {
        $category = $this->categoryService->findOrFail($categoryId);
        $category->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Categoria atualizada com sucesso!.']);

        return redirect()->route('categories');
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function destroy(int $categoryId)
    {
        $category = $this->categoryService->findOrFail($categoryId);

        $category->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Categoria deletada com sucesso!.']);

        return back();
    }
}
