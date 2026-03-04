<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationalMember extends Model
{
    protected $fillable = [
        'user_id',
        'position',
        'committee',
        'image_path',
        'level',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getOfficialNameAttribute()
    {
        return $this->user ? $this->user->name : $this->name;
    }
}
