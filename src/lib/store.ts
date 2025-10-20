import { create } from 'zustand';

export interface User {
    user_id: string;
    user_name: string;
    designation: string;
    company_name: string;
    email_id: string;
    mobile_no: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const saved = localStorage.getItem('auth-storage');
const initialState = saved
    ? { ...JSON.parse(saved), isAuthenticated: true }
    : { token: null, user: null, isAuthenticated: false };

export const useAuthStore = create<AuthState>((set) => ({
    ...initialState,
    login: (token, user) => {
        const state = { token, user, isAuthenticated: true };
        set(state);
        localStorage.setItem('auth-storage', JSON.stringify(state));
    },
    logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
    },
}));
