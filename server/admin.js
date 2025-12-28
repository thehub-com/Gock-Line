import fs from "fs";

const file = "./punishments.json";

function load(){
  return JSON.parse(fs.readFileSync(file));
}
function save(data){
  fs.writeFileSync(file, JSON.stringify(data,null,2));
}

export function banUser(userId){
  const d = load();
  if(!d.bans.includes(userId)){
    d.bans.push(userId);
    save(d);
  }
}

export function muteUser(userId, minutes){
  const d = load();
  d.mutes[userId] = Date.now() + minutes*60000;
  save(d);
}

export function isBanned(userId){
  const d = load();
  return d.bans.includes(userId);
}

export function isMuted(userId){
  const d = load();
  if(!d.mutes[userId]) return false;
  if(Date.now() > d.mutes[userId]){
    delete d.mutes[userId];
    save(d);
    return false;
  }
  return true;
     }
