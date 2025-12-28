const API = "https://gock-line.onrender.com";
const WS  = "wss://gock-line.onrender.com/ws";

let socket;
let currentChat = null;

let inventoryData = {
  "🎂":3,
  "🚀":2,
  "💎":1,
  "🔥":5,
  "🎁":4
};

/* ================= LOGIN ================= */
async function enter(){
  const token = tokenInput.value.trim();
  if(!token) return alert("Нет токена");

  const r = await fetch(API + "/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ token })
  });

  if(!r.ok) return alert("Неверный токен");

  socket = new WebSocket(WS);

  socket.onopen = () => {
    console.log("WS connected");
  };

  socket.onmessage = e => {
    try {
      handle(JSON.parse(e.data));
    } catch {
      console.error("Bad WS message", e.data);
    }
  };

  socket.onclose = () => alert("Соединение потеряно");
  socket.onerror = () => alert("Ошибка WebSocket");

  login.classList.add("hidden");
  app.classList.remove("hidden");
}

/* ================= NAV ================= */
function openChat(nick){
  currentChat = nick;
  app.classList.add("hidden");
  chat.classList.remove("hidden");
  chatTitle.innerText = nick;
  messages.innerHTML = "";
  closeAll();
}

function backMain(){
  currentChat = null;
  chat.classList.add("hidden");
  app.classList.remove("hidden");
  closeAll();
}

/* ================= SEND ================= */
function sendText(){
  if(!text.value || !currentChat) return;

  socket.send(JSON.stringify({
    type:"text",
    text:text.value,
    to:currentChat,
    time:Date.now()
  }));

  renderText({
    text:text.value,
    time:Date.now(),
    me:true
  });

  text.value="";
}

/* ================= HANDLE ================= */
function handle(msg){
  if(msg.type === "text") renderText(msg);
  if(msg.type === "gift") renderGift(msg);
  if(msg.type === "streak") updateFire(msg.count);
}

/* ================= RENDER ================= */
function renderText(msg){
  const el = document.createElement("div");
  el.className = "msg " + (msg.me ? "me" : "");
  el.innerHTML = `
    <div class="body">${msg.text}</div>
    <div class="time">${new Date(msg.time).toLocaleTimeString()}</div>
  `;

  el.style.animation = "fadeIn .2s ease";

  if(msg.me) el.ondblclick = () => openMenu(el);

  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function renderGift(msg){
  const el = document.createElement("div");
  el.className = "giftBox";
  el.innerText = msg.gift;
  el.style.animation = "pop .25s ease";
  messages.appendChild(el);
}

/* ================= MESSAGE MENU ================= */
function openMenu(m){
  closeMenus();
  const menu = document.createElement("div");
  menu.className = "msgMenu";
  menu.innerHTML = `
    <div onclick="editMsg(this)">✏️ Изменить</div>
    <div onclick="delMsg(this)">🗑 Удалить</div>
  `;
  m.appendChild(menu);
}

function closeMenus(){
  document.querySelectorAll(".msgMenu").forEach(m => m.remove());
}

function editMsg(el){
  const msg = el.closest(".msg").querySelector(".body");
  const t = prompt("Изменить сообщение", msg.innerText);
  if(t) msg.innerText = t;
  closeMenus();
}

function delMsg(el){
  el.closest(".msg").remove();
}

/* ================= INVENTORY ================= */
function toggleInv(){
  if(!currentChat) return;

  closeAll();
  inventory.innerHTML = "";

  for(const g in inventoryData){
    if(inventoryData[g] > 0){
      const d = document.createElement("div");
      d.className = "invItem";
      d.innerHTML = `
        ${g} (${inventoryData[g]})
        <button onclick="sendGift('${g}')">Отправить</button>
      `;
      inventory.appendChild(d);
    }
  }
  inventory.classList.remove("hidden");
}

function sendGift(g){
  if(!currentChat) return;

  inventoryData[g]--;
  inventory.classList.add("hidden");

  socket.send(JSON.stringify({
    type:"gift",
    gift:g,
    to:currentChat,
    time:Date.now()
  }));

  renderGift({ gift:g });
}

/* ================= PROFILE ================= */
function openProfile(){
  if(!currentChat) return;
  closeAll();
  profileNick.innerText = currentChat;
  profile.classList.remove("hidden");
}

/* ================= STREAK 🔥 ================= */
function updateFire(count){
  let fire = document.getElementById("fire");
  if(!fire){
    fire = document.createElement("span");
    fire.id = "fire";
    fire.style.marginLeft = "6px";
    chatTitle.appendChild(fire);
  }
  fire.innerText = count >= 2 ? `🔥 ${count}` : "";
}

/* ================= UTILS ================= */
function closeAll(){
  inventory.classList.add("hidden");
  profile.classList.add("hidden");
  closeMenus();
     }
