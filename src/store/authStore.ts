import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authService, RegisterData, LoginData } from "@/services/auth.service";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isSuspended?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(data);
          
          if (response.user.role !== 'ADMIN') {
             throw new Error('Access denied. Admin privileges required.');
          }

          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.token);
          }

          set({
            user: response.user,
            token: response.token,
            isLoading: false,
          });

        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);

          if (typeof window !== "undefined") {
            localStorage.setItem("token", response.token);
          }

          set({
            user: response.user,
            token: response.token,
            isLoading: false,
          });

        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("admin-auth-storage");
          sessionStorage.clear();
        }

        set({ user: null, token: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
