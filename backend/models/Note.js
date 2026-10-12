
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["Personal", "Work", "Study", "Ideas", "Other"],
      default: "Personal",
    },

    tags: {
      type: [String],
      default: [],
    },

    color: {
      type: String,
      enum: ["default", "yellow", "pink", "blue", "green", "purple"],
      default: "default",
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
