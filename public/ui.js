/* ===============================
   UI STATE
================================ */
const screens = {
  login: document.getElementById("login"),
  app: document.getElementById("app"),
  chat: document.getElementById("chat"),
  profile: document.getElementById("profile"),
  admin: document.getElementById("admin")
};

const modals = {
  inventory: document.getElementById("inventory")
};

let currentScreen = "login";

/* ===============================
   SCREEN CONTROL
================================ */
function hideAllScreens(){
  Object.values(screens).forEach(s => s && (s.style.display="none"));
}

function openScreen(name){
  hideAllScreens();
  closeAllModals();
  screens[name].style.display = "flex";
  currentScreen = name;
}

/* ===============================
   MODALS
================================ */
function closeAllModals(){
  Object.values(modals).forEach(m => m && (m.style.display="none"));
}

function toggleModal(modal){
  const el = modals[modal];
  if(!el) return;
  const open = el.style.display === "block";
  closeAllModals();
  if(!open) el.style.display = "block";
}

/* ===============================
   NAVIGATION
================================ */
function backMain(){
  openScreen("app");
}

function openChat(name){
  openScreen("chat");
  document.getElementById("chatTitle").innerText = name;
  document.getElementById("messages").innerHTML = "";
}

function openProfile(){
  openScreen("profile");
}

function openAdmin(){
  openScreen("admin");
}

/* ===============================
   LOGIN FLOW
================================ */
function enter(){
  // тут позже будет реальная проверка токена
  openScreen("app");
}

/* ===============================
   GLOBAL CLICK CLOSE
   закрывает меню/модалки
================================ */
document.addEventListener("click",e=>{
  if(!e.target.closest(".msg")){
    document.querySelectorAll(".msgMenu").forEach(m=>m.remove());
  }
});
