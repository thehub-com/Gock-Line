/* ===============================
   GOCK AI CONFIG
================================ */
const GOCK_AI_NAME = "Gock AI";
const GOCK_AI_AVATAR = "🤖";

/* ===============================
   SIMPLE AI LOGIC
================================ */
function gockAIReply(text){
  text = text.toLowerCase();

  if(text.includes("привет")) return "Привет 👋 Чем могу помочь?";
  if(text.includes("кто ты")) return "Я Gock AI — встроенный помощник GockLine 🤖";
  if(text.includes("помоги")) return "Опиши проблему, я постараюсь помочь.";
  if(text.includes("подар")) return "Подарки можно отправлять через 🎁 внизу.";
  if(text.includes("маркет")) return "Маркет скоро откроется 🛒";
  if(text.includes("админ")) return "Админ-панель доступна администраторам.";
  if(text.includes("спасибо")) return "Всегда пожалуйста ❤️";

  return randomAI();
}

function randomAI(){
  const replies=[
    "Интересно 🤔",
    "Я понял тебя.",
    "Можешь уточнить?",
    "Продолжай 👀",
    "Окей 👍"
  ];
  return replies[Math.floor(Math.random()*replies.length)];
}

/* ===============================
   SEND TO AI
================================ */
function sendToAI(userText){
  setTimeout(()=>{
    renderAIMessage(gockAIReply(userText));
  },600);
}

/* ===============================
   RENDER AI MESSAGE
================================ */
function renderAIMessage(text){
  const messages = document.getElementById("messages");

  const msg = document.createElement("div");
  msg.className = "msg ai";

  msg.innerHTML = `
    <div class="aiHeader">
      <span class="aiAvatar">${GOCK_AI_AVATAR}</span>
      <b>${GOCK_AI_NAME}</b>
    </div>
    ${text}
    <div class="time">${timeNow()}</div>
  `;

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

/* ===============================
   TIME
================================ */
function timeNow(){
  const d=new Date();
  return d.getHours().toString().padStart(2,"0")+":"+
         d.getMinutes().toString().padStart(2,"0");
}
