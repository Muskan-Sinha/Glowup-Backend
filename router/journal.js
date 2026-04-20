import express from "express";
import {
  createEntry, getAllEntries, getOneEntry,
  updateEntry, deleteEntry, getEntriesByMonth, searchEntries
} from "../controllers/Journal/journal.js";
import { verifyToken } from "../middleware/auth/auth.js" 

const router = express.Router();

router.post  ("/create",        verifyToken, createEntry);
router.get   ("/getall",        verifyToken, getAllEntries);
router.get   ("/getone/:id",    verifyToken, getOneEntry);
router.put   ("/update/:id",    verifyToken, updateEntry);
router.delete("/delete/:id",    verifyToken, deleteEntry);
router.get   ("/getbymonth",    verifyToken, getEntriesByMonth);
router.get   ("/search",        verifyToken, searchEntries);

export default router;