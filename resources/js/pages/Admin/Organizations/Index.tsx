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
                    <div className="sticky top-4 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {/* SEARCH BAR */}
                            <div className="bg-neutral-100 dark:bg-neutral-950 px-3 h-10 rounded-lg flex items-center gap-2 flex-1 md:w-[320px]">
                                <Search size={14} className="text-neutral-400" />
                                <input
                                    placeholder="SEARCH NAME OR PRESIDENT..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    {/* TABLE VIEW */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-5 pl-8">Organization</th>
                                        <th className="p-5">Leadership</th>
                                        <th className="p-5">System Config</th>
                                        <th className="p-5 text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {organization.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <Building2 size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No organizations found</h3>
                                                    <p className="text-xs text-neutral-500">Create a new group to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        organization.data.map((org) => (
                                            <tr key={org.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                {/* ORGANIZATION DETAILS */}
                                                <td className="p-5 pl-8 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center ${org.color_theme ? `bg-${org.color_theme}-50` : 'bg-neutral-50'}`}>
                                                            {org.image ? (
                                                                <img src={org.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Building2 size={20} className="text-neutral-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-bold text-neutral-900 dark:text-white block">
                                                                {org.name}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 mt-0.5">
                                                                <Badge variant="outline" className="text-[10px] bg-neutral-100 border-neutral-200 text-neutral-500 px-1.5 py-0 h-5">
                                                                    {org.slug}
                                                                </Badge>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* LEADERSHIP */}
                                                <td className="p-5 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100">
                                                            {org.president_name?.charAt(0) || <Users size={12} />}
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                                                                {org.president_name || 'No President'}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-500 uppercase tracking-wide font-medium">
                                                                President
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* SYSTEM CONFIG */}
                                                <td className="p-5 align-middle">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                                                            <LayoutTemplate size={12} className="text-neutral-400" />
                                                            {org.form_schema?.length || 0} Questions
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                                                            <Briefcase size={12} className="text-neutral-400" />
                                                            {org.requirements?.length || 0} Requirements
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="p-5 pr-8 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={`/admin/organizations/${org.slug}/edit`}>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                                                                <Edit3 size={14} />
                                                            </Button>
                                                        </Link>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem className="text-red-600 font-bold focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(org)}>
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
                    <div className="mt-6">
                        <div className="flex justify-center items-center gap-1">
                            {organization.meta.links.map((link: any, i: number) => (
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