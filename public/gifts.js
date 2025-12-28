/* ===============================
   GIFTS STATE
================================ */
let inventoryOpen = false;

let inventoryData = {
  "🎂": { count: 3, name: "Торт" },
  "🚀": { count: 2, name: "Ракета" },
  "💎": { count: 1, name: "Алмаз" },
  "🏆": { count: 1, name: "Кубок" },
  "❤️": { count: 5, name: "Сердце" }
};

/* ===============================
   TOGGLE INVENTORY
================================ */
function toggleInv(){
  closeAllOverlays();

  const inv = document.getElementById("inventory");
  inv.innerHTML = "";

  for(const gift in inventoryData){
    if(inventoryData[gift].count > 0){
      const row = document.createElement("div");
      row.className = "invItem";
      row.innerHTML = `
        <span>${gift} ${inventoryData[gift].name} (${inventoryData[gift].count})</span>
        <button onclick="sendGift('${gift}')">Отправить</button>
      `;
      inv.appendChild(row);
    }
  }

  inv.style.display = "block";
  inventoryOpen = true;
}

/* ===============================
   CLOSE ALL POPUPS
================================ */
function closeAllOverlays(){
  document.querySelectorAll(".msgMenu").forEach(m=>m.remove());

  const inv = document.getElementById("inventory");
  if(inv) inv.style.display = "none";

  inventoryOpen = false;
}

/* ===============================
   SEND GIFT
================================ */
function sendGift(gift){
  if(!inventoryData[gift] || inventoryData[gift].count <= 0) return;

  inventoryData[gift].count--;
  closeAllOverlays();

  renderGift(gift);
}

/* ===============================
   RENDER GIFT (CENTER, ANIMATED)
================================ */
function renderGift(gift){
  const messages = document.getElementById("messages");

  const wrap = document.createElement("div");
  wrap.className = "giftWrap";

  const box = document.createElement("div");
  box.className = "giftBox";
  box.innerHTML = `
    <div class="giftIcon">${gift}</div>
    <div class="giftText">Подарок</div>
  `;

  wrap.appendChild(box);
  messages.appendChild(wrap);

  messages.scrollTop = messages.scrollHeight;
}

/* ===============================
   CLICK OUTSIDE INVENTORY
================================ */
document.addEventListener("click",e=>{
  if(
    inventoryOpen &&
    !e.target.closest("#inventory") &&
    !e.target.closest("button")
  ){
    closeAllOverlays();
  }
});
