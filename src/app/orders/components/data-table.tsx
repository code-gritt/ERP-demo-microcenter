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
import { Search, Edit, Trash } from 'lucide-react';

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
    DialogFooter,
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

export function OrdersTable({ orders, onEditOrder, onDeleteOrder }: OrdersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Client ID
                                            </label>
                                            <Select
                                                value={selectedOrder.clientId}
                                                onValueChange={() => {}}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={selectedOrder.clientId}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={selectedOrder.clientId}>
                                                        {selectedOrder.clientId}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Salesman ID
                                            </label>
                                            <Select
                                                value="VINOD SIVADASAN"
                                                onValueChange={() => {}}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="VINOD SIVADASAN" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="VINOD SIVADASAN">
                                                        VINOD SIVADASAN
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Payment Mode
                                            </label>
                                            <Select
                                                value={selectedOrder.paymentMode}
                                                onValueChange={() => {}}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={selectedOrder.paymentMode}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={selectedOrder.paymentMode}>
                                                        {selectedOrder.paymentMode}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Delivery Required
                                            </label>
                                            <Select
                                                value={
                                                    selectedOrder.deliveryRequired ? 'Yes' : 'No'
                                                }
                                                onValueChange={() => {}}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            selectedOrder.deliveryRequired
                                                                ? 'Yes'
                                                                : 'No'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Yes">Yes</SelectItem>
                                                    <SelectItem value="No">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Order Date
                                        </label>
                                        <Input type="date" defaultValue={selectedOrder.orderDate} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Comments
                                        </label>
                                        <Input value={selectedOrder.comments} />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                onEditOrder(selectedOrder);
                                                setEditDialogOpen(false);
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
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
                                <div className="text-center">
                                    <p className="text-yellow-600 mb-4">
                                        Are you sure you want to delete this order?
                                    </p>
                                    <p className="text-gray-500 mb-4">
                                        All of your data will be permanently removed. This action
                                        cannot be undone.
                                    </p>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setDeleteDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                onDeleteOrder(selectedOrder.id);
                                                setDeleteDialogOpen(false);
                                            }}
                                        >
                                            Yes, Delete
                                        </Button>
                                    </DialogFooter>
                                </div>
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
