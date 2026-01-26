import { Head, Link } from '@inertiajs/react';
import * as React from "react";
import { 
    Phone, AlertCircle, Shield, Users, Info, 
    Calendar, MapPin, Search, Filter 
} from "lucide-react";

interface AnnouncementData {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    event_date: string;
    location: string;
    image: string;
}

interface IndexProps {
    announcements: {
        data: AnnouncementData[];
    };
}

// Define it here (outside the component) so it's accessible
const navLinks = [
    { name: 'Announcements', href: '/announcements' },
    { name: 'VAWC', href: '/vawc' },
    { name: 'Child Protection', href: '/cpp' },
    { name: 'GAD', href: '/gad' },
    { name: 'Organizations', href: '/organizations' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
];

export default function Index({ announcements = { data: [] } }: IndexProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState("All");

    // 3. Extract the array from the Resource
    const allAnnouncements = announcements.data;

    const categories = ["All", "VAWC", "Child Protection", "Emergency", "Health", "Events", "GAD", "General", "Organizations"];

    // 4. Update Filter Logic to use allAnnouncements
        const filteredAnnouncements = allAnnouncements.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-violet-200">
            <Head title="Announcements - Brgy 183 Villamor" />
            
            {/* SAME OFFICIAL HEADER */}
            <header className="bg-[#0038a8] text-white">
                <div className="container mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/Logo/Woman-FamilyLOGO.png" alt="Logo" className="w-20 h-20 object-contain" />
                        <div>
                            <h1 className="text-xl md:text-2xl font-black leading-none tracking-tight uppercase">
                                Women and Family Protection & Support System
                            </h1>
                            <p className="text-[11px] font-bold opacity-90 uppercase tracking-widest mt-1">
                                Barangay 183 Villamor, Pasay City
                            </p>
                        </div>
                    </div>
                </div>

                {/* SAME FLAT NAVIGATION */}
                <nav className="bg-[#002a7a] border-t border-white/10 hidden md:block">
                    <div className="container mx-auto px-6 flex">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-[#0038a8] border-r border-white/5 transition-none ${link.name === 'Announcements' ? 'bg-[#ce1126]' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            <main className="bg-slate-50 min-h-[60vh]">
                {/* PAGE TITLE SECTION */}
                <div className="bg-white border-b border-slate-200 py-12">
                    <div className="container mx-auto px-6">
                        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                            Bulletin Board
                        </h1>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                            Stay updated with the latest news, events, and advisories.
                        </p>
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-200">
                    <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-none border-2 ${
                                        selectedCategory === cat 
                                        ? 'bg-[#0038a8] text-white border-[#0038a8]' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#0038a8]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="SEARCH NEWS..." 
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-[#0038a8]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* ANNOUNCEMENTS GRID (SAME AS WELCOME UI) */}
                <section className="py-16">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredAnnouncements.length > 0 ? (
                                filteredAnnouncements.map((post) => (
                                    <article key={post.id} className="bg-white border border-slate-200 flex flex-col group hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden">
                                        <div className="aspect-video w-full overflow-hidden bg-slate-200 relative">
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="bg-white/90 backdrop-blur-sm text-[#0038a8] text-[10px] font-bold px-3 py-1 uppercase tracking-wider shadow-sm">
                                                    {post.category}
                                                </span>
                                            </div>
                                            <img 
                                                src={post.image || '/placeholder-image.jpg'} 
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-8 flex flex-col flex-grow">
                                            <div className="flex items-center gap-4 mb-4 text-slate-500 text-xs font-medium">
                                               <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-slate-700 font-bold uppercase">{post.event_date}</span>
                                                </span>
                                                {post.location && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="line-clamp-1 uppercase font-bold">{post.location}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0038a8] transition-colors leading-tight uppercase tracking-tight">
                                                {post.title}
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="mt-auto pt-6 border-t border-slate-100">
                                                <Link
                                                    href={`/announcements/${post.id}`} 
                                                    className="text-sm font-bold text-[#0038a8] flex items-center gap-2 group/link uppercase"
                                                >
                                                    View Detailed Report
                                                    <span className="group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-300 rounded-lg">
                                    <p className="text-slate-500 font-black uppercase tracking-widest">No matching announcements found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* SAME OFFICIAL FOOTER */}
            <footer className="bg-slate-900 text-white pt-20 pb-10 border-t-8 border-yellow-500">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-yellow-500 underline underline-offset-8 decoration-2">Information System</h4>
                        <p className="text-slate-400 font-bold leading-relaxed uppercase text-[11px] italic">
                            Official management platform for Barangay 183 Villamor. Ensuring data privacy and accountability in family protection services.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-yellow-500 underline underline-offset-8 decoration-2">Hotlines</h4>
                        <div className="space-y-4 text-xs font-bold uppercase tracking-wider text-slate-300">
                            <p className="flex items-center gap-3"><Phone size={14}/> Brgy Hall: (02) 8XXX-XXXX</p>
                            <p className="flex items-center gap-3"><AlertCircle size={14}/> VAWC Desk: (02) 8XXX-XXXX</p>
                            <p className="flex items-center gap-3"><Info size={14}/> GAD Focal: gad.brgy183@pasay.gov.ph</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest mb-6 text-yellow-500 underline underline-offset-8 decoration-2">Transparency</h4>
                        <ul className="text-xs font-bold uppercase tracking-wider text-slate-300 space-y-3">
                            <li className="hover:text-yellow-500 transition-none"><Link href="/privacy">Data Privacy Compliance</Link></li>
                            <li className="hover:text-yellow-500 transition-none"><Link href="/audit">System Audit Logs</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 border-t border-white/10 pt-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        © 2026 Barangay 183 Villamor, Pasay City | Women & Family Support System
                    </p>
                </div>
            </footer>
        </div>
    );
}