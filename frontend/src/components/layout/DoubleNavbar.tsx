import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconHome2,
  IconGauge,
  IconBriefcase,
  IconMessage,
  IconUser,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { Title, Tooltip, UnstyledButton, Text } from "@mantine/core";
import classes from "./DoubleNavbar.module.css";
import { useAuth } from "../../contexts/AuthContext";

// Define our navigation links
const mainLinksMockdata = [
  { icon: IconHome2, label: "Home", path: "/dashboard" },
  { icon: IconGauge, label: "Dashboard", path: "/dashboard" },
  { icon: IconBriefcase, label: "Projects", path: "/projects" },
  { icon: IconMessage, label: "Messages", path: "/messages" },
  { icon: IconUser, label: "Profile", path: "/profile" },
  { icon: IconSettings, label: "Settings", path: "/settings" },
];

// Define our secondary links based on the active main link
const getLinksByCategory = (category: string) => {
  switch (category) {
    case "Home":
      return ["Overview", "Activity", "Notifications"];
    case "Dashboard":
      return ["Statistics", "Tasks", "Calendar"];
    case "Projects":
      return [
        "My Projects",
        "Available Projects",
        "Create Project",
        "Completed Projects",
      ];
    case "Messages":
      return ["Inbox", "Sent", "Archived"];
    case "Profile":
      return ["Personal Info", "Skills", "Portfolio", "Reviews"];
    case "Settings":
      return ["Account", "Notifications", "Privacy", "Billing"];
    default:
      return [];
  }
};

// Map secondary links to paths
const getPathForSecondaryLink = (
  mainCategory: string,
  secondaryLink: string
) => {
  switch (mainCategory) {
    case "Projects":
      if (secondaryLink === "Create Project") return "/projects/create";
      if (secondaryLink === "My Projects") return "/projects";
      if (secondaryLink === "Available Projects") return "/projects/available";
      if (secondaryLink === "Completed Projects") return "/projects/completed";
      break;
    case "Profile":
      if (secondaryLink === "Personal Info") return "/profile";
      if (secondaryLink === "Skills") return "/profile/skills";
      if (secondaryLink === "Portfolio") return "/profile/portfolio";
      if (secondaryLink === "Reviews") return "/profile/reviews";
      break;
    // Add more mappings as needed
  }
  return "#"; // Default fallback
};

export function DoubleNavbar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [active, setActive] = useState("Dashboard");
  const [activeLink, setActiveLink] = useState("");

  const handleMainLinkClick = (label: string, path: string) => {
    setActive(label);
    setActiveLink("");
    navigate(path);
  };

  const handleSecondaryLinkClick = (link: string) => {
    setActiveLink(link);
    const path = getPathForSecondaryLink(active, link);

    // Only navigate if the path is valid (not just '#')
    if (path && path !== "#") {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => handleMainLinkClick(link.label, link.path)}
        className={classes.mainLink}
        data-active={link.label === active || undefined}
      >
        <link.icon size={22} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  // Add logout button
  const logoutButton = (
    <Tooltip
      label="Logout"
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        onClick={handleLogout}
        className={classes.mainLink}
        style={{ marginTop: "auto", marginBottom: "20px" }}
      >
        <IconLogout size={22} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );

  const links = getLinksByCategory(active).map((link) => (
    <a
      className={classes.link}
      data-active={activeLink === link || undefined}
      href="#"
      onClick={(event) => {
        event.preventDefault();
        handleSecondaryLinkClick(link);
      }}
      key={link}
    >
      {link}
    </a>
  ));

  const mainStyle = {
    flex: collapsed ? "0" : "1",
    overflow: "hidden",
    transition: "flex 0.3s ease",
    display: collapsed ? "none" : "block", // Hide the main section when collapsed
  };

  const titleStyle = {
    marginBottom: "20px",
    display: "block",
    paddingTop: "10px", // Add padding to prevent overlap
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div
          className={classes.aside}
          style={{ width: collapsed ? "80px" : "300px" }}
        >
          <div
            className={classes.logo}
            onClick={onToggle}
            style={{ cursor: "pointer" }}
          >
            <Text fw={700} size="lg" c="blue">
              ☰
            </Text>
          </div>
          {mainLinks}
          {logoutButton}
        </div>
        <div className={classes.main} style={mainStyle}>
          <Title order={4} className={classes.title} style={titleStyle}>
            {active}
            {user && (
              <Text
                size="xs"
                c="dimmed"
                mt={5}
                style={{ marginBottom: "20px", display: "block" }}
              >
                Logged in as {user.name} ({user.role})
              </Text>
            )}
          </Title>
          {links}
        </div>
      </div>
      <style>
        {`
          .${classes.wrapper} {
            display: flex;
            transition: all 0.3s ease;
          }
          .${classes.aside} {
            transition: width 0.3s ease;
          }
          .${classes.main} {
            transition: margin-left 0.3s ease;
          }
        `}
      </style>
    </nav>
  );
}
