import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Search, Users, Mail, CreditCard, ChevronRight,
    Filter, MapPin, History, CheckCircle, XCircle,
    Send, PlusCircle, UserCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';
import { BreadcrumbItem } from '@/types';

// Declare Ziggy route global
declare function route(name: string, params?: any): string;

interface Member {
    id: number;
    fullname: string;
    address: string;
    email: string;
    phone: string;
    organization_id: number;
    organization: { name: string; color_theme: string };
    status: string;
    created_at: string;
    secure_token: string;
    communications?: any[];
    dispatches?: any[];
}

interface IndexProps {
    members: {
        data: Member[];
        meta?: { total: number; links: any[] };
        links?: any[];
    };
    organizations: any[];
    filters: any;
}

export default function MembersIndex({ members, organizations, filters }: IndexProps) {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [individualModalOpen, setIndividualModalOpen] = useState(false);
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
    const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [orgFilter, setOrgFilter] = useState(filters.organization_id || 'All');

    // Forms are handled with standard Inertia router for simpler logic in this refactor
    const [formData, setFormData] = useState({ subject: '', body: '', recipient_group: 'all', benefit_name: '', instructions: '' });

    const handleFilter = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (value === 'All') delete newFilters[key];
        router.get('/admin/members', newFilters, { preserveState: true });
    };

    const submitIndividual = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('admin.members.email.individual', selectedMember?.id), {
            subject: formData.subject,
            body: formData.body
        }, {
            onSuccess: () => {
                setIndividualModalOpen(false);
                setFormData({ ...formData, subject: '', body: '' });
            }
        });
    };

    const submitBulk = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('admin.members.email.bulk'), {
            subject: formData.subject,
            body: formData.body,
            recipient_group: formData.recipient_group
        }, {
            onSuccess: () => {
                setBulkModalOpen(false);
                setFormData({ ...formData, subject: '', body: '' });
            }
        });
    };

    const submitBeneficiary = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('admin.members.beneficiary.tag', selectedMember?.id), {
            benefit_name: formData.benefit_name,
            instructions: formData.instructions
        }, {
            onSuccess: () => {
                setBeneficiaryModalOpen(false);
                setFormData({ ...formData, benefit_name: '', instructions: '' });
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Members', href: '#' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Citizen Master Ledger" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none italic">
                                    Master Ledger
                                </h2>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Centralized database for approved citizen members.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block mr-4">
                                <span className="block text-4xl font-black text-neutral-900 dark:text-white leading-none italic">
                                    {members.meta?.total || members.data.length}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">Active Citizens</span>
                            </div>

                            <Button
                                onClick={() => setBulkModalOpen(true)}
                                className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-2 border-transparent dark:border-neutral-700"
                            >
                                <Mail className="w-5 h-5 mr-2" strokeWidth={2.5} />
                                <span className="font-bold uppercase tracking-wide text-xs">Bulk Broadcast</span>
                            </Button>
                        </div>
                    </div>

                    {/* CONTROL BAR */}
                    <div className="sticky top-4 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">

                        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                            {/* SEARCH BAR */}
                            <div className="bg-neutral-100 dark:bg-neutral-950 px-3 h-10 rounded-lg flex items-center gap-2 w-full md:max-w-[320px]">
                                <Search size={14} className="text-neutral-400" />
                                <input
                                    placeholder="SEARCH CITIZEN IDENTITY..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        handleFilter('search', e.target.value);
                                    }}
                                    autoComplete="off"
                                />
                            </div>

                            {/* FILTERS */}
                            <div className="flex items-center gap-2">
                                <Select
                                    value={orgFilter}
                                    onValueChange={(val) => {
                                        setOrgFilter(val);
                                        handleFilter('organization_id', val);
                                    }}
                                >
                                    <SelectTrigger className="h-10 border-none bg-neutral-100 dark:bg-neutral-950 font-bold uppercase text-[10px] tracking-wide text-neutral-600 dark:text-neutral-400 w-[220px]">
                                        <SelectValue placeholder="FILTER BY ORGANIZATION" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All" className="font-bold uppercase text-[10px]">All Organizations</SelectItem>
                                        {organizations.map(org => (
                                            <SelectItem key={org.id} value={String(org.id)} className="font-bold uppercase text-[10px]">{org.name.toUpperCase()}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* TABLE VIEW */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden mb-10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50 italic">
                                        <th className="p-5 pl-8">Resident Identity</th>
                                        <th className="p-5">Affiliation</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5 text-right pr-8">Action Hub</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {members.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <UserCheck size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No citizen records found</h3>
                                                    <p className="text-xs text-neutral-500">Criteria matches no approved members.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        members.data.map((member) => (
                                            <tr key={member.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                {/* RESIDENT IDENTITY */}
                                                <td className="p-5 pl-8 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold border border-blue-100 dark:border-blue-900/50">
                                                            <Users size={16} />
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-bold text-neutral-900 dark:text-white block uppercase tracking-tight italic">
                                                                {member.fullname}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide flex items-center gap-1">
                                                                <MapPin size={10} className="text-blue-500" /> {member.address}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ORGANIZATION */}
                                                <td className="p-5 align-middle">
                                                    <Badge variant="outline" className="px-2.5 py-1 uppercase text-[9px] tracking-wide font-black bg-neutral-100 dark:bg-neutral-950 border-none italic text-neutral-600">
                                                        {member.organization.name}
                                                    </Badge>
                                                </td>

                                                {/* STATUS */}
                                                <td className="p-5 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        {member.status === 'Active' ? (
                                                            <>
                                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">ACTIVE</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{member.status}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* ACTIONS */}
                                                <td className="p-5 pr-8 align-middle text-right flex items-center justify-end gap-2 h-20">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all"
                                                        onClick={() => { setSelectedMember(member); setIndividualModalOpen(true); }}
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-full transition-all"
                                                        onClick={() => { setSelectedMember(member); setBeneficiaryModalOpen(true); }}
                                                    >
                                                        <CreditCard className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-8 text-[10px] font-bold uppercase tracking-wider border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 shadow-sm rounded-full italic"
                                                        onClick={() => { setSelectedMember(member); setHistoryModalOpen(true); }}
                                                    >
                                                        History <ChevronRight size={12} className="ml-1" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION */}
                    {members.links && (
                        <div className="mt-6">
                            <div className="flex justify-center items-center gap-1">
                                {members.links.map((link: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${link.active
                                            ? 'bg-neutral-900 text-white shadow-lg transform -translate-y-0.5'
                                            : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                            } ${!link.url && 'opacity-40 cursor-not-allowed pointer-events-none'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Individual Message Modal */}
            <Dialog open={individualModalOpen} onOpenChange={setIndividualModalOpen}>
                <DialogContent className="max-w-md bg-white dark:bg-neutral-950 border-none shadow-2xl rounded-3xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 italic">
                            <Mail className="w-6 h-6 text-blue-600" /> Individual Email
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-2 italic">
                            SECURE DISPATCH TO: <span className="text-blue-600 underline">{selectedMember?.fullname}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitIndividual} className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2 italic">Message Subject</Label>
                            <Input
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="ENTER SUBJECT..."
                                className="h-12 bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl text-xs font-bold uppercase tracking-wider px-4 ring-1 ring-neutral-200 dark:ring-neutral-800 focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2 italic">Email Body</Label>
                            <Textarea
                                value={formData.body}
                                onChange={e => setFormData({ ...formData, body: e.target.value })}
                                placeholder="TYPE YOUR MESSAGE..."
                                className="min-h-[160px] bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl text-xs font-bold p-4 leading-relaxed ring-1 ring-neutral-200 dark:ring-neutral-800 focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:-translate-y-1 transition-all italic border-b-4 border-blue-600"
                            >
                                <Send className="w-4 h-4 mr-2" /> Dispatch Message
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Bulk Message Modal */}
            <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
                <DialogContent className="max-w-lg bg-white dark:bg-neutral-950 border-none shadow-2xl rounded-3xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 italic">
                            <Mail className="w-6 h-6 text-blue-600" /> Bulk Broadcast
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-2 italic">
                            SQUAD DISPATCH: SENDING INDEPENDENT EMAILS TO ALL ACTIVE MEMBERS.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitBulk} className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2 italic">Broadcast Subject</Label>
                            <Input
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="ENTER BROADCAST SUBJECT..."
                                className="h-12 bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl text-xs font-bold uppercase tracking-wider px-4 ring-1 ring-neutral-200 dark:ring-neutral-800 focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2 italic">Broadcast Content</Label>
                            <Textarea
                                value={formData.body}
                                onChange={e => setFormData({ ...formData, body: e.target.value })}
                                placeholder="ENTER ANNOUNCEMENT CONTENT..."
                                className="min-h-[180px] bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl text-xs font-bold p-4 leading-relaxed ring-1 ring-neutral-200 dark:ring-neutral-800 focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:-translate-y-1 transition-all italic border-b-4 border-blue-600"
                            >
                                <Send className="w-4 h-4 mr-2" /> Start Bulk Dispatch
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Beneficiary Modal */}
            <Dialog open={beneficiaryModalOpen} onOpenChange={setBeneficiaryModalOpen}>
                <DialogContent className="max-w-md bg-white dark:bg-neutral-950 border-none shadow-2xl rounded-3xl p-8 border-t-[10px] border-emerald-500">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 italic">
                            <CreditCard className="w-6 h-6 text-emerald-600" /> Benefit Dispatch
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-2 italic text-emerald-600">
                            TAGGING RESIDENT: <span className="underline font-black">{selectedMember?.fullname}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitBeneficiary} className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2 italic">Entitlement Name</Label>
                            <Input
                                value={formData.benefit_name}
                                onChange={e => setFormData({ ...formData, benefit_name: e.target.value })}
                                placeholder="E.G. EDUCATIONAL ASSISTANCE, RELIEF GOODS"
                                className="h-12 bg-neutral-50 dark:bg-emerald-950/20 border-none rounded-2xl text-xs font-black uppercase tracking-tight px-4 ring-1 ring-emerald-100 dark:ring-emerald-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2 italic">Claiming Instructions</Label>
                            <Textarea
                                value={formData.instructions}
                                onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                                placeholder="ENTER SPECIFIC INSTRUCTIONS FOR CLAIMING..."
                                className="min-h-[100px] bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl text-xs font-bold p-4 ring-1 ring-neutral-200 dark:ring-neutral-800 focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl hover:-translate-y-1 transition-all italic"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" /> Generate & Notify
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Lifecycle History Modal */}
            <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
                <DialogContent className="max-w-2xl bg-white dark:bg-neutral-950 border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
                    <div className="bg-neutral-900 p-8 text-white relative">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Citizen Lifecycle</h2>
                            <p className="text-xs font-bold opacity-60 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                <History size={14} className="text-blue-500" /> Audit Log for {selectedMember?.fullname}
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Search size={120} />
                        </div>
                    </div>

                    <div className="p-8 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-neutral-100 dark:before:bg-neutral-800">
                            
                            {/* Enrollment Event */}
                            <div className="relative pl-10">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-600 border-4 border-white dark:border-neutral-950 flex items-center justify-center shadow-lg shadow-blue-500/20" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 italic">Account Activated</p>
                                    <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">System Onboarding Complete</h4>
                                    <p className="text-[10px] font-medium text-neutral-500">{selectedMember?.created_at}</p>
                                </div>
                            </div>

                            {/* Communication History */}
                            {(selectedMember as any)?.communications?.map((comm: any, i: number) => (
                                <div key={i} className="relative pl-10 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-900 dark:bg-white border-4 border-white dark:border-neutral-950 flex items-center justify-center shadow-lg">
                                        <Mail size={10} className="text-white dark:text-neutral-950" />
                                    </div>
                                    <div className="space-y-1 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">{comm.type} Dispatch</p>
                                            <span className="text-[9px] font-mono opacity-40">{new Date(comm.created_at).toLocaleString()}</span>
                                        </div>
                                        <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">{comm.subject}</h4>
                                        <p className="text-[11px] text-neutral-500 line-clamp-2 italic mt-1 leading-relaxed">
                                            {comm.body}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Beneficiary Dispatch History */}
                            {(selectedMember as any)?.dispatches?.map((disp: any, i: number) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white dark:border-neutral-950 flex items-center justify-center shadow-lg">
                                        <CreditCard size={10} className="text-white" />
                                    </div>
                                    <div className="space-y-1 bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 italic">Benefit Assigned</p>
                                            <span className="text-[9px] font-mono opacity-40">{new Date(disp.created_at).toLocaleString()}</span>
                                        </div>
                                        <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">{disp.benefit_name}</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[9px] font-black bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-100">REF: {disp.reference_number}</span>
                                            <Badge variant="outline" className="text-[8px] font-black uppercase text-emerald-600 border-emerald-200">{disp.status}</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* No History Placeholder */}
                            {(!selectedMember?.communications?.length && !selectedMember?.dispatches?.length) && (
                                <div className="text-center py-10 opacity-30 select-none">
                                    <History size={40} className="mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">No activity recorded yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setHistoryModalOpen(false)}
                            className="text-[10px] font-black uppercase tracking-widest italic"
                        >
                            Close Record
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}