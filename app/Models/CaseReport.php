<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseReport extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'case_number',
        'type',
        'victim_name',
        'victim_age',
        'victim_gender',
        'complainant_name',
        'complainant_contact',
        'relation_to_victim',
        'is_anonymous',
        'incident_date',
        'incident_location',
        'description',
        'abuse_type_id',
        'lifecycle_status',
        'handled_by_id',
        'case_status_id',
        'zone_id',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'incident_date' => 'datetime',
    ];

    /**
     * Get the abuse type associated with the report.
     */
    public function abuseType(): BelongsTo
    {
        return $this->belongsTo(CaseAbuseType::class, 'abuse_type_id');
    }

    /**
     * Get the status associated with the report.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(CaseStatus::class, 'case_status_id');
    }

    /**
     * Get the referrals associated with the report.
     */
    public function referrals()
    {
        return $this->hasMany(CaseReferral::class, 'case_report_id');
    }

    /**
     * Get the admin who handled the case.
     */
    public function handledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by_id');
    }

    /**
     * Get the audit logs for this case report.
     */
    public function audits()
    {
        return $this->morphMany(AuditLog::class, 'auditable');
    }
    /**
     * Get the zone where the incident occurred.
     */
    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }
}
