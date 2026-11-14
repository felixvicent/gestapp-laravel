<?php

namespace App\DTOs\Tags;

use App\Models\Tag;

class TagDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $color,
    ) {}

    public static function fromModel(Tag $tag): TagDTO
    {
        return new self(
            id : $tag->id,
            name : $tag->name,
            color : $tag->color,
        );
    }
}
