'use client';

import { useState } from 'react';
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Search, Filter } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface User {
    id: string;
    name: string;
    address: string;
    email: string;
    avatar: string;
}

interface DataTableProps {
    users: User[];
}

export function DataTable({ users }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const uniqueIds = [...new Set(users.map((user) => user.id))].sort();
    const uniqueNames = [...new Set(users.map((user) => user.name))].sort();

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Client ID</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {uniqueIds.map((id) => (
                                <DropdownMenuCheckboxItem
                                    key={id}
                                    checked={
                                        (column.getFilterValue() as string[] | undefined)?.includes(
                                            id
                                        ) ?? false
                                    }
                                    onCheckedChange={(checked) => {
                                        const filterValues =
                                            (column.getFilterValue() as string[] | undefined) ?? [];
                                        if (checked) column.setFilterValue([...filterValues, id]);
                                        else
                                            column.setFilterValue(
                                                filterValues.filter((v) => v !== id)
                                            );
                                    }}
                                >
                                    {id}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            cell: ({ row }) => (
                <span className="font-mono text-sm text-muted-foreground">{row.original.id}</span>
            ),
            filterFn: (row, columnId, filterValues) => {
                if (!filterValues || (filterValues as string[]).length === 0) return true;
                return (filterValues as string[]).includes(row.getValue<string>(columnId));
            },
            enableSorting: true,
            size: 90,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Client Name</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {uniqueNames.map((name) => (
                                <DropdownMenuCheckboxItem
                                    key={name}
                                    checked={
                                        (column.getFilterValue() as string[] | undefined)?.includes(
                                            name
                                        ) ?? false
                                    }
                                    onCheckedChange={(checked) => {
                                        const filterValues =
                                            (column.getFilterValue() as string[] | undefined) ?? [];
                                        if (checked) column.setFilterValue([...filterValues, name]);
                                        else
                                            column.setFilterValue(
                                                filterValues.filter((v) => v !== name)
                                            );
                                    }}
                                >
                                    {name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs font-medium">
                                {user.avatar}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                    </div>
                );
            },
            filterFn: (row, columnId, filterValues) => {
                if (!filterValues || (filterValues as string[]).length === 0) return true;
                return (filterValues as string[]).includes(row.getValue<string>(columnId));
            },
            enableSorting: true,
        },
        {
            accessorKey: 'address',
            header: 'Address',
            cell: ({ row }) => <span className="text-sm">{row.original.address}</span>,
            enableSorting: true,
        },
        {
            accessorKey: 'email',
            header: 'Email Address',
            cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
            enableSorting: true,
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    });

    return (
        <div className="w-full space-y-4">
            {/* Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search clients..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(String(e.target.value))}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="cursor-pointer"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                        {header.column.getCanSort() && (
                                            <span>
                                                {header.column.getIsSorted() === 'asc'
                                                    ? ' ↑'
                                                    : header.column.getIsSorted() === 'desc'
                                                    ? ' ↓'
                                                    : ''}
                                            </span>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
