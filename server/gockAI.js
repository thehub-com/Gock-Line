import fs from "fs";

const FILE="./punish.json";

/* запрещено законом */
const FORBIDDEN=[
  "взорвать","бомба","террор",
  "продам паспорт","взлом",
  "карта украд","наркотик",
  "убью","расстрел"
];

function read(){
  if(!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE,"utf8"));
}

function save(d){
  fs.writeFileSync(FILE,JSON.stringify(d,null,2));
}

export function gockCheck({userId,text}){
  const low=text.toLowerCase();
  for(const bad of FORBIDDEN){
    if(low.includes(bad)){
      const p=read();
      p.push({
        id:Date.now(),
        userId,
        text,
        type:"ban",
        time:Date.now()
      });
      save(p);
      return { action:"ban", reason:bad };
    }
  }
  return { action:"ok" };
}

export function getPunish(){
  return read();
}
