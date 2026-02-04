<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Landing Page Route
use App\Http\Controllers\HomeController;

// Admin Routes:
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\CaseController;

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\MembersController;
use App\Http\Controllers\Admin\MembershipApplicationController;

// Public Routes:
use App\Http\Controllers\Public\PublicAnnouncementController;
use App\Http\Controllers\Public\PublicVawcController;
use App\Http\Controllers\Public\PublicGadController;
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

});



// 4. Consolidated Public Services (Fixing the BadMethodCallException)
Route::controller(PublicServicesController::class)->group(function () {
    Route::get('/vawc', 'vawc')->name('vawc.index');
    Route::get('/vawc/report', 'vawcReport')->name('vawc.report');
    Route::post('/vawc/report', 'storeVawcReport')->name('vawc.report.store');

    Route::get('/gad', 'gad')->name('gad.index');
    Route::get('/gad/register', 'gadRegister')->name('gad.register');
    Route::post('/gad/register', [PublicServicesController::class, 'storeMembershipApplication'])->name('gad.register.store');

    Route::get('/bcpc', 'bcpc')->name('bcpc.index');
    Route::get('/bcpc/report', 'bcpcReport')->name('bcpc.report');
    Route::post('/bcpc/report', 'storeBcpcReport')->name('bcpc.report.store');

    Route::get('/officials', 'officials')->name('officials.index');
    Route::get('/laws', 'laws')->name('public.laws.index');
});


//  Authenticated Routes (Keep 'dashboard' standard)
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        $currentYear = \Carbon\Carbon::now()->year;
        $reports = \App\Models\VawcReport::selectRaw('MONTH(incident_date) as month, abuse_type, COUNT(*) as count')
            ->whereYear('incident_date', $currentYear)
            ->whereNotNull('abuse_type')
            ->groupBy('month', 'abuse_type')
            ->get();

        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        $formattedData = [];

        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $physical = $reports->where('month', $monthNum)->where('abuse_type', 'Physical')->first()->count ?? 0;
            $sexual = $reports->where('month', $monthNum)->where('abuse_type', 'Sexual')->first()->count ?? 0;
            $psycho = $reports->where('month', $monthNum)->where('abuse_type', 'Psychological')->first()->count ?? 0;
            $economic = $reports->where('month', $monthNum)->where('abuse_type', 'Economic')->first()->count ?? 0;

            $formattedData[] = [
                'month' => $monthName,
                'physical' => $physical,
                'sexual' => $sexual,
                'psychological' => $psycho,
                'economic' => $economic
            ];
        }

        return Inertia::render('dashboard', [
            'analyticsData' => $formattedData
        ]);
    })->name('dashboard');


    // This turns 'announcements.index' into 'admin.announcements.index'
    Route::group(['prefix' => 'admin', 'as' => 'admin.', 'middleware' => ['role:admin,head,president']], function () {
        Route::resource('announcements', AnnouncementController::class);
        Route::resource('organizations', OrganizationController::class);

        Route::patch('cases/update-status', [CaseController::class, 'updateStatus'])->name('cases.update-status');
        Route::resource('cases', CaseController::class);
        // 'system-users'
        Route::resource('system-users', \App\Http\Controllers\Admin\SystemUserController::class);


        // 2. Membership Applications (Manual Order Fix)
        // Static routes (create) MUST come before wildcard routes ({application})
        Route::get('applications', [MembershipApplicationController::class, 'index'])->name('applications.index');
        Route::get('applications/create', [MembershipApplicationController::class, 'create'])->name('applications.create');
        Route::get('applications/{application}', [MembershipApplicationController::class, 'show'])->name('applications.show');
        Route::patch('applications/{application}/status', [MembershipApplicationController::class, 'updateStatus'])->name('applications.update-status');

        // MOCK DATAS 
        // Inside Route::middleware(['auth', 'verified'])->prefix('admin')->group(...)
        Route::get('/analytics', [AnalyticsController::class, 'index'])
            ->name('analytics');

        // Audit Trail / Backtrack
        Route::get('/audit-logs', [AuditLogController::class, 'index'])
            ->name('audit-logs');

        Route::get('/members', [MembersController::class, 'index'])
            ->name('members');

        // Settings Module (Abuse Types & Partners)
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
        Route::post('/settings/abuse-types', [\App\Http\Controllers\Admin\SettingsController::class, 'storeAbuseType'])->name('settings.abuse-types.store');
        Route::patch('/settings/abuse-types/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'updateAbuseType'])->name('settings.abuse-types.update');
        Route::post('/settings/partners', [\App\Http\Controllers\Admin\SettingsController::class, 'storeReferralPartner'])->name('settings.partners.store');
        Route::patch('/settings/partners/{id}', [\App\Http\Controllers\Admin\SettingsController::class, 'updateReferralPartner'])->name('settings.partners.update');

    });



});


require __DIR__ . '/settings.php';

