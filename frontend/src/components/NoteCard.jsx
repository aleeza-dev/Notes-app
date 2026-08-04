import "./NoteCard.css";

const NoteCard = ({ note, deleteNote, editNote }) => {
  return (
    <div className="note-card">

      <h3>{note.title}</h3>

      <p>{note.description}</p>

      <div className="buttons">

        <button
          className="edit-btn"
          onClick={() => editNote(note)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteNote(note._id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default NoteCard;