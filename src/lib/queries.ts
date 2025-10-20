import { gql } from '@apollo/client';

export const GET_COMPANIES_QUERY = gql`
    query GetCompanies {
        companies {
            company_id
            company_name
        }
    }
`;
