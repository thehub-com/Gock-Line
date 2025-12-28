import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ===== MOCK DB (ПОКА) ===== */
const users = {};
const messages = [];

/* ===== HTTP ===== */
app.get("/", (req, res) => {
  res.send("GockLine server works");
});

app.post("/login", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "NO_TOKEN" });

  users[token] = { id: token, name: "User" };
  res.json({ ok: true, user: users[token] });
});

/* ===== START SERVER ===== */
const server = app.listen(PORT, () => {
  console.log("Server started on", PORT);
});

/* ===== WEBSOCKET ===== */
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    messages.push(msg);

    // рассылаем всем
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(msg));
      }
    });
  });
});
