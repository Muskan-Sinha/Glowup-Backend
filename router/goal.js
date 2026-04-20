import express from "express"
import { verifyToken } from "../middleware/auth/auth.js"
import { createGoal, deleteGoal, getGoalByUser, updateGoal, updateLog } from "../controllers/Goals/CreateGoals.js";

const router = express.Router()

router.post("/creategoal", verifyToken, createGoal)
router.patch("/updategoal/:id",   verifyToken, updateGoal);
router.patch("/updatelog/:id", verifyToken, updateLog)
router.get("/getgoal", verifyToken, getGoalByUser)
router.delete("/deletegoal/:id", verifyToken, deleteGoal)

export default router  