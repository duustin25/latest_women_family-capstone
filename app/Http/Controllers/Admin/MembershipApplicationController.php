<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MembershipApplication;
use App\Http\Resources\MembershipApplicationResource;
use Illuminate\Http\Request;
use App\Models\Organization;
use Inertia\Inertia;

class MembershipApplicationController extends Controller
{
    /**
     * Display a listing of all membership applications.
     */
    public function index(Request $request, \App\Services\MembershipService $service)
    {
        // RBAC: Use Service to scope applications (President sees only their Org, Admin sees all)
        // Pass query params as filters
        $filters = $request->only(['search', 'status', 'organization_id']);
        $applications = $service->getScopedApplications($request->user(), $filters);

        // Fetch organizations for filter dropdown
        $organizations = Organization::orderBy('name')->get();

        return Inertia::render('Admin/Applications/Index', [
            'applications' => MembershipApplicationResource::collection($applications),
            'filters' => $filters,
            'organizations' => $organizations
        ]);
    }

    public function create()
    {
        $organizations = Organization::orderBy('name')->get();

        // Ensure this matches: resources/js/Pages/Admin/Applications/Create.tsx
        return Inertia::render('Admin/Applications/Create', [
            'organizations' => $organizations
        ]);
    }

    /**
     * Display the specific application for review.
     */
    // Inside MembershipApplicationController.php
    public function show(MembershipApplication $application)
    {
        $application->load('organization');

        $view = match ($application->organization->slug) {
            'kalipi' => 'Admin/Applications/ReviewKalipi',
            'solo-parents' => 'Admin/Applications/ReviewSoloParent',
            default => 'Admin/Applications/ReviewGeneral',
        };

        return Inertia::render($view, [
            'application' => new MembershipApplicationResource($application),
            'mode' => 'admin'
        ]);
    }



    /**
     * Update the status of the application (Approve/Disapprove).
     */
    public function updateStatus(Request $request, MembershipApplication $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:Approved,Disapproved',
        ]);

        $application->update([
            'status' => $validated['status'],
            'approved_by' => auth()->user()->name, // Track which admin actioned this
            'actioned_at' => now(),
        ]);

        return redirect()->route('admin.applications.index')
            ->with('success', "Application has been {$validated['status']}.");
    }

    /**
     * Print the application in an official layout.
     */
    public function print(MembershipApplication $application)
    {
        $application->load(['organization']);

        return Inertia::render('Admin/Applications/Print', [
            'application' => new MembershipApplicationResource($application),
            'organization' => new \App\Http\Resources\OrganizationResource($application->organization),
        ]);
    }

    /**
     * Show the form for editing the application.
     */
    public function edit(MembershipApplication $application)
    {
        $application->load('organization');

        // Use specific form for KALIPI corrections
        if ($application->organization->slug === 'kalipi') {
            return Inertia::render('Public/Organizations/Apply/KalipiForm', [
                'organization' => $application->organization,
                'mode' => 'admin-edit',
                'application' => $application
            ]);
        }

        return Inertia::render('Admin/Applications/Edit', [
            'application' => new MembershipApplicationResource($application),
            'organization' => new \App\Http\Resources\OrganizationResource($application->organization),
        ]);
    }

    /**
     * Update the application data.
     */
    public function update(Request $request, MembershipApplication $application)
    {
        // 1. Validate Basic Info
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            // We allow updating the JSON blobs directly if needed, or specific fields
            'personal_data' => 'nullable|array',
            'family_data' => 'nullable|array',
            // 'submission_data' => 'nullable|array', // Usually fixed requirements
        ]);

        // 2. Update the record
        $application->update($validated);

        // 3. Log the "Edit" action in Audit Logs (Optional but recommended)
        // \App\Models\AuditLog::create([ ... ]); 
        // For now, we rely on the system user knowing they did it. 
        // If you have a specific Audit Service, call it here.

        return redirect()->route('admin.applications.show', $application->id)
            ->with('success', 'Application details updated successfully.');
    }
}