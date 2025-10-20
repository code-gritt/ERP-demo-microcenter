'use client';

import { useQuery } from '@apollo/client/react';
import { BaseLayout } from '@/components/layouts/base-layout';
import { DataTable } from './components/data-table';
import { GET_CUSTOMERS_QUERY } from '@/lib/queries';
import type { CustomersResponse } from '@/lib/types';
import { LoaderSpinner } from '@/components/ui/Loader';

interface CustomerTable {
    id: string;
    name: string;
    address: string;
    email: string;
    avatar: string;
}

export default function CustomersPage() {
    const { data, loading, error } = useQuery<CustomersResponse>(GET_CUSTOMERS_QUERY);

    // Generate avatar initials from name
    const generateAvatar = (name: string) => {
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Map query data to CustomerTable format
    const customers: CustomerTable[] =
        data?.customers?.map((customer) => ({
            id: customer.cu_code,
            name: customer.cu_name,
            address: customer.address,
            email: customer.email_id,
            avatar: generateAvatar(customer.cu_name),
        })) || [];

    // Render loading state with LoaderSpinner
    if (loading) {
        return (
            <BaseLayout title="Customers" description="Manage your customers here">
                <LoaderSpinner />
            </BaseLayout>
        );
    }

    // Render error state
    if (error) {
        return (
            <BaseLayout title="Customers" description="Manage your customers here">
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500">Error loading customers: {error.message}</div>
                </div>
            </BaseLayout>
        );
    }

    // Render data table
    return (
        <BaseLayout title="Customers" description="Manage your customers here">
            <div className="flex flex-col gap-4">
                <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
                    <DataTable users={customers} />
                </div>
            </div>
        </BaseLayout>
    );
}
