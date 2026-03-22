<?php

namespace App\Services;

use App\Models\CaseReport;
use App\Models\CaseAbuseType;
use App\Models\CaseStatus;
use App\Models\Agency;

class CaseManagementService
{
    /**
     * Create a new case report with its associated configurations.
     */
    public function createCase(array $validatedData, string $type): CaseReport
    {
        // Base Data Mapping matching the Unified CaseReport migration
        $reportData = [
            'type' => $type,
            'case_number' => $type . '-' . date('Ymd') . '-' . rand(1000, 9999),
            'victim_name' => $validatedData['victim_name'] ?? null,
            'victim_age' => $validatedData['victim_age'] ?? null,
            'victim_gender' => $validatedData['victim_gender'] ?? null,

            'complainant_name' => $validatedData['complainant_name'] ?? null,
            'complainant_contact' => $validatedData['complainant_contact'] ?? null,
            'relation_to_victim' => $validatedData['relation_to_victim'] ?? null,

            'incident_date' => $validatedData['incident_date'] ?? now(),
            'incident_location' => $validatedData['incident_location'] ?? 'Unknown',
            'description' => $validatedData['description'] ?? '',
            'is_anonymous' => $validatedData['is_anonymous'] ?? false,
            'zone_id' => $validatedData['zone_id'] ?? null,
        ];

        // 1. Abuse Type
        $incomingAbuseType = $validatedData['abuse_type'] ?? null;
        if ($incomingAbuseType) {
            $abuseTypeModel = CaseAbuseType::where('name', trim($incomingAbuseType))->first();
            if ($abuseTypeModel) {
                $reportData['abuse_type_id'] = $abuseTypeModel->id;
            }
        }

        // 2. Initial Status
        $reportData['lifecycle_status'] = 'New';
        $reportData['case_status_id'] = null; // No dynamic sub-status yet

        return CaseReport::create($reportData);
    }

    /**
     * Update the status and referral information of an existing case report.
     */
    public function updateStatus(CaseReport $case, string $uiStatus, ?string $referralNotes = null, ?string $referralStatus = null, ?string $agencyFeedback = null): bool
    {
        $dbStatusId = null;
        $referralAgencyId = null;
        $lifecycleStatus = $case->lifecycle_status;

        if (str_starts_with($uiStatus, 'Referred: ')) {
            $lifecycleStatus = 'Referred';

            // Find Agency
            $agencyName = trim(substr($uiStatus, 10));
            $agency = Agency::where('name', $agencyName)->first();
            if ($agency) {
                $referralAgencyId = $agency->id;
            }

        } elseif (str_starts_with($uiStatus, 'Ongoing: ')) {
            $lifecycleStatus = 'Ongoing';

            $cleanStatus = trim(substr($uiStatus, 9));
            $statusModel = CaseStatus::where('name', $cleanStatus)->first();
            if ($statusModel) {
                $dbStatusId = $statusModel->id;
            }
        } else {
            // Direct Match for New, Resolved, Closed, Dismissed
            if (in_array($uiStatus, ['New', 'Resolved', 'Closed', 'Dismissed'])) {
                $lifecycleStatus = $uiStatus;
            } else {
                // Unknown wildcard, fallback
                $lifecycleStatus = 'Ongoing';
                $statusModel = CaseStatus::where('name', $uiStatus)->first();
                if ($statusModel) {
                    $dbStatusId = $statusModel->id;
                }
            }
        }

        $updateData = [
            'lifecycle_status' => $lifecycleStatus,
            'case_status_id' => $dbStatusId,
            'handled_by_id' => \Illuminate\Support\Facades\Auth::id() // Accountability Fix
        ];

        if ($referralAgencyId) {
            // Ensure a referral record exists for this agency on this case.
            $existingReferral = \App\Models\CaseReferral::where('case_report_id', $case->id)
                ->where('agency_id', $referralAgencyId)
                ->first();

            if (!$existingReferral) {
                \App\Models\CaseReferral::create([
                    'case_report_id' => $case->id,
                    'agency_id' => $referralAgencyId,
                    'referred_at' => now(),
                    'referral_notes' => $referralNotes,
                    'handled_by_id' => \Illuminate\Support\Facades\Auth::id(),
                    'status' => $referralStatus ?? 'Pending',
                    'agency_feedback' => $agencyFeedback,
                ]);
            } else {
                $referralUpdate = [];
                if ($referralNotes !== null) {
                    $referralUpdate['referral_notes'] = $referralNotes;
                }
                if ($referralStatus !== null) {
                    $referralUpdate['status'] = $referralStatus;
                }
                if ($agencyFeedback !== null) {
                    $referralUpdate['agency_feedback'] = $agencyFeedback;
                }

                if (!empty($referralUpdate)) {
                    $existingReferral->update($referralUpdate);
                }
            }
        }

        return $case->update($updateData);
    }
}
