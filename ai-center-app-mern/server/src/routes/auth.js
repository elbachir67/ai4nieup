import express from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Login validation rules
const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists(),
  body("isAdminLogin").optional().isBoolean(),
];

// Register validation rules
const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

// Login route
router.post("/login", loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, isAdminLogin } = req.body;

    try {
      const user = await User.findByCredentials(email, password);

      // Check for admin login
      if (isAdminLogin && user.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Access denied. Admin privileges required." });
      }

      const token = user.generateAuthToken();

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isAdmin: user.role === "admin",
        },
        token,
      });
    } catch (error) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Register route
router.post("/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      role: "user", // Default role
      isActive: true,
      lastLogin: new Date(),
    });

    await user.save();

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: false,
      },
      token,
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error("Profile fetch error:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// Update password
router.put(
  "/password",
  auth,
  [
    body("currentPassword").exists(),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("New password must contain a number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      logger.error("Password update error:", error);
      res.status(500).json({ error: "Error updating password" });
    }
  }
);

export const authRoutes = router;
