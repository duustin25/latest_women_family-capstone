import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Search, Plus, Filter, FileOutput,
    MoreHorizontal, Eye, Edit3, Trash2,
    Calendar, User, CheckCircle2,
    ArrowRight, Siren, Baby, ShieldAlert,
    LayoutTemplate, Settings2, Clock,
    AlertCircle, FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

// Define Interface for clarity
interface CaseRecord {
    id: number;
    case_number: string;
    name: string;
    type: 'VAWC' | 'BCPC';
    subType: string;
    status: string;
    date: string;
    time: string;
    referred_to?: string | null;
}

export default function Index({ cases: initialCases, ongoingStatuses = [] }: { cases: CaseRecord[], ongoingStatuses?: string[] }) {
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All'); // 'All', 'VAWC', 'BCPC'
    const [searchQuery, setSearchQuery] = useState('');

    // Use Props Directly
    const cases = initialCases;

    // Helper: Normalize status for consistent filtering
    const normalizeStatus = (s: string) => {
        if (!s) return 'new';
        const lower = s.toLowerCase();
        if (ongoingStatuses.some(os => os.toLowerCase() === lower)) return 'on-going';
        if (['under mediation', 'intervention/diversion program', 'bpo issued', 'ongoing', 'on-going'].includes(lower)) return 'on-going';
        return lower;
    };

    // Filter Logic
    const filteredCases = cases.filter(c => {
        const sFilter = normalizeStatus(statusFilter);
        const cStatus = normalizeStatus(c.status);
        const matchStatus = statusFilter === 'All' || cStatus === sFilter;
        const matchType = typeFilter === 'All' || c.type === typeFilter;
        const search = searchQuery.toLowerCase();
        const matchSearch =
            (c.name || '').toLowerCase().includes(search) ||
            (c.case_number || '').toLowerCase().includes(search);

        return matchStatus && matchType && matchSearch;
    });

    const getTheme = (type: string) => {
        if (type === 'VAWC') return {
            border: 'border-l-4 border-l-rose-600',
            bg: 'bg-white shadow-sm',
            text: 'text-rose-600 dark:text-rose-400',
            borderLight: 'border-rose-200 dark:border-rose-900', // For subtle borders
            icon: <Siren size={20} className="text-rose-600" />
        };
        return {
            border: 'border-l-4 border-l-sky-600',
            bg: 'bg-white shadow-sm',
            text: 'text-sky-600 dark:text-sky-400',
            borderLight: 'border-sky-200 dark:border-sky-900', // For subtle borders
            icon: <Baby size={20} className="text-sky-600" />
        };
    };

    const getStatusColor = (status: string) => {
        const norm = normalizeStatus(status);
        switch (norm) {
            case 'new': return 'text-red-700 border-red-200 dark:border-red-900';
            case 'on-going': return 'text-blue-700 border-blue-200 dark:border-blue-900';
            case 'resolved': return 'text-emerald-700 border-emerald-200 dark:border-emerald-900';
            case 'referred': return 'text-purple-700 border-purple-200 dark:border-purple-900';
            case 'closed': return 'text-slate-700 border-slate-200 dark:border-slate-800';
            case 'dismissed': return 'text-neutral-600 border-neutral-200 dark:border-neutral-800';
            default: return '';
        }
    };

    // Helper to get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    // Calculate days active roughly
    const getDaysActive = (dateString: string) => {
        const start = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? `${diff} days ago` : 'Today';
    };

    const [showArchived, setShowArchived] = useState((new URLSearchParams(window.location.search)).get('archived') === 'true');

    // Handle Delete (Archive)
    const handleDelete = (id: number, type: string) => {
        if (confirm('Are you sure you want to archive this case?')) {
            router.delete(`/admin/cases/${id}?type=${type}`);
        }
    };

    // Handle Restore
    const handleRestore = (id: number, type: string) => {
        if (confirm('Are you sure you want to restore this case?')) {
            router.patch(`/admin/cases/${id}/restore?type=${type}`);
        }
    };

    // Toggle Archive View
    const toggleArchived = (checked: boolean) => {
        const url = new URL(window.location.href);
        if (checked) {
            url.searchParams.set('archived', 'true');
        } else {
            url.searchParams.delete('archived');
        }
        router.get(url.toString(), {}, { preserveState: true });
        setShowArchived(checked);
    };

    const statusOptions = ['All', 'New', 'On-going', 'Resolved', 'Referred', 'Closed', 'Dismissed'];

    const getStatusDotColor = (status: string) => {
        const norm = normalizeStatus(status);
        switch (norm) {
            case 'new': return 'bg-red-600';
            case 'on-going': return 'bg-blue-600';
            case 'resolved': return 'bg-emerald-600';
            case 'referred': return 'bg-purple-600';
            case 'closed': return 'bg-slate-600';
            case 'dismissed': return 'bg-neutral-600';
            default: return 'bg-slate-400';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Case Registry', href: '#' }]}>
            <Head title="Case Registry" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">
                                    Case Registry
                                </h2>
                                {showArchived && (
                                    <Badge variant="destructive" className="ml-2 uppercase tracking-widest text-[10px]">Archived View</Badge>
                                )}
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Secure management system for <span className="text-rose-600 font-bold">VAWC</span> and <span className="text-sky-600 font-bold">BCPC</span> cases.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block mr-4">
                                <span className="block text-4xl font-black text-neutral-900 dark:text-white leading-none">{filteredCases.length}</span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">Total {showArchived ? 'Archived' : 'Active'} Cases</span>
                            </div>

                            {!showArchived && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-2 border-transparent dark:border-neutral-700">
                                            <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                                            <span className="font-bold uppercase tracking-wide text-xs">File New Case</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-60 p-2">
                                        <div className="px-2 py-1.5 text-xs font-bold text-neutral-400 uppercase tracking-wider">Select Case Type</div>
                                        <DropdownMenuItem onClick={() => router.get('/admin/cases/create?type=VAWC')} className="cursor-pointer py-3 rounded-md focus:bg-rose-50 focus:text-rose-700">
                                            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mr-3">
                                                <Siren className="h-4 w-4 text-rose-600" />
                                            </div>
                                            <div>
                                                <span className="font-bold block">VAWC Case</span>
                                                <span className="text-[10px] text-neutral-500">Women & Children Protection</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.get('/admin/cases/create?type=BCPC')} className="cursor-pointer py-3 rounded-md focus:bg-sky-50 focus:text-sky-700">
                                            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3">
                                                <Baby className="h-4 w-4 text-sky-600" />
                                            </div>
                                            <div>
                                                <span className="font-bold block">BCPC Case</span>
                                                <span className="text-[10px] text-neutral-500">Child Rights & Welfare</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* CONTROL BAR: TABS & FILTERS */}
                    <div className="sticky top-4 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {/* CUSTOM PILL TABS */}
                            <div className="flex items-center bg-neutral-100 dark:bg-neutral-950 rounded-xl p-1 w-full md:w-auto">
                                {['All', 'VAWC', 'BCPC'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setTypeFilter(type)}
                                        className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === type
                                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                                            : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* ARCHIVE TOGGLE */}
                            <div className="flex items-center gap-2 pl-4 border-l border-neutral-200 dark:border-neutral-800">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleArchived(!showArchived)}
                                    className={`text-[10px] font-black uppercase tracking-widest h-9 ${showArchived ? 'bg-red-50 text-red-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                                >
                                    {showArchived ? 'Hide Archives' : 'Show Archives'}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px] border-none bg-neutral-100 dark:bg-neutral-950 font-bold text-xs h-10 rounded-lg">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Statuses</SelectItem>
                                    {statusOptions.filter(o => o !== 'All').map(opt => (
                                        <SelectItem key={opt} value={opt}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${getStatusDotColor(opt)}`}></div>
                                                {opt}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* SEARCH BAR */}
                            <div className="bg-neutral-100 dark:bg-neutral-950 px-3 h-10 rounded-lg flex items-center gap-2 flex-1 md:w-[280px]">
                                <Search size={14} className="text-neutral-400" />
                                <input
                                    placeholder="SEARCH NAME OR CASE NO..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>


                    {/* STATUS FILTER */}
                    <div className="mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50 p-2">
                        <h1>
                            NOTE: IF THE STATUS COLOR IS WHITE, THE STATUS
                            MUST HAVE BEEN DISACTIVATED OR UPDATED, PLEASE CHECK
                            THE SYSTEM CONFIGURATION "CASE & REFERRAL CONFIGURATION"
                            TO UPDATE THIS.
                        </h1>
                    </div>


                    {/* TABLE VIEW */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-5 pl-8">Case No</th>
                                        <th className="p-5">Victim Name</th>
                                        <th className="p-5">Type</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5">Date & Time</th>
                                        <th className="p-5 text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {filteredCases.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <Search size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No cases found</h3>
                                                    <p className="text-xs text-neutral-500">Try adjusting your filters or search query.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCases.map((c) => {
                                            const theme = getTheme(c.type);
                                            const statusColor = getStatusColor(c.status);

                                            return (
                                                <tr key={`${c.type}-${c.id}`} className={`group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${showArchived ? 'opacity-70 bg-neutral-50/50' : ''}`}>

                                                    {/* CASE NO */}
                                                    <td className="p-5 pl-8 align-middle">
                                                        <span className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                                                            {c.case_number}
                                                        </span>
                                                    </td>

                                                    {/* NAME */}
                                                    <td className="p-5 align-middle">
                                                        <span className="text-sm font-bold text-neutral-900 dark:text-white uppercase truncate max-w-[200px]" title={c.name}>
                                                            {c.name}
                                                        </span>
                                                    </td>

                                                    {/* TYPE */}
                                                    <td className="p-5 align-middle">
                                                        <Badge variant="outline" className={`px-2.5 py-1 ${c.type === 'VAWC' ? 'text-rose-600 border-rose-200 dark:border-rose-900 bg-white dark:bg-neutral-900' : 'text-sky-600 border-sky-200 dark:border-sky-900 bg-white dark:bg-neutral-900'}`}>
                                                            {c.type}
                                                        </Badge>
                                                    </td>

                                                    {/* STATUS */}
                                                    <td className="p-5 align-middle">
                                                        <Badge variant="outline" className={`px-2.5 py-1 bg-white dark:bg-neutral-900 ${statusColor}`}>
                                                            {c.status}
                                                        </Badge>
                                                    </td>

                                                    {/* DATE & TIME */}
                                                    <td className="p-5 align-middle">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase">{c.date}</span>
                                                            <span className="text-[10px] text-neutral-400 font-medium uppercase mt-0.5">{c.time}</span>
                                                        </div>
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td className="p-5 pr-8 align-middle text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {showArchived ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 px-3 text-xs font-bold uppercase tracking-wider text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                                                    onClick={() => handleRestore(c.id, c.type)}
                                                                >
                                                                    Restore
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Link href={`/admin/cases/${c.id}/edit?type=${c.type}`}>
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
                                                                            <DropdownMenuItem className="text-red-600 font-bold focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(c.id, c.type)}>
                                                                                Archive Record
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
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
