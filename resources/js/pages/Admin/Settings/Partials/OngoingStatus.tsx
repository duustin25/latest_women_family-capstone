import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

declare const route: (name: string, params?: any) => string;

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit3, Loader2, AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface OngoingStatus {
    id: number;
    name: string;
    description?: string;
    type: string;
    is_active: boolean;
}

export default function OngoingStatus({ statuses }: { statuses: OngoingStatus[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<OngoingStatus | null>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        description: '',
        type: 'Both',
        is_active: true
    });

    const openCreate = () => {
        setEditingStatus(null);
        reset();
        setIsDialogOpen(true);
    };

    const openEdit = (status: OngoingStatus) => {
        setEditingStatus(status);
        setData({
            name: status.name,
            description: status.description || '',
            type: status.type || 'Both',
            is_active: status.is_active
        });
        setIsDialogOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingStatus) {
            patch(route('admin.settings.ongoing-statuses.update', editingStatus.id), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Status updated successfully');
                    reset();
                },
                onError: (err) => {
                    Object.values(err).flat().forEach((e: any) => toast.error(e));
                }
            });
        } else {
            post(route('admin.settings.ongoing-statuses.store'), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Status added successfully');
                    reset();
                },
                onError: (err) => {
                    Object.values(err).flat().forEach((e: any) => toast.error(e));
                }
            });
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Case Ongoing Statuses
                    </CardTitle>
                    <CardDescription>
                        Manage sub-statuses for cases marked as "Ongoing" (e.g., Under Mediation, BPO Monitoring).
                    </CardDescription>
                </div>
                <Button onClick={openCreate} size="sm" className="bg-slate-900 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add Status
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statuses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No statuses found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                statuses.map((status) => (
                                    <TableRow key={status.id}>
                                        <TableCell className="font-medium">{status.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={status.type === 'VAWC' ? 'text-red-600' : status.type === 'BCPC' ? 'text-blue-600' : ''}>
                                                {status.type || 'Both'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className=" text-xs">
                                            {status.description || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={status.is_active ? 'default' : 'secondary'} className={status.is_active ? '' : ''}>
                                                {status.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(status)}>
                                                <Edit3 className="w-4 h-4 text-slate-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingStatus ? 'Edit Status' : 'Add New Ongoing Status'}</DialogTitle>
                        <DialogDescription>
                            Define a new track for ongoing cases.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Status Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. Under Mediation"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Applicable Type</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VAWC">VAWC Only</SelectItem>
                                        <SelectItem value="BCPC">BCPC Only</SelectItem>
                                        <SelectItem value="Both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Input
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="e.g. Case referred to Lupon for mediation"
                            />
                        </div>

                        {editingStatus && (
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                />
                                <Label>Active</Label>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="submit" disabled={processing} className="bg-slate-900 text-white">
                                {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editingStatus ? 'Update Status' : 'Save Status'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
