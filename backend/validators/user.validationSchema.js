// validators\user.validationSchema.js
const {z} = require("zod")

// --------------------------------------------------- Sign-Up
exports.signupSchema = z.object({
    username: z.string().min(1, "username is required"),
    email : z.email("invalid email format"),
    password: z.string().min(6, "password must be at least 6 characters")
})




// --------------------------------------------------- Login-in
exports.loginSchema = z.object({
    email : z.email("invalid email format"),
    password: z.string().min(6, "password must be at least 6 characters")
})