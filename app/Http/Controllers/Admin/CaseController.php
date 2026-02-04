<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BcpcReport;
use App\Models\VawcReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Fetch all cases from both models
        $vawcCases = VawcReport::all()->map(function ($case) {
            return [
                'id' => $case->id,
                'case_number' => $case->case_number,
                'name' => $case->victim_name ?? 'Anonymous',
                'type' => 'VAWC',
                'subType' => $case->abuse_type ?? 'N/A', // e.g. Physical, Sexual
                'status' => $case->status,
                'date' => $case->incident_date ? $case->incident_date->format('Y-m-d') : $case->created_at->format('Y-m-d'),
                'referred_to' => $case->referral_to,
                'created_at' => $case->created_at,
            ];
        });

        $bcpcCases = BcpcReport::all()->map(function ($case) {
            return [
                'id' => $case->id,
                'case_number' => $case->case_number,
                'name' => $case->victim_name ?? $case->informant_name ?? 'Anonymous',
                'type' => 'BCPC', // Using BCPC for consistency, mapping CPP in UI if needed
                'subType' => $case->concern_type ?? 'N/A', // e.g. CICL, Abuse
                'status' => $case->status,
                'date' => $case->created_at->format('Y-m-d'), // BCPC might separate incident vs report date
                'referred_to' => $case->referral_to,
                'created_at' => $case->created_at,
            ];
        });

        // Merge and Sort by Date Descending
        $allCases = $vawcCases->concat($bcpcCases)->sortByDesc('created_at')->values();

        return Inertia::render('Admin/Cases/Index', [
            'cases' => $allCases
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $type = $request->query('type', 'VAWC');

        // Fetch dynamic abuse types for VAWC
        $abuseTypes = \App\Models\AbuseType::where('is_active', true)->get();

        return Inertia::render('Admin/Cases/Create', [
            'type' => $type,
            'abuseTypes' => $abuseTypes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $type = $request->input('type');

        if ($type === 'VAWC') {
            $validated = $request->validate([
                'victim_name' => 'required|string',
                'victim_age' => 'nullable|numeric',
                'complainant_name' => 'nullable|string',
                'abuse_type' => 'required|string', // Physical, Sexual, etc.
                'incident_date' => 'required|date',
                'incident_location' => 'required|string',
                'description' => 'required|string',
                'status' => 'nullable|string', // Admin might set initial status
            ]);

            // Auto-generate Case Number
            $validated['case_number'] = 'VAWC-' . date('Ymd') . '-' . rand(1000, 9999);
            $validated['status'] = 'New';

            // Sanitize abuse type
            $validated['abuse_type'] = trim($validated['abuse_type']);

            VawcReport::create($validated);

        } elseif ($type === 'BCPC' || $type === 'CPP') {
            $validated = $request->validate([
                'victim_name' => 'nullable|string',
                'victim_age' => 'nullable|numeric',
                'victim_gender' => 'nullable|string',
                'concern_type' => 'required|string', // Abuse, Abandonment, CICL
                'location' => 'required|string',
                'description' => 'required|string',
                'informant_name' => 'nullable|string',
                'status' => 'nullable|string',
            ]);

            $validated['case_number'] = 'BCPC-' . date('Ymd') . '-' . rand(1000, 9999);
            $validated['status'] = 'New';

            BcpcReport::create($validated);
        }

        return redirect()->route('admin.cases.index')->with('success', 'Case created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id, Request $request)
    {
        $type = $request->query('type');

        $case = null;
        if ($type === 'VAWC') {
            $case = VawcReport::findOrFail($id);
            $case->type = 'VAWC';
        } else {
            // Assume BCPC if not VAWC or explicit
            $case = BcpcReport::findOrFail($id);
            $case->type = 'BCPC';
        }

        return Inertia::render('Admin/Cases/Edit', [
            'caseData' => $case
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // "Smart Status" Adapter Logic
        // UI sends a "process_step" (e.g., "BPO Issued", "Referred: PNP")
        // We map this to DB status columns.

        $type = $request->input('type', 'VAWC'); // Start with default or input
        $uiStatus = $request->input('status'); // The long string from UI dropdown

        $dbStatus = 'ongoing'; // Default fallback
        $referralTo = null;

        // Map UI Status to DB Status
        switch ($uiStatus) {
            case 'Intake/New':
                $dbStatus = 'New';
                break;
            case 'Under Mediation':
                $dbStatus = 'ongoing';
                break;
            case 'BPO Issued':
                $dbStatus = 'ongoing';
                // In a real app, we might log "BPO Issued" in an activity log or remarks
                break;
            case 'Referred: PNP':
                $dbStatus = 'referred';
                $referralTo = 'PNP';
                break;
            case 'Referred: DSWD':
                $dbStatus = 'referred';
                $referralTo = 'DSWD';
                break;
            case 'Referred: Medical':
                $dbStatus = 'referred';
                $referralTo = 'Medical';
                break;
            case 'Resolved':
                $dbStatus = 'Resolved';
                break;
            case 'Closed':
                $dbStatus = 'Closed';
                break;
            default:
                $dbStatus = 'ongoing';
        }

        $updateData = [
            'status' => $dbStatus,
        ];

        if ($referralTo) {
            $updateData['referral_to'] = $referralTo;
            $updateData['referral_date'] = now();
        }

        if ($type === 'VAWC') {
            $case = VawcReport::findOrFail($id);
            $case->update($updateData);
        } else {
            $case = BcpcReport::findOrFail($id);
            $case->update($updateData);
        }

        return redirect()->route('admin.cases.index')->with('success', 'Case status updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Optional: Implement delete
    }
}
