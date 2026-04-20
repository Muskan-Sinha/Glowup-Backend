import { GOAL } from "../../model/goals.js";

export const createGoal = async (req, res) => {
  try {
    const { name, desc, category, targetDate } = req.body;
    const userId = req.user._id;

    if ((!name|| !category|| !targetDate))
      return res.status(400).json({ message: "All fields are required" });
    const newGoal = await GOAL.create({
      userId,
      name,
      desc,
      category,
      targetDate,
    });
    res.status(201).json({
      _id: newGoal._id,
      targetDate: newGoal.targetDate,
      userId: newGoal.userId,
      name: newGoal.name,
      status: newGoal.status,
      category: newGoal.category,
      desc: newGoal.desc ?? "",
      createdAt: newGoal.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

export const getGoalByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const goals = await GOAL.find({ userId }).lean();

    if (goals.length === 0) return res.status(200).json([]);
    const result = goals.map((g) => ({
      _id: g._id.toString(),
      userId: g.userId.toString(),
      name: g.name,
      targetDate: g.targetDate,
      status: g.status,
      category: g.category,
      desc: g.desc ?? "",
      createdAt: g.createdAt,
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Failed", error: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user._id;
    console.log(goalId);

    const goal = await GOAL.findOneAndDelete({ _id: goalId, userId });
    console.log(goal);

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal deleted", goal });
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user._id;
    const { name, desc, targetDate, category } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (targetDate !== undefined) updates.targetDate = targetDate;
    if (desc !== undefined) updates.desc = desc;
    if (category !== undefined) updates.category = category;

    const updated = await GOAL.findOneAndUpdate(
      { _id: goalId, userId },
      { $set: updates },
      { new: true },
    );

    if (!updated) return res.status(404).json({ message: "Goal not found" });

    return res.status(200).json(updated);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update goal", error: error.message });
  }
};

export const updateLog = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user._id;
    const { status } = req.body;
    
    const updates = {};
    if (status!==undefined) updates.status = status
    if (status === "completed") updates.completedAt = new Date();
    const updated = await GOAL.findOneAndUpdate(
      { _id: goalId, userId },
      { $set: updates },
      { new: true },
    );
    if (!updated) return res.status(404).json({ message: "Goal not found" });

    return res.status(200).json(updated);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update goal", error: error.message });
  }
};
