'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { Search, Download, Plus, Edit, Trash, GripVertical } from 'lucide-react';
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';

import * as XLSX from 'xlsx';
import {
    DndContext,
    closestCenter,
    type DragEndEvent,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

// Define the OrderItem interface
interface OrderItem {
    id: number;
    itemNo: number;
    productName: string;
    packing: string;
    price: number;
    quantity: number;
    lineTotal: number;
    vatPercent: number;
    vatAmount: number;
    netAmount: number;
}

// Define the NewItemFormValues interface
interface NewItemFormValues {
    itemNo: number;
    productName: string;
    packing: string;
    price: number;
    quantity: number;
    vatPercent: number;
    category: string;
    brand: string;
    stockAvailable: boolean;
}

// Define mockOrderItems with an index signature
const mockOrderItems: { [key: number]: OrderItem[] } = {
    1: [
        {
            id: 1,
            itemNo: 12,
            productName: 'Classic T-Shirt',
            packing: 'Pack',
            price: 6000,
            quantity: 10,
            lineTotal: 60000,
            vatPercent: 18,
            vatAmount: 10800,
            netAmount: 70800,
        },
        {
            id: 2,
            itemNo: 23,
            productName: 'Wool Coat',
            packing: 'Bag',
            price: 10000,
            quantity: 5,
            lineTotal: 50000,
            vatPercent: 18,
            vatAmount: 9000,
            netAmount: 59000,
        },
        {
            id: 3,
            itemNo: 34,
            productName: 'Floral Dress',
            packing: 'Pack',
            price: 5500,
            quantity: 10,
            lineTotal: 55000,
            vatPercent: 18,
            vatAmount: 9900,
            netAmount: 64900,
        },
    ],
    2: [
        {
            id: 1,
            itemNo: 12,
            productName: 'Classic T-Shirt',
            packing: 'Pack',
            price: 6000,
            quantity: 10,
            lineTotal: 60000,
            vatPercent: 18,
            vatAmount: 10800,
            netAmount: 70800,
        },
        {
            id: 2,
            itemNo: 23,
            productName: 'Wool Coat',
            packing: 'Bag',
            price: 10000,
            quantity: 5,
            lineTotal: 50000,
            vatPercent: 5,
            vatAmount: 2500,
            netAmount: 52500,
        },
        {
            id: 3,
            itemNo: 34,
            productName: 'Floral Dress',
            packing: 'Pack',
            price: 5500,
            quantity: 10,
            lineTotal: 55000,
            vatPercent: 18,
            vatAmount: 9900,
            netAmount: 64900,
        },
    ],
    3: [
        {
            id: 1,
            itemNo: 12,
            productName: 'Classic T-Shirt',
            packing: 'Pack',
            price: 6000,
            quantity: 10,
            lineTotal: 60000,
            vatPercent: 18,
            vatAmount: 10800,
            netAmount: 70800,
        },
        {
            id: 2,
            itemNo: 23,
            productName: 'Wool Coat',
            packing: 'Bag',
            price: 10000,
            quantity: 5,
            lineTotal: 50000,
            vatPercent: 18,
            vatAmount: 9000,
            netAmount: 59000,
        },
    ],
};

const DraggableTableHeader = ({ header }: { header: any }) => {
    const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
        id: header.column.id,
    });

    const style = {
        opacity: isDragging ? 0.8 : 1,
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

export default function OrderItemsPage() {
    const { id } = useParams();
    const orderId = Number(id);
    const [items, setItems] = useState<OrderItem[]>(mockOrderItems[orderId] || []);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newItem, setNewItem] = useState<NewItemFormValues>({
        itemNo: 0,
        productName: '',
        packing: '',
        price: 0,
        quantity: 0,
        vatPercent: 0,
        category: '',
        brand: '',
        stockAvailable: false,
    });

    const columns: ColumnDef<OrderItem>[] = useMemo(
        () => [
            { accessorKey: 'itemNo', header: 'Item No', id: 'itemNo' },
            { accessorKey: 'productName', header: 'Product Name', id: 'productName' },
            { accessorKey: 'packing', header: 'Packing', id: 'packing' },
            { accessorKey: 'price', header: 'Price', id: 'price' },
            { accessorKey: 'quantity', header: 'Quantity', id: 'quantity' },
            { accessorKey: 'lineTotal', header: 'Line Total', id: 'lineTotal' },
            { accessorKey: 'vatPercent', header: 'VAT %', id: 'vatPercent' },
            { accessorKey: 'vatAmount', header: 'VAT Amount', id: 'vatAmount' },
            { accessorKey: 'netAmount', header: 'Net Amount', id: 'netAmount' },
            {
                id: 'actions',
                header: 'Action',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                // Edit logic
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setItems(items.filter((item) => item.id !== row.original.id));
                            }}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [items]
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
            setColumnOrder((prev) => {
                const oldIndex = prev.indexOf(active.id as string);
                const newIndex = prev.indexOf(over.id as string);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const table = useReactTable({
        data: items,
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
            columnOrder,
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnOrderChange: setColumnOrder,
        initialState: {
            columnOrder: columns.map((col) => col.id || ''),
        },
    });

    useEffect(() => {
        setColumnOrder(columns.map((col) => col.id || ''));
    }, [columns]);

    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(items);
        XLSX.utils.book_append_sheet(wb, ws, 'OrderItems');
        XLSX.writeFile(wb, `order_items_${orderId}.xlsx`);
    };

    const handleAddSave = () => {
        const newItemData = {
            id: items.length + 1,
            itemNo: newItem.itemNo,
            productName: newItem.productName,
            packing: newItem.packing,
            price: newItem.price,
            quantity: newItem.quantity,
            lineTotal: newItem.price * newItem.quantity,
            vatPercent: newItem.vatPercent,
            vatAmount: (newItem.price * newItem.quantity * newItem.vatPercent) / 100,
            netAmount:
                newItem.price * newItem.quantity +
                (newItem.price * newItem.quantity * newItem.vatPercent) / 100,
        };
        setItems((prev) => [newItemData, ...prev]);
        setAddDialogOpen(false);
        setNewItem({
            itemNo: 0,
            productName: '',
            packing: '',
            price: 0,
            quantity: 0,
            vatPercent: 0,
            category: '',
            brand: '',
            stockAvailable: false,
        });
    };

    const totalAmount = items.reduce((sum, item) => sum + item.netAmount, 0);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
        >
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">KEWALRAM AND SONS WLL</h1>
                    <div>
                        <select className="p-2 border rounded">
                            <option>Head Office</option>
                        </select>
                        <Button variant="outline" className="ml-2">
                            Support
                        </Button>
                    </div>
                </div>
                <div className="mb-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        Back Page
                    </Button>
                    <span className="ml-2">
                        Client Name: JAIPUR SYNTEX LIMITED | Order No: SS002
                    </span>
                </div>
                <div className="flex justify-between mb-4">
                    <Button
                        className="bg-green-600 text-white"
                        onClick={() => {
                            /* Download logic */
                        }}
                    >
                        <Download className="mr-2 h-4 w-4" /> Download Invoice
                    </Button>
                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-purple-600 text-white">
                                <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Item</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Product *
                                    </label>
                                    <Input placeholder="Search Product" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Product ID
                                        </label>
                                        <Input
                                            value={newItem.itemNo}
                                            onChange={(e) =>
                                                setNewItem({
                                                    ...newItem,
                                                    itemNo: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Packing
                                        </label>
                                        <Input
                                            value={newItem.packing}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, packing: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Unit Price
                                        </label>
                                        <Input
                                            value={newItem.price}
                                            onChange={(e) =>
                                                setNewItem({
                                                    ...newItem,
                                                    price: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cost Price
                                        </label>
                                        <Input disabled value={newItem.price} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            VAT Percentage
                                        </label>
                                        <Input
                                            value={newItem.vatPercent}
                                            onChange={(e) =>
                                                setNewItem({
                                                    ...newItem,
                                                    vatPercent: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Category
                                        </label>
                                        <Input
                                            value={newItem.category}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, category: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Brand
                                        </label>
                                        <Input
                                            value={newItem.brand}
                                            onChange={(e) =>
                                                setNewItem({ ...newItem, brand: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Stock Available
                                        </label>
                                        <Input
                                            disabled
                                            value={newItem.stockAvailable ? 'Yes' : 'No'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Quantity *
                                        </label>
                                        <Input
                                            value={newItem.quantity}
                                            onChange={(e) =>
                                                setNewItem({
                                                    ...newItem,
                                                    quantity: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setAddDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-purple-600 text-white"
                                        onClick={handleAddSave}
                                    >
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div
                    ref={setDropRef}
                    className={`p-2 border border-dashed ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                    Drag a column header here to group by that column
                </div>
                <div className="flex justify-end mb-4">
                    <Button className="bg-green-600 text-white" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" /> Export to Excel
                    </Button>
                    <div className="relative flex-1 max-w-sm ml-2">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={globalFilter ?? ''}
                            onChange={(event) => setGlobalFilter(String(event.target.value))}
                            className="pl-9"
                        />
                    </div>
                </div>
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
                <div className="mt-4 text-right">
                    <strong>Total: {totalAmount.toLocaleString()} </strong>
                </div>
            </div>
        </DndContext>
    );
}
