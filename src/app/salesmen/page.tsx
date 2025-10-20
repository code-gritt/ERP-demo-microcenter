'use client';

import { useQuery } from '@apollo/client/react';
import { BaseLayout } from '@/components/layouts/base-layout';
import { DataTable } from './components/data-table';
import { GET_SALESMEN_QUERY } from '@/lib/queries';
import type { SalesmenResponse } from '@/lib/types';
import { LoaderSpinner } from '@/components/ui/Loader';

interface SalesmanTable {
    id: string;
    name: string;
    sm_code: string;
    avatar: string;
    email: string;
}

export default function SalesmenPage() {
    const { data, loading, error } = useQuery<SalesmenResponse>(GET_SALESMEN_QUERY);

    const generateAvatar = (name: string) => {
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const salesmen: SalesmanTable[] =
        data?.salesmen?.map((salesman) => ({
            id: salesman.sm_code,
            name: salesman.sm_name,
            sm_code: salesman.sm_code,
            avatar: generateAvatar(salesman.sm_name),
            email: `${salesman.sm_name.toLowerCase().replace(' ', '.')}@company.com`,
        })) || [];

    if (loading) {
        return (
            <BaseLayout title="Salesmen" description="Manage your salesmen here">
                <LoaderSpinner />
            </BaseLayout>
        );
    }

    if (error) {
        return (
            <BaseLayout title="Salesmen" description="Manage your salesmen here">
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500">Error loading salesmen: {error.message}</div>
                </div>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout title="Salesmen" description="Manage your salesmen here">
            <div className="flex flex-col gap-4">
                <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
                    <DataTable users={salesmen} loading={loading} />
                </div>
            </div>
        </BaseLayout>
    );
}
