<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseReferralAgency extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category', 'contact_info', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function caseReferrals()
    {
        return $this->hasMany(CaseReferral::class, 'referral_agency_id');
    }
}
