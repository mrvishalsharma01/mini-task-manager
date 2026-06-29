# TaskSpace - Mini Task Manager

TaskSpace is a minimalist, high-performance, and visually stunning web application built to manage daily tasks. It features a complete monorepo structure separating the Next.js frontend and Express backend, fully typed in TypeScript and styled with Tailwind CSS v4.

---

## Key Tech Stack & Features

- **Next.js 15 (App Router)**: Leverages Server and Client Components with optimized caching and routing.
- **Tailwind CSS v4**: Implements native CSS-first configuration, resulting in faster load times and smoother compilation.
- **Express + Node.js + Mongoose**: Clean REST API design with controllers, routes, validation schemas, and unified error middleware.
- **Zero-Config MongoDB Fallback**: Connects to your configured MongoDB database via `MONGODB_URI`. If none is provided, the backend automatically spins up an in-memory database using `mongodb-memory-server`. This allows evaluation and local-first execution without installing MongoDB or running Docker containers.
- **Optimistic UI Updates**: Toggling and deleting tasks trigger instant UI changes on the client side, falling back to the original state only if the network fails. This eliminates latency.
- **Form Input Validation**: Detailed schema validation on both client (HTML5 + state boundaries) and backend (Zod schemas) rejecting invalid titles, empty strings, and long descriptions (400 Bad Request).
- **Global Error Handling**: Centralized Express middleware that captures validation, database, and system errors, providing standardized JSON responses.

---

## Workspace Structure

```text
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/db.ts         # Database connection & memory server setup
│   │   ├── controllers/         # Handles business logic
│   │   ├── middleware/          # Validation & error interceptors
│   │   ├── models/              # Mongoose Schema
│   │   ├── routes/              # Express Router mappings
│   │   └── index.ts             # Server entry point
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                 # Page Layouts, global CSS, Home
│   │   ├── components/          # AddModal, ConfirmationModal, TaskCard, TaskList
│   │   ├── services/api.ts      # Fetch client wrapper
│   │   └── types/               # TypeScript interfaces
│   ├── tsconfig.json
│   └── package.json
├── package.json                 # Monorepo scripts (concurrent dev environment)
├── .gitignore                   # Ignores build outputs, node_modules, and secrets
└── README.md                    # Project documentation (this file)
```

---

## Getting Started

### Prerequisites
Make sure you have [Node.js (v18+)](https://nodejs.org/) installed.

### 1. Installation
In the root directory, install all workspace dependencies:
```bash
npm run install:all
```
*(This script runs `npm install` in the root, `backend`, and `frontend` folders respectively).*

### 2. Configure Environment Variables (Optional)
If you have a local MongoDB instance or a MongoDB Atlas URI, configure it:
- Create a `.env` file in the `backend/` folder:
  ```env
  PORT=5000
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/taskmanager
  ```
- *If left blank, the application will automatically spin up an in-memory MongoDB database.*

### 3. Run the Application
Start both the Express API and Next.js frontend concurrently using a single command in the root folder:
```bash
npm run dev
```

This starts:
- **Express Backend** at [http://localhost:5000](http://localhost:5000)
- **Next.js Frontend** at [http://localhost:3000](http://localhost:3000)

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Architectural Decisions

1. **Monorepo Setup**: Choosing separate `frontend` and `backend` workspaces keeps the codebase modular. It prevents package pollution (e.g. keeping Mongoose out of Next.js modules) and guarantees that client and server run as independent processes, mirroring real-world distributed architectures.
2. **TypeScript for Full-Stack Safety**: TypeScript interfaces (like `Task`) are mirrored on both client and server, keeping API payloads structured and eliminating typos during compile time.
3. **No-Setup Developer Experience**: Integrating `mongodb-memory-server` resolves the database dependency barrier, meaning anyone can review and run the code with zero database setups.
4. **Tailwind CSS v4**: Leveraging the CSS-first syntax in `@theme inline` keeps globals light and config-free, removing the classic `tailwind.config.js` bloat.
5. **No Enterprise Bloat**: Kept authentication, user management, and notifications out to satisfy the minimalist scope and prioritize core developer fundamentals (Express middlewares, clean components, state flow).
