// middlewares\user.validation.middleware.js
const {signupSchema, loginSchema} = require("../validators/user.validationSchema")

// -------------------------------------------------------- Sign-up
exports.signupValidationMiddleware = (req, res,next) => {
    try {
        signupSchema.parse(req.body)
        next()
    } catch (error) {
        return res.status(400).json({message: "Invalid email or password", error: error})
    }
}


// -------------------------------------------------------- Log-in
exports.loginValidationMiddleware = (req, res,next) => {
    try {
        loginSchema.parse(req.body)
        next()
    } catch (error) {
        return res.status(400).json({message: "Invalid email or password", error: error})
    }
}