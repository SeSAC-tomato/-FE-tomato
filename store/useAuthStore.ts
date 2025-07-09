import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
    id: number;
    nickname: string;
    address: string;
    email: string;
    // 필요하다면 추가 정보
}

interface TestUser {
    email: string;
    userId: number;
    nickname: string;
}

interface AuthState {
    testUser: TestUser | null;
    user: User | null;
    isLoggedIn: boolean;
    accessToken: string | null;
    isInitialized: boolean;
    login: (user: User, accessToken: string) => void;
    logout: () => void;
    setInitialized: () => void;
    setTestUser: (testUser: TestUser) => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            testUser: null,
            user: null,
            isLoggedIn: false,
            accessToken: null,
            isInitialized: false,
            login: (user, accessToken) =>
                set({ user, isLoggedIn: true, accessToken }),
            logout: () => set({ user: null, isLoggedIn: false, accessToken: null }),
            setInitialized: () => set({ isInitialized: true }),
            setTestUser: (testUser) => set({ testUser }),
            setUser: (user) => set({ user }),
        }),
        {
            name: "auth-session-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);