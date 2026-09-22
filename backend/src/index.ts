import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import authRoutes from './routes/auth.routes';
import kitRoutes from './routes/kit.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/upload-jd', uploadRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('AI Interview Prep Kit API is running...');
});

// Connect DB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
