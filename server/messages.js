import fs from "fs";

const FILE = "./messages.json";

function load(){
  if(!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}");
  return JSON.parse(fs.readFileSync(FILE,"utf8"));
}

function save(data){
  fs.writeFileSync(FILE, JSON.stringify(data,null,2));
}

export function addMessage(chat, msg){
  const db = load();
  if(!db[chat]) db[chat] = [];
  db[chat].push(msg);
  save(db);
}

export function getMessages(chat){
  const db = load();
  return db[chat] || [];
}
