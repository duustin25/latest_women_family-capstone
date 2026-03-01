import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { History, User, Search, Download, FileText, Clock, Filter, Server } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

interface AuditLogProps {
    logs: {
        data: Array<{
            id: number;
            action: string;
            auditable_type: string;
            auditable_id: number;
            old_values: any;
            new_values: any;
            created_at: string;
            user: {
                name: string;
                role: string;
            } | null;
        }>;
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: any;
}

export default function AuditLogs({ logs, filters }: AuditLogProps) {

    const [searchQuery, setSearchQuery] = useState('');

    const formatActionType = (action: string) => {
        const _action = action.toLowerCase();
        if (_action.includes('created') || _action.includes('approved')) return 'success';
        if (_action.includes('deleted') || _action.includes('archived')) return 'critical';
        if (_action.includes('updated') || _action.includes('modified')) return 'warning';
        return 'info';
    };

    const getModelName = (fullyQualifiedName: string) => {
        return fullyQualifiedName.split('\\').pop() || 'Unknown Record';
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Audit Logs', href: '#' }]}>
            <Head title="Audit Trails" />

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
                                System Activity, Traceability and Accountability Records.
                            </p>
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
                            <Button asChild variant="outline" className="h-9 px-4 rounded-lg border-neutral-200 hover:border-neutral-300 text-neutral-600 font-bold uppercase tracking-wide text-xs">
                                <Link href="/admin/audit-logs"><History className="w-4 h-4 mr-2" /> Refresh</Link>
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
                                    {logs.data.length === 0 ? (
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
                                        logs.data.map((log) => {
                                            const actionType = formatActionType(log.action);
                                            return (
                                                <tr key={log.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                    <td className="p-5 pl-8 align-middle">
                                                        <div className="flex flex-col">
                                                            <Badge variant="outline" className={`w-fit mb-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${actionType === 'critical' ? 'bg-red-50 text-red-600 border-red-200' :
                                                                actionType === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                                    actionType === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                                        'bg-blue-50 text-blue-600 border-blue-200'
                                                                }`}>
                                                                {log.action}
                                                            </Badge>
                                                        </div>
                                                    </td>

                                                    <td className="p-5 align-middle">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 font-bold border border-neutral-200 dark:border-neutral-700">
                                                                {log.user ? <User size={14} /> : <Server size={14} />}
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold text-neutral-900 dark:text-white block uppercase tracking-tight">
                                                                    {log.user ? log.user.name : 'System Generated'}
                                                                </span>
                                                                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium uppercase">
                                                                    {log.user ? log.user.role : 'Automated'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="p-5 align-middle">
                                                        <div className="flex items-center gap-2">
                                                            <FileText size={14} className="text-neutral-400" />
                                                            <div>
                                                                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight block">
                                                                    {getModelName(log.auditable_type)}
                                                                </span>
                                                                <span className="text-[10px] text-neutral-500 font-medium">
                                                                    ID: {log.auditable_id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="p-5 pr-8 align-middle text-right">
                                                        <div>
                                                            <span className="text-xs font-bold text-neutral-900 dark:text-white block uppercase tracking-tight">
                                                                {new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium flex items-center justify-end gap-1">
                                                                <Clock size={10} /> {new Date(log.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                Page {logs.current_page} of {logs.last_page}
                            </span>
                            <div className="flex gap-2">
                                {logs.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        className={`h-8 font-bold text-xs ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) window.location.href = link.url;
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AppLayout>
    );
}