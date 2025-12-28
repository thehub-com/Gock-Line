/* ===============================
   CHAT STATE
================================ */
let replyTarget = null;
let editingMsg = null;

/* ===============================
   HELPERS
================================ */
function nowTime(){
  const d = new Date();
  return d.getHours().toString().padStart(2,"0") + ":" +
         d.getMinutes().toString().padStart(2,"0");
}

/* ===============================
   SEND TEXT
================================ */
function sendText(){
  const input = document.getElementById("text");
  if(!input.value.trim()) return;

  addMessage({
    text: input.value,
    me: true,
    time: nowTime(),
    reply: replyTarget
  });

  replyTarget = null;
  input.value = "";
}

/* ===============================
   ADD MESSAGE
================================ */
function addMessage({text, me, time, reply}){
  const messages = document.getElementById("messages");

  const msg = document.createElement("div");
  msg.className = "msg" + (me ? " me" : "");
  msg.dataset.me = me ? "1" : "0";

  if(reply){
    const r = document.createElement("div");
    r.className = "replyBox";
    r.innerText = reply;
    msg.appendChild(r);
  }

  const body = document.createElement("div");
  body.className = "msgText";
  body.innerText = text;
  msg.appendChild(body);

  const t = document.createElement("div");
  t.className = "time";
  t.innerText = time;
  msg.appendChild(t);

  msg.addEventListener("dblclick",()=>openMsgMenu(msg));

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

/* ===============================
   MESSAGE MENU (2 TAP)
================================ */
function openMsgMenu(msg){
  closeMsgMenus();

  const menu = document.createElement("div");
  menu.className = "msgMenu";

  let html = `<div onclick="replyMsg(this)">↩ Ответить</div>`;

  if(msg.dataset.me === "1"){
    html += `
      <div onclick="editMsg(this)">✏ Изменить</div>
      <div onclick="deleteMsg(this)">🗑 Удалить</div>
    `;
  }

  menu.innerHTML = html;
  msg.appendChild(menu);
}

/* ===============================
   CLOSE MENUS
================================ */
function closeMsgMenus(){
  document.querySelectorAll(".msgMenu").forEach(m=>m.remove());
}

/* ===============================
   REPLY
================================ */
function replyMsg(el){
  const msg = el.closest(".msg");
  const text = msg.querySelector(".msgText").innerText;
  replyTarget = text;
  closeMsgMenus();
}

/* ===============================
   EDIT (ONLY TEXT, TIME SAFE)
================================ */
function editMsg(el){
  const msg = el.closest(".msg");
  const textNode = msg.querySelector(".msgText");

  const newText = prompt("Изменить сообщение", textNode.innerText);
  if(newText !== null && newText.trim()){
    textNode.innerText = newText;
  }
  closeMsgMenus();
}

/* ===============================
   DELETE
================================ */
function deleteMsg(el){
  const msg = el.closest(".msg");
  msg.remove();
  closeMsgMenus();
}

/* ===============================
   CLICK OUTSIDE
================================ */
document.addEventListener("click",e=>{
  if(!e.target.closest(".msg")){
    closeMsgMenus();
  }
});
