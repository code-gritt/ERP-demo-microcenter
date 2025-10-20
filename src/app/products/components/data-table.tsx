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
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Search, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface ProductTable {
    id: string;
    code: string;
    name: string;
    category: string;
    brand: string;
    unitPrice: number;
    costPrice: number;
    stocksAvailable: number;
    packing: string;
    vatPerc: number;
}

interface ProductsTableProps {
    products: ProductTable[];
    totalCount: number;
    pageSize: number;
    onPageChange: (offset: number) => void;
}

export function ProductsTable({
    products,
    totalCount,
    pageSize,
    onPageChange,
}: ProductsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const uniqueCodes = [...new Set(products.map((p) => p.code))].sort();
    const uniqueBrands = [...new Set(products.map((p) => p.brand))].sort();
    const uniqueCategories = [...new Set(products.map((p) => p.category))].sort();

    const columns: ColumnDef<ProductTable>[] = [
        {
            accessorKey: 'code',
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Code</span>
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
                                    <SelectValue placeholder="Filter Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Codes</SelectItem>
                                    {uniqueCodes.map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            cell: ({ row }) => (
                <span className="font-mono text-sm font-medium">{row.original.code}</span>
            ),
            enableSorting: true,
            size: 90,
        },
        {
            accessorKey: 'name',
            header: 'Product Name',
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
            enableSorting: true,
        },
        {
            accessorKey: 'category',
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Category</span>
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
                                    <SelectValue placeholder="Filter Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {uniqueCategories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'brand',
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Brand</span>
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
                                    <SelectValue placeholder="Filter Brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Brands</SelectItem>
                                    {uniqueBrands.map((brand) => (
                                        <SelectItem key={brand} value={brand}>
                                            {brand}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'unitPrice',
            header: 'Unit Price',
            cell: ({ row }) => <span>${row.original.unitPrice.toFixed(2)}</span>,
            enableSorting: true,
        },
        {
            accessorKey: 'costPrice',
            header: 'Cost Price',
            cell: ({ row }) => <span>${row.original.costPrice.toFixed(2)}</span>,
            enableSorting: true,
        },
        {
            accessorKey: 'vatPerc',
            header: 'VAT %',
            cell: ({ row }) => <Badge variant="outline">{row.original.vatPerc}%</Badge>,
            enableSorting: true,
        },
        {
            accessorKey: 'packing',
            header: 'Packing',
            enableSorting: true,
        },
        {
            accessorKey: 'stocksAvailable',
            header: 'Stock',
            cell: ({ row }) => (
                <Badge variant={row.original.stocksAvailable < 10 ? 'destructive' : 'default'}>
                    {row.original.stocksAvailable}
                </Badge>
            ),
            enableSorting: true,
        },
    ];

    const table = useReactTable({
        data: products,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        manualPagination: true,
        pageCount: Math.ceil(totalCount / pageSize),
    });

    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();

    return (
        <div className="w-full space-y-4">
            {/* Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
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

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Showing {currentPage * pageSize + 1} to{' '}
                        {Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount} results
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onPageChange(currentPage * pageSize - pageSize);
                            table.setPageIndex(currentPage - 1);
                        }}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onPageChange(currentPage * pageSize + pageSize);
                            table.setPageIndex(currentPage + 1);
                        }}
                        disabled={currentPage === totalPages - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
