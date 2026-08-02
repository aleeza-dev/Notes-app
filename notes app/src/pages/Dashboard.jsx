import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import API from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {

    const [notes, setNotes] = useState([]);

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [search, setSearch] = useState("");

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {

        try {

            const res = await API.get("/notes");

            setNotes(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const addNote = async () => {

        if (!title || !description) {
            return alert("Fill all fields");
        }

        try {

            if (editId) {

                await API.put(`/notes/${editId}`, {
                    title,
                    description,
                });

                setEditId(null);

            } else {

                await API.post("/notes", {
                    title,
                    description,
                });

            }

            setTitle("");

            setDescription("");

            fetchNotes();

        } catch (error) {

            console.log(error);

        }

    };

    const deleteNote = async (id) => {

        try {

            await API.delete(`/notes/${id}`);

            fetchNotes();

        } catch (error) {

            console.log(error);

        }

    };

    const editNote = (note) => {

        setTitle(note.title);

        setDescription(note.description);

        setEditId(note._id);

    };

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
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
                    ></textarea>

                    <button onClick={addNote}>
                        {editId ? "Update Note" : "Add Note"}
                    </button>

                </div>

                <div className="notes">

                    {filteredNotes.map((note) => (

                        <NoteCard
                            key={note._id}
                            note={note}
                            deleteNote={deleteNote}
                            editNote={editNote}
                        />

                    ))}

                </div>

            </div>

        </>

    );
};

export default Dashboard;