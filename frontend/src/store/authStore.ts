import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

type Role = "client" | "freelancer" | "admin";

interface User {
  id: number;
  email: string;
  role: Role;
  name: string;
  createdAt?: string;
  profileImage?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (accessToken: string, refreshToken: string) => {
        try {
          const decoded = jwtDecode<any>(accessToken);
          set({
            accessToken,
            refreshToken,
            user: {
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
              name: decoded.name || "User",
              createdAt: decoded.createdAt,
            },
          });
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      isAuthenticated: () => {
        const { accessToken } = get();
        if (!accessToken) return false;

        try {
          const decoded = jwtDecode<any>(accessToken);
          const currentTime = Date.now() / 1000;
          return decoded.exp > currentTime;
        } catch (error) {
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
