import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity, Calendar, Heart, Users, Briefcase, Baby, Accessibility,
    User, ChevronDown, ChevronUp, Clock, CheckCircle2, AlertCircle
} from "lucide-react";

// --- INTERFACES ---
interface GadActivity {
    id: number;
    title: string;
    activity_type: string;
    status: string;
    date_scheduled: string;
}

interface GadStats {
    projects: number;
    budget: number;
    beneficiaries: number;
}

// --- HELPER COMPONENT: ACTIVITY CARD ---
const ActivityCard = ({ activity }: { activity: GadActivity }) => {
    const isOngoing = activity.status === 'Ongoing';
    const isPlanned = activity.status === 'Planned';
    const isCompleted = activity.status === 'Completed';

    return (
        <div className={`bg-white dark:bg-neutral-900 rounded-lg border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full ${isOngoing ? 'border-blue-400 ring-2 ring-blue-50 dark:ring-blue-900/30' : 'border-slate-200 dark:border-neutral-800'}`}>
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <Badge variant={activity.activity_type === 'Client-Focused' ? 'default' : 'secondary'} className="rounded-sm text-[10px] uppercase">
                        {activity.activity_type}
                    </Badge>

                    {isOngoing && (
                        <span className="flex items-center text-[10px] font-black text-blue-600 dark:text-blue-400 animate-pulse uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-1.5"></span> Happening Now
                        </span>
                    )}
                    {isPlanned && (
                        <span className="flex items-center text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                            <Clock className="w-3 h-3 mr-1" /> Upcoming
                        </span>
                    )}
                    {isCompleted && (
                        <span className="flex items-center text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Done
                        </span>
                    )}
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 line-clamp-2 uppercase leading-snug">{activity.title}</h3>

                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 dark:text-slate-500" />
                    {new Date(activity.date_scheduled).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className={`px-6 py-3 border-t dark:border-neutral-800 mt-auto ${isOngoing ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-slate-50/50 dark:bg-neutral-950/50'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Status: <span className={isCompleted ? 'text-emerald-600 dark:text-emerald-400' : isOngoing ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}>{activity.status}</span>
                </p>
            </div>
        </div>
    );
};

// --- HELPER COMPONENT: EXPANDABLE SECTION (THE MAGIC) ---
const ActivitySection = ({ title, icon: Icon, activities, colorClass, bgClass, borderClass, darkBgClass, darkBorderClass }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const INITIAL_LIMIT = 3; // Show only 3 items initially

    if (activities.length === 0) return null;

    // Logic: Slice the array if not expanded
    const displayedActivities = isExpanded ? activities : activities.slice(0, INITIAL_LIMIT);
    const hiddenCount = activities.length - INITIAL_LIMIT;

    return (
        <div className={`rounded-xl border ${borderClass} ${darkBorderClass || 'dark:border-neutral-800'} overflow-hidden mb-10`}>
            {/* Section Header */}
            <div className={`px-6 py-4 flex items-center justify-between ${bgClass} ${darkBgClass}`}>
                <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${colorClass}`}>
                    <Icon className="w-5 h-5" /> {title}
                    <span className="ml-2 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-full text-xs border border-black/5 dark:border-white/10 shadow-sm text-slate-900 dark:text-white">
                        {activities.length}
                    </span>
                </h3>
            </div>


            {/* Grid Content */}
            <div className="p-6 bg-white dark:bg-neutral-900/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedActivities.map((activity: any) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>

                {/* "View All" Toggle Button */}
                {activities.length > INITIAL_LIMIT && (
                    <div className="mt-8 text-center relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100 dark:border-neutral-800"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`uppercase font-bold text-xs tracking-widest bg-white dark:bg-neutral-800 ${colorClass} border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all`}
                            >
                                {isExpanded ? (
                                    <span className="flex items-center">Show Less <ChevronUp className="ml-2 w-4 h-4" /></span>
                                ) : (
                                    <span className="flex items-center">View All {hiddenCount} More <ChevronDown className="ml-2 w-4 h-4" /></span>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- MAIN PAGE ---
export default function GadIndex({ activities = [], stats }: { activities?: GadActivity[], stats: GadStats }) {

    const scrollToTransparency = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById('transparency-board');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Filter Data
    const ongoingActivities = activities.filter(a => a.status === 'Ongoing');
    const plannedActivities = activities.filter(a => a.status === 'Planned');
    const completedActivities = activities.filter(a => a.status === 'Completed');

    return (
        <PublicLayout>
            <Head title="Gender and Development - Brgy 183 Villamor" />

            {/* FIXED BACKGROUND LOGO */}
            <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-0">
                <img
                    src="/Logo/barangay183LOGO.png"
                    alt="Barangay 183 Logo"
                    className="w-[500px] opacity-10 dark:opacity-5"
                />
            </div>

            <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">

                {/* HERO SECTION */}
                <section className="bg-slate-900 border-b-8 border-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent z-0"></div>
                    <div className="container mx-auto px-6 py-20 relative z-10">
                        <div className="max-w-4xl">
                            <h2 className="text-purple-400 font-black uppercase tracking-[0.3em] text-sm mb-4">Republic Act 9710</h2>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-tight mb-6 tracking-tighter">
                                Gender and <span className="text-purple-500">Development</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mb-8 leading-relaxed">
                                "Promoting women's empowerment, gender equality, and inclusive growth for every family in Barangay 183 Villamor."
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    asChild
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase px-8 py-6 text-sm rounded-md shadow-lg transition-transform active:scale-95 cursor-pointer"
                                    onClick={scrollToTransparency}
                                >
                                    <a href="#transparency-board">
                                        View Transparency Board <ChevronDown className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-6 py-12 space-y-20">

                    {/* TRANSPARENCY BOARD (UNCHANGED) */}
                    <section id="transparency-board">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="text-purple-600 w-6 h-6" />
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Transparency Board</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-white dark:bg-neutral-900 border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow dark:border-neutral-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projects Implemented</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black text-slate-900 dark:text-white">{stats.projects}</div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Completed GAD Programs</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white dark:bg-neutral-900 border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow dark:border-neutral-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Budget Utilized</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">₱{stats.budget.toLocaleString()}</div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Directly funded to community projects</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white dark:bg-neutral-900 border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow dark:border-neutral-800">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Beneficiaries Served</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black text-blue-600 dark:text-blue-400">{stats.beneficiaries > 0 ? stats.beneficiaries : '1,200+'}</div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">estimated families & individuals</p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* SECTORS GRID (UNCHANGED) */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="text-purple-600 w-6 h-6" />
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Sectors We Support</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                                { name: "Women (KALIPI)", icon: Users, href: "/organizations/kalipi", color: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-900" },
                                { name: "Solo Parents", icon: Heart, href: "/organizations/solo-parents", color: "text-pink-600 dark:text-pink-400", border: "border-pink-200 dark:border-pink-900" },
                                { name: "Children (VCO)", icon: Baby, href: "#", color: "text-sky-500 dark:text-sky-400", border: "border-sky-200 dark:border-sky-900" },
                                { name: "PWDs (KABAHAGI)", icon: Accessibility, href: "#", color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900" },
                                { name: "Men (ERPAT)", icon: User, href: "#", color: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-900" },
                            ].map((sector, index) => (
                                <Link key={index} href={sector.href} className={`group block p-6 bg-white dark:bg-neutral-900 rounded-lg border ${sector.border} shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-700 transition-all text-center`}>
                                    <sector.icon className={`mx-auto w-8 h-8 ${sector.color} mb-3 group-hover:scale-110 transition-transform`} />
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase">{sector.name}</h3>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* --- DYNAMIC PROGRAM SECTIONS --- */}
                    <section>
                        <div className="flex items-center gap-2 border-b dark:border-neutral-800 pb-4 mb-8">
                            <Briefcase className="text-purple-600 w-6 h-6" />
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Programs & Activities</h2>
                        </div>

                        {/* 1. ONGOING */}
                        <ActivitySection
                            title="Happening Now"
                            icon={Activity}
                            activities={ongoingActivities}
                            colorClass="text-blue-600 dark:text-blue-400"
                            bgClass="bg-blue-50"
                            darkBgClass="dark:bg-blue-900/20"
                            borderClass="border-blue-200"
                            darkBorderClass="dark:border-blue-900/50"
                        />

                        {/* 2. PLANNED */}
                        <ActivitySection
                            title="Upcoming Events"
                            icon={Clock}
                            activities={plannedActivities}
                            colorClass="text-amber-600 dark:text-amber-400"
                            bgClass="bg-amber-50"
                            darkBgClass="dark:bg-amber-900/20"
                            borderClass="border-amber-200"
                            darkBorderClass="dark:border-amber-900/50"
                        />

                        {/* 3. COMPLETED */}
                        <ActivitySection
                            title="Accomplishment Reports"
                            icon={CheckCircle2}
                            activities={completedActivities}
                            colorClass="text-emerald-600 dark:text-emerald-400"
                            bgClass="bg-emerald-50"
                            darkBgClass="dark:bg-emerald-900/20"
                            borderClass="border-emerald-200"
                            darkBorderClass="dark:border-emerald-900/50"
                        />

                        {/* EMPTY STATE */}
                        {activities.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-slate-50 dark:bg-neutral-900 rounded-lg border border-dashed border-slate-300 dark:border-neutral-800">
                                <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400 font-medium">No recent activities found.</p>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </PublicLayout>
    );
}
