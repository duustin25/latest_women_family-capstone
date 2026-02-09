
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, AlertTriangle, CheckCircle2, DollarSign, PieChart, Printer, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";


declare const route: (name: string, params?: any) => string;

interface GadActivity {
    id: number;
    title: string;
    activity_type: string;
    status: string;
    total_project_cost: number;
    actual_expenditure: number;
    created_at: string;
    date_scheduled: string;
}

interface DashboardProps {
    totalUtilized: number;
    recentActivities: GadActivity[];
}

export default function GadDashboard({ totalUtilized = 0, recentActivities = [] }: DashboardProps) {
    // Persistent Budget State
    const [annualBudget, setAnnualBudget] = useState<number>(() => {
        const saved = localStorage.getItem('gad_annual_budget');
        const parsed = saved ? parseFloat(saved) : 0;
        return isNaN(parsed) || parsed === 0 ? 1000000 : parsed;
    });

    useEffect(() => {
        localStorage.setItem('gad_annual_budget', annualBudget.toString());
    }, [annualBudget]);

    const safeTotalUtilized = Number(totalUtilized) || 0;
    const remainingBalance = annualBudget - safeTotalUtilized;
    const utilizationRate = annualBudget > 0 ? (safeTotalUtilized / annualBudget) * 100 : 0;

    return (
        <AppLayout breadcrumbs={[{ title: 'GAD Dashboard', href: '/admin/gad/dashboard' }]}>
            <Head title="GAD Dashboard" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">
                                    GAD Overview
                                </h2>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Monitor Gender and Development Budget & Activities.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <a href={route('admin.gad.print')} target="_blank">
                                <Button variant="outline" className="h-12 px-6 rounded-full border-2 border-neutral-200 hover:border-neutral-300 text-neutral-600 font-bold uppercase tracking-wide text-xs">
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print Report
                                </Button>
                            </a>
                            <Link href={route('admin.gad.activities.create')}>
                                <Button className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-2 border-transparent dark:border-neutral-700">
                                    <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                                    <span className="font-bold uppercase tracking-wide text-xs">New Activity</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* BUDGET TRACKER SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* TOTAL BUDGET */}
                        <Card className="bg-white dark:bg-neutral-900 border-none shadow-sm rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <DollarSign size={80} />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Annual Allocation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-1 mb-1">
                                    <span className="text-2xl font-black text-neutral-900 dark:text-white">₱</span>
                                    <Input
                                        type="number"
                                        value={annualBudget}
                                        onChange={(e) => setAnnualBudget(parseFloat(e.target.value) || 0)}
                                        className="text-6xl font-black text-neutral-900 dark:text-white border-none shadow-none focus-visible:ring-0 p-0 h-auto w-full bg-transparent tracking-tighter"
                                    />
                                </div>
                                <p className="text-xs text-neutral-500 font-medium ml-1">
                                    Represents 5% of Total Appropriations.
                                </p>
                            </CardContent>
                        </Card>

                        {/* UTILIZED */}
                        <Card className="bg-white dark:bg-neutral-900 border-none shadow-sm rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-500">
                                <TrendingUp size={80} />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Utilized Fund</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter mb-1">
                                    ₱{safeTotalUtilized.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="flex items-center gap-2 ml-1">
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none uppercase text-[10px] font-bold">
                                        {utilizationRate.toFixed(1)}% Utilized
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* REMAINING */}
                        <Card className="bg-white dark:bg-neutral-900 border-none shadow-sm rounded-3xl relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${remainingBalance < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                <PieChart size={80} />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Remaining Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-4xl font-black tracking-tighter mb-1 ${remainingBalance < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                    ₱{remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-neutral-500 font-medium ml-1">
                                    Available for future activities.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* UTILIZATION ALERT */}
                    {utilizationRate < 5 && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl mb-8 flex items-start gap-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="text-amber-900 dark:text-amber-400 font-bold uppercase text-xs tracking-wide">Low Utilization Notice</h4>
                                <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                                    Utilization is currently at <span className="font-bold">{utilizationRate.toFixed(2)}%</span>.
                                    Legal mandate requires full utilization of the 5% GAD fund allocation.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* RECENT ACTIVITIES TABLE */}
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">Recent Activities</h3>
                            <p className="text-neutral-500 text-sm font-medium">Latest budget movements and events.</p>
                        </div>

                        <Link href={route('admin.gad.activities.index')}>
                            <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900">
                                View All <ArrowUpRight size={14} className="ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-5 pl-8">Activity Name</th>
                                        <th className="p-5">Type</th>
                                        <th className="p-5">Date Scheduled</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5 text-right pr-8">Expenditure</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {recentActivities.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <Activity size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No activities found</h3>
                                                    <p className="text-xs text-neutral-500">Start by creating a new activity.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        recentActivities.map((activity) => (
                                            <tr key={activity.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="p-5 pl-8 align-middle">
                                                    <span className="text-sm font-bold text-neutral-900 dark:text-white block uppercase tracking-tight">
                                                        {activity.title}
                                                    </span>
                                                </td>
                                                <td className="p-5 align-middle">
                                                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-tight">
                                                        {activity.activity_type}
                                                    </span>
                                                </td>
                                                <td className="p-5 align-middle">
                                                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-tight">
                                                        {new Date(activity.date_scheduled).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="p-5 align-middle">
                                                    <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${activity.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                        activity.status === 'Ongoing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                            'bg-neutral-50 text-neutral-600 border-neutral-200'
                                                        }`}>
                                                        {activity.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-5 pr-8 align-middle text-right">
                                                    <span className="font-bold text-neutral-900 dark:text-white">
                                                        ₱{activity.actual_expenditure?.toLocaleString() || '0.00'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
