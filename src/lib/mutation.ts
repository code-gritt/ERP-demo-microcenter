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
