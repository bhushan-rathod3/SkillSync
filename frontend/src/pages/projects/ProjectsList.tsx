import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectService } from "../../services/projectService";
import { Project } from "../../types/project.types";
import { useAuth } from "../../contexts/AuthContext";
import {
  Button,
  Loader,
  Text,
  Alert,
  Group,
  Paper,
  Title,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { ProjectCard } from "../../components/cards/ProjectCard";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { logAuthState } from "../../utils/authDebug";

export const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const { user } = useAuth();

  // Function to manually refresh projects
  const refreshProjects = () => {
    setIsLoading(true);
    setError(null);
    fetchProjects();
  };

  // Define fetchProjects outside useEffect so we can call it from refresh button
  const fetchProjects = async () => {
    try {
      setError(null);
      setDebugInfo(null);

      // Log auth state for debugging
      const authState = logAuthState();

      // Check if token exists
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No authentication token found");
        setError("Authentication required. Please log in again.");
        setDebugInfo("No authentication token found in localStorage");
        setProjects([]);
        setIsLoading(false);
        return;
      }

      console.log(
        "Fetching projects with token:",
        token.substring(0, 10) + "..."
      );
      const data = await projectService.getProjects();
      console.log("Projects fetched successfully:", data);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        if (error.response.status === 401) {
          setError("Your session has expired. Please log in again.");
          setDebugInfo("401 Unauthorized: Token may be invalid or expired");
        } else if (error.response.status === 403) {
          setError("You don't have permission to view these projects.");
          setDebugInfo("403 Forbidden: User lacks necessary permissions");
        } else if (error.response.status === 500) {
          setError("Server error. The development team has been notified.");
          setDebugInfo(
            `500 Internal Server Error: ${JSON.stringify(error.response.data)}`
          );
        } else {
          setError(
            `Failed to load projects: ${
              error.response.data?.message || "Server error"
            }`
          );
          setDebugInfo(
            `Error ${error.response.status}: ${JSON.stringify(
              error.response.data
            )}`
          );
        }
      } else if (error.request) {
        setError(
          "Could not connect to the server. Please check your connection."
        );
        setDebugInfo("Network error: No response received from server");
      } else {
        setError("Failed to load projects. Please try again later.");
        setDebugInfo(`Error: ${error.message}`);
      }

      // Set empty projects array to avoid showing stale data
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we have a user (authenticated)
    if (user) {
      fetchProjects();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <Group position="apart" mb="lg">
        <Title order={2}>Projects</Title>
        {user?.role === "client" && (
          <Link to="/projects/create" style={{ textDecoration: "none" }}>
            <Button>Create Project</Button>
          </Link>
        )}
      </Group>

      {projects.length === 0 ? (
        <Paper p="xl" withBorder radius="md" className="text-center py-10">
          <Text c="dimmed" size="lg">
            No projects found
          </Text>
          {user?.role === "client" && (
            <Link to="/projects/create">
              <Button className="mt-4">Create Your First Project</Button>
            </Link>
          )}
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </SimpleGrid>
      )}
    </div>
  );
};
