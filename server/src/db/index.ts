// Database connection client 
    // Exported so every routes can use it
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import "dotenv/config";

// Create connection client
const client = postgres(process.env.DATABASE_URL!);

// Init drizzle
export const db = drizzle(client, { schema });
