<?php

namespace App\Enums;

enum CategoryType: string
{
    case REVENUE = 'REVENUE';
    case EXPENSE = 'EXPENSE';

    public function label(): string
    {
        return match ($this) {
            self::REVENUE => 'Receita',
            self::EXPENSE => 'Despesa',
        };
    }
}
