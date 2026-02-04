<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VawcReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_number',
        'victim_name',
        'victim_age',
        'complainant_name',
        'complainant_contact',
        'relation_to_victim',
        'incident_date',
        'abuse_type',
        'incident_location',
        'description',
        'is_anonymous',
        'evidence_path',
        'status',
        'referral_to',
        'referral_date',
        'referral_notes',
    ];

    protected $casts = [
        'incident_date' => 'datetime',
        'is_anonymous' => 'boolean',
    ];
}
