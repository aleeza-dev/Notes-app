
import Note from "../models/Note.js";
import sanitizeHtml from "sanitize-html";

const sanitizeContent = (content = "") =>
  sanitizeHtml(content, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s",
      "h1", "h2", "h3", "ul", "ol", "li",
      "blockquote", "pre", "code", "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

const allowedColors = [
  "default", "yellow", "pink", "blue", "green", "purple",
];

const allowedCategories = [
  "Personal", "Work", "Study", "Ideas", "Other",
];

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Get Notes Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add note
export const addNote = async (req, res) => {
  try {
    const {
      title,
      description,
      content = "",
      category = "Personal",
      tags = [],
      color = "default",
      isPinned = false,
      isFavorite = false,
    } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Please enter a title and note content.",
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        message: "Title cannot exceed 200 characters.",
      });
    }

    if (!allowedColors.includes(color)) {
      return res.status(400).json({ message: "Invalid note color." });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category." });
    }

    const cleanTags = Array.isArray(tags)
      ? tags
          .filter((tag) => typeof tag === "string")
          .map((tag) => tag.trim().slice(0, 50))
          .filter(Boolean)
          .slice(0, 20)
      : [];

    const note = await Note.create({
      title: title.trim(),
      description: description.trim(),
      content: sanitizeContent(content),
      category,
      tags: cleanTags,
      color,
      isPinned: Boolean(isPinned),
      isFavorite: Boolean(isFavorite),
      user: req.user.id,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Add Note Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note Not Found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      content,
      category,
      tags,
      color,
      isPinned,
      isFavorite,
    } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Title is required." });
      }

      if (title.trim().length > 200) {
        return res.status(400).json({
          message: "Title cannot exceed 200 characters.",
        });
      }

      note.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "Invalid note description.",
        });
      }

      note.description = description.trim();
    }

    if (content !== undefined) {
      if (typeof content !== "string") {
        return res.status(400).json({
          message: "Invalid note content.",
        });
      }

      note.content = sanitizeContent(content);
    }

    if (category !== undefined) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category." });
      }

      note.category = category;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: "Invalid tags." });
      }

      note.tags = tags
        .filter((tag) => typeof tag === "string")
        .map((tag) => tag.trim().slice(0, 50))
        .filter(Boolean)
        .slice(0, 20);
    }

    if (color !== undefined) {
      if (!allowedColors.includes(color)) {
        return res.status(400).json({ message: "Invalid note color." });
      }

      note.color = color;
    }

    if (isPinned !== undefined) {
      if (typeof isPinned !== "boolean") {
        return res.status(400).json({ message: "Invalid pin value." });
      }

      note.isPinned = isPinned;
    }

    if (isFavorite !== undefined) {
      if (typeof isFavorite !== "boolean") {
        return res.status(400).json({ message: "Invalid favorite value." });
      }

      note.isFavorite = isFavorite;
    }

    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.error("Update Note Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note Not Found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Note Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
