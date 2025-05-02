import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Project, ProjectStatus } from "../types";
import { debounce } from "lodash";

export default function ProjectSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Project[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        setProjects([]);
        setFilteredProjects([]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Debounced search function for real-time suggestions
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim() === "" || projects.length === 0) {
        setSuggestions([]);
        return;
      }

      const filtered = projects.filter(
        (project) =>
          project.title?.toLowerCase().includes(term.toLowerCase()) ||
          project.description?.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }, 300),
    [projects]
  );

  useEffect(() => {
    const term = searchTerm.trim();

    if (term === "" || projects.length === 0) {
      setFilteredProjects(projects);
      setSuggestions([]);
      return;
    }

    const searchTermLower = term.toLowerCase();
    const filtered = projects.filter(
      (project) =>
        project.title?.toLowerCase().includes(searchTermLower) ||
        project.description?.toLowerCase().includes(searchTermLower)
    );

    setFilteredProjects(filtered);
    debouncedSearch(term);
  }, [searchTerm, projects, debouncedSearch]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
    if (searchTerm.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (project: Project) => {
    setSearchTerm(project.title);
    setShowSuggestions(false);
    setFilteredProjects([project]);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Find Projects
      </Typography>
      <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
        <Box sx={{ position: "relative", width: "100%" }}>
          <TextField
            fullWidth
            placeholder="Search by title, description, or required skills..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.trim() !== "");
            }}
            onFocus={handleFocus}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Search suggestions */}
          <Popper
            open={showSuggestions && suggestions.length > 0}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{ width: anchorEl?.clientWidth, zIndex: 1300 }}
          >
            <Paper
              elevation={3}
              sx={{ mt: 1, maxHeight: 300, overflow: "auto" }}
            >
              <List>
                {suggestions.map((suggestion) => (
                  <ListItem
                    component="button"
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={suggestion.title}
                      secondary={
                        suggestion.description.substring(0, 60) + "..."
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No projects available at the moment.
        </Typography>
      ) : filteredProjects.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No projects found matching your search criteria.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>

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
                      height: "4.5em",
                    }}
                  >
                    {project.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Budget: ${project.budget}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Deadline:{" "}
                      {new Date(project.deadline).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Status: {project.status}
                    </Typography>
                  </Box>

                  {/* Removed skills section to simplify the component */}

                  <Button
                    variant="outlined"
                    fullWidth
                    href={`/freelancer/projects/${project.id}`}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
