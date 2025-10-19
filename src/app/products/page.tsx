'use client';

import { useState } from 'react';
import { BaseLayout } from '@/components/layouts/base-layout';
import initialProductsData from './data.json';
import { ProductsTable } from './components/data-table';

export interface Product {
    id: number;
    code: string;
    name: string;
    category: string;
    brand: string;
    unitPrice: number;
    costPrice: number;
    stocksAvailable: number;
}

export interface ProductFormValues {
    code: string;
    name: string;
    category: string;
    brand: string;
    unitPrice: number;
    costPrice: number;
    stocksAvailable: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(initialProductsData);

    const handleAddProduct = (productData: ProductFormValues) => {
        const newProduct: Product = {
            id: Math.max(...products.map((p) => p.id)) + 1,
            ...productData,
        };
        setProducts((prev) => [newProduct, ...prev]);
    };

    const handleDeleteProduct = (id: number) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const handleEditProduct = (product: Product) => {
        console.log('Edit product:', product);
    };

    return (
        <BaseLayout title="Products" description="Manage your products here">
            <div className="flex flex-col gap-4">
                <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
                    <ProductsTable
                        products={products}
                        onAddProduct={handleAddProduct}
                        onEditProduct={handleEditProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                </div>
            </div>
        </BaseLayout>
    );
}
