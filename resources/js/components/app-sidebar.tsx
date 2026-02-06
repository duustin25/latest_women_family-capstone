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
import { Link } from '@inertiajs/react';
import { Airplay, BookOpen, BookUser, ChartLine, CircleUser, FileSearch, Folder, LayoutGrid, Logs, Settings, User2, Wallpaper } from 'lucide-react';
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
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
