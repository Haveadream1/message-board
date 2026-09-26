import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { db } from "./db/index.js";
import { messages } from "./db/schema.js";
import { asc, eq, sql } from "drizzle-orm";

import { authenticateToken } from "./middleware/authentication.js";
import authRouter from "./routes/authentication.js"

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Parse incoming JSON requests
app.use("/api/auth", authRouter) // Mount authentication routes at specificied path

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
        const allMessages = await db.select().from(messages).orderBy(asc(messages.createdAt));
        res.json(allMessages);
    } catch (error) {
        console.error("Error trying to fetch messages: ", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
})

// POST new message (Protected route)
    // Before the request reaches the route logic, middleware intercepts it and verifies the token
app.post("/api/messages", authenticateToken, async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        // With the auth, user is clearly determined
        const userId = req.user?.userId;

        // Backend validation (!never trust frontend)
        if (!message || !message.trim()) {
            return res.status(400).json({ error: "Message are not valid" });
        }

        // Insert new message into database
        const [insertedMessage] = await db.insert(messages)
            .values({
                ownerId: userId,
                message: message.trim(),
            })
            .returning(); // retrieve the full messagee to be displayed directly after submit

        if (!insertedMessage) return res.status(404).json({ error: "Failed to find inserted message"});
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
        const [updatedMessage] = await db.update(messages)
            .set({ likeCount: sql`${messages.likeCount} + 1` }) // Increment only in backend
            .where(eq(messages.id, parseInt(id))) // eq: comparison function
            .returning();

        if(!updatedMessage) return res.status(404).json({ error: "Failed to find updated message"});

        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error trying to update message: ", error);
        res.status(500).json({ error: "Failed to put message" });
    }
})

// DELETE route
app.delete("/api/messages/:id", async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        if (!id) return res.status(400).json({ error: "ID not found"});

        const [deletedMessage] = await db.delete(messages)
            .where(eq(messages.id, parseInt(id)))
            .returning();
        
        if (!deletedMessage) return res.status(404).json({ error: "Failed to find deleted message"});
        
        res.status(200).json(deletedMessage);
    } catch (error) {
        console.error("Error trying to delete message: ", error);
        res.status(500).json({ error: "Failed to delete message" });
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}/health`);
});
