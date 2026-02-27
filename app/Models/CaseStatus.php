<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseStatus extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'description', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function caseReports()
    {
        return $this->hasMany(CaseReport::class, 'case_status_id');
    }
}
