
import express from "express";

import {
  createQueue,
  getAllQueues,
  getQueueByNumber,
  updateQueueStatus,
} from "../controllers/queueController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC CUSTOMER ROUTES
// ==========================================

// Create a new queue number
router.post("/", createQueue);

// Check queue status using queue number
router.get("/:queueNumber", getQueueByNumber);

// ==========================================
// PROTECTED EMPLOYEE ROUTES
// ==========================================

// Get all queues
router.get("/", protect, getAllQueues);

// Update queue status
router.patch(
  "/:id/status",
  protect,
  updateQueueStatus
);

export default router;

