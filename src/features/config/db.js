import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/users";

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Database connected");
  } catch (error) {
    console.error("DB connection error:", error);
  }
};
