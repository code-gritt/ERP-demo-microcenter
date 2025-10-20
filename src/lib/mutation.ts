import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
    mutation Login($userName: String!, $password: String!, $companyId: ID!) {
        login(user_name: $userName, password: $password, company_id: $companyId) {
            token
            user {
                user_id
                user_name
                designation
                company_name
                email_id
                mobile_no
                __typename
            }
            __typename
        }
    }
`;

export const ADD_ORDER_MUTATION = gql`
    mutation AddOrder(
        $clientId: String!
        $salesmanId: String!
        $orderDate: Date
        $deliveryRequired: String
        $paymentMode: String
        $comments: String
    ) {
        addOrder(
            clientId: $clientId
            salesmanId: $salesmanId
            orderDate: $orderDate
            deliveryRequired: $deliveryRequired
            paymentMode: $paymentMode
            comments: $comments
        ) {
            status
            message
            orders {
                order_no
                order_date
                payment_mode
                created_by
                created_on
                __typename
            }
            __typename
        }
    }
`;

export const UPDATE_ORDER_MUTATION = gql`
    mutation UpdateOrder(
        $orderId: String!
        $clientId: String
        $salesmanId: String
        $orderDate: Date
        $deliveryRequired: String
        $paymentMode: String
        $comments: String
    ) {
        updateOrder(
            orderId: $orderId
            clientId: $clientId
            salesmanId: $salesmanId
            orderDate: $orderDate
            deliveryRequired: $deliveryRequired
            paymentMode: $paymentMode
            comments: $comments
        ) {
            status
            message
            orders {
                order_date
                order_no
                __typename
            }
            __typename
        }
    }
`;

export const DELETE_ORDER_MUTATION = gql`
    mutation DeleteOrder($orderId: ID!) {
        deleteOrder(orderId: $orderId) {
            status
            message
            __typename
        }
    }
`;

// ADD THIS:
export const ADD_ORDER_ITEM_MUTATION = gql`
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
