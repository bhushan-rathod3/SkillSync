// shared icons/paths per role
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BidIcon from "@mui/icons-material/MonetizationOn";
import MessageIcon from "@mui/icons-material/Message";
import PeopleIcon from "@mui/icons-material/People";

export const sidebarItems = {
  client: [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/client/dashboard" },
    { label: "Projects", icon: <WorkIcon />, path: "/client/projects" },
    {
      label: "Freelancers",
      icon: <PeopleIcon />,
      path: "/client/freelancers",
    },
    { label: "Messages", icon: <MessageIcon />, path: "/client/messages" },
    { label: "Profile", icon: <AccountCircleIcon />, path: "/client/profile" },
  ],
  freelancer: [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/freelancer/dashboard",
    },
    {
      label: "Browse Projects",
      icon: <WorkIcon />,
      path: "/freelancer/projects",
    },
    {
      label: "My Bids",
      icon: <BidIcon />,
      path: "/freelancer/my-bids",
    },
    {
      label: "Messages",
      icon: <MessageIcon />,
      path: "/freelancer/messages",
    },
    {
      label: "Profile",
      icon: <AccountCircleIcon />,
      path: "/freelancer/profile",
    },
  ],
};
