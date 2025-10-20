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
