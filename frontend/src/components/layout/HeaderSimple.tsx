import { useState } from "react";
import { Burger, Container, Group, Switch, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSimple.module.css";

const links = [
  { link: "/about", label: "Features" },
  { link: "/pricing", label: "Pricing" },
  { link: "/learn", label: "Learn" },
  { link: "/community", label: "Community" },
];

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const [darkMode, setDarkMode] = useState(false);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        {/* Move SkillSync to the leftmost corner above the sidebar */}
        <Title
          order={3}
          c="blue"
          style={{ position: "absolute", left: "1rem" }}
        >
          SkillSync
        </Title>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Group>
          <Switch
            checked={darkMode}
            onChange={(event) => setDarkMode(event.currentTarget.checked)}
            label="Dark Mode"
          />
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Group>
      </Container>
    </header>
  );
}
