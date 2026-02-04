import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    Users,
    ShieldAlert,
    Building2,
    TrendingUp,
    Clock,
    Activity,
    FileText,
    BarChart3,
    ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

import AbuseRateChart from '@/components/AbuseRateChart';

export default function Dashboard({ analyticsData }: { analyticsData: any[] }) {
    const stats = [
        { label: 'Total Cases', value: '42', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        { label: 'Active Members', value: '156', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Organizations', value: '5', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    ];

    // MOCK DATA: Synced with your Analytics requirements
    const trends = [
        { month: 'JANUARY', vawc: 12, cpp: 8 },
        { month: 'FEBRUARY', vawc: 18, cpp: 6 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                            System Overview
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                            Brgy. 183 Villamor • Women and Family Protection
                        </p>
                    </div>
                </div>

                {/* 2. Stat Cards Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm transition-all hover:border-blue-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">
                                        {stat.label}
                                    </p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 w-fit px-2 py-1 rounded">
                                <TrendingUp size={12} /> +12% from last month
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Main Content: Case Monitoring & Advanced Analytics */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {/* Recent Cases Table */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                                <Activity className="w-4 h-4 text-blue-600" /> Recent Case Reports
                            </h3>
                            <Button variant="ghost" className="text-[10px] font-black uppercase dark:text-slate-400">View All</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Classification</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                                    <tr className="border-t border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4">#VAWC-2026-001</td>
                                        <td className="px-6 py-4 text-red-600 dark:text-red-400">Physical Abuse</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 rounded text-[9px]">On-going</span></td>
                                        <td className="px-6 py-4 text-slate-400">Jan 28, 2026</td>
                                    </tr>
                                    <tr className="border-t border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4">#CPP-2026-014</td>
                                        <td className="px-6 py-4 text-blue-600 dark:text-blue-400">Neglect</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500 rounded text-[9px]">Resolved</span></td>
                                        <td className="px-6 py-4 text-slate-400">Jan 27, 2026</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Tasks */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                        <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                            <Clock className="w-4 h-4 text-orange-500" /> Quick Tasks
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                                <FileText className="text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Monthly Report</p>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold">Due in 2 days</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Users className="text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Member Verifications</p>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold">12 Applications</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Comparison Chart Section (Integrated from Analytics) */}
                    <div className="lg:col-span-3">
                        <AbuseRateChart analyticsData={analyticsData} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}