import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, BarChart3, ChevronRight } from 'lucide-react';

interface Props {
    cases: any[];
}

export default function Index({ cases }: Props) {
    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'served': return 'default';
            case 'issued': return 'secondary';
            case 'applied': return 'outline';
            case 'intake': return 'outline';
            default: return 'secondary';
        }
    };

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
                        <Button asChild size="sm" className="flex items-center gap-2">
                            <Link href={route('admin.vawc.create')}>
                                <Plus className="w-4 h-4" />
                                New Intake
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="border-muted shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b bg-muted/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
                                Case Logbook
                                <Badge variant="secondary" className="ml-2 h-5">{cases.length}</Badge>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow>
                                    <TableHead className="font-bold py-4 pl-6">Case Number</TableHead>
                                    <TableHead className="font-bold">Victim</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="font-bold">Date Reported</TableHead>
                                    <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cases.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No cases recorded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {cases.map((vawc: any) => (
                                    <TableRow key={vawc.id} className="hover:bg-muted/5 group">
                                        <TableCell className="font-mono font-bold text-sm pl-6">
                                            {vawc.case_report.case_number}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {vawc.involved_parties.find((p: any) => p.role === 'Victim')?.name || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(vawc.status)} className="text-[10px] uppercase tracking-wider h-5">
                                                {vawc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(vawc.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={route('admin.vawc.show', vawc.id)}>
                                                    Details <ChevronRight className="w-4 h-4 ml-1" />
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
