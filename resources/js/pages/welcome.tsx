import { Head, Link } from '@inertiajs/react';
import * as React from "react";
import PublicLayout from '@/layouts/PublicLayout';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import {
    ShieldAlert, Users, Baby, ArrowRight,
    MapPin, Calendar, ExternalLink, ChevronRight
} from "lucide-react";

interface WelcomeProps {
    announcements: { data: any[] };
    organizations: { data: any[] };
}

export default function Welcome({ announcements, organizations }: WelcomeProps) {
    const [api, setApi] = React.useState<CarouselApi>()

    React.useEffect(() => {
        if (!api) {
            return
        }

        const interval = setInterval(() => {
            api.scrollNext()
        }, 4000)

        return () => clearInterval(interval)
    }, [api])

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop",
            title: "Safe Community",
        },
        {
            id: 2,
            image: "https://scontent.fmnl8-1.fna.fbcdn.net/v/t39.30808-6/607709506_842926775212783_3490112507659096929_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2f6YsnRNMegQ7kNvwGJuYP_&_nc_oc=Adkb6kksE5O-84p4o59n-n6HJAjYgAXs9pygkDCP9OHxTBtf1Cu7BtG1HHdVDI-azyM&_nc_zt=23&_nc_ht=scontent.fmnl8-1.fna&_nc_gid=37Hg15GOCkp8YTIMqOh52Q&oh=00_AfshglJlbBq-54u8XyxhOq7ZrZr_ZPrgiUJM5P-g9HrFzg&oe=698F1055",
            title: "Gender Equality",
        },
        {
            id: 3,
            image: "https://scontent.fmnl8-2.fna.fbcdn.net/v/t39.30808-6/600303084_835754615929999_8846337304878480439_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=6uaoq3btMx0Q7kNvwFmKA-2&_nc_oc=Adn7BPd7YywTZyBNU-t_V1jnEdik_ksmrk-tYv0hhA1ae5IRduMDuwgS3EkpS9FcRWg&_nc_zt=23&_nc_ht=scontent.fmnl8-2.fna&_nc_gid=D-eyO8D7RHD_UzGfxcbT2Q&oh=00_Afv0SQFmiOO_od66RxW3RbioT0VG9B1gIYKvCPl7J8TBzg&oe=698F2EFA",
            title: "Child Protection",
        },
    ];

    return (
        <PublicLayout>
            <Head title="Welcome - Brgy 183 Villamor" />

            {/* 1. HERO SECTION - With Carousel Background */}
            <section className="relative bg-neutral-900 text-white overflow-hidden h-[600px] lg:h-[700px] flex items-center">

                {/* CAROUSEL BACKGROUND */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <Carousel
                        setApi={setApi}
                        className="w-full h-full [&>div]:h-full"
                        opts={{ loop: true, align: "start" }}
                    >
                        <CarouselContent className="h-full ml-0">
                            {slides.map((slide) => (
                                <CarouselItem key={slide.id} className="pl-0 h-full w-full relative">
                                    <div className="absolute inset-0 bg-neutral-900">
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            onError={(e) => {
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop";
                                            }}
                                            className="w-full h-full object-cover opacity-60 animate-in fade-in duration-1000"
                                        />
                                        {/* Gradient Overlay for Text Readability */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-transparent"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/20"></div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                <div className="container mx-auto px-6 relative z-10 w-full">
                    <div className="max-w-3xl animate-in slide-in-from-left-10 fade-in duration-1000">
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-yellow-500/20">
                            Create a Safe Community
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6 uppercase">
                            Women & Family <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                                Protection Center
                            </span>
                        </h1>
                        <p className="text-lg text-neutral-400 font-medium max-w-xl mb-10 leading-relaxed">
                            Providing accessible services, protection, and empowerment for every family in Barangay 183 Villamor.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/vawc/report" className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-wider text-xs rounded-lg transition-all shadow-lg shadow-rose-900/20 flex items-center gap-2 group">
                                <ShieldAlert size={18} /> Report Abuse
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/gad" className="px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-black uppercase tracking-wider text-xs rounded-lg transition-all border border-neutral-700 flex items-center gap-2">
                                GAD Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CORE SERVICES GRID */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">

                        {/* VAWC */}
                        <Link href="/vawc" className="group bg-rose-50 hover:bg-rose-600 transition-all duration-300 p-8 rounded-2xl border border-rose-100 hover:border-rose-600 shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <div className="w-14 h-14 bg-rose-100 text-rose-600 group-hover:bg-white group-hover:text-rose-600 rounded-xl flex items-center justify-center mb-6 transition-colors">
                                <ShieldAlert size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-black text-rose-900 group-hover:text-white uppercase tracking-tight mb-2">VAWC Desk</h3>
                            <p className="text-sm text-rose-700 group-hover:text-rose-100 font-medium leading-relaxed">
                                Republic Act 9262. Protection against violence for women and their children.
                            </p>
                        </Link>

                        {/* GAD */}
                        <Link href="/gad" className="group bg-purple-50 hover:bg-purple-600 transition-all duration-300 p-8 rounded-2xl border border-purple-100 hover:border-purple-600 shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 group-hover:bg-white group-hover:text-purple-600 rounded-xl flex items-center justify-center mb-6 transition-colors">
                                <Users size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-black text-purple-900 group-hover:text-white uppercase tracking-tight mb-2">GAD Focus</h3>
                            <p className="text-sm text-purple-700 group-hover:text-purple-100 font-medium leading-relaxed">
                                Gender and Development. Promoting equality and empowering all genders.
                            </p>
                        </Link>

                        {/* BCPC */}
                        <Link href="/bcpc" className="group bg-sky-50 hover:bg-sky-600 transition-all duration-300 p-8 rounded-2xl border border-sky-100 hover:border-sky-600 shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <div className="w-14 h-14 bg-sky-100 text-sky-600 group-hover:bg-white group-hover:text-sky-600 rounded-xl flex items-center justify-center mb-6 transition-colors">
                                <Baby size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-black text-sky-900 group-hover:text-white uppercase tracking-tight mb-2">BCPC Council</h3>
                            <p className="text-sm text-sky-700 group-hover:text-sky-100 font-medium leading-relaxed">
                                Child Protection. Safeguarding the rights and welfare of children.
                            </p>
                        </Link>

                    </div>
                </div>
            </section>

            {/* 3. COMMUNITY UPDATES */}
            <section className="py-20 bg-neutral-50 border-t border-neutral-200">
                <div className="container mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-2">Barangay Updates</h2>
                            <h3 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">Latest Announcements</h3>
                        </div>
                        <Link href="/announcements" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-900 hover:text-blue-600 transition-colors">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {announcements.data.length > 0 ? (
                            announcements.data.map((post: any) => (
                                <Link key={post.id} href={`/announcements/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden">

                                        {/* GAD Badge if applicable */}
                                        {post.category === 'GAD' && (
                                            <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                GAD Featured
                                            </div>
                                        )}

                                        <img
                                            src={post.image || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2000'}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} /> {post.date}
                                            </span>
                                            {post.location && (
                                                <span className="flex items-center gap-1 line-clamp-1">
                                                    <MapPin size={12} /> {post.location}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-lg font-black text-neutral-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h4>
                                        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
                                <p className="text-neutral-400 font-bold uppercase text-xs tracking-wider">No announcements posted yet</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/announcements" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-900">
                            View All Updates <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. ACCREDITED ORGANIZATIONS */}
            <section className="py-20 bg-white border-t border-neutral-100">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-purple-600 font-bold uppercase tracking-widest text-xs mb-3">Community Partners</h2>
                        <h3 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter mb-4">Accredited Organizations</h3>
                        <p className="text-neutral-500 font-medium">Verified local groups working together for community development.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {organizations.data.length > 0 ? (
                            organizations.data.map((org: any) => (
                                <Link key={org.id} href={`/organizations/${org.slug}`} className="flex items-center gap-4 p-5 bg-neutral-50 hover:bg-white border border-neutral-100 hover:border-purple-200 rounded-xl transition-all group">
                                    <div className={`w-3 h-3 rounded-full shrink-0 ${org.color_theme || 'bg-neutral-300'}`}></div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-tight truncate group-hover:text-purple-700 transition-colors">
                                            {org.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">
                                            View Profile <ChevronRight size={10} />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-neutral-400 text-xs font-bold uppercase">No organizations found</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/organizations" className="inline-flex items-center justify-center px-8 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-black uppercase text-[10px] tracking-[0.2em] rounded-full transition-colors">
                            View Full Directory
                        </Link>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}