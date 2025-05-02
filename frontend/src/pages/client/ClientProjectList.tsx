import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getMyProjects } from "../../api/projects";
import { Project, ProjectStatus } from "../../types";

export default function ClientProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getMyProjects()
      .then((res) => {
        // Check if the response is an array (direct data from backend)
        if (Array.isArray(res.data)) {
          setProjects(res.data);
        }
        // Check if it's in the ApiResponse format
        else if (res.data && typeof res.data === "object") {
          if (res.data.success && res.data.data) {
            setProjects(res.data.data || []);
          } else if (res.data.success === false) {
            setError(res.data.message || "Failed to load projects");
          } else {
            // If it's an object but not in the expected format, try to use it directly
            setProjects(Array.isArray(res.data) ? res.data : []);
          }
        } else {
          setError("Received unexpected data format");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred while fetching projects");
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.OPEN:
        return "primary";
      case ProjectStatus.ASSIGNED:
        return "warning";
      case ProjectStatus.COMPLETED:
        return "success";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">My Projects</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/client/projects/new"
        >
          Create New Project
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Alert severity="info">
          You haven't created any projects yet. Click the "Create New Project"
          button to get started.
        </Alert>
      ) : (
        projects.map((project) => (
          <Card key={project.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6">{project.title}</Typography>
                <Chip
                  label={project.status}
                  color={getStatusColor(project.status as ProjectStatus)}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                {project.description}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, 1fr)",
                  gap: 2,
                }}
              >
                <Box sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                  <Typography variant="body2" color="text.secondary">
                    Budget
                  </Typography>
                  <Typography variant="body1">₹{project.budget}</Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                  <Typography variant="body2" color="text.secondary">
                    Deadline
                  </Typography>
                  <Typography variant="body1">
                    {new Date(project.deadline).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">{project.category}</Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Box mt={2} display="flex" gap={1}>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/client/projects/${project.id}/bids`}
                >
                  View Bids{" "}
                  {project.bids?.length ? `(${project.bids.length})` : ""}
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/client/projects/${project.id}`}
                >
                  Project Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
