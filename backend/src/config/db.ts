import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/electricity_misuse_tracker';

export const connectDatabase = async () => {
  await mongoose.connect(mongoUri);
};
