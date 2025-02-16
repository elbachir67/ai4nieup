import express from "express";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Login
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").exists(),
    body("isAdminLogin").optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password, isAdminLogin } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // For admin login, verify admin role
      if (isAdminLogin && user.role !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          iat: Date.now(),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
          algorithm: "HS256",
        }
      );

      res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.role === "admin",
        },
        token,
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Register
router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      user = new User({
        email,
        password: hashedPassword,
        role: "user", // Default role is user
      });

      await user.save();

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          iat: Date.now(),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
          algorithm: "HS256",
        }
      );

      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.role === "admin",
        },
        token,
      });
    } catch (error) {
      logger.error("Registration error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    logger.error("Profile fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export const authRoutes = router;
