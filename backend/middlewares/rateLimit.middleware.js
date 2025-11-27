// middlewares\rateLimit.middleware.js
const rateLimit = require("express-rate-limit")

exports.loginLimiterMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
    message: {error: "Too many login attempts. please try again after 15 minutes"},
    standardHeaders: true,
    legacyHeaders: false,
})