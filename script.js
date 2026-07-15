const N = 15;
const DNAMES = {1:'初學者', 2:'普通', 3:'困難'};
let CELL = 30, PAD = 30;
let pname, diff, bd, turn, over, t0, tiv, moves;

function $(id){ return document.getElementById(id); }
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// 深色模式：讀取先前的設定，沒有的話跟隨系統偏好
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
})();

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    $('themeBtn').textContent = '☀️ 淺色模式';
  } else {
    document.documentElement.removeAttribute('data-theme');
    $('themeBtn').textContent = '🌙 深色模式';
  }
  localStorage.setItem('theme', theme);
}

$('themeBtn').addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light' : 'dark');
});

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

const AI_PATTERN_SCORES = {
  five: 1000000, openFour: 100000, closedFour: 15000, doubleFour: 120000,
  openThree: 8000, brokenThree: 3500, openTwo: 400
};
const DIRECTIONS = [[0,1],[1,0],[1,1],[1,-1]];

function makeMove(r, cc, who, state) { bd[r][cc] = who; if(state)state.hash^=ZOBRIST[r][cc][who]; return [r,cc,who]; }
function undoMove([r,cc,who], state) { bd[r][cc] = 0; if(state)state.hash^=ZOBRIST[r][cc][who]; }
function withMove(r, cc, who, fn, state) { const move=makeMove(r,cc,who,state); try { return fn(); } finally { undoMove(move,state); } }
function inBounds(r, cc) { return r >= 0 && r < N && cc >= 0 && cc < N; }
function lineThrough(r, cc, dr, dc, who) {
  let line='';
  for(let step=-4;step<=4;step++) { const nr=r+dr*step,nc=cc+dc*step; line+=!inBounds(nr,nc)?'#':bd[nr][nc]===who?'X':bd[nr][nc]===0?'.':'#'; }
  return line;
}
function hasPattern(line, pattern) {
  for(let i=0;i<=line.length-pattern.length;i++) if(line.slice(i,i+pattern.length)===pattern && i<=4 && 4<i+pattern.length)return true;
  return false;
}
function evaluateDirection(r, cc, dr, dc, who) {
  const line=lineThrough(r,cc,dr,dc,who);
  if(hasPattern(line,'XXXXX'))return {score:AI_PATTERN_SCORES.five,four:false};
  if(hasPattern(line,'.XXXX.'))return {score:AI_PATTERN_SCORES.openFour,four:true};
  if(hasPattern(line,'XXXX.')||hasPattern(line,'.XXXX'))return {score:AI_PATTERN_SCORES.closedFour,four:true};
  if(hasPattern(line,'.XXX.'))return {score:AI_PATTERN_SCORES.openThree,four:false};
  if(hasPattern(line,'.XX.X.')||hasPattern(line,'.X.XX.'))return {score:AI_PATTERN_SCORES.brokenThree,four:false};
  if(hasPattern(line,'.XX.'))return {score:AI_PATTERN_SCORES.openTwo,four:false};
  return {score:0,four:false};
}
function score(r, cc, who) {
  let total=0,fours=0;
  for(const [dr,dc] of DIRECTIONS) { const result=evaluateDirection(r,cc,dr,dc,who); total+=result.score; fours+=Number(result.four); }
  return total+(fours>=2?AI_PATTERN_SCORES.doubleFour:0);
}

const AI_TIME_LIMITS = { 1: 50, 2: 300, 3: 800 };
const AI_MAX_CANDIDATES = 10;
const WIN_SCORE = 100000000;
const ZOBRIST = createZobristTable();

function createZobristTable() {
  let seed=0x9e3779b9;
  const next=()=>{ seed^=seed<<13; seed^=seed>>>17; seed^=seed<<5; return BigInt(seed>>>0); };
  return Array.from({length:N},()=>Array.from({length:N},()=>[0n,next(),next()]));
}
function hashBoard() {
  let hash=0n;
  for(let r=0;r<N;r++)for(let cc=0;cc<N;cc++)if(bd[r][cc])hash^=ZOBRIST[r][cc][bd[r][cc]];
  return hash;
}

function getCands(limit = AI_MAX_CANDIDATES, who = 2) {
  const set = new Set();
  for (let r=0;r<N;r++) for (let cc=0;cc<N;cc++) {
    if (!bd[r][cc]) continue;
    for (let dr=-2;dr<=2;dr++) for (let dc=-2;dc<=2;dc++) {
      const nr=r+dr, nc=cc+dc;
      if (nr>=0&&nr<N&&nc>=0&&nc<N&&!bd[nr][nc]) set.add(nr*N+nc);
    }
  }
  if (!set.size) return bd[7][7] ? [] : [[7,7]];
  return [...set].map(k => [Math.floor(k/N), k%N])
    .sort((a,b) => moveOrderScore(b[0],b[1],who) - moveOrderScore(a[0],a[1],who)).slice(0, limit);
}

function moveOrderScore(r, cc, who) {
  const attack=withMove(r,cc,who,()=>score(r,cc,who));
  const defend=withMove(r,cc,3-who,()=>score(r,cc,3-who));
  return attack*1.1+defend;
}
function boardKey(who, state) { return who+':'+state.hash.toString(16); }
function evaluateBoard() {
  return getCands(AI_MAX_CANDIDATES,2).reduce((total,[r,cc]) => total+moveOrderScore(r,cc,2)-moveOrderScore(r,cc,1),0);
}
function findTacticalMove(who) {
  for (const [r,cc] of getCands(225,who)) if(withMove(r,cc,who,()=>checkWin(r,cc,who))) return [r,cc];
  return null;
}
function terminalScore(depth, whoJustMoved) { return whoJustMoved===2 ? WIN_SCORE+depth : -WIN_SCORE-depth; }
function useTransposition(table, key, depth, alpha, beta) {
  const entry=table.get(key);
  if(!entry || entry.depth<depth) return {entry,alpha,beta,hit:false};
  if(entry.flag==='exact') return {entry,alpha,beta,hit:true};
  if(entry.flag==='lower') alpha=Math.max(alpha,entry.score); else beta=Math.min(beta,entry.score);
  return {entry,alpha,beta,hit:alpha>=beta};
}
function moveId(r, cc) { return r*N+cc; }
function createSearchContext() {
  return { killers:Array.from({length:12},()=>[]), history:Array.from({length:3},()=>new Array(N*N).fill(0)) };
}
function rememberCutoff(context, depth, r, cc, who) {
  const killers=context.killers[depth]||[];
  if(!killers.some(move=>move[0]===r&&move[1]===cc)) killers.unshift([r,cc]);
  context.killers[depth]=killers.slice(0,2);
  context.history[who][moveId(r,cc)]+=depth*depth;
}
function orderMoves(cands, cachedMove, context, depth, who) {
  const killers=context.killers[depth]||[], history=context.history[who];
  const rank=([r,cc])=>{
    if(cachedMove&&r===cachedMove[0]&&cc===cachedMove[1])return 1e12;
    const killer=killers.findIndex(move=>move[0]===r&&move[1]===cc);
    return (killer<0?0:1e10-killer*1e8)+history[moveId(r,cc)];
  };
  return cands.sort((a,b)=>rank(b)-rank(a));
}
function cacheResult(table, key, depth, score, move, alpha, beta) {
  const flag=score<=alpha?'upper':score>=beta?'lower':'exact';
  return table.set(key,{depth,score,move,flag}).get(key);
}
function isBetter(score, bestScore, who) { return who===2 ? score>bestScore : score<bestScore; }
function searchPvsMove(r, cc, who, depth, alpha, beta, isFirst, table, deadline, state, context) {
  const search=(a,b)=>withMove(r,cc,who,()=>minimax(depth-1,a,b,3-who,[r,cc],table,deadline,state,context),state);
  if(isFirst) return search(alpha,beta);
  let result=who===2 ? search(alpha,alpha+1) : search(beta-1,beta);
  const needsFullWindow=who===2 ? result.score>alpha&&result.score<beta : result.score<beta&&result.score>alpha;
  if(needsFullWindow) result=search(alpha,beta);
  return result;
}

function minimax(depth, alpha, beta, who, lastMove, table, deadline, state, context) {
  if (performance.now() >= deadline) throw new Error('AI_TIMEOUT');
  if (lastMove && checkWin(lastMove[0],lastMove[1],3-who)) return {score:terminalScore(depth,3-who),move:null};
  if (!depth || isFull()) return {score:evaluateBoard(),move:null};
  const key=boardKey(who,state), cached=useTransposition(table,key,depth,alpha,beta);
  if(cached.hit) return cached.entry;
  alpha=cached.alpha; beta=cached.beta;
  const alphaStart=alpha,betaStart=beta; let bestScore=who===2?-Infinity:Infinity,bestMove=null;
  const cands=orderMoves(getCands(AI_MAX_CANDIDATES,who),cached.entry?.move,context,depth,who);
  for(let i=0;i<cands.length;i++) {
    const [r,cc]=cands[i];
    const result=searchPvsMove(r,cc,who,depth,alpha,beta,i===0,table,deadline,state,context);
    if(isBetter(result.score,bestScore,who)){bestScore=result.score;bestMove=[r,cc];}
    if(who===2) alpha=Math.max(alpha,bestScore); else beta=Math.min(beta,bestScore);
    if(alpha>=beta) { rememberCutoff(context,depth,r,cc,who); break; }
  }
  return cacheResult(table,key,depth,bestScore,bestMove,alphaStart,betaStart);
}

function aiMove() {
  if(over)return;
  let best=findTacticalMove(2)||findTacticalMove(1);
  if(!best) {
    const deadline=performance.now()+AI_TIME_LIMITS[diff], table=new Map();
    const state={hash:hashBoard()}, context=createSearchContext();
    for(let depth=1;depth<=10&&performance.now()<deadline;depth++) {
      try { const result=minimax(depth,-Infinity,Infinity,2,null,table,deadline,state,context); if(result.move)best=result.move; }
      catch(err) { if(err.message!=='AI_TIMEOUT')throw err; break; }
    }
  }
  if(best)place(best[0],best[1],2);
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
