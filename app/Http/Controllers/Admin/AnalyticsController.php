<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\VawcReport;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index()
    {
        $currentYear = 2026; // Mock for prompt or Carbon::now()->year;

        // Fetch dynamic types
        $abuseTypes = \App\Models\AbuseType::where('is_active', true)->get();

        $reports = VawcReport::selectRaw('MONTH(incident_date) as month, abuse_type, COUNT(*) as count')
            ->whereYear('incident_date', $currentYear)
            ->whereNotNull('abuse_type')
            ->groupBy('month', 'abuse_type')
            ->get();

        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        $formattedData = [];

        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $monthData = ['month' => $monthName];

            // Dynamically build keys for each abuse type // turbo
            foreach ($abuseTypes as $type) {
                // Determine key from name (e.g. 'Physical' -> 'physical')
                $key = strtolower($type->name);

                // Case-insensitive filtering using PHP logic on the Collection
                $record = $reports->where('month', $monthNum)
                    ->first(function ($item) use ($type) {
                        return strcasecmp($item->abuse_type, $type->name) === 0;
                    });

                $count = $record ? $record->count : 0;
                $monthData[$key] = $count;
            }

            $formattedData[] = $monthData;
        }

        // Mock stats
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
            'analyticsData' => $formattedData,
            'currentYear' => $currentYear,
            'chartConfig' => $chartConfig
        ]);
    }
}