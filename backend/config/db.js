import mongoose from 'mongoose';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const dns = require('dns');
const servers = dns.getServers();
if (servers.includes('127.0.0.1') || servers.length === 0) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
