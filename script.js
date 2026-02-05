/* script.js - polished behavior with personalization, sounds, hearts, confetti, share/copy */
const linesTemplate = [
  "Hey… ❤️",
  "I tried to keep it cool.",
  "But you keep popping into my thoughts 🫶",
  "You make ordinary moments feel special.",
  "So tell me…",
  "Will you be my Valentine? 💖"
];

const typeEl = document.getElementById('typeArea');
const yesBtn = document.getElementById('yes');
const noBtn = document.getElementById('no');
const startOverlay = document.getElementById('start');
const startBtn = document.getElementById('startBtn');
const nameInput = document.getElementById('nameInput');
const musicToggle = document.getElementById('musicToggle');
const bgm = document.getElementById('bgm');

const finalControls = document.getElementById('finalControls');
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyBtn');
const restartBtn = document.getElementById('restartBtn');

let lines = [];         // actual lines (after personalization)
let li = 0, ci = 0;     // line index, char index
let typing = false;
let heartTimer = null;

// helper: create short beep using WebAudio (works without external files)
function playBeep(freq=440, duration=80, type='sine'){
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = 0.06;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(()=>{ o.stop(); ctx.close(); }, duration);
  } catch(e){ /* ignore if blocked */ }
}

// spawn floating heart element
function spawnHeart(){
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = '❤';
  h.style.left = Math.random()*100 + 'vw';
  h.style.fontSize = (12 + Math.random()*24) + 'px';
  h.style.color = ["#ff2f5e","#ff6f91","#ff4d6d"][Math.floor(Math.random()*3)];
  document.body.appendChild(h);
  setTimeout(()=>h.remove(), 4200);
}

// confetti burst (many hearts)
function burstHearts(n=30){
  for(let i=0;i<n;i++){
    setTimeout(()=>spawnHeart(), i*20);
  }
}

// typewriter: prints letters, supports placeholder for {name}
function typeSequence(){
  if(li >= lines.length){ typing = false; return; }
  typing = true;
  const curLine = lines[li];
  if(ci < curLine.length){
    const ch = curLine.charAt(ci++);
    typeEl.innerHTML += (ch === ' ' ? '&nbsp;' : escapeHtml(ch));
    setTimeout(typeSequence, 32 + Math.random()*28);
  } else {
    typeEl.innerHTML += '<br/>';
    li++; ci = 0;
    setTimeout(typeSequence, 420);
  }
}

// escape simple html characters
function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// "No" button play & move
function runNo(){
  // move randomly within viewport portion
  const rx = (Math.random()*40 - 20);
  const ry = (Math.random()*24 - 12);
  noBtn.style.transform = `translate(${rx}vw, ${ry}vh)`;
  playBeep(260, 60, 'triangle'); // playful sound
  if(navigator.vibrate) navigator.vibrate(10);
}

// when user clicks Yes
function onYes(){
  playBeep(880, 120, 'sine');
  burstHearts(50);
  if(navigator.vibrate) navigator.vibrate([30,20,30]);
  showFinal();
}

// show final screen with personalized message and controls
function showFinal(){
  // big final message
  document.querySelector('.card').style.opacity = '0';
  setTimeout(()=>{
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#ff9aa8,#ffb3c6);padding:20px;">
        <div style="max-width:520px;background:rgba(255,255,255,0.9);padding:28px;border-radius:20px;text-align:center;">
          <h1 style="margin:0 0 10px;font-size:28px">💖 It's a yes! 💖</h1>
          <p style="color:#444;margin:0 0 18px">${buildFinalText()}</p>
          <div style="display:flex;gap:12px;justify-content:center">
            <button id="shareNow" style="padding:10px 16px;border-radius:12px;border:0;background:#ff4d6d;color:#fff;font-weight:700">Share</button>
            <button id="copyNow" style="padding:10px 16px;border-radius:12px;border:0;background:#eee">Copy</button>
            <button id="homeNow" style="padding:10px 16px;border-radius:12px;border:0;background:#fff">Back</button>
          </div>
        </div>
      </div>`;
    // bind
    document.getElementById('shareNow').addEventListener('click', shareFinal);
    document.getElementById('copyNow').addEventListener('click', ()=>{ copyText(buildFinalText()); alert('Copied!') });
    document.getElementById('homeNow').addEventListener('click', ()=>location.reload());
  }, 260);
}

// build final personalized text (used for copy/share)
function buildFinalText(){
  const name = (nameInput.value || '').trim();
  if(name) return `Hey ${name}, you said yes! 💖 I can't stop smiling — will cherish every moment with you.`;
  return `You said yes! 💖 I can't stop smiling — will cherish every moment with you.`;
}

// share via Web Share API or clipboard fallback
function shareFinal(){
  const txt = buildFinalText();
  if(navigator.share){
    navigator.share({title:'A special moment', text: txt, url: location.href}).catch(()=>copyText(txt));
  } else {
    copyText(txt); alert('Message copied to clipboard. Share it with your app!');
  }
}

// copy helper
function copyText(t){
  if(navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(t);
  } else {
    const ta = document.createElement('textarea');
    ta.value = t; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); ta.remove();
  }
}

// On initial start action
function startLove(){
  const name = (nameInput.value || '').trim();
  // build personalized lines: replace {name} if present in template
  lines = linesTemplate.map(l=>{
    return name ? l.replace(/\{name\}/g, name) : l;
  });
  // hide overlay
  startOverlay.style.display = 'none';
  // play music if toggled
  if(musicToggle.checked){
    // start bgm on user interaction
    bgm.play().catch(()=>{ /* ignore */});
  }
  // begin Typewriter, hearts
  typeEl.innerHTML = '';
  li = 0; ci = 0;
  typeSequence();
  heartTimer = setInterval(spawnHeart, 650);
}

// keyboard shortcuts / accessibility
document.addEventListener('keydown', (e)=>{
  if(e.key === 'y' || e.key === 'Y') onYes();
  if(e.key === 'n' || e.key === 'N') runNo();
});

// event bindings
noBtn.addEventListener('mouseover', runNo);
noBtn.addEventListener('touchstart', (e)=>{ e.preventDefault(); runNo(); });
yesBtn.addEventListener('click', onYes);
startBtn.addEventListener('click', startLove);

// share/copy/restart (main UI - if used)
if(shareBtn) shareBtn.addEventListener('click', shareFinal);
if(copyBtn) copyBtn.addEventListener('click', ()=>{ copyText(buildFinalText()); alert('Copied message') });
if(restartBtn) restartBtn.addEventListener('click', ()=>location.reload());

// Close overlay on body tap (after initial start to let user close easily)
document.body.addEventListener('click', function onAnyClick(){
  if(startOverlay.style.display !== 'none'){
    // do nothing here to avoid accidental start; we only allow explicit start via button
  } else {
    document.body.removeEventListener('click', onAnyClick);
  }
});
let lines = [...];
let li = 0, ci = 0;
function typeSequence(){
  if(li >= lines.length) return;
  const cur = lines[li];
  if(ci < cur.length){
    typeEl.innerHTML += cur.charAt(ci++);
    setTimeout(typeSequence, 30 + Math.random()*30);
  } else {
    typeEl.innerHTML += '<br/>';
    li++; ci = 0;
    setTimeout(typeSequence, 420);
  }
}
function runNo(){
  const rx = (Math.random()*40 - 20);
  const ry = (Math.random()*24 - 12);
  noBtn.style.transform = `translate(${rx}vw, ${ry}vh)`;
}
document.getElementById('startBtn').addEventListener('click', startLove);
function startLove(){
  startOverlay.style.display='none';
  if(musicToggle.checked) bgm.play().catch(()=>{});
  typeSequence();
  setInterval(spawnHeart, 650);
}
