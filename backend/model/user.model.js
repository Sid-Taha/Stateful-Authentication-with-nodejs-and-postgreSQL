// model\user.model.js
const {pgTable, uuid, varchar, text, timestamp, boolean} = require("drizzle-orm/pg-core")

exports.userTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    username: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    password: text().notNull()
})


exports.userSessions = pgTable("user_session", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().references(()=> exports.userTable.id).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    expireAt: timestamp().notNull(),
    isActive: boolean().default(true).notNull()
})