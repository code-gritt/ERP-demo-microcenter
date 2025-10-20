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
    initials?: string;
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

export interface Product {
    prod_code: string;
    product_name: string;
    brand: string;
    prod_cat: string;
    packing: string;
    unit_price: number;
    cost_price: number;
    vat_perc: number;
    stock_available: number;
    __typename: string;
}

export interface ProductsResult {
    products: Product[];
    totalCount: number;
    __typename: string;
}

export interface ProductsResponse {
    getProducts: ProductsResult;
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

export interface LoginVariables {
    userName: string;
    password: string;
    companyId: string;
}

export interface Order {
    order_id: string;
    order_no: string;
    order_date: string;
    client_id: string;
    client_name: string;
    salesman_id: string;
    salesman_name: string;
    line_items_total: number | null;
    no_of_line_items: number;
    vat_amount: number | null;
    net_amount: number | null;
    delivery_required: string;
    payment_mode: string;
    comments: string;
    created_by: string;
    created_on: string;
    modified_by: string | null;
    modified_on: string | null;
    deleted_by: string | null;
    deleted_on: string | null;
    __typename: string;
}

export interface OrdersResult {
    totalCount: number;
    orders: Order[];
    __typename: string;
}

export interface OrdersResponse {
    getOrders: OrdersResult;
}

export interface AddOrderResponse {
    addOrder: {
        status: string;
        message: string;
        orders: {
            order_no: string;
            order_date: string;
            payment_mode: string;
            created_by: string;
            created_on: string;
            __typename: string;
        };
        __typename: string;
    };
}

export interface AddOrderVariables {
    clientId: string;
    salesmanId: string;
    orderDate?: string;
    deliveryRequired?: string;
    paymentMode?: string;
    comments?: string;
}

// ADD THESE AT BOTTOM:
export interface UpdateOrderResponse {
    updateOrder: {
        status: string;
        message: string;
        orders: {
            order_date: string;
            order_no: string;
            __typename: string;
        };
        __typename: string;
    };
}

export interface UpdateOrderVariables {
    orderId: string;
    clientId?: string;
    salesmanId?: string;
    orderDate?: string;
    deliveryRequired?: string;
    paymentMode?: string;
    comments?: string;
}

export interface DeleteOrderResponse {
    deleteOrder: {
        status: string;
        message: string;
        __typename: string;
    };
}

export interface DeleteOrderVariables {
    orderId: string;
}

// ADD THESE AT BOTTOM:
export interface GetProductsResponse {
    products: {
        id: string;
        product_code: string;
        product_name: string;
        category: string;
        brand: string;
        packing: string;
        price: number;
        vat_percent: number;
        stock_available: boolean;
    }[];
}

export interface AddOrderItemResponse {
    addOrderItem: {
        status: string;
        message: string;
        orderItem: {
            id: string;
            order_id: string;
            product_id: string;
            vat_amount: number;
            price: number;
            __typename: string;
        };
        __typename: string;
    };
}

export interface AddOrderItemVariables {
    orderId: string;
    productId: string;
    packing?: string;
    price?: number;
    qty?: number;
    vatPerc?: number;
}
