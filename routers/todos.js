const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ message: "조회 실패" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content, completed } = req.body ?? {};

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "title은 필수입니다." });
    }
    if (typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ message: "content는 필수입니다." });
    }
    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({ message: "completed는 boolean이어야 합니다." });
    }

    const todo = await Todo.create({
      title: title.trim(),
      content: content.trim(),
      completed: completed ?? false,
    });

    return res.status(201).json(todo);
  } catch (error) {
    return res.status(500).json({ message: "저장 실패" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, completed } = req.body ?? {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "유효하지 않은 ID입니다." });
    }
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "title은 필수입니다." });
    }
    if (typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ message: "content는 필수입니다." });
    }
    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({ message: "completed는 boolean이어야 합니다." });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        content: content.trim(),
        completed: completed ?? false,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    return res.status(200).json(updatedTodo);
  } catch (error) {
    return res.status(500).json({ message: "수정 실패" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "유효하지 않은 ID입니다." });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    }

    return res.status(200).json({ message: "삭제 완료" });
  } catch (error) {
    return res.status(500).json({ message: "삭제 실패" });
  }
});

module.exports = router;
