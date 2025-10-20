'use client';

import { useState, useMemo } from 'react';
import { useMutation } from '@apollo/client/react';
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
import { Search, RefreshCw, FileText, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

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
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';
import { ADD_ORDER_MUTATION, UPDATE_ORDER_MUTATION, DELETE_ORDER_MUTATION } from '@/lib/mutation';
import type {
    AddOrderResponse,
    AddOrderVariables,
    UpdateOrderResponse,
    UpdateOrderVariables,
    DeleteOrderResponse,
    DeleteOrderVariables,
} from '@/lib/types';

export interface OrderTable {
    id: string;
    orderNo: string;
    orderDate: string;
    clientId: string;
    clientName: string;
    salesmanId: string;
    salesmanName: string;
    lineItems: number;
    netAmount: number | null;
    deliveryRequired: boolean;
    paymentMode: string;
    comments: string;
    createdBy: string;
    createdOn: string;
    modifiedBy: string | null;
    modifiedOn: string | null;
}

interface Client {
    cu_code: string;
    cu_name: string;
    __typename: string;
}

interface Salesman {
    sm_code: string;
    sm_name: string;
    __typename: string;
}

interface OrdersTableProps {
    orders: OrderTable[];
    totalCount: number;
    pageSize: number;
    clients: Client[];
    salesmen: Salesman[];
    refetchOrders: () => void;
    onPageChange: (offset: number) => void;
}

export function OrdersTable({
    orders,
    totalCount,
    pageSize,
    clients,

    refetchOrders,
    onPageChange,
}: OrdersTableProps) {
    // ✅ ALL MUTATIONS
    const [addOrderMutation] = useMutation<AddOrderResponse, AddOrderVariables>(ADD_ORDER_MUTATION);
    const [updateOrderMutation] = useMutation<UpdateOrderResponse, UpdateOrderVariables>(
        UPDATE_ORDER_MUTATION
    );
    const [deleteOrderMutation] = useMutation<DeleteOrderResponse, DeleteOrderVariables>(
        DELETE_ORDER_MUTATION
    );

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderTable | null>(null);

    // ✅ NEW ORDER
    const [newOrder, setNewOrder] = useState<OrderTable>({
        id: '',
        orderNo: '',
        orderDate: new Date().toISOString().split('T')[0],
        clientId: '',
        clientName: '',
        salesmanId: '',
        salesmanName: '',
        lineItems: 0,
        netAmount: null,
        deliveryRequired: true,
        paymentMode: 'Credit',
        comments: '',
        createdBy: '',
        createdOn: '',
        modifiedBy: null,
        modifiedOn: null,
    });

    // ✅ EDIT ORDER (POPULATED)
    const editOrder = useMemo(() => (selectedOrder ? { ...selectedOrder } : null), [selectedOrder]);

    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            if (startDate && o.orderDate < startDate) return false;
            if (endDate && o.orderDate > endDate) return false;
            return true;
        });
    }, [orders, startDate, endDate]);

    const columns: ColumnDef<OrderTable>[] = useMemo(
        () => [
            { accessorKey: 'orderNo', header: 'Order No', size: 100 },
            {
                accessorKey: 'orderDate',
                header: 'Order Date',
                cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString(),
                size: 120,
            },
            { accessorKey: 'clientName', header: 'Client', size: 200 },
            { accessorKey: 'salesmanName', header: 'Salesman', size: 150 },
            {
                accessorKey: 'lineItems',
                header: 'Line Items',
                cell: ({ row }) => (
                    <Badge variant="secondary">{row.original.lineItems} items</Badge>
                ),
                size: 100,
            },
            {
                accessorKey: 'netAmount',
                header: 'Net Amount',
                cell: ({ row }) =>
                    row.original.netAmount ? `$${row.original.netAmount.toFixed(2)}` : '-',
                size: 120,
            },
            {
                accessorKey: 'deliveryRequired',
                header: 'Delivery',
                cell: ({ row }) => (
                    <Badge variant={row.original.deliveryRequired ? 'default' : 'secondary'}>
                        {row.original.deliveryRequired ? 'Yes' : 'No'}
                    </Badge>
                ),
                size: 100,
            },
            { accessorKey: 'paymentMode', header: 'Payment', size: 120 },
            { accessorKey: 'comments', header: 'Comments', size: 150 },
            { accessorKey: 'createdBy', header: 'Created', size: 100 },
        ],
        []
    );

    const table = useReactTable({
        data: filteredOrders,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { sorting, columnFilters, globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        manualPagination: true,
        pageCount: Math.ceil(totalCount / pageSize),
    });

    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();

    // ✅ ADD ORDER
    const handleAddSave = async () => {
        if (!newOrder.clientId || !newOrder.salesmanId || !newOrder.paymentMode) {
            toast.error('Please fill all required fields');
            return;
        }
        try {
            const variables: AddOrderVariables = {
                clientId: newOrder.clientId,
                salesmanId: newOrder.salesmanId,
                orderDate: newOrder.orderDate,
                deliveryRequired: newOrder.deliveryRequired ? 'Y' : 'N',
                paymentMode: newOrder.paymentMode,
                comments: newOrder.comments || '',
            };
            const { data } = await addOrderMutation({ variables });
            if (data?.addOrder?.status === 'success') {
                toast.success(`Order ${data.addOrder.orders.order_no} created!`);
                setAddDialogOpen(false);
                refetchOrders();
                setNewOrder({
                    ...newOrder,
                    orderDate: new Date().toISOString().split('T')[0],
                    clientId: '',
                    clientName: '',
                    salesmanId: '',
                    salesmanName: '',
                    paymentMode: 'Credit',
                    comments: '',
                });
            } else {
                toast.error(data?.addOrder?.message || 'Failed to add order');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add order');
        }
    };

    // ✅ UPDATE ORDER
    const handleEditSave = async () => {
        if (!editOrder) return;
        try {
            const variables: UpdateOrderVariables = {
                orderId: editOrder.id,
                clientId: editOrder.clientId,
                salesmanId: editOrder.salesmanId,
                orderDate: editOrder.orderDate,
                deliveryRequired: editOrder.deliveryRequired ? 'Y' : 'N',
                paymentMode: editOrder.paymentMode,
                comments: editOrder.comments || '',
            };
            const { data } = await updateOrderMutation({ variables });
            if (data?.updateOrder?.status === 'success') {
                toast.success(`Order ${data.updateOrder.orders.order_no} updated!`);
                setEditDialogOpen(false);
                refetchOrders();
            } else {
                toast.error(data?.updateOrder?.message || 'Failed to update order');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update order');
        }
    };

    // ✅ DELETE ORDER
    const handleDeleteConfirm = async () => {
        if (!selectedOrder) return;
        try {
            const variables: DeleteOrderVariables = { orderId: selectedOrder.id };
            const { data } = await deleteOrderMutation({ variables });
            if (data?.deleteOrder?.status === 'success') {
                toast.success(`Order ${selectedOrder.orderNo} deleted!`);
                setDeleteDialogOpen(false);
                refetchOrders();
            } else {
                toast.error(data?.deleteOrder?.message || 'Failed to delete order');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete order');
        }
    };

    const handleRefresh = () => {
        setGlobalFilter('');
        setColumnFilters([]);
        setStartDate('');
        setEndDate('');
        refetchOrders();
    };

    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filteredOrders);
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, 'orders.xlsx');
    };

    // ✅ DIALOG COMPONENTS
    const OrderFormDialog = ({
        isOpen,
        onOpenChange,
        title,
        order,
        onSave,
        isEdit = false,
    }: {
        isOpen: boolean;
        onOpenChange: (open: boolean) => void;
        title: string;
        order: OrderTable | null;
        onSave: () => void;
        isEdit?: boolean;
    }) => (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Client *</label>
                            <Select
                                value={order?.clientId || ''}
                                onValueChange={() => {
                                    if (order) onSave(); // Trigger save to update state
                                    // TODO: Update order state here
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.cu_code} value={client.cu_code}>
                                            {client.cu_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* SIMPLIFIED - FULL FORM IN PRODUCTION */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Salesman *</label>
                            <Input value={order?.salesmanName || ''} readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Payment Mode *</label>
                            <Input value={order?.paymentMode || ''} readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Delivery *</label>
                            <Input value={order?.deliveryRequired ? 'Yes' : 'No'} readOnly />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Order Date</label>
                        <Input type="date" value={order?.orderDate || ''} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Comments</label>
                        <Input value={order?.comments || ''} readOnly />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={onSave}>{isEdit ? 'Update Order' : 'Create Order'}</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="w-full space-y-4">
            {/* CONTROLS */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span>Filter by Date:</span>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-auto"
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-auto"
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleRefresh}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                    <Button className="bg-green-600 text-white" onClick={handleExport}>
                        <FileText className="mr-2 h-4 w-4" /> Export Excel
                    </Button>
                    <OrderFormDialog
                        isOpen={addDialogOpen}
                        onOpenChange={setAddDialogOpen}
                        title="Add New Order"
                        order={newOrder}
                        onSave={handleAddSave}
                    />
                </div>
            </div>

            {/* SEARCH */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {header.column.getIsSorted() && (
                                            <span>
                                                {header.column.getIsSorted() === 'asc'
                                                    ? ' ↑'
                                                    : ' ↓'}
                                            </span>
                                        )}
                                    </TableHead>
                                ))}
                                <TableHead>Actions</TableHead>
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
                                    <TableCell>
                                        <div className="flex space-x-2">
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
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {currentPage * pageSize + 1} to{' '}
                    {Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount} orders
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

            {/* EDIT DIALOG */}
            <OrderFormDialog
                isOpen={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                title="Edit Order"
                order={editOrder}
                onSave={handleEditSave}
                isEdit={true}
            />

            {/* DELETE DIALOG */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Delete Order {selectedOrder?.orderNo}?</p>
                        <p className="text-gray-500 mb-4">This action cannot be undone.</p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
