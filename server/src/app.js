import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- Logging (dev only) ---
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- Health check (useful for Render's health checks + uptime monitors) ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);

app.use("/api/volunteers", volunteerRoutes);
app.use("/api/events", eventRoutes);

// --- 404 + centralized error handling (MUST be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;