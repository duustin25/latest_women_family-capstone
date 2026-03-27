<!DOCTYPE html>
<html>
<head>
    <title>Membership Approved</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px;">
        <h1 style="color: #2563eb;">Congratulations, {{ $member->fullname }}!</h1>
        <p>Your membership application to <strong>{{ $member->organization->name }}</strong> has been <strong>Approved</strong>.</p>
        
        <p>You can now access your citizen portal using the secure magic link below. No login or password is required.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $member->portal_link }}" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View My Citizen Portal
            </a>
        </div>
        
        <p>In your portal, you can:</p>
        <ul>
            <li>View your Digital Membership Card</li>
            <li>Track upcoming events and announcements</li>
            <li>Claim organizational benefits</li>
        </ul>
        
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666666;">This is a secure link. Please do not share this email with others.</p>
    </div>
</body>
</html>
