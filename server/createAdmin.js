import mongoose from "mongoose";
import User from "./models/User.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI) 
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    // Delete old admin if exists
    await User.deleteOne({ email: "admin@gmail.com" });

    // Hash the password
    const hashed = await bcrypt.hash("admin123", 10);

    // Create admin
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashed,
      role: "admin",
    });

    console.log("Admin created successfully. You can now log in.");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();