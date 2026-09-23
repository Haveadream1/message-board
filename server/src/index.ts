import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { messagesTable } from './db/schema.js';
import "dotenv/config";

// Create connection client
const client = postgres(process.env.DATABASE_URL!);

// Init drizzle
const db = drizzle(client, { schema: { messagesTable }});

async function testDatabase() {
    try {
        const newMessage = {
            username: "Haveadream1",
            message: "Hi, is Drizzle working ?"
        };

        // Insert into db
        await db.insert(messagesTable).values(newMessage);
        console.log("New message was successfully inserted !");

        // Fetch all messsages
        const allMessages = await db.select().from(messagesTable);
        console.log("All messages: ", allMessages);

    } catch (error) {
        console.error("Database error: ", error);
    } finally {
        await client.end();
    }
}
testDatabase();