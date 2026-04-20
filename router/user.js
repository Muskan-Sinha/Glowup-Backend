import express from "express" 
import { signin } from "../controllers/auth/signin.js"
import { signup } from "../controllers/auth/signup.js"
import {logout} from "../controllers/auth/logout.js"
import { verifyToken } from "../middleware/auth/auth.js"
const router = express.Router()

router.post("/signin", signin)
router.post("/signup", signup)
router.post("/logout", logout)
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

export default router