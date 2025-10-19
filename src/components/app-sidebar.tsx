'use client';

import * as React from 'react';
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

const data = {
    user: {
        name: 'ShadcnStore',
        email: 'store@example.com',
        avatar: '',
    },
    navGroups: [
        {
            items: [
                {
                    title: 'Dashboard',
                    url: '/dashboard-2',
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

                // {
                //     title: 'Mail',
                //     url: '/mail',
                //     icon: Mail,
                // },
                {
                    title: 'Tasks',
                    url: '/tasks',
                    icon: CheckSquare,
                },
                // {
                //     title: 'Chat',
                //     url: '/chat',
                //     icon: MessageCircle,
                // },
                // {
                //     title: 'Calendar',
                //     url: '/calendar',
                //     icon: Calendar,
                // },
                {
                    title: 'Users',
                    url: '/users',
                    icon: Users,
                },
            ],
        },
        {
            label: 'Pages',
            items: [
                // {
                //     title: 'Landing',
                //     url: '/landing',
                //     target: '_blank',
                //     icon: LayoutTemplate,
                // },
                // {
                //     title: 'Auth Pages',
                //     url: '#',
                //     icon: Shield,
                //     items: [
                //         {
                //             title: 'Sign In 1',
                //             url: '/auth/sign-in',
                //         },
                //         {
                //             title: 'Sign In 2',
                //             url: '/auth/sign-in-2',
                //         },
                //         {
                //             title: 'Sign In 3',
                //             url: '/auth/sign-in-3',
                //         },
                //         {
                //             title: 'Sign Up 1',
                //             url: '/auth/sign-up',
                //         },
                //         {
                //             title: 'Sign Up 2',
                //             url: '/auth/sign-up-2',
                //         },
                //         {
                //             title: 'Sign Up 3',
                //             url: '/auth/sign-up-3',
                //         },
                //         {
                //             title: 'Forgot Password 1',
                //             url: '/auth/forgot-password',
                //         },
                //         {
                //             title: 'Forgot Password 2',
                //             url: '/auth/forgot-password-2',
                //         },
                //         {
                //             title: 'Forgot Password 3',
                //             url: '/auth/forgot-password-3',
                //         },
                //     ],
                // },
                // {
                //     title: 'Errors',
                //     url: '#',
                //     icon: AlertTriangle,
                //     items: [
                //         {
                //             title: 'Unauthorized',
                //             url: '/errors/unauthorized',
                //         },
                //         {
                //             title: 'Forbidden',
                //             url: '/errors/forbidden',
                //         },
                //         {
                //             title: 'Not Found',
                //             url: '/errors/not-found',
                //         },
                //         {
                //             title: 'Internal Server Error',
                //             url: '/errors/internal-server-error',
                //         },
                //         {
                //             title: 'Under Maintenance',
                //             url: '/errors/under-maintenance',
                //         },
                //     ],
                // },
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
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/landing">
                                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Logo size={24} className="text-current" />
                                </div> */}
                                <div className="flex items-center space-x-2">
                                    <a
                                        href="/landing"
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <Logo size={32} />
                                        <span className="font-bold">ERP Demo</span>
                                    </a>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {data.navGroups.map((group) => (
                    <NavMain key={group.label} items={group.items} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
