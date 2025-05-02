import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getFreelancerProjects } from "../../api/projects";
import { Project } from "../../types";
import { useAuthContext } from "../../contexts/AuthProvider";

export default function FreelancerMyProjects() {
  const { user } = useAuthContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getFreelancerProjects();

        // Handle different response formats
        if (response.data) {
          // Case 1: ApiResponse format with data array
          if (response.data.success && Array.isArray(response.data.data)) {
            setProjects(response.data.data);
          }
          // Case 2: Direct array response
          else if (Array.isArray(response.data)) {
            setProjects(response.data);
          }
          // Case 3: Error response from API
          else if (response.data.success === false) {
            console.error("API error:", response.data.message);
            setError(response.data.message || "Failed to load projects");
            setProjects([]);
          }
          // Case 4: Unexpected format but has data property that might be an array
          else if (response.data.data && Array.isArray(response.data.data)) {
            setProjects(response.data.data);
          }
          // Case 5: Completely unexpected format
          else {
            console.error("Unexpected response format:", response.data);
            setError("Received unexpected data format");
            setProjects([]);
          }
        } else {
          setError("No data received from server");
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching my projects:", error);
        setError("Failed to fetch projects. Please try again later.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          My Projects
        </Typography>
        <Typography variant="body1">
          View and manage your assigned projects.
        </Typography>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            component={Link}
            to="/freelancer/projects"
          >
            Browse Available Projects
          </Button>
        </Paper>
      ) : projects.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            You don't have any assigned projects yet.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            component={Link}
            to="/freelancer/projects"
          >
            Find Projects
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="h6">{project.title}</Typography>
                    <Chip
                      label={
                        project.status === "in_progress"
                          ? "In Progress"
                          : project.status
                      }
                      color={
                        project.status === "in_progress" ? "primary" : "default"
                      }
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      height: "4.5em", // Fixed height for description
                    }}
                  >
                    {project.description || "No description available"}
                  </Typography>

                  <Box sx={{ mt: "auto" }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Budget: ${project.budget}
                      </Typography>
                      <Typography variant="body2">
                        Deadline:{" "}
                        {new Date(project.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/freelancer/projects/${project.id}`}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
