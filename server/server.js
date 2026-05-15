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

app.get("/projects", async (req, res) => {
  try {
    const data = await fs.readFile(projectsPath, "utf8");
    const json = JSON.parse(data);
    res.json(json.projects || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to load projects" });
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

app.listen(7000, () => {
  console.log("Server running on port 7000");
});