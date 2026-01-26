<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization; // Ensure you have this Model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class OrganizationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Organizations/Index', [
            'organizations' => Organization::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Organizations/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'nullable|email',
            'logo' => 'nullable|image|max:1024',
        ]);

        $logoPath = $request->hasFile('logo') 
            ? $request->file('logo')->store('organizations', 'public') 
            : null;

        Organization::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'],
            'email' => $validated['email'],
            'logo_path' => $logoPath,
        ]);

        return redirect()->route('organizations.index')->with('success', 'Organization added successfully!');
    }

    public function edit(Organization $organization)
    {
        return Inertia::render('Admin/Organizations/Edit', [
            'organization' => $organization
        ]);
    }

    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'nullable|email',
            'logo' => 'nullable|image|max:1024',
        ]);

        if ($request->hasFile('logo')) {
            if ($organization->logo_path) {
                Storage::disk('public')->delete($organization->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('organizations', 'public');
        }

        $organization->update(array_merge(
            $validated,
            ['slug' => Str::slug($validated['name'])]
        ));

        return redirect()->route('organizations.index')->with('success', 'Organization updated!');
    }

    public function destroy(Organization $organization)
    {
        if ($organization->logo_path) {
            Storage::disk('public')->delete($organization->logo_path);
        }
        $organization->delete();
        return redirect()->route('organizations.index')->with('success', 'Organization removed.');
    }
}