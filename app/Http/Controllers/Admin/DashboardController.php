<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MembershipApplication;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {

        $currentYear = \Carbon\Carbon::now()->year;

        //fetch dynamics 
        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $reportsRaw = \App\Models\CaseReport::select('incident_date', 'type', 'abuse_type_id', 'case_status_id')
            ->where('type', 'VAWC')
            ->whereYear('incident_date', $currentYear)
            ->whereNotNull('abuse_type_id')
            ->get()
            ->groupBy(function ($date) {
                return \Carbon\Carbon::parse($date->incident_date)->month;
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

        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV ', 'DEC'];
        $formattedData = [];

        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $monthData = ['month' => $monthName];

            foreach ($abuseTypes as $type) {
                $key = strtolower($type->name);
                $record = $reports->where('month', $monthNum)
                    ->first(function ($item) use ($type) {
                        return $item->abuse_type_id === $type->id;
                    });
                $monthData[$key] = $record ? $record->count : 0;
            }
            $formattedData[] = $monthData;
        }

        //pass types meta for chart colors.
        $chartConfig = $abuseTypes->map(function ($t) {
            return [
                'key' => strtolower($t->name),
                'label' => $t->name,
                'color' => $t->color ?? '#000000'
            ];
        });

        //dashboard quick stats 
        $stats = [
            'totalCases' => \App\Models\CaseReport::count(),
            'totalOrgs' => \App\Models\Organization::count(),
            'totalUsers' => \App\Models\User::count(),
            'totalPendingApp' => \App\Models\MembershipApplication::where('status', 'Pending')->count()
        ];

        // Recent case reports
        $recentCases = \App\Models\CaseReport::with(['abuseType'])
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(function ($case) {
                return [
                    'id' => $case->id,
                    'case_number' => $case->case_number,
                    'type' => $case->type,
                    'subType' => $case->abuseType ? $case->abuseType->name : 'N/A',
                    'status' => $case->lifecycle_status,
                    'date' => $case->incident_date ? $case->incident_date->format('M d, Y') : $case->created_at->format('M d, Y'),
                ];
            });

        // Recent Membership Applications table
        $recentApplications = MembershipApplication::with(['organization'])
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'name' => $app->fullname,
                    'organization' => $app->organization ? $app->organization->name : 'N/A',
                    'status' => $app->status,
                    'date' => $app->created_at->format('M d, Y'),
                ];
            });

        // Organization Membership Growth
        $membershipsRaw = MembershipApplication::select('created_at', 'status', 'organization_id')
            ->where('status', 'Approved')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(function ($date) {
                return \Carbon\Carbon::parse($date->created_at)->month;
            })
            ->map(function ($group) {
                return $group->count();
            });

        // Case Resolution Rates
        $caseResolutionsRaw = \App\Models\CaseReport::select('lifecycle_status')
            ->whereYear('created_at', $currentYear)
            ->get()
            ->groupBy(function ($case) {
                return $case->lifecycle_status ?: 'Unknown';
            })
            ->map(function ($group) {
                return count($group);
            });

        $membershipStats = [
            'total_this_year' => MembershipApplication::where('status', 'Approved')->whereYear('created_at', $currentYear)->count(),
            'total_all_time' => MembershipApplication::where('status', 'Approved')->count(),
            'monthly_growth' => []
        ];

        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $membershipStats['monthly_growth'][] = [
                'month' => $monthName,
                'count' => $membershipsRaw->get($monthNum, 0)
            ];
        }

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
            $caseResolutionStats[] = [
                'name' => $statusName,
                'value' => $count,
                'fill' => $statusColors[$statusName] ?? sprintf('#%06X', mt_rand(0, 0xFFFFFF))
            ];
        }

        return Inertia::render('dashboard', [
            'analyticsData' => $formattedData,
            'chartConfig' => $chartConfig,
            'systemStats' => $stats,
            'recentCases' => $recentCases,
            'recentApplications' => $recentApplications,
            'membershipStats' => $membershipStats,
            'caseResolutionStats' => $caseResolutionStats
        ]);
    }
}
