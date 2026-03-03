<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\CaseReportResource;
use App\Http\Requests\Admin\StoreCaseRequest;
use App\Services\CaseManagementService;

class CaseController extends Controller
{
    /**
     * Print the specified resource.
     */
    public function print($id, Request $request)
    {
        $case = CaseReport::with(['abuseType', 'status', 'referrals.agency'])->findOrFail($id);

        return Inertia::render('Admin/Cases/Print', [
            'caseData' => $case,
            'type' => $case->type
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CaseReport::query();

        // Fetch all cases directly from unified model
        $cases = $query->with(['abuseType', 'status', 'referrals.agency'])->orderByDesc('created_at')->get();

        $caseStatuses = \App\Models\CaseStatus::where('is_active', true)->pluck('name');

        return Inertia::render('Admin/Cases/Index', [
            'cases' => CaseReportResource::collection($cases),
            'caseStatuses' => $caseStatuses,
            'filters' => $request->only(['search', 'type', 'status'])
        ]);
    }

    /**
     * Display a listing of the archived (soft deleted) resource.
     */
    public function archive(Request $request)
    {
        $query = CaseReport::onlyTrashed();

        $cases = $query->with(['abuseType', 'status', 'referrals.agency'])->orderByDesc('deleted_at')->get();

        $caseStatuses = \App\Models\CaseStatus::where('is_active', true)->pluck('name');

        return Inertia::render('Admin/Cases/Archive', [
            'cases' => CaseReportResource::collection($cases),
            'caseStatuses' => $caseStatuses,
            'filters' => $request->only(['search', 'type', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $type = $request->query('type', 'VAWC');

        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)
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
    public function store(StoreCaseRequest $request, CaseManagementService $service)
    {
        $service->createCase($request->validated(), $request->input('type'));

        return redirect()->route('admin.cases.index')->with('success', 'Case created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id, Request $request)
    {
        $case = CaseReport::with(['abuseType', 'status', 'referrals.agency'])->findOrFail($id);

        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->where(function ($query) use ($case) {
                $query->where('category', $case->type)
                    ->orWhere('category', 'Both');
            })->get();

        $referralPartners = \App\Models\CaseReferralAgency::where('is_active', true)
            ->where(function ($query) use ($case) {
                $query->where('category', $case->type)
                    ->orWhere('category', 'Both');
            })->get();

        $caseStatuses = \App\Models\CaseStatus::where('is_active', true)
            ->where(function ($query) use ($case) {
                $query->where('type', $case->type)
                    ->orWhere('type', 'Both');
            })->orderBy('name')->get();

        return Inertia::render('Admin/Cases/Edit', [
            'caseData' => $case,
            'abuseTypes' => $abuseTypes,
            'referralPartners' => $referralPartners,
            'caseStatuses' => $caseStatuses
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id, CaseManagementService $service)
    {
        $case = CaseReport::findOrFail($id);

        $service->updateStatus(
            $case,
            $request->input('status'),
            $request->input('referral_notes'),
            $request->input('referral_status'),
            $request->input('agency_feedback')
        );

        return redirect()->route('admin.cases.index')->with('success', 'Case status updated.');
    }

    /**
     * Remove the specified resource from storage (Soft Delete).
     */
    public function destroy($id, Request $request)
    {
        CaseReport::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Case archived successfully.');
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id, Request $request)
    {
        CaseReport::withTrashed()->findOrFail($id)->restore();
        return redirect()->back()->with('success', 'Case restored successfully.');
    }
}
