export default function NoteCard({ note, onDelete, onSummarize, summarizing }) {
  return (
    <div className="note-card">
      <div className="note-header">
        <h3>{note.title}</h3>
        {note.subject && <span className="subject-tag">{note.subject}</span>}
      </div>
      <p className="note-content">{note.content}</p>
      {note.summary && (
        <div className="note-summary">
          <strong>AI Summary:</strong>
          <p>{note.summary}</p>
        </div>
      )}
      <div className="note-actions">
        <button
          className="btn-summarize"
          onClick={() => onSummarize(note._id)}
          disabled={summarizing}
        >
          {summarizing ? "Summarizing..." : "✨ Summarize"}
        </button>
        <button className="btn-delete" onClick={() => onDelete(note._id)}>
          Delete
        </button>
      </div>
      <small className="note-date">
        {new Date(note.createdAt).toLocaleString()}
      </small>
    </div>
  );
}
