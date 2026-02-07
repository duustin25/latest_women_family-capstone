import { Head, Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Settings2, Plus, Building2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Organization {
    id: number;
    name: string;
    slug: string;
    president_name: string | null;
    requirements: string[] | null;
    image: string | null;
}

interface PageProps {
    organization: {
        data: Organization[];
        meta: { total: number; links: any[]; };
    };
    filters: { search?: string; };
}

export default function Index({ organization, filters }: PageProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const organizationsData = organization?.data ?? [];

    const handleSearch = () => {
        router.get('/admin/organizations', { search }, { preserveState: true });
    };

    const handleClear = () => {
        setSearch('');
        router.get('/admin/organizations', {}, { preserveState: true });
    };

    const handleDelete = (orgs: Organization) => {
        if (confirm(`Delete ${orgs.name}? This action cannot be undone.`)) {
            router.delete(`/admin/organizations/${orgs.slug}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Organizations', href: '#' }]}>
            <Head title="Organization Management" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col space-y-6">

                    {/* --- HEADER --- */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                Manage Organizations
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Configure recognized community groups and their requirements.
                            </p>
                        </div>
                        <Link href="/admin/organizations/create">
                            <Button className="bg-[#0038a8] hover:bg-blue-800 text-white shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> Add New Group
                            </Button>
                        </Link>
                    </div>

                    {/* --- FILTERS & SEARCH --- */}
                    <div className="p-4 rounded-lg shadow-sm border border-slate-200 bg-white dark:bg-slate-900/50 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Type name or president..."
                                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button onClick={handleSearch} variant="secondary">
                                Find
                            </Button>
                            {filters?.search && (
                                <Button variant="ghost" onClick={handleClear} className="px-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="text-[15px]">
                        Total Records: <span className="font-bold">{organization.meta.total}</span>
                    </div>

                    {/* --- TABLE SECTION --- */}
                    <div className="border rounded-xl overflow-hidden shadow-sm dark:border-slate-800 bg-white dark:bg-slate-900">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="w-[300px] font-bold text-slate-700 dark:text-slate-300 px-6">Organization</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">President</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">Requirements</TableHead>
                                    <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300 px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {organizationsData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-500 font-medium">
                                            No organizations found matching "{search}".
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    organizationsData.map((orgs) => (
                                        <TableRow key={orgs.slug} className="dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg border dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                        {orgs.image ? <img src={orgs.image} className="w-full h-full object-cover" /> : <Building2 className="text-slate-300 w-5 h-5" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        {/* Changed from uppercase to titlecase for better readability, but kept bold */}
                                                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">{orgs.name}</span>
                                                        <span className="text-[11px] text-slate-500 mt-0.5 font-mono">{orgs.slug}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {orgs.president_name || 'Unassigned'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="text-[11px] font-bold uppercase py-0.5 px-2 bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                                                    {Array.isArray(orgs.requirements) ? `${orgs.requirements.length} Items` : '0 Items'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
                                                        <Link href={`/admin/organizations/${orgs.slug}/edit`}>
                                                            <DropdownMenuItem className="cursor-pointer font-medium text-[13px]">
                                                                <Settings2 className="mr-2 h-4 w-4" /> Setup Profile
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-500 cursor-pointer font-medium text-[13px]" onClick={() => handleDelete(orgs)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Group
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* --- PAGINATION --- */}
                    <div className="flex justify-center items-center gap-1 pt-2">
                        {organization.meta.links.map((link: any, i: number) => (
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