/* script.js – FINAL CLEAN VERSION */

const linesTemplate = [
  "Hey… ❤️",
  "I tried to keep it cool.",
  "But you keep popping into my thoughts 🫶",
  "You make ordinary moments feel special.",
  "So tell me…",
  "Will you be my Valentine? 💖"
];

const typeEl = document.getElementById("typeArea");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const startOverlay = document.getElementById("start");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");
const musicToggle = document.getElementById("musicToggle");
const bgm = document.getElementById("bgm");

let lines = [];
let li = 0, ci = 0;
let heartTimer = null;

/* ---------- HEARTS ---------- */
function spawnHeart(){
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = "❤";
  h.style.left = Math.random()*100 + "vw";
  h.style.fontSize = (12 + Math.random()*24) + "px";
  h.style.color = ["#ff2f5e","#ff6f91","#ff4d6d"][Math.floor(Math.random()*3)];
  document.body.appendChild(h);
  setTimeout(()=>h.remove(), 4000);
}

/* ---------- TYPEWRITER ---------- */
function typeSequence(){
  if(li >= lines.length) return;

  const cur = lines[li];
  if(ci < cur.length){
    typeEl.innerHTML += cur.charAt(ci++);
    setTimeout(typeSequence, 35);
  } else {
    typeEl.innerHTML += "<br/>";
    li++; ci = 0;
    setTimeout(typeSequence, 450);
  }
}

/* ---------- NO BUTTON ---------- */
function runNo(){
  const rx = Math.random()*40 - 20;
  const ry = Math.random()*24 - 12;
  noBtn.style.transform = `translate(${rx}vw, ${ry}vh)`;
  if(navigator.vibrate) navigator.vibrate(10);
}

/* ---------- YES ---------- */
function onYes(){
  if(bgm.paused) bgm.play().catch(()=>{});
  document.body.innerHTML =
    "<h1 style='color:white;text-align:center;margin-top:40vh'>💖 I knew it 😘💖</h1>";
}

/* ---------- START ---------- */
function startLove(){
  const name = (nameInput.value || "").trim();

  lines = linesTemplate.map(l => name ? l.replace("{name}", name) : l);

  // overlay hide
  startOverlay.style.display = "none";

  // 🔊 FORCE MUSIC PLAY (user click ke saath)
  bgm.currentTime = 0;
  bgm.muted = false;
  bgm.volume = 1;

  bgm.play()
    .then(()=>console.log("Music playing"))
    .catch(err=>console.log("Music blocked:", err));

  // typing start
  typeEl.innerHTML = "";
  li = 0; 
  ci = 0;
  typeSequence();

  // hearts start
  if(heartTimer) clearInterval(heartTimer);
  heartTimer = setInterval(spawnHeart, 700);
}


/* ---------- EVENTS ---------- */
startBtn.addEventListener("click", startLove);
yesBtn.addEventListener("click", onYes);
noBtn.addEventListener("mouseover", runNo);
noBtn.addEventListener("touchstart", runNo);
