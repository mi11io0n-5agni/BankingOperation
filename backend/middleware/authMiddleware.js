import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader =
      req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message:
          "Not authorized. Please login.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message:
          "Employee account not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication Error:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired login session.",
    });
  }
};

export default protect;