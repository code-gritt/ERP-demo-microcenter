'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
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
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
import { BaseLayout } from '@/components/layouts/base-layout';

// Define interfaces
export interface Company {
    company_id: string;
    company_name: string;
}
export interface User {
    user_id: string;
    user_name: string;
    designation: string;
    company_name: string;
    email_id: string;
    mobile_no: string;
    initials?: string;
}
export interface Salesman {
    sm_code: string;
    sm_name: string;
    __typename: string;
}
export interface Customer {
    cu_code: string;
    cu_name: string;
    address: string;
    email_id: string;
    __typename: string;
}
export interface Product {
    prod_code: string;
    product_name: string;
    brand: string;
    prod_cat: string;
    packing: string;
    unit_price: number;
    cost_price: number;
    vat_perc: number;
    stock_available: number;
    __typename: string;
}
export interface ProductsResult {
    products: Product[];
    totalCount: number;
    __typename: string;
}
export interface ProductsResponse {
    getProducts: ProductsResult;
}
export interface CustomersResponse {
    customers: Customer[];
}
export interface SalesmenResponse {
    salesmen: Salesman[];
}
export interface CompaniesResponse {
    companies: Company[];
}
export interface LoginResponse {
    login: { token: string; user: User } | null;
}
export interface LoginVariables {
    userName: string;
    password: string;
    companyId: string;
}
export interface Order {
    order_id: string;
    order_no: string;
    order_date: string;
    client_id: string;
    client_name: string;
    salesman_name: string;
    line_items_total: number | null;
    no_of_line_items: number;
    vat_amount: number | null;
    net_amount: number | null;
    delivery_required: string;
    payment_mode: string;
    comments: string;
    created_by: string;
    created_on: string;
    modified_by: string | null;
    modified_on: string | null;
    deleted_by: string | null;
    deleted_on: string | null;
    __typename: string;
}
export interface OrdersResult {
    totalCount: number;
    orders: Order[];
    __typename: string;
}
export interface OrdersResponse {
    getOrders: OrdersResult;
}
export interface AddOrderResponse {
    addOrder: {
        status: string;
        message: string;
        orders: {
            order_no: string;
            order_date: string;
            payment_mode: string;
            created_by: string;
            created_on: string;
            __typename: string;
        };
        __typename: string;
    };
}
export interface AddOrderVariables {
    clientId: string;
    salesmanId: string;
    orderDate?: string;
    deliveryRequired?: string;
    paymentMode?: string;
    comments?: string;
}
export interface UpdateOrderResponse {
    updateOrder: {
        status: string;
        message: string;
        orders: { order_date: string; order_no: string; __typename: string };
        __typename: string;
    };
}
export interface UpdateOrderVariables {
    orderId: string;
    clientId?: string;
    salesmanId?: string;
    orderDate?: string;
    deliveryRequired?: string;
    paymentMode?: string;
    comments?: string;
}
export interface DeleteOrderResponse {
    deleteOrder: { status: string; message: string; __typename: string };
}
export interface DeleteOrderVariables {
    orderId: string;
}
export interface GetProductsResponse {
    products: {
        id: string;
        product_code: string;
        product_name: string;
        category: string;
        brand: string;
        packing: string;
        price: number;
        vat_percent: number;
        stock_available: boolean;
    }[];
}
export interface AddOrderItemResponse {
    addOrderItem: {
        status: string;
        message: string;
        orderItem: {
            id: string;
            order_id: string;
            product_id: string;
            vat_amount: number;
            price: number;
            __typename: string;
        };
        __typename: string;
    };
}
export interface AddOrderItemVariables {
    orderId: string;
    productId: string;
    packing?: string;
    price?: number;
    qty?: number;
    vatPerc?: number;
}
export interface UpdateOrderItemResponse {
    updateOrderItem: {
        status: string;
        message: string;
        orderItem: { id: string; order_id: string; product_id: string; __typename: string };
        __typename: string;
    };
}
export interface UpdateOrderItemVariables {
    orderId: string;
    itemId: string;
    productId?: string;
    packing?: string;
    price?: number;
    qty?: number;
    vatPerc?: number;
}
export interface DeleteOrderItemResponse {
    deleteOrderItem: { status: string; message: string; __typename: string };
}
export interface DeleteOrderItemVariables {
    orderId: string;
    itemId: string;
}

interface OrderItem {
    id: string;
    product_id: string;
    product_name: string;
    packing: string;
    price: number;
    qty: number;
    line_total: number;
    vat_perc: number;
    vat_amount: number;
    net_amount: number;
}

interface NewItemFormValues {
    itemNo: string;
    productName: string;
    packing: string;
    price: number;
    quantity: number;
    vatPercent: number;
    category: string;
    brand: string;
    costPrice: number;
    stock: number;
}

// Updated GET_ORDER_ITEMS_QUERY
const GET_ORDER_ITEMS_QUERY = gql`
    query OrderItems($orderId: ID!) {
        orderItems(orderId: $orderId) {
            id
            product_id
            product_name
            packing
            price
            qty
            line_total
            vat_perc
            vat_amount
            net_amount
            __typename
        }
    }
`;

const GET_PRODUCTS_QUERY = gql`
    query GetProducts($limit: Int, $offset: Int, $filters: ProductFilters) {
        getProducts(limit: $limit, offset: $offset, filters: $filters) {
            products {
                prod_code
                stock_available
                unit_price
                product_name
            }
        }
    }
`;

const ADD_ORDER_ITEM_MUTATION = gql`
    mutation AddOrderItem(
        $orderId: String!
        $productId: String!
        $packing: String
        $price: Float
        $qty: Float
        $vatPerc: Float
    ) {
        addOrderItem(
            orderId: $orderId
            productId: $productId
            packing: $packing
            price: $price
            qty: $qty
            vatPerc: $vatPerc
        ) {
            status
            message
            orderItem {
                id
                order_id
                product_id
                vat_amount
                price
                __typename
            }
            __typename
        }
    }
`;

const UPDATE_ORDER_ITEM_MUTATION = gql`
    mutation UpdateOrderItem(
        $orderId: String!
        $itemId: String!
        $productId: String
        $packing: String
        $price: Float
        $qty: Float
        $vatPerc: Float
    ) {
        updateOrderItem(
            orderId: $orderId
            itemId: $itemId
            productId: $productId
            packing: $packing
            price: $price
            qty: $qty
            vatPerc: $vatPerc
        ) {
            status
            message
            orderItem {
                id
                order_id
                product_id
                __typename
            }
            __typename
        }
    }
`;

const DELETE_ORDER_ITEM_MUTATION = gql`
    mutation DeleteOrderItem($orderId: String!, $itemId: String!) {
        deleteOrderItem(orderId: $orderId, itemId: $itemId) {
            status
            message
            __typename
        }
    }
`;

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
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const orderData = location.state as { clientName: string; orderNo: string } | null;
    const [items, setItems] = useState<OrderItem[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
    const [newItem, setNewItem] = useState<NewItemFormValues>({
        itemNo: '',
        productName: '',
        packing: '',
        price: 0,
        quantity: 0,
        vatPercent: 0,
        category: '',
        brand: '',
        costPrice: 0,
        stock: 0,
    });

    const {
        data: orderItemsData,
        loading,
        error,
        refetch,
    } = useQuery<{
        orderItems: OrderItem[];
    }>(GET_ORDER_ITEMS_QUERY, {
        variables: { orderId: id },
        skip: !id,
    });

    const { data: productsData } = useQuery<ProductsResponse>(GET_PRODUCTS_QUERY, {
        variables: { limit: 100, offset: 0, filters: {} },
    });
    const products = productsData?.getProducts?.products || [];

    useEffect(() => {
        if (loading) return;
        if (error) {
            console.error('Error fetching order items:', error.message);
            return;
        }
        if (orderItemsData?.orderItems) {
            setItems(orderItemsData.orderItems);
        }
    }, [orderItemsData, loading, error]);

    const [addOrderItem] = useMutation<AddOrderItemResponse, AddOrderItemVariables>(
        ADD_ORDER_ITEM_MUTATION
    );
    const [updateOrderItem] = useMutation<UpdateOrderItemResponse, UpdateOrderItemVariables>(
        UPDATE_ORDER_ITEM_MUTATION
    );
    const [deleteOrderItem] = useMutation<DeleteOrderItemResponse, DeleteOrderItemVariables>(
        DELETE_ORDER_ITEM_MUTATION
    );

    const columns: ColumnDef<OrderItem>[] = useMemo(
        () => [
            { accessorKey: 'product_id', header: 'Item No', id: 'product_id' },
            { accessorKey: 'product_name', header: 'Product Name', id: 'product_name' },
            { accessorKey: 'packing', header: 'Packing', id: 'packing' },
            { accessorKey: 'price', header: 'Price', id: 'price' },
            { accessorKey: 'qty', header: 'Quantity', id: 'qty' },
            { accessorKey: 'line_total', header: 'Line Total', id: 'line_total' },
            { accessorKey: 'vat_perc', header: 'VAT %', id: 'vat_perc' },
            { accessorKey: 'vat_amount', header: 'VAT Amount', id: 'vat_amount' },
            { accessorKey: 'net_amount', header: 'Net Amount', id: 'net_amount' },
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
                                        setSelectedItem(row.original);
                                        const prod = products.find(
                                            (p) => p.product_name === row.original.product_name
                                        );
                                        setNewItem({
                                            itemNo: row.original.product_id,
                                            productName: row.original.product_name,
                                            packing: row.original.packing || '',
                                            price: row.original.price,
                                            quantity: row.original.qty,
                                            vatPercent: row.original.vat_perc,
                                            category: prod?.prod_cat || '',
                                            brand: prod?.brand || '',
                                            costPrice: prod?.cost_price || 0,
                                            stock: prod?.stock_available || 0,
                                        });
                                        setEditDialogOpen(true);
                                    }}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Item</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Select Product *
                                        </label>
                                        <Select
                                            value={newItem.productName}
                                            onValueChange={(value) => {
                                                const prod = products.find(
                                                    (p) => p.product_name === value
                                                );
                                                if (prod) {
                                                    setNewItem({
                                                        ...newItem,
                                                        itemNo: prod.prod_code,
                                                        productName: prod.product_name,
                                                        packing: prod.packing || '',
                                                        price: prod.unit_price,
                                                        vatPercent: prod.vat_perc || 0,
                                                        category: prod.prod_cat || '',
                                                        brand: prod.brand || '',
                                                        costPrice: prod.cost_price || 0,
                                                        stock: prod.stock_available,
                                                    });
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((prod) => (
                                                    <SelectItem
                                                        key={prod.prod_code}
                                                        value={prod.product_name}
                                                    >
                                                        {prod.product_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Product ID
                                            </label>
                                            <Input value={newItem.itemNo} disabled />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Packing
                                            </label>
                                            <Input
                                                value={newItem.packing}
                                                onChange={(e) =>
                                                    setNewItem({
                                                        ...newItem,
                                                        packing: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Unit Price
                                            </label>
                                            <Input
                                                type="number"
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
                                            <Input value={newItem.costPrice} disabled />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                VAT Percentage
                                            </label>
                                            <Input
                                                type="number"
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
                                            <Input value={newItem.category} disabled />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Brand
                                            </label>
                                            <Input value={newItem.brand} disabled />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Stock Available
                                            </label>
                                            <Input value={newItem.stock} disabled />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Quantity *
                                            </label>
                                            <Input
                                                type="number"
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
                                            onClick={() => {
                                                setEditDialogOpen(false);
                                                setSelectedItem(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-purple-600 text-white"
                                            onClick={() => {
                                                if (selectedItem && id) {
                                                    updateOrderItem({
                                                        variables: {
                                                            orderId: id,
                                                            itemId: selectedItem.id,
                                                            productId: newItem.itemNo,
                                                            packing: newItem.packing,
                                                            price: newItem.price,
                                                            qty: newItem.quantity,
                                                            vatPerc: newItem.vatPercent,
                                                        },
                                                    })
                                                        .then(() => {
                                                            setEditDialogOpen(false);
                                                            setSelectedItem(null);
                                                            refetch();
                                                        })
                                                        .catch((err) =>
                                                            console.error('Update error:', err)
                                                        );
                                                }
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSelectedItem(row.original);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Item</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete the item "
                                        {selectedItem?.product_name}"? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDeleteDialogOpen(false);
                                            setSelectedItem(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (selectedItem && id) {
                                                setItems((prev) =>
                                                    prev.filter(
                                                        (item) => item.id !== selectedItem.id
                                                    )
                                                );
                                                deleteOrderItem({
                                                    variables: {
                                                        orderId: id,
                                                        itemId: selectedItem.id,
                                                    },
                                                })
                                                    .then(() => refetch())
                                                    .catch((err) =>
                                                        console.error('Delete error:', err)
                                                    )
                                                    .finally(() => {
                                                        setDeleteDialogOpen(false);
                                                        setSelectedItem(null);
                                                    });
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                ),
            },
        ],
        [items, editDialogOpen, deleteDialogOpen, products, selectedItem, newItem, id]
    );

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

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
        XLSX.writeFile(wb, `order_items_${id}.xlsx`);
    };

    const handleDownloadInvoice = () => {
        if (!items.length) {
            console.warn('No items to include in the invoice');
            return;
        }
        const doc = new jsPDF();
        doc.setFillColor(124, 58, 237); // bg-purple-600
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text(`Invoice - Order #${id}`, 10, 12);
        autoTable(doc, {
            startY: 30,
            head: [
                [
                    'Item No',
                    'Product Name',
                    'Packing',
                    'Price',
                    'Quantity',
                    'Line Total',
                    'VAT %',
                    'VAT Amount',
                    'Net Amount',
                ],
            ],
            body: items.map((item) => [
                item.product_id,
                item.product_name,
                item.packing,
                item.price.toFixed(2),
                item.qty,
                item.line_total.toFixed(2),
                item.vat_perc.toFixed(2),
                item.vat_amount.toFixed(2),
                item.net_amount.toFixed(2),
            ]),
            theme: 'striped',
            headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255] },
            styles: { cellPadding: 2, fontSize: 10 },
        });
        const finalY = (doc as any).lastAutoTable.finalY || 30;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total: ${totalAmount.toLocaleString()}`, 10, finalY + 10);
        doc.setFillColor(22, 163, 74); // bg-green-600
        doc.rect(0, 287, 210, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Generated on ' + new Date().toLocaleDateString(), 10, 293);
        doc.save(`invoice_${id}.pdf`);
    };

    const handleAddSave = async () => {
        const selectedProduct = products.find((p) => p.product_name === newItem.productName);
        if (
            selectedProduct &&
            newItem.quantity > 0 &&
            selectedProduct.stock_available >= newItem.quantity
        ) {
            const newItemData = {
                id: crypto.randomUUID(),
                product_id: selectedProduct.prod_code,
                product_name: selectedProduct.product_name,
                packing: selectedProduct.packing || '',
                price: selectedProduct.unit_price,
                qty: newItem.quantity,
                line_total: selectedProduct.unit_price * newItem.quantity,
                vat_perc: selectedProduct.vat_perc || 0,
                vat_amount:
                    (selectedProduct.unit_price *
                        newItem.quantity *
                        (selectedProduct.vat_perc || 0)) /
                    100,
                net_amount:
                    selectedProduct.unit_price *
                    newItem.quantity *
                    (1 + (selectedProduct.vat_perc || 0) / 100),
            };
            setItems((prev) => [...prev, newItemData]);
            try {
                const response = await addOrderItem({
                    variables: {
                        orderId: id || '',
                        productId: newItem.itemNo,
                        packing: selectedProduct.packing || '',
                        price: selectedProduct.unit_price,
                        qty: newItem.quantity,
                        vatPerc: selectedProduct.vat_perc || 0,
                    },
                });
                if (response.data?.addOrderItem?.status === 'success') {
                    refetch();
                } else {
                    console.error('Failed to add item:', response.data?.addOrderItem?.message);
                    setItems((prev) => prev.filter((item) => item.id !== newItemData.id)); // Rollback on failure
                }
            } catch (err) {
                console.error('Error adding item:', err);
                setItems((prev) => prev.filter((item) => item.id !== newItemData.id)); // Rollback on error
            }
            setAddDialogOpen(false);
            setNewItem({
                itemNo: '',
                productName: '',
                packing: '',
                price: 0,
                quantity: 0,
                vatPercent: 0,
                category: '',
                brand: '',
                costPrice: 0,
                stock: 0,
            });
        }
    };

    const totalAmount = items.reduce((sum, item) => sum + item.net_amount, 0);

    return (
        <BaseLayout title="Orders" description="Manage your orders here">
            <div className="flex flex-col gap-4">
                <div className="p-4 bg-gray-100 border-b">
                    <div className="text-lg font-semibold text-gray-800">
                        Client Name: {orderData?.clientName || 'N/A'} | Order No:{' '}
                        {orderData?.orderNo || 'N/A'}
                    </div>
                </div>
                <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12"></div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToHorizontalAxis]}
                    onDragEnd={handleDragEnd}
                >
                    <div className="p-4">
                        {loading && <div>Loading...</div>}
                        {error && <div>Error: {error.message}</div>}
                        {!loading && !error && (
                            <>
                                <div className="mb-4 justify-start flex gap-4">
                                    <Button variant="outline" onClick={() => window.history.back()}>
                                        Back Page
                                    </Button>
                                    <div className="relative flex-1 max-w-sm ml-2">
                                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search..."
                                            value={globalFilter ?? ''}
                                            onChange={(event) =>
                                                setGlobalFilter(String(event.target.value))
                                            }
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 mb-4">
                                    <Button
                                        className="bg-green-600 text-white"
                                        onClick={handleExport}
                                    >
                                        <Download className="mr-2 h-4 w-4" /> Export to Excel
                                    </Button>
                                    <Button
                                        className="bg-green-600 text-white"
                                        onClick={handleDownloadInvoice}
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
                                                    <Select
                                                        onValueChange={(value) => {
                                                            const prod = products.find(
                                                                (p) => p.product_name === value
                                                            );
                                                            if (prod) {
                                                                setNewItem({
                                                                    ...newItem,
                                                                    itemNo: prod.prod_code,
                                                                    productName: prod.product_name,
                                                                    packing: prod.packing || '',
                                                                    price: prod.unit_price,
                                                                    quantity: newItem.quantity,
                                                                    vatPercent: prod.vat_perc || 0,
                                                                    category: prod.prod_cat || '',
                                                                    brand: prod.brand || '',
                                                                    costPrice: prod.cost_price || 0,
                                                                    stock: prod.stock_available,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select product" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {products.map((prod) => (
                                                                <SelectItem
                                                                    key={prod.prod_code}
                                                                    value={prod.product_name}
                                                                >
                                                                    {prod.product_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Product ID
                                                        </label>
                                                        <Input value={newItem.itemNo} disabled />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Packing
                                                        </label>
                                                        <Input value={newItem.packing} disabled />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Unit Price
                                                        </label>
                                                        <Input value={newItem.price} disabled />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Cost Price
                                                        </label>
                                                        <Input value={newItem.costPrice} disabled />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            VAT Percentage
                                                        </label>
                                                        <Input
                                                            value={newItem.vatPercent}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Category
                                                        </label>
                                                        <Input value={newItem.category} disabled />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Brand
                                                        </label>
                                                        <Input value={newItem.brand} disabled />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Stock Available
                                                        </label>
                                                        <Input disabled value={newItem.stock} />
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
                                                                    quantity: Number(
                                                                        e.target.value
                                                                    ),
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
                                                            <DraggableTableHeader
                                                                key={header.id}
                                                                header={header}
                                                            />
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
                                                                    : columns.map(
                                                                          (col) => col.id || ''
                                                                      )
                                                            }
                                                            strategy={horizontalListSortingStrategy}
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <DragAlongCell
                                                                    key={cell.id}
                                                                    cell={cell}
                                                                />
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
                                    <strong>Total: {totalAmount.toLocaleString()}</strong>
                                </div>
                            </>
                        )}
                    </div>
                </DndContext>
            </div>
        </BaseLayout>
    );
}
