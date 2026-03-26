import { Head, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, MapPin, Calendar, Plus, X, Search, FileText, Activity, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GadEvent {
    id: number;
    title: string;
    description: string;
    event_date: string;
    event_time: string;
    location: string;
    image_path: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'reschedule_requested';
    reject_reason?: string | null;
}

interface PageProps {
    events: { data: GadEvent[]; links: any[]; };
    filters: { search?: string; status?: string; }
}

const STATUS_CONFIG = {
    pending: { label: 'Pending Approval', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
    approved: { label: 'Approved ✓', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700 hover:bg-red-100' },
    reschedule_requested: { label: '⚠ Action Required', className: 'bg-orange-100 text-orange-700 hover:bg-orange-100' },
};

export default function Index({ events, filters }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<GadEvent | null>(null);

    const [formData, setFormData] = useState({
        title: '', description: '', event_date: '', event_time: '', location: '',
        image_path: null as File | null,
    });

    const navigate = (params: object) =>
        router.get('/admin/organization/events', params, { preserveState: true });

    const handleDelete = (event: GadEvent) => {
        if (confirm(`Delete proposal "${event.title}"? Cannot be undone.`))
            router.delete(`/admin/organization/events/${event.id}`);
    };

    const openCreate = () => {
        setEditingEvent(null);
        setFormData({ title: '', description: '', event_date: '', event_time: '', location: '', image_path: null });
        setIsModalOpen(true);
    };

    const openEdit = (event: GadEvent) => {
        setEditingEvent(event);
        setFormData({
            title: event.title, description: event.description,
            event_date: event.event_date.split('T')[0], event_time: event.event_time || '',
            location: event.location, image_path: null,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            router.post(`/admin/organization/events/${editingEvent.id}`, { _method: 'put', ...formData, image_path: formData.image_path || undefined }, { onSuccess: () => setIsModalOpen(false) });
        } else {
            router.post('/admin/organization/events', formData as any, { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const filterTab = (label: string, value: string | undefined) => {
        const active = filters?.status === value || (!value && !filters?.status);
        return (
            <button
                onClick={() => navigate({ search: searchQuery, status: value })}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'}`}
            >{label}</button>
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Event Proposals', href: '#' }]}>
            <Head title="Event Proposals" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">Event Proposals</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg mt-1">Submit and track event proposals for Admin approval.</p>
                        </div>
                        <Button onClick={openCreate} className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg">
                            <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                            <span className="font-bold uppercase tracking-wide text-xs">Propose Event</span>
                        </Button>
                    </div>

                    {/* Control bar */}
                    <div className="sticky top-4 z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-4 mb-8">
                        <div className="bg-neutral-100 dark:bg-neutral-950 px-3 h-10 rounded-lg flex items-center gap-2 w-full md:max-w-[280px]">
                            <Search size={14} className="text-neutral-400 shrink-0" />
                            <input placeholder="SEARCH PROPOSALS..." className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                value={searchQuery} onChange={e => { setSearchQuery(e.target.value); navigate({ search: e.target.value, status: filters?.status }); }} autoComplete="off" />
                            {filters?.search && <button onClick={() => { setSearchQuery(''); navigate({}); }} className="text-neutral-400 hover:text-red-500"><X size={12} /></button>}
                        </div>
                        <div className="flex items-center gap-1 border border-neutral-200 dark:border-neutral-800 rounded-full px-2 py-1">
                            {filterTab('All', undefined)}
                            {filterTab('Pending', 'pending')}
                            {filterTab('Approved', 'approved')}
                            {filterTab('Rejected', 'rejected')}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-5 pl-8">Proposal Details</th>
                                        <th className="p-5">When & Where</th>
                                        <th className="p-5 text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {events.data.length === 0 ? (
                                        <tr><td colSpan={3} className="p-12 text-center">
                                            <div className="flex flex-col items-center opacity-60">
                                                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400"><Activity size={20} /></div>
                                                <h3 className="text-sm font-bold uppercase">No Proposals Yet</h3>
                                                <p className="text-xs text-neutral-500">Click "Propose Event" to submit your first proposal.</p>
                                            </div>
                                        </td></tr>
                                    ) : events.data.map(item => {
                                        const sc = STATUS_CONFIG[item.status];
                                        return (
                                            <tr key={item.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="p-5 pl-8 align-top">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0 mt-0.5">
                                                            {item.image_path ? <img src={`/storage/${item.image_path}`} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-neutral-400"><FileText size={14} /></div>}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">{item.title}</span>
                                                                <Badge className={`${sc.className} text-[9px] uppercase tracking-widest px-1.5 py-0`}>{sc.label}</Badge>
                                                            </div>
                                                            <span className="text-[10px] text-neutral-500 font-medium block max-w-sm">{item.description}</span>
                                                            {/* Reject / Reschedule Reason Banner */}
                                                            {item.reject_reason && (
                                                                <div className="flex items-start gap-2 p-2 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900/40 text-orange-700 dark:text-orange-400 text-xs mt-1 max-w-sm">
                                                                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                                                    <div>
                                                                        <p className="font-bold uppercase text-[9px] tracking-wider mb-0.5">{item.status === 'reschedule_requested' ? 'Admin says:' : 'Reject reason:'}</p>
                                                                        <p className="font-medium">{item.reject_reason}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5 align-middle">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase">
                                                            <Calendar size={12} className="text-neutral-400" />
                                                            {new Date(item.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            {item.event_time && <span className="opacity-75">• {new Date(`2000-01-01T${item.event_time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-500"><MapPin size={12} /> {item.location}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 pr-8 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button onClick={() => openEdit(item)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-neutral-900"><Pencil size={14} /></Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-neutral-900"><MoreHorizontal size={14} /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem className="text-red-600 font-bold cursor-pointer" onClick={() => handleDelete(item)}>Delete Proposal</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="uppercase tracking-widest font-black">{editingEvent ? 'Edit Proposal' : 'New Event Proposal'}</DialogTitle>
                    </DialogHeader>
                    {/* Show the reschedule notice inside the edit modal */}
                    {editingEvent?.status === 'reschedule_requested' && editingEvent.reject_reason && (
                        <Alert className="border-orange-200 bg-orange-50 text-orange-800">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <AlertTitle className="text-xs font-black uppercase tracking-wider">Reschedule Requested by Admin</AlertTitle>
                            <AlertDescription className="text-xs mt-1">{editingEvent.reject_reason}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Event Title</Label>
                            <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Description</Label>
                            <Textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label className="uppercase text-xs font-bold text-slate-500">Date</Label>
                                <Input type="date" required value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="uppercase text-xs font-bold text-slate-500">Time</Label>
                                <Input type="time" required value={formData.event_time} onChange={e => setFormData({ ...formData, event_time: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="uppercase text-xs font-bold text-slate-500">Venue</Label>
                                <Input required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Poster / Image (Optional)</Label>
                            <Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image_path: e.target.files ? e.target.files[0] : null })} />
                        </div>
                        <div className="pt-2 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                                {editingEvent ? (editingEvent.status === 'reschedule_requested' ? '↺ Resubmit for Approval' : 'Save Changes') : 'Submit Proposal'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
