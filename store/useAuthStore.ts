// import { create } from "zustand";
//
// interface User {
//   email: string;
//   // 필요하다면 추가 정보
// }
//
// interface AuthState {
//   user: User | null;
//   isLoggedIn: boolean;
//   accessToken: string | null;
//   isInitialized: boolean;
//   login: (user: User, accessToken: string) => void;
//   logout: () => void;
//   setInitialized: () => void;
// }
//
// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   isLoggedIn: false,
//   accessToken: null,
//   isInitialized: false,
//   login: (user, accessToken) => set({ user, isLoggedIn: true, accessToken }),
//   logout: () => set({ user: null, isLoggedIn: false, accessToken: null }),
//   setInitialized: () => set({ isInitialized: true }),
// }));


import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
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
        }),
        {
          name: 'auth-session-storage', // 세션스토리지에 저장될 key
          storage: createJSONStorage(() => sessionStorage), // 5.x 버전 방식!
        }
    )
);