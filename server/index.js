const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// лог, чтобы Render видел запуск
console.log("Starting server...");

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// тестовый роут
app.get("/ping", (req, res) => {
  res.send("pong");
});

// отдаём HTML
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// ВАЖНО: listen
app.listen(PORT, () => {
  console.log("✅ Server started on port", PORT);
});
