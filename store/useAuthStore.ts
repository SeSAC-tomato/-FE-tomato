import { create } from "zustand";

interface User {
  email: string;
  // 필요하다면 추가 정보
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  isInitialized: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  accessToken: null,
  isInitialized: false,
  login: (user, accessToken) => set({ user, isLoggedIn: true, accessToken }),
  logout: () => set({ user: null, isLoggedIn: false, accessToken: null }),
  setInitialized: () => set({ isInitialized: true }),
}));
