import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Settings, AlertTriangle, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import { route } from 'ziggy-js';
import { cn } from "@/lib/utils"; // Ensure utils is imported

// Define Interfaces
interface AbuseType {
    id: number;
    name: string;
    category: string;
    color: string;
    is_active: boolean;
}

interface ReferralPartner {
    id: number;
    name: string;
    category: string;
    contact_info: string;
    is_active: boolean;
}

interface PageProps {
    abuseTypes: AbuseType[];
    referralPartners: ReferralPartner[];
}

export default function Index({ abuseTypes, referralPartners }: PageProps) {
    const [isAbuseModalOpen, setIsAbuseModalOpen] = useState(false);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('abuses');

    // Forms
    const abuseForm = useForm({
        name: '',
        category: 'VAWC',
        color: '#ce1126',
        description: ''
    });

    const partnerForm = useForm({
        name: '',
        category: 'Both',
        contact_info: ''
    });

    const submitAbuse = (e: React.FormEvent) => {
        e.preventDefault();
        abuseForm.post(route('admin.settings.abuse-types.store'), {
            onSuccess: () => {
                setIsAbuseModalOpen(false);
                abuseForm.reset();
            }
        });
    };

    const submitPartner = (e: React.FormEvent) => {
        e.preventDefault();
        partnerForm.post(route('admin.settings.partners.store'), {
            onSuccess: () => {
                setIsPartnerModalOpen(false);
                partnerForm.reset();
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'System Settings', href: '#' }
        ]}>
            <Head title="System Settings" />

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Settings className="w-6 h-6 text-slate-600" />
                        System Configuration
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage dynamic lists and system resources.
                    </p>
                </div>

                <div className="w-full">
                    {/* Manual Tab List */}
                    <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 w-full max-w-md">
                        <button
                            onClick={() => setActiveTab('abuses')}
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                activeTab === 'abuses' ? "bg-white text-slate-950 shadow-sm" : "hover:bg-slate-200/50"
                            )}
                        >
                            Abuse Types
                        </button>
                        <button
                            onClick={() => setActiveTab('partners')}
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                activeTab === 'partners' ? "bg-white text-slate-950 shadow-sm" : "hover:bg-slate-200/50"
                            )}
                        >
                            Referral Partners
                        </button>
                    </div>

                    {/* ABUSE TYPES TAB */}
                    {activeTab === 'abuses' && (
                        <div className="space-y-4 mt-6 animate-in fade-in zoom-in-95 duration-300">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                                            Case Classifications
                                        </CardTitle>
                                        <CardDescription>
                                            Define types of abuses or concerns for VAWC and BCPC cases.
                                        </CardDescription>
                                    </div>
                                    <Dialog open={isAbuseModalOpen} onOpenChange={setIsAbuseModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-[#ce1126] hover:bg-red-700 text-white">
                                                <Plus className="w-4 h-4 mr-2" /> Add Classification
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Classification</DialogTitle>
                                                <DialogDescription>Create a new category for reporting.</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={submitAbuse} className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Classification Name</Label>
                                                    <Input
                                                        value={abuseForm.data.name}
                                                        onChange={e => abuseForm.setData('name', e.target.value)}
                                                        placeholder="e.g. Cyber Violence"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Category Context</Label>
                                                    <Select
                                                        value={abuseForm.data.category}
                                                        onValueChange={v => abuseForm.setData('category', v)}
                                                    >
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="VAWC">VAWC (Women & Children)</SelectItem>
                                                            <SelectItem value="BCPC">BCPC (Minors / CICL)</SelectItem>
                                                            <SelectItem value="Both">Both</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={abuseForm.processing}>Save</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Charts Color</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {abuseTypes.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={item.category === 'VAWC' ? 'border-red-200 bg-red-50 text-red-700' : 'border-blue-200 bg-blue-50 text-blue-700'}>
                                                            {item.category}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                                                            <span className="text-xs text-slate-500 font-mono">{item.color}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                                            {item.is_active ? 'Active' : 'Archived'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* REFERRAL PARTNERS TAB */}
                    {activeTab === 'partners' && (
                        <div className="space-y-4 mt-6 animate-in fade-in zoom-in-95 duration-300">
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
                                            <Button className="bg-[#ce1126] hover:bg-red-700 text-white">
                                                <Plus className="w-4 h-4 mr-2" /> Add Partner
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Referral Partner</DialogTitle>
                                                <DialogDescription>Add a new agency for referrals.</DialogDescription>
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
                                                    <Button type="submit" disabled={partnerForm.processing}>Save Partner</Button>
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
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {referralPartners.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-bold">{item.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-slate-50">
                                                            {item.category}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 font-mono text-xs">
                                                        {item.contact_info || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                                            {item.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
