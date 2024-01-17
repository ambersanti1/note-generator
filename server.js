// Express is a minimal and flexible Node.js web application framework that provides a robust set of features for APIS web applications.
require("dotenv").config();
const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const notesList = require("./db/db.json");

//localhost:5000
const PORT = process.env.PORT || 80;

app.use(express.json({ type: "*/*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET to consult notes
app.get("/api/notes", (req, res) => {
  res.json(notesList.slice(1)); // Slice cuts the first element of the list which is an undefined value
});

//GET to redirect to home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//GET to redirect to note-taker page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

function saveNewNote(body, notesList) {
  body.id = notesList[0];
  notesList[0]++;

  notesList.push(body);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesList, null, 1) //(obj, replacer, spacer (in db.json))
  );
  return body;
}

app.post("/api/notes", (req, res) => {
  const savedNote = saveNewNote(req.body, notesList);
  res.json(savedNote);
});

function deleteNote(id, notesList) {
  for (let i = 0; i < notesList.length; i++) {
    let note = notesList[i];

    if (note.id == id) {
      notesList.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesList, null, 1)
      );

      break;
    }
  }
}

app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id, notesList);
  res.json(true);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}!`);
});
