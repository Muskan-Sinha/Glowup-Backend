import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["done", "missed"],
    required: true
  }
});

const HABITLOGS = mongoose.model("habitlogs", habitLogSchema)

export {HABITLOGS}