import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/budget';

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI не е дефиниран в .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
