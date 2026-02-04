<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GadProgram; // You'll create this model
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicGadController extends Controller
{
    // List all GAD programs
    public function index()
    {
        return Inertia::render('Public/Gad/Index', [
            'programs' => GadProgram::where('is_active', true)->latest()->get()
        ]);
    }

    // Show the registration form for a specific program
    public function register(GadProgram $program)
    {
        return Inertia::render('Public/Gad/Register', [
            'program' => $program
        ]);
    }

    // Handle the form submission
    public function store(Request $request, GadProgram $program)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'sex' => 'required|in:Male,Female,Other',
            'birthdate' => 'required|date',
            'address' => 'required|string',
            'contact_number' => 'required|string',
            'civil_status' => 'required|string',
            'employment_status' => 'required|string',
        ]);

        // Logic to save application (e.g., $program->applications()->create($validated))
        
        return redirect()->route('gad.index')->with('success', 'Application submitted successfully!');
    }
}