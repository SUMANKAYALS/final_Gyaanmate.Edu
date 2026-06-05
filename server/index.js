import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import multer from 'multer';
import { connectDB } from './config/db.js';
import { initCloudinary, isCloudinaryConfigured } from './services/cloudinaryService.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import streakRoutes from './routes/streakRoutes.js';
import codingPracticeRoutes from './routes/codingPracticeRoutes.js';
import { initializeSocket } from './socket.js';

import focusCoachRoutes from './routes/focusCoachRoutes.js';

dotenv.config();
dotenv.config({ path: new URL('./.env', import.meta.url) });

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

const parseList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseList(process.env.CLIENT_URL),
  ...parseList(process.env.CLIENT_ORIGINS),
  'https://final-gyaanmate-edu.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: [...new Set(allowedOrigins)],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    platform: 'Gyaanmate',
    cloudinary: isCloudinaryConfigured(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/coding-practice', codingPracticeRoutes);
app.use('/api/focus-coach', focusCoachRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Uploaded file is too large'
      : err.message;
    return res.status(status).json({ message });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

async function startServer() {
  initCloudinary();
  initializeSocket(server);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT in server/.env.`);
      process.exit(1);
    }

    console.error('Failed to start server:', err);
    process.exit(1);
  });

  server.listen(PORT, () => {
    console.log(`Gyaanmate API running on port ${PORT}`);
  });

  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed. API is still running without database:', err.message);
  }
}

startServer();
