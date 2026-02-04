import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { 
    FileSearch, ChevronRight, Plus, 
    Search, X, Building2 
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

interface Application {
    id: number;
    fullname: string;
    organization_name: string;
    status: string;
    created_at: string;
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
    };
}

export default function Index({ applications, filters }: PageProps) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const appsData = applications?.data ?? [];

    const handleSearch = () => {
        router.get('/admin/applications', { search }, { preserveState: true });
    };

    const handleClear = () => {
        setSearch('');
        router.get('/admin/applications', {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Applications', href: '#' }]}>
            <Head title="Membership Queue" />
            
            <div className="p-6 lg:p-8 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileSearch className="w-6 h-6 text-blue-600" />
                            Membership Applications
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Total Records: {applications.meta.total}
                        </p>
                    </div>

                    <Link href="/admin/applications/create">
                        <Button className="bg-[#0038a8] hover:bg-blue-800 text-white shadow-sm gap-2 uppercase font-black text-xs tracking-widest">
                            <Plus className="w-4 h-4" /> Manual Intake
                        </Button>
                    </Link>
                </div>

                {/* --- SEARCH BAR --- */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input 
                            placeholder="Search applicant name..." 
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
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 px-6">Applicant Identity</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">Organization</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">Workflow Status</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300 px-6">Evaluation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appsData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-500 uppercase font-bold text-xs">
                                        No applications found in the registry.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                appsData.map((app) => (
                                    <TableRow key={app.id} className="dark:border-slate-800 hover:bg-slate-700/50 transition-colors">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-slate-100 uppercase text-sm leading-none tracking-tight">{app.fullname}</span>
                                                <span className="text-[10px] text-slate-500 uppercase mt-1 italic font-medium">Submitted: {app.created_at}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                                <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-tighter">
                                                    {app.organization_name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={`rounded-none font-black text-[8px] uppercase px-3 py-1 shadow-sm ${
                                                app.status === 'Pending' 
                                                ? 'bg-amber-100 text-amber-700 border-amber-200' 
                                                : app.status === 'Approved'
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                : 'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 text-right">
                                            <Link href={`/admin/applications/${app.id}`}>
                                                <Button variant="outline" className="h-9 text-[10px] font-black uppercase border-2 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 shadow-sm">
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
                
                {/* --- PAGINATION (Synchronized with Organizations) --- */}
                <div className="mt-8 flex justify-center items-center gap-1">
                    {applications.meta.links.map((link: any, i: number) => (
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