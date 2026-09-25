import { Router, type Request, type Response } from "express";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { users } from "../db/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// Generate secret key for JWT
// ! Change in production to env file
const JWT_KEY = process.env.JWT_KEY || "placeholder_key";

// Register route
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) return res.status(400).json({ error: "Username or password invalid"})

        // Check if user already exists
        const isUserExisting = await db.query.users?.findFirst({
            where: eq(users.username, username)
        });
        if (isUserExisting) return res.status(409).json({ error: "Username already taken" });

        // Hash password
            // Salt rounds: 10 -> controls how many times the hashing func runs
        const passwordHash = await bcrypt.hash(password, 10); // standard value

        // Insert into database
        const [newUser] = await db.insert(users)
            .values({ username, passwordHash })
            .returning();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser?.id, username: newUser?.username },
            JWT_KEY,
            { expiresIn: "7d"} // 7 days of lifetime for token
        )

        // Never return  password hash
        res.status(201).json({
            user: {id: newUser?.id, username: newUser?.username},
            token
        });
    } catch (error) {
        console.error("Error trying to register user: ", error);
        res.status(500).json({ error: "Failed to register user" });
    }
})
