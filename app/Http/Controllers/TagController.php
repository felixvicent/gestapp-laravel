<?php

namespace App\Http\Controllers;

use App\DTOs\Tags\TagDTO;
use App\Exceptions\ResourceNotFoundException;
use App\Http\Requests\Tag\StoreTagRequest;
use App\Http\Requests\Tag\UpdateTagRequest;
use App\Services\TagService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct(private readonly TagService $tagService) {}

    public function index(Request $request)
    {
        return Inertia::render('tags', [
            'tags' => $request->user()->tags()->paginate(10)->through(fn ($tag) => TagDTO::fromModel($tag)),
        ]);
    }

    public function store(StoreTagRequest $request)
    {
        $request->user()->tags()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tag criada com sucesso!']);

        return redirect()->route('tags');
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function update(UpdateTagRequest $request, int $tagId)
    {
        $tag = $this->tagService->findOrFail($tagId);
        $tag->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tag atualizada com sucesso!']);

        return redirect()->route('tags');
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function destroy($tagId)
    {
        $tag = $this->tagService->findOrFail($tagId);

        $tag->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Tag apagada com sucesso!']);

        return redirect()->route('tags');
    }
}
