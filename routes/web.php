<?php

use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Public\PublicAnnouncementController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\PublicVawcController;



// 1. Public Landing Page
Route::get('/', [HomeController::class, 'index'])->name('home');

// 2. Public Announcements Routes
Route::prefix('announcements')->group(function () {
    Route::get('/', [PublicAnnouncementController::class, 'index'])
        ->name('announcements.index');

    Route::get('/{announcement}', [PublicAnnouncementController::class, 'show'])
        ->name('announcements.show');
});

// 3. VAWC Public Page
Route::get('/vawc', [PublicVawcController::class, 'index'])->name('vawc.index');


//  Authenticated Routes (Keep 'dashboard' standard)
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Admin CRUDs (No prefix, but named properly)
    // These will create URLs like /announcements/create
    // DO NOT USE announcements/organizations.index etc. BECAUSE ITS ALL HERE
    Route::resource('announcements', AnnouncementController::class);
    Route::resource('organizations', OrganizationController::class);
});





require __DIR__.'/settings.php';