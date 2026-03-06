import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, MoreHorizontal, Pencil, Ban, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface Agency {
    id: number;
    name: string;
    category: string;
    contact_info: string;
    is_active: boolean;
}

export default function ReferralAgenciesTable({ caseReferralAgencies }: { caseReferralAgencies: Agency[] }) {
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [isEditingPartner, setIsEditingPartner] = useState(false);
    const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);

    const partnerForm = useForm({
        name: '',
        category: 'Both',
        contact_info: ''
    });

    const openCreatePartner = () => {
        setIsEditingPartner(false);
        setEditingPartnerId(null);
        partnerForm.reset();
        setIsPartnerModalOpen(true);
    };

    const openEditPartner = (item: Agency) => {
        setIsEditingPartner(true);
        setEditingPartnerId(item.id);
        partnerForm.setData({
            name: item.name,
            category: item.category,
            contact_info: item.contact_info
        });
        setIsPartnerModalOpen(true);
    };

    const submitPartner = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditingPartner && editingPartnerId) {
            partnerForm.patch(route('admin.settings.case-referral-agencies.update', editingPartnerId), {
                onSuccess: () => {
                    setIsPartnerModalOpen(false);
                    partnerForm.reset();
                    setIsEditingPartner(false);
                    setEditingPartnerId(null);
                }
            });
        } else {
            partnerForm.post(route('admin.settings.case-referral-agencies.store'), {
                onSuccess: () => {
                    setIsPartnerModalOpen(false);
                    partnerForm.reset();
                }
            });
        }
    };

    const togglePartnerStatus = (id: number, currentStatus: boolean) => {
        router.patch(route('admin.settings.case-referral-agencies.update', id), {
            is_active: !currentStatus,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Referral Partners
                    </CardTitle>
                    <CardDescription>
                        Agencies and departments available for case referrals.
                    </CardDescription>
                </div>
                <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreatePartner} className="bg-[#ce1126] hover:bg-red-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Add Partner
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditingPartner ? 'Edit Partner' : 'Add Referral Partner'}</DialogTitle>
                            <DialogDescription>{isEditingPartner ? 'Update partner agency details.' : 'Add a new agency for referrals.'}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitPartner} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Agency Name</Label>
                                <Input
                                    value={partnerForm.data.name}
                                    onChange={e => partnerForm.setData('name', e.target.value)}
                                    placeholder="e.g. City Health Office"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Information</Label>
                                <Input
                                    value={partnerForm.data.contact_info}
                                    onChange={e => partnerForm.setData('contact_info', e.target.value)}
                                    placeholder="Phone or Email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Applicable For</Label>
                                <Select
                                    value={partnerForm.data.category}
                                    onValueChange={v => partnerForm.setData('category', v)}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VAWC">VAWC Only</SelectItem>
                                        <SelectItem value="BCPC">BCPC Only</SelectItem>
                                        <SelectItem value="Both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={partnerForm.processing}>
                                    {isEditingPartner ? 'Update Partner' : 'Save Partner'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Agency Name</TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {caseReferralAgencies.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-bold">{item.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={item.category === 'VAWC' ? 'text-red-600' : item.category === 'BCPC' ? 'text-blue-600' : ''}>
                                        {item.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {item.contact_info || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => openEditPartner(item)}>
                                                <Pencil className="mr-2 h-4 w-4" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => togglePartnerStatus(item.id, item.is_active)} className={item.is_active ? "text-red-600 focus:text-red-600" : "text-green-600 focus:text-green-600"}>
                                                {item.is_active ? <><Ban className="mr-2 h-4 w-4" /> Deactivate</> : <><CheckCircle className="mr-2 h-4 w-4" /> Activate</>}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
