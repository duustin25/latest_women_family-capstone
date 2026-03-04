import { Head, router, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal, Pencil, Trash2, MapPin, Calendar,
    LayoutDashboard, Plus, X, Search, FileText, Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GadEvent {
    id: number;
    title: string;
    description: string;
    event_date: string;
    event_time: string;
    location: string;
    image_path: string | null;
}

interface PageProps {
    events: {
        data: GadEvent[];
        links: any[];
        meta?: {
            total: number;
            links: any[];
        };
    };
    filters: {
        search: string;
    }
}

export default function Index({ events, filters }: PageProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<GadEvent | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: '',
        image_path: null as File | null,
    });

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        router.get('/admin/gad/events',
            { search: term },
            { preserveState: true }
        );
    }

    const handleClear = () => {
        setSearchQuery('');
        router.get('/admin/gad/events', {}, { preserveState: true });
    };

    const handleDelete = (event: GadEvent) => {
        if (confirm(`Delete this event: ${event.title}? This action cannot be undone.`)) {
            router.delete(`/admin/gad/events/${event.id}`);
        }
    };

    const openEditForm = (event: GadEvent) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            event_date: event.event_date.split('T')[0], // Extract Date
            event_time: event.event_time,
            location: event.location,
            image_path: null,
        });
        setIsModalOpen(true);
    };

    const openCreateForm = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            event_date: '',
            event_time: '',
            location: '',
            image_path: null,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use Inertia's progress file upload form approach
        if (editingEvent) {
            // For method spoofing since Inertia doesn't support PUT with files natively gracefully
            router.post(`/admin/gad/events/${editingEvent.id}`, {
                _method: 'put',
                ...formData,
                image_path: formData.image_path || undefined
            }, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            router.post('/admin/gad/events', formData as any, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    // Render status helper removed

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'GAD Events', href: '#' }]}>
            <Head title="GAD Events Management" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">
                                    GAD Events & Programs
                                </h2>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Manage advocacy campaigns, seminars, and gender-development activities.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button onClick={openCreateForm} className="h-12 px-6 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border-2 border-transparent dark:border-neutral-700">
                                <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
                                <span className="font-bold uppercase tracking-wide text-xs">Add Event</span>
                            </Button>
                        </div>
                    </div>

                    {/* CONTROL BAR */}
                    <div className="sticky top-4 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                            <div className="bg-neutral-100 dark:bg-neutral-950 px-3 h-10 rounded-lg flex items-center gap-2 w-full md:max-w-[320px]">
                                <Search size={14} className="text-neutral-400" />
                                <input
                                    placeholder="SEARCH EVENTS..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    autoComplete="off"
                                />
                                {filters?.search && (
                                    <button onClick={handleClear} className="text-neutral-400 hover:text-red-500">
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TABLE VIEW */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-5 pl-8">Event Details</th>
                                        <th className="p-5">When & Where</th>
                                        <th className="p-5 text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {events.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <Activity size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No Events Found</h3>
                                                    <p className="text-xs text-neutral-500">Add an upcoming GAD activity.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        events.data.map((item) => (
                                            <tr key={item.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="p-5 pl-8 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                                                            {item.image_path ? (
                                                                <img src={`/storage/${item.image_path}`} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                                    <FileText size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-bold text-neutral-900 dark:text-white block uppercase tracking-tight line-clamp-1">
                                                                {item.title}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium line-clamp-1 max-w-[250px] mt-0.5">
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-5 align-middle">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">
                                                            <Calendar size={12} className="text-neutral-400" />
                                                            {new Date(item.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            {item.event_time && (
                                                                <span className="ml-1 opacity-75">
                                                                    • {new Date(`2000-01-01T${item.event_time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-500">
                                                            <MapPin size={12} /> {item.location}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="p-5 pr-8 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button onClick={() => openEditForm(item)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-700">
                                                            <Pencil size={14} />
                                                        </Button>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem className="text-red-600 font-bold focus:text-red-700 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(item)}>
                                                                    Delete Event
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* EVENT FORM MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="uppercase tracking-widest font-black">
                            {editingEvent ? 'Edit Event' : 'New Event'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Event Title</Label>
                            <Input placeholder="E.g., Women's Month Zumba" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Description</Label>
                            <Textarea placeholder="Details about the event..." required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-5 space-y-2">
                                <Label className="uppercase text-xs font-bold text-slate-500">Date</Label>
                                <Input type="date" required value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} />
                            </div>
                            <div className="col-span-3 space-y-2">
                                <Label className="uppercase text-xs font-bold text-slate-500">Time</Label>
                                <Input type="time" required value={formData.event_time} onChange={e => setFormData({ ...formData, event_time: e.target.value })} />
                            </div>
                            <div className="col-span-4 space-y-2">
                                <Label className="uppercase text-xs font-bold text-slate-500">Location</Label>
                                <Input placeholder="E.g., Brgy Gym" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Poster / Image (Optional)</Label>
                            <Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image_path: e.target.files ? e.target.files[0] : null })} />
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>CANCEL</Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-wider">{editingEvent ? 'Save Changes' : 'Create Event'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
