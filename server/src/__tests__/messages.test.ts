import { describe, beforeAll, it, expect, afterAll } from 'vitest';
import request from "supertest";
import {app} from "../app.js";
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Integration test
describe("Messages Routes", () => {
    const msgUser1 = `Msg_User_1${Date.now()}`;
    const msgUser2 = `Msg_User_2${Date.now()}`;

    let msgUser1Id: number;
    let msgUser2Id: number;

    let authToken: string;
    let authToken2: string;

    let messageId: number;

    beforeAll(async () => {
        // Mock a registered user
        const user1Res = await request(app)
            .post("/api/auth/register")
            .send({ username: msgUser1, password: "1234523164"});
        msgUser1Id = user1Res.body.user.id
        authToken = user1Res.body.token;

        // Mock a second registered user
        const user2Res = await request(app)
            .post("/api/auth/register")
            .send({ username: msgUser2, password: "1234523164!!!"});
        msgUser2Id = user2Res.body.user.id
        authToken2 = user2Res.body.token;
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
                .set("Authorization", `Bearer ${authToken2}`);
            
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

    afterAll(async () => {
        if (msgUser1Id) await db.delete(users).where(eq(users.id, msgUser1Id));
        if (msgUser2Id) await db.delete(users).where(eq(users.id, msgUser2Id));
    })
})
