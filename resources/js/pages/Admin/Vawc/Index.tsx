import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
        <AppLayout>
            <Head title="VAWC Case Management" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">VAWC Digital Registry</h1>
                        <p className="text-muted-foreground text-sm font-mono">[RA 9262] Case Management & BPO Monitoring System</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('admin.vawc.dashboard')}>Analytics Dashboard</Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('admin.vawc.create')}>+ New Intake</Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Case Logbook</CardTitle>
                        <CardDescription>Real-time tracking of VAWC incidents and protection orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Case Number</TableHead>
                                    <TableHead>Victim</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Reported</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cases.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                            [NO CASES RECORDED]
                                        </TableCell>
                                    </TableRow>
                                )}
                                {cases.map((vawc: any) => (
                                    <TableRow key={vawc.id}>
                                        <TableCell className="font-mono font-medium">
                                            {vawc.case_report.case_number}
                                        </TableCell>
                                        <TableCell>
                                            {vawc.involved_parties.find((p: any) => p.role === 'Victim')?.name || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(vawc.status)}>
                                                {vawc.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(vawc.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.vawc.show', vawc.id)}>Details</Link>
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
