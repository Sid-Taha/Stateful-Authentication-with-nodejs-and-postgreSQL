// middlewares\sessionCheck.middleware.js
const db = require("../db/connection")
const {eq} = require("drizzle-orm")
const {userSessions, userTable} = require("../model/user.model")

exports.sessionCheckMiddleware = async (req, res, next)=>{
    try {
        // const sessionId = req.header["session-id"] ❌
        const sessionId = req.cookies.sessionId    // ✅

        if(!sessionId){
            req.user = null // user data not available ❌
            return next()
        }

        // make a new table to show userTable, userSessions complete data
        const [data] = await db.select().from(userSessions).where(eq(userSessions.id, sessionId))
        .leftJoin(userTable, eq(userTable.id, userSessions.userId))

        if(!data){
            res.clearCookie("sessionId")
            res.status(401).json({error: "invalid sessionId in cookie"})
        }

        // checking sessionId is active or not
        if(!data.user_session.isActive){
            res.clearCookie("sessionId")
            return res.status(401).json({error: "session expired, please login again"})
        }

        // sessionId expiration checking
        if(new Date() > new Date(data.user_session.expireAt)){
            res.clearCookie("sessionId")
            return res.status(401).json({error: "session expired, please login again"})
        }



        req.user = data // user data is available ✅
        next()

    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }
}