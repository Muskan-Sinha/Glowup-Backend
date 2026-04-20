import mongoose from "mongoose"

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    moodname: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    }
})

const MOOD = mongoose.model("mood", moodSchema)

export {MOOD}