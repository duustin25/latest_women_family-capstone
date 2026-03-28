import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
    stats: {
        total_cases: number;
        status_distribution: any[];
        intake_distribution: any[];
        abuse_distribution: any[];
        zone_distribution: any[];
        sla_compliance: {
            total: number;
            compliant: number;
            rate: number;
        };
    };
}

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Intake': return 'bg-blue-100 text-blue-700';
            case 'Assessment': return 'bg-yellow-100 text-yellow-700';
            case 'BPO Processing': return 'bg-purple-100 text-purple-700';
            case 'Escalated': return 'bg-red-100 text-red-700';
            case 'Closed': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AppLayout>
            <Head title="VAWC Management Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-tight">VAWC Analytics & Reporting</h1>
                        <p className="text-muted-foreground text-sm font-mono">[RA 9262] System-wide Performance Monitoring</p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={route('admin.vawc.index')}>View Case Registry</Link>
                    </Button>
                </div>

                {/* KPI Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Cases</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">{stats.total_cases || 0}</div>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">Total VAWC Incidents</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">BPO SLA Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter text-green-600">{stats.sla_compliance?.rate || 0}%</div>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">{stats.sla_compliance?.compliant || 0} of {stats.sla_compliance?.total || 0} Same-Day Issuance</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Legal Escalations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter text-red-600">
                                {stats.status_distribution?.find((s: any) => s.status === 'Escalated')?.count || 0}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold font-mono">Referred to PNP/Prosecutor</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Compliance Monitoring</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter text-blue-600">
                                {stats.status_distribution?.find((s: any) => s.status === 'Monitoring')?.count || 0}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold font-mono">BPOs in monitoring phase</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Case Status Distribution */}
                    <Card>
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-xs font-black uppercase tracking-widest">Case Lifecycle Distribution</CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold">Current stage of all incidents</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {(stats.status_distribution || []).map((item: any) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status).split(' ')[0]}`} />
                                            <span className="text-xs font-bold uppercase tracking-wide">{item.status}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-mono">
                                            <div className="text-xs font-black">{item.count}</div>
                                            <div className="text-[10px] text-neutral-400 w-8">
                                                {stats.total_cases > 0 ? Math.round((item.count / stats.total_cases) * 100) : 0}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!stats.status_distribution || stats.status_distribution.length === 0) && (
                                    <p className="text-xs italic text-muted-foreground">No status distribution data yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Abuse Types */}
                    <Card>
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-xs font-black uppercase tracking-widest">Incident Nature Trend</CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold">Aggregated by initial intake categories</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-5">
                                {(stats.abuse_distribution || []).length > 0 ? (
                                    (stats.abuse_distribution || []).map((item: any) => (
                                        <div key={item.name} className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span>{item.name}</span>
                                                <span>{item.count} Cases</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary" 
                                                    style={{ width: `${stats.total_cases > 0 ? (item.count / stats.total_cases) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs italic text-muted-foreground">No categorical trends recorded yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Zone Distribution */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="border-b bg-muted/20">
                            <CardTitle className="text-xs font-black uppercase tracking-widest">Incident Hotspots (By Zone)</CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold">Geographic concentration of VAWC cases</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {(stats.zone_distribution || []).length > 0 ? (
                                    (stats.zone_distribution || []).map((item: any) => (
                                        <div key={item.name} className="p-3 border rounded-xl bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center">
                                            <div className="text-[9px] font-black text-neutral-400 uppercase tracking-tighter mb-1">{item.name}</div>
                                            <div className="text-2xl font-black tracking-tighter">{item.count}</div>
                                            <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary transition-all duration-500" 
                                                    style={{ width: `${stats.total_cases > 0 ? (item.count / stats.total_cases) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-4 text-xs italic text-muted-foreground col-span-full text-center">No geographic distribution trends analyzed yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
