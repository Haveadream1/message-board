import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import messageRouter from "./routes/messages.js";
import healthRouter from "./routes/health.js";

export const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://message-board-71n7.vercel.app/"
    ],
    credentials: true
})); // Allows frontend to talk to backend
app.use(express.json()); // Parse incoming JSON requests

app.use("/api/auth", authRouter); // Mount authentication routes at specified path
app.use("/api/messages", messageRouter);
app.use(healthRouter);