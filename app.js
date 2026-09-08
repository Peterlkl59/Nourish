const KEY="nourish-v2";
const LEGACY="nourish-v1";
const MEALS=["Breakfast","Lunch","Dinner","Snacks","Drinks"];
const ESSENTIALS=[
{id:"egg-boiled-medium",name:"Boiled egg",calories:72,protein:7.1,basis:1,basisUnit:"item",displayBasis:"1 medium egg (~50g)",defaultAmount:1,step:1,source:"CoFID-backed"},
{id:"banana",name:"Banana, flesh only",calories:81,protein:1.2,basis:100,basisUnit:"g",displayBasis:"per 100g",defaultAmount:100,step:10,source:"CoFID-backed"},
{id:"apple",name:"Apple, flesh and skin",calories:51,protein:0.6,basis:100,basisUnit:"g",displayBasis:"per 100g",defaultAmount:130,step:10,source:"CoFID-backed"},
{id:"rice-white-boiled",name:"White long grain rice, boiled",calories:131,protein:2.8,basis:100,basisUnit:"g",displayBasis:"per 100g cooked",defaultAmount:180,step:10,source:"CoFID-backed"},
{id:"chicken-breast-grilled",name:"Chicken breast, grilled, skinless",calories:148,protein:32,basis:100,basisUnit:"g",displayBasis:"per 100g cooked",defaultAmount:150,step:10,source:"CoFID-backed"},
{id:"salmon-grilled",name:"Salmon, farmed, grilled",calories:239,protein:24.6,basis:100,basisUnit:"g",displayBasis:"per 100g cooked",defaultAmount:120,step:10,source:"CoFID-backed"},
{id:"potato-boiled",name:"Potato, boiled, flesh only",calories:74,protein:1.8,basis:100,basisUnit:"g",displayBasis:"per 100g cooked",defaultAmount:175,step:10,source:"CoFID-backed"},
{id:"porridge-oats",name:"Porridge oats, dry",calories:381,protein:10.9,basis:100,basisUnit:"g",displayBasis:"per 100g dry",defaultAmount:40,step:5,source:"CoFID-backed"},
{id:"wholemeal-bread",name:"Wholemeal bread, average",calories:217,protein:9.4,basis:100,basisUnit:"g",displayBasis:"per 100g",defaultAmount:36,step:5,source:"CoFID-backed"},
{id:"semi-skimmed-milk",name:"Semi-skimmed milk",calories:46,protein:3.5,basis:100,basisUnit:"ml",displayBasis:"per 100ml",defaultAmount:200,step:10,source:"CoFID-backed"},
{id:"cheddar",name:"Cheddar cheese",calories:416,protein:25.4,basis:100,basisUnit:"g",displayBasis:"per 100g",defaultAmount:30,step:5,source:"CoFID-backed"}
];
const I18N={
en:{splashTag:"Small steps. Big results.",heroCopy:"Step by step, for a healthier you.",calories:"Calories",protein:"Protein",exercise:"Exercise",netCalories:"Net calories",meals:"Meals",addExercise:"+ Exercise",progress:"Progress",week:"Week",month:"Month",averageCalories:"Average calories",averageProtein:"Average protein",weight:"Weight",waist:"Waist",addMeasurement:"+ Add measurement",badges:"Badges",doingAmazing:"You're doing amazing!",unlockMore:"Keep going to unlock more badges.",all:"All",nutrition:"Nutrition",activity:"Activity",streaks:"Streaks",more:"More",goals:"Goals",dailyCalories:"Daily calories",dailyProtein:"Daily protein",weightGoal:"Weight goal",language:"Language",data:"Data",exportBackup:"Export backup",restoreBackup:"Restore backup",exportCsv:"Export CSV",deleteAll:"Delete All Data",home:"Home",addFood:"Add Food",essentials:"Essentials",favourites:"Favourites",custom:"Custom",duration:"Duration (min)",caloriesBurned:"Calories burned",saveExercise:"Save Exercise",measurement:"Measurement",date:"Date",saveMeasurement:"Save Measurement"},
fr:{splashTag:"Petits pas. Grands résultats.",heroCopy:"Pas à pas, vers une meilleure santé.",calories:"Calories",protein:"Protéines",exercise:"Exercice",netCalories:"Calories nettes",meals:"Repas",addExercise:"+ Exercice",progress:"Progrès",week:"Semaine",month:"Mois",averageCalories:"Calories moyennes",averageProtein:"Protéines moyennes",weight:"Poids",waist:"Tour de taille",addMeasurement:"+ Ajouter une mesure",badges:"Badges",doingAmazing:"Tu fais un super travail !",unlockMore:"Continue pour débloquer plus de badges.",all:"Tous",nutrition:"Nutrition",activity:"Activité",streaks:"Séries",more:"Plus",goals:"Objectifs",dailyCalories:"Calories quotidiennes",dailyProtein:"Protéines quotidiennes",weightGoal:"Objectif de poids",language:"Langue",data:"Données",exportBackup:"Exporter une sauvegarde",restoreBackup:"Restaurer une sauvegarde",exportCsv:"Exporter en CSV",deleteAll:"Supprimer toutes les données",home:"Accueil",addFood:"Ajouter un aliment",essentials:"Essentiels",favourites:"Favoris",custom:"Personnalisé",duration:"Durée (min)",caloriesBurned:"Calories brûlées",saveExercise:"Enregistrer l'exercice",measurement:"Mesure",date:"Date",saveMeasurement:"Enregistrer la mesure"}
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
{id:"first-workout",name:"First Workout",cat:"activity",test:d=>(db.exercises||[]).length>=1,img:"saucisse-stretch.png"},
{id:"active-pup",name:"Active Pup",cat:"activity",test:d=>(db.exercises||[]).length>=5,img:"saucisse-running.png"},
{id:"exercise-expert",name:"Exercise Expert",cat:"activity",test:d=>(db.exercises||[]).length>=25,img:"saucisse-medal.png"},
{id:"progress-begins",name:"Progress Begins",cat:"progress",test:d=>(db.measurements||[]).length>=1,img:"saucisse-scale.png"},
{id:"halfway-there",name:"Halfway There",cat:"progress",test:d=>halfwayToGoal(),img:"saucisse-proud.png"},
{id:"goal-getter",name:"Goal Getter",cat:"progress",test:d=>goalReached(),img:"saucisse-medal.png"},
{id:"step-by-step",name:"Step by Step!",cat:"progress",test:d=>BADGES.slice(0,19).every(b=>b.test()),img:"saucisse-celebrate.png"}
];

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const todayISO=()=>new Date().toISOString().slice(0,10);
let selectedDate=todayISO(),period="week",foodTab="custom",selectedMeal="Breakfast",badgeFilter="all",qty=1,selectedEssentialId=null;
let db=load();

function fresh(){return {settings:{calories:2000,protein:160,weightGoal:null,lang:"en"},foods:[],exercises:[],measurements:[],favourites:[],meta:{}}}
function load(){
 let data=null;
 try{
   let raw=localStorage.getItem(KEY);
   if(raw)data=JSON.parse(raw);
   else{
     let old=localStorage.getItem(LEGACY);
     if(old)data=JSON.parse(old);
   }
 }catch(e){console.warn("Could not read saved data",e)}
 const base=fresh();
 data=data&&typeof data==="object"?data:{};
 const normal={
   settings:{...base.settings,...(data.settings||{})},
   foods:Array.isArray(data.foods)?data.foods:[],
   exercises:Array.isArray(data.exercises)?data.exercises:[],
   measurements:Array.isArray(data.measurements)?data.measurements:[],
   favourites:Array.isArray(data.favourites)?data.favourites:[],
   meta:{...base.meta,...(data.meta||{})}
 };
 normal.meta.badgeUnlocks=normal.meta.badgeUnlocks&&typeof normal.meta.badgeUnlocks==="object"?normal.meta.badgeUnlocks:{};
 return normal
}catch(e){}return fresh()}
function save(){localStorage.setItem(KEY,JSON.stringify(db));render();syncBadgeUnlocks(true)}
function lang(){return db.settings.lang||"en"}function t(k){return I18N[lang()][k]||k}
function applyI18N(){$$("[data-i18n]").forEach(e=>e.textContent=t(e.dataset.i18n));$$("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang()))}
function mealLabel(m){return lang()==="fr"?MEAL_FR[m]:m}
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random()}
function addDays(ds,n){let d=new Date(ds+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function fmtDay(ds){return new Date(ds+"T12:00:00").toLocaleDateString(lang()==="fr"?"fr-FR":"en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}
function shortDay(ds){
 let d=new Date(ds+"T12:00:00");
 return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`
}
function monthLabel(ds){
 let d=new Date(ds+"T12:00:00");
 let m=d.toLocaleDateString(lang()==="fr"?"fr-FR":"en-GB",{month:"short"}).replace(".","");
 return `${m.charAt(0).toUpperCase()+m.slice(1)} ${String(d.getFullYear()).slice(-2)}`
}
function foodItems(d){return (db.foods||[]).filter(x=>x.date===d)}function exItems(d){return (db.exercises||[]).filter(x=>x.date===d)}
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
 $("#helloText").textContent="Hello!";
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
 <div class="meal-items">${items.length?items.map(x=>`<div class="food-row"><button onclick="editFood('${x.id}')"><strong>${esc(x.name)}${x.amount?` · ${x.amount}${x.amountUnit==="item"?(x.amount==1?" item":" items"):x.amountUnit}`:((+x.quantity||1)>1?` × ${x.quantity}`:"")}</strong><br><small>${Math.round((+x.calories||0)*(+x.quantity||1))} kcal · ${round1((+x.protein||0)*(+x.quantity||1))}g</small></button><span>›</span></div>`).join(""):`<div class="food-row"><small>${lang()==="fr"?"Rien d'enregistré":"Nothing logged yet"}</small></div>`}</div>
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
 $$("[data-monthly-note]").forEach(n=>{n.hidden=period!=="month";n.textContent=lang()==="fr"?"ⓘ Les valeurs mensuelles de calories et de protéines correspondent à la moyenne par jour enregistré.":"ⓘ Monthly calorie and protein values show the average per logged day."});
}
function dailyRange(n){let out=[];for(let i=n-1;i>=0;i--){let d=addDays(todayISO(),-i),t=totals(d);out.push({label:shortDay(d),date:d,cal:t.net,pro:t.pro,hasFood:foodItems(d).length>0})}return out}
function monthlyRange(n){let now=new Date(),out=[];for(let i=n-1;i>=0;i--){let d=new Date(now.getFullYear(),now.getMonth()-i,1),y=d.getFullYear(),m=d.getMonth(),key=`${y}-${String(m+1).padStart(2,"0")}`;let ds=loggedDays().filter(x=>x.startsWith(key));let cal=ds.length?ds.reduce((a,x)=>a+totals(x).net,0)/ds.length:0,pro=ds.length?ds.reduce((a,x)=>a+totals(x).pro,0)/ds.length:0;out.push({label:monthLabel(`${y}-${String(m+1).padStart(2,"0")}-01`),cal,pro,hasFood:ds.length>0})}return out}
function progressState(c,p){if(c==null||p==null)return {img:"saucisse-wave.png",title:"Let's get started!",copy:"Log a few days and Saucisse will help you read the trend."};let ct=+db.settings.calories||2000,pt=+db.settings.protein||160,cr=c/ct,pr=p/pt;if(cr>=.95&&cr<=1.05&&pr>=.95)return {img:"saucisse-celebrate.png",title:lang()==="fr"?"Super période !":"Great period!",copy:lang()==="fr"?"Tes moyennes sont très proches de tes objectifs.":"Your averages are sitting nicely around your targets."};if(cr<.8||cr>1.2||pr<.7)return {img:"saucisse-rest.png",title:lang()==="fr"?"On garde le cap.":"Keep going.",copy:lang()==="fr"?"La tendance est encore loin de la cible, mais chaque semaine compte.":"The trend is still some way from target, but every week counts."};return {img:"saucisse-proud.png",title:lang()==="fr"?"Presque !":"Nearly there!",copy:lang()==="fr"?"Tu n'es pas loin. Continue pas à pas.":"You're not far off. Keep going step by step."}}
function renderBarChart(el,data,key,target,type){
 let hasAny=data.some(x=>x.hasFood);
 el.classList.toggle("has-data",hasAny);
 let max=Math.max(target,...data.filter(x=>x.hasFood).map(x=>x[key]),1)*1.15;
 el.innerHTML=data.map(x=>{if(!x.hasFood){let dow="";if(period==="week"&&x.date){dow=new Date(x.date+"T12:00:00").toLocaleDateString(lang()==="fr"?"fr-FR":"en-GB",{weekday:"short"}).replace(".","");dow=dow.charAt(0).toUpperCase()+dow.slice(1)}return `<div class="bar-item na"><div class="bar-dow">${dow}</div><div class="bar-value">N/A</div><div class="bar-rail"></div><div class="bar-label">${x.label}</div></div>`;}
 let val=x[key],pct=Math.max(4,Math.min(100,val/max*100)),color;
 if(type==="calorie")color=val<=target?"var(--green)":"var(--red)";else color=val>=target?"var(--green)":"var(--red)";
 let dow="";
 if(period==="week"&&x.date){dow=new Date(x.date+"T12:00:00").toLocaleDateString(lang()==="fr"?"fr-FR":"en-GB",{weekday:"short"}).replace(".","");dow=dow.charAt(0).toUpperCase()+dow.slice(1)}
 return `<div class="bar-item"><div class="bar-dow">${dow}</div><div class="bar-value">${Math.round(val)}</div><div class="bar-rail"><i class="bar-fill" style="height:${pct}%;background:${color}"></i></div><div class="bar-label">${x.label}</div></div>`}).join("");
}
function renderMeasurementCharts(){
 let ms=[...db.measurements].sort((a,b)=>a.date.localeCompare(b.date)),weights=ms.filter(x=>x.weight),waists=ms.filter(x=>x.waist);
 renderMeasureBars($("#weightChart"),weights,"weight");renderMeasureBars($("#waistChart"),waists,"waist")
}
function renderMeasureBars(el,items,key){
 el.classList.toggle("has-data",items.length>0);
 if(!items.length){
   let title=key==="weight"?(lang()==="fr"?"Aucune donnée de poids":"No weight data yet"):(lang()==="fr"?"Aucune donnée de tour de taille":"No waist data yet");
   let copy=lang()==="fr"?"Ajoutez une mesure pour commencer à suivre votre évolution.":"Add a measurement to start tracking your progress.";
   el.innerHTML=`<div class="measurement-empty"><img src="saucisse-scale.png" alt=""><strong>${title}</strong><span>${copy}</span></div>`;
   return
 }
 let vals=items.map(x=>+x[key]),max=Math.max(...vals)*1.05,min=Math.min(...vals)*.95,goal=key==="weight"?+db.settings.weightGoal||null:null;
 el.innerHTML=items.map((x,i)=>{let v=+x[key],pct=Math.max(8,Math.min(100,(v-min)/(max-min||1)*80+20)),color="var(--green)";
 if(key==="weight"&&i>0){let prev=+items[i-1][key];if(goal){let prevD=Math.abs(prev-goal),curD=Math.abs(v-goal);if(curD>prevD)color="var(--red)";else{let closeness=Math.max(0,1-curD/Math.max(Math.abs(+items[0][key]-goal),1));color=closeness>.66?"var(--green)":closeness>.33?"#9bcf53":"var(--orange)"}}else color=v>prev?"var(--red)":"var(--green)"}
 return `<div class="bar-item"><div class="bar-value">${round1(v)}</div><div class="bar-rail"><i class="bar-fill" style="height:${pct}%;background:${color}"></i></div><div class="bar-label">${shortDay(x.date)}</div></div>`}).join("")
}

function badgeRequirement(id){
 const req={
 "first-step":["Log your first food entry.",()=>Math.min(1,db.foods.length),1],
 "getting-started":["Complete 3 logged days.",()=>Math.min(3,loggedDays().length),3],
 "one-week":["Complete 7 logged days.",()=>Math.min(7,loggedDays().length),7],
 "two-weeks":["Complete 14 logged days.",()=>Math.min(14,loggedDays().length),14],
 "month-motion":["Complete 30 logged days.",()=>Math.min(30,loggedDays().length),30],
 "consistency-pup":["Build a 3-day logging streak.",()=>Math.min(3,maxStreak()),3],
 "on-a-roll":["Build a 7-day logging streak.",()=>Math.min(7,maxStreak()),7],
 "unstoppable":["Build a 30-day logging streak.",()=>Math.min(30,maxStreak()),30],
 "protein-pup":["Hit your protein target on 1 day.",()=>Math.min(1,proteinHits()),1],
 "protein-pro":["Hit your protein target on 7 different days.",()=>Math.min(7,proteinHits()),7],
 "protein-champion":["Hit your protein target on 30 different days.",()=>Math.min(30,proteinHits()),30],
 "balanced-day":["Finish a logged day within ±5% of your calorie target.",()=>Math.min(1,balancedDays()),1],
 "balanced-week":["Finish a week with average calories within ±5% of target.",()=>balancedWeek()?1:0,1],
 "first-workout":["Log your first exercise session.",()=>Math.min(1,db.exercises.length),1],
 "active-pup":["Log 5 exercise sessions.",()=>Math.min(5,db.exercises.length),5],
 "exercise-expert":["Log 25 exercise sessions.",()=>Math.min(25,db.exercises.length),25],
 "progress-begins":["Add your first weight or waist measurement.",()=>Math.min(1,db.measurements.length),1],
 "halfway-there":["Reach halfway from your starting weight to your goal weight.",()=>halfwayToGoal()?1:0,1],
 "goal-getter":["Reach your weight goal.",()=>goalReached()?1:0,1],
 "step-by-step":["Unlock the other 19 Saucisse badges.",()=>Math.min(19,Object.keys(db.meta?.badgeUnlocks||{}).filter(k=>k!=="step-by-step").length),19]
 };
 return req[id]||["Keep going to unlock this badge.",()=>0,1]
}
function syncBadgeUnlocks(showCelebration=false){
 db.meta=db.meta||{};db.meta.badgeUnlocks=db.meta.badgeUnlocks||{};
 let newly=[];
 BADGES.forEach(b=>{if(b.test()&&!db.meta.badgeUnlocks[b.id]){db.meta.badgeUnlocks[b.id]=todayISO();newly.push(b)}});
 localStorage.setItem(KEY,JSON.stringify(db));
 if(showCelebration&&newly.length){ /* badge unlock is reflected directly in the badge book */ }
}
function isBadgeUnlocked(b){return !!(db.meta?.badgeUnlocks?.[b.id]||b.test())}
function openBadge(id,celebration=false){
 let b=BADGES.find(x=>x.id===id);if(!b){console.warn("Badge not found",id);return;}let unlocked=isBadgeUnlocked(b),r=badgeRequirement(id),cur=r[1](),goal=r[2]();
 $("#badgeModalName").textContent=b.name;$("#badgeModalImg").src=b.img;
 $("#badgeModalStatus").textContent=unlocked?(celebration?"BADGE UNLOCKED!":"UNLOCKED"):"LOCKED";
 $("#badgeModalStatus").className="badge-status "+(unlocked?"unlocked":"locked");
 $("#badgeModalText").textContent=unlocked?`Well done! You have unlocked ${b.name}.`:r[0];
 $("#badgeModalProgress").textContent=unlocked?`Unlocked ${db.meta?.badgeUnlocks?.[id]||todayISO()}`:`Progress: ${cur} / ${goal}`;
 openModal("badgeModal")
}


function badgeDescription(id,unlocked){
 const map={
 "first-step":["Logged your first food","Log your first food"],
 "getting-started":["Logged 3 days","Log 3 days"],
 "one-week":["Logged a full week","Log 7 days"],
 "two-weeks":["Logged 14 days","Log 14 days"],
 "month-motion":["Logged 30 days","Log 30 days"],
 "consistency-pup":["3-day logging streak","Build a 3-day streak"],
 "on-a-roll":["7-day logging streak","Build a 7-day streak"],
 "unstoppable":["30-day logging streak","Build a 30-day streak"],
 "protein-pup":["Hit protein target once","Hit protein target once"],
 "protein-pro":["Hit protein target 7 times","Hit protein target 7 times"],
 "protein-champion":["Hit protein target 30 times","Hit protein target 30 times"],
 "balanced-day":["Calories within ±5% of target","Finish a day within ±5% of target"],
 "balanced-week":["Weekly calories around target","Keep weekly average within ±5%"],
 "first-workout":["Logged your first workout","Log your first workout"],
 "active-pup":["Logged 5 workouts","Log 5 workouts"],
 "exercise-expert":["Logged 25 workouts","Log 25 workouts"],
 "progress-begins":["Started tracking measurements","Add your first measurement"],
 "halfway-there":["Reached halfway to your goal","Reach halfway to your weight goal"],
 "goal-getter":["Reached your weight goal","Reach your weight goal"],
 "step-by-step":["Collected every badge","Unlock the other 19 badges"]
 };
 return (map[id]||["Achievement unlocked","Keep going"])[unlocked?0:1]
}
function badgeProgressText(id,unlocked){
 if(unlocked)return "✓ Unlocked";
 const r=badgeRequirement(id),cur=r[1](),goal=r[2]();
 return `${cur} / ${goal}`;
}
function renderBadges(){
 syncBadgeUnlocks(false);
 let unlocked=BADGES.filter(b=>isBadgeUnlocked(b)).length;
 $("#badgeCount").textContent=`${unlocked} / 20 collected`;
 $("#badgeProgress").style.width=`${unlocked/20*100}%`;
 const visible=BADGES.filter(b=>badgeFilter==="all"||b.cat===badgeFilter);
 $("#badgeGrid").innerHTML=visible.map(b=>{
   let ok=isBadgeUnlocked(b);
   return `<div class="badge ${ok?"":"locked"}">
     <div class="badge-art"><img src="${b.img}" alt=""></div>
     <strong>${b.name}</strong>
     <p>${badgeDescription(b.id,ok)}</p>
     <small class="${ok?"badge-unlocked":"badge-locked-progress"}">${badgeProgressText(b.id,ok)}</small>
   </div>`
 }).join("");
}
function renderMore(){$("#settingCalories").value=db.settings.calories||2000;$("#settingProtein").value=db.settings.protein||160;$("#settingWeightGoal").value=db.settings.weightGoal??""}
function showPage(id){$$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$("nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===id));if(id==="progressPage")renderProgress();if(id==="badgesPage")renderBadges()}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}function round1(n){return Math.round((+n||0)*10)/10}
function openModal(id){$("#"+id).classList.add("open")}function closeModal(id){$("#"+id).classList.remove("open")}

function openFood(meal){selectedMeal=meal;foodTab="custom";qty=1;selectedEssentialId=null;renderFoodModal();openModal("foodModal")}
function renderFoodModal(){
 $$(".food-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.foodtab===foodTab));
 let c=$("#foodTabContent");
 if(foodTab==="essentials"){
   c.innerHTML=`<div class="food-list-card">${ESSENTIALS.map((f,i)=>`
   <button type="button" class="essential-row essential-select" data-essential-id="${f.id}">
     <div><strong>${f.name}</strong><small>${f.calories} kcal · ${f.protein}g protein · ${f.displayBasis}</small></div><span>›</span>
   </button>`).join("")}</div>
   <p class="food-source-note">Reference nutrition values are standard values. Amounts are calculated from the quantity you enter; packaged foods can differ, so use the label when available.</p>`;
   c.querySelectorAll("[data-essential-id]").forEach(b=>b.addEventListener("click",()=>openEssentialAmount(b.dataset.essentialId)));
 }
 if(foodTab==="favourites"){
   c.innerHTML=db.favourites.length?`<div class="food-list-card">${db.favourites.map(f=>`
   <button type="button" class="essential-row essential-select" data-favourite-id="${f.id}">
     <div><strong>${esc(f.name)}</strong><small>${round1(f.calories)} kcal · ${round1(f.protein)}g protein ${f.displayBasis?`· ${esc(f.displayBasis)}`:""}</small></div><span>›</span>
   </button>`).join("")}</div>`:`<div class="card food-empty">No favourites yet.</div>`;
   c.querySelectorAll("[data-favourite-id]").forEach(b=>b.addEventListener("click",()=>openFavouriteAmount(b.dataset.favouriteId)));
 }
 if(foodTab==="custom"){
   c.innerHTML=`<div class="custom-form">
   <label>Food name<input id="customName"></label>
   <div class="two"><label>Calories per item<input id="customCalories" type="number" inputmode="numeric"></label><label>Protein per item (g)<input id="customProtein" type="number" step="0.1" inputmode="decimal"></label></div>
   <div class="qty-line"><strong>Quantity</strong><div class="qty-ctrl"><button type="button" onclick="changeQty(-1)">−</button><b id="customQty">${qty}</b><button type="button" onclick="changeQty(1)">+</button></div></div>
   <div class="food-total-preview" id="customTotalPreview">0 kcal · 0g protein</div>
   <label class="check-save"><input id="favCheck" type="checkbox"> Save as favourite</label>
   <button class="primary" onclick="saveCustom()">Add to diary</button></div>`;
   $("#customCalories").addEventListener("input",updateCustomPreview);
   $("#customProtein").addEventListener("input",updateCustomPreview);
   updateCustomPreview();
 }
}
function mergeFood(obj){
 let same=db.foods.find(x=>x.date===selectedDate&&x.meal===selectedMeal&&x.name.toLowerCase()===obj.name.toLowerCase()&&+x.calories===+obj.calories&&+x.protein===+obj.protein&&String(x.amountUnit||"item")===String(obj.amountUnit||"item"));
 if(same){
   if(obj.amountUnit&&obj.amountUnit!=="item"){
     same.amount=(+same.amount||0)+(+obj.amount||0);
     same.quantity=1;
     same.calories=+obj.calories;
     same.protein=+obj.protein;
     same.basis=+obj.basis||100;
   }else{
     same.quantity=(+same.quantity||1)+(+obj.quantity||1);
   }
 }else db.foods.push(obj)
}
function calcByAmount(food,amount){
 let ratio=(+amount||0)/(+food.basis||1);
 return {calories:round1((+food.calories||0)*ratio),protein:round1((+food.protein||0)*ratio)}
}
function openEssentialAmount(id){
 let f=ESSENTIALS.find(x=>x.id===id);if(!f)return;
 selectedEssentialId=id;
 let unit=f.basisUnit==="item"?"item":f.basisUnit;
 let amount=f.defaultAmount||f.basis;
 let c=$("#foodTabContent");
 c.innerHTML=`<div class="amount-editor">
   <button type="button" class="back-mini" id="backEssentials">‹ Essentials</button>
   <h3>${f.name}</h3>
   <p class="nutrition-reference">${f.calories} kcal · ${f.protein}g protein <strong>${f.displayBasis}</strong></p>
   <label>Amount</label>
   <div class="amount-control">
     <button type="button" id="amountMinus">−</button>
     <div><input id="essentialAmount" type="number" inputmode="decimal" step="${f.step}" value="${amount}"><span>${unit==="item"?(amount==1?"item":"items"):unit}</span></div>
     <button type="button" id="amountPlus">+</button>
   </div>
   <div class="food-total-box"><span>Total</span><strong id="essentialTotal"></strong></div>
   <button class="primary" id="addEssentialToDiary">Add to diary</button>
 </div>`;
 const input=$("#essentialAmount");
 const update=()=>{let a=Math.max(f.basisUnit==="item"?1:0,+input.value||0),v=calcByAmount(f,a);$("#essentialTotal").textContent=`${v.calories} kcal · ${v.protein}g protein`;let span=input.nextElementSibling;if(span&&f.basisUnit==="item")span.textContent=a==1?"item":"items"};
 update();
 $("#backEssentials").onclick=()=>{foodTab="essentials";renderFoodModal()};
 $("#amountMinus").onclick=()=>{input.value=Math.max(f.basisUnit==="item"?1:0,(+input.value||0)-f.step);update()};
 $("#amountPlus").onclick=()=>{input.value=(+input.value||0)+f.step;update()};
 input.addEventListener("input",update);
 $("#addEssentialToDiary").onclick=()=>{
   let a=Math.max(f.basisUnit==="item"?1:0,+input.value||0);
   let v=calcByAmount(f,a);
   let obj={id:uid(),date:selectedDate,meal:selectedMeal,name:f.name,calories:v.calories,protein:v.protein,quantity:1,amount:a,amountUnit:f.basisUnit,basis:f.basis,sourceType:"essential",essentialId:f.id,displayBasis:f.displayBasis};
   mergeFood(obj);closeModal("foodModal");save()
 }
}
function openFavouriteAmount(id){
 let f=db.favourites.find(x=>x.id===id);if(!f)return;
 // Favourites saved from custom foods are item-based by default.
 let basis=f.basis||1,unit=f.amountUnit||"item",step=unit==="item"?1:10,amount=unit==="item"?1:(f.defaultAmount||basis);
 let pseudo={...f,basis,basisUnit:unit,step,defaultAmount:amount,displayBasis:f.displayBasis||(unit==="item"?"per item":`per ${basis}${unit}`)};
 selectedEssentialId=null;
 let c=$("#foodTabContent");
 c.innerHTML=`<div class="amount-editor">
   <button type="button" class="back-mini" id="backFavs">‹ Favourites</button>
   <h3>${esc(f.name)}</h3>
   <p class="nutrition-reference">${round1(f.calories)} kcal · ${round1(f.protein)}g protein <strong>${esc(pseudo.displayBasis)}</strong></p>
   <label>Amount</label>
   <div class="amount-control"><button type="button" id="amountMinus">−</button><div><input id="essentialAmount" type="number" inputmode="decimal" step="${step}" value="${amount}"><span>${unit==="item"?"item":unit}</span></div><button type="button" id="amountPlus">+</button></div>
   <div class="food-total-box"><span>Total</span><strong id="essentialTotal"></strong></div>
   <button class="primary" id="addEssentialToDiary">Add to diary</button>
 </div>`;
 let input=$("#essentialAmount"),update=()=>{let a=Math.max(unit==="item"?1:0,+input.value||0),v=calcByAmount(pseudo,a);$("#essentialTotal").textContent=`${v.calories} kcal · ${v.protein}g protein`};update();
 $("#backFavs").onclick=()=>{foodTab="favourites";renderFoodModal()};
 $("#amountMinus").onclick=()=>{input.value=Math.max(unit==="item"?1:0,(+input.value||0)-step);update()};
 $("#amountPlus").onclick=()=>{input.value=(+input.value||0)+step;update()};input.addEventListener("input",update);
 $("#addEssentialToDiary").onclick=()=>{let a=Math.max(unit==="item"?1:0,+input.value||0),v=calcByAmount(pseudo,a);mergeFood({id:uid(),date:selectedDate,meal:selectedMeal,name:f.name,calories:v.calories,protein:v.protein,quantity:1,amount:a,amountUnit:unit,basis:basis,sourceType:"favourite",favouriteId:f.id,displayBasis:pseudo.displayBasis});closeModal("foodModal");save()}
}
function updateCustomPreview(){let c=+($("#customCalories")?.value||0),p=+($("#customProtein")?.value||0);let el=$("#customTotalPreview");if(el)el.textContent=`${round1(c*qty)} kcal · ${round1(p*qty)}g protein`}
function changeQty(n){qty=Math.max(1,qty+n);let q=$("#customQty");if(q)q.textContent=qty;updateCustomPreview()}
function saveCustom(){
 let name=$("#customName").value.trim();if(!name)return;
 let perCal=+$("#customCalories").value||0,perPro=+$("#customProtein").value||0;
 let obj={id:uid(),date:selectedDate,meal:selectedMeal,name,calories:round1(perCal*qty),protein:round1(perPro*qty),quantity:1,amount:qty,amountUnit:"item",basis:1,sourceType:"custom",perItemCalories:perCal,perItemProtein:perPro,displayBasis:"per item"};
 mergeFood(obj);
 if($("#favCheck").checked&&!db.favourites.some(f=>f.name.toLowerCase()===name.toLowerCase()))db.favourites.push({id:uid(),name,calories:perCal,protein:perPro,basis:1,amountUnit:"item",displayBasis:"per item"});
 qty=1;closeModal("foodModal");save()
}
function openEditFood(id){
 let x=db.foods.find(f=>f.id===id);if(!x)return;
 $("#editFoodId").value=x.id;$("#editFoodName").value=x.name;$("#editFoodMeal").value=x.meal;
 let unit=x.amountUnit||"item",amount=x.amount??(x.quantity||1);
 $("#editFoodAmount").value=amount;$("#editFoodUnit").textContent=unit==="item"?(amount==1?"item":"items"):unit;
 $("#editFoodCalories").value=round1(x.calories||0);$("#editFoodProtein").value=round1(x.protein||0);
 $("#editFoodBasisNote").textContent=x.displayBasis?`Reference: ${x.displayBasis}`:"";
 openModal("editFoodModal")
}
function editFood(id){openEditFood(id)}
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

$("#editFoodAmount").addEventListener("input",()=>{
 let id=$("#editFoodId").value,x=db.foods.find(f=>f.id===id);if(!x)return;
 let newAmount=Math.max(x.amountUnit==="item"?1:0,+$("#editFoodAmount").value||0),oldAmount=+x.amount||(+x.quantity||1);
 if(oldAmount>0){
   $("#editFoodCalories").value=round1((+x.calories||0)*(newAmount/oldAmount));
   $("#editFoodProtein").value=round1((+x.protein||0)*(newAmount/oldAmount));
 }
 $("#editFoodUnit").textContent=(x.amountUnit||"item")==="item"?(newAmount==1?"item":"items"):(x.amountUnit||"");
});
$("#saveFoodEdit").onclick=()=>{
 let id=$("#editFoodId").value,x=db.foods.find(f=>f.id===id);if(!x)return;
 x.name=$("#editFoodName").value.trim()||x.name;x.meal=$("#editFoodMeal").value;
 x.amount=Math.max((x.amountUnit||"item")==="item"?1:0,+$("#editFoodAmount").value||0);
 x.quantity=1;x.calories=+$("#editFoodCalories").value||0;x.protein=+$("#editFoodProtein").value||0;
 closeModal("editFoodModal");save()
};
$("#deleteFoodEdit").onclick=()=>{
 let id=$("#editFoodId").value;if(confirm(lang()==="fr"?"Supprimer cet aliment du journal ?":"Delete this food from the diary?")){
   db.foods=db.foods.filter(f=>f.id!==id);closeModal("editFoodModal");save()
 }
};

if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js");
try{
 render();
}catch(e){
 console.error("Step by Step render error",e);
}
setTimeout(()=>{
 const splash=$("#splash"),app=$("#app");
 if(splash)splash.classList.add("hide");
 if(app)app.classList.remove("hidden");
 setTimeout(()=>splash?.remove(),400)
},700);
