import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    
    if (!uri || uri.includes('127.0.0.1')) {
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log(`Using In-Memory MongoDB`);
    }
    
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
