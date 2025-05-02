import { Typography, Box, Paper, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import ClientProjectList from "./ClientProjectList";
import { useAuthContext } from "../../contexts/AuthProvider";

export default function ClientDashboard() {
  const { user } = useAuthContext();

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome back, {user?.name || "Client"}!
        </Typography>
        <Typography variant="body1">
          You can create projects, assign freelancers, and manage your work
          here.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item={true} xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom></Typography>
            <ClientProjectList />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Find Talented Freelancers
            </Typography>
            <Typography variant="body1" paragraph>
              Browse our network of skilled professionals for your projects.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/client/freelancers"
              size="large"
            >
              Browse Freelancers
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
