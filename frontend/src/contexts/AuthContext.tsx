import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserRole } from "../types";
import { authService, userService } from "../services";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      console.log("Initializing auth, token exists:", !!token);

      if (token) {
        try {
          console.log("Attempting to fetch user profile with token");
          const userData = await userService.getProfile();
          console.log("User profile fetched successfully:", userData);
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);

          // Try to extract user info from the token
          try {
            // Decode the JWT token to get the payload
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("Decoded token payload:", payload);

            if (payload.sub && payload.email && payload.role) {
              // Create a minimal user object with the data from the token
              const minimalUser: User = {
                id: payload.sub,
                name: payload.email.split("@")[0], // Use part of email as name
                email: payload.email,
                role: payload.role,
                bio: null,
                profileImage: "",
                skills: [],
              };

              console.log("Created minimal user from token:", minimalUser);
              setUser(minimalUser);
            }
          } catch (decodeError) {
            console.error("Failed to decode token:", decodeError);
          }

          // Don't automatically remove tokens on error - this might be causing the loop
          // Only remove tokens if it's a 401 Unauthorized error
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log("Unauthorized error, removing tokens");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", email);
      const response = await authService.login({ email, password });
      console.log(
        "Login successful, received tokens:",
        !!response.accessToken,
        !!response.refreshToken
      );

      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Set the Authorization header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.accessToken}`;

      try {
        // Fetch user profile
        console.log("Fetching user profile after login");
        const userData = await userService.getProfile();
        console.log("User profile fetched successfully:", userData);

        // Update user state
        setUser(userData);

        return userData; // Return the user data for additional handling if needed
      } catch (profileError) {
        console.error(
          "Failed to fetch user profile after login:",
          profileError
        );

        // Instead of creating a minimal user with a default role,
        // let's try to extract the role from the JWT token
        try {
          const token = localStorage.getItem("accessToken");
          if (token) {
            // Decode the JWT token to get the payload
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("Decoded token payload:", payload);

            // Create a minimal user object with the role from the token
            const minimalUser: User = {
              id: payload.sub || 0,
              name: email.split("@")[0], // Use part of email as name
              email: email,
              role: payload.role || "client", // Use role from token or default to client
              bio: null,
              profileImage: "",
              skills: [],
            };

            setUser(minimalUser);

            // Force a small delay to ensure state updates
            await new Promise((resolve) => setTimeout(resolve, 100));

            return minimalUser;
          }
        } catch (decodeError) {
          console.error("Failed to decode token:", decodeError);
        }

        // If we couldn't extract the role from the token, use a default
        const minimalUser: User = {
          id: 0,
          name: email.split("@")[0], // Use part of email as name
          email: email,
          role: "client", // Default role
          bio: null,
          profileImage: "",
          skills: [],
        };

        setUser(minimalUser);

        // Force a small delay to ensure state updates
        await new Promise((resolve) => setTimeout(resolve, 100));

        return minimalUser;
      }
    } catch (error) {
      console.error("Login process failed:", error);
      throw error; // Re-throw to allow handling in the component
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    try {
      console.log("Attempting to register user:", { name, email, role });
      const userData = await authService.register({
        name,
        email,
        password,
        role,
      });
      console.log("Registration successful:", userData);

      // Don't automatically login after registration
      // Let the user login manually to ensure they remember their credentials
      return userData;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; // Re-throw to allow handling in the component
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner or placeholder
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
