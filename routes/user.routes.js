const express = require("express")
const {signupFunction, loginFunction, homeFunction} = require("../controllers/user.controller")
const {sessionCheckMiddleware} = require("../middlewares/sessionCheck.middleware")
const router = express.Router()

// ---------------------- Signup
router.post("/signup", signupFunction)

// ---------------------- Log in
router.post("/login", loginFunction)

// ---------------------- Home
router.get("/home", sessionCheckMiddleware ,homeFunction)

// ---------------------- Product
router.get("/home", sessionCheckMiddleware ,productFunction)




module.exports = router