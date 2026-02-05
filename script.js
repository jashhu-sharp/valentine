const lines = [
  "Hey… ❤️",
  "I tried to keep it cool.",
  "But you keep popping into my thoughts 🫶",
  "You make ordinary moments feel special.",
  "So tell me…",
  "Will you be my Valentine? 💖"
];

const el = document.getElementById("type");
const bgm = document.getElementById("bgm");
let li=0, ci=0;

function type(){
  if(li < lines.length){
    if(ci < lines[li].length){
      el.innerHTML += lines[li][ci++];
      setTimeout(type, 36);
    } else {
      el.innerHTML += "<br/>";
      li++; ci=0;
      setTimeout(type, 520);
    }
  }
}
type();

// subtle auto-play after first interaction safety
document.body.addEventListener("click",()=>bgm.play(),{once:true});

function runNo(){
  const b=document.getElementById("no");
  const x=(Math.random()*240)-120;
  const y=(Math.random()*140)-70;
  b.style.transform=`translate(${x}px,${y}px)`;
  if(navigator.vibrate) navigator.vibrate(10);
}

function burst(n=24){
  for(let i=0;i<n;i++){
    const h=document.createElement("div");
    h.className="heart";
    h.textContent="❤";
    h.style.left=Math.random()*100+"vw";
    h.style.bottom="-20px";
    h.style.fontSize=(14+Math.random()*22)+"px";
    h.style.color=["#ff2f5e","#ff6f91","#ff4d6d"][i%3];
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),4500);
  }
}

function onYes(){
  burst(42);
  document.body.innerHTML=
    "<div class='end'><h1>💖 I knew it 😘</h1><p>Thank you for choosing us.</p></div>";
  if(navigator.vibrate) navigator.vibrate([20,40,20]);
}
