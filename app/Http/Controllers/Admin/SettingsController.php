<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseAbuseType;
use App\Models\Agency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $abuseTypes = CaseAbuseType::orderBy('category')->orderBy('name')->get();
        $referralPartners = Agency::orderBy('category')->orderBy('name')->get();
        $caseStatuses = \App\Models\CaseStatus::orderBy('name')->get();
        $zones = \App\Models\Zone::orderBy('name')->get();

        return Inertia::render('Admin/Settings/Index', [
            'abuseTypes' => $abuseTypes,
            'referralPartners' => $referralPartners,
            'caseStatuses' => $caseStatuses,
            'zones' => $zones
        ]);
    }

    public function storeAbuseType(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:case_types,name',
            'category' => 'required|string|in:VAWC,BCPC,Both',
            'color' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        CaseAbuseType::create($validated);

        return back()->with('success', 'Abuse Type added successfully.');
    }

    public function updateAbuseType(Request $request, $id)
    {
        $type = CaseAbuseType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|unique:case_types,name,' . $id,
            'category' => 'sometimes|required|string|in:VAWC,BCPC,Both',
            'color' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $type->update($validated);

        return back()->with('success', 'Abuse Type updated.');
    }

    public function storeReferralPartner(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string|in:VAWC,BCPC,Both',
            'contact_info' => 'nullable|string',
        ]);

        Agency::create($validated);

        return back()->with('success', 'Partner added successfully.');
    }

    public function updateReferralPartner(Request $request, $id)
    {
        $partner = Agency::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|in:VAWC,BCPC,Both',
            'contact_info' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $partner->update($validated);

        return back()->with('success', 'Partner updated.');
    }

    public function storeCaseStatus(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:case_status,name',
            'description' => 'nullable|string',
            'type' => 'required|in:VAWC,BCPC,Both',
            'is_active' => 'boolean'
        ]);

        \App\Models\CaseStatus::create($validated);

        return back()->with('success', 'Status added successfully.');
    }

    public function updateCaseStatus(Request $request, $id)
    {
        $status = \App\Models\CaseStatus::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|unique:case_status,name,' . $id,
            'description' => 'nullable|string',
            'type' => 'required|in:VAWC,BCPC,Both',
            'is_active' => 'boolean'
        ]);

        $status->update($validated);

        return back()->with('success', 'Status updated.');
    }

    public function storeZone(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:zones,name',
        ]);

        \App\Models\Zone::create($validated);

        return back()->with('success', 'Zone added successfully.');
    }

    public function updateZone(Request $request, $id)
    {
        $zone = \App\Models\Zone::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|unique:zones,name,' . $id,
            'is_active' => 'boolean'
        ]);

        $zone->update($validated);

        return back()->with('success', 'Zone updated.');
    }
}
