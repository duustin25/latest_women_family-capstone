<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'image_path',
        'link_url',
        'is_active',
        'order_index',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
