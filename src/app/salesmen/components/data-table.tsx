'use client';

import { useState } from 'react';
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Search, Filter } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
    plan: string;
    billing: string;
    status: string;
    joinedDate: string;
    lastLogin: string;
}

interface UserFormValues {
    name: string;
    email: string;
    role: string;
    plan: string;
    billing: string;
    status: string;
}

interface DataTableProps {
    users: User[];
    onDeleteUser: (id: number) => void;
    onEditUser: (user: User) => void;
    onAddUser: (userData: UserFormValues) => void;
}

export function DataTable({ users }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');

    // Extract unique IDs and names for filter options
    const uniqueIds = [...new Set(users.map((user) => user.id))].sort((a, b) => a - b);
    const uniqueNames = [...new Set(users.map((user) => user.name))].sort();

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Salesman ID</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Select
                                value={(column.getFilterValue() as string) ?? ''}
                                onValueChange={(value) =>
                                    column.setFilterValue(value === 'all' ? undefined : value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Filter by ID" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All IDs</SelectItem>
                                    {uniqueIds.map((id) => (
                                        <SelectItem key={id} value={id.toString()}>
                                            {id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            cell: ({ row }) => (
                <span className="font-mono text-sm text-muted-foreground">{row.original.id}</span>
            ),
            enableSorting: true,
            size: 50,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Salesman</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Select
                                value={(column.getFilterValue() as string) ?? ''}
                                onValueChange={(value) =>
                                    column.setFilterValue(value === 'all' ? undefined : value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Filter by Name" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Names</SelectItem>
                                    {uniqueNames.map((name) => (
                                        <SelectItem key={name} value={name}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    return (
        <div className="w-full space-y-4">
            {/* Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search salesmen..."
                            value={globalFilter ?? ''}
                            onChange={(event) => setGlobalFilter(String(event.target.value))}
                            className="pl-9"
                        />
                    </div>
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
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

            {/* Pagination & Page Size */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="page-size" className="text-sm font-medium">
                        Show
                    </Label>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger className="w-20 cursor-pointer" id="page-size">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2 hidden sm:flex">
                        <p className="text-sm font-medium">Page</p>
                        <strong className="text-sm">
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </strong>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="cursor-pointer"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="cursor-pointer"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
