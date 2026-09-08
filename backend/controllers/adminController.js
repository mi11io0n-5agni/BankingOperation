
import User from "../models/User.js";

// ==========================================
// GET ALL EMPLOYEES
// ==========================================

export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: "Employee",
    }).select("-password");

    res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error(
      "Get Employees Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while getting employees.",
    });
  }
};

// ==========================================
// CREATE EMPLOYEE
// ==========================================

export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      service,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !service) {
      return res.status(400).json({
        message:
          "Name, email, password, and service are required.",
      });
    }

    // Check whether employee already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "An employee with this email already exists.",
      });
    }

    // Create employee
    const employee = await User.create({
      name,
      email,
      password,
      role: "Employee",
      service,
    });

    res.status(201).json({
      message: "Employee created successfully.",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        service: employee.service,
      },
    });
  } catch (error) {
    console.error(
      "Create Employee Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while creating employee.",
    });
  }
};

// ==========================================
// UPDATE EMPLOYEE SERVICE
// ==========================================

export const updateEmployeeService = async (
  req,
  res
) => {
  try {
    const { service } = req.body;

    if (!service) {
      return res.status(400).json({
        message: "Service is required.",
      });
    }

    const employee = await User.findOne({
      _id: req.params.id,
      role: "Employee",
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    employee.service = service;

    await employee.save();

    res.status(200).json({
      message:
        "Employee service updated successfully.",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        service: employee.service,
      },
    });
  } catch (error) {
    console.error(
      "Update Employee Service Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while updating employee service.",
    });
  }
};

// ==========================================
// DELETE EMPLOYEE
// ==========================================

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findOneAndDelete({
      _id: req.params.id,
      role: "Employee",
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Employee Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while deleting employee.",
    });
  }
};

