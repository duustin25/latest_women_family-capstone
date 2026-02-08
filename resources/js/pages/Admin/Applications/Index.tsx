import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Search, Plus, MoreHorizontal, Edit3, Trash2,
    FileSearch, ChevronRight, Filter, Users, Building2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

interface Application {
    id: number;
    fullname: string;
    organization_name: string;
    status: string;
    created_at: string;
}

interface Organization {
    id: number;
    name: string;
}

interface PageProps {
    applications: {
        data: Application[];
        meta: {
            total: number;
            links: any[];
        };
    };
    filters: {
        search?: string;
        status?: string;
        organization_id?: string;
    };
    organizations: Organization[];
}

export default function Index({ applications, filters, organizations }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? 'All');
    const [orgFilter, setOrgFilter] = useState(filters?.organization_id ?? 'All');

    const appsData = applications?.data ?? [];

    const handleFilter = (key: string, value: string) => {
        const newFilters: Record<string, any> = {
            search: searchQuery,
            status: statusFilter,
            organization_id: orgFilter,
            [key]: value
        };

        if (value === 'All') delete newFilters[key as keyof typeof newFilters];
        if (newFilters.status === 'All') delete newFilters.status;
        if (newFilters.organization_id === 'All') delete newFilters.organization_id;

        router.get('/admin/applications', newFilters as any, { preserveState: true });
    };

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        handleFilter('search', term);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Applications', href: '#' }]}>
            <Head title="Membership Applications" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">
                                    Applications
                                </h2>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Review membership requests and intakes.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block mr-4">
                                <span className="block text-4xl font-black text-neutral-900 dark:text-white leading-none">
                                    {applications.meta?.total || 0}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">Pending Review</span>
                            </div>

                            <Link href="/admin/applications/create">
                                <Button className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-2 border-transparent dark:border-neutral-700">
                                    <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                                    <span className="font-bold uppercase tracking-wide text-xs">Manual Intake</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* CONTROL BAR */}
                    <div className="sticky top-4 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">

                        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                            {/* SEARCH BAR */}
                            <div className="bg-neutral-100 dark:bg-neutral-950 px-3 h-10 rounded-lg flex items-center gap-2 w-full md:max-w-[320px]">
                                <Search size={14} className="text-neutral-400" />
                                <input
                                    placeholder="SEARCH APPLICANT..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>

                            {/* FILTERS */}
                            <div className="flex items-center gap-2">
                                <Select
                                    value={orgFilter}
                                    onValueChange={(val) => {
                                        setOrgFilter(val);
                                        handleFilter('organization_id', val);
                                    }}
                                >
                                    <SelectTrigger className="h-10 border-none bg-neutral-100 dark:bg-neutral-950 font-bold uppercase text-[10px] tracking-wide text-neutral-600 dark:text-neutral-400 w-[180px]">
                                        <SelectValue placeholder="FILTER ORGANIZATION" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All" className="font-bold uppercase text-[10px]">All Organizations</SelectItem>
                                        {organizations.map(org => (
                                            <SelectItem key={org.id} value={String(org.id)} className="font-bold uppercase text-[10px]">{org.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={statusFilter}
                                    onValueChange={(val) => {
                                        setStatusFilter(val);
                                        handleFilter('status', val);
                                    }}
                                >
                                    <SelectTrigger className="h-10 border-none bg-neutral-100 dark:bg-neutral-950 font-bold uppercase text-[10px] tracking-wide text-neutral-600 dark:text-neutral-400 w-[140px]">
                                        <SelectValue placeholder="FILTER STATUS" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All" className="font-bold uppercase text-[10px]">All Statuses</SelectItem>
                                        <SelectItem value="Pending" className="font-bold uppercase text-[10px]">Pending</SelectItem>
                                        <SelectItem value="Approved" className="font-bold uppercase text-[10px]">Approved</SelectItem>
                                        <SelectItem value="Disapproved" className="font-bold uppercase text-[10px]">Disapproved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* TABLE VIEW */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-5 pl-8">Applicant</th>
                                        <th className="p-5">Organization</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5 text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {appsData.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <FileSearch size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No applications found</h3>
                                                    <p className="text-xs text-neutral-500">Criteria matches no records.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        appsData.map((app) => (
                                            <tr key={app.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                {/* APPLICANT */}
                                                <td className="p-5 pl-8 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold border border-neutral-200 dark:border-neutral-700">
                                                            <Users size={16} />
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-bold text-neutral-900 dark:text-white block uppercase tracking-tight">
                                                                {app.fullname}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide">
                                                                Submitted: {app.created_at}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ORGANIZATION */}
                                                <td className="p-5 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 size={12} className="text-neutral-400" />
                                                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">
                                                            {app.organization_name}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* STATUS */}
                                                <td className="p-5 align-middle">
                                                    <Badge variant="outline" className={`px-2.5 py-1 uppercase text-[10px] tracking-wide font-bold ${app.status === 'Approved' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' :
                                                            app.status === 'Pending' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                                                                'text-red-600 border-red-200 bg-red-50'
                                                        }`}>
                                                        {app.status}
                                                    </Badge>
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="p-5 pr-8 align-middle text-right">
                                                    <Link href={`/admin/applications/${app.id}`}>
                                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 shadow-sm">
                                                            Review Data <ChevronRight size={12} className="ml-1" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-6">
                        <div className="flex justify-center items-center gap-1">
                            {applications.meta.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${link.active
                                        ? 'bg-neutral-900 text-white shadow-lg transform -translate-y-0.5'
                                        : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        } ${!link.url && 'opacity-40 cursor-not-allowed pointer-events-none'}`}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}