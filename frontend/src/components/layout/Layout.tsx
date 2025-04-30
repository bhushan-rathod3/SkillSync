import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AppShell, Container } from "@mantine/core";
import { DoubleNavbar } from "./DoubleNavbar";

export const Layout = () => {
  return (
    <AppShell header={{ height: 60 }} footer={{ height: 60 }}>
      <AppShell.Header>
        <DoubleNavbar />
      </AppShell.Header>

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
