const db = require("../db/connection")
const {eq} = require("drizzle-orm")
const {userTable, userSessions} = require("../model/user.model")
const {randomBytes, createHmac } = require('node:crypto');


exports.signupFunction = async (req, res)=>{
    const {username, email, password} = req.body

    // find email in DB
    const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email))

    // user check validation
    if(existingUser){
        return res.status(400).json({error: `user with email ${email} already exist`})
    }

    // create a salt (random text)
    const salt = randomBytes(256).toString('hex')
    console.log("✅ Salt: ", salt);
    
    // convert into algorithm
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
    console.log("✅ hashedPassword: ", hashedPassword);

    // save into DB
    const result = await db.insert(userTable).values({
        username: username,
        email: email,
        salt: salt,
        password: hashedPassword
    }).returning({id: userTable.id})

    return res.status(201).json({status: "Account Created", data: result})
}





exports.loginFunction = async (req,res)=>{
    const {email, password} =  req.body

    const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email))

    if(!existingUser){
        return res.status(400).json({error: `user with this email ${email} does not exist`})
    }

    // salt from DB
    const dbSalt = existingUser.salt
    
    // convert into algorithm
    const newHashedPassword = createHmac('sha256', dbSalt).update(password).digest('hex');

    if(newHashedPassword !== existingUser.password){
        return res.status(400).json({error: `incorrect password`})
    } 

    const [session] = await db.insert(userSessions).values({
        userId: existingUser.id
    }).returning({id: userSessions.id})

    return res.json({status: "welcome to website", data: session})
}




exports.homeFunction = async (req, res)=>{
    // is user have data in req.user ❌✅
    const userData = req.user

    // is user data available ❌✅
    if(!userData){
        return res.status(401).json({error: "you are not logged in"})
    }

    // all information from userData (combine table information)
    return res.status(200).json({status: "Here is you data", data: userData})
}