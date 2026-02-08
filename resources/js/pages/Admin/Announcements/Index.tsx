import { Head, Link, router, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal, Pencil, Trash2, MapPin, Calendar,
    LayoutDashboard, Plus, X, Search, FileText, Megaphone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    location: string;
    date: string;
    image: string;
}

interface PageProps {
    announcements: {
        data: Announcement[];
        links: any[];
        meta: {
            total: number;
            links: any[];
        };
    };

    filters: {
        search: string;
    }
}

export default function Index({ announcements, filters }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        router.get('/admin/announcements',
            { search: term },
            { preserveState: true }
        );
    }

    const handleClear = () => {
        setSearchQuery('');
        router.get('/admin/announcements', {}, { preserveState: true });
    };

    const handleDelete = (announcement: Announcement) => {
        if (confirm(`Delete this announcement: ${announcement.title}? This action cannot be undone.`)) {
            router.delete(`/admin/announcements/${announcement.slug}`);
        }
    };

    // Category Badge Logic
    const renderCategory = (category: string) => {
        const config: Record<string, string> = {
            'News': 'bg-blue-50 text-blue-600 border-blue-200',
            'Event': 'bg-purple-50 text-purple-600 border-purple-200',
            'Update': 'bg-emerald-50 text-emerald-600 border-emerald-200',
            'Program': 'bg-amber-50 text-amber-600 border-amber-200',
        };
        return (
            <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config[category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {category}
            </Badge>
        );
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Announcements', href: '#' }]}>
            <Head title="Announcements Management" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">
                                    Announcements
                                </h2>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Create and publish news, events, and updates.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block mr-4">
                                <span className="block text-4xl font-black text-neutral-900 dark:text-white leading-none">
                                    {(announcements as any).meta?.total || announcements.data.length}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">Active Posts</span>
                            </div>

                            <Link href="/admin/announcements/create">
                                <Button className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-2 border-transparent dark:border-neutral-700">
                                    <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                                    <span className="font-bold uppercase tracking-wide text-xs">New Post</span>
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
                                    placeholder="SEARCH POSTS..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    autoComplete="off"
                                />
                                {filters?.search && (
                                    <button onClick={handleClear} className="text-neutral-400 hover:text-red-500">
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TABLE VIEW */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-5 pl-8">Announcement Details</th>
                                        <th className="p-5">Category</th>
                                        <th className="p-5">Event Info</th>
                                        <th className="p-5 text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {announcements.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <Megaphone size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No announcements found</h3>
                                                    <p className="text-xs text-neutral-500">Create a new post to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        announcements.data.map((item) => (
                                            <tr key={item.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                {/* DETAILS */}
                                                <td className="p-5 pl-8 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                                                            {item.image ? (
                                                                <img src={item.image} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                                    <FileText size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-bold text-neutral-900 dark:text-white block uppercase tracking-tight line-clamp-1">
                                                                {item.title}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium line-clamp-1 max-w-[250px] mt-0.5">
                                                                {item.excerpt}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* CATEGORY */}
                                                <td className="p-5 align-middle">
                                                    {renderCategory(item.category)}
                                                </td>

                                                {/* EVENT INFO */}
                                                <td className="p-5 align-middle">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">
                                                            <Calendar size={12} className="text-neutral-400" /> {item.date}
                                                        </span>
                                                        {item.location && (
                                                            <span className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-500">
                                                                <MapPin size={12} /> {item.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="p-5 pr-8 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={`/admin/announcements/${item.slug}/edit`}>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                                                                <Pencil size={14} />
                                                            </Button>
                                                        </Link>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem className="text-red-600 font-bold focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(item)}>
                                                                    Delete Post
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
                        <div className="flex justify-center items-center gap-1 pt-2">
                            {(announcements as any).meta?.links?.map((link: any, i: number) => (
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
