import fs from "fs";
import { addItem } from "./inventory.js";

const prices = {
  "🎂 Торт": 10,
  "🚀 Ракета": 25,
  "💎 Алмаз": 50,
  "🏆 Кубок": 40,
  "❤️ Сердце": 5
};

export function getMarket(){
  return prices;
}

export function buyItem(userId,item){
  // ⛔ ПОКА БЕЗ ВАЛЮТЫ (ПОЗЖЕ ПОДКЛЮЧИМ)
  if(!prices[item]) return false;

  addItem(userId,item);
  return true;
}
