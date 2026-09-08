import express from "express";

import {
  createQueue,
  getQueues,
  getQueueByNumber,
  updateQueueStatus,
} from "../controllers/queueController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public customer routes
router.post("/", createQueue);
router.get("/:queueNumber", getQueueByNumber);

// Employee-only routes
router.get("/", protect, getQueues);
router.patch("/:id/status", protect, updateQueueStatus);

export default router;