import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import messageRouter from "./routes/messages.js";
import healthRouter from "./routes/health.js";

export const app = express();

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Parse incoming JSON requests
app.use("/api/auth", authRouter); // Mount authentication routes at specified path
app.use("/api/messages", messageRouter);
app.use("/api/health", healthRouter);