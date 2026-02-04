import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Users, Search, MapPin, History, FileText, UserCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function MembersIndex() {
    // MOCK: This shows how one person is linked to multiple system parts
    const members = [
        { id: 1, name: 'MARIA DELA CRUZ', address: '123 AVIATION ST.', orgs: ['KALIPI', 'SOLO PARENT'], cases: 1 },
        { id: 2, name: 'JUAN LUNA', address: '456 VILLAMOR AVE.', orgs: ['ERPAT'], cases: 0 },
        { id: 3, name: 'ELENA REYES', address: '789 AIRBASE RD.', orgs: ['KABAHAGI'], cases: 2 },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Members', href: '#' }]}>
            <Head title="Master Member List" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-600" /> 
                            Citizen Master Records
                        </h2>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
                            Centralized Database for Brgy. 183 Residents
                        </p>
                    </div>
                </div>

                {/* --- UNIQUE NAME/ADDRESS SEARCH --- */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input placeholder="SEARCH FULL NAME..." className="pl-10 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 border-none" />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input placeholder="FILTER BY ADDRESS..." className="pl-10 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 border-none" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4">Resident Identity</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-6">Affiliations</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 text-center">Case History</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b dark:border-slate-800 last:border-0">
                                    <TableCell className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 dark:text-white text-xs uppercase">{member.name}</span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                <MapPin size={10} /> {member.address}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex gap-1">
                                            {member.orgs.map((org, i) => (
                                                <span key={i} className="text-[8px] font-black uppercase px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                                    {org}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 text-center">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${member.cases > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                                            {member.cases} RECORDS
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <Button variant="ghost" className="h-8 text-[9px] font-black uppercase tracking-widest text-blue-600">
                                            <History className="w-3 h-3 mr-1" /> Profile
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}