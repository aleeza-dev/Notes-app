
import { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import API from "../services/api";
import "./Dashboard.css";
import "./NoteImage.css";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/api/notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Fetch Notes Error:", error);
    }
  };

  const addNote = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Fill all fields");
      return;
    }

    try {
      if (editId) {
        await API.put(`/api/notes/${editId}`, {
          title,
          description,
        });
        setEditId(null);
      } else {
        await API.post("/api/notes", {
          title,
          description,
        });
      }

      setTitle("");
      setDescription("");
      await fetchNotes();
    } catch (error) {
      console.error("Save Note Error:", error);
      alert(error.response?.data?.message || "Could not save note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/api/notes/${id}`);
      await fetchNotes();
    } catch (error) {
      console.error("Delete Note Error:", error);
      alert("Could not delete note");
    }
  };

  const editNote = (note) => {
    setTitle(note.title || "");
    setDescription(note.description || "");
    setEditId(note._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
  };

  const downloadNoteAsImage = async (note) => {
    setDownloadingId(note._id);

    const element = document.createElement("div");
    element.className = "note-image-export";

    const card = document.createElement("div");
    card.className = "note-image-card";

    const brand = document.createElement("div");
    brand.className = "note-image-brand";
    brand.textContent = "✦ MY NOTES";

    const heading = document.createElement("h1");
    heading.className = "note-image-title";
    heading.textContent = note.title || "Untitled Note";

    const divider = document.createElement("div");
    divider.className = "note-image-divider";

    const content = document.createElement("div");
    content.className = "note-image-content";
    content.textContent = note.description || "";

    const footer = document.createElement("div");
    footer.className = "note-image-footer";
    footer.textContent = "Saved with My Notes";

    card.append(brand, heading, divider, content, footer);
    element.appendChild(card);

    // Keep the export element rendered for image capture.
    element.style.position = "fixed";
    element.style.left = "0";
    element.style.top = "0";
    element.style.zIndex = "-9999";
    element.style.pointerEvents = "none";

    document.body.appendChild(element);

    try {
      // Wait for the browser to finish laying out the export.
      await new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(resolve)
        )
      );

      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: "#fff1f2",
        cacheBust: true,
        skipFonts: true,
      });

      const link = document.createElement("a");

      const safeTitle = (note.title || "note")
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
        .trim()
        .slice(0, 100) || "note";

      link.download = `${safeTitle}.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Image Download Error:", error);
      alert("Could not download image. Please try again.");
    } finally {
      element.remove();
      setDownloadingId(null);
    }
  };

  const filteredNotes = notes.filter((note) =>
    (note.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <div className="top">
          <input
            type="text"
            placeholder="Search Note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="form">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Write your note..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="button" onClick={addNote}>
            {editId ? "Update Note" : "Add Note"}
          </button>

          {editId && (
            <button type="button" onClick={cancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>

        <div className="notes">
          {filteredNotes.map((note) => (
            <div key={note._id} className="note-wrapper">
              <NoteCard
                note={note}
                deleteNote={deleteNote}
                editNote={editNote}
              />

              <button
                type="button"
                className="download-note-btn"
                onClick={() => downloadNoteAsImage(note)}
                disabled={downloadingId === note._id}
              >
                {downloadingId === note._id
                  ? "Preparing Image..."
                  : "↓ Download as Image"}
              </button>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <p className="no-notes-message">
              {search ? "No matching notes found." : "No notes yet. Add your first note!"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
