import {
  Container,
  Image,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import IMAGES from "./images";
import classes from "./FeaturesImages.module.css";
import { useAuth } from "../../contexts/AuthContext";

// Data for client users
const clientData = [
  {
    image: "auditors",
    title: "Post Projects",
    description:
      "Create detailed project listings with your requirements and budget.",
  },
  {
    image: "lawyers",
    title: "Review Bids",
    description:
      "Evaluate proposals from skilled freelancers and choose the best match.",
  },
  {
    image: "accountants",
    title: "Track Progress",
    description:
      "Monitor project milestones and communicate directly with your freelancer.",
  },
  {
    image: "others",
    title: "Release Payments",
    description:
      "Pay for completed work and leave reviews for your freelancers.",
  },
];

// Data for freelancer users
const freelancerData = [
  {
    image: "auditors",
    title: "Find Projects",
    description:
      "Browse available projects that match your skills and expertise.",
  },
  {
    image: "lawyers",
    title: "Submit Bids",
    description:
      "Create compelling proposals to showcase why you're the best fit.",
  },
  {
    image: "accountants",
    title: "Deliver Quality",
    description:
      "Complete milestones on time and communicate effectively with clients.",
  },
  {
    image: "others",
    title: "Build Reputation",
    description:
      "Earn positive reviews and grow your freelancing business on SkillSync.",
  },
];

// Default data for other users
const defaultData = [
  {
    image: "auditors",
    title: "Freelancers",
    description:
      "Find projects that match your skills and bid on them to showcase your expertise.",
  },
  {
    image: "lawyers",
    title: "Clients",
    description:
      "Post projects and find the perfect freelancer to bring your ideas to life.",
  },
  {
    image: "accountants",
    title: "Agencies",
    description:
      "Manage multiple projects and freelancers to deliver high-quality work to clients.",
  },
  {
    image: "others",
    title: "Professionals",
    description:
      "Connect with other professionals and expand your network in your industry.",
  },
];

const data = [
  {
    image: "auditors",
    title: "Freelancers",
    description:
      "Find projects that match your skills and bid on them to showcase your expertise.",
  },
  {
    image: "lawyers",
    title: "Clients",
    description:
      "Post projects and find the perfect freelancer to bring your ideas to life.",
  },
  {
    image: "accountants",
    title: "Agencies",
    description:
      "Manage multiple projects and freelancers to deliver high-quality work to clients.",
  },
  {
    image: "others",
    title: "Professionals",
    description:
      "Connect with other professionals and expand your network in your industry.",
  },
];

export function FeaturesImages() {
  const items = data.map((item) => (
    <div className={classes.item} key={item.image}>
      <ThemeIcon
        variant="light"
        className={classes.itemIcon}
        size={60}
        radius="md"
      >
        <Image src={IMAGES[item.image]} />
      </ThemeIcon>
      <div>
        <Text fw={700} fz="lg" className={classes.itemTitle}>
          {item.title}
        </Text>
        <Text c="dimmed">{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>Use cases</Text>
      <Title className={classes.title} order={2}>
        SkillSync is <span className={classes.highlight}>for everyone</span> in
        the freelance ecosystem
      </Title>
      <Container size={660} p={0}>
        <Text c="dimmed" className={classes.description}>
          SkillSync connects talented freelancers with clients looking for
          quality work. Our platform makes it easy to find projects, submit
          bids, and collaborate effectively. Whether you're a freelancer,
          client, or agency, SkillSync has the tools you need to succeed.
        </Text>
      </Container>
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
