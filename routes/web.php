<?php


use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Landing Page Route
use App\Http\Controllers\HomeController;

// Admin Routes:
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\CaseController;
use App\Http\Controllers\Admin\OfficialController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\MembersController;
use App\Http\Controllers\Admin\MembershipApplicationController;

// Public Routes:
use App\Http\Controllers\Public\PublicAnnouncementController;
// use App\Http\Controllers\Public\PublicVawcController;
// use App\Http\Controllers\Public\PublicGadController;
use App\Http\Controllers\Public\PublicServicesController;
use App\Http\Controllers\Public\PublicOrganizationController;
use App\Http\Controllers\Public\MembershipController;
use App\Http\Controllers\Public\ChatbotController;

Route::post('/chatbot/query', [ChatbotController::class, 'query'])->middleware('throttle:10,1');
Route::get('/chat', [ChatbotController::class, 'index'])->name('chat.index');
Route::post('/chat/send', [ChatbotController::class, 'chat'])->name('chat.send');


// 1. Public Landing Page
Route::get('/', [HomeController::class, 'index'])->name('home');

// --- PUBLIC ROUTES ---
Route::prefix('announcements')->group(function () {
    // Keep this as announcements.index for the public feed
    Route::get('/', [PublicAnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/{announcement}', [PublicAnnouncementController::class, 'show'])->name('announcements.show');
});


// 3. Public Organizations Routes (New)
Route::prefix('organizations')->group(function () {
    Route::get('/', [PublicOrganizationController::class, 'index'])->name('public.organizations.index');
    Route::get('/{organization}', [PublicOrganizationController::class, 'show'])->name('public.organizations.show');

    // Public Forms or Application Routes
    Route::get('/{organization}/apply', [MembershipController::class, 'create'])
        ->name('public.organizations.apply');
    Route::post('/{organization}/apply', [MembershipController::class, 'store'])
        ->name('public.organizations.submit')->middleware('throttle:3,1');

    Route::get('/{organization}/apply/{application}/print', [MembershipController::class, 'print'])
        ->name('public.organizations.print');

});



// 4. Consolidated Public Services (Fixing the BadMethodCallException)
Route::controller(PublicServicesController::class)->group(function () {
    Route::get('/vawc', 'vawc')->name('vawc.index');
    // Route::get('/vawc/report', 'vawcReport')->name('vawc.report'); // DISABLED: Offline Reporting Only
    // Route::post('/vawc/report', 'storeVawcReport')->name('vawc.report.store');

    Route::get('/gad', 'gad')->name('gad.index');
    Route::get('/gad/register', 'gadRegister')->name('gad.register');
    Route::post('/gad/register', [PublicServicesController::class, 'storeMembershipApplication'])->name('gad.register.store');

    Route::get('/bcpc', 'bcpc')->name('bcpc.index');
    // Route::get('/bcpc/report', 'bcpcReport')->name('bcpc.report'); // DISABLED: Offline Reporting Only
    // Route::post('/bcpc/report', 'storeBcpcReport')->name('bcpc.report.store');

    Route::get('/officials', 'officials')->name('officials.index');
    Route::get('/laws', 'laws')->name('public.laws.index');
});


//  Authenticated Routes (Keep 'dashboard' standard)
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        $currentYear = \Carbon\Carbon::now()->year;

        // Fetch dynamic types (same as AnalyticsController)
        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $reportsRaw = \App\Models\CaseReport::select('incident_date', 'type', 'abuse_type_id', 'case_status_id')
            ->where('type', 'VAWC')
            ->whereYear('incident_date', $currentYear)
            ->whereNotNull('abuse_type_id')
            ->get()
            ->groupBy(function ($date) {
                return \Carbon\Carbon::parse($date->incident_date)->month;
            })
            ->map(function ($group) {
                return $group->countBy('abuse_type_id');
            });

        $reports = collect();
        foreach ($reportsRaw as $month => $counts) {
            foreach ($counts as $abuseTypeId => $count) {
                $reports->push((object) [
                    'month' => $month,
                    'abuse_type_id' => $abuseTypeId,
                    'count' => $count
                ]);
            }
        }

        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        $formattedData = [];

        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $monthData = ['month' => $monthName];

            foreach ($abuseTypes as $type) {
                $key = strtolower($type->name);
                $record = $reports->where('month', $monthNum)
                    ->first(function ($item) use ($type) {
                        return $item->abuse_type_id === $type->id;
                    });
                $monthData[$key] = $record ? $record->count : 0;
            }
            $formattedData[] = $monthData;
        }

        // Pass types meta for Chart colors
        $chartConfig = $abuseTypes->map(function ($t) {
            return [
                'key' => strtolower($t->name),
                'label' => $t->name,
                'color' => $t->color ?? '#000000'
            ];
        });

        // --- GAD ANALYTICS ---
        $gadMonthlyStatsRaw = \App\Models\GadActivity::select('date_scheduled', 'activity_type', 'actual_expenditure')
            ->where('status', 'Completed')
            ->whereYear('date_scheduled', $currentYear)
            ->get();

        $gadMonthlyStats = $gadMonthlyStatsRaw->groupBy(function ($act) {
            return \Carbon\Carbon::parse($act->date_scheduled)->month;
        })
            ->map(function ($group, $month) {
                $sums = $group->groupBy('activity_type')->map(function ($typeGroup) {
                    return $typeGroup->sum('actual_expenditure');
                });
                return (object) [
                    'month' => $month,
                    'totals' => $sums
                ];
            });

        $gadAnalyticsData = [];
        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $data = ['month' => $monthName];

            $data['client_focused'] = 0;
            $data['org_focused'] = 0;
            $data['attribution'] = 0;

            if ($gadMonthlyStats->has($monthNum)) {
                $stat = $gadMonthlyStats->get($monthNum);
                $data['client_focused'] = current($stat->totals->get('Client-Focused', [0])) ?? $stat->totals->get('Client-Focused', 0);
                $data['org_focused'] = current($stat->totals->get('Org-Focused', [0])) ?? $stat->totals->get('Org-Focused', 0);
                $data['attribution'] = current($stat->totals->get('Attribution', [0])) ?? $stat->totals->get('Attribution', 0);
            }

            $gadAnalyticsData[] = $data;
        }

        // Dashboard Quick Stats
        $stats = [
            'totalCases' => \App\Models\CaseReport::count(),
            'totalUsers' => \App\Models\User::count(),
            'totalOrgs' => \App\Models\Organization::count()
        ];

        // Recent Case Reports table
        $recentCases = \App\Models\CaseReport::with(['abuseType', 'status'])
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(function ($case) {
                return [
                    'id' => $case->id,
                    'case_number' => $case->case_number,
                    'type' => $case->type,
                    'subType' => $case->abuseType ? $case->abuseType->name : 'N/A',
                    'status' => $case->status ? $case->status->name : 'N/A',
                    'date' => $case->incident_date ? $case->incident_date->format('M d, Y') : $case->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('dashboard', [
            'analyticsData' => $formattedData,
            'chartConfig' => $chartConfig,
            'gadAnalyticsData' => $gadAnalyticsData,
            'systemStats' => $stats,
            'recentCases' => $recentCases
        ]);
    })->name('dashboard');


    // This turns 'announcements.index' into 'admin.announcements.index'
    Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['role:admin,head,president']], function () {
        Route::resource('announcements', AnnouncementController::class);
        Route::get('organizations/{organization:slug}/members', [OrganizationController::class, 'members'])->name('organizations.members');
        Route::resource('organizations', OrganizationController::class);

        Route::patch('cases/update-status', [CaseController::class, 'updateStatus'])->name('cases.update-status');
        Route::get('cases/{id}/print', [CaseController::class, 'print'])->name('cases.print');
        Route::patch('cases/{id}/restore', [CaseController::class, 'restore'])->name('cases.restore');
        Route::get('cases/archive', [CaseController::class, 'archive'])->name('cases.archive');
        Route::resource('cases', CaseController::class);
        // 'system-users'
        Route::get('system-users/archives', [\App\Http\Controllers\Admin\SystemUserController::class, 'archives'])->name('system-users.archives');
        Route::post('system-users/{id}/restore', [\App\Http\Controllers\Admin\SystemUserController::class, 'restore'])->name('system-users.restore');
        Route::resource('system-users', \App\Http\Controllers\Admin\SystemUserController::class);

        // 'officials'
        Route::resource('officials', OfficialController::class);


        // 2. Membership Applications (Manual Order Fix)
        // Static routes (create) MUST come before wildcard routes ({application})
        Route::get('applications', [MembershipApplicationController::class, 'index'])->name('applications.index');
        Route::get('applications/create', [MembershipApplicationController::class, 'create'])->name('applications.create');
        Route::get('applications/{application}/print', [MembershipApplicationController::class, 'print'])->name('applications.print');
        Route::get('applications/{application}', [MembershipApplicationController::class, 'show'])->name('applications.show');
        Route::patch('applications/{application}/status', [MembershipApplicationController::class, 'updateStatus'])->name('applications.update-status');
        Route::get('applications/{application}/edit', [MembershipApplicationController::class, 'edit'])->name('applications.edit');
        Route::put('applications/{application}', [MembershipApplicationController::class, 'update'])->name('applications.update');


        Route::get('analytics/print', [AnalyticsController::class, 'print'])->name('analytics.print');
        Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

        // Audit Trail / Backtrack
        Route::get('/audit-logs', [AuditLogController::class, 'index'])
            ->name('audit-logs');

        Route::get('/members', [MembersController::class, 'index'])
            ->name('members');

        // GAD Module
        Route::get('gad/dashboard', [\App\Http\Controllers\Admin\GadActivityController::class, 'dashboard'])->name('gad.dashboard');
        Route::get('gad/print', [\App\Http\Controllers\Admin\GadActivityController::class, 'print'])->name('gad.print');
        Route::resource('gad/activities', \App\Http\Controllers\Admin\GadActivityController::class, ['names' => 'gad.activities']);

    });

});

// STRICT ADMIN-ONLY ROUTES: System Taxonomy & Configurations
Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['auth', 'verified', 'role:admin']], function () {
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/case-abuse-types', [\App\Http\Controllers\Admin\SettingsController::class, 'storeAbuseType'])->name('settings.case-abuse-types.store');
    Route::patch('/settings/case-abuse-types/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'updateAbuseType'])->name('settings.case-abuse-types.update');
    Route::post('/settings/case-referral-agencies', [\App\Http\Controllers\Admin\SettingsController::class, 'storeReferralPartner'])->name('settings.case-referral-agencies.store');
    Route::patch('/settings/case-referral-agencies/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'updateReferralPartner'])->name('settings.case-referral-agencies.update');

    // Case Statuses Settings Routes
    Route::post('/settings/case-statuses', [\App\Http\Controllers\Admin\SettingsController::class, 'storeCaseStatus'])->name('settings.case-statuses.store');
    Route::patch('/settings/case-statuses/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'updateCaseStatus'])->name('settings.case-statuses.update');
});


require __DIR__ . '/settings.php';

