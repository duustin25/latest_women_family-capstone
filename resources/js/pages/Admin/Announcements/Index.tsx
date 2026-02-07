import { Head, Link, router, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal, Pencil, Trash2, MapPin, Calendar,
    LayoutDashboard, Plus, X, Search
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
        };
    };

    filters: {
        search: string;
    }
}

export default function Index({ announcements, filters }: PageProps) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const handleSearch = () => {
        router.get('/admin/announcements',
            { search: search },
            { preserveState: true }
        );
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleClear = () => {
        setSearch('');
        router.get('/admin/announcements', {}, { preserveState: true });
    };

    const handleDelete = (announcement: Announcement) => {
        if (confirm(`Delete this announcement: ${announcement.title}? This action cannot be undone.`)) {
            router.delete(`/admin/announcements/${announcement.slug}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Announcements', href: '#' }]}>
            <Head title="Announcements Management" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col space-y-6">

                    {/* --- HEADER --- */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                Manage Announcements
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Create and publish news, events, and updates.
                            </p>
                        </div>

                        <Link href="/admin/announcements/create">
                            <Button className="bg-[#0038a8] hover:bg-blue-800 text-white shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> Create New Post
                            </Button>
                        </Link>
                    </div>

                    {/* --- FILTERS & SEARCH --- */}
                    <div className="p-4 rounded-lg shadow-sm border border-slate-200 bg-white dark:bg-slate-900/50 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Type title or category to search"
                                className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSearch} variant="secondary">
                                Find
                            </Button>
                            {filters?.search && (
                                <Button
                                    variant="ghost"
                                    onClick={handleClear}
                                    className="px-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="text-[15px]">
                        Total Records: <span className="font-bold">{announcements.meta.total || announcements.data.length}</span>
                    </div>

                    {/* --- TABLE SECTION --- */}
                    <div className="border rounded-xl overflow-hidden shadow-sm dark:border-slate-800 bg-white dark:bg-slate-900">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="w-[300px] font-bold text-slate-700 dark:text-slate-300 px-6">Announcement</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Category</TableHead>
                                    <TableHead className="font-bold text-slate-700 dark:text-slate-300">Event Details</TableHead>
                                    <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300 px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {announcements.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-500 font-medium">
                                            No announcements found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    announcements.data.map((item: any) => (
                                        <TableRow key={item.id} className="dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.image}
                                                        className="h-10 w-10 rounded border object-cover bg-slate-100 dark:bg-slate-800 dark:border-slate-700 shrink-0"
                                                        alt=""
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.title}</span>
                                                        <span className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{item.excerpt}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-bold uppercase tracking-wider text-[10px] bg-slate-50 text-slate-600 border-slate-200">
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.date}
                                                    </span>
                                                    {item.location && (
                                                        <span className="flex items-center gap-1.5 text-slate-500">
                                                            <MapPin className="w-3.5 h-3.5" /> {item.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
                                                        <Link href={`/admin/announcements/${item.slug}/edit`}>
                                                            <DropdownMenuItem className="cursor-pointer font-medium text-[13px]">
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-500 cursor-pointer font-medium text-[13px]"
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                        {(announcements as any).meta?.links?.map((link: any, i: number) => (
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
