// src/store/auth.ts
import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  token?: string | null;
  login: (payload?: { token?: string; user?: any }) => void;
  logout: () => void;
  register: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  login: (payload?: { token?: string; user?: any }) =>
    set({
      isLoggedIn: true,
      user: payload?.user ?? null,
      token: payload?.token ?? localStorage.getItem("accessToken"),
    }),
  logout: () =>
    set(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return { isLoggedIn: false, user: null, token: null };
    }),
  register: () => set({ isLoggedIn: true }),
}));
