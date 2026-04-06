import express from "express";
import cors from "cors";
import { runSoftwareHelperGraph } from "./services/graph.ai.js";

const app = express();
app.use(express.static("public"));

app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { problem } = req.body;
  if (!problem) {
    return res.status(400).json({ error: "No problem provided" });
  }
  try {
    const result = await runSoftwareHelperGraph(problem);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get("/", async (req, res) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
