import { Outlet, useNavigate } from "react-router-dom";
import { AppShell, Container, Loader, Center } from "@mantine/core";
import { DoubleNavbar } from "./DoubleNavbar";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { HeaderSimple } from "./HeaderSimple";
import { Footer } from "./Footer";

export const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpened, setSidebarOpened] = useState(false);

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  // Only render the dashboard if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: sidebarOpened ? 250 : 60,
        breakpoint: "sm",
      }}
    >
      <AppShell.Header>
        <HeaderSimple />
      </AppShell.Header>

      <AppShell.Navbar>
        <DoubleNavbar
          collapsed={!sidebarOpened}
          onToggle={() => setSidebarOpened((prev) => !prev)}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="lg" py="md">
          <Outlet />
        </Container>
      </AppShell.Main>

      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};
