import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { db } from "./db/index.js";
import { messages, messageLikes } from "./db/schema.js";
import { and, desc, eq, sql } from "drizzle-orm";

import { authenticateToken } from "./middleware/authentication.js";
import authRouter from "./routes/authentication.js"

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Parse incoming JSON requests
app.use("/api/auth", authRouter); // Mount authentication routes at specified path

// Health route
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    })
})

// GET all messages (with pagination)
app.get("/api/messages", async (req: Request, res: Response) => {
    try {
        // Pagination params
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 3;
        const offset = (page - 1) * limit; // Nb of rows to skip

        // Order by the oldest to newest date
        const allMessages = await db.query.messages.findMany({
            limit: limit + 1,
            offset: offset,
            orderBy: [desc(messages.createdAt)], // New messages first
            with: {
                owner: { columns: {username: true} } // To fetch only username not passwordHash
            }
        })

        // Help to enable/disable the call function for this route
            // We query always one more message than needed, 
            // if the length of the total messages is superior then we know there is more to display !
        const hasMore = allMessages.length > limit;

        // Only send to frontend the message we display
        const messagesToSend = allMessages.slice(0, limit);

        const formattedMessages = messagesToSend.map((msg) => ({
            id: msg.id.toString(),
            username: msg?.owner.username || "Visitor",
            message: msg.message,
            createdAt: msg.createdAt.toISOString(),
            likeCount: msg.likeCount
        }))

        res.json({
            messages: formattedMessages,
            hasMore
        });
    } catch (error) {
        console.error("Error trying to fetch messages: ", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
})

// POST : create new message (Protected and Secure route)
    // Before the request reaches the route logic, middleware intercepts it and verifies the token
app.post("/api/messages", authenticateToken, async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        // With the auth, user is clearly determined
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized"})

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

        const fullMessage = await db.query.messages.findFirst({
            where: eq(messages.id, insertedMessage.id),
            with: {
                owner: { columns: {username: true} }
            }
        })

        const formattedMessages = {
            id: insertedMessage.id.toString(),
            username: fullMessage?.owner.username || "Visitor",
            message: insertedMessage.message,
            createdAt: insertedMessage.createdAt.toISOString(),
            likeCount: insertedMessage.likeCount
        };

        console.log("New message was successfully inserted !", formattedMessages);
            
        // Return success status with created message
        res.status(201).json(formattedMessages);
    } catch (error) {
        console.error("Error trying to post message: ", error);
        res.status(500).json({ error: "Failed to post message" });
    }
})

// PUT route : like message (Protected route)
app.put("/api/messages/:id/like", authenticateToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID not found" });

        const messageId = parseInt(id);
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized"});

        // Check if message exists
        const [targetMessage] = await db.select().from(messages)
            .where(eq(messages.id, messageId))
            .limit(1);
        if(!targetMessage) return res.status(404).json({ error: "Message not found"});

        // Check if user is not the owner of the message
        if (targetMessage.ownerId === userId) return res.status(403).json({ error: "You cannot like your own message"});

        // Check with junction table if instance already exits
            // Anti-spam
        const messageLiked = await db.select().from(messageLikes)
            .where(
                and(
                    eq(messageLikes.messageId, messageId),
                    eq(messageLikes.userId, userId)
                )
            ).limit(1);
        if(messageLiked.length > 0) return res.status(409).json({ error: "Conflict: message already liked"});

        // If not insert instance into table
        await db.insert(messageLikes)
            .values({
                messageId: messageId,
                userId: userId
            });

        // Increment the total like count
        const [updatedMessage] = await db.update(messages)
            .set({ likeCount: sql`${messages.likeCount} + 1` }) // Increment only in backend
            .where(eq(messages.id, messageId)) // eq: comparison function
            .returning();
        if(!updatedMessage) return res.status(404).json({ error: "Failed to find updated message"});

        // Fetch the full message with the usernme for the frontend
        const fullMessage = await db.query.messages.findFirst({
            where: eq(messages.id, updatedMessage.id),
            with: {
                owner: { columns:{ username: true } }
            }
        })

        const formattedMessages = {
            id: updatedMessage.id.toString(),
            username: fullMessage?.owner.username || "Visitor",
            message: updatedMessage.message,
            createdAt: updatedMessage.createdAt.toISOString(),
            likeCount: updatedMessage.likeCount
        };

        res.status(200).json(formattedMessages);
    } catch (error) {
        console.error("Error trying to update message: ", error);
        res.status(500).json({ error: "Failed to put message" });
    }
})

// DELETE route : dislike message (Protected and Secure route)
app.delete("/api/messages/:id/dislike", authenticateToken, async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        if (!id) return res.status(400).json({ error: "ID not found"});

        const messageId = parseInt(id);
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized"});

        // Verify instance exists
        // And security check: need to belong to the specified user
        const [targetInstance] = await db.select().from(messageLikes)
            .where(
                and (
                    eq(messageLikes.messageId, messageId),
                    eq(messageLikes.userId, userId)
                )
            )
            .limit(1);
        if (!targetInstance) return res.status(404).json({ error: "Instance to be deleted not found"});

        // Decrement like count
         const [updatedMessage] = await db.update(messages)
            .set({ likeCount: sql`${messages.likeCount} - 1` })
            .where(eq(messages.id, messageId))
            .returning();
        if (!updatedMessage) return res.status(404).json({ error: "Updated message not found"});

        await db.delete(messageLikes)
            .where(
                and (
                    eq(messageLikes.messageId, messageId),
                    eq(messageLikes.userId, userId)
                )
            )

        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Error trying to delete instance in messageLike table: ", error);
        res.status(500).json({ error: "Failed to delete instance in messageLike table" });
    }
})

// GET route : retrieve all Id of liked message (Protected)
app.get("/api/messages/likes", authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized"});

        // Select only the message ID of the messages liked by user
        const likedMessages = await db.select({ messageId: messageLikes.messageId })
            .from(messageLikes)
            .where(eq(messageLikes.userId, userId));
        
        // Create an array with the id converted to string
        const likedMessagesId = likedMessages.map((like) => like.messageId.toString());
        
        res.status(200).json(likedMessagesId);
    } catch (error) {
        console.error("Error trying to get liked messages: ", error);
        res.status(500).json({ error: "Failed to get liked messages" });
    }
})

// DELETE route : delete message (Protected and Secure route)
app.delete("/api/messages/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        if (!id) return res.status(400).json({ error: "ID not found"});

        const messageId = parseInt(id);
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized"})
        
        const [targetMessage] = await db.select().from(messages)
            .where(eq(messages.id, messageId))
            .limit(1);
        if (!targetMessage) return res.status(404).json({ error: "Message to be deleted not found"});

        // Security check -> logged used need to own the message to be able to delete it
        if (targetMessage.ownerId !== userId ) return res.status(403).json({ error: "Forbidden: User doesn't own the message"})

        // If user own message then safe to delete
        const [deletedMessage] = await db.delete(messages)
            .where(eq(messages.id, messageId))
            .returning();
        if (!deletedMessage) return res.status(404).json({ error: "Failed to find deleted message"});

        // Only need to send back id
        res.status(200).json({ id: deletedMessage.id.toString() });
    } catch (error) {
        console.error("Error trying to delete message: ", error);
        res.status(500).json({ error: "Failed to delete message" });
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}/health`);
});
