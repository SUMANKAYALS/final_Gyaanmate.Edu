import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnhub';
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS || 8000),
  });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};
