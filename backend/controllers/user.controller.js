// controllers\user.controller.js
const db = require("../db/connection")
const {eq} = require("drizzle-orm")
const {userTable, userSessions} = require("../model/user.model")
const bcrypt = require('bcrypt');

// -----------------------------------------------  Sign-up 
exports.signupFunction = async (req, res)=>{
  try {
    const {username, email, password} = req.body

    // find email in DB
    const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email))

    // user check validation
    if(existingUser){
        return res.status(400).json({error: `user with email ${email} already exist`})
    }

    // hashing
    const hashedPassword = await bcrypt.hash(password, 10)

    // save into DB
    const result = await db.insert(userTable).values({
        username: username,
        email: email,
        password: hashedPassword
    }).returning({id: userTable.id})

    return res.status(201).json({status: "Account Created", data: result})

  } catch (error) {
    return res.status(500).json({error: "Internal Server Error"})
  }
}




// -----------------------------------------------  Log-in
exports.loginFunction = async (req,res)=>{
try {
    const {email, password} =  req.body

    // email checking into database
    const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email))
    if(!existingUser){
        return res.status(400).json({error: `user with this email does not exist`})
    }
    
    // password checking from bcrypt
    const isValidPassword = await bcrypt.compare(password  ,   existingUser.password)
    if(!isValidPassword){
        return res.status(400).json({error: `incorrect password`})
    } 

    // create expiration date
    const expireAt = new Date() // current date and time
    expireAt.setDate(expireAt.getDate() + 7) // update date and time
  

    // create session for user into database
    const [session] = await db.insert(userSessions).values({
        userId: existingUser.id,
        expireAt: expireAt
    }).returning({id: userSessions.id})





    // setting cookie for 7 days
    res.cookie("sessionId", session.id, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 *1000 // 7 Days 
    })

    return res.json({status: "welcome to website"})

} catch (error) {
    return res.status(500).json({error: "Internal Server Error"})
}
}



// -----------------------------------------------  Home
exports.homeFunction = async (req, res)=>{
    try {
        // is user have data in req.user ❌✅
        const userData = req.user //null, data

        // is user data available ❌✅
        if(!userData){
            return res.status(401).json({error: "you are not logged in"})
        }

        // all information from userData (combine table information)
        return res.status(200).json({status: "Here is you data", data: userData})

    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }
}




// -----------------------------------------------  Logout
exports.logoutFunction = async (req, res)=>{
try {
    const sessionId = req.cookies.sessionId

    // update session status to false
    if(sessionId){
        await db.update(userSessions).set({
            isActive : false
        }).where(eq(userSessions.id, sessionId))
    }

    res.clearCookie("sessionId")
    return res.status(200).json({status : "logged out !"})

} catch (error) {
    return res.status(500).json({error: "Internal Server Error"})
}
}