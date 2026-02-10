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

        // Use specific form for KALIPI
        if ($organization->slug === 'kalipi') {
            $view = 'Public/Organizations/Apply/KalipiForm';
        }

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
                    case 'checkbox':
                        // Checkbox usually comes as boolean or "on"
                        // We can be loose here or strict 'boolean'
                        $fieldRules[] = 'boolean';
                        break;
                    case 'text':
                    case 'textarea':
                    case 'select':
                    case 'radio':
                    default:
                        $fieldRules[] = 'string';
                        break;
                }

                // Add to rules array using dot notation for JSON validation
                // The frontend sends data in 'submission_data' array
                // So we validate 'submission_data.field_id'
                // NOTE: We used field.id in the frontend form builder
                $fieldId = $field['id'];
                $rules['submission_data.' . $fieldId] = implode('|', $fieldRules);
            }
        }

        $validated = $request->validate($rules, [
            'submission_data.*.required' => 'This field is required.'
        ]);


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
}