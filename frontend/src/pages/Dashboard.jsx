
import { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import RichTextEditor from "../components/RichTextEditor";
import API from "../services/api";
import "./Dashboard.css";
import "./NoteImage.css";

const emptyContent = "";

const escapeHtml = (text = "") =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .split("\n")
    .map((line) => `<p>${line || "<br>"}</p>`)
    .join("");

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(emptyContent);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [tagsInput, setTagsInput] = useState("");
  const [color, setColor] = useState("default");
  const [isPinned, setIsPinned] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [editId, setEditId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setDescription("");
    setCategory("Personal");
    setTagsInput("");
    setColor("default");
    setIsPinned(false);
    setIsFavorite(false);
    setEditId(null);
  };

  const addNote = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and note content.");
      return;
    }

    const tags = [
      ...new Set(
        tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      ),
    ];

    const payload = {
      title: title.trim(),
      content,
      description,
      category,
      tags,
      color,
      isPinned,
      isFavorite,
    };

    setSaving(true);

    try {
      if (editId) {
        await API.put(`/api/notes/${editId}`, payload);
      } else {
        await API.post("/api/notes", payload);
      }

      resetForm();
      await fetchNotes();
    } catch (error) {
      console.error("Save Note Error:", error);
      alert(error.response?.data?.message || "Could not save note.");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await API.delete(`/api/notes/${id}`);
      if (editId === id) resetForm();
      await fetchNotes();
    } catch (error) {
      console.error("Delete Note Error:", error);
      alert("Could not delete note.");
    }
  };

  const editNote = (note) => {
    setTitle(note.title || "");

    // Old notes used plain text in description.
    // Convert that text into safe paragraph HTML for the editor.
    setContent(note.content || escapeHtml(note.description || ""));
    setDescription(note.description || "");
    setCategory(note.category || "Personal");
    setTagsInput((note.tags || []).join(", "));
    setColor(note.color || "default");
    setIsPinned(Boolean(note.isPinned));
    setIsFavorite(Boolean(note.isFavorite));
    setEditId(note._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateEditorContent = (html, text) => {
    setContent(html);
    setDescription(text);
  };

  const toggleNoteProperty = async (note, property) => {
    try {
      await API.put(`/api/notes/${note._id}`, {
        [property]: !note[property],
      });
      await fetchNotes();
   
} catch (error) {
  console.error("Update Note Error:", {
    property,
    message: error.message,
    status: error.response?.status,
    response: error.response?.data,
    url: error.config?.url,
  });

  alert(
    error.response?.data?.message ||
    `Update failed. Status: ${error.response?.status || "Network error"}`
  );
}

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

    const body = document.createElement("div");
    body.className = "note-image-content";
    body.textContent = note.description || "";

    const footer = document.createElement("div");
    footer.className = "note-image-footer";
    footer.textContent = "Saved with My Notes";

    card.append(brand, heading, divider, body, footer);
    element.appendChild(card);

    Object.assign(element.style, {
      position: "fixed",
      left: "0",
      top: "0",
      zIndex: "-9999",
      pointerEvents: "none",
    });

    document.body.appendChild(element);

    try {
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

  const filteredNotes = notes
    .filter((note) =>
      `${note.title || ""} ${note.description || ""} ${(note.tags || []).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((note) =>
      categoryFilter === "All"
        ? true
        : (note.category || "Personal") === categoryFilter
    )
    .filter((note) => (favoriteOnly ? note.isFavorite : true))
    .sort((a, b) => Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned)));

  const categories = [
    "All",
    "Personal",
    "Work",
    "Study",
    ...new Set(notes.map((note) => note.category).filter(Boolean)),
  ].filter((value, index, array) => array.indexOf(value) === index);

  return (
    <>
      <Navbar />

      <main className="dashboard">
        <div className="top">
          <input
            type="search"
            placeholder="Search titles, notes or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <section className="form">
          <h2>{editId ? "Edit Note" : "Create a Note"}</h2>

          <input
            type="text"
            maxLength={200}
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="editor-field-label">Note Content</label>
          <RichTextEditor
            value={content}
            onChange={updateEditorContent}
          />

          <div className="note-options-grid">
            <label>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Study</option>
                <option>Ideas</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Note Color
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="yellow">Yellow</option>
                <option value="pink">Pink</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </select>
            </label>
          </div>

          <label className="editor-field-label" htmlFor="note-tags">
            Tags (comma separated)
          </label>
          <input
            id="note-tags"
            type="text"
            placeholder="e.g. assignment, ideas, important"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />

          <div className="note-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              Pin note
            </label>

            <label>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
              />
              Add to favorites
            </label>
          </div>

          <div className="editor-form-actions">
            <button
              type="button"
              onClick={addNote}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editId
                  ? "Update Note"
                  : "Save Note"}
            </button>

            {editId && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </section>

        <div className="note-filters">
          <label>
            Category
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={favoriteOnly ? "filter-active" : ""}
            onClick={() => setFavoriteOnly((previous) => !previous)}
          >
            {favoriteOnly ? "★ Showing Favorites" : "☆ Favorites"}
          </button>
        </div>

        <div className="notes">
          {filteredNotes.map((note) => (
            <div key={note._id} className="note-wrapper">
              <NoteCard
                note={note}
                deleteNote={deleteNote}
                editNote={editNote}
                toggleNoteProperty={toggleNoteProperty}
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
              {search || favoriteOnly || categoryFilter !== "All"
                ? "No matching notes found."
                : "No notes yet. Create your first note!"}
            </p>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
