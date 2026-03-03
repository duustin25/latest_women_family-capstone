<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseReferral extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'case_report_id',
        'referral_agency_id',
        'referred_at',
        'referral_notes',
        'status',
        'agency_feedback',
        'handled_by_id',
    ];

    protected $casts = [
        'referred_at' => 'datetime',
    ];

    public function caseReport(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(CaseReport::class);
    }

    public function agency(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(CaseReferralAgency::class, 'referral_agency_id');
    }

    public function handledBy(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by_id');
    }
}
