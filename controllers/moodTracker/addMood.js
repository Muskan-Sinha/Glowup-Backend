import { MOOD } from "../../model/mood.js"

export const addMood = async (req, res) => {
    try {
        const { moodname, date } = req.body
        const userId = req.user._id
        if (!moodname || !date) {
            return res.status(400).json({ message: "Mood is required" })
        }
        const newMood = new MOOD({
            userId, moodname, date
        })

        await newMood.save()
        res.status(201).json({
            message: "mood Added",
            mood: newMood
        })
    }
    catch (error) {
        res.status(500).json({ message: "fail", error: error.message })
    }
}

export const updateMood = async (req, res) => {
    try {
        const userId = req.user._id
        const moodId = req.params.id

        if (moodId) {
            const updatedMood = await MOOD.findOneAndUpdate(
                { _id: moodId, userId: userId },
                req.body,
                { new: true }
            );
            return res.status(200).json({ message: "success", updatedMood })
        }
        else {
            return res.status(404).json({ message: "Not Authorised" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "failed" })
    }
}

export const getMoodByUserId = async (req, res) => {
    try {
        const uId = req.user._id

        const moods = await MOOD.find({ userId: uId })
        if (moods.length === 0)
            return res.status(404).json({ message: "Not found any moods" })
        return res.status(200).json({ message: "success", moods })
    } catch (error) {
        return res.status(500).json({ message: "failed", error })
    }
}

export const getMoodByMonth = async (req, res) => {
    try {
        const { month, year } = req.query
        const userId = req.user._id;
        if (!month || !year) {
            return res.status(400).json({ message: "Month and year required" });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const moods = await MOOD.find({
            userId,
            date: {
                $gte: startDate,
                $lt: endDate  
            }
        });

        if (moods.length === 0) {
            return res.status(404).json({ message: "No moods found for this month" });
        }

        return res.status(200).json({ message: "Success", moods });
    } catch (error) {
        return res.status(500).json({ message: "failed", error: error })
    }
}