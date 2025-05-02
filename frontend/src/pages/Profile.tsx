import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { useAuthContext } from "../contexts/AuthProvider";
import { getProfile, updateProfile } from "../api/users";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { User, UserSkill } from "../types";
import { useParams } from "react-router-dom";
import api from "../api";

export default function Profile() {
  const { user } = useAuthContext();
  const { id: userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
  });
  const [viewMode, setViewMode] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);

  useEffect(() => {
    // If there's a userId in the URL, we're viewing someone else's profile
    if (userId) {
      setViewMode(true);
      fetchUserProfile(userId);
    } else {
      // Otherwise, we're viewing our own profile
      setViewMode(false);
      fetchOwnProfile();
    }
  }, [userId]);

  const fetchUserProfile = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // First try to get the user from the freelancers endpoint which includes skills
      let userData: User | undefined;
      let response;

      try {
        // Try to get the freelancer with skills from the freelancers endpoint
        const freelancersResponse = await api.get("/users/freelancers");

        if (freelancersResponse.data?.success) {
          // Find the specific freelancer by ID
          const freelancer = freelancersResponse.data.data.find(
            (f: User) => f.id.toString() === id
          );

          if (freelancer) {
            userData = freelancer;
          }
        }
      } catch (err) {
        console.error("Error fetching from freelancers list:", err);
      }

      // If we couldn't find the user in the freelancers list, try the direct endpoint
      if (!userData) {
        response = await api.get(`/users/${id}`);
        userData = response.data?.success ? response.data.data : undefined;
      }

      if (userData) {
        // Ensure we have the complete user data with skills
        setProfileData(userData);

        // Format skills for display
        let skillsString = "";
        if (
          userData.userSkills &&
          Array.isArray(userData.userSkills) &&
          userData.userSkills.length > 0
        ) {
          skillsString = userData.userSkills
            .map((us) => us.skill.name)
            .join(", ");
        }

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          bio: userData.bio || "",
          skills: skillsString,
        });

        if (userData.profileImage) {
          // Construct the image URL using the new endpoint
          const baseUrl =
            import.meta.env.VITE_API_URL || "http://localhost:3000";
          const imageUrl = `${baseUrl}/users/profile-image/${userData.profileImage}`;

          setProfileImagePreview(imageUrl);
        } else {
          setProfileImagePreview(null);
        }
      } else {
        setError("Failed to load profile data");
      }
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      setError("An error occurred while fetching this profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      // First try to get the profile with the standard endpoint
      const response = await getProfile();

      // Extract profile data from the response
      let profileData: User | undefined = response.data?.success
        ? response.data.data
        : undefined;

      // If the user is a freelancer, try to get more complete data with skills
      if (
        profileData &&
        profileData.role === "freelancer" &&
        (!profileData.userSkills || profileData.userSkills.length === 0)
      ) {
        try {
          const freelancersResponse = await api.get("/users/freelancers");

          if (freelancersResponse.data?.success) {
            // Find the current user in the freelancers list
            const freelancerWithSkills = freelancersResponse.data.data.find(
              (f: User) => f.id === profileData?.id
            );

            if (freelancerWithSkills && freelancerWithSkills.userSkills) {
              profileData = freelancerWithSkills;
            }
          }
        } catch (err) {
          console.error("Error fetching freelancer data with skills:", err);
        }
      }

      if (profileData) {
        // Ensure we have the complete user data with skills
        setProfileData(profileData);

        // Format skills for display
        let skillsString = "";
        if (
          profileData.userSkills &&
          Array.isArray(profileData.userSkills) &&
          profileData.userSkills.length > 0
        ) {
          skillsString = profileData.userSkills
            .map((us) => us.skill.name)
            .join(", ");
        }

        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          bio: profileData.bio || "",
          skills: skillsString,
        });

        if (profileData.profileImage) {
          // Construct the image URL using the new endpoint
          const baseUrl =
            import.meta.env.VITE_API_URL || "http://localhost:3000";
          const imageUrl = `${baseUrl}/users/profile-image/${profileData.profileImage}`;

          setProfileImagePreview(imageUrl);
        } else {
          setProfileImagePreview(null);
        }
      } else {
        setError("Failed to load profile data");
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError("An error occurred while fetching your profile");
      showErrorToast("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Convert skills string to array
      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const updatedData = {
        name: formData.name,
        bio: formData.bio,
        skills,
        profileImage: profileImage || undefined,
      };

      const response = await updateProfile(updatedData);

      if (response.data && response.data.success) {
        showSuccessToast("Profile updated successfully");

        // Update the skills in the UI immediately
        const updatedSkills = formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "");

        // Create a temporary userSkills array from the skills that matches the UserSkill type
        const tempUserSkills = updatedSkills
          .map((skill, index) => {
            // Only create the userSkills if we have a valid profileData
            if (!profileData) return null;

            return {
              id: index, // Temporary ID
              skill: {
                id: index, // Temporary ID
                name: skill,
              },
              // Use the full user object from profileData
              user: profileData,
            };
          })
          .filter(Boolean) as UserSkill[]; // Filter out any null values and cast to UserSkill[]

        // Update the profile data with the new skills
        if (profileData) {
          setProfileData({
            ...profileData,
            name: formData.name,
            bio: formData.bio,
            userSkills: tempUserSkills,
          });
        }

        // Then refresh the profile from the server to get the latest data
        setTimeout(() => {
          fetchOwnProfile();
        }, 1000);

        // Clear the file input
        setProfileImage(null);
      } else {
        showErrorToast(response.data?.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      showErrorToast("An error occurred while updating your profile");
    } finally {
      setSaving(false);
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

  // Render different views based on whether we're viewing our own profile or someone else's
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {viewMode ? `${formData.name}'s Profile` : "My Profile"}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        {!viewMode ? (
          // Edit mode (own profile)
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: { xs: "100%", md: "33%" },
                }}
              >
                <Avatar
                  src={profileImagePreview || undefined}
                  sx={{ width: 150, height: 150, mb: 2 }}
                  alt={formData.name}
                />
                <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Recommended: Square image, at least 200x200 pixels
                </Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", md: "67%" } }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  disabled
                  margin="normal"
                  helperText="Email cannot be changed"
                />

                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder="Tell us about yourself..."
                />

                <TextField
                  fullWidth
                  label="Skills (comma-separated)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  margin="normal"
                  placeholder="e.g. JavaScript, React, Node.js"
                />

                {/* Display current skills as chips */}
                {formData.skills && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {formData.skills
                      .split(",")
                      .map(
                        (skill, index) =>
                          skill.trim() && (
                            <Chip
                              key={index}
                              label={skill.trim()}
                              color="primary"
                              size="small"
                              sx={{ mb: 1 }}
                            />
                          )
                      )}
                  </Box>
                )}

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : null}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        ) : (
          // View mode (someone else's profile)
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "100%", md: "33%" },
              }}
            >
              <Avatar
                src={profileImagePreview || undefined}
                sx={{ width: 150, height: 150, mb: 2 }}
                alt={formData.name}
              />
            </Box>

            <Box sx={{ width: { xs: "100%", md: "67%" } }}>
              <Typography variant="h5" gutterBottom>
                {formData.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {formData.email}
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                About
              </Typography>
              <Typography variant="body1" paragraph>
                {formData.bio || "No bio available"}
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Skills
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {profileData &&
                profileData.userSkills &&
                profileData.userSkills.length > 0 ? (
                  // Display skills from userSkills array if available
                  profileData.userSkills.map((userSkill, index) => (
                    <Chip
                      key={index}
                      label={userSkill.skill.name}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))
                ) : formData.skills && formData.skills.trim() ? (
                  // Fallback to formData.skills if userSkills is not available
                  formData.skills
                    .split(",")
                    .map(
                      (skill, index) =>
                        skill.trim() && (
                          <Chip
                            key={index}
                            label={skill.trim()}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        )
                    )
                ) : (
                  // No skills found
                  <Typography variant="body2" color="text.secondary">
                    No skills listed
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {!viewMode && (
        <>
          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" gutterBottom>
            Account Information
          </Typography>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Account Type
                </Typography>
                <Typography variant="body1">
                  <Chip
                    label={
                      user?.role === "freelancer" ? "Freelancer" : "Client"
                    }
                    color={
                      user?.role === "freelancer" ? "primary" : "secondary"
                    }
                    sx={{ mt: 1 }}
                  />
                </Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
