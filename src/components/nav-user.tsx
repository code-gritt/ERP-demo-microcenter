'use client';

import { CreditCard, EllipsisVertical, LogOut, BellDot, CircleUser } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { Link, useNavigate } from 'react-router-dom';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

export function NavUser({
    user,
}: {
    user?: {
        // ✅ OPTIONAL
        name: string;
        email: string;
        avatar: string;
    };
}) {
    const { logout } = useAuthStore(); // ✅ REAL LOGOUT
    const navigate = useNavigate(); // ✅ NAVIGATION
    const { isMobile } = useSidebar();

    const handleLogout = () => {
        logout();
        navigate('/auth/sign-in-2'); // ✅ REAL REDIRECT
    };

    if (!user) return null; // ✅ HIDE IF NO USER

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <span className="text-xs font-bold">
                                    {user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                </span>{' '}
                                {/* ✅ S.U. INITIALS */}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <EllipsisVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <span className="text-xs font-bold">
                                        {user.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .slice(0, 2)}
                                    </span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="/settings/account">
                                    <CircleUser className="mr-2 h-4 w-4" />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="/settings/billing">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Billing
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="/settings/notifications">
                                    <BellDot className="mr-2 h-4 w-4" />
                                    Notifications
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
