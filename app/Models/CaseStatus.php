<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStatus extends Model
{
    protected $fillable = ['name', 'description', 'type', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
