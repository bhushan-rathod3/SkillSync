import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthAwareLayout } from "../components/layout/AuthAwareLayout";
import { DashboardLayout } from "../components/layout/DashboardLayout";

// Auth pages
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";

// Dashboard pages
import { Dashboard } from "../pages/dashboard/Dashboard";
import { ClientDashboard } from "../pages/dashboard/client/ClientDashboard";
import { FreelancerDashboard } from "../pages/dashboard/freelancer/FreelancerDashboard";

// Project pages
import { ProjectsList } from "../pages/projects/ProjectsList";
import { ProjectDetails } from "../pages/projects/ProjectDetails";
import { CreateProject } from "../pages/projects/CreateProject";

// Profile pages
import { ProfileView } from "../pages/profile/ProfileView";
import { ProfileEdit } from "../pages/profile/ProfileEdit";

// Messaging pages
import { ProjectMessages } from "../pages/messaging/ProjectMessages";

// Milestone pages
import { ProjectMilestones } from "../pages/milestones/ProjectMilestones";

// Component to redirect based on user role
const RoleSwitchDashboard = ({ userRole }: { userRole?: string }) => {
  if (userRole === "client") {
    return <ClientDashboard />;
  }
  return <FreelancerDashboard />;
};

// Create a function that returns the routes configuration
// This function takes the user role as a parameter
export const getRoutes = (userRole?: string) => [
  {
    path: "/",
    element: <AuthAwareLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <ProfileView />,
      },
      {
        path: "/profile/edit",
        element: <ProfileEdit />,
      },
      {
        path: "/projects",
        element: <ProjectsList />,
      },
      {
        path: "/projects/create",
        element: (
          <ProtectedRoute allowedRoles={["client"]}>
            <CreateProject />
          </ProtectedRoute>
        ),
      },
      {
        path: "/projects/:id",
        element: <ProjectDetails />,
      },
      {
        path: "/projects/:id/messages",
        element: <ProjectMessages />,
      },
      {
        path: "/projects/:id/milestones",
        element: <ProjectMilestones />,
      },
    ],
  },
];
