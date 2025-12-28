import express from "express";
import cors from "cors";
import fs from "fs";
import http from "http";
import { WebSocketServer } from "ws";
import { checkMessage } from "./gockAI.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const users = JSON.parse(fs.readFileSync("./users.json"));

/* ===== LOGIN ===== */
app.post("/login",(req,res)=>{
  const { token } = req.body;
  if(!token || !users.tokens[token]){
    return res.status(401).json({error:"bad token"});
  }
  res.json({ ok:true, user:users.tokens[token] });
});

const server = http.createServer(app);

/* ===== WS ===== */
const wss = new WebSocketServer({ server });

wss.on("connection",(ws)=>{
  ws.on("message",(data)=>{
    let msg;
    try{
      msg = JSON.parse(data);
    }catch{
      return;
    }

    /* ===== Gock AI MODERATION ===== */
    if(msg.type==="text"){
      const check = checkMessage(msg.text);
      if(!check.ok){
        ws.send(JSON.stringify({
          type:"system",
          text:`⛔ Сообщение удалено. ${check.reason}`,
          time:Date.now()
        }));
        return;
      }
    }

    /* ===== BROADCAST ===== */
    wss.clients.forEach(c=>{
      if(c.readyState===1){
        c.send(JSON.stringify(msg));
      }
    });
  });
});

server.listen(3000,()=>{
  console.log("GockLine server running on :3000");
});
