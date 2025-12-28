const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

/* ===== API ===== */
app.use(express.json());

app.post("/login", (req, res) => {
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("GockLine work");
});

/* ===== WS ===== */
wss.on("connection", ws => {
  ws.on("message", data => {
    wss.clients.forEach(c => {
      if (c.readyState === WebSocket.OPEN) {
        c.send(data.toString());
      }
    });
  });
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
