import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { route } from 'ziggy-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BarChart3, ChevronRight, Search, Filter } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface Props {
    cases: any[];
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ cases, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const debouncedSearch = useDebounce(search, 300);

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'served': return 'default';
            case 'issued': return 'secondary';
            case 'applied': return 'outline';
            case 'intake': return 'outline';
            case 'monitoring': return 'secondary';
            case 'escalated': return 'destructive';
            default: return 'secondary';
        }
    };

    // Apply filters via Inertia router
    useEffect(() => {
        router.get(route('admin.vawc.index'), {
            search: debouncedSearch,
            status: status
        }, {
            preserveState: true,
            replace: true
        });
    }, [debouncedSearch, status]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'VAWC Cases', href: '#' }]}>
            <Head title="VAWC Case Management" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">VAWC Digital Registry</h1>
                        <p className="text-muted-foreground text-sm">[RA 9262] Violence Against Women and Children Case Management</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                            <Link href={route('admin.vawc.dashboard')}>
                                <BarChart3 className="w-4 h-4" />
                                Analytics Dashboard
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="flex items-center gap-2 h-9 px-4">
                            <Link href={route('admin.vawc.create')}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Intake
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Case #, Participant Name..."
                            className="pl-9 h-11"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="h-11">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <SelectValue placeholder="All Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Intake">Intake</SelectItem>
                            <SelectItem value="Assessment">Assessment</SelectItem>
                            <SelectItem value="Applied">BPO Applied</SelectItem>
                            <SelectItem value="Issued">BPO Issued</SelectItem>
                            <SelectItem value="Served">BPO Served</SelectItem>
                            <SelectItem value="Monitoring">Monitoring</SelectItem>
                            <SelectItem value="Escalated">Escalated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="border-muted shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b bg-muted/5 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            Case Logbook
                        </CardTitle>
                        <Badge variant="secondary" className="h-5">{cases.length} result(s)</Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow>
                                    <TableHead className="font-mono font-bold py-4 pl-6 uppercase text-[10px] tracking-wide">Case Number</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-wide">Victim</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-wide text-center">Status</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-wide">Involved Parties</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-wide">Date Reported</TableHead>
                                    <TableHead className="text-right font-bold pr-6 font-mono text-[10px] uppercase">Registry</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cases.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                            No cases found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {cases.map((vawc: any) => (
                                    <TableRow key={vawc.id} className="hover:bg-muted/5 group">
                                        <TableCell className="font-mono font-bold text-sm pl-6 text-primary">
                                            {vawc.case_report.case_number}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">
                                                    {vawc.involved_parties.find((p: any) => p.role === 'Victim')?.name || 'N/A'}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground uppercase">{vawc.case_report.abuse_type?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getStatusVariant(vawc.status)} className="text-[10px] uppercase font-bold tracking-wider h-6 px-3">
                                                {vawc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Badge variant="outline" className="text-[9px] border-amber-200 bg-amber-50 text-amber-700">Victim</Badge>
                                                {vawc.involved_parties.some((p: any) => p.role === 'Respondent') &&
                                                    <Badge variant="outline" className="text-[9px] border-slate-200 bg-slate-50 text-slate-700">Respondent</Badge>
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm font-medium">
                                            {new Date(vawc.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="sm" asChild className="opacity-70 group-hover:opacity-100 group-hover:bg-primary/10 transition-all font-bold text-xs ring-offset-background hover:text-primary">
                                                <Link href={route('admin.vawc.show', vawc.id)}>
                                                    Open <ChevronRight className="w-3 h-3 ml-1" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
