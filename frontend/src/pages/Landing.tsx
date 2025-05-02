import {
  Box,
  Button,
  Typography,
  Stack,
  Container,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import PaymentIcon from "@mui/icons-material/Payment";
import StarIcon from "@mui/icons-material/Star";

// Mock testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    comment:
      "SkillSync helped me find consistent work with great clients. The platform is intuitive and the payment system is reliable.",
    avatar: "S",
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    comment:
      "As a client, I've found exceptional talent through SkillSync. The quality of freelancers and the project management tools are outstanding.",
    avatar: "M",
  },
  {
    name: "Jessica Williams",
    role: "Web Developer",
    comment:
      "The collaboration features make working with clients seamless. I've doubled my freelance income since joining SkillSync.",
    avatar: "J",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            SkillSync
          </Typography>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          color: "white",
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Box sx={{ width: { xs: "100%", md: "45%" } }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                Connect. Collaborate. Create.
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4 }}>
                The premier platform connecting skilled freelancers with clients
                seeking quality work.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => navigate("/register")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    backgroundColor: "white",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Box>
            <Box
              sx={{
                width: { xs: "100%", md: "45%" },
                display: { xs: "none", md: "block" },
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600"
                alt="Collaboration"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            Why Choose SkillSync?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Our platform offers everything you need to succeed in the freelance
            marketplace
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <Box sx={{ width: { xs: "100%", md: "30%" } }}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <SearchIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Find Perfect Matches
                </Typography>
                <Typography>
                  Our smart matching algorithm connects clients with the most
                  suitable freelancers based on skills, experience, and project
                  requirements.
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "30%" } }}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <WorkIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Seamless Collaboration
                </Typography>
                <Typography>
                  Built-in tools for project management, file sharing, and
                  communication make working together effortless and efficient.
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "30%" } }}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <PaymentIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Secure Payments
                </Typography>
                <Typography>
                  Our escrow system ensures freelancers get paid for their work
                  and clients receive quality deliverables before releasing
                  funds.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            How It Works
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 4 }}>
            <Box sx={{ width: { xs: "100%", md: "30%" } }}>
              <Paper
                elevation={0}
                sx={{ p: 3, textAlign: "center", height: "100%" }}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <Avatar
                    sx={{ width: 60, height: 60, bgcolor: "primary.main" }}
                  >
                    1
                  </Avatar>
                </Box>
                <Typography variant="h5" gutterBottom>
                  Create Your Profile
                </Typography>
                <Typography>
                  Sign up and create a detailed profile showcasing your skills,
                  experience, and portfolio.
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30%" } }}>
              <Paper
                elevation={0}
                sx={{ p: 3, textAlign: "center", height: "100%" }}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <Avatar
                    sx={{ width: 60, height: 60, bgcolor: "primary.main" }}
                  >
                    2
                  </Avatar>
                </Box>
                <Typography variant="h5" gutterBottom>
                  Connect & Collaborate
                </Typography>
                <Typography>
                  Browse projects or freelancers, submit proposals, and start
                  working together on your terms.
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30%" } }}>
              <Paper
                elevation={0}
                sx={{ p: 3, textAlign: "center", height: "100%" }}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <Avatar
                    sx={{ width: 60, height: 60, bgcolor: "primary.main" }}
                  >
                    3
                  </Avatar>
                </Box>
                <Typography variant="h5" gutterBottom>
                  Get Paid Securely
                </Typography>
                <Typography>
                  Complete milestones, receive payments, and build your
                  reputation with reviews.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
        >
          What Our Users Say
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 2 }}>
          {testimonials.map((testimonial, index) => (
            <Box sx={{ width: { xs: "100%", md: "30%" } }} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: "warning.main" }} />
                    ))}
                  </Box>
                  <Typography variant="body1" paragraph sx={{ minHeight: 100 }}>
                    "{testimonial.comment}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Join thousands of freelancers and clients already using SkillSync to
            grow their business.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate("/register")}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
              backgroundColor: "white",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Create Your Free Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", py: 6 }}>
        <Container>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Box sx={{ width: { xs: "100%", md: "30%" } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                SkillSync
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connecting talent with opportunity in the digital age.
              </Typography>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30%" } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Links
              </Typography>
              <Typography variant="body2" paragraph>
                <Button color="inherit" sx={{ p: 0 }}>
                  About Us
                </Button>
              </Typography>
              <Typography variant="body2" paragraph>
                <Button color="inherit" sx={{ p: 0 }}>
                  How It Works
                </Button>
              </Typography>
              <Typography variant="body2">
                <Button color="inherit" sx={{ p: 0 }}>
                  Support
                </Button>
              </Typography>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "30%" } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Legal
              </Typography>
              <Typography variant="body2" paragraph>
                <Button color="inherit" sx={{ p: 0 }}>
                  Terms of Service
                </Button>
              </Typography>
              <Typography variant="body2" paragraph>
                <Button color="inherit" sx={{ p: 0 }}>
                  Privacy Policy
                </Button>
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SkillSync. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
