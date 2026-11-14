<?php

namespace App\Services;

use App\Exceptions\ResourceNotFoundException;
use App\Models\Tag;
use Illuminate\Support\Facades\Auth;

class TagService
{
    /**
     * @throws ResourceNotFoundException
     */
    public function findOrFail(int $id): Tag
    {
        return Auth::user()->tags()->findOrFail($id)
            ?? throw new ResourceNotFoundException('Tag não encontrada!');
    }
}
