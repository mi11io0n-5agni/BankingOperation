
import express from "express";

import {
  getEmployees,
  createEmployee,
  updateEmployeeService,
  deleteEmployee,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes below require login + Admin role

router.get(
  "/employees",
  protect,
  adminOnly,
  getEmployees
);

router.post(
  "/employees",
  protect,
  adminOnly,
  createEmployee
);

router.put(
  "/employees/:id/service",
  protect,
  adminOnly,
  updateEmployeeService
);

router.delete(
  "/employees/:id",
  protect,
  adminOnly,
  deleteEmployee
);

export default router;

