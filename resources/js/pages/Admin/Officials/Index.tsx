import { Head, useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Plus, Pencil, Trash2, User, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

interface Official {
    id: number;
    name: string;
    position: string;
    committee?: string;
    image_path?: string;
    level: 'head' | 'secretary' | 'staff';
    is_active: boolean;
}

export default function Index({ officials }: { officials: Official[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const form = useForm({
        name: '',
        position: '',
        committee: '',
        level: 'staff',
        image_path: null as File | null,
        _method: 'POST' // Required for file uploads in updates
    });

    const openCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        form.reset();
        form.setData({
            name: '',
            position: '',
            committee: '',
            level: 'staff',
            image_path: null,
            _method: 'POST'
        });
        setIsModalOpen(true);
    };

    const openEdit = (official: Official) => {
        setIsEditing(true);
        setEditingId(official.id);
        form.setData({
            name: official.name,
            position: official.position,
            committee: official.committee || '',
            level: official.level as any,
            image_path: null,
            _method: 'PATCH'
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && editingId) {
            router.post(route('admin.officials.update', editingId), {
                ...form.data,
                image_path: form.data.image_path // Force sending file
            }, {
                onSuccess: () => setIsModalOpen(false),
                onError: (errors) => {
                    Object.values(errors).flat().forEach((err: any) => toast.error(err));
                },
                forceFormData: true // Important for file upload with PATCH spoofing
            });
        } else {
            form.post(route('admin.officials.store'), {
                onSuccess: () => setIsModalOpen(false),
                onError: (errors) => {
                    Object.values(errors).flat().forEach((err: any) => toast.error(err));
                },
                forceFormData: true
            });
        }
    };

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

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                            Barangay Officials
                        </h1>
                        <p className="text-sm text-slate-500">Manage organizational chart members.</p>
                    </div>
                    <Button onClick={openCreate} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Official
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Current Members</CardTitle>
                        <CardDescription>List of all active officials displayed on the public website.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Name & Position</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Committee</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {officials.map((official) => (
                                    <TableRow key={official.id}>
                                        <TableCell>
                                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                                {official.image_path ? (
                                                    <img src={official.image_path} alt={official.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-full h-full p-2 text-slate-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-slate-900 dark:text-white">{official.name}</div>
                                            <div className="text-xs text-slate-500">{official.position}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {official.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {official.committee || '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(official)}>
                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteOfficial(official.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {officials.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                            No officials found. Click "Add Official" to create one.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Official' : 'Add New Official'}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Update the details of the official.' : 'Add a new member to the organizational chart.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.target.value)}
                                    placeholder="e.g. Juan De La Cruz"
                                    required
                                />
                                {form.errors.name && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{form.errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Hierarchy Level</Label>
                                <Select
                                    value={form.data.level}
                                    onValueChange={v => form.setData('level', v as any)}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="head">Barangay Head (Top)</SelectItem>
                                        <SelectItem value="secretary">Secretary (Middle)</SelectItem>
                                        <SelectItem value="staff">Staff / Officer (Bottom)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.level && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{form.errors.level}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Position Title</Label>
                                <Input
                                    value={form.data.position}
                                    onChange={e => form.setData('position', e.target.value)}
                                    placeholder="e.g. VAWC Head Officer"
                                    required
                                />
                                {form.errors.position && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{form.errors.position}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Committee (Optional)</Label>
                                <Input
                                    value={form.data.committee}
                                    onChange={e => form.setData('committee', e.target.value)}
                                    placeholder="e.g. Committee on Women"
                                />
                                {form.errors.committee && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{form.errors.committee}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Official Photo</Label>
                                <div className="flex items-center gap-2 border rounded-md p-2 bg-slate-50 dark:bg-slate-900 border-dashed border-slate-300">
                                    <ImageIcon className="w-5 h-5 text-slate-400" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="text-sm cursor-pointer w-full text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                        onChange={e => form.setData('image_path', e.currentTarget.files ? e.currentTarget.files[0] : null)}
                                    />
                                </div>
                                {form.errors.image_path && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{form.errors.image_path}</p>
                                )}
                                <p className="text-[10px] text-slate-400">Recommended: Square Aspect Ratio (1:1), Max 10MB.</p>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={form.processing} className="w-full bg-purple-600 hover:bg-purple-700">
                                    {isEditing ? 'Update Official' : 'Save Official'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
