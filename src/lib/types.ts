// src/lib/types.ts
export interface Company {
    company_id: string;
    company_name: string;
    __typename: string;
}

export interface User {
    user_id: string;
    user_name: string;
    designation: string;
    company_name: string;
    email_id: string;
    mobile_no: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface GetCompaniesResponse {
    companies: Company[];
}
