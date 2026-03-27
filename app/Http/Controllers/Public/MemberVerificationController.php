<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberVerificationController extends Controller
{
    /**
     * Show the search page for manual ID verification.
     */
    public function index()
    {
        return Inertia::render('Public/Member/VerifyIndex');
    }

    /**
     * Quick Scan node for verifying a citizen's active status.
     * This route does not show private benefits or communications,
     * it only provides public-proof of their existence and status.
     */
    public function verify($token)
    {
        $member = Member::where('secure_token', $token)->with('organization')->first();

        if (!$member) {
            return Inertia::render('Public/Member/Verify', [
                'isValid' => false,
                'message' => 'Invalid or expired Citizen ID.'
            ]);
        }

        if ($member->status !== 'Active') {
            return Inertia::render('Public/Member/Verify', [
                'isValid' => false,
                'message' => 'Citizen ID is registered but currently ' . strtoupper($member->status) . '.',
                'member' => $member,
                'organization' => $member->organization
            ]);
        }

        return Inertia::render('Public/Member/Verify', [
            'isValid' => true,
            'member' => $member,
            'organization' => $member->organization
        ]);
    }
}
