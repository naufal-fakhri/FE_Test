import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RequestLogin } from "../../utils/api/LoginService/requestModel.ts";
import { LoginService } from "../../utils/api/LoginService";

const cookieStorage = {
  getItem: (name: string): string | null => {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return value ? decodeURIComponent(value.split("=")[1]) : null;
  },
  setItem: (name: string, value: string) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
  },
  removeItem: (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  },
};

const secureStorage = {
  getItem: (name: string): string | null => {
    if (name === "auth-storage") {
      const token = cookieStorage.getItem("auth-token");
      const userData = sessionStorage.getItem("auth-user");

      if (token && userData) {
        const user = JSON.parse(userData);
        return JSON.stringify({
          state: {
            user: {
              ...user,
              token: token,
            },
          },
        });
      }
    }
    return null;
  },
  setItem: (name: string, value: string) => {
    if (name === "auth-storage") {
      const data = JSON.parse(value);
      const user = data.state.user;

      if (user) {
        cookieStorage.setItem("auth-token", user.token);

        const userWithoutToken = {
          username: user.username,
          is_logged_in: user.is_logged_in,
        };
        sessionStorage.setItem("auth-user", JSON.stringify(userWithoutToken));
      }
    }
  },
  removeItem: (name: string) => {
    if (name === "auth-storage") {
      cookieStorage.removeItem("auth-token");
      sessionStorage.removeItem("auth-user");
    }
  },
};

interface AuthState {
  user: {
    username: string;
    token: string;
    is_logged_in: 0 | 1;
  } | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: RequestLogin) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: AuthState["user"]) => void;
  refreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (credentials: RequestLogin) => {
        set({ isLoading: true, error: null });
        try {
          const response = await LoginService(credentials);
          const data = response.data;

          if (data.status && data.is_logged_in === 1) {
            set({
              user: {
                username: credentials.username,
                token: data.token,
                is_logged_in: data.is_logged_in,
              },
              isLoading: false,
              error: null,
            });
          } else {
            set({
              user: null,
              isLoading: false,
              error: data.message || "Login failed",
            });
          }
        } catch (error: unknown) {
          let errorMessage = "General Error";

          if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            user: null,
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      logout: () => {
        cookieStorage.removeItem("auth-token");
        sessionStorage.removeItem("auth-user");

        set({
          user: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user) => {
        set({ user });
      },

      refreshToken: () => {
        return cookieStorage.getItem("auth-token");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
