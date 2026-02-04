import { Head, Link } from '@inertiajs/react';
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import PublicLayout from '@/layouts/PublicLayout'; // Adjust path if needed
import { Marquee } from "@/components/ui/marquee";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ExternalLink, Phone, AlertCircle, Shield, Users, Calendar, MapPin, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

const brgyNum = import.meta.env.VITE_HOTLINE_BRGY;
const vawcNum = import.meta.env.VITE_HOTLINE_VAWC;

export default function Welcome({ announcements, organizations = [] }: any) {

    // DEBUG: Add this line to see exactly what is arriving in the browser console
    console.log("Announcements Prop:", announcements);
    console.log("Organizations Prop:", organizations);
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    const slides = [
        {
            title: "Violence Against Women and Children.",
            desc: "Laban para sa mga taong nag aabusado sa babae at bata.",
            path: "/vawc",
            image: "/images/vawc_image.jpg"
        },
        {
            title: "Gender and Development.",
            desc: "Makisali po ngayun",
            path: "/gad",
            image: "/images/bcpc_image.jpg"
        },
        {
            title: "Barangay Council for the Protection of Children.",
            desc: "Protektado, sa mga abusado na tao.",
            path: "/bcpc",
            image: "/images/wfps_image.jpg"
        },
        // ... rest of your slides
    ];

    return (
        <PublicLayout>

            <Head title="Home - Brgy 183 Villamor" />

            <section className="bg-slate-900 border-b-8 border-yellow-500 overflow-hidden">
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    opts={{ loop: true }}
                >
                    <CarouselContent>
                        {slides.map((slide, index) => (
                            <CarouselItem key={index}>
                                <div className="relative h-[200px] md:h-[700px] w-full flex items-center overflow-hidden">
                                    {/* The Image */}
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                                        onError={(e) => {
                                            // Fallback if the Facebook link expires
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591115765373-520b7a217294?q=80&w=2070';
                                        }}
                                    />

                                    {/* Dark Overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent"></div>

                                    {/* Text Content */}
                                    <div className="container mx-auto px-10 relative z-10">
                                        <div className="max-w-3xl border-l-[10px] border-yellow-500 pl-8">
                                            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-none mb-4 tracking-tighter">
                                                {slide.title}
                                            </h2>
                                            <p className="text-lg md:text-xl text-slate-200 font-bold uppercase tracking-wide mb-8">
                                                {slide.desc}
                                            </p>
                                            <Link
                                                href={slide.path}
                                                className="inline-flex items-center gap-3 bg-[#ce1126] text-white px-6 py-4 font-black uppercase text-sm hover:bg-red-700 transition-colors"
                                            >
                                                Learn More <ExternalLink size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </section>


            {/* 2. HOTLINE MARQUEE */}
            <section className="bg-[#ce1126] border-y border-red-900 shadow-lg">
                <Marquee pauseOnHover className="py-2">
                    <div className="flex items-center gap-12 text-white font-black uppercase text-sm">
                        <span className="flex items-center gap-2"><Phone className="w-5 h-5" /> Emergency: {brgyNum} </span>
                        <span className="flex items-center gap-2"><AlertCircle className="w-5 h-5" /> VAWC Hotline: {vawcNum} </span>
                    </div>
                </Marquee>
            </section>


            {/* 3. LATEST ANNOUNCEMENTS */}
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
                            announcements.data.map((post: any) => (
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
                                                href={`/announcements/${post.slug}`}
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





            {/* 4. ACCREDITED ORGANIZATIONS (NEW SECTION) */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="text-emerald-600 w-5 h-5" />
                                <h2 className="text-emerald-600 font-bold tracking-widest text-xs">Verified Groups</h2>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Accredited Organizations</h1>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Join our verified community groups and associations.</p>
                        </div>
                        <Link href="/organizations" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#0038a8] transition-all">
                            Directory <Building2 size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {organizations.data.length > 0 ? (
                            organizations.data.map((org: any) => (
                                <div key={org.id} className="bg-slate-50 border border-slate-200 p-7 rounded-sm hover:border-[#0038a8] hover:bg-white transition-all group shadow-sm">
                                    <div className={`w-12 h-12 rounded-lg ${org.color_theme || 'bg-blue-600'} flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/10`}>
                                        <Users size={24} />
                                    </div>
                                    <h3 className="font-black text-slate-900 text-[19px] mb-2 tracking-tight line-clamp-1">{org.name}</h3>
                                    <p className="text-[16px] text-slate-400 font-black uppercase tracking-tighter mb-4">
                                        Pres: {org.president_name || 'TBA'}
                                    </p>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-[15px] font-black text-emerald-600">Accredited</span>
                                        <Link href={`/organizations/${org.slug}`} className="text-[#0038a8] group-hover:translate-x-1 transition-transform">
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-black uppercase text-[10px]">No registered organizations found</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>








        </PublicLayout>
    );
}