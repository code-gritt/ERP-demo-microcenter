'use client';

import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { CommandSearch, SearchTrigger } from '@/components/command-search';
import { ModeToggle } from '@/components/mode-toggle';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { HelpCircle, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export function SiteHeader() {
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [newBranch, setNewBranch] = React.useState('');
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [branches, setBranches] = useState(() => {
        const savedBranches = localStorage.getItem('branches');
        return savedBranches
            ? JSON.parse(savedBranches)
            : ['Head Office', 'Retail Divisions', 'qwe Branch'];
    });

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setSearchOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        localStorage.setItem('branches', JSON.stringify(branches));
    }, [branches]);

    const handleAddBranch = () => {
        if (newBranch.trim()) {
            setBranches([...branches, newBranch.trim()]);
            setNewBranch('');
            setDialogOpen(false);
        }
    };

    return (
        <TooltipProvider>
            <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
                <div className="flex w-full items-center px-4 py-3 lg:px-6">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />
                    <div className="flex-1 max-w-sm">
                        <SearchTrigger onClick={() => setSearchOpen(true)} />
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {selectedBranch || 'Select Branch'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {branches.map(
                                    (
                                        branch:
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | React.ReactElement<
                                                  unknown,
                                                  string | React.JSXElementConstructor<any>
                                              >
                                            | Iterable<React.ReactNode>
                                            | Promise<
                                                  | string
                                                  | number
                                                  | bigint
                                                  | boolean
                                                  | React.ReactPortal
                                                  | React.ReactElement<
                                                        unknown,
                                                        string | React.JSXElementConstructor<any>
                                                    >
                                                  | Iterable<React.ReactNode>
                                                  | null
                                                  | undefined
                                              >
                                            | null
                                            | undefined,
                                        index: React.Key | null | undefined
                                    ) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onSelect={() => {
                                                setSelectedBranch(branch as string);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            {branch}
                                        </DropdownMenuItem>
                                    )
                                )}
                                <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
                                    + Add Branch
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="h-5 w-5 text-gray-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Support</p>
                            </TooltipContent>
                        </Tooltip>
                        <div className="relative">
                            <Bell className="h-5 w-5 text-gray-500" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                5
                            </span>
                        </div>
                        <ModeToggle />
                    </div>
                </div>
            </header>
            <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter a new branch name</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newBranch}
                            onChange={(e) => setNewBranch(e.target.value)}
                            placeholder="Branch name"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setNewBranch('')}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={handleAddBranch}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
