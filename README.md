# Mini Task Manager (TaskSpace)

This is a simple task manager web app built using **Next.js (App Router)**, **Express.js (TypeScript)**, and **MongoDB**. 

It has a clean dark-mode interface and allows you to add tasks, view them, check them off as completed, and delete them.

---

## What's Inside

The project is split into a frontend and backend directory for clean separation of concerns:

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS v4, and Lucide icons.
- **Backend**: Node.js, Express, Mongoose, and Zod for validating request data.
- **Zero-Setup Database**: If you don't have MongoDB installed or running locally, the backend automatically spins up an in-memory database server (`mongodb-memory-server`). The app will work right out of the box without any database configuration.

---

## Project Structure

```text
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/db.ts         # Database connection & memory server setup
│   │   ├── controllers/         # Task CRUD logic
│   │   ├── middleware/          # Zod validation & global error handlers
│   │   ├── models/              # Mongoose Task Schema
│   │   ├── routes/              # Express Router
│   │   └── index.ts             # Express Server entry point
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App router (pages, layout, globals.css)
│   │   ├── components/          # AddModal, ConfirmationModal, TaskCard, TaskList
│   │   ├── services/api.ts      # Fetch API wrapper
│   │   └── types/               # TypeScript interfaces
└── package.json                 # Monorepo scripts to run everything together
```

---

## How to Run It Local

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher is recommended).

### 1. Install dependencies
Run this command in the root folder of the project to install all packages for both the frontend and backend:
```bash
npm run install:all
```

### 2. Configure the Database (Optional)
If you want to use your own local MongoDB instance or MongoDB Atlas:
1. Create a `.env` file in the `backend/` directory.
2. Add your connection string:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri_here
   ```
*If you leave `MONGODB_URI` blank, the app will run using the in-memory database fallback.*

### 3. Start the servers
Run the following command in the root directory:
```bash
npm run dev
```
This runs both the backend (on port 5000) and frontend (on port 3000) concurrently. 

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the app.

---

## Some Design Decisions

- **Monorepo setup**: Kept the frontend and backend in separate directories so their dependencies don't mix. It makes it cleaner to manage and deploy.
- **Optimistic UI Updates**: When you click to complete or delete a task, the UI updates instantly without waiting for the server response. If the network call fails, it rolls back. This keeps the app feeling snappy.
- **Zod for Validation**: Implemented strict schema validation on the backend using Zod. If a request has an empty title or invalid data, the backend returns a clear error message (400 Bad Request) which is shown on the frontend.
- **Global Error Handling**: Express middleware catches any database or validation errors and returns a consistent JSON format instead of crashing the server.
