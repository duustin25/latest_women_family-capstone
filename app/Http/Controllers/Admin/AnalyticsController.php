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

        // 3. SUMMARY RIBBON STATS (Top Row)
        $totalVawc = CaseReport::where('type', 'VAWC')->whereYear('created_at', $currentYear)->count();
        $totalBcpc = CaseReport::where('type', 'BCPC')->whereYear('created_at', $currentYear)->count();
        $activeReferrals = \App\Models\CaseReferral::whereIn('status', ['Pending', 'Accepted'])->whereYear('created_at', $currentYear)->count();
        $growth = '+0%'; // Stub or calculate actual percentage vs last month

        $stats = [
            'totalVawc' => $totalVawc,
            'totalBcpc' => $totalBcpc,
            'activeReferrals' => $activeReferrals,
            'growth' => $growth
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
        // Get all cases and group by their current active lifecycle status
        $caseResolutionsRaw = CaseReport::select('lifecycle_status')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(function ($case) {
                return $case->lifecycle_status ?: 'Unknown';
            })
            ->map(function ($group) {
                return count($group);
            });

        // --- NEW: Demographic Analytics ---

        // 1. Age Demographics
        $casesWithAge = CaseReport::select('victim_age')
            ->whereNotNull('victim_age')
            ->whereYear('created_at', $currentYear)
            ->get();

        $ageCategories = [
            '0-12 yrs (Child)' => 0,
            '13-17 yrs (Teen)' => 0,
            '18-35 yrs (Young Adult)' => 0,
            '36-50 yrs (Adult)' => 0,
            '51+ yrs (Senior)' => 0,
            'Unknown' => 0
        ];

        foreach ($casesWithAge as $case) {
            $age = (int) $case->victim_age;
            if ($age <= 12)
                $ageCategories['0-12 yrs (Child)']++;
            elseif ($age <= 17)
                $ageCategories['13-17 yrs (Teen)']++;
            elseif ($age <= 35)
                $ageCategories['18-35 yrs (Young Adult)']++;
            elseif ($age <= 50)
                $ageCategories['36-50 yrs (Adult)']++;
            else
                $ageCategories['51+ yrs (Senior)']++;
        }

        $ageDemographics = [];
        foreach ($ageCategories as $range => $count) {
            $ageDemographics[] = [
                'name' => $range,
                'count' => $count
            ];
        }

        // 2. Incident Location (Zone/Purok) Heatmap
        $locationRaw = CaseReport::select('incident_location')
            ->whereNotNull('incident_location')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy('incident_location')
            ->map(function ($group) {
                return count($group);
            })
            ->sortByDesc(function ($count) {
                return $count;
            })
            ->take(8); // Top 8 locations

        $locationDemographics = [];
        foreach ($locationRaw as $location => $count) {
            // Trim long locations for chart aesthetics
            $shortLoc = strlen($location) > 20 ? substr($location, 0, 20) . '...' : $location;
            $locationDemographics[] = [
                'name' => $shortLoc,
                'count' => $count,
                'fullName' => $location
            ];
        }

        // 3. Top Referral Agencies
        $referralsRaw = \App\Models\CaseReferral::with('agency')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy('agency_id')
            ->map(function ($group) {
                return count($group);
            });

        $agencyStats = [];
        $agencyColors = ['#f43f5e', '#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#64748b'];
        $ci = 0;
        foreach ($referralsRaw as $agencyId => $count) {
            $agency = \App\Models\Agency::find($agencyId);
            if ($agency) {
                $agencyStats[] = [
                    'name' => $agency->name,
                    'value' => $count,
                    'fill' => $agencyColors[$ci % count($agencyColors)]
                ];
                $ci++;
            }
        }

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
            'New' => '#f43f5e',
            'Ongoing' => '#3b82f6',
            'Referred' => '#a855f7',
            'Resolved' => '#10b981',
            'Closed' => '#64748b',
            'Dismissed' => '#ef4444',
            'Unknown' => '#94a3b8'
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
            'caseResolutionStats' => $caseResolutionStats,
            'ageDemographics' => $ageDemographics,
            'locationDemographics' => $locationDemographics,
            'agencyStats' => $agencyStats
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