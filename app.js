const MEALS=["Breakfast","Lunch","Snacks","Dinner","Drinks"];
const KEY="nourish-v1";
const todayISO=()=>new Date().toISOString().slice(0,10);
let selectedDate=todayISO();
let histMode="days";
let db=load();
function fresh(){return {settings:{calories:2100,protein:160},foods:[],activities:{},measurements:[]}}
function load(){try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch{return fresh()}}
function save(){localStorage.setItem(KEY,JSON.stringify(db));render()}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function fmtDate(d){return new Date(d+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"})}
function dayFoods(d){return db.foods.filter(x=>x.date===d)}
function totals(d){let f=dayFoods(d);return {cal:f.reduce((a,x)=>a+(+x.calories||0),0),pro:f.reduce((a,x)=>a+(+x.protein||0),0)}}
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random()}
function render(){
  $("#dateButton").textContent=fmtDate(selectedDate);
  const t=totals(selectedDate), sc=db.settings.calories||2100, sp=db.settings.protein||160;
  $("#calTotal").textContent=Math.round(t.cal); $("#proteinTotal").textContent=round1(t.pro);
  $("#calTarget").textContent=sc; $("#proteinTarget").textContent=sp;
  $("#calBar").style.width=Math.min(100,t.cal/sc*100)+"%"; $("#proteinBar").style.width=Math.min(100,t.pro/sp*100)+"%";
  $("#calRemaining").textContent=t.cal<=sc?`${Math.round(sc-t.cal).toLocaleString()} remaining`:`${Math.round(t.cal-sc).toLocaleString()} over target`;
  $("#proteinRemaining").textContent=t.pro<=sp?`${round1(sp-t.pro)} g remaining`:`${round1(t.pro-sp)} g over target`;
  const act=db.activities[selectedDate]||{gym:false,minutes:0}; $("#gymToggle").checked=!!act.gym; $("#gymMinutes").value=act.minutes||"";
  renderMeals(); renderHistory(); renderProgress();
  $("#settingCalories").value=db.settings.calories; $("#settingProtein").value=db.settings.protein;
}
function renderMeals(){
  $("#mealSections").innerHTML=MEALS.map(meal=>{
    const items=dayFoods(selectedDate).filter(x=>x.meal===meal);
    const cal=items.reduce((a,x)=>a+(+x.calories||0),0), pro=items.reduce((a,x)=>a+(+x.protein||0),0);
    return `<div class="card meal-card"><div class="meal-head"><h3>${meal}</h3><button class="add-link" onclick="openFood('${meal}')">+ Add</button></div>
    ${items.length?items.map(x=>`<div class="food-row"><button onclick="editFood('${x.id}')"><strong>${esc(x.name)}</strong><br><small>${Math.round(+x.calories||0)} kcal · ${round1(+x.protein||0)}g protein</small></button><span>›</span></div>`).join(""):`<div class="empty">Nothing logged yet</div>`}
    <div class="meal-total"><span>${meal} total</span><span>${Math.round(cal)} kcal · ${round1(pro)}g</span></div></div>`
  }).join("");
}
function openFood(meal){$("#foodModalTitle").textContent="Add food";$("#foodId").value="";$("#foodMeal").value=meal;$("#foodName").value="";$("#foodCalories").value="";$("#foodProtein").value="";$("#deleteFood").hidden=true;openModal("foodModal")}
function editFood(id){let x=db.foods.find(f=>f.id===id);if(!x)return;$("#foodModalTitle").textContent="Edit food";$("#foodId").value=x.id;$("#foodMeal").value=x.meal;$("#foodName").value=x.name;$("#foodCalories").value=x.calories;$("#foodProtein").value=x.protein;$("#deleteFood").hidden=false;openModal("foodModal")}
function openModal(id){$("#"+id).classList.add("open")}
function closeModal(id){$("#"+id).classList.remove("open")}
function renderHistory(){
  if(histMode==="days"){
    const dates=[...new Set(db.foods.map(x=>x.date).concat(Object.keys(db.activities)))].sort().reverse();
    $("#historyContent").innerHTML=dates.length?dates.map(d=>{let t=totals(d),a=db.activities[d];return `<div class="history-day"><button onclick="goDay('${d}')"><strong>${fmtDate(d)}</strong><small>${Math.round(t.cal)} kcal · ${round1(t.pro)}g protein${a?.gym?` · Gym ${a.minutes||0} min`:""}</small></button><span>›</span></div>`}).join(""):`<div class="card empty">Your logged days will appear here.</div>`;
  } else {
    $("#historyContent").innerHTML=weeklyCards();
  }
}
function startMonday(ds){let d=new Date(ds+"T12:00:00"),day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return d.toISOString().slice(0,10)}
function addDays(ds,n){let d=new Date(ds+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function weeklyCards(){
  let all=[...new Set(db.foods.map(x=>startMonday(x.date)).concat(Object.keys(db.activities).map(startMonday)))].sort().reverse();
  if(!all.length)return `<div class="card empty">Weekly summaries will appear once you start logging.</div>`;
  return all.map(w=>{
    let days=[0,1,2,3,4,5,6].map(i=>addDays(w,i)), logged=days.filter(d=>dayFoods(d).length);
    let avgC=logged.length?logged.reduce((a,d)=>a+totals(d).cal,0)/logged.length:0, avgP=logged.length?logged.reduce((a,d)=>a+totals(d).pro,0)/logged.length:0;
    let cOver=logged.filter(d=>totals(d).cal>db.settings.calories).length,cBelow=logged.filter(d=>totals(d).cal<db.settings.calories).length;
    let pHit=logged.filter(d=>totals(d).pro>=db.settings.protein).length,pBelow=logged.filter(d=>totals(d).pro<db.settings.protein).length;
    let gym=days.filter(d=>db.activities[d]?.gym), mins=gym.reduce((a,d)=>a+(+db.activities[d].minutes||0),0);
    return `<div class="week-card"><strong>${fmtDate(w)} – ${fmtDate(addDays(w,6))}</strong><div class="week-grid">
      <div class="week-stat"><span>DAILY AVG CALORIES</span><strong>${Math.round(avgC)}</strong></div>
      <div class="week-stat"><span>DAILY AVG PROTEIN</span><strong>${round1(avgP)}g</strong></div>
      <div class="week-stat"><span>CALORIES</span><strong>${cBelow} below · ${cOver} over</strong></div>
      <div class="week-stat"><span>PROTEIN</span><strong>${pHit} hit · ${pBelow} below</strong></div>
      <div class="week-stat"><span>GYM</span><strong>${gym.length} sessions</strong></div>
      <div class="week-stat"><span>ACTIVITY</span><strong>${mins} min</strong></div>
    </div><div class="muted" style="margin-top:10px">Averages use ${logged.length} logged day${logged.length===1?"":"s"}; empty days are not counted.</div></div>`
  }).join("")
}
function goDay(d){selectedDate=d;showPage("todayPage");render()}
function renderProgress(){
  let arr=[...db.measurements].sort((a,b)=>b.date.localeCompare(a.date)),cur=arr[0];
  $("#currentWeight").textContent=cur?.weight?`${cur.weight} kg`:"—";$("#currentWaist").textContent=cur?.waist?`${cur.waist} cm`:"—";
  $("#measurementList").innerHTML=arr.length?arr.map(x=>`<div class="measurement-row"><button onclick="editMeasurement('${x.id}')"><strong>${fmtDate(x.date)}</strong><br><span class="muted">${x.weight||"—"} kg · ${x.waist||"—"} cm</span></button><span>›</span></div>`).join(""):`<div class="empty">No measurements yet.</div>`;
}
function editMeasurement(id){let x=db.measurements.find(m=>m.id===id);$("#measurementId").value=x.id;$("#measureDate").value=x.date;$("#measureWeight").value=x.weight;$("#measureWaist").value=x.waist;$("#deleteMeasurement").hidden=false;openModal("measurementModal")}
function round1(n){return Math.round((+n||0)*10)/10}
function showPage(id){$$(".page").forEach(x=>x.classList.toggle("active",x.id===id));$$("nav button").forEach(x=>x.classList.toggle("active",x.dataset.page===id));$("#pageTitle").textContent={todayPage:"Today",historyPage:"History",progressPage:"Progress",settingsPage:"Settings"}[id];$("#dateButton").style.visibility=id==="todayPage"?"visible":"hidden"}
MEALS.forEach(m=>$("#foodMeal").insertAdjacentHTML("beforeend",`<option>${m}</option>`));
$$("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
$$("nav button").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$$("[data-hist]").forEach(b=>b.onclick=()=>{histMode=b.dataset.hist;$$("[data-hist]").forEach(x=>x.classList.toggle("active",x===b));renderHistory()});
$("#dateButton").onclick=()=>{let v=prompt("Enter date (YYYY-MM-DD)",selectedDate);if(v&&/^\d{4}-\d{2}-\d{2}$/.test(v)){selectedDate=v;render()}};
$("#gymToggle").onchange=()=>{let a=db.activities[selectedDate]||{};a.gym=$("#gymToggle").checked;a.minutes=+$("#gymMinutes").value||0;db.activities[selectedDate]=a;save()};
$("#gymMinutes").onchange=()=>{let a=db.activities[selectedDate]||{};a.gym=$("#gymToggle").checked;a.minutes=+$("#gymMinutes").value||0;db.activities[selectedDate]=a;save()};
$("#saveFood").onclick=()=>{let id=$("#foodId").value,name=$("#foodName").value.trim();if(!name)return alert("Add a food name.");let obj={id:id||uid(),date:selectedDate,meal:$("#foodMeal").value,name,calories:+$("#foodCalories").value||0,protein:+$("#foodProtein").value||0};if(id){db.foods=db.foods.map(x=>x.id===id?obj:x)}else db.foods.push(obj);closeModal("foodModal");save()};
$("#deleteFood").onclick=()=>{let id=$("#foodId").value;if(confirm("Delete this food entry?")){db.foods=db.foods.filter(x=>x.id!==id);closeModal("foodModal");save()}};
$("#addMeasurement").onclick=()=>{$("#measurementId").value="";$("#measureDate").value=todayISO();$("#measureWeight").value="";$("#measureWaist").value="";$("#deleteMeasurement").hidden=true;openModal("measurementModal")};
$("#saveMeasurement").onclick=()=>{let id=$("#measurementId").value,obj={id:id||uid(),date:$("#measureDate").value||todayISO(),weight:+$("#measureWeight").value||null,waist:+$("#measureWaist").value||null};if(id)db.measurements=db.measurements.map(x=>x.id===id?obj:x);else db.measurements.push(obj);closeModal("measurementModal");save()};
$("#deleteMeasurement").onclick=()=>{let id=$("#measurementId").value;if(confirm("Delete this measurement?")){db.measurements=db.measurements.filter(x=>x.id!==id);closeModal("measurementModal");save()}};
$("#settingCalories").onchange=()=>{db.settings.calories=+$("#settingCalories").value||2100;save()};$("#settingProtein").onchange=()=>{db.settings.protein=+$("#settingProtein").value||160;save()};
function download(name,text,type="application/json"){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
$("#exportBackup").onclick=()=>download(`nourish-backup-${todayISO()}.json`,JSON.stringify(db,null,2));
$("#restoreBackup").onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let x=JSON.parse(await f.text());if(!x.settings||!Array.isArray(x.foods))throw 0;if(confirm("Replace the data on this device with this backup?")){db=x;save();alert("Backup restored.")}}catch{alert("That doesn't look like a valid Nourish backup.")}e.target.value=""};
$("#exportCsv").onclick=()=>{let rows=[["date","meal","food","calories","protein_g"],...db.foods.map(x=>[x.date,x.meal,x.name,x.calories,x.protein])];let csv=rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\n");download(`nourish-food-${todayISO()}.csv`,csv,"text/csv")};
$("#deleteAll").onclick=()=>{if(confirm("Delete ALL Nourish data stored on this device? This cannot be undone unless you have a backup.")&&confirm("Final confirmation: delete everything?")){localStorage.removeItem(KEY);db=fresh();selectedDate=todayISO();save();alert("All local Nourish data has been deleted.")}};
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js");
render();