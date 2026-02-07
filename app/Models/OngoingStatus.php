<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OngoingStatus extends Model
{
    protected $fillable = ['name', 'description', 'type', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
