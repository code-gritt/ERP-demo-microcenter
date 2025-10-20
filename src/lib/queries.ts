import { gql } from '@apollo/client';

export const GET_COMPANIES_QUERY = gql`
    query GetCompanies {
        companies {
            company_id
            company_name
        }
    }
`;

export const GET_SALESMEN_QUERY = gql`
    query GetSalesman {
        salesmen {
            sm_code
            sm_name
            __typename
        }
    }
`;

export const GET_CUSTOMERS_QUERY = gql`
    query GetCustomers {
        customers {
            cu_code
            cu_name
            address
            email_id
            __typename
        }
    }
`;

export const GET_PRODUCTS_QUERY = gql`
    query GetProducts($limit: Int!, $offset: Int!, $filters: ProductFilters) {
        getProducts(limit: $limit, offset: $offset, filters: $filters) {
            products {
                prod_code
                product_name
                brand
                prod_cat
                packing
                unit_price
                cost_price
                vat_perc
                stock_available
                __typename
            }
            totalCount
            __typename
        }
    }
`;
