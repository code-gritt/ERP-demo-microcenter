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

export const GET_ORDERS_QUERY = gql`
    query GetOrders($limit: Int, $offset: Int, $filters: OrderFilters) {
        getOrders(limit: $limit, offset: $offset, filters: $filters) {
            totalCount
            orders {
                order_id
                order_no
                order_date
                client_id
                client_name
                salesman_id
                salesman_name
                line_items_total
                no_of_line_items
                vat_amount
                net_amount
                delivery_required
                payment_mode
                comments
                created_by
                created_on
                modified_by
                modified_on
                deleted_by
                deleted_on
                __typename
            }
            __typename
        }
    }
`;


