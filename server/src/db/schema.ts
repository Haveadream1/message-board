// Create table schema
import { relations } from "drizzle-orm";
import { pgTable, integer, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    username: varchar("username", { length: 30 }).notNull().unique(), // Need to be unique 
    passwordHash: varchar("password_hash").notNull(), // Never store password directly
    createdAt: timestamp("created_at").defaultNow().notNull()
})

// Messages table
export const messages = pgTable("messages", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    ownerId: integer("owner_id").notNull().references(() => users.id, { onDelete: "cascade"}), // foreign key
    message: varchar("message", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    likeCount: integer("like_count").notNull().default(0)
})

// Junction table
    // Every time a user like a message, we create a new row userID-messageID
export const messageLikes = pgTable("message_likes", 
    {
        messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade"}),
        userId: integer("user_id").notNull().references(() => users.id, {onDelete: "cascade"})
    },
    (table) => ({
        // Prevent the same user to like the same message
        uniqueLike: uniqueIndex("unique_like_idx").on(table.messageId, table.userId)
    })
)

// Relations (1:1, 1:M, M:M)
    // Tells Drizzle how to JOIN tables automatically
export const usersRelations = relations(users, ({ many }) => ({
    messages: many(messages),
    likedMessages: many(messageLikes)
}))

export const messagesRelations = relations(messages, ({ one, many}) => ({
    owner: one(users, { fields: [messages.ownerId], references: [users.id]}),
    likes: many(messageLikes)
}))

export const messagesLikeRelations = relations(messageLikes, ({ one}) => ({
    message: one(messages, {fields: [messageLikes.messageId], references: [messages.id]}),
    user: one(users, {fields: [messageLikes.userId], references: [users.id]})
}))

// Specify name for the column -> "id"
// Default value for like count
// onDelete: cascade avoid to have left alone data after deletion
// Run `npm run db:push (script command) after every schema changes`