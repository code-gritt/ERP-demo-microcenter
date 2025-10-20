'use client';

import { useQuery } from '@apollo/client/react';
import { BaseLayout } from '@/components/layouts/base-layout';
import { ProductsTable } from './components/data-table';
import { GET_PRODUCTS_QUERY } from '@/lib/queries';
import type { ProductsResponse } from '@/lib/types';
import { LoaderSpinner } from '@/components/ui/Loader';

export interface ProductTable {
    id: string;
    code: string;
    name: string;
    category: string;
    brand: string;
    unitPrice: number;
    costPrice: number;
    stocksAvailable: number;
    packing: string;
    vatPerc: number;
}

export default function ProductsPage() {
    const PAGE_SIZE = 10;
    const { data, loading, error, refetch } = useQuery<ProductsResponse>(GET_PRODUCTS_QUERY, {
        variables: {
            limit: PAGE_SIZE,
            offset: 0,
            filters: { filters: [] },
        },
    });

    // Transform API data to table format
    const products: ProductTable[] =
        data?.getProducts?.products?.map((product) => ({
            id: product.prod_code,
            code: product.prod_code,
            name: product.product_name,
            category: product.prod_cat,
            brand: product.brand,
            unitPrice: product.unit_price,
            costPrice: product.cost_price,
            stocksAvailable: product.stock_available,
            packing: product.packing,
            vatPerc: product.vat_perc,
        })) || [];

    const totalCount = data?.getProducts?.totalCount || 0;

    if (loading) {
        return (
            <BaseLayout title="Products" description="Manage your products here">
                <LoaderSpinner />
            </BaseLayout>
        );
    }

    if (error) {
        return (
            <BaseLayout title="Products" description="Manage your products here">
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500">Error loading products: {error.message}</div>
                </div>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout title="Products" description="Manage your products here">
            <div className="flex flex-col gap-4">
                <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
                    <ProductsTable
                        products={products}
                        totalCount={totalCount}
                        pageSize={PAGE_SIZE}
                        onPageChange={(offset) => {
                            refetch({
                                limit: PAGE_SIZE,
                                offset,
                                filters: { filters: [] },
                            });
                        }}
                    />
                </div>
            </div>
        </BaseLayout>
    );
}
