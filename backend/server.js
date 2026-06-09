import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = 5000;
const DATA_FILE = path.resolve('./tasks.json');

app.use(cors({ origin: true }));
app.use(express.json());

// utilitaires persistence
async function readTasks() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    if (!raw.trim()) return []; // fichier vide -> tableau vide
    const clean = raw.replace(/^\uFEFF/, '');
    return JSON.parse(clean);
  } catch (err) {
    if (err.code === 'ENOENT') return []; // pas de fichier -> tableau vide
    throw err;
  }
}
async function writeTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

// Route test
app.get("/", (req, res) => {
  res.json({ message: "Le backend fonctionne bien ✅" });
});

// GET tasks
app.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await readTasks();
    res.json(tasks);
  } catch (err) { next(err); }
});

// POST task
app.post("/tasks", async (req, res, next) => {
  try {
    const { nom, duree, priorite } = req.body;
    if (!nom || !duree || !priorite) {
      return res.status(400).json({ error: "Champs requis: nom, duree, priorite" });
    }
    const tasks = await readTasks();
    const id = crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const task = { id, nom, duree: Number(duree), priorite };
    tasks.push(task);
    await writeTasks(tasks);
    res.status(201).json(task);
  } catch (err) { next(err); }
});

// DELETE task
app.delete("/tasks/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let tasks = await readTasks();
    const before = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    if (tasks.length === before) return res.status(404).json({ error: "Tâche non trouvée" });
    await writeTasks(tasks);
    res.json({ message: "Supprimé" });
  } catch (err) { next(err); }
});

//generer le planning
app.get("/schedule", async (req, res, next) => {
  try{
    const tasks = await readTasks();
    const priorityOrder = {haute:3 , moyenne:2, basse:1};
    const sorted=[...tasks].sort((a,b) => (priorityOrder[b.priorite] || 0) - (priorityOrder[a.priorite] || 0));
    let currentHour = 8;
    const schedule = sorted.map(task => {
      const start = currentHour;
      currentHour += task.duree;
      return { ...task, 
        start: formatTime(start),
        end: formatTime(currentHour) };
    });
    res.json(schedule);
  }
  catch(err){ next(err); }
});
function formatTime(h) {
  const totalMin = Math.round(h * 60);
  const hh = Math.floor(totalMin / 60)%24;
  const mm = totalMin % 60;
  return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur" });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
