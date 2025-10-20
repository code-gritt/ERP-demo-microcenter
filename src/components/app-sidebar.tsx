'use client';

import * as React from 'react';
import { useAuthStore } from '@/lib/store';
import {
    LayoutPanelLeft,
    Mail,
    CheckSquare,
    MessageCircle,
    Settings,
    HelpCircle,
    CreditCard,
    Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/logo';

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

const navGroups = [
    {
        items: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutPanelLeft,
            },
        ],
    },
    {
        label: 'Apps',
        items: [
            {
                title: 'Orders',
                url: '/orders',
                icon: Mail,
            },
            {
                title: 'Products',
                url: '/products',
                icon: CheckSquare,
            },
            {
                title: 'Customers',
                url: '/customers',
                icon: Users,
            },
            {
                title: 'Salesmen',
                url: '/salesmen',
                icon: MessageCircle,
            },
        ],
    },
    {
        label: 'Pages',
        items: [
            {
                title: 'Settings',
                url: '#',
                icon: Settings,
                items: [
                    {
                        title: 'User Settings',
                        url: '/settings/user',
                    },
                    {
                        title: 'Account Settings',
                        url: '/settings/account',
                    },
                    {
                        title: 'Plans & Billing',
                        url: '/settings/billing',
                    },
                    {
                        title: 'Appearance',
                        url: '/settings/appearance',
                    },
                    {
                        title: 'Notifications',
                        url: '/settings/notifications',
                    },
                    {
                        title: 'Connections',
                        url: '/settings/connections',
                    },
                ],
            },
            {
                title: 'FAQs',
                url: '/faqs',
                icon: HelpCircle,
            },
            {
                title: 'Pricing',
                url: '/pricing',
                icon: CreditCard,
            },
        ],
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuthStore();

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    {' '}
                    {/* ✅ OPEN */}
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/dashboard">
                                <div className="flex items-center space-x-2">
                                    <Logo size={32} />
                                    <span className="font-bold">ERP Demo</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>{' '}
                {/* ✅ CLOSED */}
            </SidebarHeader>
            <SidebarContent>
                {navGroups.map((group) => (
                    <NavMain key={group.label} items={group.items} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={
                        user
                            ? {
                                  name: user.user_name,
                                  email: user.email_id,
                                  avatar: '',
                              }
                            : undefined
                    }
                />{' '}
                {/* ✅ TYPE FIXED */}
            </SidebarFooter>
        </Sidebar>
    );
}
