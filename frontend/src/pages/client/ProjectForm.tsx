import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useAuthContext } from "../../contexts/AuthProvider";

export default function ProjectForm() {
  const { accessToken } = useAuthContext();
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:3000/projects", form, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Project created!");
    } catch (err) {
      alert("Error creating project");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create New Project
      </Typography>
      <TextField
        label="Title"
        name="title"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Category"
        name="category"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Description"
        name="description"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        onChange={handleChange}
      />
      <TextField
        label="Budget"
        name="budget"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        type="date"
        name="deadline"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}
