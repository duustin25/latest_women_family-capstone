<?php

namespace App\Services;

use App\Models\Organization;

class ChatbotService
{
    /**
     * Process a user query and return a smart response.
     */
    public function processQuery(string $query): string
    {
        $query = strtolower($query);

        // 1. Identify Intent: "Join" or "Requirements"
        if (str_contains($query, 'join') || str_contains($query, 'requirements') || str_contains($query, 'apply')) {
            return $this->handleMembershipQuery($query);
        }

        // 2. Identify Intent: "VAWC" or "Report"
        if (str_contains($query, 'vawc') || str_contains($query, 'abuse') || str_contains($query, 'report')) {
            return "To report a VAWC case, please click the red 'Emergency' button or navigate to the VAWC Services page. Your safety is our priority. All reports are confidential.";
        }

        // Default Fallback
        return "I'm here to help with Barangay Services. You can ask me about joining organizations (like KALIPI) or how to file a VAWC report.";
    }

    private function handleMembershipQuery(string $query): string
    {
        // Search for organization mention
        $organizations = Organization::all();
        $targetOrg = null;

        foreach ($organizations as $org) {
            if (str_contains($query, strtolower($org->name)) || str_contains($query, strtolower($org->slug))) {
                $targetOrg = $org;
                break;
            }
        }

        if (!$targetOrg) {
            return "Which organization would you like to join? We have KALIPI, Solo Parents, ERPAT, and more. Please specify.";
        }

        // Construct response from Database JSON
        $reqs = $targetOrg->requirements; // Array from JSON
        $reqList = "Basic requirements";

        if (is_array($reqs) && count($reqs) > 0) {
            $reqList = implode(", ", $reqs);
        }

        return "To join {$targetOrg->name}, you need to submit the following: {$reqList}. You can apply directly through this website!";
    }
}
