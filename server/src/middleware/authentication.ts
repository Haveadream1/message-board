import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UserPayLoad {
    userId: number,
    username: string
}

// Handle TS errors by extending the request for user on req.user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                username: string;   
            }
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Get authorization header
        // Used to transmit authentication credentials to server (contains our token)
    const header = req.headers.authorization;

    // Validate header -> must start with "Bearer "
        // Bearer is an authorization scheme (most common approach)
        // Client sends a unique token like JWT, whoever "bears/carry" the token gets access
    if (!header || !header.startsWith("Bearer ")) return res.status(401).json({error: "Unauthorized: no token provided"});

    // Extract token
    const token = header.split(" ")[1];
    if(!token) return res.status(404).json({ error: "Access denined, no token provided"})

    const JWT_KEY = process.env.JWT_KEY;
    if (!JWT_KEY) throw new Error("JWT_KEY is not defined as environment variable");

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_KEY) as UserPayLoad;

        // Attach decoded user info to request object
        req.user = decoded;

        // Pass control to next middleware or route handler
        next();
    } catch (error) {
        return res.status(403).json({ error: "Forbidden: Invalid or expired token "});
    }
}