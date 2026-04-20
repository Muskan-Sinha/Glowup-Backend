import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    status: {
        type: String,
        enum: ["completed", "in_progress", "abandoned"],
        default: "in_progress"
    },
    category: {
        type: String,
        required: true
    },
    targetDate: {
        type: Date  
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true })

const GOAL = mongoose.model("goal", goalSchema)

export {GOAL}