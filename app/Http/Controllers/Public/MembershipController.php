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
        // Default to dynamic form
        $view = 'Public/Organizations/Apply/DynamicForm';

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

        // 2. BASE VALIDATION RULES
        $rules = [
            'fullname' => 'required|string|max:255',
            'address' => 'required|string',
            'submission_data' => 'nullable|array', // New JSON column
        ];

        // 3. DYNAMIC VALIDATION LOGIC
        if (!empty($organization->form_schema)) {
            foreach ($organization->form_schema as $field) {
                // Determine validation rules for this field
                $fieldRules = [];

                if (!empty($field['required']) && $field['required'] == true) {
                    $fieldRules[] = 'required';
                } else {
                    $fieldRules[] = 'nullable';
                }

                // Type-based rules
                switch ($field['type']) {
                    case 'email':
                        $fieldRules[] = 'email:rfc,dns';
                        break;
                    case 'number':
                        $fieldRules[] = 'numeric';
                        break;
                    case 'date':
                        $fieldRules[] = 'date';
                        break;
                    case 'file':
                        // Basic file validation
                        $fieldRules[] = 'file';
                        $fieldRules[] = 'mimes:jpg,jpeg,png,pdf';
                        $fieldRules[] = 'max:5120'; // 5MB
                        break;
                    case 'checkbox':
                        $fieldRules[] = 'boolean';
                        break;
                    default:
                        $fieldRules[] = 'string'; // Default string for text, select, etc.
                        // Ideally we could relax this for arrays (checkbox_group)
                        if ($field['type'] === 'checkbox_group') {
                            $fieldRules = ['nullable', 'array']; // Override for arrays
                        }
                        break;
                }

                $fieldId = $field['id'];
                $rules['submission_data.' . $fieldId] = $fieldRules;
            }
        }

        $validated = $request->validate($rules, [
            'submission_data.*.required' => 'This field is required.'
        ]);

        // 4. HANDLE FILE UPLOADS
        // Logic: Iterate through schema, if it's a file type, check request, store, and replace value with path.
        $submissionData = $request->input('submission_data', []);

        // Ensure submissionData is an array
        if (!is_array($submissionData)) {
            $submissionData = [];
        }

        if (!empty($organization->form_schema)) {
            foreach ($organization->form_schema as $field) {
                if ($field['type'] === 'file') {
                    $fieldId = $field['id'];
                    // Check if file exists in the request using dot notation
                    if ($request->hasFile("submission_data.$fieldId")) {
                        $file = $request->file("submission_data.$fieldId");
                        if ($file->isValid()) {
                            // Store file
                            $path = $file->store('uploads/requirements', 'public');
                            // Update the data array with the path string
                            $submissionData[$fieldId] = $path;
                        }
                    }
                }
            }
        }
        // 4. PERSISTENCE
        $organization->membershipApplications()->create([
            'fullname' => $validated['fullname'],
            'address' => $validated['address'],
            // We store the dynamic answers in the new JSON column
            'submission_data' => $validated['submission_data'] ?? [],
            // Deprecated columns can be left empty or migrated later if needed
            'personal_data' => [],
            'family_data' => [],
            'status' => $isAdmin ? 'Approved' : 'Pending',
            'approved_by' => $isAdmin ? Auth::user()->name : null,
            'actioned_at' => $isAdmin ? now() : null,
        ]);

        // 5. FLASH MESSAGE REDIRECT
        if ($isAdmin) {
            return redirect()->route('admin.applications.index')
                ->with('success', 'Manual record for ' . $validated['fullname'] . ' has been registered.');
        }

        return redirect()->route('public.organizations.show', $organization->slug)
            ->with('success', 'Application Submitted! Please wait for Barangay verification.');
    }

    public function print(Organization $organization, MembershipApplication $application)
    {
        // Simple security: Ensure application belongs to organization
        if ($application->organization_id !== $organization->id) {
            abort(404);
        }

        return Inertia::render('Public/Organizations/Apply/PrintView', [
            'organization' => new \App\Http\Resources\OrganizationResource($organization),
            'application' => new \App\Http\Resources\MembershipApplicationResource($application),
        ]);
    }
}