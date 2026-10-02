import { describe, beforeAll, it, expect } from 'vitest';
import request from "supertest";
import {app} from "../app.js";

// Integration tests
describe("Likes Routes", () => {
    const uniqueUsername = `User_${Date.now()}`;
    let authToken: string;
    let secondUserAuthToken: string;

    let messageId: number;
    let likedMessageid: number;

    beforeAll(async () => {
        // Mock registration
        const registrationRes = await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueUsername, password: "1234564"});
        authToken = registrationRes.body.token;

        // Mock message
        const MessageRes = await request(app)
            .post("/api/messages/")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ message: "Hi !"});
        messageId = parseInt(MessageRes.body.id);
    });

    describe("PUT /api/messsages/:id/like", () => {
        const uniqueUsername = `User_${Date.now()}`

        // Mock a second registered user
        beforeAll(async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ username: uniqueUsername, password: "1234"});
            secondUserAuthToken = res.body.token;
        });

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
                .set("Authorization", `Bearer ${secondUserAuthToken}`);
            
            likedMessageid = parseInt(res.body.id);
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBeDefined();
        })

        it("return 409 when user try to like a message that he already liked", async () => {
            const res = await request(app)
                .put(`/api/messages/${messageId}/like`)
                .set("Authorization", `Bearer ${secondUserAuthToken}`);
            
            expect(res.status).toBe(409);
            expect(res.body.error).toContain("Conflict: message already liked");
        })
    })

    describe("DELETE /api/messages/:id/like", () => {
        it("return 200 for disliked message", async () => {
            const res = await request(app)
                .delete(`/api/messages/${likedMessageid}/like`)
                .set("Authorization", `Bearer ${secondUserAuthToken}`);
            
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
})
