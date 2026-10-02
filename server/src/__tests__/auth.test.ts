import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Integration test
describe("Auth route", () => {
    let authUser1Id: number;
    let authUser2Id: number;
    let authUser3Id: number;

    it("return 201 and username on registration", async () => {
        // Need to create an unique username for every test otherwise auth will remember and throw err
        const uniqueUsername = `Auth_User_1${Date.now()}`;

        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueUsername, password: "zq12345678"});

        authUser1Id = res.body.user.id;
        
        expect(res.status).toBe(201);
        expect(res.body.user.username).toBe(uniqueUsername);
        expect(res.body.token).toBeDefined();
    });

    it("return 200 and username on login", async () => {
        const uniqueUsername = `Auth_User_2${Date.now()}`;

        // Register the user
        await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueUsername, password: "poq123123e1"});
        
        // Test the login
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username: uniqueUsername, password: "poq123123e1" });

        authUser2Id = res.body.user.id;
        
        expect(res.status).toBe(200);
        expect(res.body.user.username).toBe(uniqueUsername);
        expect(res.body.token).toBeDefined();
    });

    it("return 401 on wrong password for login", async () => {
        const uniqueUsername = `Auth_User_3${Date.now()}`;

        // Register the user
        const registerRes =  await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueUsername, password: "1234523164jjjjj"});

        authUser3Id = registerRes.body.user.id;

        // Login
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username: uniqueUsername, password: "12llloo34523164!!!"});
        
        expect(res.status).toBe(401);
        expect(res.body.error).toContain("Invalid password");
    })

    afterAll(async () => {
        // Delete all the mocked users
            // We could have one user in beforeAll, but this is clearer for me in this particular test

        if (authUser1Id) await db.delete(users).where(eq(users.id, authUser1Id));
        if (authUser2Id) await db.delete(users).where(eq(users.id, authUser2Id));
        if (authUser3Id) await db.delete(users).where(eq(users.id, authUser3Id));
    })
})

// * Can execute really fast and then so have same username accros tests, differentiate by giving diff prefix