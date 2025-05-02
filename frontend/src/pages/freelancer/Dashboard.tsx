import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthProvider";

export default function FreelancerDashboard() {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Note: This is a placeholder for future API integration
        // Currently using static data for display purposes only
        setTimeout(() => {
          setStats({
            activeProjects: 0, // Static placeholder
            completedProjects: 0, // Static placeholder
            totalEarnings: 0, // Static placeholder
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome back, {user?.name || "Freelancer"}!
        </Typography>
        <Typography variant="body1">
          Find new projects, manage your ongoing work, and track your earnings.
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "success.light",
              color: "success.contrastText",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Completed Projects
            </Typography>
            {loading ? (
              <CircularProgress size={40} sx={{ color: "white" }} />
            ) : (
              <Typography variant="h3">{stats.completedProjects}</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "info.light",
              color: "info.contrastText",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Earnings
            </Typography>
            {loading ? (
              <CircularProgress size={40} sx={{ color: "white" }} />
            ) : (
              <Typography variant="h3">${stats.totalEarnings}</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Find New Opportunities
            </Typography>
            <Typography variant="body1" paragraph>
              Browse available projects that match your skills and interests.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/freelancer/projects"
              size="large"
            >
              Browse Projects
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
