import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AnalyticsChart from '@/components/Admin/AnalyticsChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Users, AlertTriangle, Activity, Plus, FileText, Baby } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { useState } from 'react';
import { cn } from '@/lib/utils';
// Ensure route is typed (for Ziggy)
declare const route: (name: string, params?: any) => string;

interface Stats {
    totalVawc: number;
    totalBcpc: number;
    activeReferrals: number;
    growth: string;
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
    bcpcData: ChartData[];
    currentYear: number;
    vawcChartConfig: ChartConfig[];
    bcpcChartConfig: ChartConfig[];
    membershipStats: any;
    caseResolutionStats: any[];
    ageDemographics: any[];
    locationDemographics: any[];
    agencyStats: any[];
}

export default function Index({ stats, vawcData, bcpcData, currentYear, vawcChartConfig, bcpcChartConfig, membershipStats, caseResolutionStats, ageDemographics, locationDemographics, agencyStats }: PageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [chartMode, setChartMode] = useState<'VAWC' | 'BCPC'>('VAWC');

    // Form for Adding New Abuse Type
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        color: '#000000',
    });

    const submitType = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.abuse-types.store'), {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            }
        });
    };

    const isVawc = chartMode === 'VAWC';
    const activeColor = isVawc ? 'text-[#ce1126]' : 'text-blue-600';
    const activeBg = isVawc ? 'bg-[#ce1126]' : 'bg-blue-600';

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Analytics', href: '#' }]}>
            <Head title="Analytics" />

            <div className="p-6 max-w-7x1 mx-auto space-y-8">

                {/* Header with Add Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Activity className="w-6 h-6 text-[#ce1126]" />
                            Analytics Overview
                        </h1>
                        <p className="text-sm">
                            Statistical reports for Women and Children Protection.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            {/* <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="gap-2">
                                    <Plus className="w-4 h-4" /> Add Type
                                </Button>
                            </DialogTrigger> */}
                            {/* ... Content remains same, just moved trigger ... */}
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="font-black uppercase text-[#ce1126]">New Abuse Category</DialogTitle>
                                    <DialogDescription>
                                        Add a new type of abuse to the database.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={submitType} className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right text-xs font-bold uppercase text-slate-500">
                                            Type Name
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Verbal"
                                            className="col-span-3"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {errors.name && <span className="col-span-4 text-right text-red-500 text-xs">{errors.name}</span>}
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="color" className="text-right text-xs font-bold uppercase text-slate-500">
                                            Chart Color
                                        </Label>
                                        <div className="col-span-3 flex items-center gap-2">
                                            <Input
                                                id="color"
                                                type="color"
                                                className="w-12 h-10 p-1"
                                                value={data.color}
                                                onChange={(e) => setData('color', e.target.value)}
                                            />
                                            <span className="text-xs text-slate-400 font-mono">{data.color}</span>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={processing} className="bg-[#ce1126] text-white">
                                            Save Category
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* Year Filter */}
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-1">
                            <span className="text-xs font-bold text-slate-500 text-nowrap">Filter Year:</span>
                            <select
                                className="border-none text-sm font-bold text-slate-900 focus:ring-0 p-0 cursor-pointer bg-transparent"
                                value={currentYear}
                                onChange={(e) => {
                                    window.location.href = `?year=${e.target.value}`;
                                }}
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Print Button */}
                        <a href={`/admin/analytics/print?year=${currentYear}`} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-[#ce1126] hover:bg-red-700 text-white font-black uppercase tracking-widest gap-2">
                                <FileText className="w-4 h-4" /> Print Report
                            </Button>
                        </a>
                    </div>
                </div>

                {/* TOP RIBBON: Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#ce1126]">Total VAWC Cases</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-[#ce1126]" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900">{stats.totalVawc}</div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Reported cases in {currentYear}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-blue-600">Total BCPC Cases</CardTitle>
                            <Baby className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900">{stats.totalBcpc}</div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Child concerns in {currentYear}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-violet-600">Active Referrals</CardTitle>
                            <Activity className="h-4 w-4 text-violet-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900">{stats.activeReferrals}</div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Handled currently by PNP/DSWD/PAO
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* CORE TRENDS: Incident Over Time & Resolution Rates Phase II */}
                <div className="pt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Chart Section */}
                    <Card className="lg:col-span-2 transition-all duration-300 shadow-sm border overflow-hidden">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b bg-gray-50/50 dark:bg-slate-900/50">
                            <div>
                                <CardTitle className={cn("transition-colors duration-300 font-black uppercase text-sm tracking-widest", activeColor)}>
                                    {isVawc ? "Rates of Women's Abuse (Monthly)" : "BCPC Case Concerns (Monthly)"}
                                </CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                    Chronological breakdown of {isVawc ? 'abuse types' : 'child welfare concerns'} for {currentYear}
                                </CardDescription>
                            </div>

                            {/* TOGGLE SWITCH */}
                            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg mt-4 sm:mt-0">
                                <button
                                    onClick={() => setChartMode('VAWC')}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2 text-[10px] uppercase font-black tracking-widest rounded-md transition-all",
                                        isVawc ? "bg-white dark:bg-slate-900 shadow-sm text-[#ce1126]" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    <AlertTriangle className="w-3 h-3" />
                                    VAWC
                                </button>
                                <button
                                    onClick={() => setChartMode('BCPC')}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2 text-[10px] uppercase font-black tracking-widest rounded-md transition-all",
                                        !isVawc ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    <Baby className="w-3 h-3" />
                                    BCPC
                                </button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <AnalyticsChart
                                key={chartMode}
                                data={isVawc ? vawcData : bcpcData}
                                config={isVawc ? vawcChartConfig : bcpcChartConfig}
                            />
                        </CardContent>
                    </Card>

                    {/* Case Status Resolution */}
                    <Card className="shadow-sm border overflow-hidden flex flex-col">
                        <CardHeader className="border-b bg-gray-50/50 dark:bg-slate-900/50">
                            <CardTitle className="uppercase tracking-widest text-sm font-black text-emerald-600">Case Resolution Rates</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                Current Lifecycle Status
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col justify-center">
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={caseResolutionStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
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
                                        <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-300 truncate tracking-widest">{stat.name} <span className="text-slate-400 font-bold ml-1">({stat.value})</span></span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* DEEP DEMOGRAPHICS: Age, Location, Hand-offs */}
                <div>
                    <h2 className="text-lg font-black tracking-tight flex items-center gap-2 py-4 mb-2 border-b uppercase text-slate-800 dark:text-slate-200">
                        <Users className="w-5 h-5 text-purple-600" />
                        Demographic Statistical Reports
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* 1. Victim Age Demographics */}
                        <Card className="shadow-sm border">
                            <CardHeader>
                                <CardTitle className="uppercase tracking-widest text-xs font-black text-purple-600">Victim Age Groups</CardTitle>
                                <CardDescription className="text-xs">Identified vulnerable demographics</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] pl-0 pb-6 pr-6 pt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageDemographics} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} width={100} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                                        <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]}>
                                            {
                                                ageDemographics.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.name.includes('Child') || entry.name.includes('Teen') ? '#ec4899' : '#a855f7'} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* 2. Incident Location Heatmap */}
                        {/* <Card className="shadow-sm border">
                            <CardHeader>
                                <CardTitle className="uppercase tracking-widest text-xs font-black text-orange-500">Incident Heatmap</CardTitle>
                                <CardDescription className="text-xs">Highest reported incident zones (Top 8)</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] pl-0 pb-6 pr-6 pt-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={locationDemographics} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f8fafc" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} width={120} />
                                        <Tooltip
                                            formatter={(value) => [`${value} Reports`, 'Cases']}
                                            labelFormatter={(label, payload) => payload[0]?.payload.fullName || label}
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card> */}

                        {/* 3. Top Referral Agencies */}
                        <Card className="shadow-sm border">
                            <CardHeader>
                                <CardTitle className="uppercase tracking-widest text-xs font-black text-slate-700">Top Referral Partners</CardTitle>
                                <CardDescription className="text-xs">External agencies handling your cases</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] pb-6 pt-0 flex flex-col justify-center">
                                {agencyStats.length > 0 ? (
                                    <>
                                        <div className="h-[180px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={agencyStats}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={40}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {agencyStats.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-4 px-4 overflow-y-auto max-h-[100px]">
                                            {agencyStats.map((stat: any, i: number) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: stat.fill }}></div>
                                                    <span className="text-[9px] uppercase font-black text-slate-600 truncate tracking-widest">{stat.name} <span className="text-slate-400 font-bold ml-1">({stat.value})</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <Activity className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No Active Referrals</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
