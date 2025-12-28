/* ===============================
   MARKET STATE
================================ */
let balance = 500; // GIP
let inventory = {
  gifts: {},
  backgrounds: []
};

const marketData = {
  gifts: [
    { id:"🎂", price:50 },
    { id:"🚀", price:120 },
    { id:"💎", price:300 }
  ],
  backgrounds: [
    { id:"bg1", name:"Neon", price:200, color:"#1c1f3a" },
    { id:"bg2", name:"Purple", price:350, color:"#3a1c3a" }
  ]
};

/* ===============================
   UI CONTROL
================================ */
function closeAllPanels(){
  inventoryBox.style.display="none";
  marketBox.style.display="none";
}

function openMarket(){
  closeAllPanels();
  marketBox.style.display="block";
  renderMarket();
}

function openInventory(){
  closeAllPanels();
  inventoryBox.style.display="block";
  renderInventory();
}

/* ===============================
   MARKET RENDER
================================ */
function renderMarket(){
  marketBox.innerHTML=`
    <h3>🛒 Gock Market</h3>
    <div>💰 Баланс: <b>${balance} GIP</b></div>

    <h4>🎁 Подарки</h4>
    <div id="giftShop"></div>

    <h4>🎨 Background</h4>
    <div id="bgShop"></div>

    <button onclick="closeAllPanels()">Закрыть</button>
  `;

  const gShop=document.getElementById("giftShop");
  marketData.gifts.forEach(g=>{
    const d=document.createElement("div");
    d.className="invItem";
    d.innerHTML=`
      ${g.id} — ${g.price} GIP
      <button onclick="buyGift('${g.id}',${g.price})">Купить</button>
    `;
    gShop.appendChild(d);
  });

  const bShop=document.getElementById("bgShop");
  marketData.backgrounds.forEach(b=>{
    const d=document.createElement("div");
    d.className="invItem";
    d.innerHTML=`
      ${b.name} — ${b.price} GIP
      <button onclick="buyBg('${b.id}',${b.price},'${b.color}')">Купить</button>
    `;
    bShop.appendChild(d);
  });
}

/* ===============================
   BUY
================================ */
function buyGift(id,price){
  if(balance<price) return alert("❌ Недостаточно GIP");
  balance-=price;
  inventory.gifts[id]=(inventory.gifts[id]||0)+1;
  renderMarket();
}

function buyBg(id,price,color){
  if(balance<price) return alert("❌ Недостаточно GIP");
  if(inventory.backgrounds.includes(id))
    return alert("Уже куплено");

  balance-=price;
  inventory.backgrounds.push(id);
  document.body.style.background=color;
  alert("🎨 Background применён");
  renderMarket();
}

/* ===============================
   INVENTORY
================================ */
function renderInventory(){
  inventoryBox.innerHTML=`
    <h3>📦 Инвентарь</h3>

    <h4>🎁 Подарки</h4>
    <div id="invGifts"></div>

    <h4>🎨 Background</h4>
    <div id="invBg"></div>

    <button onclick="closeAllPanels()">Закрыть</button>
  `;

  const gBox=document.getElementById("invGifts");
  Object.keys(inventory.gifts).forEach(g=>{
    const d=document.createElement("div");
    d.className="invItem";
    d.innerHTML=`
      ${g} (${inventory.gifts[g]})
      <button onclick="sendGiftFromInv('${g}')">Отправить</button>
    `;
    gBox.appendChild(d);
  });

  const bBox=document.getElementById("invBg");
  inventory.backgrounds.forEach(bg=>{
    const d=document.createElement("div");
    d.className="invItem";
    d.innerText=bg;
    bBox.appendChild(d);
  });
}

/* ===============================
   SEND GIFT TO CHAT
================================ */
function sendGiftFromInv(g){
  if(!inventory.gifts[g]) return;
  inventory.gifts[g]--;

  socket.send(JSON.stringify({
    type:"gift",
    gift:g,
    time:Date.now(),
    me:true
  }));

  openInventory();
    }
