import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Check if token exists in localStorage even if isAuthenticated is false
  const hasToken = !!localStorage.getItem("accessToken");

  console.log("ProtectedRoute state:", {
    isAuthenticated,
    isLoading,
    hasToken,
    currentPath: location.pathname,
    userRole: user?.role,
  });

  if (isLoading) {
    // Show a loading spinner while authentication state is being determined
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If we have a token but isAuthenticated is false, it might be that the user state
  // hasn't been set yet, so we'll show a loading state instead of redirecting
  if (hasToken && !isAuthenticated) {
    console.log("Has token but not authenticated yet, showing loading");
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user role doesn't match, redirect to dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log("User doesn't have required role, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
