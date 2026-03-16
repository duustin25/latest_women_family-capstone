<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Organization;
use App\Models\Banner;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Http\Resources\AnnouncementResource;
use App\Http\Resources\OrganizationResource;

class HomeController extends Controller
{
    // THIS SHOWS THE PUBLIC LANDING PAGE WITH THE ANNOUNCEMENTS AND ORGANIZATIONS POST
    public function index()
    {
        return Inertia::render('welcome', [

            // Latest 3 for the home page slider/grid
            'announcements' => AnnouncementResource::collection(Announcement::latest()->take(3)->get()),
            
            // Use the Resource here too!
            'organizations' => OrganizationResource::collection(Organization::latest()->take(4)->get()), 

            // Fetch active banners for the hero slider
            'banners' => Banner::where('is_active', true)->orderBy('order_index')->get(),
        ]);
    }
}