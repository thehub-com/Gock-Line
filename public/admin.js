/* ===============================
   ADMIN STATE
================================ */
const ADMIN_ID = 5516708022; // ТВОЙ TG ID

let reports = [];
let users = {
  "@test": { role:"user", muted:false, banned:false }
};

/* ===============================
   OPEN ADMIN PANEL
================================ */
function openAdmin(){
  app.style.display="none";
  admin.style.display="block";
  renderAdmin();
}

/* ===============================
   RENDER ADMIN
================================ */
function renderAdmin(){
  admin.innerHTML = `
    <button onclick="backMain()">← Назад</button>
    <h2>🛠 Админ панель</h2>

    <h3>📩 Жалобы</h3>
    <div id="reportList"></div>

    <h3>👥 Пользователи</h3>
    <div id="userList"></div>
  `;

  renderReports();
  renderUsers();
}

/* ===============================
   REPORTS
================================ */
function renderReports(){
  const box = document.getElementById("reportList");
  box.innerHTML = "";

  if(reports.length===0){
    box.innerHTML = "<small>Жалоб нет</small>";
    return;
  }

  reports.forEach((r,i)=>{
    const d=document.createElement("div");
    d.style.padding="10px";
    d.style.borderBottom="1px solid #333";
    d.innerHTML=`
      <b>${r.from}</b> → ${r.to}<br>
      <small>${r.text}</small><br>
      <button onclick="muteUser('${r.to}')">🔇 Мут</button>
      <button onclick="banUser('${r.to}')">⛔ Бан</button>
    `;
    box.appendChild(d);
  });
}

/* ===============================
   USERS
================================ */
function renderUsers(){
  const box=document.getElementById("userList");
  box.innerHTML="";

  Object.keys(users).forEach(u=>{
    const user=users[u];
    const d=document.createElement("div");
    d.style.padding="10px";
    d.style.borderBottom="1px solid #333";

    d.innerHTML=`
      <b>${u}</b> (${user.role})<br>
      <button onclick="setRole('${u}','user')">User</button>
      <button onclick="setRole('${u}','verified')">✔</button>
      <button onclick="setRole('${u}','moder')">🛡</button>
      <button onclick="setRole('${u}','admin')">★</button>
      <button onclick="muteUser('${u}')">🔇</button>
      <button onclick="banUser('${u}')">⛔</button>
    `;
    box.appendChild(d);
  });
}

/* ===============================
   ACTIONS
================================ */
function muteUser(u){
  if(!users[u]) return;
  users[u].muted=true;
  alert(`🔇 ${u} замучен`);
}

function banUser(u){
  if(!users[u]) return;
  users[u].banned=true;
  alert(`⛔ ${u} заблокирован`);
}

function setRole(u,role){
  if(!users[u]) return;
  users[u].role=role;
  alert(`⭐ ${u} → ${role}`);
  renderUsers();
}

/* ===============================
   REPORT FROM CHAT
================================ */
function sendReport(toUser, text){
  reports.push({
    from:"me",
    to:toUser,
    text:text,
    time:Date.now()
  });
  alert("📩 Жалоба отправлена администрации");
}
