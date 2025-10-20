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
            }
        }
    }
`;
