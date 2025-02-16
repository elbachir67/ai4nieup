import { verifyToken } from "../config/jwt.js";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No authentication token provided");
    }

    const decoded = verifyToken(token);
    const user = await User.findOne({
      _id: decoded.id,
      isActive: true,
    });

    if (!user) {
      throw new Error("User not found or inactive");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ error: "Please authenticate" });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      next();
    });
  } catch (error) {
    logger.error("Admin authentication error:", error);
    res.status(403).json({ error: "Admin access required" });
  }
};
