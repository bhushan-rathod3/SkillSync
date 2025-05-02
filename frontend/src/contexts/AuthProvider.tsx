import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type Role = "client" | "freelancer";

type User = {
  id: number;
  email: string;
  role: Role;
  name: string;
  createdAt?: string;
  profileImage?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        // Verify token is valid and not expired
        const decoded = jwtDecode<any>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          // Token is expired
          console.log("Token expired, logging out");
          logout();
          return;
        }

        setAccessToken(token);
        // Extract user name from email if name is not provided
        const nameFromEmail = decoded.email ? decoded.email.split("@")[0] : "";
        const formattedName = nameFromEmail
          .split(/[._-]/)
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");

        setUser({
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name || formattedName || "User",
          createdAt: decoded.createdAt,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, []);

  const login = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setAccessToken(access);
    const decoded = jwtDecode<any>(access);
    const role = decoded.role;
    // Extract user name from email if name is not provided
    const nameFromEmail = decoded.email ? decoded.email.split("@")[0] : "";
    const formattedName = nameFromEmail
      .split(/[._-]/)
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    setUser({
      id: decoded.sub,
      email: decoded.email,
      role,
      name: decoded.name || formattedName || "User",
    });
    if (role === "client") navigate("/client/dashboard");
    else navigate("/freelancer/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
