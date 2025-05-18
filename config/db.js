import mongoose from "mongoose";

export async function connectDB(DB_URL) {
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed\n", error);
  }
}
