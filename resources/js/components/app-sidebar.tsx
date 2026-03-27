import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { Activity, Airplay, BookOpen, BookUser, ChartLine, CircleUser, FileSearch, Folder, LayoutGrid, Logs, Settings, User2, Users, Wallpaper } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Announcements',
        href: '/admin/announcements',
        icon: Wallpaper,
    },
    {
        title: 'Organizations',
        href: '/admin/organizations',
        icon: Airplay,
    },
    {
        title: 'Applications',
        href: '/admin/applications',
        icon: FileSearch,
    },
    {
        title: 'Members',
        href: '/admin/members',
        icon: Users,
    },
    {
        title: 'Cases',
        href: '/admin/cases',
        icon: BookUser,
    },
    {
        title: 'Users',
        href: '/admin/system-users',
        icon: CircleUser,
    },
    {
        title: 'Officials',
        href: '/admin/officials',
        icon: User2,
    },
    {
        title: 'GAD',
        href: '/admin/gad/events',
        icon: Activity,
    },
    {
        title: 'Event Proposals',
        href: '/admin/organization/events',
        icon: Activity,
    },
    {
        title: 'Data Analytics',
        href: '/admin/analytics',
        icon: ChartLine,
    },
    {
        title: 'Audit Logs',
        href: '/admin/audit-logs',
        icon: Logs,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },

];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<any>().props;

    // Filter Navigation based on Roles
    const filteredNavItems = mainNavItems.filter(item => {
        const role = auth.user.role;

        // Settings and Audit Logs are strictly Admin ONLY
        if ((item.title === 'Settings' || item.title === 'Audit Logs') && role !== 'admin') {
            return false;
        }

        // Presidents see Event Proposals, not the admin GAD menu
        if (item.title === 'Event Proposals' && role !== 'president') return false;

        if (role === 'president') {
            const hiddenFromPresident = ['Cases', 'Users', 'Officials', 'Data Analytics', 'Audit Logs', 'Settings', 'GAD'];
            if (hiddenFromPresident.includes(item.title)) return false;
        }

        // Head Committee visibility
        if (role === 'head') {
            const hiddenFromHead = ['Users', 'Settings', 'Audit Logs'];
            if (hiddenFromHead.includes(item.title)) {
                return false;
            }
        }

        return true;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
