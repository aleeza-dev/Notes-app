import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.get("/", authMiddleware, getNotes);

router.post("/", authMiddleware, addNote);

router.put("/:id", authMiddleware, updateNote);

router.delete("/:id", authMiddleware, deleteNote);

export default router;