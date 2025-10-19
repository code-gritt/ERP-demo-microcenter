'use client';

import { useState } from 'react';
import { BaseLayout } from '@/components/layouts/base-layout';
import initialOrdersData from './data.json';
import { OrdersTable } from './components/data-table';

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

export interface OrderFormValues {
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

export default function ProductsPage() {
    const [orders, setOrders] = useState<Order[]>(initialOrdersData);

    const handleAddOrder = (orderData: OrderFormValues) => {
        const newOrder: Order = {
            id: Math.max(...orders.map((o) => o.id)) + 1,
            ...orderData,
            lineItems: 0,
            netAmount: 0,
            createdBy: 'User',
            createdOn: new Date().toISOString(),
            modifiedBy: 'User',
            modifiedOn: new Date().toISOString(),
        };
        setOrders((prev) => [newOrder, ...prev]);
    };

    const handleDeleteOrder = (id: number) => {
        setOrders((prev) => prev.filter((o) => o.id !== id));
    };

    const handleEditOrder = (updatedOrder: Order) => {
        setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    };

    return (
        <BaseLayout title="Orders" description="Manage your orders here">
            <div className="flex flex-col gap-4">
                <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
                    <OrdersTable
                        orders={orders}
                        onAddOrder={handleAddOrder}
                        onEditOrder={handleEditOrder}
                        onDeleteOrder={handleDeleteOrder}
                    />
                </div>
            </div>
        </BaseLayout>
    );
}
