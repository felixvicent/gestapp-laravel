<?php

namespace App\Enums;

enum TransactionPeriod: string
{
    case CURRENT_MONTH = 'CURRENT_MONTH';
    case LAST_3_MONTHS = 'LAST_3_MONTHS';
    case LAST_6_MONTHS = 'LAST_6_MONTHS';
    case LAST_YEAR = 'LAST_YEAR';

    public function label(): string
    {
        return match ($this) {
            self::CURRENT_MONTH => 'Mês atual',
            self::LAST_3_MONTHS => 'Últimos 3 meses',
            self::LAST_6_MONTHS => 'Últimos 6 meses',
            self::LAST_YEAR => 'Último ano',
        };
    }
}
