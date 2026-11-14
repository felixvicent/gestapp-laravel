<?php

namespace App\DTOs\Transactions;

use App\DTOs\Categories\CategoryDTO;
use App\DTOs\Tags\TagDTO;
use App\Models\Tag;
use App\Models\Transaction;

class TransactionDTO
{
    public function __construct(
        public int $id,
        public string $title,
        public float $value,
        public ?string $description,
        public string $date,
        public string $created_at,
        public CategoryDTO $category,
        /** @var TagDTO */
        public array $tags
    ) {}

    public static function fromModel(Transaction $transaction): TransactionDTO
    {
        return new self(
            id: $transaction->id,
            title: $transaction->title,
            value: $transaction->value,
            description: $transaction->description,
            date: $transaction->date,
            created_at: $transaction->created_at,
            category: CategoryDTO::fromModel($transaction->category),
            tags: $transaction->tags->map(fn (Tag $tag) => TagDTO::fromModel($tag))->toArray()
        );
    }
}
