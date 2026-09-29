import { Router, type Request, type Response } from "express";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { users } from "../db/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// Generate secret key for JWT
const JWT_KEY = process.env.JWT_KEY || "placeholder_key"; // ! Change in production to env file

// Register route
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) return res.status(400).json({ error: "Username or password invalid"})

        // Check if user already exists
        const existingUsers = await db.select().from(users)
            .where(eq(users.username, username));
        if (existingUsers.length > 0) return res.status(409).json({ error: "Username already taken" });

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

// Login route
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Retrieve user
        const [user] = await db.select().from(users)
            .where(eq(users.username, username));
        if (!user) return res.status(401).json({ error: "Invalid username or password"});

        // Compare provided password with hashed version
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid password"});

        // Generate JWT token
        const token = jwt.sign(
            {userId: user.id, username: user.username},
            JWT_KEY,
            { expiresIn: "7d"}
        )

        res.status(200).json({
            user: { id: user.id, username: user.username},
            token
        })
    } catch (error) {
        console.error("Error trying to login: ", error);
        res.status(500).json({ error: "Failed to login user" });
    }
})
export default router;

// JWT token contains all the session details (user info), without the need to store it in the server -> stateless
// The authentification is then done by only checking the token signature with the secrete key
// Tested with `Thunder client` by creating a POST request with path and body (username, password)