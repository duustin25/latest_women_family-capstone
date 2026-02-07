<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Http\Resources\OrganizationResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Organization::query()->latest();

        // RBAC: President Scope
        if ($user->isPresident()) {
            $query->where('id', $user->organization_id);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('president_name', 'LIKE', "%{$searchTerm}%");
            });
        }

        $organization = $query->paginate(7)->withQueryString();

        return Inertia::render('Admin/Organizations/Index', [
            'organization' => OrganizationResource::collection($organization),
            'filters' => $request->only(['search'])
        ]);
    }

    public function create(Request $request)
    {
        // Only Admin can create new Organizations
        if (!$request->user()->isAdmin()) {
            abort(403, 'Only Admins can create organizations.');
        }
        return Inertia::render('Admin/Organizations/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:organizations',
            'description' => 'required|string',
            'president_name' => 'nullable|string',
            'color_theme' => 'required|string', // e.g., 'bg-blue-600'
            'image' => 'nullable|image|max:2048',
            'requirements' => 'nullable|array', // Captured as an array for the JSON column
        ], [
            // Custom student-friendly messages for the prof to see
            'name.required' => 'The organization must have a formal name.',
            'description.required' => 'A brief mission description is mandatory for transparency.',
        ]);
        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('admin/organizations', 'public');
        }

        // --- THE FIX STARTS HERE ---
        // If 'requirements' is not in the request, we force it to be an empty array
        // so the database actually clears the column.
        $validated['requirements'] = $request->input('requirements', []);
        // --- THE FIX ENDS HERE ---
        Organization::create($validated);

        return redirect()->route('admin.organizations.index')->with('success', 'Organization Created!');
    }

    public function edit(Organization $organization)
    {
        return Inertia::render('Admin/Organizations/Edit', [
            'organization' => new OrganizationResource($organization)
        ]);
    }

    public function update(Request $request, Organization $organization)
    {
        // RBAC: President can only update THEIR organization
        $user = $request->user();
        if ($user->isPresident() && $user->organization_id !== $organization->id) {
            abort(403, 'You can only edit your own organization.');
        }

        if (!$request->has('requirements')) {
            $request->merge(['requirements' => []]);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:organizations,name,' . $organization->id,
            'description' => 'required|string',
            'president_name' => 'nullable|string',
            'color_theme' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'requirements' => 'nullable|array',
            'form_schema' => 'nullable|array',
        ]);

        if ($request->hasFile('image')) {
            if ($organization->image_path) {
                Storage::disk('public')->delete($organization->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('organizations', 'public');
        }

        // Ensure form_schema is saved as JSON (Laravel casts handle this if passed as array)
        if (!$request->has('form_schema')) {
            $validated['form_schema'] = $organization->form_schema; // Keep existing if not sent
        } else {
            $validated['form_schema'] = $request->input('form_schema');
        }

        $organization->update($validated);
        return redirect()->route('admin.organizations.edit', $organization->slug)
            ->with('success', 'Organization updated successfully.');
    }

    public function destroy(Request $request, Organization $organization)
    {
        // Only Admin can destroy
        if (!$request->user()->isAdmin()) {
            abort(403, 'Only Admins can delete organizations.');
        }

        if ($organization->image_path) {
            Storage::disk('public')->delete($organization->image_path);
        }

        $organization->delete();
        return redirect()->route('admin.organizations.index')->with('success', 'Organization deleted.');
    }
}