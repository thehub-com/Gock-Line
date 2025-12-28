import fs from "fs";

const file = "./inventory.json";

function load(){
  if(!fs.existsSync(file)) fs.writeFileSync(file,"{}");
  return JSON.parse(fs.readFileSync(file));
}

function save(data){
  fs.writeFileSync(file, JSON.stringify(data,null,2));
}

export function getInventory(userId){
  const data = load();
  return data[userId] || {};
}

export function addItem(userId,item){
  const data = load();
  if(!data[userId]) data[userId]={};
  data[userId][item]=(data[userId][item]||0)+1;
  save(data);
}

export function removeItem(userId,item){
  const data = load();
  if(data[userId]?.[item]>0){
    data[userId][item]--;
    if(data[userId][item]===0) delete data[userId][item];
    save(data);
    return true;
  }
  return false;
      }
