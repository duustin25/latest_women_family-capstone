<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberPortalController extends Controller
{
    /**
     * Show the member portal for the given secret token.
     */
    public function show($token)
    {
        $member = Member::where('secure_token', $token)
            ->with(['organization', 'communications', 'dispatches'])
            ->firstOrFail();

        // Optional: Track the access
        $member->update(['last_accessed_at' => now()]);

        return Inertia::render('Public/Member/Portal', [
            'member' => $member,
            'organization' => $member->organization,
            'communications' => $member->communications()->latest()->get(),
            'dispatches' => $member->dispatches()->latest()->get(),
            'secure_token' => $token, // Pass for actions
            'announcements' => \App\Models\Announcement::latest()->take(3)->get(),
        ]);
    }

    /**
     * Mark a benefit as claimed via the portal.
     */
    public function claimBenefit(Request $request, $token, $dispatch_id)
    {
        $member = Member::where('secure_token', $token)->firstOrFail();
        
        $dispatch = $member->dispatches()->findOrFail($dispatch_id);
        
        if ($dispatch->status === 'Claimed') {
            return back()->with('error', 'Benefit already claimed.');
        }

        $dispatch->update([
            'status' => 'Claimed',
            'claimed_at' => now(),
        ]);

        return back()->with('success', 'Benefit acknowledged as claimed!');
    }
}
