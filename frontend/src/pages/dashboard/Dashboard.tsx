import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ClientDashboard } from "./client/ClientDashboard";
import { FreelancerDashboard } from "./freelancer/FreelancerDashboard";
import { FeaturesImages } from "../../components/FeaturesImages";
import { Container, Loader, Paper, Title } from "@mantine/core";

export const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="xl" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <Container size="xl" py="xl">
      <Paper shadow="xs" p="md" mb="xl">
        <Title order={2} mb="md">
          Welcome back, {user.name}!
        </Title>
      </Paper>

      {/* Features section */}
      <FeaturesImages />

      {/* Role-specific dashboard */}
      {user.role === "client" ? <ClientDashboard /> : <FreelancerDashboard />}
    </Container>
  );
};
