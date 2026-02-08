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
     * Print the specified resource.
     */
    public function print($id, Request $request)
    {
        $type = $request->query('type', 'VAWC');

        $case = null;
        if ($type === 'VAWC') {
            $case = VawcReport::findOrFail($id);
            $case->type = 'VAWC';
        } else {
            $case = BcpcReport::findOrFail($id);
            $case->type = 'BCPC';
        }

        return Inertia::render('Admin/Cases/Print', [
            'caseData' => $case,
            'type' => $type
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $showArchived = $request->query('archived') === 'true';

        // Helper to query with trashed if archived mode is on
        $vawcQuery = $showArchived ? VawcReport::onlyTrashed() : VawcReport::query();
        $bcpcQuery = $showArchived ? BcpcReport::onlyTrashed() : BcpcReport::query();

        // Fetch all cases from both models
        $vawcCases = $vawcQuery->get()->map(function ($case) {
            return [
                'id' => $case->id,
                'case_number' => $case->case_number,
                'name' => $case->victim_name ?? 'Anonymous',
                'type' => 'VAWC',
                'subType' => $case->abuse_type ?? 'N/A', // e.g. Physical, Sexual
                'status' => $case->status,
                'date' => $case->incident_date ? $case->incident_date->format('M d, Y') : $case->created_at->format('M d, Y'),
                'time' => $case->created_at->format('h:i A'),
                'referred_to' => $case->referral_to,
                'created_at' => $case->created_at,
                'deleted_at' => $case->deleted_at,
            ];
        });

        $bcpcCases = $bcpcQuery->get()->map(function ($case) {
            return [
                'id' => $case->id,
                'case_number' => $case->case_number,
                'name' => $case->victim_name ?? $case->informant_name ?? 'Anonymous',
                'type' => 'BCPC',
                'subType' => $case->concern_type ?? 'N/A', // e.g. CICL, Abuse
                'status' => $case->status,
                'date' => $case->created_at->format('M d, Y'),
                'time' => $case->created_at->format('h:i A'),
                'referred_to' => $case->referral_to,
                'created_at' => $case->created_at,
                'deleted_at' => $case->deleted_at,
            ];
        });

        // Merge and Sort by Date Descending
        $allCases = $vawcCases->concat($bcpcCases)->sortByDesc('created_at')->values();

        $ongoingStatuses = \App\Models\OngoingStatus::where('is_active', true)->pluck('name');

        return Inertia::render('Admin/Cases/Index', [
            'cases' => $allCases,
            'ongoingStatuses' => $ongoingStatuses,
            'filters' => $request->only(['archived', 'search', 'type', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $type = $request->query('type', 'VAWC');

        // Fetch dynamic abuse types for VAWC/BCPC
        $abuseTypes = \App\Models\AbuseType::where('is_active', true)
            ->where(function ($query) use ($type) {
                $query->where('category', $type)
                    ->orWhere('category', 'Both');
            })->get();

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
                'complainant_contact' => 'nullable|string',
                'relation_to_victim' => 'nullable|string',
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
                'informant_contact' => 'nullable|string',
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

        $abuseTypes = \App\Models\AbuseType::where('is_active', true)
            ->where(function ($query) use ($case) {
                $query->where('category', $case->type) // Assumes case->type is VAWC/BCPC
                    ->orWhere('category', 'Both');
            })->get();

        $referralPartners = \App\Models\ReferralPartner::where('is_active', true)
            ->where(function ($query) use ($case) {
                $query->where('category', $case->type)
                    ->orWhere('category', 'Both');
            })->get();

        $ongoingStatuses = \App\Models\OngoingStatus::where('is_active', true)
            ->where(function ($query) use ($case) {
                $query->where('type', $case->type)
                    ->orWhere('type', 'Both');
            })->orderBy('name')->get();

        return Inertia::render('Admin/Cases/Edit', [
            'caseData' => $case,
            'abuseTypes' => $abuseTypes,
            'referralPartners' => $referralPartners,
            'ongoingStatuses' => $ongoingStatuses
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
        if (str_starts_with($uiStatus, 'Referred: ')) {
            $dbStatus = 'referred';
            $referralTo = trim(substr($uiStatus, 10)); // Extract after "Referred: "
        } elseif (str_starts_with($uiStatus, 'Ongoing: ')) {
            // Remove the prefix to get the actual status name
            $cleanStatus = trim(substr($uiStatus, 9)); // Extract after "Ongoing: "
            // Check dynamic statuses first
            $dynamicStatus = \App\Models\OngoingStatus::where('name', $cleanStatus)->exists(); // Removed is_active check here to allow setting existing but disabled statuses back if needed, or strictly check active? Let's check exists first.

            if ($dynamicStatus) {
                $dbStatus = $cleanStatus;
            } else {
                $dbStatus = $cleanStatus; // Fallback to saving it as is if it looks like a custom ongoing status
            }
        } else {
            // Check dynamic statuses first (legacy fallback if no prefix sent)
            $dynamicStatus = \App\Models\OngoingStatus::where('name', $uiStatus)->exists();

            if ($dynamicStatus) {
                $dbStatus = $uiStatus; // Save the specific status e.g. "BPO Monitoring"
            } else {
                switch ($uiStatus) {
                    case 'Intake/New':
                        $dbStatus = 'New';
                        break;
                    // case 'Under Mediation': // Keep legacy support
                    // case 'Intervention/Diversion Program':
                    // case 'BPO Issued':
                    //$dbStatus = $uiStatus; // Save specific for these too now? Or map to ongoing? 
                    // Let's save specific to enable specific tracking as requested
                    // break;
                    case 'Resolved':
                        $dbStatus = 'Resolved';
                        break;
                    case 'Closed':
                        $dbStatus = 'Closed';
                        break;
                    case 'Dismissed':
                        $dbStatus = 'Dismissed';
                        break;
                    default:
                        $dbStatus = 'ongoing';
                }
            }
        }

        $updateData = [
            'status' => $dbStatus,
        ];

        if ($referralTo) {
            $updateData['referral_to'] = $referralTo;
            $updateData['referral_date'] = now();
        }

        if ($request->has('referral_notes')) {
            $updateData['referral_notes'] = $request->input('referral_notes');
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
    /**
     * Remove the specified resource from storage (Soft Delete).
     */
    public function destroy($id, Request $request)
    {
        $type = $request->query('type');

        if ($type === 'VAWC') {
            VawcReport::findOrFail($id)->delete();
        } else {
            BcpcReport::findOrFail($id)->delete();
        }

        return redirect()->back()->with('success', 'Case archived successfully.');
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id, Request $request)
    {
        $type = $request->query('type');

        if ($type === 'VAWC') {
            VawcReport::withTrashed()->findOrFail($id)->restore();
        } else {
            BcpcReport::withTrashed()->findOrFail($id)->restore();
        }

        return redirect()->back()->with('success', 'Case restored successfully.');
    }
}
