import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ClientDashboard from "./pages/client/Dashboard";
import FreelancerDashboard from "./pages/freelancer/Dashboard";
import Landing from "./pages/Landing";
import ProjectForm from "./pages/client/ProjectForm";
import ProjectList from "./pages/freelancer/ProjectList";
import { AuthProvider, useAuthContext } from "./contexts/AuthProvider";
import AppLayout from "./layouts/AppLayout";
import FreelancerProjectDetails from "./pages/freelancer/ProjectDetails";
import ClientProjectDetails from "./pages/client/ProjectDetails";
import ClientProjectList from "./pages/client/ClientProjectList";
import BidsForProject from "./pages/client/BidsForProject";
import MyBids from "./pages/freelancer/MyBids";
import FreelancerMessages from "./pages/freelancer/Messages";
import ClientMessages from "./pages/client/Messages";
import Profile from "./pages/Profile";
import FreelancerList from "./pages/client/FreelancerList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role: "client" | "freelancer";
}) {
  const { user, accessToken } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Wait a moment for auth context to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user || !accessToken) {
    return <Navigate to="/login" />;
  }

  // Redirect if wrong role
  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Client */}
            <Route
              path="/client"
              element={
                <ProtectedRoute role="client">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects" element={<ClientProjectList />} />
              <Route path="projects/:id" element={<ClientProjectDetails />} />
              <Route path="projects/:id/bids" element={<BidsForProject />} />
              <Route path="freelancers" element={<FreelancerList />} />
              <Route path="freelancers/:id" element={<Profile />} />
              <Route path="messages" element={<ClientMessages />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Freelancer */}
            <Route
              path="/freelancer"
              element={
                <ProtectedRoute role="freelancer">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<FreelancerDashboard />} />
              <Route path="projects" element={<ProjectList />} />
              <Route
                path="projects/:id"
                element={<FreelancerProjectDetails />}
              />
              <Route path="my-bids" element={<MyBids />} />
              <Route path="messages" element={<FreelancerMessages />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
