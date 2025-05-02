import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import { getProjectById } from "../../api/projects";
import { Project, ProjectStatus } from "../../types";
import ProjectMessages from "../../components/ProjectMessages";
import { showErrorToast } from "../../utils/toast";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ClientProjectDetails() {
  const { id } = useParams();
  const projectId = id ? parseInt(id) : 0;
  const location = window.location;
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(tabParam === "messages" ? 1 : 0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProjectById(projectId)
      .then((res) => {
        console.log("Project response:", res.data);
        if (res.data && (res.data.success || res.data.id)) {
          // Handle both ApiResponse wrapper and direct Project object
          const projectData = res.data.data || res.data;
          setProject(projectData);
        } else {
          setError(res.data?.message || "Failed to load project details");
        }
      })
      .catch((err) => {
        console.error("Project fetch error:", err);
        setError("An error occurred while fetching project details");
        showErrorToast("Failed to load project details");
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box my={2}>
        <Alert severity="error">{error || "Project not found"}</Alert>
      </Box>
    );
  }

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

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">{project.title}</Typography>
          <Chip
            label={project.status}
            color={getStatusColor(project.status as ProjectStatus)}
          />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="project tabs"
          >
            <Tab
              label="Project Details"
              id="project-tab-0"
              aria-controls="project-tabpanel-0"
            />
            {project.status === ProjectStatus.ASSIGNED &&
              project.assignedFreelancer && (
                <Tab
                  label="Messages"
                  id="project-tab-1"
                  aria-controls="project-tabpanel-1"
                />
              )}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" paragraph>
            {project.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 3,
            }}
          >
            <Box
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="h6">₹{project.budget}</Typography>
            </Box>
            <Box
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Deadline
              </Typography>
              <Typography variant="h6">
                {new Date(project.deadline).toLocaleDateString()}
              </Typography>
            </Box>
            <Box
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Category
              </Typography>
              <Typography variant="h6">{project.category}</Typography>
            </Box>
            <Box
              sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="h6">
                {new Date(project.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {project.status === ProjectStatus.ASSIGNED &&
            project.assignedFreelancer && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Assigned Freelancer
                </Typography>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {project.assignedFreelancer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.assignedFreelancer.email}
                    </Typography>
                    {project.assignedFreelancer.bio && (
                      <Typography variant="body2" mt={1}>
                        {project.assignedFreelancer.bio}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}

          <Box mt={3} display="flex" justifyContent="space-between">
            <Box>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/client/projects/${project.id}/bids`}
                sx={{ mr: 2 }}
              >
                View Bids{" "}
                {project.bids?.length ? `(${project.bids.length})` : ""}
              </Button>

              {project.status === ProjectStatus.ASSIGNED &&
                project.assignedFreelancer && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setTabValue(1)}
                  >
                    Message Freelancer
                  </Button>
                )}
            </Box>

            <Button variant="outlined" component={Link} to="/client/projects">
              Back to Projects
            </Button>
          </Box>
        </TabPanel>

        {project.status === ProjectStatus.ASSIGNED &&
          project.assignedFreelancer && (
            <TabPanel value={tabValue} index={1}>
              <ProjectMessages
                projectId={project.id}
                receiverId={project.assignedFreelancer.id}
                receiverName={project.assignedFreelancer.name}
              />
            </TabPanel>
          )}
      </Paper>
    </Box>
  );
}
