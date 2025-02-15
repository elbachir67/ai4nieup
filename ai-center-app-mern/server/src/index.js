import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import connectDB from "./config/database.js";

// Import routes
import { goalRoutes } from "./routes/goals.js";
import { conceptRoutes } from "./routes/concepts.js";
import { assessmentRoutes } from "./routes/assessments.js";
import { userRoutes } from "./routes/users.js";
import { learnerProfileRoutes } from "./routes/learnerProfiles.js";
import { pathwayRoutes } from "./routes/pathways.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      /\.netlify\.app$/,
      /\.netlify\.live$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/goals", goalRoutes);
app.use("/api/concepts", conceptRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", learnerProfileRoutes);
app.use("/api/pathways", pathwayRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start the server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();

export default app;
