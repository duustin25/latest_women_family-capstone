<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Organization;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Http\Resources\AnnouncementResource;

class HomeController extends Controller
{
    // THIS SHOWS THE PUBLIC LANDING PAGE WITH THE ANNOUNCEMENTS AND ORGANIZATIONS POST
    public function index()
    {
        return Inertia::render('welcome', [

            // Latest 3 for the home page slider/grid
            'announcements' => AnnouncementResource::collection(Announcement::latest()->take(3)->get()),
            
            // We should eventually make an OrganizationResource too!
            'organizations' => Organization::all(), 

        
        ]);
    }
}