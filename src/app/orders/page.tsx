'use client';

import { useQuery } from '@apollo/client/react';
import { BaseLayout } from '@/components/layouts/base-layout';
import { OrdersTable } from './components/data-table';
import { GET_ORDERS_QUERY } from '@/lib/queries';
import { GET_CUSTOMERS_QUERY, GET_SALESMEN_QUERY } from '@/lib/queries';
import type { OrdersResponse, CustomersResponse, SalesmenResponse } from '@/lib/types';

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

export default function OrdersPage() {
    const PAGE_SIZE = 40;

    const {
        data: ordersData,
        loading: ordersLoading,
        refetch: refetchOrders,
    } = useQuery<OrdersResponse>(GET_ORDERS_QUERY, {
        variables: { filters: {}, offset: 0, limit: PAGE_SIZE },
    });

    const { data: customersData } = useQuery<CustomersResponse>(GET_CUSTOMERS_QUERY);
    const { data: salesmenData } = useQuery<SalesmenResponse>(GET_SALESMEN_QUERY);

    // Transform API data
    const orders: OrderTable[] =
        ordersData?.getOrders?.orders?.map((order) => ({
            id: order.order_id,
            orderNo: order.order_no,
            orderDate: new Date(order.order_date).toISOString().split('T')[0],
            clientId: order.client_id,
            clientName: order.client_name,
            salesmanId: order.salesman_id,
            salesmanName: order.salesman_name,
            lineItems: order.no_of_line_items,
            netAmount: order.net_amount,
            deliveryRequired: order.delivery_required === 'Y',
            paymentMode: order.payment_mode,
            comments: order.comments,
            createdBy: order.created_by,
            createdOn: order.created_on.split('T')[0],
            modifiedBy: order.modified_by,
            modifiedOn: order.modified_on ? order.modified_on.split('T')[0] : null,
        })) || [];

    const totalCount = ordersData?.getOrders?.totalCount || 0;
    const clients = customersData?.customers || [];
    const salesmen = salesmenData?.salesmen || [];

    if (ordersLoading) {
        return (
            <BaseLayout title="Orders" description="Manage your orders here">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading orders...</div>
                </div>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout title="Orders" description="Manage your orders here">
            <div className="flex flex-col gap-4">
                <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
                    <OrdersTable
                        orders={orders}
                        totalCount={totalCount}
                        clients={clients}
                        salesmen={salesmen}
                        pageSize={PAGE_SIZE}
                        refetchOrders={refetchOrders}
                        onPageChange={(offset) => {
                            refetchOrders({ filters: {}, offset, limit: PAGE_SIZE });
                        }}
                    />
                </div>
            </div>
        </BaseLayout>
    );
}
