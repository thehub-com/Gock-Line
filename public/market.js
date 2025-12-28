const MARKET_API = "/market";

let gip = 100; // временно, потом из базы
let inventory = {};

async function openMarket(){
  const r = await fetch(MARKET_API);
  const items = await r.json();

  const box = document.createElement("div");
  box.id = "marketBox";
  box.style.cssText = `
    position:fixed;inset:0;
    background:#000c;
    padding:20px;
    overflow:auto;
  `;

  box.innerHTML = `<h2>🛒 Маркет (GIP: ${gip})</h2>`;

  items.forEach(i=>{
    const d = document.createElement("div");
    d.style.cssText = `
      background:#1c1f3a;
      margin-bottom:10px;
      padding:14px;
      border-radius:14px;
      display:flex;
      justify-content:space-between;
      align-items:center;
    `;
    d.innerHTML = `
      <div>
        <b>${i.name}</b><br>
        <small>${i.rarity}</small>
      </div>
      <button onclick="buyItem('${i.id}',${i.price},'${i.name}')">
        ${i.price} GIP
      </button>
    `;
    box.appendChild(d);
  });

  const close=document.createElement("button");
  close.innerText="Закрыть";
  close.onclick=()=>box.remove();
  box.appendChild(close);

  document.body.appendChild(box);
}

function buyItem(id,price,name){
  if(gip<price) return alert("Недостаточно GIP");
  gip-=price;
  inventory[name]=(inventory[name]||0)+1;
  alert(`Куплено: ${name}`);
  document.getElementById("marketBox").remove();
  openMarket();
}
