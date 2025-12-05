import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  // do not throw here to keep dev flow flexible; handlers will fail loudly if needed
  console.warn(
    "MONGO_URI / DATABASE_URL not set. DB calls will fail until configured."
  );
}

let cached = global._mongoCache;
if (!cached) {
  cached = global._mongoCache = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDb;
