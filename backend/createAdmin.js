
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const existingAdmin = await User.findOne({
      email: "admin@coopbank.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit();
    }

    const admin = await User.create({
      name: "COOPBank Admin",
      email: "admin@coopbank.com",
      password: "123456",
      role: "Admin",
      service: null,
    });

    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

    process.exit();
  } catch (error) {
    console.error(
      "Error creating admin:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();

