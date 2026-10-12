
import "./NoteCard.css";

const NoteCard = ({
  note,
  deleteNote,
  editNote,
  toggleNoteProperty,
}) => {
  const safeColor = [
    "default",
    "yellow",
    "pink",
    "blue",
    "green",
    "purple",
  ].includes(note.color)
    ? note.color
    : "default";

  return (
    <article className={`note-card note-color-${safeColor}`}>
      <div className="note-card-top">
        <span className="note-category">
          {note.category || "Personal"}
        </span>

        <div className="note-card-status">
          {note.isPinned && <span title="Pinned">📌</span>}
          {note.isFavorite && <span title="Favorite">★</span>}
        </div>
      </div>

      <h3>{note.title}</h3>

      {note.content ? (
        <div
          className="note-card-content"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      ) : (
        <p className="note-card-description">{note.description}</p>
      )}

      {note.tags?.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}

      <div className="buttons">
        <button
          type="button"
          className="edit-btn"
          onClick={() => editNote(note)}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={() => deleteNote(note._id)}
        >
          Delete
        </button>

        <button
          type="button"
          className="note-action-btn"
          onClick={() => toggleNoteProperty(note, "isPinned")}
        >
          {note.isPinned ? "Unpin" : "Pin"}
        </button>

        <button
          type="button"
          className="note-action-btn"
          onClick={() => toggleNoteProperty(note, "isFavorite")}
        >
          {note.isFavorite ? "★ Saved" : "☆ Favorite"}
        </button>
      </div>
    </article>
  );
};

export default NoteCard;
