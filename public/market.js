const USER_ID="5516708022";

async function openMarket(){
  closeAll?.();

  const r = await fetch("/market");
  const items = await r.json();

  const box = document.createElement("div");
  box.id="marketBox";
  box.style.cssText=`
    position:fixed;inset:0;
    background:#000d;
    padding:20px;
    overflow:auto;
    animation:fade .3s
  `;

  box.innerHTML="<h2>🛒 Маркет</h2>";

  Object.entries(items).forEach(([name,price])=>{
    const d=document.createElement("div");
    d.style.cssText=`
      background:#1c1f3a;
      padding:16px;
      border-radius:18px;
      margin:12px 0;
      display:flex;
      justify-content:space-between;
      align-items:center
    `;
    d.innerHTML=`
      <span style="font-size:22px">${name}</span>
      <button onclick="buy('${name}')">Купить · ${price}</button>
    `;
    box.appendChild(d);
  });

  const c=document.createElement("button");
  c.innerText="Закрыть";
  c.onclick=()=>box.remove();
  box.appendChild(c);

  document.body.appendChild(box);
}

async function buy(item){
  await fetch("/market/buy",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({userId:USER_ID,item})
  });
  alert("Куплено: "+item);
}
