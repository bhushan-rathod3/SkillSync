import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getProjects } from "../../api/projects";
import { Project, ProjectStatus } from "../../types";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProjects()
      .then((res) => {
        console.log("Projects response:", res.data);
        let projectsData: Project[] = [];

        if (res.data && (res.data.success || Array.isArray(res.data))) {
          // Handle both ApiResponse wrapper and direct array
          if (res.data.data && res.data.data.items) {
            // Paginated response
            projectsData = res.data.data.items;
          } else if (Array.isArray(res.data.data)) {
            // Array in data field
            projectsData = res.data.data;
          } else if (Array.isArray(res.data)) {
            // Direct array
            projectsData = res.data;
          } else {
            setError("Unexpected response format");
          }

          setProjects(projectsData);
          setFilteredProjects(projectsData);
        } else {
          setError(res.data?.message || "Failed to load projects");
        }
      })
      .catch((err) => {
        console.error("Projects fetch error:", err);
        setError("An error occurred while fetching projects");
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle search term changes
  const handleSearch = useCallback(
    debounce((term: string) => {
      if (term.trim() === "") {
        setFilteredProjects(projects);
        return;
      }

      const filtered = projects.filter(
        (project) =>
          project.title?.toLowerCase().includes(term.toLowerCase()) ||
          project.description?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProjects(filtered);
    }, 300),
    [projects]
  );

  // Update search results when term changes
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

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
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Available Projects
        </Typography>

        <TextField
          fullWidth
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
      </Paper>

      {filteredProjects.length === 0 ? (
        <Alert severity="info">
          No projects available matching your search criteria.
        </Alert>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6">{project.title}</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {project.description || "No description available"}
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
                    <Typography variant="body1">${project.budget}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                    <Typography variant="body2" color="text.secondary">
                      Deadline
                    </Typography>
                    <Typography variant="body1">
                      {new Date(project.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/freelancer/projects/${project.id}`}
                    fullWidth
                  >
                    View & Bid
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
