<?php

namespace App\Listeners;

use App\Events\ApplicationApproved;
use App\Models\Member;
use App\Mail\MembershipApproved;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendMembershipWelcomeEmail
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(ApplicationApproved $event): void
    {
        $application = $event->application;
        
        Log::info('SendMembershipWelcomeEmail: Starting for App ID ' . $event->application->id);
        
        // Find the created member for this application
        $member = Member::where('membership_application_id', $event->application->id)->first();
        
        if ($member && $member->email) {
            Log::info('SendMembershipWelcomeEmail: Sending to ' . $member->email);
            Mail::to($member->email)->send(new MembershipApproved($member));
            Log::info('SendMembershipWelcomeEmail: Sent!');
        } else {
            Log::warning('SendMembershipWelcomeEmail: Member not found or missing email for App ID ' . $event->application->id);
        }
    }
}
