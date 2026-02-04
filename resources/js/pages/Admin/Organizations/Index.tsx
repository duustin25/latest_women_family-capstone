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
            
            <div className="p-6 lg:p-8 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-blue-600" />
                            Manage Organizations
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Total Records: {organization.meta.total}
                        </p>
                    </div>
                    <Link href="/admin/organizations/create">
                        <Button className="bg-[#0038a8] hover:bg-blue-800 text-white shadow-sm gap-2 uppercase font-black text-xs tracking-widest">
                            <Plus className="w-4 h-4" /> Add New Group
                        </Button>
                    </Link>
                </div>

                {/* --- SEARCH BAR --- */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input 
                            placeholder="Type name or president..." 
                            className="pl-10 h-11 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onClick={handleSearch} className="bg-slate-900 dark:bg-blue-700 h-11 px-6 uppercase font-black text-[10px] tracking-widest">
                        Find Records
                    </Button>
                    {filters?.search && (
                        <Button variant="ghost" onClick={handleClear} className="h-11 px-4 text-[10px] font-bold text-slate-400 hover:text-red-500">
                            <X className="w-4 h-4 mr-1" /> CLEAR FILTER
                        </Button>
                    )}
                </div>

                {/* --- TABLE SECTION --- */}
                <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-10 dark:bg-slate-800/100">
                            <TableRow>
                                <TableHead className="text-[22px] font-bold text-slate-700 dark:text-slate-300 px-5">Organization</TableHead>
                                <TableHead className="text-[22px] font-bold text-slate-700 dark:text-slate-300">President</TableHead>
                                <TableHead className="text-[22px] font-bold text-slate-700 dark:text-slate-300 text-center">Requirements</TableHead>
                                <TableHead className="text-[22px] text-right font-bold text-slate-700 dark:text-slate-300 px-5">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {organizationsData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-500 uppercase font-bold text-xs">
                                        No organizations found matching "{search}".
                                    </TableCell>
                                </TableRow>
                            ) : (
                                organizationsData.map((orgs) => (
                                    <TableRow key={orgs.slug} className="dark:border-slate-800 hover:bg-slate-700/50 transition-colors">
                                        <TableCell className="px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-14 rounded-lg border dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    {orgs.image ? <img src={orgs.image} className="w-full h-full object-cover" /> : <Building2 className="text-slate-300 w-5 h-5" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[19px] leading-none">{orgs.name}</span>
                                                    <span className="text-[12px] text-slate-500 uppercase mt-1 italic">/{orgs.slug}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[17px] font-medium text-slate-700 dark:text-slate-300">
                                            {orgs.president_name || 'Unassigned'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="text-[13px] font-black uppercase py-1 px-2 bg-blue-50 text-blue-10 dark:bg-blue-900/10 dark:text-blue-400 border-blue-200">
                                                {Array.isArray(orgs.requirements) ? `${orgs.requirements.length} Items` : '0 Items'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
                                                    <Link href={`/admin/organizations/${orgs.slug}/edit`}>
                                                        <DropdownMenuItem className="cursor-pointer font-bold uppercase text-[13px]">
                                                            <Settings2 className="mr-2 h-4 w-4" /> Setup Profile
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem className="text-red-600 cursor-pointer font-bold uppercase text-[13px]" onClick={() => handleDelete(orgs)}>
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

                {/* --- PAGINATION (1-10, Previous/Next Logic) --- */}
                <div className="mt-8 flex justify-center items-center gap-3">
                    {organization.meta.links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }} 
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md border transition-all ${
                                link.active 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                            } ${!link.url && 'opacity-30 cursor-not-allowed pointer-events-none'}`}
                        />
                    ))}
                </div>

            </div>
        </AppLayout>
    );
}