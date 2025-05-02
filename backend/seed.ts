import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Skill } from './src/skills/entities/skill.entity';
import { Project } from 'src/projects/entities/project.entity';
import { UserRole } from './src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Bid, BidStatus } from './src/bids/entities/bid.entity';
import { Message } from './src/messages/entities/message.entity';
import { File } from './src/files/entities/file.entity';
import { UserSkill } from './src/skills/entities/user-skill.entity';
import * as dotenv from 'dotenv';
import { Milestone } from 'src/milestones/entities/milestone.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
dotenv.config();

// Setup datasource manually
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'skillsync',
  entities: [
    User,
    Skill,
    Project,
    Bid,
    Message,
    File,
    UserSkill,
    Milestone,
    Invoice,
  ],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  console.log('Database connected for seeding...');

  // Get repositories
  const userRepo = AppDataSource.getRepository(User);
  const skillRepo = AppDataSource.getRepository(Skill);
  const projectRepo = AppDataSource.getRepository(Project);
  const bidRepo = AppDataSource.getRepository(Bid);
  const userSkillRepo = AppDataSource.getRepository(UserSkill);

  // Clear existing data (truncate all tables in reverse order of dependencies)
  console.log('Clearing existing data...');
  await AppDataSource.query('TRUNCATE TABLE messages CASCADE');
  await AppDataSource.query('TRUNCATE TABLE files CASCADE');
  await AppDataSource.query('TRUNCATE TABLE bids CASCADE');
  await AppDataSource.query('TRUNCATE TABLE user_skills CASCADE');
  await AppDataSource.query('TRUNCATE TABLE projects CASCADE');
  await AppDataSource.query('TRUNCATE TABLE skills CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "users" CASCADE');
  console.log('✅ Database cleared.');

  // --- 1. Create Mock Users ---
  console.log('Creating users...');

  // Clients
  const client1 = userRepo.create({
    name: 'Client One',
    email: 'client1@example.com',
    password: 'password123',
    role: UserRole.CLIENT,
    bio: 'I need awesome projects done! Looking for skilled freelancers.',
  });

  const client2 = userRepo.create({
    name: 'Client Two',
    email: 'client2@example.com',
    password: 'password123',
    role: UserRole.CLIENT,
    bio: 'Tech startup founder looking for development help.',
  });

  // Freelancers
  const freelancer1 = userRepo.create({
    name: 'Freelancer One',
    email: 'freelancer1@example.com',
    password: 'password123',
    role: UserRole.FREELANCER,
    bio: 'Full-stack developer with 5 years of experience in React and Node.js.',
  });

  const freelancer2 = userRepo.create({
    name: 'Freelancer Two',
    email: 'freelancer2@example.com',
    password: 'password123',
    role: UserRole.FREELANCER,
    bio: 'UI/UX designer specializing in mobile app interfaces.',
  });

  const freelancer3 = userRepo.create({
    name: 'Freelancer Three',
    email: 'freelancer3@example.com',
    password: 'password123',
    role: UserRole.FREELANCER,
    bio: 'Backend developer with expertise in database optimization and API design.',
  });

  await userRepo.save([
    client1,
    client2,
    freelancer1,
    freelancer2,
    freelancer3,
  ]);
  console.log('✅ Users seeded.');

  // --- 2. Create Mock Skills ---
  console.log('Creating skills...');
  const skills = skillRepo.create([
    { name: 'NestJS' },
    { name: 'ReactJS' },
    { name: 'TypeScript' },
    { name: 'JavaScript' },
    { name: 'Node.js' },
    { name: 'HTML/CSS' },
    { name: 'UI/UX Design' },
    { name: 'PostgreSQL' },
    { name: 'MongoDB' },
    { name: 'AWS' },
    { name: 'Docker' },
    { name: 'GraphQL' },
    { name: 'REST API' },
    { name: 'Mobile Development' },
    { name: 'React Native' },
  ]);

  const savedSkills = await skillRepo.save(skills);
  console.log('✅ Skills seeded.');

  // --- 3. Assign Skills to Freelancers ---
  console.log('Assigning skills to freelancers...');

  // Freelancer 1: Full-stack developer
  const freelancer1Skills = [
    { user: freelancer1, skill: savedSkills[0], yearsOfExperience: 3 }, // NestJS
    { user: freelancer1, skill: savedSkills[1], yearsOfExperience: 5 }, // ReactJS
    { user: freelancer1, skill: savedSkills[2], yearsOfExperience: 4 }, // TypeScript
    { user: freelancer1, skill: savedSkills[3], yearsOfExperience: 5 }, // JavaScript
    { user: freelancer1, skill: savedSkills[4], yearsOfExperience: 4 }, // Node.js
  ];

  // Freelancer 2: UI/UX designer
  const freelancer2Skills = [
    { user: freelancer2, skill: savedSkills[5], yearsOfExperience: 4 }, // HTML/CSS
    { user: freelancer2, skill: savedSkills[6], yearsOfExperience: 5 }, // UI/UX Design
    { user: freelancer2, skill: savedSkills[1], yearsOfExperience: 3 }, // ReactJS
    { user: freelancer2, skill: savedSkills[14], yearsOfExperience: 2 }, // React Native
  ];

  // Freelancer 3: Backend developer
  const freelancer3Skills = [
    { user: freelancer3, skill: savedSkills[0], yearsOfExperience: 4 }, // NestJS
    { user: freelancer3, skill: savedSkills[4], yearsOfExperience: 5 }, // Node.js
    { user: freelancer3, skill: savedSkills[7], yearsOfExperience: 5 }, // PostgreSQL
    { user: freelancer3, skill: savedSkills[8], yearsOfExperience: 3 }, // MongoDB
    { user: freelancer3, skill: savedSkills[12], yearsOfExperience: 4 }, // REST API
  ];

  await userSkillRepo.save([
    ...freelancer1Skills,
    ...freelancer2Skills,
    ...freelancer3Skills,
  ]);
  console.log('✅ User skills assigned.');

  // --- 4. Create Mock Projects ---
  console.log('Creating projects...');

  // Open projects
  const project1 = projectRepo.create({
    title: 'Build a portfolio website',
    category: 'Web Development',
    description:
      'I need a personal portfolio site made with ReactJS. The site should be responsive and showcase my work as a photographer.',
    budget: 800,
    deadline: new Date('2025-06-15'),
    client: client1,
    status: 'open',
  });

  const project2 = projectRepo.create({
    title: 'E-commerce platform development',
    category: 'Web Development',
    description:
      'Looking for a developer to build a full e-commerce platform with product listings, shopping cart, and payment integration.',
    budget: 2500,
    deadline: new Date('2025-07-30'),
    client: client2,
    status: 'open',
  });

  const project3 = projectRepo.create({
    title: 'Mobile app UI design',
    category: 'UI/UX Design',
    description:
      'Need a skilled designer to create the user interface for a fitness tracking mobile app.',
    budget: 1200,
    deadline: new Date('2025-06-01'),
    client: client1,
    status: 'open',
  });

  // In-progress project
  const project4 = projectRepo.create({
    title: 'API development for inventory system',
    category: 'Backend Development',
    description:
      'Develop a RESTful API for an inventory management system using NestJS and PostgreSQL.',
    budget: 1800,
    deadline: new Date('2025-08-15'),
    client: client2,
    status: 'assigned',
    assignedFreelancer: freelancer3,
  });

  // Completed project
  const project5 = projectRepo.create({
    title: 'Landing page redesign',
    category: 'Web Development',
    description:
      'Redesign the landing page for our SaaS product to improve conversion rates.',
    budget: 600,
    deadline: new Date('2025-05-01'),
    client: client1,
    status: 'completed',
    assignedFreelancer: freelancer1,
  });

  await projectRepo.save([project1, project2, project3, project4, project5]);
  console.log('✅ Projects seeded.');

  // --- 5. Create Mock Bids ---
  console.log('Creating bids...');

  // Bids for project 1
  const bid1 = bidRepo.create({
    bidAmount: 750,
    bidMessage:
      'I can build a responsive portfolio website using React and styled-components. I have experience with photographer portfolios.',
    durationDays: 14,
    status: BidStatus.PENDING,
    project: project1,
    freelancer: freelancer1,
  });

  const bid2 = bidRepo.create({
    bidAmount: 850,
    bidMessage:
      'I specialize in creating beautiful, responsive websites with modern UI/UX principles. I can deliver a portfolio that stands out.',
    durationDays: 10,
    status: BidStatus.PENDING,
    project: project1,
    freelancer: freelancer2,
  });

  // Bids for project 2
  const bid3 = bidRepo.create({
    bidAmount: 2300,
    bidMessage:
      'I have built several e-commerce platforms and can deliver a complete solution with all the requested features.',
    durationDays: 30,
    status: BidStatus.PENDING,
    project: project2,
    freelancer: freelancer1,
  });

  // Bids for project 3
  const bid4 = bidRepo.create({
    bidAmount: 1100,
    bidMessage:
      'As a UI/UX specialist, I can create an intuitive and engaging interface for your fitness app that users will love.',
    durationDays: 15,
    status: BidStatus.PENDING,
    project: project3,
    freelancer: freelancer2,
  });

  // Accepted bid for project 4
  const bid5 = bidRepo.create({
    bidAmount: 1800,
    bidMessage:
      'I specialize in backend development and have extensive experience with NestJS and PostgreSQL. I can build a robust API for your inventory system.',
    durationDays: 25,
    status: BidStatus.APPROVED,
    project: project4,
    freelancer: freelancer3,
  });

  // Completed bid for project 5
  const bid6 = bidRepo.create({
    bidAmount: 600,
    bidMessage:
      'I can redesign your landing page with a focus on conversion optimization and modern design principles.',
    durationDays: 7,
    status: BidStatus.APPROVED,
    project: project5,
    freelancer: freelancer1,
  });

  await bidRepo.save([bid1, bid2, bid3, bid4, bid5, bid6]);
  console.log('✅ Bids seeded.');

  await AppDataSource.destroy();
  console.log('✅ Database connection closed.');
  console.log('🎉 Seeding completed successfully.');
}

seed().catch((error) => {
  console.error('❌ Seeding failed', error);
  process.exit(1);
});
