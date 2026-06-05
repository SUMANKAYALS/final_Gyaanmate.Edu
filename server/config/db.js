import mongoose from 'mongoose';

// export const connectDB = async () => {
//   const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnhub';
//   await mongoose.connect(uri, {
//     serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS || 8000),
//   });
//   console.log(`MongoDB connected: ${mongoose.connection.host}`);
// };



mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    console.log('Connecting to MongoDB...');

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:');
    console.error(err);
    throw err;
  }
};