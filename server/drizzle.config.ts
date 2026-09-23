import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",   // Path where migration are saved
    schema: "./src/db/schema.ts", // Path of schema file
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    }
})