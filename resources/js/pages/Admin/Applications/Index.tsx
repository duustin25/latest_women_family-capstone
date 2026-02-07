import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    FileSearch, ChevronRight, Plus,
    Search, X, Filter, FileOutput
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
    const [search, setSearch] = useState(filters?.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? 'All');
    const [orgFilter, setOrgFilter] = useState(filters?.organization_id ?? 'All');

    const appsData = applications?.data ?? [];

    const handleFilter = (key: string, value: string) => {
        const newFilters: Record<string, any> = {
            search,
            status: statusFilter,
            organization_id: orgFilter,
            [key]: value
        };

        // If value is 'All', remove it from query params
        if (value === 'All') delete newFilters[key as keyof typeof newFilters];
        if (newFilters.status === 'All') delete newFilters.status;
        if (newFilters.organization_id === 'All') delete newFilters.organization_id;

        router.get('/admin/applications', newFilters as any, { preserveState: true });
    };

    const handleSearch = () => {
        handleFilter('search', search);
    };

    const handleClear = () => {
        setSearch('');
        setStatusFilter('All');
        setOrgFilter('All');
        router.get('/admin/applications', {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Applications', href: '#' }]}>
            <Head title="Membership Queue" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col space-y-6">

                    {/* --- HEADER --- */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight dark:text-white">
                                Membership Applications
                            </h1>
                            <p className="text-sm">
                                Review and manage organizational membership requests.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href="/admin/applications/create">
                                <Button className="bg-[#0038a8] hover:bg-blue-800 text-white shadow-sm gap-2">
                                    <Plus className="w-4 h-4" /> Manual Intake
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* --- FILTERS & SEARCH --- */}
                    <div className="p-4 rounded-lg shadow-sm border grid grid-cols-1 md:grid-cols-4 gap-4 transition-colors duration-200">

                        {/* Search */}
                        <div className="md:col-span-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                            <Input
                                placeholder="Search applicant name..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Organization Filter */}
                        <Select
                            value={orgFilter}
                            onValueChange={(val) => {
                                setOrgFilter(val);
                                handleFilter('organization_id', val);
                            }}
                        >
                            <SelectTrigger className="">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <span className="truncate">{
                                        orgFilter === 'All' ? 'Filter Organization' : organizations.find(o => String(o.id) === orgFilter)?.name || 'Unknown'
                                    }</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Organizations</SelectItem>
                                {organizations.map(org => (
                                    <SelectItem key={org.id} value={String(org.id)}>{org.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={(val) => {
                                setStatusFilter(val);
                                handleFilter('status', val);
                            }}
                        >
                            <SelectTrigger className="">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <span>{statusFilter === 'All' ? 'Filter Status' : statusFilter}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Disapproved">Disapproved</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button onClick={handleSearch} variant="secondary" className="flex-1">
                                Find
                            </Button>
                            {(filters?.search || filters?.status || filters?.organization_id) && (
                                <Button variant="ghost" onClick={handleClear} className="px-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="text-[15px]">
                        Total Records: <span className="font-bold">{applications.meta.total}</span>
                    </div>

                    {/* --- TABLE SECTION --- */}
                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="">
                                <TableRow>
                                    <TableHead className="w-[250px] font-bold px-6">Applicant Identity</TableHead>
                                    <TableHead className="font-bold">Organization</TableHead>
                                    <TableHead className="font-bold text-center">Status</TableHead>
                                    <TableHead className="text-right font-bold px-6">Evaluation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appsData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No applications found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    appsData.map((app) => (
                                        <TableRow key={app.id} className="">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold uppercase text-sm leading-none tracking-tight">{app.fullname}</span>
                                                    <span className="text-[11px] uppercase mt-1 italic font-medium">Submitted: {app.created_at}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                    <span className="text-xs font-bold uppercase tracking-tight">
                                                        {app.organization_name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${app.status === 'Pending'
                                                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                                                    : app.status === 'Approved'
                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 text-right">
                                                <Link href={`/admin/applications/${app.id}`}>
                                                    <Button variant="outline" className="h-8 text-[11px] font-bold uppercase border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
                                                        Review Data <ChevronRight size={14} className="ml-1" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* --- PAGINATION --- */}
                    <div className="flex justify-center items-center gap-1 pt-2">
                        {applications.meta.links.map((link: any, i: number) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded border transition-all ${link.active
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    } ${!link.url && 'opacity-40 cursor-not-allowed pointer-events-none'}`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}