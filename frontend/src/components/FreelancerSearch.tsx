import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { getFreelancers, searchFreelancers } from "../api/users";
import { User } from "../types";
import { debounce } from "lodash";

export default function FreelancerSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      try {
        const response = await getFreelancers();

        if (response.data && response.data.success) {
          setFreelancers(response.data.data || []);
          setFilteredFreelancers(response.data.data || []);
        } else {
          console.error("Failed to fetch freelancers:", response.data?.message);
          // Fallback to empty array if API fails
          setFreelancers([]);
          setFilteredFreelancers([]);
        }
      } catch (error) {
        console.error("Error fetching freelancers:", error);
        // Fallback to empty array if API fails
        setFreelancers([]);
        setFilteredFreelancers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  // Debounced search function for real-time suggestions
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        // Try to use the search API first
        try {
          const response = await searchFreelancers(term);
          if (response.data && response.data.success) {
            setSuggestions((response.data.data ?? []).slice(0, 5)); // Limit to 5 suggestions
            return;
          }
        } catch (apiError) {
          console.error(
            "API search failed, falling back to client-side filtering:",
            apiError
          );
        }

        // Fallback to client-side filtering if API fails
        const filtered = freelancers.filter(
          (freelancer) =>
            freelancer.name?.toLowerCase().includes(term.toLowerCase()) ||
            freelancer.bio?.toLowerCase().includes(term.toLowerCase()) ||
            freelancer.userSkills?.some((userSkill) =>
              userSkill.skill.name.toLowerCase().includes(term.toLowerCase())
            )
        );
        setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
      } catch (error) {
        console.error("Error searching freelancers:", error);
      }
    }, 300),
    [freelancers]
  );

  // Handle search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFreelancers(freelancers);
      setSuggestions([]);
      return;
    }

    // Update filtered freelancers for display
    const filtered = freelancers.filter(
      (freelancer) =>
        freelancer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.userSkills?.some((userSkill) =>
          userSkill.skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredFreelancers(filtered);

    // Get real-time suggestions
    debouncedSearch(searchTerm);
  }, [searchTerm, freelancers, debouncedSearch]);

  // Handle input focus
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
    if (searchTerm.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (freelancer: User) => {
    setSearchTerm(freelancer.name);
    setShowSuggestions(false);
    // Filter freelancers based on the selected suggestion
    const filtered = freelancers.filter(
      (f) => f.name.toLowerCase() === freelancer.name.toLowerCase()
    );
    setFilteredFreelancers(filtered);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Find Freelancers
      </Typography>
      <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
        <Box sx={{ position: "relative", width: "100%" }}>
          <TextField
            fullWidth
            placeholder="Search by name, skills, or bio..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.trim() !== "") {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
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
                    <ListItemAvatar>
                      <Avatar
                        src={
                          suggestion.profileImage
                            ? `${
                                import.meta.env.VITE_API_URL ||
                                "http://localhost:3000"
                              }/users/profile-image/${suggestion.profileImage}`
                            : undefined
                        }
                      >
                        {suggestion.name?.charAt(0) || "F"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={suggestion.name}
                      secondary={
                        suggestion.bio?.substring(0, 60) + "..." ||
                        "No bio available"
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
      ) : filteredFreelancers.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No freelancers found matching your search criteria.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredFreelancers.map((freelancer) => (
            <Card key={freelancer.id}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={
                      freelancer.profileImage
                        ? `${
                            import.meta.env.VITE_API_URL ||
                            "http://localhost:3000"
                          }/users/profile-image/${freelancer.profileImage}`
                        : undefined
                    }
                    sx={{ width: 56, height: 56, mr: 2 }}
                  >
                    {freelancer.name?.charAt(0) || "F"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{freelancer.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {freelancer.email}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {freelancer.bio || "No bio available"}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {freelancer.userSkills?.map((userSkill, index) => (
                    <Chip
                      key={index}
                      label={userSkill.skill.name}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                  {(!freelancer.userSkills ||
                    freelancer.userSkills.length === 0) && (
                    <Typography variant="body2" color="text.secondary">
                      No skills listed
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={`/client/freelancers/${freelancer.id}`}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
