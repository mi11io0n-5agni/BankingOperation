import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// ==========================================
// REGISTER EMPLOYEE
// POST /api/auth/register
// ==========================================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "An employee with this email already exists.",
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    res.status(201).json({
      message:
        "Employee account created successfully.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(
      "Register Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while creating employee account.",
    });
  }
};

// ==========================================
// LOGIN EMPLOYEE
// POST /api/auth/login
// ==========================================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const passwordMatches =
      await user.matchPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    res.status(200).json({
      message:
        "Login successful.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error.message
    );

    res.status(500).json({
      message:
        "Server error while logging in.",
    });
  }
};

// ==========================================
// GET CURRENT EMPLOYEE
// GET /api/auth/me
// ==========================================

export const getCurrentUser = async (
  req,
  res
) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Unable to get employee information.",
    });
  }
};