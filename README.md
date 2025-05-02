# SkillSync - Freelance Collaboration Platform

SkillSync is a comprehensive freelance collaboration platform that connects clients with skilled freelancers. The platform facilitates project posting, bidding, messaging, milestone tracking, and payment processing.

## Demo Video

[SkillSync Demo](https://drive.google.com/file/d/1hDB70cPfKyRu3Pxi704GB7LWrev-Z-L5/view?usp=sharing)

## Table of Contents

- [Getting Started](#getting-started)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Backend API Documentation](#backend-api-documentation)
- [Frontend Architecture](#frontend-architecture)
- [Demo Video](#demo-video)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Backend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/bhushan-rathod3/SkillSync.git
   cd skillsync
   ```

2. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

3. Configure environment variables

   ```
   # Create a .env file with the following variables
   NODE_ENV=development
   PORT=3000

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=skillsync

   # JWT Configuration
   JWT_SECRET=secret_key
   JWT_REFRESH_SECRET=refresh_secret_key
   JWT_EXPIRATION=3600
   JWT_REFRESH_EXPIRATION=604800

   # File Upload Configuration
   UPLOAD_DIRECTORY=./uploads
   MAX_FILE_SIZE=5242880 # 5MB
   ```

4. Start the backend server

   ```bash
   npm run start:dev
   ```

   The database will be automatically created and synchronized due to the `synchronize: true` setting in the TypeORM configuration.

5. Seed the database with initial data

   ```bash
   npm run seed
   ```

   This will populate the database with sample users, projects, skills, and other data for testing.

### Frontend Setup

1. Install frontend dependencies

   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables

   ```
   # Create a .env file with the following variables
   VITE_API_URL=http://localhost:3000
   ```

3. Start the frontend development server

   ```bash
   npm run dev
   ```

4. Access the application at http://localhost:5173

### Navigation Guide

- **Login/Register**: Start by creating an account or logging in
- **Dashboard**: View your projects, bids, and messages
- **Projects**: Browse available projects or create new ones (client only)
- **Bids**: Submit bids for projects (freelancer only) or review received bids (client only)
- **Messages**: Communicate with clients or freelancers
- **Profile**: Update your personal information and skills

## Entity Relationship Diagram

[SkillSync ERD](https://drive.google.com/file/d/17u70e0o8xka5aGobHT_3eXfoMEA0pjHz/view?usp=sharing)

### Core Entities

1. **User**

   - Central entity with roles (Client, Freelancer, Admin)
   - Contains profile information and authentication details
   - Connected to projects, bids, messages, files, and skills

2. **Project**

   - Created by clients
   - Can be assigned to freelancers
   - Contains details like title, description, budget, and deadline
   - Associated with bids, milestones, messages, and files

3. **Bid**

   - Submitted by freelancers for specific projects
   - Contains bid amount, duration, and message
   - Can be approved or rejected by clients

4. **Skill & UserSkill**

   - Skills represent freelancer capabilities
   - UserSkill is a junction entity connecting users to skills

5. **Message**

   - Communication between users related to projects
   - Contains sender, receiver, project context, and content

6. **File**

   - Attachments uploaded by users
   - Can be associated with projects or users

7. **Milestone**

   - Project deliverables with deadlines and payment amounts
   - Track project progress and facilitate payments

8. **Invoice**
   - Generated for milestones
   - Tracks payment status

### Entity Relationships

- A **User** can create multiple **Projects** (as a client)
- A **User** can be assigned to multiple **Projects** (as a freelancer)
- A **User** can submit multiple **Bids** (as a freelancer)
- A **Project** can receive multiple **Bids** from different freelancers
- A **Project** can have multiple **Milestones** for tracking progress
- A **Milestone** has one **Invoice** for payment processing
- **Users** can send and receive **Messages** related to **Projects**
- **Users** can upload **Files** related to themselves or **Projects**
- **Users** can have multiple **Skills** through the **UserSkill** junction

## Backend API Documentation

The SkillSync backend provides a comprehensive RESTful API for all platform operations. Here's a breakdown of the main endpoints:

### Authentication

#### POST /auth/login

- **Description**: Authenticate a user and get access tokens
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt_token_here",
    "refresh_token": "refresh_token_here"
  }
  ```

#### POST /auth/refresh

- **Description**: Refresh an expired access token
- **Request Body**:
  ```json
  {
    "refresh_token": "refresh_token_here"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "new_jwt_token_here",
    "refresh_token": "new_refresh_token_here"
  }
  ```

### Users

#### POST /users/register

- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "client",
    "bio": "I'm a client looking for skilled freelancers",
    "skills": ["JavaScript", "React", "Node.js"] // Only for freelancers
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "access_token": "jwt_token_here",
      "refresh_token": "refresh_token_here"
    },
    "message": "User registered successfully"
  }
  ```

#### GET /users/profile

- **Description**: Get the current user's profile
- **Headers**: Authorization: Bearer {token}
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "bio": "I'm a client looking for skilled freelancers",
      "profileImage": "profile-image.jpg",
      "userSkills": []
    }
  }
  ```

#### PATCH /users/profile

- **Description**: Update the current user's profile
- **Headers**: Authorization: Bearer {token}
- **Request Body** (multipart/form-data):
  ```
  name: "John Doe Updated"
  bio: "Updated bio information"
  skills: ["JavaScript", "React", "Node.js"]
  profileImage: (file upload)
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "John Doe Updated",
      "email": "john@example.com",
      "role": "client",
      "bio": "Updated bio information",
      "profileImage": "new-profile-image.jpg",
      "userSkills": [
        {
          "id": 1,
          "skill": {
            "id": 1,
            "name": "JavaScript"
          }
        },
        {
          "id": 2,
          "skill": {
            "id": 2,
            "name": "React"
          }
        },
        {
          "id": 3,
          "skill": {
            "id": 3,
            "name": "Node.js"
          }
        }
      ]
    },
    "message": "Profile updated successfully"
  }
  ```

#### GET /users/freelancers

- **Description**: Get a list of freelancers with their skills
- **Headers**: Authorization: Bearer {token}
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "freelancer",
        "bio": "Experienced web developer",
        "profileImage": "jane-profile.jpg",
        "userSkills": [
          {
            "id": 1,
            "skill": {
              "id": 1,
              "name": "JavaScript"
            }
          },
          {
            "id": 2,
            "skill": {
              "id": 2,
              "name": "React"
            }
          }
        ]
      }
    ]
  }
  ```

### Projects

#### POST /projects

- **Description**: Create a new project (client only)
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "title": "Build a Website",
    "category": "Web Development",
    "description": "I need a responsive website built with React",
    "budget": 1000,
    "deadline": "2023-12-31T00:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Build a Website",
      "category": "Web Development",
      "description": "I need a responsive website built with React",
      "budget": 1000,
      "deadline": "2023-12-31T00:00:00.000Z",
      "status": "open",
      "client": {
        "id": 1,
        "name": "John Doe"
      },
      "createdAt": "2023-06-01T12:00:00.000Z"
    },
    "message": "Project created successfully"
  }
  ```

#### GET /projects

- **Description**: Get a list of projects (filtered by status, category, etc.)
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - status: "open" | "assigned" | "completed"
  - category: string
  - page: number
  - limit: number
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": 1,
          "title": "Build a Website",
          "category": "Web Development",
          "description": "I need a responsive website built with React",
          "budget": 1000,
          "deadline": "2023-12-31T00:00:00.000Z",
          "status": "open",
          "client": {
            "id": 1,
            "name": "John Doe"
          },
          "createdAt": "2023-06-01T12:00:00.000Z",
          "bids": []
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

#### GET /projects/:id

- **Description**: Get a specific project by ID
- **Headers**: Authorization: Bearer {token}
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Build a Website",
      "category": "Web Development",
      "description": "I need a responsive website built with React",
      "budget": 1000,
      "deadline": "2023-12-31T00:00:00.000Z",
      "status": "open",
      "client": {
        "id": 1,
        "name": "John Doe"
      },
      "assignedFreelancer": null,
      "bids": [],
      "milestones": [],
      "files": [],
      "createdAt": "2023-06-01T12:00:00.000Z"
    }
  }
  ```

#### PATCH /projects/:id

- **Description**: Update a project (client only)
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "title": "Updated Website Project",
    "budget": 1200,
    "status": "assigned",
    "assignedFreelancerId": 2
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Updated Website Project",
      "category": "Web Development",
      "description": "I need a responsive website built with React",
      "budget": 1200,
      "deadline": "2023-12-31T00:00:00.000Z",
      "status": "assigned",
      "client": {
        "id": 1,
        "name": "John Doe"
      },
      "assignedFreelancer": {
        "id": 2,
        "name": "Jane Smith"
      },
      "createdAt": "2023-06-01T12:00:00.000Z"
    },
    "message": "Project updated successfully"
  }
  ```

### Bids

#### POST /bids

- **Description**: Submit a bid for a project (freelancer only)
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "projectId": 1,
    "bidAmount": 950,
    "durationDays": 14,
    "bidMessage": "I can build this website with React and have it ready in 2 weeks."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "projectId": 1,
      "project": {
        "id": 1,
        "title": "Build a Website"
      },
      "freelancerId": 2,
      "freelancer": {
        "id": 2,
        "name": "Jane Smith"
      },
      "bidAmount": 950,
      "durationDays": 14,
      "bidMessage": "I can build this website with React and have it ready in 2 weeks.",
      "status": "pending",
      "createdAt": "2023-06-02T12:00:00.000Z"
    },
    "message": "Bid submitted successfully"
  }
  ```

#### GET /bids

- **Description**: Get bids (filtered by project, status, etc.)
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - projectId: number
  - status: "pending" | "approved" | "rejected"
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "projectId": 1,
        "project": {
          "id": 1,
          "title": "Build a Website"
        },
        "freelancerId": 2,
        "freelancer": {
          "id": 2,
          "name": "Jane Smith"
        },
        "bidAmount": 950,
        "durationDays": 14,
        "bidMessage": "I can build this website with React and have it ready in 2 weeks.",
        "status": "pending",
        "createdAt": "2023-06-02T12:00:00.000Z"
      }
    ]
  }
  ```

#### PATCH /bids/:id/approve

- **Description**: Approve a bid (client only)
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
  ```json
  {
    "status": "approved"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "bid": {
        "id": 1,
        "status": "approved"
      },
      "project": {
        "id": 1,
        "status": "assigned",
        "assignedFreelancer": {
          "id": 2,
          "name": "Jane Smith"
        }
      }
    },
    "message": "Bid approved and project assigned"
  }
  ```

### Messages

#### POST /messages

- **Description**: Send a message
- **Headers**: Authorization: Bearer {token}
- **Request Body** (multipart/form-data):
  ```
  projectId: 1
  receiverId: 2
  message: "Hello, I have a question about your bid."
  attachment: (file upload - optional)
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "project": {
        "id": 1,
        "title": "Build a Website"
      },
      "sender": {
        "id": 1,
        "name": "John Doe"
      },
      "receiver": {
        "id": 2,
        "name": "Jane Smith"
      },
      "message": "Hello, I have a question about your bid.",
      "attachmentUrl": "message-attachment.pdf",
      "createdAt": "2023-06-03T12:00:00.000Z"
    },
    "message": "Message sent successfully"
  }
  ```

#### GET /messages

- **Description**: Get messages for a project
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - projectId: number
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "project": {
          "id": 1,
          "title": "Build a Website"
        },
        "sender": {
          "id": 1,
          "name": "John Doe"
        },
        "receiver": {
          "id": 2,
          "name": "Jane Smith"
        },
        "message": "Hello, I have a question about your bid.",
        "attachmentUrl": "message-attachment.pdf",
        "createdAt": "2023-06-03T12:00:00.000Z"
      }
    ]
  }
  ```

### Files

#### POST /files

- **Description**: Upload a file
- **Headers**: Authorization: Bearer {token}
- **Request Body** (multipart/form-data):
  ```
  projectId: 1 (optional)
  file: (file upload)
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "uploader": {
        "id": 1,
        "name": "John Doe"
      },
      "project": {
        "id": 1,
        "title": "Build a Website"
      },
      "fileUrl": "uploaded-file.pdf",
      "fileType": "application/pdf",
      "createdAt": "2023-06-04T12:00:00.000Z"
    },
    "message": "File uploaded successfully"
  }
  ```

#### GET /files

- **Description**: Get files (filtered by project)
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - projectId: number
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "uploader": {
          "id": 1,
          "name": "John Doe"
        },
        "project": {
          "id": 1,
          "title": "Build a Website"
        },
        "fileUrl": "uploaded-file.pdf",
        "fileType": "application/pdf",
        "createdAt": "2023-06-04T12:00:00.000Z"
      }
    ]
  }
  ```

### Skills

#### GET /skills

- **Description**: Get all available skills
- **Headers**: Authorization: Bearer {token}
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "JavaScript"
      },
      {
        "id": 2,
        "name": "React"
      },
      {
        "id": 3,
        "name": "Node.js"
      }
    ]
  }
  ```

## Frontend Architecture

The SkillSync frontend is built with React, TypeScript, and Material-UI, providing a responsive and intuitive user interface for both clients and freelancers.

### Key Features

1. **Authentication System**

   - Login and registration forms with validation
   - JWT token management with refresh capabilities
   - Role-based access control

2. **Dashboard**

   - Personalized dashboards for clients and freelancers
   - Overview of projects, bids, and messages
   - Quick access to key platform features

3. **Project Management**

   - Project creation and editing for clients
   - Project browsing and filtering for freelancers
   - Detailed project view with bids, messages, and files

4. **Bidding System**

   - Bid submission for freelancers
   - Bid review and approval for clients
   - Bid status tracking

5. **Messaging System**

   - Real-time messaging between clients and freelancers
   - Project-specific conversation threads
   - File attachment support

6. **Profile Management**

   - User profile editing
   - Skill management for freelancers
   - Profile image upload

7. **File Management**
   - File upload and download
   - Project-specific file organization
   - Support for various file types

### Technology Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: Static typing for improved code quality
- **Material-UI**: Component library for consistent design
- **React Router**: Navigation and routing
- **Axios**: HTTP client for API requests
- **React Hook Form**: Form handling and validation
- **Zustand**: State management
- **React Toastify**: Notification system

### Directory Structure

```
frontend/
├── public/
├── src/
│   ├── api/           # API service functions
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts (auth, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Page layouts
│   ├── pages/         # Page components
│   │   ├── auth/      # Authentication pages
│   │   ├── client/    # Client-specific pages
│   │   └── freelancer/ # Freelancer-specific pages
│   ├── store/         # State management
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
└── package.json
```
