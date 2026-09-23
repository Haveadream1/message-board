// Create table schema
import { pgTable, integer, varchar, timestamp  } from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    username: varchar("username", { length: 30 }).notNull().unique(),
    message: varchar("message", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    likeCount: integer("like_count").notNull().default(0)
})

// Specify name for the column -> "id"
// Default value for like count
// Run `npm run db:push (script command) after every schema changes`