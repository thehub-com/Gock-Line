/* ===============================
   STATE
================================ */
let replyTo = null;
let mutedUntil = 0;

/* ===============================
   BAD WORDS (пример)
================================ */
const BAD_WORDS = [
  "сука","бля","хуй","пизд","ебан","ебать"
];

/* ===============================
   INVISIBLE GOCK AI (MODERATION)
================================ */
function moderateMessage(text){
  const lower = text.toLowerCase();

  for(const bad of BAD_WORDS){
    if(lower.includes(bad)){
      punishUser();
      return false;
    }
  }
  return true;
}

function punishUser(){
  const now = Date.now();

  // если уже мут — бан
  if(now < mutedUntil){
    alert("⛔ Вы заблокированы Gock AI");
    mutedUntil = Infinity;
    return;
  }

  // первый раз — мут 30 сек
  mutedUntil = now + 30000;
  alert("⚠ Gock AI: вы замучены на 30 секунд за нарушение");
}

/* ===============================
   SEND TEXT
================================ */
function sendText(){
  if(!text.value) return;

  if(Date.now() < mutedUntil){
    alert("🔇 Вы замучены");
    return;
  }

  const userText = text.value;
  text.value = "";

  // МОДЕРАЦИЯ
  if(!moderateMessage(userText)) return;

  renderUserMessage(userText);

  // ЕСЛИ ЧАТ С AI
  if(chatTitle.innerText === "Gock AI"){
    sendToAI(userText);
  }
}

/* ===============================
   RENDER USER MESSAGE
================================ */
function renderUserMessage(text){
  const msg = document.createElement("div");
  msg.className = "msg me";

  let html = "";

  if(replyTo){
    html += `<div class="replyBox">${replyTo}</div>`;
    replyTo = null;
  }

  html += `<span class="msgText">${text}</span>
           <div class="time">${timeNow()}</div>`;

  msg.innerHTML = html;

  msg.ondblclick = () => openMsgMenu(msg);

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

/* ===============================
   MESSAGE MENU
================================ */
function openMsgMenu(msg){
  closeMenus();

  // только свои сообщения
  if(!msg.classList.contains("me")) return;

  const menu = document.createElement("div");
  menu.className = "msgMenu";

  menu.innerHTML = `
    <div onclick="replyMsg(this)">↩ Ответить</div>
    <div onclick="editMsg(this)">✏ Изменить</div>
    <div onclick="deleteMsg(this)">🗑 Удалить</div>
  `;

  msg.appendChild(menu);
}

function closeMenus(){
  document.querySelectorAll(".msgMenu").forEach(m=>m.remove());
}

/* ===============================
   REPLY
================================ */
function replyMsg(el){
  const msg = el.closest(".msg");
  replyTo = msg.querySelector(".msgText").innerText;
  closeMenus();
}

/* ===============================
   EDIT (ТОЛЬКО ТЕКСТ)
================================ */
function editMsg(el){
  const msg = el.closest(".msg");
  const textEl = msg.querySelector(".msgText");

  const newText = prompt("Изменить сообщение", textEl.innerText);
  if(newText !== null && newText.trim() !== ""){
    textEl.innerText = newText;
  }

  closeMenus();
}

/* ===============================
   DELETE
================================ */
function deleteMsg(el){
  el.closest(".msg").remove();
  closeMenus();
}

/* ===============================
   TIME
================================ */
function timeNow(){
  const d = new Date();
  return d.getHours().toString().padStart(2,"0") + ":" +
         d.getMinutes().toString().padStart(2,"0");
}

/* ===============================
   GLOBAL CLICK CLOSE
================================ */
document.addEventListener("click", e=>{
  if(!e.target.closest(".msg")){
    closeMenus();
  }
});
