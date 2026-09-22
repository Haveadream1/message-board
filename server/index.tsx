import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Parse incoming JSON requests

// Types
interface Message {
    id: string;
    username: string;
    message: string;
    timestamp: string;
}

// In-memory Database -> replace with database
const messageDB: Message[] = [
    {
        id: "1",
        username: "Haveadream",
        message: "Hi, test message!",
        timestamp: new Date().toISOString()
    }
]

// Routes
// Health route
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    })
})

// GET all messages
app.get("/api/messages", (req: Request, res: Response) => {
    res.json(messageDB);
})

// POST new message
app.post("/api/messages", (req: Request, res: Response) => {
    const { username, message } = req.body;

    // Backend validation (!never trust frontend)
    if (!username.trim() || !message.trim()) {
        return res.status(400).json({ error: "Username and message are not valid" });
    }

    // Create message object with random ID
    const newMessage: Message = {
        id: crypto.randomUUID(),
        username: username,
        message: message,
        timestamp: new Date().toISOString()
    }

    // Save to to In-memory database (mock)
    messageDB.push(newMessage);

    // Return success status with created message
    res.status(201).json(newMessage);
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}/health`);
});