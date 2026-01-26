<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'president_name', 
        'color_theme', 'image_path', 'requirements'
    ];

    // Cast requirements as array automatically
    protected $casts = [
        'requirements' => 'array',
    ];
}