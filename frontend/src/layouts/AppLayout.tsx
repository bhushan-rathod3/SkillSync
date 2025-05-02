import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { sidebarItems } from "../components/SideBarItems";
import { useAuth } from "../hooks/useAuth";
import { useThemeStore } from "../store/themeStore";
import { useAuthContext } from "../contexts/AuthProvider";

const drawerWidth = 240;

export default function AppLayout() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthContext();
  const { darkMode, toggleDarkMode } = useThemeStore();

  const toggleDrawer = () => setOpen(!open);

  const items =
    user?.role === "client" ? sidebarItems.client : sidebarItems.freelancer;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            onClick={toggleDrawer}
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
            onClick={() => navigate(`/${user?.role}/dashboard`)}
          >
            SkillSync
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  color="default"
                />
              }
              label={darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            />

            <Tooltip title="View Profile">
              <IconButton
                component={Link}
                to={`/${user?.role}/profile`}
                sx={{ p: 0, mr: 2 }}
              >
                <Avatar
                  alt={user?.name || "User"}
                  src={
                    user?.profileImage
                      ? `${
                          import.meta.env.VITE_API_URL ||
                          "http://localhost:3000"
                        }/users/profile-image/${user.profileImage}`
                      : undefined
                  }
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 56,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 56,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {items.map(({ label, icon, path }) => (
            <ListItem key={label} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{ justifyContent: open ? "initial" : "center", px: 2.5 }}
                onClick={() => navigate(path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
