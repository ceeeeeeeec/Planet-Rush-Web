const COLS=11,ROWS=22,GAP=3;
const state={credits:0,mined:0,drillX:.5,auto:true,blocks:[],lastMine:0};
function generatePlanet(){const a=[];for(let y=2;y<ROWS;y++)for(let x=0;x<COLS;x++)if(Math.random()>.1)a.push({x,y,special:Math.random()<.055});return a}
function resetPlanet(){state.blocks=generatePlanet();state.mined=0;render()}
function mineOne(){if(!state.blocks.length){resetPlanet();return}const t=state.blocks.slice().sort((a,b)=>Math.abs((a.x+.5)/COLS-state.drillX)+a.y/ROWS*.15-(Math.abs((b.x+.5)/COLS-state.drillX)+b.y/ROWS*.15))[0];state.blocks=state.blocks.filter(b=>b!==t);state.credits+=t.special?25:5;state.mined++;render()}
function render(){document.querySelector("#root").innerHTML=`
<main class="game"><header class="topbar"><div><span class="label">PLANET</span><strong>01</strong></div><div><span class="label">CREDITS</span><strong class="gold">${state.credits.toLocaleString()}</strong></div><div><span class="label">MINED</span><strong>${state.mined}</strong></div></header>
<section class="viewport" id="viewport"><div class="stars"></div><div class="planet-grid">${state.blocks.map(b=>`<div class="block ${b.special?"special":""}" style="left:${b.x*(100/COLS)}%;top:${b.y*(100/ROWS)}%;width:calc(${100/COLS}% - ${GAP}px);height:calc(${100/ROWS}% - ${GAP}px)"></div>`).join("")}</div>
<div class="drill" style="left:${state.drillX*100}%"><div class="drill-core"></div><div class="beam"></div></div><div class="hint">DRAG TO STEER</div></section>
<footer class="controls"><button id="auto">${state.auto?"AUTO MINING: ON":"AUTO MINING: OFF"}</button><button id="new">NEW PLANET</button></footer></main>`;
document.querySelector("#auto").onclick=()=>{state.auto=!state.auto;render()};document.querySelector("#new").onclick=resetPlanet;
const v=document.querySelector("#viewport");let dragging=false;
const move=e=>{if(!dragging)return;const r=v.getBoundingClientRect();state.drillX=Math.max(.06,Math.min(.94,(e.clientX-r.left)/r.width));render()};
v.onpointerdown=e=>{dragging=true;v.setPointerCapture?.(e.pointerId);move(e)};v.onpointermove=move;v.onpointerup=()=>dragging=false;v.onpointercancel=()=>dragging=false}
state.blocks=generatePlanet();render();
setInterval(()=>{if(state.auto&&Date.now()-state.lastMine>=650){state.lastMine=Date.now();mineOne()}},100);
