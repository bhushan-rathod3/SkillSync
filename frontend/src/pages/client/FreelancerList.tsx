import React from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import FreelancerSearch from "../../components/FreelancerSearch";

export default function FreelancerList() {
  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Find Talented Freelancers
        </Typography>
        <Typography variant="body1">
          Browse our network of skilled professionals for your projects. Use the
          search box below to filter by name, skills, or bio.
        </Typography>
      </Paper>

      <FreelancerSearch />
    </Box>
  );
}
