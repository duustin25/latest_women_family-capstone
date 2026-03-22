<?php

namespace App\Services;

use App\Models\CaseReport;
use App\Models\MembershipApplication;
use App\Models\Zone;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AnalyticsService
{
    /**
     * Get statistics for the dashboard ribbon.
     */
    public function getRibbonStats(int $year): array
    {
        return [
            'totalVawc' => CaseReport::where('type', 'VAWC')->whereYear('created_at', $year)->count(),
            'totalBcpc' => CaseReport::where('type', 'BCPC')->whereYear('created_at', $year)->count(),
            'activeReferrals' => \App\Models\CaseReferral::whereIn('status', ['Pending', 'Accepted'])->whereYear('created_at', $year)->count(),
            'growth' => '+0%', // Future: Calculate actual growth
        ];
    }

    /**
     * Get case counts grouped by month and abuse type.
     */
    public function getMonthlyCaseAnalytics(string $type, int $year, Collection $abuseTypes): array
    {
        $reports = CaseReport::select('incident_date', 'created_at', 'abuse_type_id')
            ->where('type', $type)
            ->whereYear($type === 'VAWC' ? 'incident_date' : 'created_at', $year)
            ->whereNotNull('abuse_type_id')
            ->get()
            ->groupBy(function ($report) use ($type) {
                return Carbon::parse($type === 'VAWC' ? $report->incident_date : $report->created_at)->month;
            })
            ->map(fn($group) => $group->countBy('abuse_type_id'));

        return $this->formatMonthlyData($reports, $abuseTypes);
    }

    /**
     * Get demographic breakdown by age.
     */
    public function getAgeDemographics(int $year): array
    {
        $casesWithAge = CaseReport::select('victim_age')
            ->whereNotNull('victim_age')
            ->whereYear('created_at', $year)
            ->get();

        $ageCategories = [
            '0-12 yrs (Child)' => 0,
            '13-17 yrs (Teen)' => 0,
            '18-35 yrs (Young Adult)' => 0,
            '36-50 yrs (Adult)' => 0,
            '51+ yrs (Senior)' => 0,
        ];

        foreach ($casesWithAge as $case) {
            $age = (int) $case->victim_age;
            if ($age <= 12) $ageCategories['0-12 yrs (Child)']++;
            elseif ($age <= 17) $ageCategories['13-17 yrs (Teen)']++;
            elseif ($age <= 35) $ageCategories['18-35 yrs (Young Adult)']++;
            elseif ($age <= 50) $ageCategories['36-50 yrs (Adult)']++;
            else $ageCategories['51+ yrs (Senior)']++;
        }

        return collect($ageCategories)->map(fn($count, $name) => ['name' => $name, 'count' => $count])->values()->toArray();
    }

    /**
     * Get distribution of cases by Zone.
     */
    public function getZoneDistribution(int $year): array
    {
        return Zone::withCount(['caseReports' => function ($query) use ($year) {
            $query->whereYear('created_at', $year);
        }])
        ->get()
        ->map(fn($zone) => [
            'name' => $zone->name,
            'count' => $zone->case_reports_count,
            'color' => $zone->color_code,
        ])
        ->toArray();
    }

    /**
     * Get membership application growth trends.
     */
    public function getMembershipTrends(int $year): array
    {
        $memberships = MembershipApplication::select('created_at')
            ->where('status', 'Approved')
            ->whereYear('created_at', $year)
            ->get()
            ->groupBy(fn($m) => Carbon::parse($m->created_at)->month)
            ->map(fn($group) => count($group));

        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        $data = [];
        foreach ($months as $index => $monthName) {
            $data[] = [
                'month' => $monthName,
                'count' => $memberships->get($index + 1, 0),
            ];
        }

        $totalThisYear = MembershipApplication::where('status', 'Approved')->whereYear('created_at', $year)->count();
        $totalLastYear = MembershipApplication::where('status', 'Approved')->whereYear('created_at', $year - 1)->count();
        
        $growth = '+0%';
        if ($totalLastYear > 0) {
            $percent = (($totalThisYear - $totalLastYear) / $totalLastYear) * 100;
            $growth = ($percent >= 0 ? '+' : '') . number_format($percent, 1) . '%';
        } elseif ($totalThisYear > 0) {
            $growth = '+100%';
        }

        return [
            'total' => $totalThisYear,
            'growth' => $growth,
            'monthly' => $data,
        ];
    }

    /**
     * Format raw month/count data into the structure expected by the frontend charts.
     */
    private function formatMonthlyData(Collection $groupedReports, Collection $abuseTypes): array
    {
        $months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        $formattedData = [];

        foreach ($months as $index => $monthName) {
            $monthNum = $index + 1;
            $monthData = ['month' => $monthName];

            foreach ($abuseTypes as $type) {
                $key = strtolower($type->name);
                $monthData[$key] = $groupedReports->has($monthNum) ? ($groupedReports->get($monthNum)->get($type->id) ?? 0) : 0;
            }
            $formattedData[] = $monthData;
        }

        return $formattedData;
    }
}
