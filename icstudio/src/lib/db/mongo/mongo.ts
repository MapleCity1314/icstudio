import mongoose, { Mongoose } from "mongoose";

// 定义全局变量的接口
interface GlobalWithMongoose extends Global {
  mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

declare const global: GlobalWithMongoose;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

let cached = global.mongoose || {
  conn: null,
  promise: null
};

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const opts: mongoose.ConnectOptions = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  };

  try {
    cached.promise = mongoose.connect(MONGODB_URI!, opts);
    cached.conn = await cached.promise;

    cached.conn.connection.on('connected', () => {
      console.log('MongoDB 连接成功');
    });

    cached.conn.connection.on('error', (err) => {
      console.error('MongoDB 连接错误:', err);
    });

    cached.conn.connection.on('disconnected', () => {
      console.log('MongoDB 连接断开');
    });

    return cached.conn;
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

export default dbConnect;