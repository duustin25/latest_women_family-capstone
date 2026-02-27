<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CaseReport;

class PublicServicesController extends Controller
{
    public function vawc()
    {
        return Inertia::render('Public/VAWC/Index');
    }

    public function bcpc()
    {
        return Inertia::render('Public/BCPC/Index');
    }

    public function officials()
    {
        $officials = \App\Models\BarangayOfficial::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return Inertia::render('Public/Officials/Index', [
            'head' => $officials->where('level', 'head')->first(),
            'secretary' => $officials->where('level', 'secretary')->first(),
            'staff' => $officials->where('level', 'staff')->values()->all()
        ]);
    }

    public function vawcReport()
    {
        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)->whereIn('category', ['VAWC', 'Both'])->get();
        return Inertia::render('Public/VAWC/Report', [
            'abuseTypes' => $abuseTypes
        ]);
    }

    public function storeVawcReport(Request $request)
    {
        $validated = $request->validate([
            'victim_name' => 'required|string|max:255',
            'victim_age' => 'nullable|string|max:255',
            'complainant_name' => 'nullable|string|max:255',
            'complainant_contact' => 'nullable|string|max:255',
            'relation_to_victim' => 'nullable|string|max:255',
            'incident_date' => 'required|date',
            'abuse_type' => 'nullable|string|max:255',
            'incident_location' => 'required|string|max:255',
            'description' => 'required|string',
            'is_anonymous' => 'boolean',
            'evidence' => 'nullable|file|mimes:jpg,jpeg,png,pdf,mp3,wav|max:10240', // 10MB limit
        ]);

        $reportData = [
            'type' => 'VAWC',
            'case_number' => 'VAWC-' . date('Ymd') . '-' . rand(1000, 9999),
            'victim_name' => $validated['victim_name'],
            'victim_age' => $validated['victim_age'],
            'complainant_name' => $validated['complainant_name'],
            'complainant_contact' => $validated['complainant_contact'],
            'relation_to_victim' => $validated['relation_to_victim'],
            'incident_date' => $validated['incident_date'],
            'incident_location' => $validated['incident_location'],
            'description' => $validated['description'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
        ];

        // Map String abuse type to ID
        if (!empty($validated['abuse_type'])) {
            $abuseTypeModel = \App\Models\CaseAbuseType::where('name', trim($validated['abuse_type']))->first();
            if ($abuseTypeModel) {
                $reportData['abuse_type_id'] = $abuseTypeModel->id;
            }
        }

        // Setup Initial Status
        $initialStatus = \App\Models\CaseStatus::where('name', 'Pending Review')->first();
        if ($initialStatus) {
            $reportData['case_status_id'] = $initialStatus->id;
        }

        // Handle File Upload
        if ($request->hasFile('evidence')) {
            $path = $request->file('evidence')->store('evidence', 'local');
            $reportData['evidence_path'] = $path;
        }

        CaseReport::create($reportData);

        return back()->with('success', 'Report submitted safely.');
    }

    public function bcpcReport()
    {
        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)->whereIn('category', ['BCPC', 'Both'])->get();
        return Inertia::render('Public/BCPC/Report', [
            'abuseTypes' => $abuseTypes
        ]);
    }

    public function storeBcpcReport(Request $request)
    {
        $validated = $request->validate([
            'concern_type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'victim_name' => 'nullable|string|max:255',
            'victim_age' => 'nullable|numeric',
            'victim_gender' => 'nullable|string|in:Male,Female',
            'informant_name' => 'nullable|string|max:255',
            'informant_contact' => 'nullable|string|max:255',
            'is_anonymous' => 'boolean',
        ]);

        $reportData = [
            'type' => 'BCPC',
            'case_number' => 'BCPC-' . date('Ymd') . '-' . rand(1000, 9999),
            'victim_name' => $validated['victim_name'],
            'victim_age' => $validated['victim_age'],
            'victim_gender' => $validated['victim_gender'],
            'complainant_name' => $validated['informant_name'],
            'complainant_contact' => $validated['informant_contact'],
            'incident_date' => now(), // Assume reported now if not explicitly passed
            'incident_location' => $validated['location'],
            'description' => $validated['description'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
        ];

        // Map String concern_type to ID
        if (!empty($validated['concern_type'])) {
            $abuseTypeModel = \App\Models\CaseAbuseType::where('name', trim($validated['concern_type']))->first();
            if ($abuseTypeModel) {
                $reportData['abuse_type_id'] = $abuseTypeModel->id;
            }
        }

        // Setup Initial Status
        $initialStatus = \App\Models\CaseStatus::where('name', 'Pending Review')->first();
        if ($initialStatus) {
            $reportData['case_status_id'] = $initialStatus->id;
        }

        CaseReport::create($reportData);

        return back()->with('success', 'Concern reported successfully.');
    }

    public function gad()
    {
        $activities = \App\Models\GadActivity::whereIn('status', ['Ongoing', 'Completed', 'Planned'])
            ->orderBy('date_scheduled', 'desc')
            ->orderByRaw("FIELD(status, 'Ongoing', 'Completed', 'Planned')")
            ->take(6)
            ->get();

        $totalProjects = \App\Models\GadActivity::where('status', 'Completed')->count();
        $totalBudgetUtilized = \App\Models\GadActivity::where('status', 'Completed')->sum('actual_expenditure');

        return Inertia::render('Public/GAD/Index', [
            'activities' => $activities,
            'stats' => [
                'projects' => $totalProjects,
                'budget' => $totalBudgetUtilized,
                'beneficiaries' => 0
            ]
        ]);
    }

    public function gadRegister()
    {
        $organization = \App\Models\Organization::where('slug', 'kalipi-association')->firstOrFail();
        return Inertia::render('Public/GAD/Register', [
            'organization' => $organization
        ]);
    }

    public function storeMembershipApplication(Request $request, \App\Services\MembershipService $service)
    {
        try {
            $service->submitApplication($request->all());
            return back()->with('success', 'Application received. Pending verification.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return back()->with('error', 'Something went wrong: ' . $e->getMessage());
        }
    }
    public function laws()
    {
        return Inertia::render('Public/Laws');
    }
}