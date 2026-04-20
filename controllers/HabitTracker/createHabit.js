import { HABIT } from "../../model/habit.js";
import { HABITLOGS } from "../../model/habitlogs.js";

const formatHabit = (h, completedDates = []) => ({
  id:             h._id.toString(),
  userId:         h.userId.toString(),
  name:           h.name,
  icon:           h.icon,
  color:          h.color,
  category:       h.category,
  note:           h.note ?? "",
  createdAt:      h.createdAt,
  completedDates,               
});

export const createHabit = async (req, res) => {
  try {
    const { name, icon, color, category, note } = req.body;
    const userId = req.user._id;

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!icon) return res.status(400).json({ message: "Icon is required" });
    if (!color) return res.status(400).json({ message: "Color is required" });
    if (!category)
      return res.status(400).json({ message: "Category is required" });

    const newHabit = await HABIT.create({
      userId,
      name,
      icon,
      color,
      category,
      note,
    });

    res.status(201).json({
      id: newHabit._id,
      userId: newHabit.userId,
      name: newHabit.name,
      icon: newHabit.icon,
      color: newHabit.color,
      category: newHabit.category,
      note: newHabit.note ?? "",
      createdAt: newHabit.createdAt,
      completedDates: [],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

export const getHabitByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const habits = await HABIT.find({ userId }).lean();

    if (habits.length === 0) return res.status(200).json([]);
    const logs = await HABITLOGS.find({ userId }).lean();

    const logMap = {};
    for (const log of logs) {
      const key = log.habitId.toString();
      if (!logMap[key]) logMap[key] = [];
      logMap[key].push(log.date.toISOString().split("T")[0]);
    }
    const result = habits.map((h) => ({
      id: h._id.toString(),
      userId: h.userId.toString(),
      name: h.name,
      icon: h.icon,
      color: h.color,
      category: h.category,
      note: h.note ?? "",
      createdAt: h.createdAt,
      completedDates: logMap[h._id.toString()] ?? [],
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: error.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user._id;
    console.log(habitId);

    const habit = await HABIT.findOneAndDelete({ _id: habitId, userId });
    console.log(habit);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({ message: "Habit deleted", habit });
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId  = req.user._id;
    const { name, icon, color, category, note } = req.body;
 
    const updates = {};
    if (name     !== undefined) updates.name     = name;
    if (icon     !== undefined) updates.icon     = icon;
    if (color    !== undefined) updates.color    = color;
    if (category !== undefined) updates.category = category;
    if (note     !== undefined) updates.note     = note;
 
    const updated = await HABIT.findOneAndUpdate(
      { _id: habitId, userId },
      { $set: updates },
      { new: true }           
    );
 
    if (!updated)
      return res.status(404).json({ message: "Habit not found" });
 
    const logs = await HABITLOGS.find({ habitId, userId }).lean();
    const completedDates = logs.map((l) => l.date.toISOString().split("T")[0]);
 
    return res.status(200).json(formatHabit(updated, completedDates));
  } catch (error) {
    return res.status(500).json({ message: "Failed to update habit", error: error.message });
  }
};