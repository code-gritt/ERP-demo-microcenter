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
import { Search, Filter, Edit, Trash } from 'lucide-react';

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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export interface Order {
    id: number;
    orderNo: string;
    orderDate: string;
    clientId: string;
    clientName: string;
    salesmanName: string;
    lineItems: string;
    netAmount: number;
    deliveryRequired: boolean;
    paymentMode: string;
    comments: string;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
}

interface OrderFormValues {
    orderNo: string;
    orderDate: string;
    clientId: string;
    clientName: string;
    salesmanName: string;
    lineItems: string;
    netAmount: number;
    deliveryRequired: boolean;
    paymentMode: string;
    comments: string;
}

interface OrdersTableProps {
    orders: Order[];
    onAddOrder: (data: OrderFormValues) => void;
    onEditOrder: (order: Order) => void;
    onDeleteOrder: (id: number) => void;
}

export function OrdersTable({ orders, onAddOrder, onEditOrder, onDeleteOrder }: OrdersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const uniqueOrderNos = [...new Set(orders.map((o) => o.orderNo))];

    const columns: ColumnDef<Order>[] = [
        { accessorKey: 'orderNo', header: 'Order No' },
        { accessorKey: 'orderDate', header: 'Order Date' },
        { accessorKey: 'clientId', header: 'Client ID' },
        { accessorKey: 'clientName', header: 'Client Name' },
        { accessorKey: 'salesmanName', header: 'Salesman Name' },
        { accessorKey: 'lineItems', header: 'Line Items' },
        { accessorKey: 'netAmount', header: 'Net Amount' },
        {
            accessorKey: 'deliveryRequired',
            header: 'Delivery Required',
            cell: ({ row }) => (row.original.deliveryRequired ? 'Yes' : 'No'),
        },
        { accessorKey: 'paymentMode', header: 'Payment Mode' },
        { accessorKey: 'comments', header: 'Comments' },
        { accessorKey: 'createdBy', header: 'Created By' },
        { accessorKey: 'createdOn', header: 'Created On' },
        { accessorKey: 'modifiedBy', header: 'Modified By' },
        { accessorKey: 'modifiedOn', header: 'Modified On' },
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSelectedOrder(row.original);
                                    setEditDialogOpen(true);
                                }}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Order</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label>Client ID</label>
                                        <Input value={selectedOrder.clientId} readOnly />
                                    </div>
                                    <div>
                                        <label>Salesman ID</label>
                                        <Input value="S001" readOnly />
                                    </div>
                                    <div>
                                        <label>Payment Mode</label>
                                        <Input value={selectedOrder.paymentMode} />
                                    </div>
                                    <div>
                                        <label>Delivery Required</label>
                                        <Input
                                            value={selectedOrder.deliveryRequired ? 'Yes' : 'No'}
                                        />
                                    </div>
                                    <div>
                                        <label>Order Date</label>
                                        <Input value={selectedOrder.orderDate} />
                                    </div>
                                    <div>
                                        <label>Comments</label>
                                        <Input value={selectedOrder.comments} />
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSelectedOrder(row.original);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Delete</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                                <p>
                                    Are you sure you want to delete order {selectedOrder.orderNo}?
                                </p>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: orders,
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
                            placeholder="Search orders..."
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
