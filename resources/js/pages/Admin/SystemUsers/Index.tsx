import { Head, Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal, Pencil, Trash2, ShieldCheck, Mail,
    LayoutDashboard, Plus, X, Search, User
} from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'System Users', href: '#' }]}>
            <Head title="System User Management" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col space-y-6">

                    {/* --- HEADER --- */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                System Access Control
                            </h2>
                            <p className="text-sm">
                                Manage user accounts, roles, and permissions.
                            </p>
                        </div>

                        <Link href="/admin/system-users/create">
                            <Button className="bg-[#0038a8] hover:bg-blue-800 text-white shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> Create Account
                            </Button>
                        </Link>
                    </div>

                    {/* --- FILTERS & SEARCH --- */}
                    <div className="p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                            <Input
                                placeholder="Type name or email to search"
                                className="pl-9 font-medium"
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
                        Total Records: <span className="font-bold">{users.meta?.total || users.data.length}</span>
                    </div>

                    {/* --- TABLE SECTION --- */}
                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="">
                                <TableRow>
                                    <TableHead className="w-[300px] font-bold px-6">Official Profile</TableHead>
                                    <TableHead className="font-bold">System Role</TableHead>
                                    <TableHead className="font-bold">Assigned Organization</TableHead>
                                    <TableHead className="text-right font-bold px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center font-medium">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id} className="">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full flex items-center justify-center border shrink-0">
                                                        <User size={16} className="" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm uppercase">{user.name}</span>
                                                        <span className="text-[11px] font-medium flex items-center gap-1">
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
                                                    <span className="font-bold text-sm">
                                                        {user.organization.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs italic">Not Assigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="">
                                                        <Link href={`/admin/system-users/${user.id}/edit`}>
                                                            <DropdownMenuItem className="cursor-pointer font-medium text-[13px]">
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-500 cursor-pointer font-medium text-[13px]"
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

                    {/* --- PAGINATION --- */}
                    <div className="flex justify-center items-center gap-1 pt-2">
                        {(users.meta?.links || users.links)?.map((link: any, i: number) => (
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