import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(7000, () => {
  console.log("Server running on port 7000");
});