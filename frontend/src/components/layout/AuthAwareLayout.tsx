import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { PublicNavbar } from "./PublicNavbar";
import { Footer } from "./Footer";
import { AppShell, Container } from "@mantine/core";
import { useAuth } from "../../contexts/AuthContext";

export const AuthAwareLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AppShell header={{ height: 60 }} footer={{ height: 50 }} padding="md">
      <AppShell.Header className="border-b border-gray-100">
        {isAuthenticated ? <Navbar /> : <PublicNavbar />}
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" py="md">
          <Outlet />
        </Container>
      </AppShell.Main>

      <AppShell.Footer className="border-t border-gray-100">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};
