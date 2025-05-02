import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { getProjectById } from "../../api/projects";
import { createBid, getMyBids } from "../../api/bids";
import { Project, ProjectStatus, Bid } from "../../types";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import ProjectMessages from "../../components/ProjectMessages";

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

export default function ProjectDetails() {
  const { id } = useParams();
  const projectId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  const location = window.location;
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [existingBid, setExistingBid] = useState<Bid | null>(null);
  const [tabValue, setTabValue] = useState(tabParam === "messages" ? 1 : 0);

  const [bid, setBid] = useState({
    bidAmount: "",
    durationDays: "",
    bidMessage: "",
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch both project details and user's bids
    Promise.all([getProjectById(projectId), getMyBids()])
      .then(([projectRes, bidsRes]) => {
        console.log("Project response:", projectRes.data);
        console.log("My bids response:", bidsRes.data);

        // Handle project data
        if (
          projectRes.data &&
          (projectRes.data.success || projectRes.data.id)
        ) {
          // Handle both ApiResponse wrapper and direct Project object
          const projectData = projectRes.data.data || projectRes.data;
          if ("id" in projectData) {
            setProject(projectData);
          } else {
            console.warn("Invalid project data format");
          }
        } else {
          setError(
            projectRes.data?.message || "Failed to load project details"
          );
        }

        // Check if user has already bid on this project
        if (
          bidsRes.data &&
          (bidsRes.data.success || Array.isArray(bidsRes.data))
        ) {
          const bidsData =
            bidsRes.data.data ||
            (Array.isArray(bidsRes.data) ? bidsRes.data : []);
          const existingBidOnProject = bidsData.find(
            (bid) =>
              bid.projectId === projectId || bid.project?.id === projectId
          );
          if (existingBidOnProject) {
            setExistingBid(existingBidOnProject);
          }
        }
      })
      .catch((err) => {
        console.error("Data fetch error:", err);
        setError("An error occurred while fetching data");
        showErrorToast("Failed to load project data. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBid({ ...bid, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = () => {
    // Validate inputs
    if (!bid.bidAmount || !bid.durationDays) {
      showErrorToast("Please enter both bid amount and duration");
      return;
    }

    setSubmitting(true);

    createBid(projectId, {
      bidAmount: Number(bid.bidAmount),
      durationDays: Number(bid.durationDays),
      bidMessage:
        bid.bidMessage || "I'm interested in working on this project.",
    })
      .then((res) => {
        console.log("Create bid response:", res.data);
        if (res.data && (res.data.success || res.data.id)) {
          showSuccessToast("Bid submitted successfully!");
          // Redirect to projects page
          navigate("/freelancer/my-bids");
        } else {
          showErrorToast(res.data?.message || "Failed to submit bid");
        }
      })
      .catch((err) => {
        console.error("Create bid error:", err);
        showErrorToast("An error occurred while submitting your bid");
      })
      .finally(() => setSubmitting(false));
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

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" component={Link} to="/freelancer/projects">
          Back to Projects
        </Button>
      </Box>
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
            color={
              project.status === ProjectStatus.OPEN
                ? "primary"
                : project.status === ProjectStatus.ASSIGNED
                ? "warning"
                : "success"
            }
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
            <Tab
              label="Messages"
              id="project-tab-1"
              aria-controls="project-tabpanel-1"
            />
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
                Client
              </Typography>
              <Typography variant="h6">
                {project.client?.name || "Anonymous"}
              </Typography>
            </Box>
          </Box>

          {project.status === ProjectStatus.OPEN && (
            <>
              {existingBid ? (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Your Bid on This Project
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      You have already submitted a bid for this project.
                    </Alert>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Bid Amount
                        </Typography>
                        <Typography variant="h6">
                          ₹{existingBid.bidAmount}
                        </Typography>
                      </Box>
                      <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="h6">
                          {existingBid.durationDays} days
                        </Typography>
                      </Box>
                      <Box sx={{ gridColumn: "span 12" }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Your Message
                        </Typography>
                        <Typography variant="body1">
                          {existingBid.bidMessage}
                        </Typography>
                      </Box>
                    </Box>

                    <Box mt={3} display="flex" justifyContent="space-between">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setTabValue(1)}
                      >
                        Message Client
                      </Button>
                      <Button
                        variant="outlined"
                        component={Link}
                        to="/freelancer/my-bids"
                      >
                        View All My Bids
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Submit Your Bid
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Please provide your bid details below. Make sure your bid
                      is competitive and your message explains why you're the
                      right person for this job.
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
                        <TextField
                          label="Bid Amount (₹)"
                          name="bidAmount"
                          type="number"
                          fullWidth
                          value={bid.bidAmount}
                          onChange={handleChange}
                          required
                          InputProps={{ inputProps: { min: 1 } }}
                        />
                      </Box>
                      <Box sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
                        <TextField
                          label="Duration (days)"
                          name="durationDays"
                          type="number"
                          fullWidth
                          value={bid.durationDays}
                          onChange={handleChange}
                          required
                          InputProps={{ inputProps: { min: 1 } }}
                        />
                      </Box>
                      <Box sx={{ gridColumn: "span 12" }}>
                        <TextField
                          label="Cover Letter / Message"
                          name="bidMessage"
                          fullWidth
                          multiline
                          rows={4}
                          value={bid.bidMessage}
                          onChange={handleChange}
                          placeholder="Explain why you're the best fit for this project and how you plan to approach it."
                        />
                      </Box>
                    </Box>

                    <Box mt={3} display="flex" justifyContent="space-between">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          // Set tab to messages tab
                          setTabValue(1);
                          // Update URL with tab parameter
                          navigate(
                            `/freelancer/projects/${projectId}?tab=messages`
                          );
                        }}
                      >
                        Message Client
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={
                          submitting || !bid.bidAmount || !bid.durationDays
                        }
                      >
                        {submitting ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Submit Bid"
                        )}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {project.status !== ProjectStatus.OPEN && !existingBid && (
            <Alert severity="info" sx={{ mt: 3 }}>
              This project is no longer accepting bids as it has been{" "}
              {project.status === ProjectStatus.ASSIGNED
                ? "assigned to a freelancer"
                : "completed"}
              .
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ProjectMessages
            projectId={project.id}
            receiverId={project.client.id}
            receiverName={project.client.name}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
}
