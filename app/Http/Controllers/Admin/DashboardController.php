<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MembershipApplication;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $analyticsService;

    public function __construct(\App\Services\AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index()
    {
        $currentYear = \Carbon\Carbon::now()->year;

        // Fetch Abuse Types for the chart config
        $vawcTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        return Inertia::render('dashboard', [
            'analyticsData'       => $this->analyticsService->getMonthlyCaseAnalytics('VAWC', $currentYear, $vawcTypes),
            'chartConfig'         => $this->analyticsService->getVawcChartConfig(),
            'systemStats'         => $this->analyticsService->getSystemStats(),
            'recentCases'         => $this->analyticsService->getRecentCases(),
            'recentApplications'  => $this->analyticsService->getRecentApplications(),
            'membershipStats'     => $this->analyticsService->getMembershipTrends($currentYear),
            'caseResolutionStats' => $this->analyticsService->getCaseResolutionStats($currentYear)
        ]);
    }
}

