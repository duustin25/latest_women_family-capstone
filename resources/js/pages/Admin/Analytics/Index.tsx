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
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Ensure route is typed (for Ziggy)
declare const route: (name: string, params?: any) => string;

interface Stats {
    january: { vawc: number, cpp: number };
    february: { vawc: number, cpp: number };
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

interface GadStats {
    total_utilized: number;
    total_activities: number;
    completed_count: number;
    monthly_spending: {
        month: string;
        amount: number;
    }[];
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
}

export default function Index({ stats, vawcData, bcpcData, currentYear, vawcChartConfig, bcpcChartConfig, membershipStats, caseResolutionStats }: PageProps) {
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

                {/* Key Metrics Cards (Mock/Passed Data) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Cases (YTD)</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">124</div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last year
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                Currently being processed by DSWD/PNP
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats?.growth || '+0%'}</div>
                            <p className="text-xs text-muted-foreground">
                                Increased reporting rate vs last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Chart Section */}
                <Card className="col-span-6 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className={cn("transition-colors duration-300", activeColor)}>
                                {isVawc ? "Rates of Women's Abuse by Month" : "BCPC Case Concerns by Month"}
                            </CardTitle>
                            <CardDescription>
                                Monthly breakdown of reported {isVawc ? 'abuse types' : 'child welfare concerns'} for {currentYear}.
                            </CardDescription>
                        </div>

                        {/* TOGGLE SWITCH */}
                        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                            <button
                                onClick={() => setChartMode('VAWC')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all",
                                    isVawc ? "bg-white dark:bg-neutral-900 shadow-sm text-[#ce1126]" : "text-neutral-500 hover:text-neutral-700"
                                )}
                            >
                                <AlertTriangle className="w-4 h-4" />
                                VAWC
                            </button>
                            <button
                                onClick={() => setChartMode('BCPC')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all",
                                    !isVawc ? "bg-white dark:bg-neutral-900 shadow-sm text-blue-600" : "text-neutral-500 hover:text-neutral-700"
                                )}
                            >
                                <Baby className="w-4 h-4" />
                                BCPC
                            </button>
                        </div>
                    </CardHeader>

                    <CardContent className="pl-5">
                        {/* Pass dynamic data and config */}
                        <AnalyticsChart
                            key={chartMode} // Force re-render animation
                            data={isVawc ? vawcData : bcpcData}
                            config={isVawc ? vawcChartConfig : bcpcChartConfig}
                        />
                    </CardContent>
                </Card>

                {/* NEW Analytics Section */}
                <div className="pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Organization Membership Growth */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="uppercase tracking-widest text-sm font-black text-blue-600">Org Membership Growth</CardTitle>
                            <CardDescription>
                                Active citizen participation over time ({membershipStats?.total_this_year} new this year)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-0 pb-6 pr-6 pt-4 h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={membershipStats?.monthly_growth || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        name="New Members"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Case Status Resolution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="uppercase tracking-widest text-sm font-black text-emerald-500">Case Resolution Rates</CardTitle>
                            <CardDescription>Breakdown of current VAWC/BCPC case statuses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={caseResolutionStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {caseResolutionStats.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`${value} Cases`, 'Total']}
                                            contentStyle={{ borderRadius: '8px', border: 'none', background: '#333', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {caseResolutionStats.map((stat: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2" title={`${stat.value} total cases`}>
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stat.fill }}></div>
                                        <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 truncate">{stat.name} ({stat.value})</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </AppLayout>
    );
}
