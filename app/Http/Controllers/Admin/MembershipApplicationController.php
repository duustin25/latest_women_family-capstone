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
        $applications = $service->getScopedApplications($request->user());

        return Inertia::render('Admin/Applications/Index', [
            'applications' => MembershipApplicationResource::collection($applications),
            'filters' => $request->only(['search'])
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
}