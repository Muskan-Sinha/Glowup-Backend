import { JOURNAL } from "../../model/journal.js";

export const createEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, content, mood, tags, date } = req.body;

    if (!content) 
      return res.status(400).json({ message: "Content is required" });

    const entry = await JOURNAL.create({
      userId,
      title,
      content,
      mood,
      tags,
      date: date || new Date()
    });

    return res.status(201).json(entry);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create entry", error: error.message });
  }
};

export const getAllEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const entries = await JOURNAL.find({ userId })
      .sort({ date: -1 })                          
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await JOURNAL.countDocuments({ userId });

    return res.status(200).json({
      entries,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch entries", error: error.message });
  }
};

export const getOneEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const entry = await JOURNAL.findOne({ _id: id, userId }).lean();

    if (!entry) 
      return res.status(404).json({ message: "Entry not found" });

    return res.status(200).json(entry);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch entry", error: error.message });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, content, mood, tags, date } = req.body;

    const updates = {};
    if (title   !== undefined) updates.title   = title;
    if (content !== undefined) updates.content = content;
    if (mood    !== undefined) updates.mood    = mood;
    if (tags    !== undefined) updates.tags    = tags;
    if (date    !== undefined) updates.date    = date;

    const updated = await JOURNAL.findOneAndUpdate(
      { _id: id, userId },
      { $set: updates },
      { new: true }
    );

    if (!updated) 
      return res.status(404).json({ message: "Entry not found" });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update entry", error: error.message });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await JOURNAL.findOneAndDelete({ _id: id, userId });

    if (!deleted) 
      return res.status(404).json({ message: "Entry not found" });

    return res.status(200).json({ message: "Entry deleted", id });
                                                
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete entry", error: error.message });
  }
};

export const getEntriesByMonth = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;

    if (!year || !month) 
      return res.status(400).json({ message: "year and month are required" });

    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 1);    

    const entries = await JOURNAL.find({
      userId,
      date: { $gte: start, $lt: end }
    }).sort({ date: -1 }).lean();

    return res.status(200).json({ entries });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch entries", error: error.message });
  }
};

export const searchEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { q } = req.query;

    if (!q) 
      return res.status(400).json({ message: "Search query is required" });

    const entries = await JOURNAL.find({
      userId,
      $or: [
        { title:   { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags:    { $in: [new RegExp(q, "i")] } }
      ]
    }).sort({ date: -1 }).lean();

    return res.status(200).json({ entries });
  } catch (error) {
    return res.status(500).json({ message: "Failed to search entries", error: error.message });
  }
};