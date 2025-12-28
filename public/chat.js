const API = location.origin;
const WS  = location.origin.replace("http","ws");

let socket;
let myId = null;
let currentChat = null;

/* ===== LOGIN ===== */
async function login(){
  const token = tokenInput.value.trim();
  if(!token) return alert("Введите токен");

  const r = await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({token})
  });

  if(!r.ok) return alert("Неверный токен");

  myId = token;
  show("main");
  loadChats();

  socket = new WebSocket(WS);
  socket.onmessage = e => onMessage(JSON.parse(e.data));
}

/* ===== CHATS ===== */
function loadChats(){
  chatList.innerHTML="";
  ["@test","@friend","@admin"].forEach(u=>{
    const d=document.createElement("div");
    d.className="chat";
    d.innerHTML = `
      ${u}
      <span style="margin-left:6px">🔥</span>
    `;
    d.onclick=()=>openChat(u);
    chatList.appendChild(d);
  });
}

function openChat(user){
  currentChat=user;
  chatTitle.innerText=user;
  messages.innerHTML="";
  show("chat");
}

/* ===== NAV ===== */
function back(){
  show("main");
  toggle("giftPanel");
}
function openProfile(){
  show("profile");
}

/* ===== SEND ===== */
function sendMsg(){
  const text = msgInput.value.trim();
  if(!text) return;

  const msg={
    type:"text",
    text,
    time:Date.now(),
    from:myId,
    chat:currentChat
  };

  socket.send(JSON.stringify(msg));
  renderMsg(msg,true);
  msgInput.value="";
}

function sendGift(g){
  toggle("giftPanel");
  const msg={
    type:"gift",
    gift:g,
    time:Date.now(),
    from:myId,
    chat:currentChat
  };
  socket.send(JSON.stringify(msg));
  renderGift(msg,true);
}

/* ===== RECEIVE ===== */
function onMessage(m){
  if(m.chat!==currentChat) return;
  if(m.type==="text") renderMsg(m,false);
  if(m.type==="gift") renderGift(m,false);
}

/* ===== RENDER ===== */
function renderMsg(m,me){
  const d=document.createElement("div");
  d.className="msg "+(me?"me":"");
  d.innerHTML=`
    ${m.text}
    <div class="time">${new Date(m.time).toLocaleTimeString()}</div>
  `;

  d.ondblclick = ()=>openMenu(d,me);
  messages.appendChild(d);
  messages.scrollTop=messages.scrollHeight;
}

function renderGift(m){
  const d=document.createElement("div");
  d.className="msg";
  d.style.fontSize="40px";
  d.style.textAlign="center";
  d.innerText=m.gift;
  messages.appendChild(d);
}

/* ===== MESSAGE MENU ===== */
function openMenu(el,me){
  closeMenus();
  const menu=document.createElement("div");
  menu.className="menu";
  menu.innerHTML=`
    <div onclick="reply()">Ответить</div>
    ${me?'<div onclick="editMsg(this)">Изменить</div>':''}
    ${me?'<div onclick="deleteMsg(this)">Удалить</div>':''}
  `;
  el.appendChild(menu);
}

function reply(){
  msgInput.value="> ";
  closeMenus();
}

function editMsg(el){
  const msg=el.closest(".msg");
  const t=prompt("Изменить сообщение",msg.childNodes[0].textContent);
  if(t) msg.childNodes[0].textContent=t;
  closeMenus();
}

function deleteMsg(el){
  el.closest(".msg").remove();
}

/* ===== PROFILE ===== */
function saveProfile(){
  let u=username.value.trim();
  if(!u.startsWith("@")) return alert("Юзер должен начинаться с @");
  alert("Сохранено (пока локально)");
}

/* ===== Gock AI (local stub) ===== */
function gockAI(text){
  const banned=["террор","наркот","педо"];
  return banned.some(w=>text.toLowerCase().includes(w));
}
