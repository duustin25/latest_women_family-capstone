import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AnalyticsChart from '@/components/Admin/AnalyticsChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Users, AlertTriangle, Activity, Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';

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

interface PageProps {
    stats: Stats;
    analyticsData: ChartData[];
    currentYear: number;
    chartConfig: ChartConfig[];
}

export default function Index({ stats, analyticsData, currentYear, chartConfig }: PageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Analytics', href: '#' }]}>
            <Head title="Analytics" />

            <div className="p-6 max-w-7xl mx-auto space-y-8">

                {/* Header with Add Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <Activity className="w-6 h-6 text-[#ce1126]" />
                            Analytics Overview
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Statistical reports for Women and Children Protection (CY {currentYear}).
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#ce1126] hover:bg-red-700 text-white font-black uppercase tracking-widest gap-2">
                                <Plus className="w-4 h-4" /> Add Abuse Type
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="font-black uppercase text-[#ce1126]">New Abuse Category</DialogTitle>
                                <DialogDescription>
                                    Add a new type of abuse to the database. This will reflect in filing forms and charts immediately.
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
                            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
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
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Abuse Rate Analysis</CardTitle>
                        <CardDescription>
                            Monthly breakdown of reported abuse types for {currentYear}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Pass dynamic data and config */}
                        <AnalyticsChart data={analyticsData} config={chartConfig} />
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
