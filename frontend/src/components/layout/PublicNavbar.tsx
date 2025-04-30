import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Group, Container, Title, Flex } from "@mantine/core";

export const PublicNavbar = () => {
  return (
    <Container
      size="lg"
      h={60}
      style={{ display: "flex", alignItems: "center" }}
    >
      <Flex justify="space-between" align="center" w="100%">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Title order={3} c="blue" style={{ fontSize: "1.5rem" }}>
            SkillSync
          </Title>
        </Link>

        <Group gap="sm">
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Button size="sm">Register</Button>
          </Link>
        </Group>
      </Flex>
    </Container>
  );
};
