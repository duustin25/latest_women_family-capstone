import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    BarChart, Bar, Legend
} from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, MapPin, TrendingUp, Search } from 'lucide-react';
import AnalyticsChart from '@/components/Admin/AnalyticsChart';

interface Props {
    stats: {
        total_cases: number;
        total_children: number;
        repeat_cases: number;
        status_distribution: any[];
        intake_distribution: any[];
        abuse_distribution: any[];
        zone_distribution: any[];
        monthly_trends: any[];
        analyticsData: any[];
        chartConfig: any[];
        sla_compliance: {
            total: number;
            compliant: number;
            rate: number;
        };
    };
}

const STATUS_COLORS: Record<string, string> = {
    'Intake': '#3b82f6',
    'Assessment': '#eab308',
    'BPO Processing': '#a855f7',
    'Escalated': '#ef4444',
    'Closed': '#22c55e',
    'Monitoring': '#06b6d4',
};

const CHART_COLORS = ['#ce1126', '#0038a8', '#fcd116', '#006400', '#8b4513', '#4b0082'];

export default function Dashboard({ stats }: Props) {
    // Safety check for missing stats prop
    if (!stats) {
        return (
            <AppLayout>
                <div className="p-10 text-center">
                    <h2 className="text-xl font-bold">Loading Dashboard Data...</h2>
                    <p className="text-muted-foreground">If this persists, please contact the administrator.</p>
                </div>
            </AppLayout>
        );
    }

    const pieData = (stats.status_distribution || []).map(item => ({
        name: item.status,
        value: item.count,
        fill: STATUS_COLORS[item.status] || '#94a3b8'
    }));

    const barData = (stats.abuse_distribution || []).map((item, index) => ({
        name: item.name,
        count: item.count,
        fill: CHART_COLORS[index % CHART_COLORS.length]
    }));

    return (
        <AppLayout>
            <Head title="VAWC Management Dashboard" />

            <div className="flex flex-col gap-6 p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-8 h-8 text-[#ce1126]" />
                            VAWC ANALYTICS COMMAND
                        </h1>
                        <p className="text-muted-foreground text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            [RA 9262] System-wide Compliance & Monitoring
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" className="font-bold uppercase text-[10px] tracking-widest border-2">
                            <Link href={route('admin.vawc.index')}>View Registry</Link>
                        </Button>
                        <Button className="bg-[#ce1126] hover:bg-[#a30d1e] font-bold uppercase text-[10px] tracking-widest">
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* KPI Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-[#ce1126] shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Aggregate Cases</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tighter">{stats.total_cases || 0}</div>
                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground mt-1 uppercase font-black">
                                <Activity className="w-3 h-3" /> System Lifetime Registry
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">BPO Issuance Efficiency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tighter text-emerald-600">{stats.sla_compliance?.rate || 0}%</div>
                            <div className="flex items-center gap-1 text-[9px] text-emerald-600/70 mt-1 uppercase font-black">
                                <ShieldCheck className="w-3 h-3" /> {stats.sla_compliance?.compliant || 0} Same-Day Success
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Repeat Offense Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tighter text-rose-600">
                                {stats.repeat_cases || 0}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-rose-600/70 mt-1 uppercase font-black">
                                <AlertTriangle className="w-3 h-3" /> High Risk Recurrence
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Children At Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tighter text-orange-600">
                                {stats.total_children || 0}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-orange-600/70 mt-1 uppercase font-black">
                                <Activity className="w-3 h-3" /> Total Impacted Minors
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Monthly Trend Area Chart */}
                    <Card className="lg:col-span-2 border-2">
                        <CardHeader className="border-b bg-muted/10">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#ce1126]" />
                                <div>
                                    <CardTitle className="text-xs font-black uppercase tracking-widest">Women Rates of Abuse (Monthly)</CardTitle>
                                    <CardDescription className="text-[9px] uppercase font-bold">Incidence reporting rate per month for the current year</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.monthly_trends}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ce1126" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ce1126" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#ce1126"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        name="Incidents"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Case Status Distribution Pie Chart */}
                    <Card className="border-2">
                        <CardHeader className="border-b bg-muted/10">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-[#0038a8]">Lifecycle Distribution</CardTitle>
                            <CardDescription className="text-[9px] uppercase font-bold">Current phase of all incidents</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 h-[300px] flex flex-col justify-between">
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                                {pieData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                        <span className="text-[9px] font-black uppercase text-slate-600 truncate">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vulnerable Demographic Activity (Advanced Analytics) */}
                    <Card className="lg:col-span-2 border-2">
                        <CardHeader className="border-b bg-muted/10">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-[#ce1126]">Vulnerable Demographic Activity</CardTitle>
                            <CardDescription className="text-[9px] uppercase font-bold">Incidence metrics categorized by official abuse classification</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 h-[300px]">
                            <AnalyticsChart data={stats.analyticsData} config={stats.chartConfig} />
                        </CardContent>
                    </Card>

                    {/* Zone Distribution Heatmap-style cards */}
                    <Card className="border-2 border-emerald-100 bg-emerald-50/20">
                        <CardHeader className="border-b bg-emerald-100/20">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-700">Geographic Density</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 max-h-[300px] overflow-y-auto">
                            <div className="space-y-3">
                                {(stats.zone_distribution || []).sort((a, b) => b.count - a.count).map((item: any) => (
                                    <div key={item.name} className="flex flex-col gap-1">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                            <span>{item.name}</span>
                                            <span className="text-emerald-600">{item.count} Cases</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-1000"
                                                style={{ width: `${stats.total_cases > 0 ? (item.count / stats.total_cases) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!stats.zone_distribution || stats.zone_distribution.length === 0) && (
                                    <p className="text-[10px] italic text-muted-foreground uppercase py-10 text-center">No zone data recorded</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Abuse Types Bar Chart (Full Width in this row) */}
                    <Card className="lg:col-span-3 border-2">
                        <CardHeader className="border-b bg-muted/10">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-[#fcd116]">Incident Category Distribution Summary</CardTitle>
                            <CardDescription className="text-[9px] uppercase font-bold">Lifetime concentration of specific abuse types reported</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'black', width: 120 }}
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                        {barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
