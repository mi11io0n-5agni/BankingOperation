import express from "express";

import {
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee login
router.post("/login", loginUser);

// Get currently logged-in employee
router.get("/me", protect, getCurrentUser);

export default router;