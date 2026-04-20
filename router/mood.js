import express from "express"
import { verifyToken } from "../middleware/auth/auth.js"
import { addMood, getMoodByMonth, getMoodByUserId, updateMood } from "../controllers/moodTracker/addMood.js"

const router = express.Router()

router.post("/addmood", verifyToken, addMood)
router.put("/updatemood/:id", verifyToken, updateMood)
router.get("/getmoodbyuser/:id", verifyToken, getMoodByUserId)
router.get("/getmoodbymonth/month", verifyToken, getMoodByMonth)

export default router 