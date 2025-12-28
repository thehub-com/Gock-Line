import fs from "fs";

const REPORTS_FILE = "./reports.json";

function readReports(){
  if(!fs.existsSync(REPORTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(REPORTS_FILE,"utf8"));
}

function saveReports(data){
  fs.writeFileSync(REPORTS_FILE,JSON.stringify(data,null,2));
}

export function addReport(from,to,reason){
  const r = readReports();
  r.push({
    id:Date.now(),
    from,
    to,
    reason,
    time:Date.now(),
    status:"open"
  });
  saveReports(r);
}

export function getReports(){
  return readReports();
}

export function closeReport(id){
  const r = readReports();
  const rep = r.find(x=>x.id==id);
  if(rep) rep.status="closed";
  saveReports(r);
}
