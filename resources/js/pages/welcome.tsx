import { Head, Link, usePage } from '@inertiajs/react';
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { dashboard, login,  } from '@/routes';
import { Marquee } from "@/components/ui/marquee";

// Shadcn Carousel Components - Using relative path to be safe
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import {
    AlertCircle,
    Phone,
    Shield,
    Users,
    ArrowRight,
    Info,
    ExternalLink, 
    Clock, 
    MapPin,
    Badge,
    Calendar
} from "lucide-react";
import AnnouncementController from '@/actions/App/Http/Controllers/Admin/AnnouncementController';
import announcements from '@/routes/announcements';

//=====================================================
// Define the interface for the data coming from Laravel
interface Announcement {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    event_date: string;     // Formatted in Controller (M d, Y)
    location?: string;
    image?: string;    // Full URL from asset()
}

interface AnnouncementCollection {
  data: Announcement[];
}
// ============================================

interface OrganizationData {
    title: string;
    desc: string;
    color: string;
    image: string;
    href: string;
}

// Props interface
interface WelcomeProps {
    announcements: AnnouncementCollection;
    organizations: OrganizationData[];
}


export default function Welcome({ announcements, organizations = [], }: WelcomeProps) {
    // State to track which announcement is being viewed in the Pop-up
    const { auth } = usePage<any>().props;
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    const navLinks = [
        { name: 'Announcements', href: '/announcements' },
        { name: 'VAWC Violence Against Women and Children', href: '/vawc' },
        { name: 'Child Protection Policy', href: '/cpp' },
        { name: 'Gender And Development', href: '/gad' },
        { name: 'Organizations', href: '/organizations' },
        { name: 'ABOUT US', href: '/about' },
        { name: 'CONTACT', href: '/contact' },
    ];

    const slides = [
        {
            title: "Supporting Families, Protecting Rights.",
            desc: "A secure management system for the residents of Villamor.",
            path: "/cpp",
            image: "https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/474928760_939945574901117_7568611664958393744_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=sOqMsKQEwuMQ7kNvwHhiQ2o&_nc_oc=AdkS7SZ_dYfM-OAWWAHJowL24zrNfv8rmJHlAsXbe4RWvKHcyA6AL7uLwkB7THhLEfND1Ap5k8NSr4povZ_ui2CP&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=OB0wcnSZUrRKyG1wQ05mBQ&oh=00_AfrDP6TfuoEuxygsnFZf6urxGKysEVPuinuAkxuAEv2-dw&oe=697A80FA"
        },
        {
            title: "Violence Against Women and Children.",
            desc: "Resources and community support for a safer future.",
            path: "/vawc",
            image: "https://scontent.fmnl4-1.fna.fbcdn.net/v/t39.30808-6/597572755_828583719980422_4577344455332147241_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=NxM7kJTDPUYQ7kNvwHRk4dy&_nc_oc=AdnnW2-QK7E-hKsLJAiEaJqvnHeL89A2UYdwatiQW5vL8OodeGMduPpFIRhiII4khGo-lPqDfJd8kakfwspvNxSN&_nc_zt=23&_nc_ht=scontent.fmnl4-1.fna&_nc_gid=lsKNzGCDdCwD4KhcHCloow&oh=00_AfoIFc7K7WvZ4A3u4Xac7H0EPkyfjBBZALieJteebED-6w&oe=697AA4BF"
        },
        {
            title: "Child Protection Policy.",
            desc: "Secure and manage child welfare data with confidence.",
            path: "/organizations",
            image: "https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/600423216_835754545930006_4497443612258381358_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=MFlONtWeiA0Q7kNvwELMStH&_nc_oc=AdnhpX93DVc5AZETo8OGwfyYuNHX9viFjzyge7j_1ZMlzXQyivUIqR_CBK-vOFPbLlkodeKokqk8P028riUCuTeI&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=LEwmnO5Kim_wuV9i3tEvDQ&oh=00_AfofetA6evrAMEDYBN2yV1SpuY5g28ijoot8q8cAdj8sKw&oe=697A7FFF"
        }
    ];

    console.log('announcements:', announcements);
    
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-violet-200">
            <Head title="Women & Family Support - Brgy 183 Villamor" />
            
            {/* 1. TOP IDENTITY BAR (Republic of the Philippines) */}
            {/* <div className="bg-slate-100 border-b border-slate-200 py-0 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                Republic of the Philippines • Pasay City • Barangay 183 Villamor
            </div> */}

            {/* 2. OFFICIAL HEADER */}
            <header className="bg-[#0038a8] text-white">
                <div className="container mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 rounded-md">
                                <img
                                    src="/Logo/Woman-FamilyLOGO.png"
                                    alt="Women and Family Protection Logo"
                                    className="w-20 h-20 object-contain"
                                />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black leading-none tracking-tight uppercase">
                                Women and Family Protection & Support System
                            </h1>
                            <p className="text-[11px] font-bold opacity-90 uppercase tracking-widest mt-1">
                                Barangay 183 Villamor, Pasay City
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link href={dashboard()} className="bg-[#ce1126] hover:bg-red-700 px-8 py-3 font-black uppercase text-xs tracking-widest transition-none">
                                Access Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="px-5 py-3 font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-none"></Link>
                                {/* REGISTER BUTTON YOU MUST NOT ACTIVE THIS */}
                                {/* {canRegister && (
                                    <Link href={register()} className="bg-yellow-500 text-blue-900 px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-none">
                                        Register
                                    </Link>
                                )} */}
                            </>
                        )}
                    </div>
                </div>

                {/* 3. FLAT NAVIGATION */}
                <nav className="bg-[#002a7a] border-t border-white/10 hidden md:block">
                    <div className="container mx-auto px-6 flex">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="px-6 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-[#0038a8] border-r border-white/5 transition-none"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            <main>


                {/* 4. SHADCN HERO CAROUSEL */}
                <section className="bg-slate-900 border-b-8 border-yellow-500 overflow-hidden">
                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full"
                        opts={{ align: "start", loop: true }}
                    >
                        <CarouselContent className="-ml-0">
                        {slides.map((slide, index) => (
                            <CarouselItem key={index} className="pl-0">
                            {/* Clickable Image Slide */}
                            <Link href={slide.path} className="relative block w-full group cursor-pointer">
                                <div className="h-[690px] relative flex items-center overflow-hidden">
                                <img 
                                    src={slide.image} 
                                    alt={slide.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0038a8]/30 via-[#0038a8]/10 to-transparent"></div>

                                <div className="container mx-auto px-10 relative z-10">
                                    <div className="max-w-3xl border-l-[10px] border-yellow-500 pl-8">
                                    <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] mb-4 tracking-tighter">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-slate-200 font-bold uppercase tracking-wide mb-8">
                                        {slide.desc}
                                    </p>
                                    <div className="inline-flex items-center gap-3 bg-[#ce1126] text-white px-4 py-4 font-black uppercase text-sm group-hover:bg-red-700 transition-none">
                                        Read More <ExternalLink size={15}/>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </Link>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                    </Carousel>
                </section>

               {/* 5. OFFICIAL MARQUEE HOTLINE BAR */}
                <section className="bg-[#ce1126] border-y border-red-900 shadow-lg">
                    <Marquee pauseOnHover className="py-4 [--duration:30s]">
                        <div className="flex items-center gap-12 pr-12">
                            <span className="flex items-center gap-3 text-white font-black uppercase text-sm tracking-tight">
                                <Phone className="w-5 h-5 text-yellow-400" /> 
                                Emergency: (02) 8XXX-XXXX
                            </span>
                            <span className="flex items-center gap-3 text-white font-black uppercase text-sm tracking-tight">
                                <AlertCircle className="w-5 h-5 text-yellow-400" /> 
                                VAWC Hotline: 1-800-VAWC
                            </span>
                            <span className="flex items-center gap-3 text-white font-black uppercase text-sm tracking-tight">
                                <Shield className="w-5 h-5 text-yellow-400" /> 
                                PNP Women's Desk: 117
                            </span>
                            <span className="flex items-center gap-3 text-white font-black uppercase text-sm tracking-tight">
                                <Users className="w-5 h-5 text-yellow-400" /> 
                                GAD Office: (02) 8XXX-XXXX
                            </span>
                            {/* Divider for visual polish */}
                            <div className="h-4 w-[2px] bg-red-400/50" />
                        </div>
                    </Marquee>
                </section>


                {/* 6. DYNAMIC ANNOUNCEMENTS SECTION */}
                <section className="bg-slate-50 py-24 border-y border-slate-200">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-[#0038a8] font-bold tracking-widest uppercase text-sm mb-3">Community Updates</h2>
                                <h1 className="text-4xl font-black text-slate-900">Latest Announcements</h1>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {announcements.data.length > 0 ? (
                            announcements.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white border border-slate-200 flex flex-col group hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden"
                                >
                                    {/* Image Wrapper */}
                                    <div className="aspect-video w-full overflow-hidden bg-slate-200 relative">
                                        {/* Floating Category Badge */}
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

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 mb-4 text-slate-500 text-xs font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-slate-700">
                                                    {post.event_date}
                                                </span>
                                            </span>

                                            {post.location && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="line-clamp-1">{post.location}</span>
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0038a8] transition-colors leading-tight">
                                            {post.title}
                                        </h3>

                                        <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-slate-100">
                                            <Link
                                                href={`/announcements/${post.id}`}
                                                className="text-sm font-bold text-[#0038a8] flex items-center gap-2 group/link"
                                            >
                                                Read Full Details
                                                <span className="group-hover/link:translate-x-2 transition-transform duration-300">
                                                    →
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-300 rounded-lg">
                                <p className="text-slate-500 font-medium">
                                    No announcements available at the moment.
                                </p>
                            </div>
                        )}
                        </div>
                    </div>
                </section>
    

           {/* DYNAMIC ORGANIZATIONS SECTION */}
           <section className="container mx-auto px-6 py-24">
                {/* ... Header ... */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Map through REAL data */}
                    <h1 className="text-3xl font-black text-left mb-12">Organizations</h1>
                    {organizations.map((org, idx) => (
                        <Link key={idx} href={org.href} className="...">
                             {/* ... Your Org Card Code, using org.color, org.image etc ... */}
                        </Link>
                    ))}
                </div>
           </section>



            
            </main>

            {/* 8. OFFICIAL FOOTER */}
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
                            <li className="hover:text-yellow-500 cursor-pointer transition-none"><Link href="/privacy">Data Privacy Compliance</Link></li>
                            <li className="hover:text-yellow-500 cursor-pointer transition-none"><Link href="/audit">System Audit Logs</Link></li>
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