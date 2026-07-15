import { useState, useEffect } from "react";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import "./App.css";

const API = "/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [summarizingId, setSummarizingId] = useState(null);

  const fetchNotes = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (note) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    if (res.ok) fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const summarizeNote = async (id) => {
    setSummarizingId(id);
    const res = await fetch(`${API}/${id}/summarize`, { method: "POST" });
    if (res.ok) fetchNotes();
    setSummarizingId(null);
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <nav className="navbar">
        <span className="nav-brand">StudyMate</span>
        <div className="nav-links">
          <a href="http://localhost:5173" className="nav-active">Notes</a>
          <a href="../landing/index.html">Home</a>
        </div>
      </nav>

      <header>
        <h1>StudyMate</h1>
        <p>Your AI-powered study notes</p>
      </header>

      <NoteForm onAdd={addNote} />

      <input
        type="text"
        className="search-box"
        placeholder="Search by title or subject..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="empty-state">Loading notes...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No notes yet — add your first one!</p>
      ) : (
        <div className="notes-grid">
          {filtered.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={deleteNote}
              onSummarize={summarizeNote}
              summarizing={summarizingId === note._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
