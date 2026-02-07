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

        // Fetch dynamic types for VAWC specifically
        $abuseTypes = \App\Models\AbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $reports = VawcReport::selectRaw('MONTH(incident_date) as month, abuse_type, COUNT(*) as count')
            ->whereYear('incident_date', $currentYear)
            ->whereNotNull('abuse_type')
            ->where('status', '!=', 'Dismissed')
            ->groupBy('month', 'abuse_type')
            ->get();

        $data = $this->formatAnalyticsData($reports, $abuseTypes);

        // Mock stats (Dynamic implementation would query DB)
        $stats = [
            'january' => ['vawc' => 12, 'cpp' => 8],
            'february' => ['vawc' => 18, 'cpp' => 6],
            'growth' => '+20.4%'
        ];

        // Pass types meta for Chart colors
        $chartConfig = $abuseTypes->map(function ($t) {
            return [
                'key' => strtolower($t->name),
                'label' => $t->name,
                'color' => $t->color ?? '#000000'
            ];
        });

        return Inertia::render('Admin/Analytics/Index', [
            'stats' => $stats,
            'analyticsData' => $data,
            'currentYear' => (int) $currentYear,
            'chartConfig' => $chartConfig
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