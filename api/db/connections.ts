import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const DB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (!DB_URI) {
    return console.log('No MONGODB_URI in .env file');
  }
  try {
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      appName: 'TEABOX_DB',
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

mongoose.connection.on('connected', () => {
  console.log('✅ DB connected!');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected.');
});

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) { // 0 = disconnected
    await mongoose.disconnect();
  }
};

export { connectDB, mongoose };
