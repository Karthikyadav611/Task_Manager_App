import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");

const bootstrap = async () => {
  try {
    await connectDB();

    const clientUrl = process.env.CLIENT_URL;
    const allowedOrigins = clientUrl
      ? clientUrl
          .split(",")
          .map((url) => normalizeOrigin(url))
          .filter(Boolean)
      : [];
    const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

    app.use(
      cors({
        origin(origin, callback) {
          // Allow non-browser clients and same-machine local dev ports.
          if (!origin || localhostRegex.test(origin)) {
            return callback(null, true);
          }

          if (allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true);
          }

          return callback(null, false);
        },
      })
    );
    app.use(express.json());

    app.get("/", (req, res) => {
      res.status(200).json({ message: "Task Manager API is running." });
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/tasks", taskRoutes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

bootstrap();
