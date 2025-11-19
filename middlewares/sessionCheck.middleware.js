const db = require("../db/connection")
const {eq} = require("drizzle-orm")
const {userSessions, userTable} = require("../model/user.model")

exports.sessionCheckMiddleware = async (req, res, next)=>{
    const sessionId = req.headers["session-id"]
    if(!sessionId){
        req.user = null // user data not available ❌
        return next()
    }

    // First get the sessionId from database
    const [session] = await db.select().from(userSessions).where(eq(userSessions.id, sessionId))
    if(!session){
        return res.status(401).json({error: "invalid session"})
    }

    // make a new table to show userTable, userSessions complete data
    const [data] = await db.select().from(userSessions).where(eq(userSessions.id, sessionId))
    .leftJoin(userTable, eq(userTable.id, userSessions.userId))

    req.user = data // user data is available ✅
    next()
}