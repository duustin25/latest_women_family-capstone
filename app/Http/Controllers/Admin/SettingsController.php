<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbuseType;
use App\Models\ReferralPartner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $abuseTypes = AbuseType::orderBy('category')->orderBy('name')->get();
        $referralPartners = ReferralPartner::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/Settings/Index', [
            'abuseTypes' => $abuseTypes,
            'referralPartners' => $referralPartners
        ]);
    }

    public function storeAbuseType(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:abuse_types,name',
            'category' => 'required|string|in:VAWC,BCPC,Both',
            'color' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        AbuseType::create($validated);

        return back()->with('success', 'Abuse Type added successfully.');
    }

    public function updateAbuseType(Request $request, $id)
    {
        $type = AbuseType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|unique:abuse_types,name,' . $id,
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

        ReferralPartner::create($validated);

        return back()->with('success', 'Partner added successfully.');
    }

    public function updateReferralPartner(Request $request, $id)
    {
        $partner = ReferralPartner::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|in:VAWC,BCPC,Both',
            'contact_info' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $partner->update($validated);

        return back()->with('success', 'Partner updated.');
    }
}
