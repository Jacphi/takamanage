# Project Management App

This is a project management web application built with **Next.js** for the frontend and **Express.js** for the backend. It allows users to create, manage, and track the progress of projects and tasks.

## Features

- User authentication and authorization (register/login)
- Create, update, and delete projects
- Track project progress and completion
- Role-based access control (admin, member)

## Technologies

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [Express.js](https://expressjs.com/)
- **Database:** MongoDB (with Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **CSS Framework:** Tailwind CSS

## Installation

### Prerequisites

- Node.js (>= 14.x)
- MongoDB (>= 4.x)

### Clone the Repository

```bash
git clone git@github.com:Jacphi/takamanage.git
cd takamanage
```
### Backend Setup (Express.js)
- Navigate to the backend folder:
```bash
cd backend
```
- Install dependencies:
```bash
npm install
```
- Create a .env file with the following configuration:
```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```
- Start the backend server:
```bash
npm start
```

### Frontend Setup (Next.js)
- Navigate to the frontend folder:
```bash
cd frontend
```
- Install dependencies:
```bash
npm install
```
- Create a .env.local file with the backend API URL::
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
- Start the frontend server:
```bash
npm run dev
```

### Running:
- The backend API will run on http://localhost:5000
- The frontend will run on http://localhost:3000

### API Endpoints:
#### Authentication
- POST /auth/signup: Register a new user
- POST /auth/login: Login a user

#### Projects
- GET /auth/my-projects: Get active user's projects
- POST /projects/is-admin: Check if user is admin
- GET /projects/admin-projects: Get projects where user is admin
- POST /projects/create: Create new project
- POST /projects/add-member: Add new member to a project
- POST /projects/revoke-member: Remove member from a project
- GET /projects/:projectId/tasks: Get project's tasks
- GET /projects/:projectId/: Get a single project

#### Tasks
- GET /tasks/:taskId/: Get task's details
- POST /tasks/create: Create a task
- PUT /tasks/:taskId/: Update a task
- DELETE /tasks/:taskId/: Delete a task

### Deployment:
#### Backend (Express.js)
- Set up env variable in the .env file
- Run
```bash
npm start
```

#### Frontend (Next.js)
- Set up env variable in the .env.local file
- Run
```bash
npm run build
npm start
```
