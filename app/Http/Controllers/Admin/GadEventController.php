<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GadEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GadEventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = GadEvent::query();

        // Optional search filter
        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        $events = $query->orderBy('event_date', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/GadEvents/Index', [
            'events' => $events,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'event_date' => 'required|date',
            'event_time' => 'required',
            'location' => 'required|string|max:255',
            'image_path' => 'nullable|image|max:2048' // 2MB max
        ]);

        if ($request->hasFile('image_path')) {
            $path = $request->file('image_path')->store('gad_events', 'public');
            $validated['image_path'] = $path;
        }

        GadEvent::create($validated);

        return redirect()->route('admin.gad.events.index')->with('success', 'Event created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $event = GadEvent::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'event_date' => 'required|date',
            'event_time' => 'required',
            'location' => 'required|string|max:255',
            'image_path' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image_path')) {
            // Delete old image if it exists
            if ($event->image_path) {
                Storage::disk('public')->delete($event->image_path);
            }
            $path = $request->file('image_path')->store('gad_events', 'public');
            $validated['image_path'] = $path;
        }

        $event->update($validated);

        return redirect()->route('admin.gad.events.index')->with('success', 'Event updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $event = GadEvent::findOrFail($id);

        if ($event->image_path) {
            Storage::disk('public')->delete($event->image_path);
        }

        $event->delete();

        return redirect()->route('admin.gad.events.index')->with('success', 'Event deleted successfully.');
    }
}
