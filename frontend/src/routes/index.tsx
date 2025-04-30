// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getRoutes } from "./routeConfig";

export const AppRouter = () => {
  // Use the useAuth hook to get the user role
  const { user } = useAuth();

  // Get the routes configuration with the user role
  const routes = getRoutes(user?.role);

  // Create the router with the routes
  const router = createBrowserRouter(routes);

  // Return the router provider
  return <RouterProvider router={router} />;
};
