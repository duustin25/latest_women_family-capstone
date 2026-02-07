<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipApplication extends Model
{
    protected $fillable = [
        'organization_id',
        'fullname',
        'address',
        'personal_data',
        'family_data',
        'submission_data',
        'status',
        'approved_by',
        'actioned_at'
    ];

    protected $casts = [
        'personal_data' => 'array',
        'family_data' => 'array',
        'submission_data' => 'array',
        'actioned_at' => 'datetime',
    ];

    /**
     * Each application belongs to one organization.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}