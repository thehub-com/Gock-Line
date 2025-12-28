import fs from "fs";

const file = "./market.json";

export function getMarket(){
  return JSON.parse(fs.readFileSync(file)).items;
}
