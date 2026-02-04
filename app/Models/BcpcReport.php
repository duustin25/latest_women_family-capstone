<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BcpcReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_number',
        'victim_name',
        'victim_age',
        'victim_gender',
        'concern_type',
        'location',
        'description',
        'informant_name',
        'informant_contact',
        'is_anonymous',
        'status',
        'referral_to',
        'referral_date',
        'referral_notes'
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'referral_date' => 'datetime',
    ];
}
