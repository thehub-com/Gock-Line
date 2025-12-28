const API = "https://gock-line.onrender.com";
const WS  = "wss://gock-line.onrender.com";

let socket;
let currentChat = null;

/* LOGIN */
async function enter(){
  const token = tokenInput.value.trim();
  if(!token) return alert("Нет токена");

  const r = await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ token })
  });
  if(!r.ok) return alert("Неверный токен");

  socket = new WebSocket(WS);

  socket.onmessage = e => handle(JSON.parse(e.data));

  login.classList.add("hidden");
  app.classList.remove("hidden");
}

/* OPEN CHAT */
function openChat(nick){
  currentChat = nick;
  chatTitle.innerText = nick;
  messages.innerHTML = "";

  app.classList.add("hidden");
  chat.classList.remove("hidden");

  socket.send(JSON.stringify({
    type:"open",
    chat:nick
  }));
}

function backMain(){
  chat.classList.add("hidden");
  app.classList.remove("hidden");
}

/* SEND TEXT */
function sendText(){
  if(!text.value) return;

  socket.send(JSON.stringify({
    type:"text",
    to: currentChat,
    text: text.value,
    time: Date.now()
  }));

  text.value="";
}

/* HANDLE */
function handle(msg){
  if(msg.type==="history"){
    msg.messages.forEach(render);
  }
  if(msg.type==="text" || msg.type==="gift"){
    render(msg);
  }
  if(msg.type==="streak"){
    updateFire(msg.count);
  }
}

/* RENDER */
function render(msg){
  if(msg.type==="text") renderText(msg);
  if(msg.type==="gift") renderGift(msg);
}

function renderText(msg){
  const el = document.createElement("div");
  el.className = "msg " + (msg.me ? "me" : "");
  el.innerHTML = `
    <div class="body">${msg.text}</div>
    <div class="time">${new Date(msg.time).toLocaleTimeString()}</div>
  `;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function renderGift(msg){
  const el = document.createElement("div");
  el.className = "giftBox";
  el.innerText = msg.gift;
  messages.appendChild(el);
}

/* STREAK 🔥 */
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
