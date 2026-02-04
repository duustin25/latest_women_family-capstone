import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { History, User, Activity, Search, ShieldCheck, Clock, Download } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AuditLogs() {
    // MOCK DATA: Simulating high-level accountability
    const logs = [
        { id: 1, user: 'Admin (Chairperson)', action: 'ARCHIVED CASE', target: 'VAWC-2026-001', date: 'JAN 28, 2026', time: '14:30' },
        { id: 2, user: 'KALIPI Head', action: 'APPROVED MEMBER', target: 'ELENA REYES', date: 'JAN 28, 2026', time: '11:20' },
        { id: 3, user: 'Admin (Chairperson)', action: 'UPDATED ANNOUNCEMENT', target: 'HEALTH MISSION 2026', date: 'JAN 27, 2026', time: '09:15' },
        { id: 4, user: 'VAWC Officer', action: 'SOFT DELETED CASE', target: 'VAWC-2026-009', date: 'JAN 26, 2026', time: '16:45' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Audit Logs', href: '#' }]}>
            <Head title="Audit Logs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <History className="w-6 h-6 text-blue-600" /> 
                            System Audit Trail
                        </h2>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
                            Traceability and Accountability Records for Brgy. 183
                        </p>
                    </div>
                    <Button variant="outline" className="h-10 text-[10px] font-black uppercase tracking-widest border-2">
                        <Download className="w-4 h-4 mr-2" /> Export Audit Report
                    </Button>
                </div>

                {/* --- FILTER & SEARCH --- */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input placeholder="SEARCH ACTIONS OR USERS..." className="pl-10 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <select className="h-11 px-4 text-[10px] font-black uppercase bg-slate-50 dark:bg-slate-800 border-none rounded-md dark:text-slate-400">
                        <option>ALL ACTIONS</option>
                        <option>DELETIONS</option>
                        <option>CASE UPDATES</option>
                        <option>MEMBER APPROVALS</option>
                    </select>
                </div>

                {/* --- LOG TABLE --- */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow className="border-b dark:border-slate-800">
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 py-4">Action</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-6">User</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-6">Target Record</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-6 text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b dark:border-slate-800 last:border-0">
                                    <TableCell className="px-6 py-4">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-sm ${log.action.includes('DELETE') || log.action.includes('ARCHIVE') ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                            {log.action}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-slate-400" />
                                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">{log.user}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{log.target}</span>
                                    </TableCell>
                                    <TableCell className="px-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-slate-900 dark:text-white">{log.date}</span>
                                            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                                <Clock size={10} /> {log.time}
                                            </span>
                                        </div>
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