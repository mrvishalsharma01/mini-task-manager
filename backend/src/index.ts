import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/db';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Global Error Handler
app.use(errorHandler);

// Start server after connecting to database
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down server...');
    server.close(async () => {
      await closeDB();
      console.log('Server process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
