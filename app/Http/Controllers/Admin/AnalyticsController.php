<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CaseReport;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(\App\Services\AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(Request $request)
    {
        $currentYear = $request->input('year', Carbon::now()->year);

        // Fetch Abuse Types mapped to VAWC vs BCPC
        $vawcTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $bcpcTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['BCPC', 'Both'])
            ->get();

        // Use AnalyticsService for data aggregation
        $vawcData    = $this->analyticsService->getMonthlyCaseAnalytics('VAWC', $currentYear, $vawcTypes);
        $stats       = $this->analyticsService->getRibbonStats($currentYear);
        $bpoTrends   = $this->analyticsService->getVawcBpoTrends($currentYear);
        $vawcStatus  = $this->analyticsService->getVawcStatusBreakdown($currentYear);

        $membershipStats = $this->analyticsService->getMembershipTrends($currentYear);
        $ageDemographics = $this->analyticsService->getAgeDemographics($currentYear);
        $zoneDistribution = $this->analyticsService->getZoneDistribution($currentYear);

        // Handle legacy location demographics for now (Top 8 of incident_location string)
        $locationRaw = CaseReport::select('incident_location')
            ->whereNotNull('incident_location')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy('incident_location')
            ->map(fn($group) => count($group))
            ->sortByDesc(fn($count) => $count)
            ->take(8);

        $locationDemographics = [];
        foreach ($locationRaw as $location => $count) {
            $shortLoc = strlen($location) > 20 ? substr($location, 0, 20) . '...' : $location;
            $locationDemographics[] = ['name' => $shortLoc, 'count' => $count, 'fullName' => $location];
        }

        // Case Resolution Rates from VAWC lifecycle
        $caseResolutionsRaw = CaseReport::select('lifecycle_status')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(fn($case) => $case->lifecycle_status ?: 'Unknown')
            ->map(fn($group) => count($group));

        $caseResolutionStats = [];
        $statusColors = [
            'New' => '#f43f5e',
            'Ongoing' => '#3b82f6',
            'Referred' => '#a855f7',
            'Resolved' => '#10b981',
            'Closed' => '#64748b',
            'Dismissed' => '#ef4444',
            'Unknown' => '#94a3b8'
        ];
        foreach ($caseResolutionsRaw as $statusName => $count) {
            $caseResolutionStats[] = ['name' => $statusName, 'value' => $count, 'fill' => $statusColors[$statusName] ?? '#94a3b8'];
        }

        $agencyStats = [];

        // Config for charts
        $vawcChartConfig = $vawcTypes->map(fn($t) => ['key' => strtolower($t->name), 'label' => $t->name, 'color' => $t->color ?? '#ce1126']);

        return Inertia::render('Admin/Analytics/Index', [
            'stats'              => $stats,
            'vawcData'           => $vawcData,
            'currentYear'        => (int) $currentYear,
            'vawcChartConfig'    => $vawcChartConfig,
            'membershipStats'    => $membershipStats,
            'caseResolutionStats' => $caseResolutionStats,
            'ageDemographics'    => $ageDemographics,
            'locationDemographics' => $locationDemographics,
            'zoneDistribution'   => $zoneDistribution,
            'bpoTrends'          => $bpoTrends,
            'vawcStatusBreakdown' => $vawcStatus,
        ]);
    }

    public function print(Request $request)
    {
        $year = $request->input('year', Carbon::now()->year);

        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $data = $this->analyticsService->getMonthlyCaseAnalytics('VAWC', $year, $abuseTypes);

        $chartConfig = $abuseTypes->map(function ($t) {
            return [
                'key' => strtolower($t->name),
                'label' => $t->name
            ];
        });

        return Inertia::render('Admin/Analytics/Print', [
            'analyticsData' => $data,
            'year' => (int) $year,
            'chartConfig' => $chartConfig,
            'generatedAt' => Carbon::now()->format('F j, Y g:i A')
        ]);
    }
}
