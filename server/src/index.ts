import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { db } from "./db/index.js";
import { messagesTable } from "./db/schema.js";
import { asc, eq, sql } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Parse incoming JSON requests

// Routes
// Health route
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    })
})

// GET all messages
app.get("/api/messages", async (req: Request, res: Response) => {
    try {
        // Order by the oldest to newest date
        const allMessages = await db.select().from(messagesTable).orderBy(asc(messagesTable.createdAt));
        res.json(allMessages);
    } catch (error) {
        console.error("Error trying to fetch messages: ", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
})

// POST new message
app.post("/api/messages", async (req: Request, res: Response) => {
    try {
        const { username, message } = req.body;

        // Backend validation (!never trust frontend)
        if (!username.trim() || !message.trim()) {
            return res.status(400).json({ error: "Username and message are not valid" });
        }

        // Insert new message into database
        const [insertedMessage] = await db.insert(messagesTable)
            .values({
                username: username.trim(),
                message: message.trim(),
            })
            .returning(); // retrieve the full messagee to be displayed directly after submit
        console.log("New message was successfully inserted !", insertedMessage);
            
        // Return success status with created message
        res.status(201).json(insertedMessage);
    } catch (error) {
        console.error("Error trying to post message: ", error);
        res.status(500).json({ error: "Failed to post message" });
    }
})

// PUT message
app.put("/api/messages/:id/like", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID not found" });

        // Update like count value
        const [updatedMessage] = await db.update(messagesTable)
            .set({ likeCount: sql`${messagesTable.likeCount} + 1` }) // Increment only in backend
            .where(eq(messagesTable.id, parseInt(id))) // eq: comparison function
            .returning();

        if(!updatedMessage) return res.status(400).json({ error: "Failed to find message with id"});

        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error trying to update message: ", error);
        res.status(500).json({ error: "Failed to put message" });
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}/health`);
});
