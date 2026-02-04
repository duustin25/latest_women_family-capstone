import { Head, Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal, Pencil, Trash2, ShieldCheck, Mail,
    LayoutDashboard, Plus, X, Search, User
} from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { dashboard } from '@/routes';

interface SystemUser {
    id: number;
    name: string;
    email: string;
    role: string;
    organization?: {
        name: string;
    }
}

interface PageProps {
    users: {
        data: SystemUser[];
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'System Users', href: '/admin/system-users' },
];

export default function Index({ users, filters }: PageProps) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const handleSearch = () => {
        router.get('/admin/system-users',
            { search: search },
            { preserveState: true }
        );
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleClear = () => {
        setSearch('');
        router.get('/admin/system-users', {}, { preserveState: true });
    };

    const handleDelete = (user: SystemUser) => {
        if (confirm(`Delete this user: ${user.name}? This action cannot be undone.`)) {
            router.delete(`/admin/system-users/${user.id}`);
        }
    };

    // Role Badge Logic
    const renderRole = (role: string) => {
        const config: Record<string, string> = {
            'admin': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            'head': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'president': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        };
        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config[role] || 'bg-slate-100'}`}
            >
                {role}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System User Management" />

            <div className="p-6 lg:p-8 bg-white dark:bg-slate-950 min-h-screen">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                            System Access Control
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Total Records: {users.meta?.total || users.data.length}
                        </p>
                    </div>

                    <Link href="/admin/system-users/create">
                        <Button className="bg-[#0038a8] hover:bg-blue-800 text-white shadow-sm gap-2">
                            <Plus className="w-4 h-4" /> Create Account
                        </Button>
                    </Link>
                </div>

                {/* --- MANUAL SEARCH BAR --- */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Type name or email to search"
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

                <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">Official Profile</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">System Role</TableHead>
                                <TableHead className="font-bold text-slate-700 dark:text-slate-300">Assigned Organization</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 dark:text-slate-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id} className="dark:border-slate-800">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
                                                    <User size={16} className="text-[#0038a8] dark:text-blue-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm uppercase">{user.name}</span>
                                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                                                        <Mail size={10} /> {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {renderRole(user.role)}
                                        </TableCell>
                                        <TableCell>
                                            {user.organization ? (
                                                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                                                    {user.organization.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Not Assigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
                                                    <Link href={`/admin/system-users/${user.id}/edit`}>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-500 cursor-pointer"
                                                        onClick={() => handleDelete(user)}
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
                    {(users.meta?.links || users.links)?.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 text-sm rounded border transition-colors ${link.active
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