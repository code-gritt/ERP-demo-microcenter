export interface Company {
    company_id: string;
    company_name: string;
}

export interface User {
    user_id: string;
    user_name: string;
    designation: string;
    company_name: string;
    email_id: string;
    mobile_no: string;
}

export interface Salesman {
    sm_code: string;
    sm_name: string;
    __typename: string;
}

export interface Customer {
    cu_code: string;
    cu_name: string;
    address: string;
    email_id: string;
    __typename: string;
}

export interface CustomersResponse {
    customers: Customer[];
}

export interface SalesmenResponse {
    salesmen: Salesman[];
}

export interface CompaniesResponse {
    companies: Company[];
}

export interface LoginResponse {
    login: {
        token: string;
        user: User;
    } | null;
}
