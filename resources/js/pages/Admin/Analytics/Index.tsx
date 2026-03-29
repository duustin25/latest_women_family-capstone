import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AnalyticsChart from '@/components/Admin/AnalyticsChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp, Users, AlertTriangle, Activity, FileText, Baby,
    Shield, CheckCircle, Clock, Gavel
} from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    BarChart, Bar, AreaChart, Area, Legend
} from 'recharts';
import { cn } from '@/lib/utils';

interface Stats {
    totalVawc: number;
    totalBpos: number;
    slaRate: number;
    activeCases: number;
}

interface ChartData {
    month: string;
    [key: string]: string | number;
}

interface ChartConfig {
    key: string;
    label: string;
    color: string;
}

interface PageProps {
    stats: Stats;
    vawcData: ChartData[];
    currentYear: number;
    vawcChartConfig: ChartConfig[];
    membershipStats: any;
    caseResolutionStats: any[];
    ageDemographics: any[];
    locationDemographics: any[];
    zoneDistribution: any[];
    bpoTrends: any[];
    vawcStatusBreakdown: any[];
}

export default function Index({
    stats, vawcData, currentYear, vawcChartConfig,
    membershipStats, caseResolutionStats, ageDemographics,
    locationDemographics, zoneDistribution, bpoTrends, vawcStatusBreakdown
}: PageProps) {

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Analytics', href: '#' }]}>
            <Head title="Analytics" />

            <div className="p-6 max-w-7xl mx-auto space-y-8">

                {/* ── HEADER ─────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                            <Activity className="w-6 h-6 text-[#ce1126]" />
                            OFFICIAL REPORTING DASHBOARD
                        </h1>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            Real-time statistical reports and situational case intelligence.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Year Filter */}
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-1.5 dark:bg-slate-900 dark:border-slate-700">
                            <span className="text-xs font-bold text-slate-500 text-nowrap">Filter Year:</span>
                            <select
                                className="border-none text-sm font-bold text-slate-900 dark:text-white focus:ring-0 p-0 cursor-pointer bg-transparent"
                                value={currentYear}
                                onChange={(e) => { window.location.href = `?year=${e.target.value}`; }}
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        {/* Print Button */}
                        <a href={`/admin/analytics/print?year=${currentYear}`} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-[#ce1126] hover:bg-red-700 text-white font-bold uppercase tracking-widest gap-2">
                                <FileText className="w-4 h-4" /> Print Report
                            </Button>
                        </a>
                    </div>
                </div>

                {/* ── RIBBON: 4 Key Metrics ────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-[#ce1126]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-[#ce1126]">Total VAWC Cases</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-[#ce1126]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalVawc}</div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">RA 9262 Reports in {currentYear}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-amber-600">Active Cases</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.activeCases}</div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Ongoing and pending action</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-violet-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-violet-600">BPOs Issued</CardTitle>
                            <Shield className="h-4 w-4 text-violet-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalBpos}</div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Barangay protection orders</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-600">BPO SLA Rate</CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.slaRate}%</div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Issued within 24-hr SLA</p>
                        </CardContent>
                    </Card>
                </div>

                {/* ── CORE TREND: Women's Abuse Rates by Month + VAWC Status ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* PRIMARY: Rates of Women's Abuse — preserved as requested */}
                    <Card className="lg:col-span-2 shadow-sm border overflow-hidden">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b bg-gray-50/50 dark:bg-slate-900/50">
                            <div>
                                <CardTitle className="font-black uppercase text-sm tracking-widest text-[#ce1126]">
                                    Rates of Women's Abuse (Monthly)
                                </CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                    Chronological breakdown of abuse types for {currentYear}
                                </CardDescription>
                            </div>
                            <Badge variant="destructive" className="mt-2 sm:mt-0 w-fit text-[10px] uppercase tracking-widest">RA 9262</Badge>
                        </CardHeader>
                        <CardContent className="p-6">
                            <AnalyticsChart
                                data={vawcData}
                                config={vawcChartConfig}
                            />
                        </CardContent>
                    </Card>

                    {/* VAWC Case Status Donut */}
                    <Card className="shadow-sm border overflow-hidden flex flex-col">
                        <CardHeader className="border-b bg-gray-50/50 dark:bg-slate-900/50">
                            <CardTitle className="uppercase tracking-widest text-sm font-black text-violet-600">VAWC Case Status</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                Lifecycle Stage Distribution
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col justify-center">
                            {vawcStatusBreakdown.length > 0 ? (
                                <>
                                    <div className="h-[220px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={vawcStatusBreakdown}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={90}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                    label={({ name, percent }: any) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                                                    labelLine={false}
                                                >
                                                    {vawcStatusBreakdown.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => [`${value} Cases`, 'Total']}
                                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-3">
                                        {vawcStatusBreakdown.map((stat: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stat.fill }}></div>
                                                <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-300 truncate tracking-widest">
                                                    {stat.name} <span className="text-slate-400 font-bold ml-1">({stat.value})</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                                    <Activity className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-xs font-bold uppercase tracking-widest">No cases recorded for {currentYear}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── BPO ACTIVITY TREND ─────────────────────────── */}
                <Card className="shadow-sm border overflow-hidden">
                    <CardHeader className="border-b bg-gray-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="uppercase tracking-widest text-sm font-black text-violet-600 flex items-center gap-2">
                                <Gavel className="w-4 h-4" /> BPO Issuance Activity
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                Monthly BPO applications filed vs. orders successfully issued — {currentYear}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={bpoTrends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                                    <Area type="monotone" dataKey="applied" name="Filed / Applied" stroke="#a855f7" strokeWidth={2.5} fill="url(#colorApplied)" dot={{ r: 4, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    <Area type="monotone" dataKey="issued" name="Successfully Issued" stroke="#10b981" strokeWidth={2.5} fill="url(#colorIssued)" dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* ── DEMOGRAPHIC SECTION ─────────────────────────── */}
                <div>
                    <h2 className="text-lg font-black tracking-tight flex items-center gap-2 py-4 mb-2 border-b uppercase text-slate-800 dark:text-slate-200">
                        <Users className="w-5 h-5 text-purple-600" />
                        Demographic Statistical Reports
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Victim Age Demographics */}
                        <Card className="shadow-sm border">
                            <CardHeader>
                                <CardTitle className="uppercase tracking-widest text-xs font-black text-purple-600">Victim Age Groups</CardTitle>
                                <CardDescription className="text-xs">Identified vulnerable demographics</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[280px] pl-0 pb-4 pr-6 pt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageDemographics} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} width={110} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                            {ageDemographics.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.name.includes('Child') || entry.name.includes('Teen') ? '#ec4899' : '#a855f7'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Zone Distribution */}
                        <Card className="shadow-sm border">
                            <CardHeader>
                                <CardTitle className="uppercase tracking-widest text-xs font-black text-orange-500">Cases by Zone</CardTitle>
                                <CardDescription className="text-xs">Reported incident distribution across zones</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[280px] pl-0 pb-4 pr-6 pt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={zoneDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f8fafc" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} width={100} />
                                        <Tooltip
                                            formatter={(value) => [`${value} Reports`, 'Cases']}
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Case Resolution Rates (lifecycle) */}
                        <Card className="shadow-sm border flex flex-col">
                            <CardHeader className="border-b bg-gray-50/50 dark:bg-slate-900/50">
                                <CardTitle className="uppercase tracking-widest text-xs font-black text-emerald-600">Case Resolution Rates</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                    Current Lifecycle Status
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 flex-1 flex flex-col justify-center">
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={caseResolutionStats}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                                label={({ name, percent }: any) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                                                labelLine={false}
                                            >
                                                {caseResolutionStats.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [`${value} Cases`, 'Total']}
                                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4">
                                    {caseResolutionStats.map((stat: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2" title={`${stat.value} total cases`}>
                                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stat.fill }}></div>
                                            <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-300 truncate tracking-widest">
                                                {stat.name} <span className="text-slate-400 font-bold ml-1">({stat.value})</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* ── MEMBERSHIP GROWTH ────────────────────────────── */}
                <div className="pb-12">
                    <h2 className="text-lg font-black tracking-tight flex items-center gap-2 py-4 mb-2 border-b uppercase text-slate-800 dark:text-slate-200">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        Registry & Membership Growth Intelligence
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <Card className="lg:col-span-1 shadow-sm border border-emerald-100 dark:border-emerald-900 bg-emerald-50/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-600">Total Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black text-slate-900 dark:text-white leading-none mb-1">{membershipStats.total}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={cn("text-[10px] font-black uppercase px-2 py-1 rounded-full",
                                        (membershipStats.growth || '+0%').startsWith('+') ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600")}>
                                        {membershipStats.growth || '+0%'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Growth Rate</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3 shadow-sm border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Membership Growth Trend</CardTitle>
                                <CardDescription className="text-[10px] uppercase font-bold text-slate-400">Monthly breakdown for {currentYear}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[200px] pl-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={membershipStats.monthly}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#10b981"
                                            strokeWidth={4}
                                            dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 7, fill: '#10b981' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
