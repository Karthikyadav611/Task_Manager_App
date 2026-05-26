import mongoose from "mongoose";
import Task, { TASK_STAGES } from "../models/Task.js";

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description = "", stage = "Todo" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    if (!TASK_STAGES.includes(stage)) {
      return res.status(400).json({ message: "Invalid task stage." });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      stage,
      userId: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, stage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id." });
    }

    if (stage && !TASK_STAGES.includes(stage)) {
      return res.status(400).json({ message: "Invalid task stage." });
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (typeof title === "string") {
      task.title = title.trim();
    }
    if (typeof description === "string") {
      task.description = description.trim();
    }
    if (typeof stage === "string") {
      task.stage = stage;
    }

    if (!task.title) {
      return res.status(400).json({ message: "Task title cannot be empty." });
    }

    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id." });
    }

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export { getTasks, createTask, updateTask, deleteTask };
