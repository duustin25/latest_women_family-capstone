<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BarangayOfficial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OfficialController extends Controller
{
    public function index()
    {
        $officials = BarangayOfficial::orderBy('level')->orderBy('display_order')->get();
        return Inertia::render('Admin/Officials/Index', [
            'officials' => $officials
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'committee' => 'nullable|string|max:255',
            'level' => 'required|in:head,secretary,staff',
            'image_path' => 'nullable|image|max:10240|dimensions:ratio=1/1', // 10MB
        ]);

        // Enforce unique Head and Secretary
        if (in_array($request->level, ['head', 'secretary'])) {
            if (BarangayOfficial::where('level', $request->level)->exists()) {
                return back()->withErrors(['level' => 'There can only be one official with the level: ' . ucfirst($request->level)]);
            }
        }

        if ($request->hasFile('image_path')) {
            $path = $request->file('image_path')->store('officials', 'public');
            $validated['image_path'] = '/storage/' . $path;
        }

        BarangayOfficial::create($validated);

        return back()->with('success', 'Official added successfully.');
    }

    public function update(Request $request, $id)
    {
        $official = BarangayOfficial::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'committee' => 'nullable|string|max:255',
            'level' => 'required|in:head,secretary,staff',
            'image_path' => 'nullable|image|max:10240|dimensions:ratio=1/1',
            'is_active' => 'boolean'
        ]);

        // Enforce unique Head and Secretary (excluding self)
        if (in_array($request->level, ['head', 'secretary'])) {
            if (BarangayOfficial::where('level', $request->level)->where('id', '!=', $id)->exists()) {
                return back()->withErrors(['level' => 'There can only be one official with the level: ' . ucfirst($request->level)]);
            }
        }

        if ($request->hasFile('image_path')) {
            // Delete old image if exists
            if ($official->image_path) {
                // Remove '/storage/' prefix to get relative path
                $relativePath = str_replace('/storage/', '', $official->image_path);
                Storage::disk('public')->delete($relativePath);
            }

            $path = $request->file('image_path')->store('officials', 'public');
            $validated['image_path'] = '/storage/' . $path;
        } else {
            // Remove image_path from validated if null/empty so it doesn't overwrite existing
            unset($validated['image_path']);
        }

        $official->update($validated);

        return back()->with('success', 'Official updated successfully.');
    }

    public function destroy($id)
    {
        $official = BarangayOfficial::findOrFail($id);

        if ($official->image_path) {
            $relativePath = str_replace('/storage/', '', $official->image_path);
            Storage::disk('public')->delete($relativePath);
        }

        $official->delete();

        return back()->with('success', 'Official removed.');
    }
}
