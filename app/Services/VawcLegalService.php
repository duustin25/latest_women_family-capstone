<?php

namespace App\Services;

use App\Models\VawcCase;
use App\Models\VawcLegalEscalation;
use Illuminate\Support\Facades\Auth;

class VawcLegalService
{
    /**
     * Escalate a BPO violation to PNP/Prosecutor/Court (RA 9262 Step 12).
     */
    public function escalateCase(VawcCase $case, array $data): VawcLegalEscalation
    {
        $case->update(['status' => 'Legal Escalation']);

        return VawcLegalEscalation::create([
            'vawc_case_id' => $case->id,
            'violation_datetime' => $data['violation_datetime'] ?? now(),
            'referral_target' => $data['referral_target'],
            'escorted_by_pb' => filter_var($data['escorted_by_pb'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'status' => 'Case Prepared',
            'violation_description' => $data['violation_description'] ?? null,
        ]);
    }
}
