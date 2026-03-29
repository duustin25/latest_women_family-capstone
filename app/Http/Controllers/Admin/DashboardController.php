<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MembershipApplication;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private array $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    public function index()
    {
        $currentYear = \Carbon\Carbon::now()->year;

        return Inertia::render('dashboard', [
            'analyticsData' => $this->getVawcAnalytics($currentYear),
            'chartConfig' => $this->getVawcChartConfig(),
            'systemStats' => $this->getSystemStats(),
            'recentCases' => $this->getRecentCases(),
            'recentApplications' => $this->getRecentApplications(),
            'membershipStats' => $this->getMembershipStats($currentYear),
            'caseResolutionStats' => $this->getCaseResolutionStats($currentYear)
        ]);
    }

    private function getVawcAnalytics(int $year): array
    {
        $abuseTypes = \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get();

        $reportsRaw = \App\Models\CaseReport::select('incident_date', 'type', 'abuse_type_id', 'lifecycle_status')
            ->where('type', 'VAWC')
            ->whereYear('incident_date', $year)
            ->whereNotNull('abuse_type_id')
            ->get()
            ->groupBy(fn($date) => \Carbon\Carbon::parse($date->incident_date)->month)
            ->map(fn($group) => $group->countBy('abuse_type_id'));

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

        $formattedData = [];
        foreach ($this->months as $index => $monthName) {
            $monthNum = $index + 1;
            $monthData = ['month' => $monthName];

            foreach ($abuseTypes as $type) {
                $key = strtolower($type->name);
                $record = $reports->where('month', $monthNum)
                    ->first(fn($item) => $item->abuse_type_id === $type->id);
                $monthData[$key] = $record ? $record->count : 0;
            }
            $formattedData[] = $monthData;
        }

        return $formattedData;
    }

    private function getVawcChartConfig()
    {
        return \App\Models\CaseAbuseType::where('is_active', true)
            ->whereIn('category', ['VAWC', 'Both'])
            ->get()
            ->map(fn($t) => [
                'key' => strtolower($t->name),
                'label' => $t->name,
                'color' => $t->color ?? '#000000'
            ]);
    }

    private function getSystemStats(): array
    {
        return [
            'totalCases' => \App\Models\CaseReport::count(),
            'totalOrgs' => \App\Models\Organization::count(),
            'totalUsers' => \App\Models\User::count(),
            'pendingApps' => MembershipApplication::where('status', 'Pending')->count()
        ];
    }

    private function getRecentCases()
    {
        return \App\Models\CaseReport::with(['abuseType'])
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(fn($case) => [
                'id' => $case->id,
                'case_number' => $case->case_number,
                'type' => $case->type,
                'subType' => $case->abuseType ? $case->abuseType->name : 'N/A',
                'status' => $case->lifecycle_status,
                'date' => $case->incident_date ? $case->incident_date->format('M d, Y') : $case->created_at->format('M d, Y'),
            ]);
    }

    private function getRecentApplications()
    {
        return MembershipApplication::with(['organization'])
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(fn($app) => [
                'id' => $app->id,
                'name' => $app->fullname,
                'organization' => $app->organization ? $app->organization->name : 'N/A',
                'status' => $app->status,
                'date' => $app->created_at->format('M d, Y'),
            ]);
    }

    private function getMembershipStats(int $year): array
    {
        $membershipsRaw = MembershipApplication::select('created_at', 'status', 'organization_id')
            ->where('status', 'Approved')
            ->whereYear('created_at', $year)
            ->get()
            ->groupBy(fn($date) => \Carbon\Carbon::parse($date->created_at)->month)
            ->map(fn($group) => $group->count());

        $monthlyGrowth = [];
        foreach ($this->months as $index => $monthName) {
            $monthNum = $index + 1;
            $monthlyGrowth[] = [
                'month' => $monthName,
                'count' => $membershipsRaw->get($monthNum, 0)
            ];
        }

        return [
            'total_this_year' => MembershipApplication::where('status', 'Approved')->whereYear('created_at', $year)->count(),
            'total_all_time' => MembershipApplication::where('status', 'Approved')->count(),
            'monthly_growth' => $monthlyGrowth
        ];
    }

    private function getCaseResolutionStats(int $year): array
    {
        $caseResolutionsRaw = \App\Models\CaseReport::select('lifecycle_status')
            ->whereYear('created_at', $year)
            ->get()
            ->groupBy(fn($case) => $case->lifecycle_status ?: 'Unknown')
            ->map(fn($group) => count($group));

        $statusColors = [
            'New' => '#f43f5e',
            'Ongoing' => '#3b82f6',
            'Referred' => '#a855f7',
            'Resolved' => '#10b981',
            'Closed' => '#64748b',
            'Dismissed' => '#ef4444',
            'Unknown' => '#94a3b8'
        ];

        $stats = [];
        foreach ($caseResolutionsRaw as $statusName => $count) {
            $stats[] = [
                'name' => $statusName,
                'value' => $count,
                'fill' => $statusColors[$statusName] ?? sprintf('#%06X', mt_rand(0, 0xFFFFFF))
            ];
        }

        return $stats;
    }
}
