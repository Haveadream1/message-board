import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.js";

// Integration test
describe("Auth route", () => {

    it("return 201 and username on registration", async () => {
        // Need to create an unique username for every test otherwise auth will remember and throw err
        const uniqueUsername = `User_${Date.now()}`;

        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueUsername, password: "123qwe"});
        
        expect(res.status).toBe(201);
        expect(res.body.user.username).toBe(uniqueUsername);
        expect(res.body.token).toBeDefined();
    });

    it("return 200 and username on login", async () => {
        const uniqueUsername = `User_${Date.now()}`;

        // Register the user
        await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueUsername, password: "poqe1"});
        
        // Test the login
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username: uniqueUsername, password: "poqe1" });
        
        expect(res.status).toBe(200);
        expect(res.body.user.username).toBe(uniqueUsername);
        expect(res.body.token).toBeDefined();
    });

    it("return 401 on wrong password for login", async () => {
        const uniqueUsername = `User_${Date.now()}`;

        // Register the user
        await request(app)
            .post("/api/auth/register")
            .send({ username: uniqueUsername, password: "poqe1"});

        const res = await request(app)
            .post("/api/auth/login")
            .send({ username: uniqueUsername, password: "123oops!"});
        
        expect(res.status).toBe(401);
        expect(res.body.error).toContain("Invalid password");
    })
})