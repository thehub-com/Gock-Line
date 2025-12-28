import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// === FIX PATH ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === STATIC ===
app.use(express.static(path.join(__dirname, "../public")));

// === API TEST ===
app.get("/api/test", (req, res) => {
  res.json({ ok: true });
});

// === SPA FALLBACK ===
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log("GockLine running on", PORT);
});
