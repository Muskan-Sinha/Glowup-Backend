import express from "express"
import dotenv from "dotenv"
import { connectToMongoDB } from "./connect.js"
import userRouter from "./router/user.js"
import moodRouter from "./router/mood.js"
import habitRouter from "./router/habitTracker.js"
import goalRouter from "./router/goal.js"
import journalRouter from "./router/journal.js"
import cookieParser from 'cookie-parser'
import cors from "cors";

dotenv.config({
    path: './.env'
})

const app = express()
app.use(cookieParser())
connectToMongoDB('mongodb://localhost:27017/glowup').then(() => console.log("connected"))

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/api/user", userRouter)
app.use("/api/mood", moodRouter)
app.use("/api/habits", habitRouter)
app.use("/api/goal", goalRouter)
app.use("/api/journal", journalRouter)


app.listen(process.env.PORT || 8000, () =>
    console.log("Server started"))