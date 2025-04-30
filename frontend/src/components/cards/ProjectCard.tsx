import { IconEye } from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Project } from "../../types/project.types";
import classes from "./BadgeCard.module.css";

const categoryEmojis: Record<string, string> = {
  "Web Development": "🌐",
  "Mobile Development": "📱",
  "UI/UX Design": "🎨",
  "Graphic Design": "🖌️",
  "Content Writing": "✍️",
  "Digital Marketing": "📈",
  "Data Entry": "📊",
  Other: "🔧",
};

// Helper function to get status badge color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "open":
      return "green";
    case "assigned":
      return "blue";
    case "completed":
      return "gray";
    case "cancelled":
      return "red";
    default:
      return "gray";
  }
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Generate placeholder image URL based on project title
  const imageUrl = `https://source.unsplash.com/600x300/?${encodeURIComponent(
    project.category.toLowerCase()
  )}`;

  // Format deadline date
  const formattedDeadline = new Date(project.deadline).toLocaleDateString();

  // Create badges for project details
  const badges = [
    {
      emoji: categoryEmojis[project.category] || "🔧",
      label: project.category,
    },
    { emoji: "💰", label: `$${project.budget}` },
    { emoji: "📅", label: `Due: ${formattedDeadline}` },
  ];

  const features = badges.map((badge) => (
    <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={imageUrl} alt={project.title} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {project.title}
          </Text>
          <Badge
            size="sm"
            variant="filled"
            color={getStatusColor(project.status)}
          >
            {project.status.replace("_", " ")}
          </Badge>
        </Group>

        <Text fz="sm" mt="xs" lineClamp={3}>
          {project.description || "No description provided"}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Project Details
        </Text>
        <Group gap={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button
          radius="md"
          style={{ flex: 1 }}
          component={Link}
          to={`/projects/${project.id}`}
        >
          View Project
        </Button>
        <ActionIcon variant="default" radius="md" size={36}>
          <IconEye stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
