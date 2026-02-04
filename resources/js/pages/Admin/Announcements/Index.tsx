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
import type { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { useState } from 'react';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    location: string;
    date: string; // Synced with Resource
    image: string; // Synced with Resource
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Announcements', href: '/admin/announcements' },
];

export default function Index({ announcements, filters }: PageProps) {
    const [ search, setSearch] = useState(filters?.search ?? '');

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
        router.get('/admin/announcements', {}, { preserveState: true});
    };

    const handleDelete = (announcement: Announcement) => {
        if (confirm(`Delete this announcement: ${announcement.title}? This action cannot be undone.`)) {
            router.delete(`/admin/announcements/${announcement.slug}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements Management" />
            
            <div className="p-6 lg:p-8 bg-white dark:bg-slate-950 min-h-screen">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <LayoutDashboard className="w-6 h-6 text-blue-600" />
                            Manage Announcements
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Total Records: {announcements.meta.total || announcements.data.length}
                        </p>
                    </div>
                    
                    <Link href="/admin/announcements/create">
                        <Button className="bg-[#0038a8] hover:bg-blue-800 text-white shadow-sm gap-2">
                            <Plus className="w-4 h-4" /> Create New Post
                        </Button>
                    </Link>
                </div>


                 {/* --- MANUAL SEARCH BAR --- */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input 
                            placeholder="Type title or category to search" 
                            className="pl-10 h-11 bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                    </div>
                    
                    <Button 
                        onClick={handleSearch}
                        className="bg-slate-900 dark:bg-blue-700 h-11 px-6 uppercase font-black text-[10px] tracking-widest"
                    >
                        Find Records
                    </Button>

                    {filters?.search && (
                        <Button 
                            variant="ghost" 
                            onClick={handleClear}
                            className="h-11 px-4 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4 mr-1" /> CLEAR FILTER
                        </Button>
                    )}
                </div>

                {/* Table Section */}
                <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">Announcement</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">Category</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">Event Details</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {announcements.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                        No announcements found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                announcements.data.map((item : any) => (
                                    <TableRow key={item.id} className="dark:border-slate-800">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={item.image} 
                                                    className="h-10 w-10 rounded object-cover bg-slate-100 dark:bg-slate-800 border dark:border-slate-700" 
                                                    alt="" 
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">{item.title}</span>
                                                    <span className="text-xs text-slate-500 truncate max-w-[200px]">{item.excerpt}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-semibold uppercase tracking-wider text-[10px]">
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.date}
                                                </span>
                                                {item.location && (
                                                    <span className="flex items-center gap-1.5 text-slate-500">
                                                        <MapPin className="w-3.5 h-3.5" /> {item.location}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
                                                    <Link href={`/admin/announcements/${item.slug}/edit`}>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem 
                                                        className="text-red-600 focus:text-red-500 cursor-pointer"
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


            {/* Pagination Section */}
            <div className="mt-6 flex justify-center gap-2">
                {/* When using AnnouncementResource::collection(), 
                the links are usually found at announcements.links or announcements.meta.links 
                */}
                {(announcements as any).meta?.links?.map((link: any, i: number) => (
                    <Link
                        key={i}
                        href={link.url || '#'}
                        // This renders the "Next" and "Previous" labels correctly
                        dangerouslySetInnerHTML={{ __html: link.label }} 
                        className={`px-3 py-1 text-sm rounded border transition-colors ${
                            link.active 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                        } ${!link.url && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                    />
                ))}
            </div>


            </div>
        </AppLayout>
    );
}



