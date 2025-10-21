import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load components for better performance
const Landing = lazy(() => import('@/app/landing/page'));
const Dashboard2 = lazy(() => import('@/app/dashboard-2/page'));
const Users = lazy(() => import('@/app/users/page'));
const FAQs = lazy(() => import('@/app/faqs/page'));
const Pricing = lazy(() => import('@/app/pricing/page'));
const Salesmen = lazy(() => import('@/app/salesmen/page'));
const Customers = lazy(() => import('@/app/customers/page'));
const Products = lazy(() => import('@/app/products/page'));
const Orders = lazy(() => import('@/app/orders/page'));
const OrderItems = lazy(() => import('@/app/orders/order-items/[id]/page'));

// Auth pages

const SignIn2 = lazy(() => import('@/app/auth/sign-in-2/page'));

// Error pages
const Unauthorized = lazy(() => import('@/app/errors/unauthorized/page'));
const Forbidden = lazy(() => import('@/app/errors/forbidden/page'));
const NotFound = lazy(() => import('@/app/errors/not-found/page'));
const InternalServerError = lazy(() => import('@/app/errors/internal-server-error/page'));
const UnderMaintenance = lazy(() => import('@/app/errors/under-maintenance/page'));

export interface RouteConfig {
    path: string;
    element: React.ReactNode;
    children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
    // Default route - redirect to dashboard
    // Use relative path "dashboard" instead of "/dashboard" for basename compatibility
    {
        path: '/',
        element: <Navigate to="/landing" replace />,
    },

    // Landing Page
    {
        path: '/landing',
        element: <Landing />,
    },

    // Dashboard Routes

    {
        path: '/dashboard-2',
        element: <Dashboard2 />,
    },

    // Application Routes
    {
        path: '/orders',
        element: <Orders />,
    },
    {
        path: '/order-items/:id',
        element: <OrderItems />,
    },
    {
        path: '/products',
        element: <Products />,
    },
    {
        path: '/customers',
        element: <Customers />,
    },
    {
        path: '/salesmen',
        element: <Salesmen />,
    },

    // Content Pages
    {
        path: '/users',
        element: <Users />,
    },
    {
        path: '/faqs',
        element: <FAQs />,
    },
    {
        path: '/pricing',
        element: <Pricing />,
    },

    // Authentication Routes

    {
        path: '/auth/sign-in-2',
        element: <SignIn2 />,
    },

    // Error Pages
    {
        path: '/errors/unauthorized',
        element: <Unauthorized />,
    },
    {
        path: '/errors/forbidden',
        element: <Forbidden />,
    },
    {
        path: '/errors/not-found',
        element: <NotFound />,
    },
    {
        path: '/errors/internal-server-error',
        element: <InternalServerError />,
    },
    {
        path: '/errors/under-maintenance',
        element: <UnderMaintenance />,
    },

    // Catch-all route for 404
    {
        path: '*',
        element: <NotFound />,
    },
];
