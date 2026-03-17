import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Plus, Edit3, Trash2, User, Search, Shield, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface User {
    id: number;
    name: string;
}

interface Official {
    id: number;
    user_id?: number;
    user?: User;

    position: string;
    committee?: string;
    image_path?: string;
    level: 'head' | 'secretary' | 'staff';
    is_active: boolean;
}

export default function Index({ officials, users }: { officials: Official[], users: User[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOfficials = officials.filter(off => {
        const displayName = off.user ? off.user.name : 'Vacant Position';
        return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            off.position.toLowerCase().includes(searchQuery.toLowerCase());
    });



    const deleteOfficial = (id: number) => {
        if (confirm('Are you sure you want to remove this official?')) {
            router.delete(route('admin.officials.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Barangay Officials', href: '/admin/officials' }
        ]}>
            <Head title="Barangay Officials" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* ... (HERO SECTION AND CONTROL BAR REMAIN THE SAME) ... */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">
                                    Officials
                                </h2>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Manage organizational chart members.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block mr-4">
                                <span className="block text-4xl font-black text-neutral-900 dark:text-white leading-none">
                                    {officials.length}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">Active Members</span>
                            </div>

                            <Link href={route('admin.officials.create')}>
                                <Button className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-2 border-transparent dark:border-neutral-700">
                                    <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                                    <span className="font-bold uppercase tracking-wide text-xs">Add Official</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="sticky top-4 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                            <div className="bg-neutral-100 dark:bg-neutral-950 px-3 h-10 rounded-lg flex items-center gap-2 w-full md:max-w-[320px]">
                                <Search size={14} className="text-neutral-400" />
                                <input
                                    placeholder="SEARCH OFFICIALS..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                        <th className="p-5 pl-8">Details</th>
                                        <th className="p-5">Position</th>
                                        <th className="p-5">Committee</th>
                                        <th className="p-5 text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {filteredOfficials.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <User size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No officials found</h3>
                                                    <p className="text-xs text-neutral-500">Add a new member to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOfficials.map((official) => (
                                            <tr key={official.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="p-5 pl-8 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                                            {official.image_path ? (
                                                                <img src={official.image_path} alt="Official" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                                    <User size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-bold text-neutral-900 dark:text-white block uppercase tracking-tight">
                                                                {official.user ? official.user.name : 'Vacant Position'}
                                                            </span>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 lowercase first-letter:uppercase ${official.level === 'head' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                                                    official.level === 'secretary' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                                        'bg-neutral-50 text-neutral-600 border-neutral-200'
                                                                    }`}>
                                                                    {official.level}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-5 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Shield size={12} className="text-neutral-400" />
                                                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">
                                                            {official.position}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="p-5 align-middle">
                                                    {official.committee ? (
                                                        <div className="flex items-center gap-2">
                                                            <Briefcase size={12} className="text-neutral-400" />
                                                            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">
                                                                {official.committee}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-neutral-400 font-medium italic">No Committee</span>
                                                    )}
                                                </td>

                                                <td className="p-5 pr-8 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={route('admin.officials.edit', official.id)}>
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
                                                                <DropdownMenuItem className="text-red-600 font-bold focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => deleteOfficial(official.id)}>
                                                                    Remove Official
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


                </div>
            </div>
        </AppLayout>
    );
}