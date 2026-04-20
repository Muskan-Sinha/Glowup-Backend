import { HABITLOGS } from "../../model/habitLogs.js";

export const createHabitLog = async (req, res) => {
  try {
    const { habitId, date, status } = req.body;
    const userId = req.user._id;

    if (!habitId || !date || status === undefined || status === null)
      return res
        .status(400)
        .json({ message: "habitId, date and status are required" });
    const [year, month, day] = date.split("-").map(Number);
    const logDate = new Date(Date.UTC(year, month - 1, day));

    const existing = await HABITLOGS.findOne({
      habitId,
      userId,
      date: logDate,
    });

    if (existing) {
      await HABITLOGS.findByIdAndDelete(existing._id);
      return res.status(200).json({
        message: "Log removed",
        habitId,
        date,
        completed: false,
      });
    }
    const log = await HABITLOGS.create({
      habitId,
      userId,
      date: logDate,
      status: status === true || status === "done" ? "done" : "missed",
    });

    return res.status(201).json({
      message: "Log created",
      habitId,
      date,
      completed: true,
      log,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

export const getLogByHabitandUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { habitId } = req.query;

    const query = { userId };
    if (habitId) query.habitId = habitId;

    const logs = await HABITLOGS.find(query).lean();

    const formatted = logs.map((l) => ({
      id: l._id.toString(),
      habitId: l.habitId.toString(),
      userId: l.userId.toString(),
      date: l.date.toISOString().split("T")[0],
      status: l.status,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch logs", error: error.message });
  }
};
