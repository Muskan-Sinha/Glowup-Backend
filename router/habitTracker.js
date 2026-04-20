import express from "express"
import { verifyToken } from "../middleware/auth/auth.js"
import { createHabit, deleteHabit, getHabitByUser, updateHabit } from "../controllers/HabitTracker/createHabit.js"
import { createHabitLog, getLogByHabitandUser } from "../controllers/HabitTracker/HabitLogs.js"

const router = express.Router()

router.post("/createhabit", verifyToken, createHabit)
router.patch(  "/updatehabit/:id",   verifyToken, updateHabit);
router.post("/loghabit", verifyToken, createHabitLog)
router.get("/gethabitbyuser", verifyToken, getHabitByUser)
router.get("/getlogbyhabit", verifyToken, getLogByHabitandUser)
router.delete("/deletehabit/:id", verifyToken, deleteHabit)

export default router  