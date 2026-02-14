<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VawcReport;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $currentYear = $request->input('year', Carbon::now()->year);

        // 1. VAWC DATA
        $vawcTypes = \App\Models\AbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $vawcReports = VawcReport::selectRaw('MONTH(incident_date) as month, abuse_type, COUNT(*) as count')
            ->whereYear('incident_date', $currentYear)
            ->whereNotNull('abuse_type')
            ->where('status', '!=', 'Dismissed')
            ->groupBy('month', 'abuse_type')
            ->get();

        $vawcData = $this->formatAnalyticsData($vawcReports, $vawcTypes);

        // 2. BCPC DATA
        $bcpcTypes = \App\Models\AbuseType::where('is_active', true)
            ->whereIn('category', ['BCPC', 'Both'])
            ->get();

        $bcpcReports = \App\Models\BcpcReport::selectRaw('MONTH(created_at) as month, concern_type, COUNT(*) as count')
            ->whereYear('created_at', $currentYear)
            ->whereNotNull('concern_type')
            ->where('status', '!=', 'Dismissed')
            ->groupBy('month', 'concern_type')
            ->get();

        // Map BCPC reports to match formatAnalyticsData expectation (concern_type -> abuse_type)
        $bcpcReportsMapped = $bcpcReports->map(function ($item) {
            $item->abuse_type = $item->concern_type;
            return $item;
        });

        $bcpcData = $this->formatAnalyticsData($bcpcReportsMapped, $bcpcTypes);


        // Mock stats (Dynamic implementation would query DB)
        $stats = [
            'january' => ['vawc' => 12, 'cpp' => 8],
            'february' => ['vawc' => 18, 'cpp' => 6],
            'growth' => '+20.4%'
        ];

        // Pass types meta for Chart colors
        $vawcChartConfig = $vawcTypes->map(function ($t) {
            return [
                'key' => strtolower($t->name),
                'label' => $t->name,
                'color' => $t->color ?? '#ce1126'
            ];
        });

        $bcpcChartConfig = $bcpcTypes->map(function ($t) {
            return [
                'key' => strtolower($t->name),
                'label' => $t->name,
                'color' => $t->color ?? '#0057b7'
            ];
        });


        // GAD Analytics Data
        $gadActivities = \App\Models\GadActivity::whereYear('date_scheduled', $currentYear)->get();

        $gadStats = [
            'total_utilized' => $gadActivities->where('status', 'Completed')->sum('actual_expenditure'),
            'total_activities' => $gadActivities->count(),
            'completed_count' => $gadActivities->where('status', 'Completed')->count(),
            'monthly_spending' => []
        ];

        // Format Monthly Spending for Chart
        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $spending = $gadActivities->filter(function ($act) use ($monthNum) {
                return Carbon::parse($act->date_scheduled)->month === $monthNum;
            })->sum('actual_expenditure');

            $gadStats['monthly_spending'][] = [
                'month' => $monthName,
                'amount' => $spending
            ];
        }

        return Inertia::render('Admin/Analytics/Index', [
            'stats' => $stats,
            'analyticsData' => $vawcData, // Default for non-toggle views if any
            'vawcData' => $vawcData,
            'bcpcData' => $bcpcData,
            'currentYear' => (int) $currentYear,
            'chartConfig' => $vawcChartConfig,
            'vawcChartConfig' => $vawcChartConfig,
            'bcpcChartConfig' => $bcpcChartConfig,
            'gadStats' => $gadStats
        ]);
    }

    public function print(Request $request)
    {
        $year = $request->input('year', Carbon::now()->year);

        // Similar data fetching logic as index
        $abuseTypes = \App\Models\AbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $reports = VawcReport::selectRaw('MONTH(incident_date) as month, abuse_type, COUNT(*) as count')
            ->whereYear('incident_date', $year)
            ->whereNotNull('abuse_type')
            ->where('status', '!=', 'Dismissed')
            ->groupBy('month', 'abuse_type')
            ->get();

        $data = $this->formatAnalyticsData($reports, $abuseTypes);

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

    private function formatAnalyticsData($reports, $abuseTypes)
    {
        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        $formattedData = [];

        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $monthData = ['month' => $monthName];

            foreach ($abuseTypes as $type) {
                $key = strtolower($type->name);

                $record = $reports->where('month', $monthNum)
                    ->first(function ($item) use ($type) {
                        return strcasecmp($item->abuse_type, $type->name) === 0;
                    });

                $count = $record ? $record->count : 0;
                $monthData[$key] = $count;
            }
            $formattedData[] = $monthData;
        }
        return $formattedData;
    }
}