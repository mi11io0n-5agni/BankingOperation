import express from "express";

import {
  createQueue,
  getQueues,
  getQueueByNumber,
  updateQueueStatus,
} from "../controllers/queueController.js";

const router = express.Router();

// Create a new queue
router.post("/", createQueue);

// Get all queues
router.get("/", getQueues);

// Get queue by queue number
router.get("/:queueNumber", getQueueByNumber);

// Update queue status
router.patch("/:id/status", updateQueueStatus);

export default router;