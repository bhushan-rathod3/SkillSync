### **SkillSync – Freelance Collaboration Platform API Documentation**

---

## **Overview of Roles**

### **1. Client**

- **Can**:
  - Create projects.
  - View all bids for their projects.
  - Message freelancers through their projects.
- **Cannot**:
  - Place bids on projects.
  - Update bids.

---

### **2. Freelancer**

- **Can**:
  - View all projects.
  - Place bids on projects.
  - Update their own bids.
  - Message clients through projects.

---

### **3. Admin**

- **Can**:
  - Manage users, projects, and skills (if implemented).
  - Perform actions restricted to admin roles (future scope).

---

## **Authentication Module**

### **1. Login**

- **Endpoint**: `POST /auth/login`
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**:
  ```json
  {
    "accessToken": "jwt-token"
  }
  ```
- **Role Required**: None (open to all users).

---

### **2. Register**

- **Endpoint**: `POST /users/register`
- **Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123",
    "role": "freelancer"
  }
  ```
- Optional payload - bio , profileImage , skills

- **Expected Response**:

  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "freelancer"
  }
  ```

- **Role Required**: None (open to all users).

---

## **Users Module**

### **1. Get User Profile**

- **Endpoint**: `GET /users/profile`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Expected Response**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "freelancer",
    "bio": "I build awesome projects!",
    "profileImage": null
  }
  ```
- **Role Required**: Any authenticated user.

### **2. Update User Profile**

- **Endpoint**: `PATCH /users/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Expected Response**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "freelancer",
    "bio": "I build awesome projects!",
    "profileImage": null
  }
  ```
- **Role Required**: Any authenticated user (Can only update one's own profile).

---

## **Projects Module**

### **1. Create a Project**

- **Endpoint**: `POST /projects`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Payload**:
  ```json
  {
    "title": "Build a portfolio website",
    "category": "Web Development",
    "description": "I need a personal portfolio site made with ReactJS.",
    "budget": 800,
    "deadline": "2025-06-15"
  }
  ```
- **Expected Response**:
  ```json
  {
    "id": 1,
    "title": "Build a portfolio website",
    "category": "Web Development",
    "description": "I need a personal portfolio site made with ReactJS.",
    "budget": 800,
    "deadline": "2025-06-15",
    "status": "open",
    "client": { "id": 1, "name": "John Doe" }
  }
  ```
- **Role Required**: `client`.

---

### **2. Get All Projects**

- **Endpoint**: `GET /projects`
- **Expected Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Build a portfolio website",
      "category": "Web Development",
      "budget": 800,
      "deadline": "2025-06-15",
      "status": "open"
    }
  ]
  ```
- **Role Required**: None (open to all users).

---

### **3. Get Project with ID**

- **Endpoint**: `GET /projects/:id`
- **Expected Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Build a portfolio website",
      "category": "Web Development",
      "budget": 800,
      "deadline": "2025-06-15",
      "status": "open"
    }
  ]
  ```
- **Role Required**: None (open to all users).

---

## **Bids Module**

### **1. Place a Bid**

- **Endpoint**: `POST /bids/project/:projectId`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Payload**:
  ```json
  {
    "bidAmount": 500,
    "durationDays": 7,
    "bidMessage": "I can complete this project in 7 days."
  }
  ```
- **Expected Response**:
  ```json
  {
    "id": 1,
    "bidAmount": 500,
    "durationDays": 7,
    "bidMessage": "I can complete this project in 7 days.",
    "project": { "id": 1 },
    "freelancer": { "id": 2, "name": "Freelancer One" }
  }
  ```
- **Role Required**: `freelancer`.

---

### **2. Update a Bid**

- **Endpoint**: `PATCH /bids/:bidId`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Payload**:
  ```json
  {
    "bidAmount": 600,
    "durationDays": 5
  }
  ```
- **Expected Response**:
  ```json
  {
    "id": 1,
    "bidAmount": 600,
    "durationDays": 5,
    "bidMessage": "I can complete this project in 7 days.",
    "project": { "id": 1 },
    "freelancer": { "id": 2, "name": "Freelancer One" }
  }
  ```
- **Role Required**: `freelancer`.

---

### **3. Get All Bids for a Project**

- **Endpoint**: `GET /bids/project/:projectId`
- **Expected Response**:
  ```json
  [
    {
      "id": 1,
      "bidAmount": 600,
      "durationDays": 5,
      "bidMessage": "I can complete this project in 7 days.",
      "project": { "id": 1 },
      "freelancer": { "id": 2, "name": "Freelancer One" }
    },
    {
      "id": 2,
      "bidAmount": 700,
      "durationDays": 6,
      "bidMessage": "I can complete this project faster.",
      "project": { "id": 1 },
      "freelancer": { "id": 3, "name": "Freelancer Two" }
    }
  ]
  ```
- **Role Required**: None (open to all users).

---

## **Messages Module**

### **1. Send a Message**

- **Endpoint**: `POST /messages/project/:projectId`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Payload**:
  ```json
  {
    "message": "Hello, I have a question about the project."
  }
  ```
- **Expected Response**:
  ```json
  {
    "id": 1,
    "message": "Hello, I have a question about the project.",
    "project": { "id": 1 },
    "sender": { "id": 2 },
    "receiver": { "id": 1 },
    "createdAt": "2025-04-28T12:00:00.000Z"
  }
  ```
- **Role Required**: `freelancer` or `client`.

---

### **2. Get Messages for a Project**

- **Endpoint**: `GET /messages/project/:projectId`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Expected Response**:
  ```json
  [
    {
      "id": 1,
      "message": "Hello, I have a question about the project.",
      "project": { "id": 1 },
      "sender": { "id": 2 },
      "receiver": { "id": 1 },
      "createdAt": "2025-04-28T12:00:00.000Z"
    }
  ]
  ```
- **Role Required**:
  - `freelancer`: Can only see their own messages.
  - `client`: Can see all messages for their project.

---

================================================================

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
