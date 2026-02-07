
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

declare const route: (name: string, params?: any) => string;

interface GadActivity {
    id: number;
    title: string;
    activity_type: string;
    status: string;
    date_scheduled: string;
    gad_chargeable_amount: number;
    hgdg_score?: number;
}

interface IndexProps {
    activities: {
        data: GadActivity[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function GadIndex({ activities, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.gad.activities.index'), { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'GAD Dashboard', href: '/admin/gad/dashboard' }, { title: 'Activities', href: '#' }]}>
            <Head title="GAD Activities" />

            <div className="p-6 max-w-7xl mx-auto space-y-6">

                <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">GAD Activities</h1>
                        <p className="text-slate-500">Manage your Gender and Development programs.</p>
                    </div>
                    <Link href={route('admin.gad.activities.create')}>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Activity
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-center bg-white dark:bg-slate-950 p-4 rounded-lg border shadow-sm mb-4">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search activities..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                    {/* Add Status Filter Dropdown here if needed */}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-950 rounded-lg border shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">HGDG</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Chargeable Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-950 divide-y divide-slate-200 dark:divide-slate-800">
                            {activities.data.length > 0 ? (
                                activities.data.map((activity) => (
                                    <tr key={activity.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                            {activity.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <Badge variant="outline" className="font-normal">{activity.activity_type}</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {activity.hgdg_score ? Number(activity.hgdg_score).toFixed(2) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(activity.date_scheduled).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                                            ₱{Number(activity.gad_chargeable_amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={
                                                activity.status === 'Completed' ? 'bg-emerald-500' :
                                                    activity.status === 'Ongoing' ? 'bg-blue-500' : 'bg-slate-500'
                                            }>
                                                {activity.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => router.visit(route('admin.gad.activities.edit', activity.id))}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => {
                                                            if (confirm('Are you sure?')) {
                                                                router.delete(route('admin.gad.activities.destroy', activity.id));
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No activities found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
