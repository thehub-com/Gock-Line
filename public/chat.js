let inventoryData = {
  "🔥":5,
  "🎁":3,
  "💎":1,
  "🚀":2
};

/* INVENTORY */
function toggleInv(){
  inventory.innerHTML="";
  for(const g in inventoryData){
    if(inventoryData[g] > 0){
      const d = document.createElement("div");
      d.className = "invItem";
      d.innerHTML = `
        <span>${g} x${inventoryData[g]}</span>
        <button onclick="sendGift('${g}')">Отправить</button>
      `;
      inventory.appendChild(d);
    }
  }
  inventory.classList.remove("hidden");
}

function sendGift(g){
  if(inventoryData[g] <= 0) return;
  inventoryData[g]--;

  socket.send(JSON.stringify({
    type:"gift",
    gift:g,
    to: currentChat,
    time: Date.now()
  }));

  inventory.classList.add("hidden");
}

/* PROFILE */
function openProfile(){
  profileNick.innerText = currentChat;
  profile.classList.remove("hidden");
}

function closeAll(){
  inventory.classList.add("hidden");
  profile.classList.add("hidden");
    }
