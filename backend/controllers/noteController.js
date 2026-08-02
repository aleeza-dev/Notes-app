import Note from "../models/Note.js";

// ======================
// Get All Notes
// ======================

export const getNotes = async (req, res) => {
  try {

    const notes = await Note.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ======================
// Add Note
// ======================

export const addNote = async (req, res) => {

  try {

    const { title, description } = req.body;

    if (!title || !description) {

      return res.status(400).json({
        message: "Please fill all fields",
      });

    }

    const note = await Note.create({
      title,
      description,
      user: req.user.id,
    });

    res.status(201).json(note);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// ======================
// Update Note
// ======================

export const updateNote = async (req, res) => {

  try {

    const note = await Note.findById(req.params.id);

    if (!note) {

      return res.status(404).json({
        message: "Note Not Found",
      });

    }

    if (note.user.toString() !== req.user.id) {

      return res.status(401).json({
        message: "Unauthorized",
      });

    }

    note.title = req.body.title;
    note.description = req.body.description;

    await note.save();

    res.status(200).json(note);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

// ======================
// Delete Note
// ======================

export const deleteNote = async (req, res) => {

  try {

    const note = await Note.findById(req.params.id);

    if (!note) {

      return res.status(404).json({
        message: "Note Not Found",
      });

    }

    if (note.user.toString() !== req.user.id) {

      return res.status(401).json({
        message: "Unauthorized",
      });

    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note Deleted Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};