'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getGroupedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Search, RefreshCw, FileText, Plus, Edit, Trash, GripVertical } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    type DragEndEvent,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

export interface Order {
    id: number;
    orderNo: string;
    orderDate: string;
    clientId: string;
    clientName: string;
    salesmanId: string;
    salesmanName: string;
    lineItems: number;
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
    salesmanId: string;
    salesmanName: string;
    lineItems: number;
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

interface Client {
    id: string;
    name: string;
}

interface Salesman {
    id: string;
    name: string;
}

const clients: Client[] = [
    { id: 'CU001', name: 'KONICA SILK MILLS' },
    { id: 'CU002', name: 'JAIPUR SYNTEX LIMITED' },
    { id: 'CU003', name: 'C.M. TEXTILES PVT. LTD.' },
    { id: 'CU004', name: 'STYLE INTERNATIONAL CO. LTD.' },
    { id: 'CU005', name: 'PRIMLAKS (JAPAN) LTD.' },
    { id: 'CU006', name: 'BAJAJ INDUSTRIES' },
    { id: 'CU007', name: 'SHANGHAI HUA SHEN IMPORT AND EXPORT CO. LTD' },
    { id: 'CU010', name: 'MANEKAL HARIAL MILLS LTD.' },
];

const salesmen: Salesman[] = [
    { id: 'S001', name: 'VINOD SIVADASAN' },
    { id: 'S002', name: 'ASHISH' },
    { id: 'S003', name: 'RAJ KEWALRAM' },
    { id: 'S004', name: 'RAHUL RAJEEV' },
    { id: 'S005', name: 'RAJESH PN' },
];

const paymentModes = ['Credit', 'Debit', 'CARD', 'Cash', 'Bank Transfer'];

const DraggableTableHeader = ({ header }: { header: any }) => {
    const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
        id: header.column.id,
    });

    const style = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition: 'width transform 0.2s ease-in-out',
        width: header.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    } as React.CSSProperties;

    return (
        <TableHead ref={setNodeRef} style={style}>
            {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            <Button variant="ghost" size="icon" {...attributes} {...listeners}>
                <GripVertical className="h-4 w-4" />
            </Button>
        </TableHead>
    );
};

const DragAlongCell = ({ cell }: { cell: any }) => {
    const { isDragging, setNodeRef, transform } = useSortable({
        id: cell.column.id,
    });

    const style = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition: 'width transform 0.2s ease-in-out',
        width: cell.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    } as React.CSSProperties;

    return (
        <TableCell ref={setNodeRef} style={style}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
    );
};

export function OrdersTable({ orders, onAddOrder, onEditOrder, onDeleteOrder }: OrdersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [grouping, setGrouping] = useState<string[]>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newOrder, setNewOrder] = useState<OrderFormValues>({
        orderNo: '',
        orderDate: '',
        clientId: '',
        clientName: '',
        salesmanId: '',
        salesmanName: '',
        lineItems: 0,
        netAmount: 0,
        deliveryRequired: false,
        paymentMode: '',
        comments: '',
    });

    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            if (startDate && o.orderDate < startDate) return false;
            if (endDate && o.orderDate > endDate) return false;
            return true;
        });
    }, [orders, startDate, endDate]);

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            { accessorKey: 'orderNo', header: 'Order No', id: 'orderNo' },
            { accessorKey: 'orderDate', header: 'Order Date', id: 'orderDate' },
            { accessorKey: 'clientId', header: 'Client Id', id: 'clientId' },
            { accessorKey: 'clientName', header: 'Client Name', id: 'clientName' },
            { accessorKey: 'salesmanName', header: 'Salesman Name', id: 'salesmanName' },
            {
                accessorKey: 'lineItems',
                header: 'Line Items',
                id: 'lineItems',
                cell: ({ row }) => (
                    <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => (window.location.href = `/order-items/${row.original.id}`)}
                    >
                        {row.original.lineItems} item{row.original.lineItems !== 1 ? 's' : ''}
                    </Badge>
                ),
            },
            { accessorKey: 'netAmount', header: 'Net Amount', id: 'netAmount' },
            {
                accessorKey: 'deliveryRequired',
                header: 'Delivery Required',
                id: 'deliveryRequired',
                cell: ({ row }) => (
                    <Badge
                        className={row.original.deliveryRequired ? 'bg-green-500' : 'bg-red-500'}
                    >
                        {row.original.deliveryRequired ? 'Yes' : 'No'}
                    </Badge>
                ),
            },
            { accessorKey: 'paymentMode', header: 'Payment Mode', id: 'paymentMode' },
            { accessorKey: 'comments', header: 'Comments', id: 'comments' },
            { accessorKey: 'createdBy', header: 'Created By', id: 'createdBy' },
            { accessorKey: 'createdOn', header: 'Created On', id: 'createdOn' },
            { accessorKey: 'modifiedBy', header: 'Modified By', id: 'modifiedBy' },
            { accessorKey: 'modifiedOn', header: 'Modified On', id: 'modifiedOn' },
            {
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => (
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
                ),
            },
        ],
        []
    );

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: 'grouping-zone',
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            if (over.id === 'grouping-zone' && !grouping.includes(active.id as string)) {
                setGrouping((prev) => {
                    const newGrouping = [...prev, active.id as string];
                    table.setGrouping(newGrouping); // Update table grouping state
                    return newGrouping;
                });
            } else {
                setColumnOrder((prev) => {
                    const oldIndex = prev.indexOf(active.id as string);
                    const newIndex = prev.indexOf(over.id as string);
                    return arrayMove(prev, oldIndex, newIndex);
                });
            }
        }
    };

    const table = useReactTable({
        data: filteredOrders,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
            grouping,
            columnOrder,
        },
        onGlobalFilterChange: setGlobalFilter,
        onGroupingChange: setGrouping,
        onColumnOrderChange: setColumnOrder,
        initialState: {
            columnOrder: columns.map((col) => col.id || ''),
        },
    });

    useEffect(() => {
        // Initialize columnOrder with all column IDs
        setColumnOrder(columns.map((col) => col.id || ''));
    }, [columns]);

    const handleRefresh = () => {
        setGlobalFilter('');
        setColumnFilters([]);
        setStartDate('');
        setEndDate('');
        setGrouping([]);
    };

    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filteredOrders);
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, 'orders.xlsx');
    };

    const handleAddSave = () => {
        onAddOrder(newOrder);
        setAddDialogOpen(false);
        setNewOrder({
            orderNo: '',
            orderDate: '',
            clientId: '',
            clientName: '',
            salesmanId: '',
            salesmanName: '',
            lineItems: 0,
            netAmount: 0,
            deliveryRequired: false,
            paymentMode: '',
            comments: '',
        });
    };

    const handleEditSave = () => {
        if (selectedOrder) {
            onEditOrder(selectedOrder);
            setEditDialogOpen(false);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedOrder) {
            onDeleteOrder(selectedOrder.id);
            setDeleteDialogOpen(false);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
        >
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span>Filter by Date Range</span>
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
                            <FileText className="mr-2 h-4 w-4" /> Export to Excel
                        </Button>
                        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-purple-600 text-white">
                                    <Plus className="mr-2 h-4 w-4" /> Add Order
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Order</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Client ID
                                            </label>
                                            <Select
                                                value={newOrder.clientId}
                                                onValueChange={(value) => {
                                                    const client = clients.find(
                                                        (c) => c.id === value
                                                    );
                                                    setNewOrder({
                                                        ...newOrder,
                                                        clientId: value,
                                                        clientName: client?.name || '',
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a customer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {clients.map((client) => (
                                                        <SelectItem
                                                            key={client.id}
                                                            value={client.id}
                                                        >
                                                            {client.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Salesman ID
                                            </label>
                                            <Select
                                                value={newOrder.salesmanId}
                                                onValueChange={(value) => {
                                                    const salesman = salesmen.find(
                                                        (s) => s.id === value
                                                    );
                                                    setNewOrder({
                                                        ...newOrder,
                                                        salesmanId: value,
                                                        salesmanName: salesman?.name || '',
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a salesman" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {salesmen.map((salesman) => (
                                                        <SelectItem
                                                            key={salesman.id}
                                                            value={salesman.id}
                                                        >
                                                            {salesman.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Payment Mode
                                            </label>
                                            <Select
                                                value={newOrder.paymentMode}
                                                onValueChange={(value) =>
                                                    setNewOrder({ ...newOrder, paymentMode: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select payment mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentModes.map((mode) => (
                                                        <SelectItem key={mode} value={mode}>
                                                            {mode}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Delivery Required
                                            </label>
                                            <Select
                                                value={newOrder.deliveryRequired ? 'Yes' : 'No'}
                                                onValueChange={(value) =>
                                                    setNewOrder({
                                                        ...newOrder,
                                                        deliveryRequired: value === 'Yes',
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
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
                                        <Input
                                            type="date"
                                            value={newOrder.orderDate}
                                            onChange={(e) =>
                                                setNewOrder({
                                                    ...newOrder,
                                                    orderDate: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Comments
                                        </label>
                                        <Input
                                            value={newOrder.comments}
                                            onChange={(e) =>
                                                setNewOrder({
                                                    ...newOrder,
                                                    comments: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setAddDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddSave}>Save Order</Button>
                                    </DialogFooter>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                {/* Search */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                value={globalFilter ?? ''}
                                onChange={(event) => setGlobalFilter(String(event.target.value))}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>
                <div
                    ref={setDropRef}
                    className={`p-2 border border-dashed ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                    Drag a column header here to group by that column
                </div>
                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    <SortableContext
                                        items={
                                            columnOrder.length > 0
                                                ? columnOrder
                                                : columns.map((col) => col.id || '')
                                        }
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <DraggableTableHeader key={header.id} header={header} />
                                        ))}
                                    </SortableContext>
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <SortableContext
                                            items={
                                                columnOrder.length > 0
                                                    ? columnOrder
                                                    : columns.map((col) => col.id || '')
                                            }
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <DragAlongCell key={cell.id} cell={cell} />
                                            ))}
                                        </SortableContext>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
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
                                            onValueChange={(value) => {
                                                const client = clients.find((c) => c.id === value);
                                                setSelectedOrder({
                                                    ...selectedOrder,
                                                    clientId: value,
                                                    clientName: client?.name || '',
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clients.map((client) => (
                                                    <SelectItem key={client.id} value={client.id}>
                                                        {client.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Salesman ID
                                        </label>
                                        <Select
                                            value={selectedOrder.salesmanId}
                                            onValueChange={(value) => {
                                                const salesman = salesmen.find(
                                                    (s) => s.id === value
                                                );
                                                setSelectedOrder({
                                                    ...selectedOrder,
                                                    salesmanId: value,
                                                    salesmanName: salesman?.name || '',
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {salesmen.map((salesman) => (
                                                    <SelectItem
                                                        key={salesman.id}
                                                        value={salesman.id}
                                                    >
                                                        {salesman.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Payment Mode
                                        </label>
                                        <Select
                                            value={selectedOrder.paymentMode}
                                            onValueChange={(value) =>
                                                setSelectedOrder({
                                                    ...selectedOrder,
                                                    paymentMode: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentModes.map((mode) => (
                                                    <SelectItem key={mode} value={mode}>
                                                        {mode}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Delivery Required
                                        </label>
                                        <Select
                                            value={selectedOrder.deliveryRequired ? 'Yes' : 'No'}
                                            onValueChange={(value) =>
                                                setSelectedOrder({
                                                    ...selectedOrder,
                                                    deliveryRequired: value === 'Yes',
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
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
                                    <Input
                                        type="date"
                                        value={selectedOrder.orderDate}
                                        onChange={(e) =>
                                            setSelectedOrder({
                                                ...selectedOrder,
                                                orderDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Comments
                                    </label>
                                    <Input
                                        value={selectedOrder.comments}
                                        onChange={(e) =>
                                            setSelectedOrder({
                                                ...selectedOrder,
                                                comments: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleEditSave}>Save Changes</Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
                                    All of your data will be permanently removed. This action cannot
                                    be undone.
                                </p>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleDeleteConfirm}>
                                        Yes, Delete
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DndContext>
    );
}
