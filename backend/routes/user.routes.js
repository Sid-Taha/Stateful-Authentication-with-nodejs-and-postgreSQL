// routes\user.routes.js
const express = require("express")
const {signupFunction, loginFunction, homeFunction, logoutFunction} = require("../controllers/user.controller")
const {sessionCheckMiddleware} = require("../middlewares/sessionCheck.middleware")
const {signupValidationMiddleware, loginValidationMiddleware} = require("../middlewares/user.validation.middleware")
const {loginLimiterMiddleware} = require("../middlewares/rateLimit.middleware")

const router = express.Router()

// ---------------------- Signup
router.post("/signup", signupValidationMiddleware ,signupFunction)

// ---------------------- Log in
router.post("/login", loginLimiterMiddleware ,loginValidationMiddleware ,loginFunction)

// ---------------------- Home
router.get("/home", sessionCheckMiddleware ,homeFunction)

// ---------------------- Logout
router.post("/logout", logoutFunction)


module.exports = router