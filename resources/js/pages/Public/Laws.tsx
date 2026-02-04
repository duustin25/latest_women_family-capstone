import PublicLayout from '@/layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Scale, BookOpen, AlertCircle, HeartHandshake, Users } from 'lucide-react';

export default function Laws() {
    const laws = [
        {
            code: "RA 9262",
            title: "Anti-Violence Against Women and Their Children Act of 2004",
            description: "A comprehensive law that defines violence against women and their children, penalizes such acts, and provides protective measures for victims. It covers physical, sexual, psychological, and economic abuse.",
            icon: Shield,
            link: "https://pcw.gov.ph/republic-act-9262-anti-violence-against-women-and-their-children-act-of-2004/"
        },
        {
            code: "RA 9710",
            title: "The Magna Carta of Women",
            description: "A comprehensive women's human rights law that seeks to eliminate discrimination against women by recognizing, protecting, fulfilling, and promoting the rights of Filipino women, especially those in marginalized sectors.",
            icon: Scale,
            link: "https://pcw.gov.ph/republic-act-9710-magna-carta-of-women/"
        },
        {
            code: "RA 7610",
            title: "Special Protection of Children Against Abuse, Exploitation and Discrimination Act",
            description: "Provides distinct and special protection for children against all forms of abuse, neglect, cruelty, exploitation, and discrimination, and other conditions prejudicial to their development.",
            icon: HeartHandshake,
            link: "https://pcw.gov.ph/laws-on-women-and-children/"
        },
        {
            code: "RA 11313",
            title: "Safe Spaces Act (Bawal Bastos Law)",
            description: "Defines gender-based sexual harassment in streets, public spaces, online, workplaces, and educational or training institutions, and prescribes penalties therefor.",
            icon: AlertCircle,
            link: "https://pcw.gov.ph/republic-act-11313-safe-spaces-act-bawal-bastos-law/"
        },
        {
            code: "RA 8353",
            title: "The Anti-Rape Law of 1997",
            description: "Reclassified rape as a crime against persons (from a crime against chastity). It recognizes that rape can be committed by any person, including a spouse.",
            icon: Users,
            link: "https://pcw.gov.ph/laws-on-women-and-children/"
        },
        {
            code: "RA 7877",
            title: "Anti-Sexual Harassment Act of 1995",
            description: "Declares sexual harassment unlawful in the employment, education, or training environment, and for other purposes.",
            icon: BookOpen,
            link: "https://pcw.gov.ph/laws-on-women-and-children/"
        },
        {
            code: "Family Code",
            title: "The Family Code of the Philippines",
            description: "The primary law governing family relations in the Philippines, covering marriage, legal separation, property relations between spouses, and parental authority.",
            icon: Users,
            link: "https://pcw.gov.ph/"
        }
    ];

    return (
        <PublicLayout>
            <Head title="Laws & Rights" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Laws Protecting Women and Children
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-muted-foreground">
                            Understanding your rights is the first step to empowerment. Here are the key Philippine laws that protect women, children, and families.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
                        {laws.map((law) => (
                            <Card key={law.code} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
                                <CardHeader>
                                    <div className="flex items-center gap-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <law.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold leading-7">
                                            {law.code}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="mt-2 text-base font-medium text-foreground">
                                        {law.title}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col justify-between">
                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {law.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
