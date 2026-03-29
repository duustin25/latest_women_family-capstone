<x-mail::message>
# 📢 New Announcement: {{ $announcement->title }}

Hello **Verified Member**,

A new official announcement has been posted by **{{ $announcement->organization->name }}**.

<x-mail::panel>
**Category:** {{ $announcement->category }}
**Posted on:** {{ $announcement->created_at->format('F j, Y') }}
**Location:** {{ $announcement->location ?? 'N/A' }}
</x-mail::panel>

### Summary:
{{ $announcement->excerpt }}

<x-mail::button :url="config('app.url') . '/announcements/' . $announcement->slug">
Read Full Announcement
</x-mail::button>

**Innovation Note:** This automated broadcast ensures 100% reach to active members with zero SMS credit cost to the barangay budget.

Thanks,<br>
**{{ $announcement->organization->name }} Admin Team**
*Barangay 183 Women and Family Support System*
</x-mail::message>