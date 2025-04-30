import { useState } from "react";
import { Drawer, ActionIcon } from "@mantine/core";
import {
  IconMenu2,
  IconHome,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import {
  Group,
  Container,
  Title,
  Menu,
  UnstyledButton,
  Text,
  rem,
  Flex,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Container
        size="lg"
        h={60}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Flex justify="space-between" align="center" w="100%">
          <ActionIcon
            size="lg"
            onClick={() => setSidebarOpen(true)}
            style={{ marginRight: "1rem" }}
          >
            <IconMenu2 size={24} />
          </ActionIcon>

          <Link to="/" style={{ textDecoration: "none" }}>
            <Title order={3} c="blue" style={{ fontSize: "1.5rem" }}>
              SkillSync
            </Title>
          </Link>

          <Group gap="sm">
            {isAuthenticated ? (
              <>
                <Link
                  to="/projects"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Text
                    size="sm"
                    fw={500}
                    className="hover:text-blue-500 transition-colors"
                  >
                    Projects
                  </Text>
                </Link>

                {user?.role === "client" && (
                  <Link
                    to="/projects/create"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Text
                      size="sm"
                      fw={500}
                      className="hover:text-blue-500 transition-colors"
                    >
                      Create Project
                    </Text>
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Text
                    size="sm"
                    fw={500}
                    className="hover:text-blue-500 transition-colors"
                  >
                    Dashboard
                  </Text>
                </Link>

                <Menu position="bottom-end" shadow="sm" width={180}>
                  <Menu.Target>
                    <UnstyledButton className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                      <Text size="sm" fw={500}>
                        {user?.name}
                      </Text>
                      <IconChevronDown size={14} />
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => (window.location.href = "/profile")}
                      size="sm"
                    >
                      Profile
                    </Menu.Item>
                    <Menu.Item onClick={logout} size="sm">
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </Group>
        </Flex>
      </Container>

      <Drawer
        opened={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        padding="md"
        size="sm"
        title="Navigation"
      >
        <Flex direction="column" gap="md">
          <Link to="/">
            <ActionIcon size="lg">
              <IconHome size={24} />
            </ActionIcon>
            Home
          </Link>
          <Link to="/profile">
            <ActionIcon size="lg">
              <IconUser size={24} />
            </ActionIcon>
            Profile
          </Link>
          <Link to="/settings">
            <ActionIcon size="lg">
              <IconSettings size={24} />
            </ActionIcon>
            Settings
          </Link>
        </Flex>
      </Drawer>
    </>
  );
};
