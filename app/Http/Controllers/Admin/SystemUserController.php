<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemUserController extends Controller
{
    /**
     * Display a listing of system users (Admins, Heads, Presidents).
     */
    public function index(Request $request)
    {
        // Only Super Admins can access this
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        $query = User::with('organization')->latest();

        if ($request->filled('search')) {
            $query->where('name', 'LIKE', "%{$request->search}%")
                ->orWhere('email', 'LIKE', "%{$request->search}%");
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/SystemUsers/Index', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/SystemUsers/Create', [
            'organizations' => Organization::select('id', 'name')->orderBy('name')->get()
        ]);
    }

    public function edit(User $system_user)
    {
        return Inertia::render('Admin/SystemUsers/Edit', [
            'user' => $system_user,
            'organizations' => Organization::select('id', 'name')->orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role' => 'required|in:admin,head,president',
            // Only require organization_id if role is President
            'organization_id' => 'required_if:role,president|nullable|exists:organizations,id',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            // Explicitly set organization_id to null if not a president
            'organization_id' => $validated['role'] === 'president' ? ($validated['organization_id'] ?? null) : null,
        ]);

        return redirect()->route('admin.system-users.index')->with('success', 'System Account Created.');
    }

    public function update(Request $request, User $system_user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $system_user->id,
            'role' => 'required|in:admin,head,president',
            'organization_id' => 'required_if:role,president|nullable|exists:organizations,id',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            // Explicitly set organization_id to null if not a president
            'organization_id' => $validated['role'] === 'president' ? ($validated['organization_id'] ?? null) : null,
        ];

        // Only update password if provided
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->input('password'));
        }

        $system_user->update($data);

        return redirect()->route('admin.system-users.index')->with('success', 'System Account Updated.');
    }

    public function destroy(User $system_user)
    {
        if ($system_user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }
        $system_user->delete();
        return back()->with('success', 'User deleted.');
    }
}