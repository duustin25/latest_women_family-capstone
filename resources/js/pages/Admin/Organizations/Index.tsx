import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Search, Plus, MoreHorizontal, Edit3, Trash2,
    Building2, Users, LayoutTemplate, Briefcase
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        router.get('/admin/organizations', { search: term }, { preserveState: true, replace: true });
    };

    const handleDelete = (orgs: Organization) => {
        if (confirm(`Delete ${orgs.name}? This action cannot be undone.`)) {
            router.delete(`/admin/organizations/${orgs.slug}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Organizations', href: '#' }]}>
            <Head title="Organization Management" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">
                                    Organizations
                                </h2>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Manage accredited community groups and requirements.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block mr-4">
                                <span className="block text-4xl font-black text-neutral-900 dark:text-white leading-none">
                                    {organization.meta?.total || 0}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">Total Groups</span>
                            </div>

                            <Link href="/admin/organizations/create">
                                <Button className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-2 border-transparent dark:border-neutral-700">
                                    <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                                    <span className="font-bold uppercase tracking-wide text-xs">New Group</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* CONTROL BAR */}
                    <div className="sticky top-4 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-3 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-10">

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* SEARCH BAR */}
                            <div className="bg-neutral-100 dark:bg-neutral-950 px-4 h-12 rounded-xl flex items-center gap-3 flex-1 md:w-[400px] border border-transparent focus-within:border-blue-500/50 transition-all">
                                <Search size={18} className="text-neutral-400" />
                                <input
                                    placeholder="SEARCH BY NAME OR PRESIDENT..."
                                    className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    {/* TABLE VIEW */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-6 pl-10">Organization</th>
                                        <th className="p-6">Leadership</th>
                                        <th className="p-6">System Config</th>
                                        <th className="p-6 text-right pr-10">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                                    {organization.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                                                        <Building2 size={24} />
                                                    </div>
                                                    <h3 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-tight">No organizations found</h3>
                                                    <p className="text-sm text-neutral-500 mt-1">Create a new group to get started with management.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        organization.data.map((org) => (
                                            <tr key={org.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200">
                                                {/* ORGANIZATION DETAILS */}
                                                <td className="p-6 pl-10 align-middle">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-sm ${org.color_theme ? `bg-${org.color_theme}-50` : 'bg-neutral-50'}`}>
                                                            {org.image ? (
                                                                <img src={org.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Building2 size={24} className="text-neutral-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-base font-black text-neutral-900 dark:text-white block tracking-tight">
                                                                {org.name}
                                                            </span>
                                                            <span className="flex items-center gap-2 mt-1">
                                                                <Badge variant="outline" className="text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 px-2 py-0.5 h-6 uppercase tracking-wider">
                                                                    {org.slug}
                                                                </Badge>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* LEADERSHIP */}
                                                <td className="p-6 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black border border-blue-100 dark:border-blue-900/50 shadow-sm">
                                                            {org.president_name?.charAt(0) || <Users size={16} />}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-black text-neutral-900 dark:text-white block uppercase tracking-tight">
                                                                {org.president_name || 'No President'}
                                                            </span>
                                                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-bold">
                                                                President / Lead
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* SYSTEM CONFIG */}
                                                <td className="p-6 align-middle">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-xs font-black text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                                            <LayoutTemplate size={14} className="text-blue-500" />
                                                            {org.form_schema?.length || 0} Questions
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-black text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                                            <Briefcase size={14} className="text-purple-500" />
                                                            {org.requirements?.length || 0} Requirements
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="p-6 pr-10 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={`/admin/organizations/${org.slug}/members`} title="View Members">
                                                            <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl text-blue-600 border-blue-100 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                                                                Members
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/admin/organizations/${org.slug}/edit`}>
                                                            <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 border-neutral-200 dark:hover:bg-neutral-800 dark:border-neutral-700">
                                                                <Edit3 size={18} />
                                                            </Button>
                                                        </Link>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 border-neutral-200 dark:hover:bg-red-950 dark:border-neutral-700">
                                                                    <Trash2 size={18} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem className="text-red-600 font-bold focus:text-red-700 focus:bg-red-50 cursor-pointer p-3 text-sm" onClick={() => handleDelete(org)}>
                                                                    Delete Organization
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-10">
                        <div className="flex justify-center items-center gap-2">
                            {organization.meta.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm ${link.active
                                        ? 'bg-neutral-900 text-white shadow-xl transform -translate-y-1'
                                        : 'text-neutral-500 hover:text-neutral-900 bg-white dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:shadow-md border border-neutral-200 dark:border-neutral-800'
                                        } ${!link.url && 'opacity-30 cursor-not-allowed pointer-events-none'}`}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}