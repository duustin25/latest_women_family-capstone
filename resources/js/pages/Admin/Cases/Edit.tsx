import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Activity, FileText, User } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { route } from 'ziggy-js';

interface CaseData {
    id: number;
    case_number: string;
    type: string;
    status: string;
    victim_name?: string;
    informant_name?: string;
    description: string;
    incident_date?: string;
    abuse_type?: string;
    concern_type?: string;
    referral_to?: string;
    referral_notes?: string;
    created_at: string;
    [key: string]: any;
}

export default function Edit({ caseData, abuseTypes, referralPartners, ongoingStatuses }: { caseData: CaseData, abuseTypes: any[], referralPartners: any[], ongoingStatuses: any[] }) {
    const { data, setData, patch, processing, errors } = useForm({
        type: caseData.type,
        status: caseData.status,
        referral_notes: caseData.referral_notes || '',
    });

    const isVawc = caseData.type === 'VAWC';

    // "Smart Status" Options
    const workflowSteps = Array.from(new Set([
        caseData.status, // Ensure current status is always valid/visible
        "Intake/New",
        // Legacy/Hardcoded - REMOVED
        // isVawc ? "Under Mediation" : "Intervention/Diversion Program",
        // ...(isVawc ? ["BPO Issued"] : []),
        // Dynamic Ongoing Statuses
        ...(ongoingStatuses ? ongoingStatuses.map(s => `Ongoing: ${s.name}`) : []),
        // Dynamic Referrals
        ...(referralPartners ? referralPartners.map(p => `Referred: ${p.name}`) : []),
        "Resolved",
        "Closed",
        "Dismissed"
    ]));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.cases.update', caseData.id));
    };

    // Helper to determine badge color
    const getStatusColor = (s: string) => {
        if (s === 'New') return 'bg-red-500';
        if (s === 'ongoing') return 'bg-blue-500';
        // Treat dynamic statuses as blue/ongoing by default
        if (ongoingStatuses && ongoingStatuses.some(os => os.name === s)) return 'bg-blue-500';

        if (s === 'referred') return 'bg-purple-500';
        if (s === 'Resolved') return 'bg-emerald-500';
        if (s === 'Closed') return 'bg-slate-500';
        if (s === 'Dismissed') return 'bg-black-500 border-black-500';
        return 'bg-slate-500';
    };



    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Cases', href: '/admin/cases' },
            { title: `Manage Case ${caseData.case_number}`, href: '#' }
        ]}>
            <Head title={`Edit Case ${caseData.case_number}`} />

            <div className="p-6 lg:p-8 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: CASE DETAILS (Read Only for context) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Case Management
                            </h2>
                            <p className="text-slate-500 text-l mt-1 font-mono">
                                REF: {caseData.case_number}
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Return
                        </Button>
                    </div>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-10 h-10 text-blue-600" />
                                Case Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 border-t">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-l font-black uppercase text-slate-500">Victim Name</Label>
                                    <p className="font-bold">{caseData.victim_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-l font-black uppercase text-slate-500">Case Type</Label>
                                    <Badge variant={isVawc ? "destructive" : "default"}>{caseData.type}</Badge>
                                </div>
                                <div>
                                    {isVawc ? (
                                        <>
                                            <Label className="text-l font-black uppercase text-slate-500">Abuse Type</Label>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{caseData.abuse_type || 'N/A'}</p>
                                        </>
                                    ) : (
                                        <>
                                            <Label className="text-l font-black uppercase text-slate-500">Nature of Concern</Label>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{caseData.concern_type || 'N/A'}</p>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-l font-black uppercase text-slate-500">Date Filed</Label>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{new Date(caseData.created_at).toLocaleDateString()}</p>
                                </div>
                                {isVawc ? (
                                    <>
                                        <div>
                                            <Label className="text-l font-black uppercase text-slate-500">Complainant</Label>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{caseData.complainant_name || 'Same as Victim'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-l font-black uppercase text-slate-500">Relation</Label>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{caseData.relation_to_victim || 'N/A'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="text-l font-black uppercase text-slate-500">Contact Info</Label>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{caseData.complainant_contact || 'N/A'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <Label className="text-l font-black uppercase text-slate-500">Informant</Label>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{caseData.informant_name || 'Anonymous'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-l font-black uppercase text-slate-500">Contact</Label>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">{caseData.informant_contact || 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div>
                                <Label className="text-l font-black uppercase text-slate-500">Current DB Status</Label>
                                <div className="mt-1">
                                    <Badge className={`${getStatusColor(caseData.status)} text-lg text-white`}>{caseData.status}</Badge>
                                </div>
                            </div>

                            <div>
                                <Label className="text-l font-black uppercase text-slate-500">Description / Narrative</Label>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-md text-slate-700 dark:text-slate-100 mt-2 min-h-[100px] whitespace-pre-wrap">
                                    {caseData.description}
                                </div>
                            </div>

                            {caseData.referral_to && (
                                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                                    <h4 className="text-xs font-black uppercase text-purple-700 mb-1">External Referral Active</h4>
                                    <p className="text-sm text-purple-800">
                                        Case referred to <b>{caseData.referral_to}</b>. Check referral notes for more details.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: ACTIONS & SMART STATUS */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-t-4 border-t-[#ce1126]">
                        <CardHeader>
                            <CardTitle className="text-[19px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#ce1126]" />
                                Update Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-l font-bold uppercase">Select Process Step</Label>
                                    <p className="text-[15px] text-slate-500 dark:text-slate-400 mb-2 leading-tight">
                                        Choose the current case status. Referrals and Ongoing statuses are automatically tracked.
                                    </p>
                                    <Select
                                        onValueChange={v => setData('status', v)}
                                        defaultValue={workflowSteps.includes(caseData.status) ? caseData.status : undefined}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select Process Step..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {workflowSteps.map(step => (
                                                <SelectItem key={step} value={step} className="font-medium text-sm">
                                                    {step}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-l font-bold uppercase">Remarks / Referral Notes</Label>
                                    <Textarea
                                        placeholder="Add notes about this status update..."
                                        value={data.referral_notes || ''}
                                        onChange={e => setData('referral_notes', e.target.value)}
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <Button
                                    className="w-full bg-[#ce1126] hover:bg-red-700 text-white font-black uppercase tracking-widest"
                                    disabled={processing}
                                >
                                    <Save className="w-4 h-4 mr-2" /> Update Case State
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Quick Info Panel */}
                    <div className="p-4 rounded-xl border border-blue-100">
                        <h4 className="text-[19px] font-black uppercase mb-2">Process Guide</h4>
                        <ul className="text-[16px] space-y-1 list-disc pl-4">
                            <li><b>Intake:</b> Initial filing and interview.</li>
                            <li><b>Ongoing:</b> Case placed under active monitoring or intervention.</li>
                            <li><b>Referral:</b> Handed off to external agencies (PNP, DSWD, etc).</li>
                            <li><b>Resolved/Closed:</b> Final case disposition.</li>
                            <li><b>Dismissed:</b> Invalid, error, or withdrawn cases.</li>
                        </ul>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}