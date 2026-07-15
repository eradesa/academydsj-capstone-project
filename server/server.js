require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/landing", express.static(path.join(__dirname, "..", "landing")));
app.get("/", (req, res) => res.redirect("/landing/index.html"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, default: "" },
  content: { type: String, required: true },
  summary: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

app.get("/api/notes", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, subject, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const note = await Note.create({ title, subject, content });
  res.status(201).json(note);
});

app.delete("/api/notes/:id", async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json({ message: "Note deleted" });
});

app.post("/api/notes/:id/summarize", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a study assistant. Summarize the note in 3 bullet points, then create 1 quiz question with answer. Format:\n**Summary:**\n- bullet 1\n- bullet 2\n- bullet 3\n\n**Quiz:**\nQuestion: ...\nAnswer: ...",
        },
        {
          role: "user",
          content: `Title: ${note.title}\nSubject: ${note.subject}\nContent: ${note.content}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;
    note.summary = summary;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
