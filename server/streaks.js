import fs from "fs";

const FILE="./streaks.json";

function load(){
  if(!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE,"utf8"));
}

function save(d){
  fs.writeFileSync(FILE,JSON.stringify(d,null,2));
}

function key(a,b){
  return [a,b].sort().join("_");
}

export function updateStreak(userA,userB){
  const data=load();
  const k=key(userA,userB);
  const now=Date.now();
  const day=86400000;

  if(!data[k]){
    data[k]={ count:1, last:now };
  }else{
    if(now - data[k].last < day*1.5){
      data[k].count++;
    }else{
      data[k].count=1;
    }
    data[k].last=now;
  }

  save(data);
  return data[k].count;
}

export function getStreak(userA,userB){
  const data=load();
  return data[key(userA,userB)]?.count || 0;
    }
