/* ===== CONFIG ===== */
const API = location.origin;
const WS  = location.origin.replace("https","wss");

/* ===== STATE ===== */
let socket;
let inventoryData = {"🎂":3,"🚀":2,"💎":1};

/* ===== GOCK AI ===== */
const GockAI={
  banned:["хуй","бля","пизд","еб","fuck","shit"],
  spamLimit:4,
  spamTime:3000,
  mute:30000
};
let aiState={muted:0,last:[]};

/* ===== LOGIN ===== */
async function enter(){
  if(!tokenInput.value) return alert("Нет токена");
  socket=new WebSocket(WS);
  socket.onmessage=e=>render(JSON.parse(e.data));
  login.style.display="none";
  app.style.display="block";
}

/* ===== NAV ===== */
function openChat(n){
  app.style.display="none";
  chat.style.display="flex";
  chatTitle.innerText=n;
  messages.innerHTML="";
}
function backMain(){
  chat.style.display="none";
  inventory.style.display="none";
  app.style.display="block";
}

/* ===== SEND ===== */
function sendText(){
  if(!text.value) return;
  if(!checkAI(text.value)){text.value="";return;}
  socket.send(JSON.stringify({
    type:"text",
    text:text.value,
    time:Date.now(),
    me:true
  }));
  text.value="";
}

/* ===== AI CHECK ===== */
function checkAI(t){
  const now=Date.now();
  if(now<aiState.muted){
    sys("🔇 Вы в муте");
    return false;
  }
  if(GockAI.banned.some(w=>t.toLowerCase().includes(w))){
    mute("Мат");
    return false;
  }
  aiState.last.push(now);
  aiState.last=aiState.last.filter(x=>now-x<GockAI.spamTime);
  if(aiState.last.length>GockAI.spamLimit){
    mute("Спам");
    return false;
  }
  return true;
}
function mute(r){
  aiState.muted=Date.now()+GockAI.mute;
  sys(`🔇 Мут 30с | ${r}`);
}
function sys(t){
  const d=document.createElement("div");
  d.className="msg";
  d.style.background="#ff5c5c";
  d.innerHTML="<b>Gock AI</b><br>"+t;
  messages.appendChild(d);
}

/* ===== RENDER ===== */
function render(m){
  let el;
  if(m.type==="gift"){
    el=document.createElement("div");
    el.className="giftBox";
    el.innerText=m.gift;
  }else{
    el=document.createElement("div");
    el.className="msg "+(m.me?"me":"");
    el.innerHTML=m.text+
      `<div class="time">${new Date(m.time).toLocaleTimeString()}</div>`;
    el.ondblclick=()=>menu(el);
  }
  messages.appendChild(el);
  messages.scrollTop=messages.scrollHeight;
}

/* ===== MENU ===== */
function menu(m){
  closeMenus();
  const d=document.createElement("div");
  d.className="msgMenu";
  d.innerHTML=`
    <div onclick="edit(this)">✏ Изменить</div>
    <div onclick="del(this)">🗑 Удалить</div>`;
  m.appendChild(d);
}
function closeMenus(){
  document.querySelectorAll(".msgMenu").forEach(x=>x.remove());
}
function edit(e){
  const m=e.closest(".msg");
  const n=prompt("Изменить",m.childNodes[0].textContent);
  if(n) m.childNodes[0].textContent=n;
  closeMenus();
}
function del(e){
  e.closest(".msg").remove();
}

/* ===== INVENTORY ===== */
function toggleInv(){
  inventory.innerHTML="";
  for(let g in inventoryData){
    if(inventoryData[g]>0){
      const d=document.createElement("div");
      d.className="invItem";
      d.innerHTML=`${g} (${inventoryData[g]})
      <button onclick="sendGift('${g}')">Отправить</button>`;
      inventory.appendChild(d);
    }
  }
  inventory.style.display=
    inventory.style.display==="block"?"none":"block";
}
function sendGift(g){
  inventoryData[g]--;
  inventory.style.display="none";
  socket.send(JSON.stringify({
    type:"gift",
    gift:g,
    time:Date.now(),
    me:true
  }));
     }
