import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.js";

// Integration test
describe("Health route", () => {
    it("return a 200 with an ok status", async () => {
        const res = await request(app)
            .get("/health");
        
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
        expect(res.body.timestamp).toBeDefined();
    })
})