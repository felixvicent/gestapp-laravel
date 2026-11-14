<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = ['name', 'color', 'user_id'];

    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(Transaction::class);
    }
}

