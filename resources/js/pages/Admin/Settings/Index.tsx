import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { cn } from "@/lib/utils";

// Import Partials
import CaseReferralSettings from './Partials/CaseReferralSettings';
import AppearanceSettings from './Partials/AppearanceSettings';
import OngoingStatus from './Partials/OngoingStatus';

interface PageProps {
    abuseTypes: any[];
    referralPartners: any[];
    ongoingStatuses: any[];
}

export default function Index({ abuseTypes, referralPartners, ongoingStatuses }: PageProps) {
    const [activeTab, setActiveTab] = useState('case_categories');

    const tabs = [
        { id: 'case_categories', label: 'Case & Referrals Categories' },
        { id: 'appearance', label: 'Display' },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'System Settings', href: '#' }
        ]}>
            <Head title="System Settings" />

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Settings className="w-6 h-6 text-slate-600" />
                        System Configuration
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage dynamic lists and system security resources.</p>
                </div>

                <div className="w-full">
                    {/* Tab Navigation */}
                    <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 p-1 text-slate-500 w-full max-w-2xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all w-full",
                                    activeTab === tab.id ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm" : "hover:bg-slate-200/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-6 animate-in fade-in zoom-in-95 duration-300">
                        {activeTab === 'case_categories' && (
                            <div className="space-y-6">
                                <CaseReferralSettings abuseTypes={abuseTypes} referralPartners={referralPartners} />
                                <OngoingStatus statuses={ongoingStatuses} />
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <AppearanceSettings />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}