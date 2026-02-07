<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GadActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'activity_type',
        'status',
        'date_scheduled',
        'total_project_cost',
        'hgdg_score',
        'gad_chargeable_amount',
        'actual_expenditure',
        'target_participants',
        'attendance_file',
    ];

    protected $casts = [
        'date_scheduled' => 'datetime',
        'target_participants' => 'array',
        'hgdg_score' => 'decimal:2',
        'gad_chargeable_amount' => 'decimal:2',
        'actual_expenditure' => 'decimal:2',
        'total_project_cost' => 'decimal:2',
    ];
}
