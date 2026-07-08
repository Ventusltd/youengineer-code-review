"use strict";
const STORE = "youengineer-wc-grid-v5-isolated";
const T = {
  rsa:["South Africa","🇿🇦"], can:["Canada","🇨🇦"], ned:["Netherlands","🇳🇱"], mar:["Morocco","🇲🇦"],
  ger:["Germany","🇩🇪"], par:["Paraguay","🇵🇾"], fra:["France","🇫🇷"], swe:["Sweden","🇸🇪"],
  por:["Portugal","🇵🇹"], cro:["Croatia","🇭🇷"], esp:["Spain","🇪🇸"], aut:["Austria","🇦🇹"],
  usa:["United States","🇺🇸"], bih:["Bosnia and Herzegovina","🇧🇦"], bel:["Belgium","🇧🇪"], sen:["Senegal","🇸🇳"],
  bra:["Brazil","🇧🇷"], jpn:["Japan","🇯🇵"], civ:["Ivory Coast","🇨🇮"], nor:["Norway","🇳🇴"],
  mex:["Mexico","🇲🇽"], ecu:["Ecuador","🇪🇨"], eng:["England",""] , cod:["DR Congo","🇨🇩"],
  arg:["Argentina","🇦🇷"], cpv:["Cape Verde","🇨🇻"], aus:["Australia","🇦🇺"], egy:["Egypt","🇪🇬"],
  sui:["Switzerland","🇨🇭"], dza:["Algeria","🇩🇿"], col:["Colombia","🇨🇴"], gha:["Ghana","🇬🇭"]
};
const sources = {r32:"SB Nation + Reuters / AP / Guardian bundle", r16a:"Reuters + Guardian", r16b:"Reuters + NY Post", r16c:"Reuters + AP + Guardian", r16d:"Reuters", committed:"Committed v5 snapshot"};
const rounds = [
  {id:"round-32", title:"Round of 32", count:16, dates:null},
  {id:"round-16", title:"Round of 16", count:8, dates:["Sat 4 Jul, 18:00","Sat 4 Jul, 22:00","Mon 6 Jul, 20:00","Tue 7 Jul, 01:00","Sun 5 Jul, 21:00","Mon 6 Jul, 01:00","Tue 7 Jul, 17:00","Tue 7 Jul, 21:00"]},
  {id:"quarter-finals", title:"Quarter-finals", count:4, dates:["Thu 9 Jul, 21:00","Fri 10 Jul, 20:00","Sat 11 Jul, 22:00","Sun 12 Jul, 02:00"]},
  {id:"semi-finals", title:"Semi-finals", count:2, dates:["Tue 14 Jul, 20:00","Wed 15 Jul, 20:00"]},
  {id:"final", title:"Final", count:1, dates:["Sun 19 Jul, 20:00"]}
];
function m(home,away,date,status,score,winner,events=[],note=null,source="r32",confidence=0.82){return {home,away,date,status,score,winner,events,note,source,confidence}}
const baseMatches = [
  m("rsa","can","Sun 28 Jun, 20:00","FT",[0,1],"can",[{team:"can",player:"Stephen Eustáquio",minute:"90+2"}]),
  m("ned","mar","Tue 30 Jun, 02:00","FT",["1 (2p)","1 (3p)"],"mar",[{team:"ned",player:"Cody Gakpo",minute:"72"},{team:"mar",player:"Issa Diop",minute:"90+1"},{team:"mar",type:"shootout",player:"Ismael Saibari",minute:"pens",detail:"decisive penalty"}]),
  m("ger","par","Mon 29 Jun, 21:30","FT",["1 (3p)","1 (4p)"],"par",[{team:"par",player:"Julio Enciso"},{team:"ger",player:"Kai Havertz"},{team:"par",type:"shootout",player:"José Canale",minute:"pens",detail:"decisive penalty"}]),
  m("fra","swe","Tue 30 Jun, 22:00","FT",[3,0],"fra",[{team:"fra",player:"Kylian Mbappé"},{team:"fra",player:"Bradley Barcola"},{team:"fra",player:"Kylian Mbappé"}]),
  m("por","cro","Fri 3 Jul, 00:00","FT",[2,1],"por",[{team:"cro",player:"Ivan Perišić",minute:"53"},{team:"por",type:"penalty",player:"Cristiano Ronaldo",minute:"68"},{team:"por",player:"Gonçalo Ramos",minute:"90+4"}]),
  m("esp","aut","Thu 2 Jul, 20:00","FT",[3,0],"esp",[{team:"esp",player:"Mikel Oyarzabal"},{team:"esp",player:"Mikel Oyarzabal"},{team:"esp",player:"Pedro Porro"}]),
  m("usa","bih","Thu 2 Jul, 01:00","FT",[2,0],"usa",[{team:"usa",player:"Folarin Balogun",minute:"45"},{team:"usa",player:"Malik Tillman",minute:"82"}]),
  m("bel","sen","Wed 1 Jul, 21:00","FT",[3,2],"bel",[{team:"sen",player:"Habib Diarra"},{team:"sen",player:"Ismaïla Sarr"},{team:"bel",player:"Romelu Lukaku",minute:"86"},{team:"bel",player:"Youri Tielemans",minute:"89"},{team:"bel",type:"penalty",player:"Youri Tielemans",minute:"125"}]),
  m("bra","jpn","Mon 29 Jun, 18:00","FT",[2,1],"bra",[{team:"jpn",player:"Kaishu Sano",minute:"29"},{team:"bra",player:"Casemiro",minute:"55"},{team:"bra",player:"Gabriel Martinelli",minute:"90+6"}]),
  m("civ","nor","Tue 30 Jun, 18:00","FT",[1,2],"nor",[{team:"nor",player:"Antonio Nusa",minute:"36"},{team:"civ",player:"Amad Diallo",minute:"74"},{team:"nor",player:"Erling Haaland",minute:"86"}]),
  m("mex","ecu","Wed 1 Jul, 02:00","FT",[2,0],"mex",[{team:"mex",player:"Julián Quiñones",minute:"22"},{team:"mex",player:"Raúl Jiménez",minute:"32"}]),
  m("eng","cod","Wed 1 Jul, 17:00","FT",[2,1],"eng",[{team:"cod",player:"Brian Cipenga",minute:"7"},{team:"eng",player:"Harry Kane",minute:"75"},{team:"eng",player:"Harry Kane",minute:"86"}]),
  m("arg","cpv","Fri 3 Jul, 23:00","AET",[3,2],"arg",[{team:"arg",player:"Lionel Messi",minute:"29"},{team:"cpv",player:"Deroy Duarte",minute:"59"},{team:"arg",player:"Lisandro Martínez",minute:"92"},{team:"cpv",player:"Sidny Lopes Cabral",minute:"103"},{team:"arg",type:"own_goal",player:"Diney Borges",minute:"111"}]),
  m("aus","egy","Fri 3 Jul, 19:00","FT",["1 (2p)","1 (4p)"],"egy",[{team:"egy",player:"Emam Ashour"},{team:"aus",type:"own_goal",player:"Mohamed Hany"},{team:"egy",type:"shootout",player:"Mohamed Salah",minute:"pens"},{team:"egy",type:"shootout",player:"Hossam Abdelmaguid",minute:"pens",detail:"decisive penalty"}]),
  m("sui","dza","Fri 3 Jul, 04:00","FT",[2,0],"sui",[{team:"sui",player:"Breel Embolo",minute:"10"},{team:"sui",player:"Dan Ndoye",minute:"49"}],"⚠ topology note: earlier source text listed Austria; current bracket uses Algeria"),
  m("col","gha","Sat 4 Jul, 02:30","FT",[1,0],"col",[{team:"col",player:"Jhon Arias",minute:"14"}])
];
rounds[0].dates = baseMatches.map(x => x.date);
const officialRounds = {
  "round-16": [
    m("can","mar","Sat 4 Jul, 18:00","FT",[0,3],"mar",[{team:"mar",player:"Azzedine Ounahi"},{team:"mar",player:"Azzedine Ounahi",minute:"82"},{team:"mar",player:"Soufiane Rahimi",minute:"90+",detail:"late third"}],null,"r16a",0.90),
    m("par","fra","Sat 4 Jul, 22:00","FT",[0,1],"fra",[{team:"fra",type:"penalty",player:"Kylian Mbappé",minute:"70",detail:"foul won by Désiré Doué"}],null,"r16a",0.96),
    m("por","esp","Mon 6 Jul, 20:00","FT",[0,1],"esp",[{team:"esp",player:"Mikel Merino",minute:"91",assist:"Ferran Torres"}],null,"r16a",0.96),
    m("usa","bel","Tue 7 Jul, 01:00","FT",[1,4],"bel",[{team:"bel",player:"Charles De Ketelaere",minute:"9"},{team:"usa",player:"Malik Tillman",minute:"31",detail:"deflected free kick"},{team:"bel",player:"Charles De Ketelaere",detail:"second goal"},{team:"bel",player:"Hans Vanaken",minute:"57"},{team:"bel",player:"Romelu Lukaku",minute:"90+"}],null,"r16c",0.94),
    m("bra","nor","Sun 5 Jul, 21:00","FT",[1,2],"nor",[{team:"nor",player:"Erling Haaland",minute:"79",assist:"Andreas Schjelderup"},{team:"nor",player:"Erling Haaland",minute:"90",assist:"Andreas Schjelderup"},{team:"bra",type:"penalty",player:"Neymar",minute:"90+"}],null,"r16a",0.96),
    m("mex","eng","Mon 6 Jul, 01:00","FT",[2,3],"eng",[{team:"eng",player:"Jude Bellingham",minute:"36"},{team:"eng",player:"Jude Bellingham",minute:"38"},{team:"mex",player:"Julián Quiñones",minute:"42"},{team:"eng",type:"penalty",player:"Harry Kane",minute:"60"},{team:"mex",type:"penalty",player:"Raúl Jiménez",minute:"69"}],null,"r16b",0.94),
    m("arg","egy","Tue 7 Jul, 17:00","FT",[3,2],"arg",[{team:"egy",player:"Yasser Ibrahim",minute:"15"},{team:"egy",player:"Mostafa Zico",minute:"67"},{team:"arg",player:"Cristian Romero",minute:"79"},{team:"arg",player:"Lionel Messi",minute:"83"},{team:"arg",player:"Enzo Fernández",minute:"90+2",assist:"Lautaro Martínez"}],"Messi missed an earlier penalty; Argentina came back from 0-2", "r16d",0.96),
    m("sui","col","Tue 7 Jul, 21:00","FT",["0 (4p)","0 (3p)"],"sui",[{team:"col",type:"shootout",player:"Davinson Sánchez",minute:"pens",detail:"hit crossbar"},{team:"col",type:"shootout",player:"Cucho Hernández",minute:"pens",detail:"saved by Gregor Kobel"},{team:"sui",type:"shootout",player:"Manuel Akanji",minute:"pens",detail:"missed"},{team:"sui",type:"shootout",player:"Ruben Vargas",minute:"pens",detail:"decisive penalty"}],"0-0 after extra time; Switzerland won 4-3 on penalties", "r16d",0.96)
  ]
};
let picks = load(), pos = [], focus = false;
function load(){try{return JSON.parse(localStorage.getItem(STORE))||{}}catch{return {}}}
function save(){localStorage.setItem(STORE,JSON.stringify(picks))}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function team(k){return k&&T[k]?{id:k,name:T[k][0],flag:T[k][1]}:null}
function resultFor(r,i){return r===0 ? baseMatches[i] : ((officialRounds[rounds[r].id]||[])[i]||{})}
function winner(r,i){const result=resultFor(r,i);return result.winner||picks[`r${r}m${i}`]||""}
function entrants(r,i){return r===0?[team(baseMatches[i].home),team(baseMatches[i].away)]:[team(winner(r-1,i*2)),team(winner(r-1,i*2+1))]}
function clearAfter(r){Object.keys(picks).forEach(k=>{const mm=k.match(/^r(\d+)/);if(mm&&+mm[1]>r)delete picks[k]})}
function officialCount(){return baseMatches.filter(x=>x.winner).length+Object.values(officialRounds).flat().filter(x=>x&&x.winner).length}
function activePickCount(){return Object.keys(picks).filter(k=>{const mm=k.match(/^r(\d+)m(\d+)$/);return !mm||!resultFor(+mm[1],+mm[2]).winner}).length}
function cleanInvalidPicks(){let changed=false;Object.keys(picks).forEach(k=>{const mm=k.match(/^r(\d+)m(\d+)$/);if(!mm)return;const r=+mm[1],i=+mm[2],result=resultFor(r,i),pair=entrants(r,i).map(t=>t&&t.id);if(result.winner||!pair.includes(picks[k])){delete picks[k];changed=true}});if(changed)save()}
function pick(r,i,t){if(!t||resultFor(r,i).winner)return;picks[`r${r}m${i}`]=t.id;clearAfter(r);save();render()}
function css(n,f){const v=parseFloat(getComputedStyle(document.documentElement).getPropertyValue(n));return Number.isFinite(v)?v:f}
function geometry(){const w=css("--card-w",360),h=css("--card-h",244),g=css("--round-gap",48),cg=css("--col-gap",140),p=css("--bracket-pad",12),to=css("--title-offset",38),xs=rounds.map((_,r)=>p+r*(w+cg));pos=[];pos[0]=baseMatches.map((_,i)=>({x:xs[0],y:p+to+i*(h+g)}));for(let r=1;r<rounds.length;r++){pos[r]=[];for(let i=0;i<rounds[r].count;i++){const a=pos[r-1][i*2],b=pos[r-1][i*2+1],cy=(a.y+h/2+b.y+h/2)/2;pos[r][i]={x:xs[r],y:cy-h/2}}}return{w,h,p,to,width:p*2+rounds.length*w+(rounds.length-1)*cg,height:p*2+to+baseMatches.length*h+(baseMatches.length-1)*g}}
function a(label,href){const x=document.createElement("a");x.textContent=label;x.href=href;x.target="_blank";x.rel="noopener noreferrer";return x}
function tools(t){const d=document.createElement("div");d.className="team-tools";if(!t)return d;const q=encodeURIComponent(`${t.name} football team World Cup 2026`);d.append(a("News",`https://news.google.com/search?q=${q}`),a("Wiki",`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(t.name+" national football team")}`),a("Images",`https://www.google.com/search?tbm=isch&q=${q}`));return d}
function flag(t){return `<span class="flag ${t.id==="eng"?"england-flag":""}" aria-label="${esc(t.name)} flag">${t.id==="eng"?"":esc(t.flag)}</span>`}
function eventMinute(e){return e.minute===undefined||e.minute===null||e.minute===""?"min tbc":e.minute==="pens"?"pens":`${e.minute}'`}
function eventType(e){return e.type==="penalty"?"pen":e.type==="own_goal"?"OG":e.type==="shootout"?"shootout":""}
function eventText(e){const bits=[eventMinute(e)],typ=eventType(e);if(typ)bits.push(typ);if(e.player)bits.push(e.player);if(e.assist)bits.push(`A: ${e.assist}`);if(e.detail)bits.push(`(${e.detail})`);return bits.join(" · ")}
function eventBlock(result,teamId){const evs=(result.events||[]).filter(e=>e.team===teamId);if(!evs.length)return null;const d=document.createElement("div");d.className="match-events";evs.forEach(e=>{const line=document.createElement("div");line.className="match-event";line.textContent=eventText(e);d.append(line)});return d}
function sourceBlock(result){if(!result.winner&&!result.note)return null;const d=document.createElement("div");d.className="match-source";d.textContent=`${result.note?result.note+" · ":""}${sources[result.source]||sources.committed}${result.confidence?` · c${(+result.confidence).toFixed(2)}`:""}`;return d}
function teamRow(r,i,t,sel,score,result){const wrap=document.createElement("div"),b=document.createElement("button");b.className="team-button";b.type="button";if(!t){b.disabled=true;b.innerHTML='<span class="flag">◇</span><span class="team-name">TBD</span><span></span>';wrap.append(b);return wrap}const locked=!!result.winner,s=sel===t.id;if(s)b.classList.add("selected");if(locked){b.classList.add("locked");b.disabled=true}b.innerHTML=`${flag(t)}<span class="team-name">${esc(t.name)}</span><span class="pick-indicator">${score!==undefined?esc(score)+(s?" ✓":""):(s?"✓":"›")}</span>`;b.onclick=()=>pick(r,i,t);wrap.append(b);const ev=eventBlock(result,t.id);if(ev)wrap.append(ev);wrap.append(tools(t));return wrap}
function card(r,i){const [x,y]=entrants(r,i),sel=winner(r,i),result=resultFor(r,i),node=document.createElement("article");node.className="match-card";if(result.winner)node.classList.add("official-result");if(r===4)node.classList.add("champion-card");node.style.left=pos[r][i].x+"px";node.style.top=pos[r][i].y+"px";const meta=document.createElement("div");meta.className="match-meta";meta.innerHTML=`<span>${esc(result.date||rounds[r].dates?.[i]||"TBD")}</span><span>${esc(result.status||(r===0?"R32":"Predict"))}</span>`;node.append(meta,teamRow(r,i,x,sel,Array.isArray(result.score)?result.score[0]:undefined,result),teamRow(r,i,y,sel,Array.isArray(result.score)?result.score[1]:undefined,result));const sb=sourceBlock(result);if(sb)node.append(sb);return node}
function lines(br,g){const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.classList.add("connector-layer");svg.setAttribute("width",g.width);svg.setAttribute("height",g.height);svg.setAttribute("viewBox",`0 0 ${g.width} ${g.height}`);for(let r=0;r<rounds.length-1;r++)for(let i=0;i<rounds[r].count;i++){const m=pos[r][i],n=pos[r+1][Math.floor(i/2)],x1=m.x+g.w,y1=m.y+g.h/2,x2=n.x,y2=n.y+g.h/2,mid=x1+(x2-x1)/2,p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("d",`M ${x1} ${y1} H ${mid} V ${y2} H ${x2}`);p.setAttribute("class","connector-path");svg.append(p)}br.append(svg)}
function render(){cleanInvalidPicks();const wrap=document.querySelector(".bracket-wrap"),br=document.getElementById("bracket"),sl=wrap.scrollLeft,st=wrap.scrollTop,g=geometry();br.innerHTML="";br.style.width=g.width+"px";br.style.height=g.height+"px";lines(br,g);rounds.forEach((round,ri)=>{const title=document.createElement("h2");title.className="round-title";title.id=round.id;title.dataset.round=round.id;title.textContent=round.title;title.style.left=pos[ri][0].x+"px";title.style.top=g.p+"px";br.append(title);for(let i=0;i<round.count;i++)br.append(card(ri,i))});const champ=team(winner(4,0));document.getElementById("championName").textContent=champ?champ.name:"TBD";document.getElementById("selectionCount").textContent=`${activePickCount()+officialCount()} / 31`;wrap.scrollLeft=sl;wrap.scrollTop=st;nav()}
function nav(){const wrap=document.querySelector(".bracket-wrap"),titles=[...document.querySelectorAll(".round-title")];let active=titles[0]?.dataset.round;titles.forEach(t=>{if(t.offsetLeft-60<=wrap.scrollLeft)active=t.dataset.round});document.querySelectorAll(".round-nav button").forEach(b=>b.classList.toggle("active",b.dataset.round===active))}
function scrollRound(id){const w=document.querySelector(".bracket-wrap"),t=document.getElementById(id);if(t)w.scrollTo({left:Math.max(0,t.offsetLeft-12),behavior:"smooth"})}
function setFocus(v){focus=v;document.body.classList.toggle("focus-mode",v);document.getElementById("fullscreenButton").textContent=v?"Exit":"Fullscreen";setTimeout(render,120)}
document.getElementById("resetButton").onclick=()=>{picks={};save();render()};
document.getElementById("fullscreenButton").onclick=async()=>{if(focus){if(document.fullscreenElement&&document.exitFullscreen)await document.exitFullscreen().catch(()=>{});setFocus(false);return}setFocus(true);if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen().catch(()=>{})};
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement&&focus)setFocus(false)});
document.querySelector(".round-nav").onclick=e=>{const b=e.target.closest("button[data-round]");if(b)scrollRound(b.dataset.round)};
document.querySelector(".bracket-wrap").addEventListener("scroll",nav,{passive:true});window.addEventListener("resize",render,{passive:true});render();
