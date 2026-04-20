
import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    trim: true  
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  mood: {
    type: String,
    enum: ["happy", "good", "meh", "sad", "awful", "angry", "anxious", "loved"],
  },
  tags: {
    type: [String],
    default: []
  },
  date: {             
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: true })  

const JOURNAL = mongoose.model("journal", journalSchema)
export { JOURNAL }