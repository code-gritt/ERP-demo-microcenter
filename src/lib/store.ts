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

// ✅ Zustand store with manual persistence
export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,
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

// ✅ Load persisted state once at startup
const saved = localStorage.getItem('auth-storage');
if (saved) {
    try {
        const parsed = JSON.parse(saved);
        useAuthStore.setState(parsed);
    } catch {
        localStorage.removeItem('auth-storage');
    }
}
