<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        // In the future, you'll use: Activity::latest()->paginate(10);
        return Inertia::render('Admin/AuditLogs/Index');
    }
}
