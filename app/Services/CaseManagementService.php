<?php

namespace App\Services;

use App\Models\CaseReport;
use App\Models\CaseAbuseType;
use App\Models\CaseStatus;
use App\Models\CaseReferralAgency;

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
    public function updateStatus(CaseReport $case, string $uiStatus, ?string $referralNotes = null): bool
    {
        $dbStatusId = null;
        $referralAgencyId = null;
        $lifecycleStatus = $case->lifecycle_status;

        if (str_starts_with($uiStatus, 'Referred: ')) {
            $lifecycleStatus = 'Referred';

            // Find Agency
            $agencyName = trim(substr($uiStatus, 10));
            $agency = CaseReferralAgency::where('name', $agencyName)->first();
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
            'referral_agency_id' => $referralAgencyId
        ];

        // Explicitly clear or set the referral mapping to prevent phantom links
        if ($referralAgencyId) {
            // Only update referral date if it just transitioned to this referral
            if (!$case->referral_agency_id || $case->referral_agency_id != $referralAgencyId) {
                $updateData['referral_date'] = now();
            }
        } else {
            $updateData['referral_date'] = null;
        }

        if ($referralNotes !== null) {
            $updateData['referral_notes'] = $referralNotes;
        }

        return $case->update($updateData);
    }
}
