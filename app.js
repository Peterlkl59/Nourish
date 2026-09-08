const KEY="nourish-v2";
const LEGACY="nourish-v1";
const MEALS=["Breakfast","Lunch","Dinner","Snacks","Drinks"];
const ESSENTIALS=[
{name:"Large egg",calories:72,protein:6,unit:"1 egg"},
{name:"Banana",calories:105,protein:1,unit:"1 medium"},
{name:"Apple",calories:95,protein:0,unit:"1 medium"},
{name:"Chicken breast (grilled)",calories:165,protein:31,unit:"100g"},
{name:"Salmon (grilled)",calories:208,protein:25,unit:"100g"},
{name:"Greek yoghurt (plain)",calories:59,protein:10,unit:"100g"},
{name:"Porridge oats (dry)",calories:389,protein:13,unit:"100g"},
{name:"White rice (cooked)",calories:130,protein:3,unit:"100g"},
{name:"Potato (boiled)",calories:87,protein:2,unit:"100g"},
{name:"Wholemeal bread",calories:96,protein:4,unit:"1 slice"}
];
const I18N={
en:{splashTag:"Small steps. Big results.",heroCopy:"Small steps today to a healthier you.",calories:"Calories",protein:"Protein",exercise:"Exercise",netCalories:"Net calories",meals:"Meals",addExercise:"+ Exercise",progress:"Progress",week:"Week",month:"Month",averageCalories:"Average calories",averageProtein:"Average protein",weight:"Weight",waist:"Waist",addMeasurement:"+ Add measurement",badges:"Badges",doingAmazing:"You're doing amazing!",unlockMore:"Keep going to unlock more badges.",all:"All",nutrition:"Nutrition",activity:"Activity",streaks:"Streaks",more:"More",goals:"Goals",dailyCalories:"Daily calories",dailyProtein:"Daily protein",weightGoal:"Weight goal",language:"Language",data:"Data",exportBackup:"Export backup",restoreBackup:"Restore backup",exportCsv:"Export CSV",deleteAll:"Delete All Data",home:"Home",addFood:"Add Food",essentials:"Essentials",favourites:"Favourites",custom:"Custom",duration:"Duration (min)",caloriesBurned:"Calories burned",saveExercise:"Save Exercise",measurement:"Measurement",date:"Date",saveMeasurement:"Save Measurement"},
fr:{splashTag:"Petits pas. Grands résultats.",heroCopy:"De petits pas aujourd'hui pour être en meilleure santé.",calories:"Calories",protein:"Protéines",exercise:"Exercice",netCalories:"Calories nettes",meals:"Repas",addExercise:"+ Exercice",progress:"Progrès",week:"Semaine",month:"Mois",averageCalories:"Calories moyennes",averageProtein:"Protéines moyennes",weight:"Poids",waist:"Tour de taille",addMeasurement:"+ Ajouter une mesure",badges:"Badges",doingAmazing:"Tu fais un super travail !",unlockMore:"Continue pour débloquer plus de badges.",all:"Tous",nutrition:"Nutrition",activity:"Activité",streaks:"Séries",more:"Plus",goals:"Objectifs",dailyCalories:"Calories quotidiennes",dailyProtein:"Protéines quotidiennes",weightGoal:"Objectif de poids",language:"Langue",data:"Données",exportBackup:"Exporter une sauvegarde",restoreBackup:"Restaurer une sauvegarde",exportCsv:"Exporter en CSV",deleteAll:"Supprimer toutes les données",home:"Accueil",addFood:"Ajouter un aliment",essentials:"Essentiels",favourites:"Favoris",custom:"Personnalisé",duration:"Durée (min)",caloriesBurned:"Calories brûlées",saveExercise:"Enregistrer l'exercice",measurement:"Mesure",date:"Date",saveMeasurement:"Enregistrer la mesure"}
};
const MEAL_FR={Breakfast:"Petit-déjeuner",Lunch:"Déjeuner",Dinner:"Dîner",Snacks:"Encas",Drinks:"Boissons"};
const BADGES=[
{id:"first-step",name:"First Step",cat:"streaks",test:d=>loggedDays().length>=1,img:"saucisse-running.png"},
{id:"getting-started",name:"Getting Started",cat:"streaks",test:d=>loggedDays().length>=3,img:"saucisse-wave.png"},
{id:"one-week",name:"One Week",cat:"streaks",test:d=>loggedDays().length>=7,img:"saucisse-proud.png"},
{id:"two-weeks",name:"Two Weeks Strong",cat:"streaks",test:d=>loggedDays().length>=14,img:"saucisse-celebrate.png"},
{id:"month-motion",name:"Month in Motion",cat:"streaks",test:d=>loggedDays().length>=30,img:"saucisse-running.png"},
{id:"consistency-pup",name:"Consistency Pup",cat:"streaks",test:d=>maxStreak()>=3,img:"saucisse-proud.png"},
{id:"on-a-roll",name:"On a Roll",cat:"streaks",test:d=>maxStreak()>=7,img:"saucisse-running.png"},
{id:"unstoppable",name:"Unstoppable",cat:"streaks",test:d=>maxStreak()>=30,img:"saucisse-medal.png"},
{id:"protein-pup",name:"Protein Pup",cat:"nutrition",test:d=>proteinHits()>=1,img:"saucisse-eat.png"},
{id:"protein-pro",name:"Protein Pro",cat:"nutrition",test:d=>proteinHits()>=7,img:"saucisse-proud.png"},
{id:"protein-champion",name:"Protein Champion",cat:"nutrition",test:d=>proteinHits()>=30,img:"saucisse-medal.png"},
{id:"balanced-day",name:"Balanced Day",cat:"nutrition",test:d=>balancedDays()>=1,img:"saucisse-proud.png"},
{id:"balanced-week",name:"Balanced Week",cat:"nutrition",test:d=>balancedWeek(),img:"saucisse-celebrate.png"},
{id:"first-workout",name:"First Workout",cat:"activity",test:d=>db.exercises.length>=1,img:"saucisse-stretch.png"},
{id:"active-pup",name:"Active Pup",cat:"activity",test:d=>db.exercises.length>=5,img:"saucisse-running.png"},
{id:"exercise-expert",name:"Exercise Expert",cat:"activity",test:d=>db.exercises.length>=25,img:"saucisse-medal.png"},
{id:"progress-begins",name:"Progress Begins",cat:"progress",test:d=>db.measurements.length>=1,img:"saucisse-scale.png"},
{id:"halfway-there",name:"Halfway There",cat:"progress",test:d=>halfwayToGoal(),img:"saucisse-proud.png"},
{id:"goal-getter",name:"Goal Getter",cat:"progress",test:d=>goalReached(),img:"saucisse-medal.png"},
{id:"step-by-step",name:"Step by Step!",cat:"progress",test:d=>BADGES.slice(0,19).every(b=>b.test()),img:"saucisse-celebrate.png"}
];

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const todayISO=()=>new Date().toISOString().slice(0,10);
let selectedDate=todayISO(),period="week",foodTab="essentials",selectedMeal="Breakfast",badgeFilter="all",qty=1;
let db=load();

function fresh(){return {settings:{calories:2000,protein:160,weightGoal:null,lang:"en"},foods:[],exercises:[],measurements:[],favourites:[],meta:{}}}
function load(){try{let raw=localStorage.getItem(KEY);if(raw)return Object.assign(fresh(),JSON.parse(raw));let old=localStorage.getItem(LEGACY);if(old)return Object.assign(fresh(),JSON.parse(old));}catch(e){}return fresh()}
function save(){localStorage.setItem(KEY,JSON.stringify(db));render()}
function lang(){return db.settings.lang||"en"}function t(k){return I18N[lang()][k]||k}
function applyI18N(){$$("[data-i18n]").forEach(e=>e.textContent=t(e.dataset.i18n));$$("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang()))}
function mealLabel(m){return lang()==="fr"?MEAL_FR[m]:m}
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random()}
function addDays(ds,n){let d=new Date(ds+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function fmtDay(ds){return new Date(ds+"T12:00:00").toLocaleDateString(lang()==="fr"?"fr-FR":"en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}
function shortDay(ds){return new Date(ds+"T12:00:00").toLocaleDateString(lang()==="fr"?"fr-FR":"en-GB",{weekday:"short",day:"numeric",month:"short"})}
function monthLabel(ds){return new Date(ds+"T12:00:00").toLocaleDateString(lang()==="fr"?"fr-FR":"en-GB",{month:"short",year:"numeric"})}
function foodItems(d){return db.foods.filter(x=>x.date===d)}function exItems(d){return db.exercises.filter(x=>x.date===d)}
function totals(d){let f=foodItems(d),e=exItems(d);let eaten=f.reduce((a,x)=>a+(+x.calories||0)*(+x.quantity||1),0),pro=f.reduce((a,x)=>a+(+x.protein||0)*(+x.quantity||1),0),burned=e.reduce((a,x)=>a+(+x.burned||0),0),mins=e.reduce((a,x)=>a+(+x.minutes||0),0);return {eaten,pro,burned,mins,net:eaten-burned}}
function loggedDays(){return [...new Set(db.foods.map(x=>x.date))].sort()}
function proteinHits(){return loggedDays().filter(d=>totals(d).pro>=(+db.settings.protein||160)).length}
function balancedDays(){let tar=+db.settings.calories||2000;return loggedDays().filter(d=>{let n=totals(d).net;return n>=tar*.95&&n<=tar*1.05}).length}
function maxStreak(){let ds=loggedDays();if(!ds.length)return 0;let best=1,cur=1;for(let i=1;i<ds.length;i++){cur=addDays(ds[i-1],1)===ds[i]?cur+1:1;best=Math.max(best,cur)}return best}
function balancedWeek(){let days=loggedDays();if(days.length<5)return false;let recent=days.slice(-7),avg=recent.reduce((a,d)=>a+totals(d).net,0)/recent.length,tar=+db.settings.calories||2000;return avg>=tar*.95&&avg<=tar*1.05}
function halfwayToGoal(){let m=[...db.measurements].filter(x=>x.weight).sort((a,b)=>a.date.localeCompare(b.date));if(m.length<2||!db.settings.weightGoal)return false;let start=+m[0].weight,cur=+m.at(-1).weight,g=+db.settings.weightGoal;if(start===g)return true;return Math.abs(cur-g)<=Math.abs(start-g)/2}
function goalReached(){let m=[...db.measurements].filter(x=>x.weight).sort((a,b)=>a.date.localeCompare(b.date));if(!m.length||!db.settings.weightGoal)return false;let start=+m[0].weight,cur=+m.at(-1).weight,g=+db.settings.weightGoal;return start>g?cur<=g:cur>=g}

function render(){
 applyI18N();renderHome();renderProgress();renderBadges();renderMore()
}
function renderHome(){
 $("#selectedDateLabel").textContent=fmtDay(selectedDate);
 let tt=totals(selectedDate),calT=+db.settings.calories||2000,proT=+db.settings.protein||160;
 $("#homeCalories").textContent=Math.round(tt.eaten);$("#homeProtein").textContent=Math.round(tt.pro)+"g";$("#homeExercise").textContent=Math.round(tt.mins)+" min";$("#homeBurned").textContent=Math.round(tt.burned)+" kcal burned";$("#homeNet").textContent=Math.round(tt.net);
 $("#homeCalTarget").textContent=`/ ${calT} kcal`;$("#homeProteinTarget").textContent=`/ ${proT}g`;$("#homeNetTarget").textContent=`/ ${calT} kcal`;
 $("#helloText").textContent=lang()==="fr"?"Bonjour !":"Good morning!";
 let state=mascotState(tt.net,tt.pro,calT,proT);$("#homeMascotImg").src=state.img;$("#homeMascotTitle").textContent=state.title;$("#homeMascotCopy").textContent=state.copy;
 $("#mealSections").innerHTML=MEALS.map((m,i)=>mealCard(m,i)).join("")
}
function mascotState(cal,pro,calT,proT){
 if(!foodItems(selectedDate).length)return {img:"saucisse-wave.png",title:lang()==="fr"?"Prêt ?":"Ready when you are!",copy:lang()==="fr"?"Ajoutez votre premier repas de la journée.":"Add your first meal of the day."};
 let cr=cal/calT,pr=pro/proT;
 if(cr>=.9&&cr<=1.1&&pr>=.9)return {img:"saucisse-celebrate.png",title:lang()==="fr"?"Super journée !":"You're on track!",copy:lang()==="fr"?"Tes apports sont proches de tes objectifs.":"Your intake is sitting nicely around your targets."};
 if(cr<.75||cr>1.25||pr<.65)return {img:"saucisse-rest.png",title:lang()==="fr"?"On ajuste doucement.":"A little reset helps.",copy:lang()==="fr"?"Pas de stress. Regarde la tendance et avance pas à pas.":"No stress. Look at the trend and keep going step by step."};
 return {img:"saucisse-proud.png",title:lang()==="fr"?"Presque !":"Nearly there!",copy:lang()==="fr"?"Quelques petits ajustements et tu seras proche de la cible.":"A few small adjustments will bring you closer to target."}
}
function mealCard(m,i){
 let icons=["☕","●","▮","●","▾"],items=foodItems(selectedDate).filter(x=>x.meal===m),cal=items.reduce((a,x)=>a+(+x.calories||0)*(+x.quantity||1),0),pro=items.reduce((a,x)=>a+(+x.protein||0)*(+x.quantity||1),0);
 return `<div class="meal-card"><div class="meal-header"><div class="meal-name"><span class="meal-icon">${icons[i]}</span>${mealLabel(m)}</div><button class="meal-add" onclick="openFood('${m}')">+ ${lang()==="fr"?"Ajouter":"Add"}</button></div>
 <div class="meal-items">${items.length?items.map(x=>`<div class="food-row"><button onclick="editFood('${x.id}')"><strong>${esc(x.name)}${(+x.quantity||1)>1?` × ${x.quantity}`:""}</strong><br><small>${Math.round((+x.calories||0)*(+x.quantity||1))} kcal · ${round1((+x.protein||0)*(+x.quantity||1))}g</small></button><span>›</span></div>`).join(""):`<div class="food-row"><small>${lang()==="fr"?"Rien d'enregistré":"Nothing logged yet"}</small></div>`}</div>
 <div class="meal-total"><span>${Math.round(cal)} kcal</span><span>${round1(pro)}g protein</span></div></div>`
}
function renderProgress(){
 let data=period==="week"?dailyRange(14):monthlyRange(12);
 let valid=data.filter(x=>x.hasFood),avgC=valid.length?valid.reduce((a,x)=>a+x.cal,0)/valid.length:null,avgP=valid.length?valid.reduce((a,x)=>a+x.pro,0)/valid.length:null;
 $("#avgCalories").textContent=avgC==null?"N/A":`${Math.round(avgC)} kcal`;$("#avgProtein").textContent=avgP==null?"N/A":`${round1(avgP)}g`;$("#avgCaloriesTarget").textContent=`Target ${db.settings.calories||2000}`;$("#avgProteinTarget").textContent=`Target ${db.settings.protein||160}g`;
 let s=progressState(avgC,avgP);$("#progressMascot").src=s.img;$("#progressHeadline").textContent=s.title;$("#progressMessage").textContent=s.copy;
 renderBarChart($("#calorieChart"),data,"cal",+db.settings.calories||2000,"calorie");
 renderBarChart($("#proteinChart"),data,"pro",+db.settings.protein||160,"protein");
 renderMeasurementCharts();
}
function dailyRange(n){let out=[];for(let i=n-1;i>=0;i--){let d=addDays(todayISO(),-i),t=totals(d);out.push({label:shortDay(d),date:d,cal:t.net,pro:t.pro,hasFood:foodItems(d).length>0})}return out}
function monthlyRange(n){let now=new Date(),out=[];for(let i=n-1;i>=0;i--){let d=new Date(now.getFullYear(),now.getMonth()-i,1),y=d.getFullYear(),m=d.getMonth(),key=`${y}-${String(m+1).padStart(2,"0")}`;let ds=loggedDays().filter(x=>x.startsWith(key));let cal=ds.length?ds.reduce((a,x)=>a+totals(x).net,0)/ds.length:0,pro=ds.length?ds.reduce((a,x)=>a+totals(x).pro,0)/ds.length:0;out.push({label:d.toLocaleDateString(lang()==="fr"?"fr-FR":"en-GB",{month:"short",year:"numeric"}),cal,pro,hasFood:ds.length>0})}return out}
function progressState(c,p){if(c==null||p==null)return {img:"saucisse-wave.png",title:"Let's get started!",copy:"Log a few days and Saucisse will help you read the trend."};let ct=+db.settings.calories||2000,pt=+db.settings.protein||160,cr=c/ct,pr=p/pt;if(cr>=.95&&cr<=1.05&&pr>=.95)return {img:"saucisse-celebrate.png",title:lang()==="fr"?"Super période !":"Great period!",copy:lang()==="fr"?"Tes moyennes sont très proches de tes objectifs.":"Your averages are sitting nicely around your targets."};if(cr<.8||cr>1.2||pr<.7)return {img:"saucisse-rest.png",title:lang()==="fr"?"On garde le cap.":"Keep going.",copy:lang()==="fr"?"La tendance est encore loin de la cible, mais chaque semaine compte.":"The trend is still some way from target, but every week counts."};return {img:"saucisse-proud.png",title:lang()==="fr"?"Presque !":"Nearly there!",copy:lang()==="fr"?"Tu n'es pas loin. Continue pas à pas.":"You're not far off. Keep going step by step."}}
function renderBarChart(el,data,key,target,type){
 let max=Math.max(target,...data.filter(x=>x.hasFood).map(x=>x[key]),1)*1.15;
 el.innerHTML=data.map(x=>{if(!x.hasFood)return `<div class="bar-item na"><div class="bar-value">N/A</div><div class="bar-rail"></div><div class="bar-label">${x.label}</div></div>`;
 let val=x[key],pct=Math.max(4,Math.min(100,val/max*100)),color;
 if(type==="calorie")color=val<=target?"var(--green)":"var(--red)";else color=val>=target?"var(--green)":"var(--red)";
 return `<div class="bar-item"><div class="bar-value">${Math.round(val)}</div><div class="bar-rail"><i class="bar-fill" style="height:${pct}%;background:${color}"></i></div><div class="bar-label">${x.label}</div></div>`}).join("");
}
function renderMeasurementCharts(){
 let ms=[...db.measurements].sort((a,b)=>a.date.localeCompare(b.date)),weights=ms.filter(x=>x.weight),waists=ms.filter(x=>x.waist);
 renderMeasureBars($("#weightChart"),weights,"weight");renderMeasureBars($("#waistChart"),waists,"waist")
}
function renderMeasureBars(el,items,key){
 if(!items.length){el.innerHTML=`<div class="bar-item na"><div class="bar-value">N/A</div><div class="bar-rail"></div><div class="bar-label">N/A</div></div>`;return}
 let vals=items.map(x=>+x[key]),max=Math.max(...vals)*1.05,min=Math.min(...vals)*.95,goal=key==="weight"?+db.settings.weightGoal||null:null;
 el.innerHTML=items.map((x,i)=>{let v=+x[key],pct=Math.max(8,Math.min(100,(v-min)/(max-min||1)*80+20)),color="var(--green)";
 if(key==="weight"&&i>0){let prev=+items[i-1][key];if(goal){let prevD=Math.abs(prev-goal),curD=Math.abs(v-goal);if(curD>prevD)color="var(--red)";else{let closeness=Math.max(0,1-curD/Math.max(Math.abs(+items[0][key]-goal),1));color=closeness>.66?"var(--green)":closeness>.33?"#9bcf53":"var(--orange)"}}else color=v>prev?"var(--red)":"var(--green)"}
 return `<div class="bar-item"><div class="bar-value">${round1(v)}</div><div class="bar-rail"><i class="bar-fill" style="height:${pct}%;background:${color}"></i></div><div class="bar-label">${shortDay(x.date)}</div></div>`}).join("")
}
function renderBadges(){
 let unlocked=BADGES.filter(b=>b.test()).length;$("#badgeCount").textContent=`${unlocked} / 20 collected`;$("#badgeProgress").style.width=`${unlocked/20*100}%`;
 $("#badgeGrid").innerHTML=BADGES.filter(b=>badgeFilter==="all"||b.cat===badgeFilter).map(b=>{let ok=b.test();return `<div class="badge ${ok?"":"locked"}"><div class="badge-art"><img src="${b.img}" alt=""></div><strong>${b.name}</strong><small>${ok?"✓":""}</small></div>`}).join("")
}
function renderMore(){$("#settingCalories").value=db.settings.calories||2000;$("#settingProtein").value=db.settings.protein||160;$("#settingWeightGoal").value=db.settings.weightGoal??""}
function showPage(id){$$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$("nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===id));if(id==="progressPage")renderProgress();if(id==="badgesPage")renderBadges()}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}function round1(n){return Math.round((+n||0)*10)/10}
function openModal(id){$("#"+id).classList.add("open")}function closeModal(id){$("#"+id).classList.remove("open")}

function openFood(meal){selectedMeal=meal;foodTab="essentials";renderFoodModal();openModal("foodModal")}
function renderFoodModal(){
 $$(".food-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.foodtab===foodTab));
 let c=$("#foodTabContent");
 if(foodTab==="essentials"){c.innerHTML=`<div class="food-list-card">${ESSENTIALS.map((f,i)=>`<div class="essential-row"><div><strong>${f.name}</strong><small>${f.calories} kcal · ${f.protein}g protein · ${f.unit}</small></div><button class="circle-add" onclick="quickEssential(${i})">+</button></div>`).join("")}</div><p style="font-size:11px;color:var(--muted);margin:10px 2px">Starter values only. Check packaging/portion sizes for exact nutrition.</p>`}
 if(foodTab==="favourites"){c.innerHTML=db.favourites.length?`<div class="food-list-card">${db.favourites.map(f=>`<div class="essential-row"><div><strong>${esc(f.name)}</strong><small>${f.calories} kcal · ${f.protein}g</small></div><button class="circle-add" onclick="quickFavourite('${f.id}')">+</button></div>`).join("")}</div>`:`<div class="card" style="padding:18px">No favourites yet.</div>`}
 if(foodTab==="custom"){c.innerHTML=`<div class="custom-form"><label>Food name<input id="customName"></label><div class="two"><label>Calories<input id="customCalories" type="number" inputmode="numeric"></label><label>Protein (g)<input id="customProtein" type="number" step="0.1" inputmode="decimal"></label></div><div class="qty-line"><strong>Quantity</strong><div class="qty-ctrl"><button onclick="changeQty(-1)">−</button><b id="customQty">${qty}</b><button onclick="changeQty(1)">+</button></div></div><label style="display:flex;align-items:center;gap:8px"><input id="favCheck" type="checkbox" style="width:auto"> Save as favourite</label><button class="primary" onclick="saveCustom()">Add to diary</button></div>`}
}
function mergeFood(obj){let same=db.foods.find(x=>x.date===selectedDate&&x.meal===selectedMeal&&x.name.toLowerCase()===obj.name.toLowerCase()&&+x.calories===+obj.calories&&+x.protein===+obj.protein);if(same)same.quantity=(+same.quantity||1)+(+obj.quantity||1);else db.foods.push(obj)}
function quickEssential(i){let f=ESSENTIALS[i];mergeFood({id:uid(),date:selectedDate,meal:selectedMeal,name:f.name,calories:f.calories,protein:f.protein,quantity:1});closeModal("foodModal");save()}
function quickFavourite(id){let f=db.favourites.find(x=>x.id===id);if(f){mergeFood({id:uid(),date:selectedDate,meal:selectedMeal,name:f.name,calories:f.calories,protein:f.protein,quantity:1});closeModal("foodModal");save()}}
function changeQty(n){qty=Math.max(1,qty+n);$("#customQty").textContent=qty}
function saveCustom(){let name=$("#customName").value.trim();if(!name)return;let obj={id:uid(),date:selectedDate,meal:selectedMeal,name,calories:+$("#customCalories").value||0,protein:+$("#customProtein").value||0,quantity:qty};mergeFood(obj);if($("#favCheck").checked&&!db.favourites.some(f=>f.name.toLowerCase()===name.toLowerCase()))db.favourites.push({id:uid(),name,calories:obj.calories,protein:obj.protein});qty=1;closeModal("foodModal");save()}
function editFood(id){let x=db.foods.find(f=>f.id===id);if(!x)return;let n=prompt("Food name",x.name);if(n===null)return;x.name=n;let c=prompt("Calories per item",x.calories);if(c!==null)x.calories=+c||0;let p=prompt("Protein per item (g)",x.protein);if(p!==null)x.protein=+p||0;let q=prompt("Quantity",x.quantity||1);if(q!==null)x.quantity=Math.max(1,+q||1);save()}
function download(name,text,type="application/json"){let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}

$$("nav button").forEach(b=>b.onclick=()=>showPage(b.dataset.page));$$("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
$$("[data-lang]").forEach(b=>b.onclick=()=>{db.settings.lang=b.dataset.lang;save()});
$("#prevDay").onclick=()=>{selectedDate=addDays(selectedDate,-1);renderHome()};$("#nextDay").onclick=()=>{selectedDate=addDays(selectedDate,1);renderHome()};$("#calendarJump").onclick=()=>{let v=prompt("YYYY-MM-DD",selectedDate);if(v&&/^\d{4}-\d{2}-\d{2}$/.test(v)){selectedDate=v;renderHome()}};
$("#exerciseBtn").onclick=()=>openModal("exerciseModal");$("#saveExercise").onclick=()=>{db.exercises.push({id:uid(),date:selectedDate,type:$("#activityType").value,minutes:+$("#exerciseMinutes").value||0,burned:+$("#exerciseBurned").value||0});$("#exerciseMinutes").value="";$("#exerciseBurned").value="";closeModal("exerciseModal");save()};
$$("[data-period]").forEach(b=>b.onclick=()=>{period=b.dataset.period;$$("[data-period]").forEach(x=>x.classList.toggle("active",x===b));renderProgress()});
$$("[data-filter]").forEach(b=>b.onclick=()=>{badgeFilter=b.dataset.filter;$$("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderBadges()});
$$("[data-foodtab]").forEach(b=>b.onclick=()=>{foodTab=b.dataset.foodtab;renderFoodModal()});
$("#addMeasurement").onclick=()=>{$("#measureDate").value=todayISO();$("#measureWeight").value="";$("#measureWaist").value="";openModal("measurementModal")};$("#saveMeasurement").onclick=()=>{db.measurements.push({id:uid(),date:$("#measureDate").value||todayISO(),weight:+$("#measureWeight").value||null,waist:+$("#measureWaist").value||null});closeModal("measurementModal");save()};
$("#settingCalories").onchange=()=>{db.settings.calories=+$("#settingCalories").value||2000;save()};$("#settingProtein").onchange=()=>{db.settings.protein=+$("#settingProtein").value||160;save()};$("#settingWeightGoal").onchange=()=>{db.settings.weightGoal=+$("#settingWeightGoal").value||null;save()};
$("#exportBackup").onclick=()=>download(`step-by-step-backup-${todayISO()}.json`,JSON.stringify(db,null,2));
$("#restoreBackup").onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let x=JSON.parse(await f.text());if(!x.settings||!Array.isArray(x.foods))throw 0;if(confirm("Replace the data on this device with this backup?")){db=x;save()}}catch{alert("Invalid backup.")}e.target.value=""};
$("#exportCsv").onclick=()=>{let rows=[["date","meal","food","quantity","calories_per_item","protein_g_per_item"],...db.foods.map(x=>[x.date,x.meal,x.name,x.quantity,x.calories,x.protein])];download(`step-by-step-food-${todayISO()}.csv`,rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\n"),"text/csv")};
$("#deleteAll").onclick=()=>{if(confirm("Delete ALL Step by Step! data on this device?")&&confirm("Final confirmation: delete everything?")){localStorage.removeItem(KEY);db=fresh();selectedDate=todayISO();save()}};
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js");
render();
setTimeout(()=>{$("#splash").classList.add("hide");$("#app").classList.remove("hidden");setTimeout(()=>$("#splash").remove(),400)},700);
