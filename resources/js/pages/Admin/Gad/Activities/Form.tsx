import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

declare const route: (name: string, params?: any) => string;

// Props
interface FormProps {
    activity?: any;
}

export default function GadActivityForm({ activity }: FormProps) {
    const isEdit = !!activity;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: activity?.title || '',
        activity_type: activity?.activity_type || 'Client-Focused',
        status: activity?.status || 'Planned',
        date_scheduled: activity?.date_scheduled ? activity.date_scheduled.split('T')[0] : '', // Format for date input
        total_project_cost: activity?.total_project_cost || 0,
        hgdg_score: activity?.hgdg_score || 0,
        gad_chargeable_amount: activity?.gad_chargeable_amount || 0,
        actual_expenditure: activity?.actual_expenditure || 0,
        target_participants: activity?.target_participants || [],
    });

    const [calculatedCharge, setCalculatedCharge] = useState(0);

    // HGDG Calculation Logic
    useEffect(() => {
        let charge = parseFloat(data.total_project_cost.toString()) || 0;

        if (data.activity_type === 'Attribution') {
            const score = parseFloat(data.hgdg_score.toString()) || 0;
            if (score < 4.0) {
                charge = 0;
            } else if (score < 8.0) {
                charge = charge * 0.25;
            } else if (score < 15.0) {
                charge = charge * 0.50;
            } else {
                charge = charge; // 100%
            }
        }

        // If not attribution, it defaults to 100% cost is chargeable (for Client/Org focused)?
        // User prompt says: "If activity_type == 'Attribution', the system must ask for an HGDG Score... Auto-Calculate Budget"
        // It implies other types are 100% charged?
        // Let's assume yes: Client-Focused/Org-Focused are fully GAD activities.

        setCalculatedCharge(charge);
        // We generally don't setData inside effect to avoid loops, but we can display calculatedCharge
        // However, we want to submit it? The controller re-calculates it anyway.
        // So we just show it for user feedback.

    }, [data.total_project_cost, data.activity_type, data.hgdg_score]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.gad.activities.update', activity.id));
        } else {
            post(route('admin.gad.activities.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'GAD Dashboard', href: '/admin/gad/dashboard' },
            { title: 'Activities', href: '/admin/gad/activities' },
            { title: isEdit ? 'Edit Activity' : 'New Activity', href: '#' }
        ]}>
            <Head title={isEdit ? 'Edit GAD Activity' : 'New GAD Activity'} />

            <div className="p-6 max-w-3xl mx-auto">
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{isEdit ? 'Edit Activity' : 'Create New Activity'}</CardTitle>
                            <CardDescription>
                                Fill in the details for the GAD program or activity.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Activity Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="e.g., Seminar on Women's Rights"
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Activity Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="activity_type">Activity Type</Label>
                                    <Select
                                        value={data.activity_type}
                                        onValueChange={(val) => setData('activity_type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Client-Focused">Client-Focused</SelectItem>
                                            <SelectItem value="Org-Focused">Organization-Focused</SelectItem>
                                            <SelectItem value="Attribution">Attributed Program</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.activity_type && <p className="text-sm text-red-500">{errors.activity_type}</p>}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(val) => setData('status', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Planned">Planned</SelectItem>
                                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>
                            </div>

                            {/* Date Scheduled */}
                            <div className="space-y-2">
                                <Label htmlFor="date_scheduled">Date Scheduled</Label>
                                <Input
                                    id="date_scheduled"
                                    type="date"
                                    value={data.date_scheduled}
                                    onChange={e => setData('date_scheduled', e.target.value)}
                                />
                                {errors.date_scheduled && <p className="text-sm text-red-500">{errors.date_scheduled}</p>}
                            </div>

                            {/* Total Cost */}
                            <div className="space-y-2">
                                <Label htmlFor="total_project_cost">Total Project Cost</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₱</span>
                                    <Input
                                        id="total_project_cost"
                                        type="number"
                                        step="0.01"
                                        className="pl-8"
                                        value={data.total_project_cost}
                                        onChange={e => setData('total_project_cost', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                {errors.total_project_cost && <p className="text-sm text-red-500">{errors.total_project_cost}</p>}
                            </div>

                            {/* Actual Expenditure (Only if Completed ideally, but let's allow input) */}
                            <div className="space-y-2">
                                <Label htmlFor="actual_expenditure">Actual Expenditure (Utilization)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₱</span>
                                    <Input
                                        id="actual_expenditure"
                                        type="number"
                                        step="0.01"
                                        className="pl-8"
                                        value={data.actual_expenditure}
                                        onChange={e => setData('actual_expenditure', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Fill this when activity is completed.</p>
                                {errors.actual_expenditure && <p className="text-sm text-red-500">{errors.actual_expenditure}</p>}
                            </div>

                            {/* HGDG Score Section (Conditional) */}
                            {data.activity_type === 'Attribution' && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border space-y-4">
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <Info className="w-5 h-5" />
                                        <h3 className="font-semibold">HGDG Attribute Logic</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hgdg_score">HGDG Score (0 - 20)</Label>
                                        <Input
                                            id="hgdg_score"
                                            type="number"
                                            step="0.01"
                                            max="20"
                                            min="0"
                                            value={data.hgdg_score}
                                            onChange={e => setData('hgdg_score', parseFloat(e.target.value) || 0)}
                                        />
                                        {errors.hgdg_score && <p className="text-sm text-red-500">{errors.hgdg_score}</p>}
                                    </div>

                                    <div className="text-sm text-slate-600 space-y-1">
                                        <p>Score &lt; 4.0: <span className="font-bold">0%</span> Chargeable</p>
                                        <p>Score 4.0 - 7.9: <span className="font-bold">25%</span> Chargeable</p>
                                        <p>Score 8.0 - 14.9: <span className="font-bold">50%</span> Chargeable</p>
                                        <p>Score 15+: <span className="font-bold">100%</span> Chargeable</p>
                                    </div>
                                </div>
                            )}

                            {/* Calculated Chargeable Amount Display */}
                            <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                                <Info className="h-4 w-4" />
                                <AlertTitle>GAD Chargeable Amount</AlertTitle>
                                <AlertDescription>
                                    Based on the type and score,
                                    <span className="font-bold text-lg ml-1">₱{calculatedCharge.toLocaleString()}</span> will be charged to the GAD Budget.
                                </AlertDescription>
                            </Alert>


                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="ghost" type="button" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-purple-600 hover:bg-purple-700">
                                <Save className="w-4 h-4 mr-2" />
                                {isEdit ? 'Update Activity' : 'Save Activity'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
