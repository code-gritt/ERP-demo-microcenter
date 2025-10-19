// CustomersPage.tsx
'use client';

import { useState } from 'react';
import { BaseLayout } from '@/components/layouts/base-layout';
import initialUsersData from './data.json';
import { DataTable } from './components/data-table';

// Use a single User type everywhere
export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
    plan: string;
    billing: string;
    status: string;
    joinedDate: string;
    lastLogin: string;
    address: string;
}

export default function CustomersPage() {
    const [users, setUsers] = useState<User[]>(initialUsersData);

    return (
        <BaseLayout title="Customers" description="Manage your customers here">
            <div className="flex flex-col gap-4">
                <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
                    <DataTable users={users} />
                </div>
            </div>
        </BaseLayout>
    );
}
