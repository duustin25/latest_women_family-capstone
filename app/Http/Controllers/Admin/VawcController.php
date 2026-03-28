<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VawcCase;
use App\Models\CaseAbuseType;
use App\Models\Zone;
use App\Services\VawcCaseService;
use App\Services\VawcBpoService;
use App\Services\VawcComplianceService;
use App\Services\VawcLegalService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class VawcController extends Controller
{
    protected $vawcService;
    protected $bpoService;
    protected $complianceService;
    protected $legalService;

    public function __construct(VawcCaseService $vawcService, VawcBpoService $bpoService, VawcComplianceService $complianceService, VawcLegalService $legalService)
    {
        $this->vawcService = $vawcService;
        $this->bpoService = $bpoService;
        $this->complianceService = $complianceService;
        $this->legalService = $legalService;
    }

    /**
     * Display a listing of VAWC cases.
     */
    public function index()
    {
        $cases = VawcCase::with(['caseReport.abuseType', 'involvedParties'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/Vawc/Index', [
            'cases' => $cases
        ]);
    }

    /**
     * Show the form for creating a new VAWC case (Wireframe).
     */
    public function create()
    {
        $abuseTypes = CaseAbuseType::where('is_active', true)
            ->where(function ($query) {
                $query->where('category', 'VAWC')
                    ->orWhere('category', 'Both');
            })->get();

        $zones = Zone::where('is_active', true)->get();

        return Inertia::render('Admin/Vawc/Create', [
            'abuseTypes' => $abuseTypes,
            'zones' => $zones
        ]);
    }

    /**
     * Store a newly created VAWC case.
     */
    public function store(Request $request)
    {
        // Validation for the specialized VAWC form
        $validated = $request->validate([
            'intake_type' => 'required|in:Direct,Third-Party',
            'victim.name' => 'required|string|max:255',
            'victim.age' => 'nullable|integer',
            'victim.gender' => 'nullable|string',
            'victim.contact' => 'nullable|string',
            'victim.address' => 'nullable|string',

            'complainant.name' => 'nullable|string|max:255',
            'complainant.contact' => 'nullable|string',

            'respondent.name' => 'nullable|string|max:255',
            'respondent.age' => 'nullable|integer',
            'respondent.gender' => 'nullable|string',
            'respondent.contact' => 'nullable|string',
            'respondent.address' => 'nullable|string',

            'incident_date' => 'required', // Relaxed to handle datetime-local string
            'incident_location' => 'required|string',
            'description' => 'required|string',
            'abuse_type' => 'required|string',
            'zone_id' => 'required|exists:zones,id',

            'incident_veracity' => 'boolean',
            'perpetrator_present' => 'boolean',
            'warrantless_arrest_made' => 'boolean',
            'weapons_confiscated' => 'boolean',

            'requires_medical' => 'boolean',
            'requires_alternative_housing' => 'boolean',
        ]);

        $this->vawcService->createVawcCase($validated);

        return redirect()->route('admin.vawc.index')->with('success', 'VAWC Case recorded successfully.');
    }

    /**
     * Display the specified VAWC case (Wireframe).
     */
    public function show($id)
    {
        $case = VawcCase::with(['caseReport.abuseType', 'involvedParties', 'assessment', 'protectionOrders.issuedBy', 'complianceLogs', 'escalations'])
            ->findOrFail($id);

        return Inertia::render('Admin/Vawc/Show', [
            'case' => $case
        ]);
    }

    /**
     * File a BPO application for a case.
     */
    public function applyBpo($id, Request $request)
    {
        $case = VawcCase::findOrFail($id);
        $this->bpoService->fileApplication($case, $request->all());

        return redirect()->back()->with('success', 'BPO Application filed.');
    }

    /**
     * Issue the applied BPO (marks SLA).
     */
    public function issueBpo($id, Request $request)
    {
        $case = VawcCase::findOrFail($id);

        // Find the latest 'Applied' BPO
        $order = $case->protectionOrders()
            ->where('status', 'Applied')
            ->latest()
            ->firstOrFail();

        $this->bpoService->issueOrder($order, $request->all());

        return redirect()->back()->with('success', 'BPO Issued successfully.');
    }

    /**
     * Record how the BPO was served (Personally vs Residence).
     */
    public function recordBpoService($id, Request $request)
    {
        $case = VawcCase::findOrFail($id);
        $order = $case->protectionOrders()
            ->where('status', 'Issued')
            ->latest()
            ->firstOrFail();

        $this->bpoService->recordService($order, $request->all());

        return redirect()->back()->with('success', 'BPO Service recorded.');
    }

    /**
     * Show a printable transmittal letter for the PNP (Step 7).
     */
    public function pnpTransmittal($id)
    {
        $case = VawcCase::with(['caseReport', 'involvedParties', 'protectionOrders'])
            ->findOrFail($id);

        /** @var \App\Models\VawcProtectionOrder $order */
        $order = $case->protectionOrders()
            ->whereIn('status', ['Issued', 'Served'])
            ->latest()
            ->firstOrFail();

        // Log the transmittal if it hasn't been logged yet
        if ($order->transmittals()->where('agency', 'PNP Women and Children Protection')->count() === 0) {
            $this->bpoService->recordTransmittal($order);
        }

        return Inertia::render('Admin/Vawc/PnpTransmittal', [
            'case' => $case,
            'order' => $order,
            'officer' => \Illuminate\Support\Facades\Auth::user()
        ]);
    }

    /**
     * Log a compliance monitoring entry (RA 9262 Steps 8-11).
     */
    public function logCompliance($id, Request $request)
    {
        $case = VawcCase::findOrFail($id);

        $request->validate([
            'is_compliant' => 'required|boolean',
            'notes' => 'nullable|string',
            'needs_counseling' => 'boolean',
            'referral_type' => 'nullable|string',
            'referral_details' => 'nullable|string',
        ]);

        $this->complianceService->logMonitoring($case, $request->all());

        return redirect()->back()->with('success', 'Compliance log recorded.');
    }

    /**
     * Escalate a BPO violation (RA 9262 Step 12).
     */
    public function escalate($id, Request $request)
    {
        $case = VawcCase::findOrFail($id);

        $request->validate([
            'referral_target' => 'required|string',
            'violation_datetime' => 'required|date',
            'escorted_by_pb' => 'boolean',
            'violation_description' => 'required|string',
        ]);

        $this->legalService->escalateCase($case, $request->all());

        return redirect()->back()->with('success', 'Case escalated to legal authorities.');
    }

    /**
     * Show a printable court complaint assistance form (Step 12).
     */
    public function complaintForm($id)
    {
        $case = VawcCase::with(['caseReport', 'involvedParties.vawcCase'])
            ->findOrFail($id);

        return Inertia::render('Admin/Vawc/ComplaintForm', [
            'case' => $case,
            'officer' => \Illuminate\Support\Facades\Auth::user()
        ]);
    }

    /**
     * Display the VAWC Management Dashboard with Analytics.
     */
    public function dashboard()
    {
        $totalCases = VawcCase::count();

        $casesByStatus = VawcCase::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        $casesByIntake = VawcCase::select('intake_type', DB::raw('count(*) as count'))
            ->groupBy('intake_type')
            ->get();

        // Join with CaseReports to get Abuse Type stats
        $casesByAbuseType = DB::table('vawc_cases')
            ->join('case_reports', 'vawc_cases.case_report_id', '=', 'case_reports.id')
            ->leftJoin('case_types', 'case_reports.abuse_type_id', '=', 'case_types.id')
            ->select(DB::raw('COALESCE(case_types.name, "Uncategorized") as name'), DB::raw('count(*) as count'))
            ->groupBy('name')
            ->get();

        // SLA Compliance: BPOs issued on the same day
        $totalBpos = DB::table('vawc_protection_orders')->where('type', 'BPO')->count();
        $compliantBpos = DB::table('vawc_protection_orders')
            ->where('type', 'BPO')
            ->where('is_sla_breached', false)
            ->whereNotNull('issued_datetime')
            ->count();

        $slaRate = $totalBpos > 0 ? round(($compliantBpos / $totalBpos) * 100, 1) : 100;

        // Cases by Zone
        $casesByZone = DB::table('vawc_cases')
            ->join('case_reports', 'vawc_cases.case_report_id', '=', 'case_reports.id')
            ->leftJoin('zones', 'case_reports.zone_id', '=', 'zones.id')
            ->select(DB::raw('COALESCE(zones.name, "Unknown Zone") as name'), DB::raw('count(*) as count'))
            ->groupBy('name')
            ->get();

        return Inertia::render('Admin/Vawc/Dashboard', [
            'stats' => [
                'total_cases' => $totalCases,
                'status_distribution' => $casesByStatus,
                'intake_distribution' => $casesByIntake,
                'abuse_distribution' => $casesByAbuseType,
                'zone_distribution' => $casesByZone,
                'sla_compliance' => [
                    'total' => $totalBpos,
                    'compliant' => $compliantBpos,
                    'rate' => $slaRate
                ]
            ]
        ]);
    }
}
