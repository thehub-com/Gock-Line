export function checkMessage(text){
  const banned = [
    "террор",
    "наркот",
    "педо",
    "экстремизм",
    "взрыв"
  ];

  const lower = text.toLowerCase();

  for(const w of banned){
    if(lower.includes(w)){
      return {
        ok:false,
        reason:`Запрещённый контент: ${w}`
      };
    }
  }

  return { ok:true };
}
