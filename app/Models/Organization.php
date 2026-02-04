<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
// relationship import
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'president_name',
        'color_theme',
        'image_path',
        'requirements',
        'form_schema'
    ];

    // Cast requirements as array automatically
    protected $casts = [
        'requirements' => 'array',
        'form_schema' => 'array',
    ];


    /**
     * RELATIONSHIP: An organization has many membership applications.
     */
    public function membershipApplications(): HasMany
    {
        return $this->hasMany(MembershipApplication::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($organization) {
            // Only generate slug if not provided/empty
            if (empty($organization->slug)) {
                $organization->slug = Str::slug($organization->name);
            }
        });

        static::updating(function ($organization) {
            if ($organization->isDirty('name')) {
                $organization->slug = Str::slug($organization->name);
            }
        });
    }
}