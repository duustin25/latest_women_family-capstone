import { Head, Link, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Settings2, Plus, Building2, Search, X, Users, ChevronRight, LayoutTemplate, Briefcase } from "lucide-react";
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
    color_theme?: string;
    form_schema?: any[];
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
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Organizations', href: '#' }]}>
            <Head title="Organization Management" />

            <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 py-12 transition-colors">
                <div className="max-w-7xl mx-auto px-6">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-6xl font-black text-neutral-900 dark:text-white tracking-tighter mb-2 uppercase leading-none">
                                Organizations
                            </h2>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg max-w-xl">
                                Manage community groups, accredited organizations, and their specific requirements.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <span className="block text-3xl font-black text-neutral-900 dark:text-white">{organization.meta.total}</span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">Total Groups</span>
                            </div>
                            <Link href="/admin/organizations/create">
                                <Button className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-white dark:border-neutral-900">
                                    <Plus className="w-5 h-5 mr-2" strokeWidth={3} />
                                    <span className="font-black uppercase tracking-widest text-xs">New Group</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 mb-8 flex items-center gap-2 max-w-2xl mx-auto">
                        <div className="pl-4 text-neutral-400"><Search size={20} /></div>
                        <Input
                            placeholder="SEARCH BY NAME OR PRESIDENT..."
                            className="border-none shadow-none text-lg font-bold bg-transparent h-12 placeholder:text-neutral-300 dark:placeholder:text-neutral-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {filters?.search && (
                            <Button variant="ghost" onClick={handleClear} className="w-10 h-10 p-0 rounded-full hover:bg-red-50 text-red-500">
                                <X size={18} />
                            </Button>
                        )}
                        <Button onClick={handleSearch} className="rounded-xl px-8 font-black uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900">
                            Find
                        </Button>
                    </div>

                    {/* LIST VIEW */}
                    <div className="space-y-4">
                        {organizationsData.length === 0 ? (
                            <div className="text-center py-24 border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl opacity-50">
                                <Building2 size={64} className="mx-auto mb-4 text-neutral-400" />
                                <h3 className="text-xl font-bold text-neutral-500">No organizations found.</h3>
                            </div>
                        ) : (
                            organizationsData.map((org) => (
                                <div key={org.id} className="group relative bg-white dark:bg-neutral-900 rounded-2xl p-2 pr-6 border border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg flex items-center gap-6 overflow-hidden">

                                    {/* COLOR ACCENT BAR */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${org.color_theme || 'bg-blue-600'} transition-all`}></div>

                                    {/* IMAGE */}
                                    <div className="w-24 h-24 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden relative ml-4">
                                        {org.image ? (
                                            <img src={org.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-neutral-300 dark:text-neutral-700">
                                                <Building2 size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1 min-w-0 py-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight truncate">
                                                {org.name}
                                            </h3>
                                            {org.slug && <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-500">{org.slug}</span>}
                                        </div>

                                        <div className="flex flex-wrap gap-6 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                            <span className="flex items-center gap-2">
                                                <Users size={14} className="text-neutral-400" />
                                                {org.president_name || <span className="text-neutral-300 italic">No President</span>}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <LayoutTemplate size={14} className="text-neutral-400" />
                                                {(org.form_schema?.length || 0)} Questions
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Briefcase size={14} className="text-neutral-400" />
                                                {(org.requirements?.length || 0)} Requirements
                                            </span>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/organizations/${org.slug}/edit`}>
                                            <Button variant="outline" className="rounded-full h-12 px-6 border-2 font-bold uppercase text-[10px] tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                                Manage <Settings2 size={14} className="ml-2" />
                                            </Button>
                                        </Link>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <Trash2 size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="text-red-600 font-bold focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(org)}>
                                                    Confirm Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* PAGINATION */}
                    <div className="flex justify-center items-center gap-2 mt-12">
                        {organization.meta.links.map((link: any, i: number) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`h-10 px-4 flex items-center justify-center text-[10px] font-black uppercase tracking-widest rounded-lg border-2 transition-all ${link.active
                                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                                    : 'bg-transparent text-neutral-400 border-transparent hover:border-neutral-200 dark:hover:border-neutral-800'
                                    } ${!link.url && 'opacity-20 cursor-not-allowed pointer-events-none'}`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}