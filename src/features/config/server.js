import "./env.js";
import express from "express";
import { connectDB } from "../config/db.js";
import { Invite } from "../config/invite.js";
import { sendInviteEmail } from "../config/sender.js";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsDbPath = path.resolve(__dirname, "../project/db.json");

app.use(cors());
app.use(express.json());

connectDB();

const addEmailToProject = async ({ email,projectId }) => {
  const rawData = await fs.readFile(projectsDbPath, "utf8");
  const data = JSON.parse(rawData);
  const project = data.projects?.find((item) => String(item.id) === String(projectId));

  if (!project) {
    throw new Error("Project not found");
  }

  const currentEmails = Array.isArray(project.participant_Email)
    ? project.participant_Email
    : [];
  const alreadyAdded = currentEmails.some(
    (item) => item.toLowerCase() === email.toLowerCase()
  );

  if (!alreadyAdded) {
    project.participant_Email = [...currentEmails, email];
    await fs.writeFile(projectsDbPath, JSON.stringify(data, null, 2), "utf8");
  }
};

app.post("/invite", async (req, res) => {
  try {
    const { email, projectId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID required" });
    }

    const result = await sendInviteEmail({ email, projectId });

    if (!result.success) {
      const isAuthError = result.error?.code === "EAUTH";

      return res.status(502).json({
        message: isAuthError
          ? "Gmail rejected EMAIL_USER or EMAIL_PASS. Use a Google App Password for EMAIL_PASS."
          : "Failed to send invite email",
        error: result.error?.code || result.error?.message || "Unknown email error",
      });
    }

    res.json({ message: "Invite sent successfully" });
  } catch (error) {
    console.error("Invite request failed:", error);
    res.status(500).json({
      message: "Failed to process invite",
      error: error.message,
    });
  }
});

app.get("/accept-invite", async (req, res) => {
  try {
    const { token } = req.query;

    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(400).send("Invalid invite");
    }

    if (invite.status !== "pending") {
      return res.redirect(`https://ahtinkaya722-tech.github.io/workSphere/dashboard/project/${invite.projectId}`);
    }

    if (Date.now() > invite.expiresAt) {
      return res.status(400).send("Expired");
    }

    await addEmailToProject({
      projectId: invite.projectId,
      email: invite.email,
    });

    invite.status = "accepted";
    await invite.save();

    res.send("Invite accepted! You are now added to the project.");
    res.redirect(`https://ahtinkaya722-tech.github.io/workSphere/dashboard/project/${invite.projectId}`);


  } catch (error) {
    console.error("Accept invite failed:", error);
    res.status(500).send("Failed to accept invite");
  }
});

app.listen(7000, () => {
  console.log("Server running on port 7000");
}); 
