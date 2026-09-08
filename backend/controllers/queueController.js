import Queue from "../models/Queue.js";

// ==========================================
// CREATE A NEW QUEUE
// POST /api/queues
// ==========================================

export const createQueue = async (req, res) => {
  try {
    const { customerName, phone, service } = req.body;

    // Validate required fields
    if (!customerName || !service) {
      return res.status(400).json({
        message: "Customer name and service are required.",
      });
    }

    // Find the latest queue number
    const latestQueue = await Queue.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (latestQueue && latestQueue.queueNumber) {
      const parts = latestQueue.queueNumber.split("-");
      if (parts.length > 1) {
        const lastNumber = parseInt(parts[1], 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
    }

    // Generate queue number
    const queueNumber = `A-${String(nextNumber).padStart(3, "0")}`;

    // Create queue
    const queue = await Queue.create({
      queueNumber,
      customerName,
      phone,
      service,
    });

    res.status(201).json({
      message: "Queue created successfully",
      queue,
    });
  } catch (error) {
    console.error("Create Queue Error:", error.message);

    res.status(500).json({
      message: "Server error while creating queue",
    });
  }
};

// ==========================================
// GET ALL QUEUES
// GET /api/queues
// ==========================================

export const getAllQueues = async (req, res) => {
  try {
    const queues = await Queue.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: queues.length,
      queues,
    });
  } catch (error) {
    console.error("Get Queues Error:", error.message);

    res.status(500).json({
      message: "Server error while getting queues",
    });
  }
};

// Export alias in case any file imports getQueues
export const getQueues = async (req, res) => {
  try {
    // Admin can see all queues
    if (req.user.role === "Admin") {
      const queues = await Queue.find()
        .populate("servedBy", "name email role")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        count: queues.length,
        queues,
      });
    }

    // Employee must have an assigned service
    if (!req.user.service) {
      return res.status(400).json({
        message:
          "No service has been assigned to your employee account.",
      });
    }

    // Employee sees only queues for their assigned service
    const queues = await Queue.find({
      service: req.user.service,
    })
      .populate("servedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: queues.length,
      queues,
    });
  } catch (error) {
    console.error(
      "Get Queues Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while getting queues",
    });
  }
};

// ==========================================
// GET ONE QUEUE BY NUMBER
// GET /api/queues/:queueNumber
// ==========================================

export const getQueueByNumber = async (req, res) => {
  try {
    const { queueNumber } = req.params;

    const queue = await Queue.findOne({
      queueNumber: queueNumber.toUpperCase(),
    });

    if (!queue) {
      return res.status(404).json({
        message: "Queue number not found",
      });
    }

    res.status(200).json(queue);
  } catch (error) {
    console.error("Get Queue Error:", error.message);

    res.status(500).json({
      message: "Server error while getting queue",
    });
  }
};

// ==========================================
// UPDATE QUEUE STATUS
// PATCH /api/queues/:id/status
// ==========================================

export const updateQueueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Waiting",
      "Serving",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid queue status",
      });
    }

    const queue = await Queue.findById(req.params.id);

    if (!queue) {
      return res.status(404).json({
        message: "Queue not found",
      });
    }

    // Admin can manage any queue
    // Employee can only manage their assigned service
    if (
      req.user.role !== "Admin" &&
      queue.service !== req.user.service
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to manage this service queue.",
      });
    }

    if (status === "Serving") {
      queue.status = "Serving";
      queue.servedBy = req.user._id;
    } else if (status === "Completed") {
      queue.status = "Completed";
    } else if (status === "Cancelled") {
      queue.status = "Cancelled";
    } else if (status === "Waiting") {
      queue.status = "Waiting";
      queue.servedBy = null;
    }

    await queue.save();

    const updatedQueue = await Queue.findById(queue._id)
      .populate("servedBy", "name email role");

    res.status(200).json({
      message: "Queue status updated successfully",
      queue: updatedQueue,
    });
  } catch (error) {
    console.error(
      "Update Queue Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while updating queue",
    });
  }
};