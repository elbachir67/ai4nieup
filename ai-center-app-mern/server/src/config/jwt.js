import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  logger.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

export const jwtConfig = {
  secret: JWT_SECRET,
  options: {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  },
};

export const generateToken = payload => {
  try {
    return jwt.sign(payload, JWT_SECRET, jwtConfig.options);
  } catch (error) {
    logger.error("Error generating JWT:", error);
    throw new Error("Error generating authentication token");
  }
};

export const verifyToken = token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error("Error verifying JWT:", error);
    throw new Error("Invalid authentication token");
  }
};
