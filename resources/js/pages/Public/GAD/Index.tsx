import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity, Calendar, Heart, Users, Briefcase, Baby, Accessibility,
    User, ChevronDown, ChevronUp, Clock, CheckCircle2, AlertCircle, MapPin
} from "lucide-react";

interface GadEvent {
    id: number;
    title: string;
    description: string;
    event_date: string;
    event_time: string | null;
    location: string;
}

// --- HELPER COMPONENT: ACTIVITY CARD ---
const ActivityCard = ({ activity }: { activity: GadEvent }) => {
    // Dynamic "Happening Now" Logic
    const eventDate = new Date(activity.event_date);
    const today = new Date();
    const eventDateNormalized = new Date(eventDate);
    eventDateNormalized.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const isToday = eventDateNormalized.getTime() === today.getTime();
    const isPast = eventDateNormalized.getTime() < today.getTime();

    // Check if the current time is close to or past the event time
    let isHappeningNow = false;
    if (isToday && activity.event_time) {
        const currentTime = new Date();
        const eventStartTime = new Date(`${activity.event_date.split('T')[0]}T${activity.event_time}`);
        const eventEndTime = new Date(eventStartTime.getTime() + (3 * 60 * 60 * 1000)); // Assume 3 hour duration

        isHappeningNow = currentTime >= eventStartTime && currentTime <= eventEndTime;
    }

    return (
        <div className={`bg-white dark:bg-neutral-900 rounded-lg border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full ${isHappeningNow ? 'border-purple-400 ring-2 ring-purple-50 dark:ring-purple-900/30' : 'border-slate-200 dark:border-neutral-800'} relative`}>

            {/* FLOATING POPUP LABEL */}
            {isHappeningNow && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-lg shadow-md z-10 flex items-center animate-bounce">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                    Happening Now!
                </div>
            )}

            <div className="p-6 flex-1 pt-8">
                <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="rounded-sm text-[10px] uppercase text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400">
                        Community Event
                    </Badge>

                    {isPast && !isToday && (
                        <span className="flex items-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Done
                        </span>
                    )}
                    {!isPast && !isHappeningNow && (
                        <span className="flex items-center text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                            <Clock className="w-3 h-3 mr-1" /> Upcoming
                        </span>
                    )}
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 line-clamp-2 uppercase leading-snug">{activity.title}</h3>

                <p className="text-xs text-slate-500 mb-4 line-clamp-3">{activity.description}</p>

                <div className="flex flex-col gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wide">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 dark:text-slate-500" />
                            {new Date(activity.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>

                        {activity.event_time && (
                            <span className="flex items-center bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                                <Clock className="w-3.5 h-3.5 mr-1" />
                                {new Date(`2000-01-01T${activity.event_time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className={`px-6 py-3 border-t dark:border-neutral-800 mt-auto flex justify-between items-center ${isHappeningNow ? 'bg-purple-50/50 dark:bg-purple-900/10' : 'bg-slate-50/50 dark:bg-neutral-950/50'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5 w-full">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{activity.location}</span>
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


// --- HELPER COMPONENT: CALENDAR GRID ---
const CalendarGrid = ({ activities }: { activities: GadEvent[] }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const [viewDate, setViewDate] = useState(new Date(currentYear, currentMonth, 1));

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setViewDate(new Date(currentYear, currentMonth, 1));
    };

    // Get number of days in the month and the starting day of the week
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

    const days = [];

    // Add empty slots for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[100px] p-2 bg-slate-50/50 dark:bg-neutral-900/30 rounded-lg border border-transparent"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate() && viewDate.getMonth() === currentMonth && viewDate.getFullYear() === currentYear;

        // Find events on this day
        const dayEvents = activities.filter(a => {
            const eventDateStr = new Date(a.event_date).toISOString().split('T')[0];
            return eventDateStr === currentDateStr;
        });

        days.push(
            <div key={`day-${day}`} className={`min-h-[120px] p-2 border border-slate-100 dark:border-neutral-800 rounded-lg flex flex-col gap-1 transition-all ${isToday ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/50' : 'bg-white dark:bg-neutral-900 hover:border-purple-200 dark:hover:border-purple-800'}`}>
                <div className={`text-xs font-black p-1 w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}>
                    {day}
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 hide-scrollbar mt-1">
                    {dayEvents.map(event => (
                        <div key={event.id} className="text-[9px] sm:text-[10px] font-bold leading-tight p-1.5 rounded bg-purple-100/50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 flex flex-col group truncate hover:bg-purple-200/50 transition-colors">
                            <span className="truncate">{event.title}</span>
                            <span className="text-[8px] font-medium opacity-70 truncate mt-0.5 flex justify-between items-center">
                                <span>{event.location}</span>
                                {event.event_time && <span>{new Date(`2000-01-01T${event.event_time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-8 px-2 border-slate-200 dark:border-neutral-700">
                        &larr; Prev
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleToday} className="h-8 px-3 font-bold uppercase text-[10px] tracking-wider border-slate-200 dark:border-neutral-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 dark:hover:bg-purple-900/20 dark:hover:text-purple-300">
                        Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-8 px-2 border-slate-200 dark:border-neutral-700">
                        Next &rarr;
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b dark:border-neutral-800 bg-slate-100 dark:bg-neutral-950 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 py-3 rounded-t-lg">
                <div className="text-red-500">Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 p-4 bg-white dark:bg-neutral-900 border border-t-0 dark:border-neutral-800 rounded-b-lg">
                {days}
            </div>
        </div>
    );
};


// --- MAIN PAGE ---
export default function GadIndex({ activities = [] }: { activities?: GadEvent[] }) {

    const scrollToPrograms = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById('programs-board');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Helper: Sort activities so newest/upcoming are first
    const sortedActivities = [...activities].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

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
                                    onClick={scrollToPrograms}
                                >
                                    <a href="#programs-board">
                                        View Programs & Events <ChevronDown className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-6 py-12 space-y-20">

                    {/* SECTORS GRID */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="text-purple-600 w-6 h-6" />
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Organizations We Support</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: "Women's Desk", icon: Heart, href: "/vawc", color: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-900" },
                                { name: "BCPC (Children)", icon: Baby, href: "/bcpc", color: "text-sky-500 dark:text-sky-400", border: "border-sky-200 dark:border-sky-900" },
                                { name: "Organizations", icon: Users, href: "/organizations", color: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-900" },
                                { name: "Officials", icon: User, href: "/officials", color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900" },
                            ].map((sector, index) => (
                                <Link key={index} href={sector.href} className={`group block p-4 bg-white dark:bg-neutral-900 rounded-xl border ${sector.border} shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-700 transition-all text-center`}>
                                    <sector.icon className={`mx-auto w-6 h-6 ${sector.color} mb-2 group-hover:scale-110 transition-transform`} />
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide">{sector.name}</h3>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* --- DYNAMIC PROGRAM SECTIONS --- */}
                    <section id="programs-board">
                        <div className="flex items-center gap-2 border-b dark:border-neutral-800 pb-4 mb-8">
                            <Briefcase className="text-purple-600 w-6 h-6" />
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Programs & Activities</h2>
                        </div>

                        {/* CALENDAR VIEW */}
                        <div className="mb-12">
                            <CalendarGrid activities={activities} />
                        </div>

                        {/* LIST VIEW FALLBACK FOR MOBILE OR QUICK GLANCE */}
                        <div className="mt-12">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Recent & Upcoming Programs
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedActivities.slice(0, 6).map((activity) => (
                                    <ActivityCard key={activity.id} activity={activity} />
                                ))}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </PublicLayout>
    );
}
