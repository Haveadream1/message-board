import { describe, beforeAll, it, expect } from 'vitest';
import request from "supertest";
import {app} from "../app.js";

// Integration test
describe("Messages Routes", () => {
    const uniqueUsername = `User_${Date.now()}`;
    const uniqueSecondUsername = `User1_${Date.now()}`;

    let authToken: string;
    let secondUserAuthToken: string;

    let messageId: number;

    beforeAll(async () => {
        // Mock a registered user
        const user1Res = await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueUsername, password: "1234564"});
        authToken = user1Res.body.token;

        // Mock a second registered user
        const user2Res = await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueSecondUsername, password: "1234"});
        secondUserAuthToken = user2Res.body.token;
    });

    describe("POST /api/messages", () => {
        it("return 201 for a created message with an auth user", async () => {
            const res = await request(app)
                .post("/api/messages/")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ message: "Hi !"});
            
            messageId = parseInt(res.body.id);

            expect(res.status).toBe(201);
            expect(res.body.message).toBeDefined();
        })

        it("return 400 for empty message", async () => {
            const res = await request(app)
                .post("/api/messages/")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ message: ""});
            
            expect(res.status).toBe(400);
            expect(res.body.error).toContain("Message not valid");
        })
    });

    describe("DELETE /api/messages/:id", () => {
        it("return 403 when user try to delete message he doesn't own", async () => {
            const res = await request(app)
                .delete(`/api/messages/${messageId}`)
                .set("Authorization", `Bearer ${secondUserAuthToken}`);
            
            expect(res.status).toBe(403);
            expect(res.body.error).toContain("Forbidden: User doesn't own the message");
        })

        it("return 200 for deleted message", async () => {
            const res = await request(app)
                .delete(`/api/messages/${messageId}`)
                .set("Authorization", `Bearer ${authToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(messageId.toString());
        })
    })
})
