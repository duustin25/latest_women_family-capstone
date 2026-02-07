<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $abuseTypes = \App\Models\AbuseType::where('is_active', true)->get();
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

        $validated['case_number'] = 'VAWC-' . date('Ymd') . '-' . rand(1000, 9999);
        $validated['status'] = 'New';

        // Handle File Upload
        if ($request->hasFile('evidence')) {
            // Store in 'private' disk (storage/app/private/evidence) for security
            // Or 'local' if you don't have private disk configured yet, but ensure it's not in public/
            $path = $request->file('evidence')->store('evidence', 'local');
            $validated['evidence_path'] = $path;
        }

        \App\Models\VawcReport::create($validated);

        return back()->with('success', 'Report submitted safely.');
    }

    public function bcpcReport()
    {
        return Inertia::render('Public/BCPC/Report');
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

        $validated['case_number'] = 'BCPC-' . date('Ymd') . '-' . rand(1000, 9999);
        $validated['status'] = 'New';

        \App\Models\BcpcReport::create($validated);

        return back()->with('success', 'Concern reported successfully.');
    }

    public function gad()
    {
        // Fetch GAD Activities for public view (Ongoing or Completed, ordered by date)
        $activities = \App\Models\GadActivity::whereIn('status', ['Ongoing', 'Completed', 'Planned'])
            ->orderBy('date_scheduled', 'desc')
            ->orderByRaw("FIELD(status, 'Ongoing', 'Completed', 'Planned')") // show ongoing first, then planned, then completed
            ->take(6) // Limit to 6 for the public view
            ->get();

        // Transparency Stats
        $totalProjects = \App\Models\GadActivity::where('status', 'Completed')->count();
        $totalBudgetUtilized = \App\Models\GadActivity::where('status', 'Completed')->sum('actual_expenditure');

        return Inertia::render('Public/GAD/Index', [
            'activities' => $activities,
            'stats' => [
                'projects' => $totalProjects,
                'budget' => $totalBudgetUtilized,
                'beneficiaries' => 0 // Placeholder as we don't track this yet
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
        // Controller only handles HTTP request/response
        // Service handles Validation + Logic + Database

        try {
            $service->submitApplication($request->all());
            return back()->with('success', 'Application received. Pending verification.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e; // Let Laravel handle validation errors
        } catch (\Exception $e) {
            return back()->with('error', 'Something went wrong: ' . $e->getMessage());
        }
    }
    public function laws()
    {
        return Inertia::render('Public/Laws');
    }
}