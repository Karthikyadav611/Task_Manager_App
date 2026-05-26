# Task Manager App

A full-stack internship assignment project where users can register, login, and manage personal tasks across three workflow stages: **Todo**, **In Progress**, and **Done**.

## Features

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected dashboard route
- Logout flow and invalid-token auto logout
- Task CRUD operations (create, read, update, delete)
- Task stage updates between Todo, In Progress, and Done
- User-scoped task visibility (each user only sees their own tasks)
- Loading, empty, success, and error states across auth + dashboard
- Responsive UI with clean card-based task board

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT, bcryptjs

## Folder Structure

```text
task-manager-app/
  frontend/
    src/
      components/
      pages/
      context/
      services/
      styles/
      App.jsx
      main.jsx
    .env.example
    index.html
    package.json
    README.md
    vite.config.js

  backend/
    models/
    routes/
    controllers/
    middleware/
    config/
    .env.example
    server.js
    package.json

  README.md
```

## Local Setup

### 1) Clone and open project

```bash
git clone <your-repo-url>
cd task-manager-app
```

### 2) Backend setup

```bash
cd backend
npm install
npm run dev
```

### 3) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager-app
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks (JWT Protected)

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Deployment Preparation

### Frontend (Vercel/Netlify)

1. Import `frontend` folder as the project root.
2. Set environment variable:
   - `VITE_API_URL=<your-deployed-backend-url>/api`
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Render/Railway)

1. Import `backend` folder as the service root.
2. Set environment variables:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (frontend deployed URL)
3. Start command: `npm start`
4. Ensure MongoDB network access allows your backend service.

## Deployment Links (Placeholders)

- Frontend: `https://your-frontend-url`
- Backend: `https://your-backend-url`

## Assumptions

- Single user role (no admin/user role separation)
- JWT is stored in localStorage per assignment requirement
- MongoDB connection URI is provided externally via env variables

## Tradeoffs

- Kept architecture simple and focused for internship scope
- Used inline toast-style feedback instead of adding notification libraries
- No refresh-token flow to avoid overcomplicating the assignment

## Technical Decisions

- React Context is used for lightweight auth state management
- Axios interceptors attach JWT and handle `401` by logging user out
- Mongoose `timestamps` are used for `createdAt` and `updatedAt`
- Task routes are protected by JWT middleware and scoped by `userId`

## AI Usage Note

AI-assisted tools were used during development, and the backend implementation is included as required by the assignment.

## Screenshots (Placeholder)

- Register Page: `[Add screenshot here]`
- Login Page: `[Add screenshot here]`
- Dashboard Page: `[Add screenshot here]`
