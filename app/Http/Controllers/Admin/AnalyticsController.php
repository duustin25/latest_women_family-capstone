<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CaseReport;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
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

        $vawcReports = CaseReport::select('incident_date', 'type', 'abuse_type_id', 'case_status_id')
            ->where('type', 'VAWC')
            ->whereYear('incident_date', $currentYear)
            ->whereNotNull('abuse_type_id')
            ->whereHas('status', function ($query) {
                $query->where('name', '!=', 'Closed - Dismissed');
            })
            ->get()
            ->groupBy(function ($date) {
                return Carbon::parse($date->incident_date)->month;
            })
            ->map(function ($group) {
                return $group->countBy('abuse_type_id');
            });

        // Remap to match what formatAnalyticsData expects: [{month: 1, abuse_type_id: 1, count: 5}, ...]
        $vawcReportsFormatted = collect();
        foreach ($vawcReports as $month => $counts) {
            foreach ($counts as $abuseTypeId => $count) {
                $vawcReportsFormatted->push((object) [
                    'month' => $month,
                    'abuse_type_id' => $abuseTypeId,
                    'count' => $count
                ]);
            }
        }

        // Map `abuse_type_id` to `name` so it fits existing `formatAnalyticsData`
        $vawcReportsMapped = $vawcReportsFormatted->map(function ($item) use ($vawcTypes) {
            $typeModel = $vawcTypes->firstWhere('id', $item->abuse_type_id);
            if ($typeModel) {
                $item->abuse_type = $typeModel->name;
            } else {
                $item->abuse_type = 'Unknown';
            }
            return $item;
        });

        $vawcData = $this->formatAnalyticsData($vawcReportsMapped, $vawcTypes);

        // 2. BCPC DATA
        $bcpcReportsRaw = CaseReport::select('created_at', 'type', 'abuse_type_id', 'case_status_id')
            ->where('type', 'BCPC')
            ->whereYear('created_at', $currentYear)
            ->whereNotNull('abuse_type_id')
            ->whereHas('status', function ($query) {
                $query->where('name', '!=', 'Closed - Dismissed');
            })
            ->get()
            ->groupBy(function ($date) {
                return Carbon::parse($date->created_at)->month;
            })
            ->map(function ($group) {
                return $group->countBy('abuse_type_id');
            });

        $bcpcReports = collect();
        foreach ($bcpcReportsRaw as $month => $counts) {
            foreach ($counts as $abuseTypeId => $count) {
                $bcpcReports->push((object) [
                    'month' => $month,
                    'abuse_type_id' => $abuseTypeId,
                    'count' => $count
                ]);
            }
        }

        $bcpcReportsMapped = $bcpcReports->map(function ($item) use ($bcpcTypes) {
            $typeModel = $bcpcTypes->firstWhere('id', $item->abuse_type_id);
            if ($typeModel) {
                $item->abuse_type = $typeModel->name;
            } else {
                $item->abuse_type = 'Unknown';
            }
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


        // --- NEW: Organization Membership Growth ---
        // We get membership approved this year and group by month
        $membershipsRaw = \App\Models\MembershipApplication::select('created_at', 'status', 'organization_id')
            ->where('status', 'Approved')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(function ($date) {
                return Carbon::parse($date->created_at)->month;
            })
            ->map(function ($group) {
                return $group->count();
            });

        // --- NEW: Case Resolution Rates ---
        // Get all cases and group by their current active status name 
        // Note: Joining with case_statuses to get the name
        $caseResolutionsRaw = CaseReport::select('case_status_id')
            ->with('status')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(function ($case) {
                return $case->status ? $case->status->name : 'Unknown';
            })
            ->map(function ($group) {
                return $group->count();
            });

        $membershipStats = [
            'total_this_year' => \App\Models\MembershipApplication::where('status', 'Approved')->whereYear('created_at', $currentYear)->count(),
            'total_all_time' => \App\Models\MembershipApplication::where('status', 'Approved')->count(),
            'monthly_growth' => []
        ];

        // Format Monthly Growth for Chart
        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;

            $membershipStats['monthly_growth'][] = [
                'month' => $monthName,
                'count' => $membershipsRaw->get($monthNum, 0)
            ];
        }

        // Format Case Resolutions for Pie/Doughnut Chart
        $caseResolutionStats = [];
        // Define colors for common statuses
        $statusColors = [
            'Pending' => '#fbbf24',       // amber-400
            'Ongoing' => '#3b82f6',       // blue-500
            'Resolved' => '#10b981',      // emerald-500
            'Closed - Dismissed' => '#ef4444', // red-500
            'Unknown' => '#94a3b8'        // slate-400
        ];

        foreach ($caseResolutionsRaw as $statusName => $count) {
            $caseResolutionStats[] = [
                'name' => $statusName,
                'value' => $count,
                'fill' => $statusColors[$statusName] ?? sprintf('#%06X', mt_rand(0, 0xFFFFFF)) // random hex if not mapped
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
            'membershipStats' => $membershipStats,
            'caseResolutionStats' => $caseResolutionStats
        ]);
    }

    public function print(Request $request)
    {
        $year = $request->input('year', Carbon::now()->year);

        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $reportsRaw = CaseReport::select('incident_date', 'type', 'abuse_type_id', 'case_status_id')
            ->where('type', 'VAWC')
            ->whereYear('incident_date', $year)
            ->whereNotNull('abuse_type_id')
            ->whereHas('status', function ($query) {
                $query->where('name', '!=', 'Closed - Dismissed');
            })
            ->get()
            ->groupBy(function ($date) {
                return Carbon::parse($date->incident_date)->month;
            })
            ->map(function ($group) {
                return $group->countBy('abuse_type_id');
            });

        $reports = collect();
        foreach ($reportsRaw as $month => $counts) {
            foreach ($counts as $abuseTypeId => $count) {
                $reports->push((object) [
                    'month' => $month,
                    'abuse_type_id' => $abuseTypeId,
                    'count' => $count
                ]);
            }
        }

        $reportsMapped = $reports->map(function ($item) use ($abuseTypes) {
            $typeModel = $abuseTypes->firstWhere('id', $item->abuse_type_id);
            if ($typeModel) {
                $item->abuse_type = $typeModel->name;
            } else {
                $item->abuse_type = 'Unknown';
            }
            return $item;
        });

        $data = $this->formatAnalyticsData($reportsMapped, $abuseTypes);

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