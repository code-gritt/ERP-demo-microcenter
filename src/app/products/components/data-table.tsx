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

export interface Product {
    id: number;
    code: string;
    name: string;
    category: string;
    brand: string;
    unitPrice: number;
    costPrice: number;
    stocksAvailable: number;
}

interface ProductFormValues {
    code: string;
    name: string;
    category: string;
    brand: string;
    unitPrice: number;
    costPrice: number;
    stocksAvailable: number;
}

interface ProductsTableProps {
    products: Product[];
    onAddProduct: (data: ProductFormValues) => void;
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (id: number) => void;
}

export function ProductsTable({ products }: ProductsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const uniqueCodes = [...new Set(products.map((p) => p.code))];

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'code',
            header: ({ column }) => (
                <div className="flex items-center gap-1">
                    <span>Product Code</span>
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
        },
        { accessorKey: 'name', header: 'Product Name' },
        { accessorKey: 'category', header: 'Category' },
        { accessorKey: 'brand', header: 'Brand' },
        { accessorKey: 'unitPrice', header: 'Unit Price' },
        { accessorKey: 'costPrice', header: 'Cost Price' },
        { accessorKey: 'stocksAvailable', header: 'Stocks Available' },
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
    });

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
                                    <TableHead key={header.id} className="cursor-pointer">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
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
