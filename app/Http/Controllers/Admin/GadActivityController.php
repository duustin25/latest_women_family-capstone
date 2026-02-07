<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GadActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GadActivityController extends Controller
{
    public function index(Request $request)
    {
        $activities = GadActivity::query()
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('date_scheduled', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Gad/Activities/Index', [
            'activities' => $activities,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Gad/Activities/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'activity_type' => 'required|in:Client-Focused,Org-Focused,Attribution',
            'status' => 'required|in:Planned,Ongoing,Completed',
            'date_scheduled' => 'required|date',
            'total_project_cost' => 'required|numeric|min:0',
            'hgdg_score' => 'nullable|required_if:activity_type,Attribution|numeric|min:0|max:20',
            'target_participants' => 'nullable|array',
            'attendance_file' => 'nullable|string',
        ]);

        // Auto-calculate gad_chargeable_amount logic
        $chargeable = $validated['total_project_cost'];

        if ($validated['activity_type'] === 'Attribution') {
            $score = $validated['hgdg_score'];
            if ($score < 4.0) {
                $chargeable = 0;
            } elseif ($score < 8.0) {
                $chargeable = $validated['total_project_cost'] * 0.25;
            } elseif ($score < 15.0) {
                $chargeable = $validated['total_project_cost'] * 0.50;
            } else {
                $chargeable = $validated['total_project_cost'];
            }
        }

        $validated['gad_chargeable_amount'] = $chargeable;

        GadActivity::create($validated);

        return redirect()->route('admin.gad.activities.index')->with('success', 'Activity created successfully.');
    }

    public function edit(GadActivity $activity)
    {
        return Inertia::render('Admin/Gad/Activities/Form', [
            'activity' => $activity
        ]);
    }

    public function update(Request $request, GadActivity $activity)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'activity_type' => 'required|in:Client-Focused,Org-Focused,Attribution',
            'status' => 'required|in:Planned,Ongoing,Completed',
            'date_scheduled' => 'required|date',
            'total_project_cost' => 'required|numeric|min:0',
            'hgdg_score' => 'nullable|required_if:activity_type,Attribution|numeric|min:0|max:20',
            'target_participants' => 'nullable|array',
            'attendance_file' => 'nullable|string',
            'actual_expenditure' => 'nullable|numeric|min:0',
        ]);

        // Recalculate if necessary (same logic as store)
        $chargeable = $validated['total_project_cost'];

        if ($validated['activity_type'] === 'Attribution') {
            $score = $validated['hgdg_score'];
            if ($score < 4.0) {
                $chargeable = 0;
            } elseif ($score < 8.0) {
                $chargeable = $validated['total_project_cost'] * 0.25;
            } elseif ($score < 15.0) {
                $chargeable = $validated['total_project_cost'] * 0.50;
            } else {
                $chargeable = $validated['total_project_cost'];
            }
        }

        $validated['gad_chargeable_amount'] = $chargeable;

        $activity->update($validated);

        return redirect()->route('admin.gad.activities.index')->with('success', 'Activity updated successfully.');
    }

    public function destroy(GadActivity $activity)
    {
        $activity->delete();
        return redirect()->back()->with('success', 'Activity deleted.');
    }

    public function dashboard()
    {
        // Calculate stats
        $totalUtilized = GadActivity::where('status', 'Completed')->sum('actual_expenditure');

        $activities = GadActivity::latest()->take(5)->get();

        return Inertia::render('Admin/Gad/Dashboard', [
            'totalUtilized' => $totalUtilized,
            'recentActivities' => $activities
        ]);
    }

    public function print(Request $request)
    {
        $year = $request->input('year', date('Y'));

        $activities = GadActivity::whereYear('date_scheduled', $year)
            ->where('status', 'Completed')
            ->orderBy('date_scheduled')
            ->get();

        $totalUtilized = $activities->sum('actual_expenditure');

        return Inertia::render('Admin/Gad/Print', [
            'activities' => $activities,
            'year' => $year,
            'totalUtilized' => $totalUtilized
        ]);
    }
}
