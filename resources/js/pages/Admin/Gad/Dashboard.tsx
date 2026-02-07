
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, AlertTriangle, CheckCircle2, DollarSign, PieChart, Printer } from 'lucide-react';
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

            <div className="p-6 max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">GAD Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400">Monitor Gender and Development Budget & Activities</p>
                    </div>
                    <div className="flex gap-2">
                        <a href={route('admin.gad.print')} target="_blank">
                            <Button variant="outline">
                                <Printer className="w-4 h-4 mr-2" />
                                Print Report
                            </Button>
                        </a>
                        <Link href={route('admin.gad.activities.create')}>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Activity className="w-4 h-4 mr-2" />
                                New Activity
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Budget Tracker Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Annual GAD Budget</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold">₱</span>
                                <Input
                                    type="number"
                                    value={annualBudget}
                                    onChange={(e) => setAnnualBudget(parseFloat(e.target.value) || 0)}
                                    className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto w-full"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Editable. Represents 5% of Total Appropriations.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Utilized</CardTitle>
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₱{safeTotalUtilized.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {utilizationRate.toFixed(1)}% of GAD Budget
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={`border-l-4 shadow-sm ${remainingBalance < 0 ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${remainingBalance < 0 ? 'text-red-600' : ''}`}>
                                ₱{remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Available for future activities
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Utilization Alert */}
                {utilizationRate < 5 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    <span className="font-bold">Warning:</span> Utilization is very low ({utilizationRate.toFixed(2)}%).
                                    Legal mandate requires full utilization of the 5% GAD fund.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Activities */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold tracking-tight">Recent Activities</h2>
                        <Link href={route('admin.gad.activities.index')} className="text-sm font-medium text-purple-600 hover:text-purple-500">
                            View All &rarr;
                        </Link>
                    </div>
                    <div className="bg-white dark:bg-slate-950 rounded-lg border shadow-sm overflow-hidden">
                        {recentActivities.length > 0 ? (
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                                <thead className="bg-slate-50 dark:bg-slate-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Expenditure</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                                    {recentActivities.map((activity) => (
                                        <tr key={activity.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                                {activity.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {activity.activity_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {new Date(activity.date_scheduled).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={activity.status === 'Completed' ? 'default' : activity.status === 'Ongoing' ? 'secondary' : 'outline'}>
                                                    {activity.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                                ₱{activity.actual_expenditure?.toLocaleString() || '0.00'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-center text-slate-500">
                                No activities found. Start by creating one!
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
