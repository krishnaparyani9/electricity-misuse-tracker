import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import { ensureUploadsDirectory, uploadsDirectory } from './config/storage';
import authRoutes from './routes/authRoutes';
import reportRoutes from './routes/reportRoutes';

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

ensureUploadsDirectory();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
  })
);
app.use(express.json());
app.use('/uploads', express.static(uploadsDirectory));

app.use(authRoutes);
app.use(reportRoutes);

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect database. Check your .env values and MongoDB server status.');
    process.exit(1);
  }
};

bootstrap();
