import { describe, beforeAll, it, expect, afterAll } from 'vitest';
import request from "supertest";
import {app} from "../app.js";
import { db } from '../db/index.js';
import { messages, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Integration tests
describe("Likes Routes", () => {
    const likeUser1 = `Like_User_1${Date.now()}`;
    const likeUser2 = `Like_User_2${Date.now()}`;

    let likeUser1Id: number;
    let likeUser2Id: number;

    let messageId: number;
    let authToken: string;
    let authToken2: string;

    let likedMessageid: number;

    beforeAll(async () => {
        // Mock registration
        const user1Res = await request(app)
            .post("/api/auth/register")
            .send({ username: likeUser1, password: "123456jojo4"});
        likeUser1Id = user1Res.body.user.id
        authToken = user1Res.body.token;

        // Mock message
        const messageRes = await request(app)
            .post("/api/messages/")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ message: "Hi !"});
        messageId = parseInt(messageRes.body.id);

        // Mock a second registered user
        const user2Res = await request(app)
            .post("/api/auth/register")
            .send({ username: likeUser2, password: "3411234523164!!!"});
        likeUser2Id = user2Res.body.user.id;
        authToken2 = user2Res.body.token;
    });

    describe("PUT /api/messages/:id/like", () => {
        it("return 403 if user try to like his own message", async () => {
            const res = await request(app)
                .put(`/api/messages/${messageId}/like`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.status).toBe(403);
            expect(res.body.error).toContain("You cannot like your own message")
        })

        // Use the second registered user to like the created message of first user
        it("return 200 when user like a message", async () => {
            const res = await request(app)
                .put(`/api/messages/${messageId}/like`)
                .set("Authorization", `Bearer ${authToken2}`);
            
            likedMessageid = parseInt(res.body.id);
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();
        })

        it("return 409 when user try to like a message that he already liked", async () => {
            const res = await request(app)
                .put(`/api/messages/${messageId}/like`)
                .set("Authorization", `Bearer ${authToken2}`);
            
            expect(res.status).toBe(409);
            expect(res.body.error).toContain("Conflict: message already liked");
        })
    })

    describe("DELETE /api/messages/:id/like", () => {
        it("return 200 for disliked message", async () => {
            const res = await request(app)
                .delete(`/api/messages/${messageId}/like`)
                .set("Authorization", `Bearer ${authToken2}`);
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();
        })

        it("return 404 when user try to dislike a message they didn't like", async () => {
            const res = await request(app)
                .delete(`/api/messages/${likedMessageid}/like`)
                .set("Authorization", `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        })
    })

    afterAll(async () => {
        // Clean by deleting all mocked users
        if (likeUser1Id) await db.delete(users).where(eq(users.id, likeUser1Id));
        if (likeUser2Id) await db.delete(users).where(eq(users.id, likeUser2Id));

        // Clean mocked messages
        if (messageId) await db.delete(messages).where(eq(messages.id, messageId));

        // Mocked liked message is disliked so don't need to touch junction table
    })
})