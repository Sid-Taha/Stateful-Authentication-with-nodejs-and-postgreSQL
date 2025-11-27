// index.js
const express = require('express');
const userRouter = require("./routes/user.routes")
const cookieParser = require('cookie-parser')
const helmet = require("helmet")
const cors = require('cors') // CORS

const app = express();
const PORT = 3000;


app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true, // Allow the cookies to be sent
}))     


app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));



app.use("/user", userRouter)

app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`)})