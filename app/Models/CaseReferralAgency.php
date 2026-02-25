<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseReferralAgency extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'contact_info',
        'is_active',
    ];
}
