<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\MembershipApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MembershipController extends Controller
{
    private function getContext(): string
    {
        return Auth::check() ? 'admin' : 'public';
    }

    public function create(Organization $organization)
    {
        $view = match ($organization->slug) {
            'kalipi', 'kaliping-pilipina' => 'Public/Organizations/Apply/KalipiForm',
            'solo-parents' => 'Public/Organizations/Apply/SoloParentForm',
            default => 'Public/Organizations/Apply/GeneralForm',
        };

        return Inertia::render($view, [
            'organization' => $organization,
            'mode' => $this->getContext()
        ]);
    }

    public function store(Request $request, Organization $organization)
    {
        $isAdmin = Auth::check();

        // 1. DUPLICATE CHECK (Must be BEFORE creation)
        $exists = $organization->membershipApplications()
            ->where('fullname', $request->fullname)
            ->where('status', 'Pending')
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'fullname' => 'An active pending application already exists for this name.'
            ]);
        }

        // 2. VALIDATION
        $rules = [
            'fullname' => 'required|string|max:255',
            'address' => 'required|string',
            'personal_data' => 'nullable|array',
            'family_data' => 'nullable|array',
        ];

        // Dynamic Validation Logic
        if (!empty($organization->form_schema)) {
            foreach ($organization->form_schema as $field) {
                // Determine validation rules for this field
                $fieldRules = [];

                if (!empty($field['required'])) {
                    $fieldRules[] = 'required';
                } else {
                    $fieldRules[] = 'nullable';
                }

                // Type-based rules
                switch ($field['type']) {
                    case 'number':
                        $fieldRules[] = 'numeric';
                        break;
                    case 'date':
                        $fieldRules[] = 'date';
                        break;
                    case 'text':
                    case 'textarea':
                    default:
                        $fieldRules[] = 'string';
                        break;
                    case 'checkbox':
                        $fieldRules[] = 'boolean';
                        break;
                }

                // Add to rules array using dot notation for JSON validation
                // e.g., 'personal_data.Mother Name' => 'required|string'
                $rules['personal_data.' . $field['label']] = implode('|', $fieldRules);
            }
        }

        $validated = $request->validate($rules);


        // 3. PERSISTENCE
        $organization->membershipApplications()->create([
            'fullname' => $validated['fullname'],
            'address' => $validated['address'],
            'personal_data' => $validated['personal_data'] ?? [],
            'family_data' => $validated['family_data'] ?? [],
            'status' => $isAdmin ? 'Approved' : 'Pending',
            'approved_by' => $isAdmin ? Auth::user()->name : null,
            'actioned_at' => $isAdmin ? now() : null,
        ]);

        // 4. FLASH MESSAGE REDIRECT
        // The ->with('success', ...) sends data to the next page's props.flash
        if ($isAdmin) {
            return redirect()->route('admin.applications.index')
                ->with('success', 'Manual record for ' . $validated['fullname'] . ' has been registered.');
        }

        return redirect()->route('public.organizations.show', $organization->slug)
            ->with('success', 'Application Submitted! Please wait for Barangay verification.');
    }
}