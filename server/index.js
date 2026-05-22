import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
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
import { initializeSocket } from './socket.js';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    platform: 'GyaanMate.edu',
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

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

connectDB()
  .then(() => {
    initCloudinary();
    initializeSocket(server);
    server.listen(PORT, () => console.log(`LearnHub API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
