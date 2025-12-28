const ADMIN_ID="5516708022";

async function openAdmin(){
  closeAll?.();

  const r = await fetch("/admin/reports");
  const reports = await r.json();

  const box=document.createElement("div");
  box.id="adminBox";
  box.style.cssText=`
    position:fixed;inset:0;
    background:#0b0d1fcc;
    padding:20px;
    overflow:auto;
    animation:fade .3s
  `;

  box.innerHTML="<h2>🛠 Админ панель</h2>";

  reports.forEach(rep=>{
    const d=document.createElement("div");
    d.style.cssText=`
      background:#1c1f3a;
      padding:14px;
      border-radius:16px;
      margin:12px 0
    `;
    d.innerHTML=`
      <b>От:</b> ${rep.from}<br>
      <b>На:</b> ${rep.to}<br>
      <b>Причина:</b> ${rep.reason}<br>
      <small>${new Date(rep.time).toLocaleString()}</small><br><br>
      <button onclick="closeReport(${rep.id})">Закрыть</button>
    `;
    box.appendChild(d);
  });

  const c=document.createElement("button");
  c.innerText="Закрыть";
  c.onclick=()=>box.remove();
  box.appendChild(c);

  document.body.appendChild(box);
}

async function closeReport(id){
  await fetch("/admin/close",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({id})
  });
  alert("Закрыто");
}
