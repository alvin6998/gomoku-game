const N = 15;
const DNAMES = {1:'初學者', 2:'普通', 3:'困難'};
let CELL = 30, PAD = 30;
let pname, diff, bd, turn, over, t0, tiv, moves;

function $(id){ return document.getElementById(id); }
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

document.querySelectorAll('.diff-btn').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.diff-btn').forEach(x => x.classList.remove('sel'));
  b.classList.add('sel');
}));

$('sbtn').addEventListener('click', () => {
  const nm = $('pname').value.trim();
  if (!nm) { $('nerr').textContent = '請先輸入名字'; return; }
  $('nerr').textContent = '';
  pname = nm;
  diff = parseInt(document.querySelector('.diff-btn.sel').dataset.d);
  initGame();
});

$('replbtn').addEventListener('click', () => show('setup-screen'));

function calcSize() {
  const avail = Math.min(window.innerWidth - 48, 460);
  CELL = Math.max(24, Math.floor(avail / N));
  PAD = CELL;
}

function initGame() {
  bd = Array.from({length: N}, () => new Array(N).fill(0));
  turn = 1; over = false; moves = 0;
  t0 = Date.now();
  clearInterval(tiv);
  tiv = setInterval(() => {
    const e = Math.floor((Date.now() - t0) / 1000);
    $('clk').textContent = `⏱ ${String(Math.floor(e/60)).padStart(2,'0')}:${String(e%60).padStart(2,'0')}`;
  }, 500);
  $('tp').textContent = `⚫ ${pname}`;
  $('tp').className = 'ptag on';
  $('tai').className = 'ptag';
  $('sbar').textContent = '輪到你落子';
  calcSize();
  const c = $('board');
  const sz = CELL * (N - 1) + PAD * 2;
  c.width = sz; c.height = sz;
  c.onclick = onBoardClick;
  show('game-screen');
  draw();
}

function draw() {
  const c = $('board'), ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#f0c060';
  ctx.beginPath();
  ctx.roundRect(0, 0, c.width, c.height, 12);
  ctx.fill();
  ctx.strokeStyle = '#9a6b10'; ctx.lineWidth = 0.8;
  for (let i = 0; i < N; i++) {
    ctx.beginPath(); ctx.moveTo(PAD + i*CELL, PAD); ctx.lineTo(PAD + i*CELL, PAD + (N-1)*CELL); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD, PAD + i*CELL); ctx.lineTo(PAD + (N-1)*CELL, PAD + i*CELL); ctx.stroke();
  }
  ctx.fillStyle = '#9a6b10';
  [[3,3],[3,11],[11,3],[11,11],[7,7],[3,7],[7,3],[11,7],[7,11]].forEach(([r,cc]) => {
    ctx.beginPath(); ctx.arc(PAD + cc*CELL, PAD + r*CELL, 3.5, 0, Math.PI*2); ctx.fill();
  });
  for (let r = 0; r < N; r++)
    for (let cc = 0; cc < N; cc++)
      if (bd[r][cc]) drawPiece(ctx, r, cc, bd[r][cc]);
}

function drawPiece(ctx, r, cc, who) {
  const x = PAD + cc*CELL, y = PAD + r*CELL, rad = CELL * 0.43;
  ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI*2);
  if (who === 1) {
    ctx.fillStyle = '#111'; ctx.fill();
    ctx.strokeStyle = '#555'; ctx.lineWidth = 0.5; ctx.stroke();
    const g = ctx.createRadialGradient(x - rad*0.3, y - rad*0.35, 1, x, y, rad);
    g.addColorStop(0, 'rgba(255,255,255,0.25)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
  } else {
    ctx.fillStyle = '#f0f0f0'; ctx.fill();
    ctx.strokeStyle = '#aaa'; ctx.lineWidth = 0.8; ctx.stroke();
    const g = ctx.createRadialGradient(x - rad*0.3, y - rad*0.35, 1, x, y, rad);
    g.addColorStop(0, 'rgba(255,255,255,0.8)'); g.addColorStop(1, 'rgba(200,200,200,0.1)');
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
  }
}

function onBoardClick(e) {
  if (over || turn !== 1) return;
  const rect = e.target.getBoundingClientRect();
  const cc = Math.round((e.clientX - rect.left - PAD) / CELL);
  const r  = Math.round((e.clientY - rect.top  - PAD) / CELL);
  if (r < 0 || r >= N || cc < 0 || cc >= N || bd[r][cc]) return;
  place(r, cc, 1);
}

function place(r, cc, who) {
  bd[r][cc] = who; moves++;
  draw();
  if (checkWin(r, cc, who)) { endGame(who); return; }
  if (isFull()) { endGame(0); return; }
  if (who === 1) {
    turn = 2; $('tp').className = 'ptag'; $('tai').className = 'ptag on';
    $('sbar').textContent = 'AI 思考中...';
    setTimeout(aiMove, 300);
  } else {
    turn = 1; $('tp').className = 'ptag on'; $('tai').className = 'ptag';
    $('sbar').textContent = '輪到你落子';
  }
}

function checkWin(r, cc, who) {
  for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
    let n = 1;
    for (let d=1; d<5; d++) { const nr=r+dr*d, nc=cc+dc*d; if(nr<0||nr>=N||nc<0||nc>=N||bd[nr][nc]!==who) break; n++; }
    for (let d=1; d<5; d++) { const nr=r-dr*d, nc=cc-dc*d; if(nr<0||nr>=N||nc<0||nc>=N||bd[nr][nc]!==who) break; n++; }
    if (n >= 5) return true;
  }
  return false;
}

function isFull() { return bd.every(row => row.every(v => v !== 0)); }

function score(r, cc, who) {
  let s = 0;
  for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
    let n = 1, op = 0;
    for (let d=1;d<5;d++){const nr=r+dr*d,nc=cc+dc*d;if(nr<0||nr>=N||nc<0||nc>=N||bd[nr][nc]!==who){if(nr>=0&&nr<N&&nc>=0&&nc<N&&bd[nr][nc]===0)op++;break;}n++;}
    for (let d=1;d<5;d++){const nr=r-dr*d,nc=cc-dc*d;if(nr<0||nr>=N||nc<0||nc>=N||bd[nr][nc]!==who){if(nr>=0&&nr<N&&nc>=0&&nc<N&&bd[nr][nc]===0)op++;break;}n++;}
    if(n>=5)s+=100000; else if(n===4&&op>=1)s+=10000; else if(n===4)s+=1000;
    else if(n===3&&op===2)s+=1000; else if(n===3)s+=100;
    else if(n===2&&op===2)s+=50; else if(n===2)s+=10; else if(op>0)s+=2;
  }
  return s;
}

function getCands() {
  const set = new Set();
  const rng = diff >= 3 ? 2 : 1;
  for (let r=0;r<N;r++) for (let cc=0;cc<N;cc++) {
    if (!bd[r][cc]) continue;
    for (let dr=-rng;dr<=rng;dr++) for (let dc=-rng;dc<=rng;dc++) {
      const nr=r+dr, nc=cc+dc;
      if (nr>=0&&nr<N&&nc>=0&&nc<N&&!bd[nr][nc]) set.add(nr*N+nc);
    }
  }
  if (!set.size) set.add(7*N+7);
  return [...set].map(k => [Math.floor(k/N), k%N]);
}

function aiMove() {
  if (over) return;
  const cands = getCands();
  let best = null, bscore = -Infinity;
  if (diff === 1) {
    const empty = [];
    for (let r=0;r<N;r++) for (let cc=0;cc<N;cc++) if (!bd[r][cc]) empty.push([r,cc]);
    best = empty[Math.floor(Math.random() * empty.length)];
  } else {
    const evals = [];
    for (const [r, cc] of cands) {
      bd[r][cc] = 2;
      let s = score(r,cc,2)*1.1 + score(r,cc,1)*0.95;
      if (diff === 3) {
        for (const [pr,pc] of cands) {
          if (bd[pr][pc] || (pr===r&&pc===cc)) continue;
          bd[pr][pc] = 1; s -= score(pr,pc,1)*0.5; bd[pr][pc] = 0;
        }
      }
      bd[r][cc] = 0;
      evals.push([s, r, cc]);
    }
    evals.sort((a, b) => b[0] - a[0]);
    if (diff === 2 && evals[0][0] < 1000) {
      // 普通難度：非關鍵局面時，從前幾名候選中隨機挑一個，降低強度、增加變化
      const pool = evals.slice(0, Math.min(4, evals.length));
      const pick = pool[Math.floor(Math.random() * pool.length)];
      best = [pick[1], pick[2]];
    } else {
      best = [evals[0][1], evals[0][2]];
    }
  }
  if (best) place(best[0], best[1], 2);
}

function endGame(who) {
  over = true; clearInterval(tiv);
  const e = Math.floor((Date.now() - t0) / 1000);
  const ts = `${String(Math.floor(e/60)).padStart(2,'0')}:${String(e%60).padStart(2,'0')}`;
  setTimeout(() => {
    const bg = who===1 ? '#1D9E75' : who===2 ? '#D85A30' : '#888';
    $('rbadge').style.background = bg;
    if (who===1) { $('rbadge').textContent='🏆 你贏了'; $('rtitle').textContent=`${pname} 獲勝！`; $('rsub').textContent='恭喜擊敗 AI！'; }
    else if (who===2) { $('rbadge').textContent='🤖 AI 勝利'; $('rtitle').textContent='AI 獲勝'; $('rsub').textContent='別灰心，再挑戰一局！'; }
    else { $('rbadge').textContent='🤝 平局'; $('rtitle').textContent='平局！'; $('rsub').textContent='棋盤已滿，旗鼓相當！'; }
    $('stime').textContent = ts;
    $('smoves').textContent = moves + ' 手';
    $('sdiff').textContent = DNAMES[diff];
    show('result-screen');
  }, 400);
}
