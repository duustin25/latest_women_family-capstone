
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { History, User, Search, ShieldCheck, Clock, Download, FileText, Trash2, Eye, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

export default function AuditLogs() {
    // MOCK DATA: Simulating high-level accountability
    const logs = [
        { id: 1, user: 'Admin (Chairperson)', role: 'Admin', action: 'ARCHIVED CASE', target: 'VAWC-2026-001', date: 'JAN 28, 2026', time: '14:30', type: 'critical' },
        { id: 2, user: 'KALIPI Head', role: 'Official', action: 'APPROVED MEMBER', target: 'ELENA REYES', date: 'JAN 28, 2026', time: '11:20', type: 'success' },
        { id: 3, user: 'Admin (Chairperson)', role: 'Admin', action: 'UPDATED ANNOUNCEMENT', target: 'HEALTH MISSION 2026', date: 'JAN 27, 2026', time: '09:15', type: 'info' },
        { id: 4, user: 'VAWC Officer', role: 'Official', action: 'SOFT DELETED CASE', target: 'VAWC-2026-009', date: 'JAN 26, 2026', time: '16:45', type: 'warning' },
        { id: 5, user: 'Admin (Chairperson)', role: 'Admin', action: 'EXPORTED REPORTS', target: 'GAD_REPORT_2025.PDF', date: 'JAN 25, 2026', time: '10:00', type: 'info' },
        { id: 6, user: 'System', role: 'System', action: 'BACKUP CREATED', target: 'DAILY_BACKUP_001', date: 'JAN 25, 2026', time: '00:00', type: 'success' },
    ];

    const [searchQuery, setSearchQuery] = useState('');

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Audit Logs', href: '#' }]}>
            <Head title="Audit Logs" />

            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* HERO SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase leading-none">
                                    Audit Trails
                                </h2>
                            </div>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg ml-1">
                                Traceability and Accountability Records for Brgy. 183.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="outline" className="h-12 px-6 rounded-full border-2 border-neutral-200 hover:border-neutral-300 text-neutral-600 font-bold uppercase tracking-wide text-xs">
                                <Download className="w-4 h-4 mr-2" />
                                Export Log Report
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
                                    placeholder="SEARCH LOGS..."
                                    className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase placeholder:text-neutral-400 text-neutral-900 dark:text-white h-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-lg text-xs font-bold uppercase tracking-wide text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                                <Filter className="w-3 h-3 mr-2" />
                                Filter Actions
                            </Button>
                        </div>
                    </div>

                    {/* TABLE VIEW */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
                                        <th className="p-5 pl-8">Action Taken</th>
                                        <th className="p-5">User Responsible</th>
                                        <th className="p-5">Target Record</th>
                                        <th className="p-5 text-right pr-8">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-neutral-400">
                                                        <History size={20} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight">No logs found</h3>
                                                    <p className="text-xs text-neutral-500">System is clean.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="p-5 pl-8 align-middle">
                                                    <div className="flex flex-col">
                                                        <Badge variant="outline" className={`w-fit mb-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${log.type === 'critical' ? 'bg-red-50 text-red-600 border-red-200' :
                                                                log.type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                                    log.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                                        'bg-blue-50 text-blue-600 border-blue-200'
                                                            }`}>
                                                            {log.action}
                                                        </Badge>
                                                    </div>
                                                </td>

                                                <td className="p-5 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold border border-neutral-200 dark:border-neutral-700">
                                                            <User size={14} />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-neutral-900 dark:text-white block uppercase tracking-tight">
                                                                {log.user}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                                                                {log.role}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="p-5 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <FileText size={14} className="text-neutral-400" />
                                                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">
                                                            {log.target}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="p-5 pr-8 align-middle text-right">
                                                    <div>
                                                        <span className="text-xs font-bold text-neutral-900 dark:text-white block uppercase tracking-tight">
                                                            {log.date}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium flex items-center justify-end gap-1">
                                                            <Clock size={10} /> {log.time}
                                                        </span>
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
        </AppLayout>
    );
}