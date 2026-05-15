import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: ["https://work-sphere-dun.vercel.app", "https://ahtinkaya722-tech.github.io"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());

// Paths to JSON files
const membersPath = path.resolve(__dirname, "../src/features/project/members.json");
const projectsPath = path.resolve(__dirname, "../src/features/project/db.json");
const tasksPath = path.resolve(__dirname, "../src/features/project/task_db.json");

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/members", async (req, res) => {
  try {
    const data = await fs.readFile(membersPath, "utf8");
    const json = JSON.parse(data);
    res.json(json.members || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to load members" });
  }
});

app.post("/members", async (req, res) => {
  try {
    const data = await fs.readFile(membersPath, "utf8");
    const json = JSON.parse(data);
    const newMember = req.body;
    json.members.push(newMember);
    await fs.writeFile(membersPath, JSON.stringify(json, null, 2));
    res.json(json.members);
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
});

app.patch("/members/:id", async (req, res) => {
  try {
    const data = await fs.readFile(membersPath, "utf8");
    const json = JSON.parse(data);
    const index = json.members.findIndex(m => String(m.id) === String(req.params.id));
    if (index !== -1) {
      json.members[index] = { ...json.members[index], ...req.body };
      await fs.writeFile(membersPath, JSON.stringify(json, null, 2));
      res.json(json.members[index]);
    } else {
      res.status(404).json({ error: "Member not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update member" });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const data = await fs.readFile(projectsPath, "utf8");
    const json = JSON.parse(data);
    res.json(json.projects || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to load projects" });
  }
});

app.post("/projects", async (req, res) => {
  try {
    const data = await fs.readFile(projectsPath, "utf8");
    const json = JSON.parse(data);
    const newProject = req.body;
    json.projects.push(newProject);
    await fs.writeFile(projectsPath, JSON.stringify(json, null, 2));
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to add project" });
  }
});

app.patch("/projects/:id", async (req, res) => {
  try {
    const data = await fs.readFile(projectsPath, "utf8");
    const json = JSON.parse(data);
    const index = json.projects.findIndex(p => String(p.id) === String(req.params.id));
    if (index !== -1) {
      json.projects[index] = { ...json.projects[index], ...req.body };
      await fs.writeFile(projectsPath, JSON.stringify(json, null, 2));
      res.json(json.projects[index]);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    const data = await fs.readFile(projectsPath, "utf8");
    const json = JSON.parse(data);
    json.projects = json.projects.filter(p => String(p.id) !== String(req.params.id));
    await fs.writeFile(projectsPath, JSON.stringify(json, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const data = await fs.readFile(tasksPath, "utf8");
    const json = JSON.parse(data);
    res.json(json.tasks || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to load tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const data = await fs.readFile(tasksPath, "utf8");
    const json = JSON.parse(data);
    const newTask = req.body;
    json.tasks.push(newTask);
    await fs.writeFile(tasksPath, JSON.stringify(json, null, 2));
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const data = await fs.readFile(tasksPath, "utf8");
    const json = JSON.parse(data);
    const index = json.tasks.findIndex(t => String(t.id) === String(req.params.id));
    if (index !== -1) {
      json.tasks[index] = { ...json.tasks[index], ...req.body };
      await fs.writeFile(tasksPath, JSON.stringify(json, null, 2));
      res.json(json.tasks[index]);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const data = await fs.readFile(tasksPath, "utf8");
    const json = JSON.parse(data);
    json.tasks = json.tasks.filter(t => String(t.id) !== String(req.params.id));
    await fs.writeFile(tasksPath, JSON.stringify(json, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.listen(7000, () => {
  console.log("Server running on port 7000");
});