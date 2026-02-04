import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Search, Plus, Filter, FileOutput,
    MoreHorizontal, Eye, Edit3, Trash2,
    Calendar, User, CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
;
import { Label } from "@/components/ui/label";

// Ensure route is typed (for Ziggy)
declare const route: (name: string, params?: any) => string;

// Define Interface for clarity
interface CaseRecord {
    id: number;
    case_number: string;
    name: string;
    type: string;
    subType: string;
    status: string;
    date: string;
    referred_to?: string | null;
}

export default function Index({ cases: initialCases }: { cases: CaseRecord[] }) {
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Use Props Directly
    const cases = initialCases;

    const submitType = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.abuse-types.store'), {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            }
        });
    }




    // Form for Adding New Abuse Type
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        color: '#000000',
    });

    // Valid Status Options
    const statusOptions = ['All', 'New', 'On-going', 'Resolved', 'Referred', 'Closed'];

    // Helper: Normalize status for consistent filtering
    const normalizeStatus = (s: string) => {
        if (!s) return 'new';
        // Map common variations if any (e.g. "ongoing" vs "On-going")
        const lower = s.toLowerCase();
        if (lower === 'ongoing' || lower === 'on-going') return 'on-going';
        return lower;
    };

    // Filter Logic
    const filteredCases = cases.filter(c => {
        // Status Filter
        const sFilter = normalizeStatus(statusFilter);
        const cStatus = normalizeStatus(c.status);
        const matchStatus = statusFilter === 'All' || cStatus === sFilter;

        // Type Filter
        const matchType = typeFilter === 'All' || c.type === typeFilter;

        // Search Filter
        const search = searchQuery.toLowerCase();
        const matchSearch =
            (c.name || '').toLowerCase().includes(search) ||
            (c.case_number || '').toLowerCase().includes(search);

        return matchStatus && matchType && matchSearch;
    });

    // Simple textual status badge
    const StatusBadge = ({ status, referredTo }: { status: string, referredTo?: string | null }) => {
        let colorClass = "bg-slate-100 text-slate-700";
        const norm = normalizeStatus(status);

        if (norm === 'new') colorClass = "bg-red-100 text-red-700 border-red-200";
        else if (norm === 'on-going') colorClass = "bg-blue-100 text-blue-700 border-blue-200";
        else if (norm === 'resolved') colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
        else if (norm === 'referred') colorClass = "bg-purple-100 text-purple-700 border-purple-200";
        else if (norm === 'closed') colorClass = "bg-slate-100 text-slate-600 border-slate-200";

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
                {status}
                {norm === 'referred' && referredTo && <span className="ml-1 opacity-75">- {referredTo}</span>}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Case Registry', href: '#' }]}>
            <Head title="Case Registry" />



            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col space-y-6">

                    {/* Toolbar: Title and Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                Case Registry
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Manage VAWC and BCPC cases.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/admin/cases/create?type=VAWC">
                                <Button className="bg-[#ce1126] hover:bg-red-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" /> New VAWC Case
                                </Button>
                            </Link>
                            <Link href="/admin/cases/create?type=CPP">
                                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                                    <Plus className="w-4 h-4 mr-2" /> New BCPC Case
                                </Button>
                            </Link>
                        </div>



                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Search Case ID or Name..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Filter className="w-4 h-4" />
                                    <span>{statusFilter === 'All' ? 'Filter Status' : statusFilter}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                {statusOptions.filter(o => o !== 'All').map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Type Filter */}
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Filter className="w-4 h-4" />
                                    <span>{typeFilter === 'All' ? 'Filter Type' : typeFilter}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="VAWC">VAWC</SelectItem>
                                <SelectItem value="BCPC">BCPC</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Export */}
                        <Button variant="secondary" onClick={() => {
                            // Simple Export Logic
                            const csvContent = "data:text/csv;charset=utf-8,"
                                + "Case ID,Date,Type,Name,Status\n"
                                + filteredCases.map(c => `${c.case_number},${c.date},${c.type},${c.name},${c.status}`).join("\n");
                            const link = document.createElement("a");
                            link.href = encodeURI(csvContent);
                            link.download = "cases.csv";
                            link.click();
                        }}>
                            <FileOutput className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>

                    {/* Data Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[180px]">Case No.</TableHead>
                                    <TableHead>Date Filed</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Victim / Complainant</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCases.length > 0 ? (
                                    filteredCases.map((item) => (
                                        // CRITICAL FIX: Use composite key to prevent duplicates
                                        <TableRow key={`${item.type}-${item.id}`} className="hover:bg-slate-50">
                                            <TableCell className="font-medium">{item.case_number}</TableCell>
                                            <TableCell className="text-slate-500 text-sm">{item.date}</TableCell>
                                            <TableCell>
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${item.type === 'VAWC' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                                    {item.type}
                                                </span>
                                                <div className="text-[15px] text-slate-900 mt-1">{item.subType}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm text-slate-900">{item.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={item.status} referredTo={item.referred_to} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Link href={`/admin/cases/${item.id}/edit?type=${item.type}`}>
                                                            <DropdownMenuItem>
                                                                <Edit3 className="mr-2 h-4 w-4" /> Manage Case
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                            No cases found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="text-xs text-slate-400 text-center">
                        Showing {filteredCases.length} records.
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
