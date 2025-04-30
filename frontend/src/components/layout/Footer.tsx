import { Container, Group, Text, Anchor, Flex } from "@mantine/core";

export const Footer = () => {
  return (
    <Container size="lg" py="sm">
      <Flex
        justify="space-between"
        align="center"
        direction={{ base: "column", sm: "row" }}
      >
        <Text size="xs" c="dimmed" mb={{ base: "xs", sm: 0 }}>
          &copy; {new Date().getFullYear()} SkillSync. All rights reserved.
        </Text>

        <Group gap="md">
          <Anchor
            href="#"
            size="xs"
            c="dimmed"
            className="hover:text-blue-500 transition-colors"
          >
            Terms of Service
          </Anchor>
          <Anchor
            href="#"
            size="xs"
            c="dimmed"
            className="hover:text-blue-500 transition-colors"
          >
            Privacy Policy
          </Anchor>
          <Anchor
            href="#"
            size="xs"
            c="dimmed"
            className="hover:text-blue-500 transition-colors"
          >
            Contact Us
          </Anchor>
        </Group>
      </Flex>
    </Container>
  );
};
