/* Mini Pacman-ODS (simplificado)
   - Player: quadrado controlado por setas
   - Itens: bolinhas coloridas espalhadas; ao coletar, pontua e mostra contador
   Estrutura leve para rodar direto em public/index.html
*/
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const TILE = 32;
const COLS = Math.floor(canvas.width / TILE);
const ROWS = Math.floor(canvas.height / TILE);

let player = { x: 1, y: 1, size: TILE-6, color: '#ffd166' };
let items = [];
let score = 0;

function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

function placeItems(n=12){
  items = [];
  const colors = ['#ef476f','#06d6a0','#118ab2','#ffd166','#073b4c'];
  while(items.length < n){
    const x = randInt(1, COLS-2);
    const y = randInt(1, ROWS-2);
    // avoid placing on player
    if(x === player.x && y === player.y) continue;
    // avoid duplicates
    if(items.some(it => it.x===x && it.y===y)) continue;
    items.push({x,y,radius:8,color: colors[items.length % colors.length]});
  }
  document.getElementById('remaining').innerText = items.length;
}

function drawGrid(){
  ctx.strokeStyle = '#0b2740';
  for(let i=0;i<=COLS;i++){
    ctx.beginPath();
    ctx.moveTo(i*TILE,0);
    ctx.lineTo(i*TILE,canvas.height);
    ctx.stroke();
  }
  for(let j=0;j<=ROWS;j++){
    ctx.beginPath();
    ctx.moveTo(0,j*TILE);
    ctx.lineTo(canvas.width,j*TILE);
    ctx.stroke();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // background grid
  drawGrid();
  // draw items
  for(const it of items){
    const cx = it.x * TILE + TILE/2;
    const cy = it.y * TILE + TILE/2;
    ctx.beginPath();
    ctx.fillStyle = it.color;
    ctx.arc(cx, cy, it.radius, 0, Math.PI*2);
    ctx.fill();
  }
  // draw player (square)
  const px = player.x * TILE + (TILE - player.size)/2;
  const py = player.y * TILE + (TILE - player.size)/2;
  ctx.fillStyle = player.color;
  roundRect(ctx, px, py, player.size, player.size, 6, true, false);
}

function roundRect(ctx, x, y, w, h, r, fill, stroke){
  if (typeof r === 'undefined') r = 5;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}

function collectCheck(){
  for(let i=items.length-1;i>=0;i--){
    const it = items[i];
    if(it.x === player.x && it.y === player.y){
      items.splice(i,1);
      score += 10;
      document.getElementById('score').innerText = score;
      document.getElementById('remaining').innerText = items.length;
    }
  }
}

function move(dx,dy){
  player.x = Math.max(0, Math.min(COLS-1, player.x + dx));
  player.y = Math.max(0, Math.min(ROWS-1, player.y + dy));
  collectCheck();
  draw();
  if(items.length === 0){
    setTimeout(()=> alert('Parabéns! Você coletou todos os itens ODS. Pontuação: ' + score), 100);
  }
}

window.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowLeft') move(-1,0);
  if(e.key === 'ArrowRight') move(1,0);
  if(e.key === 'ArrowUp') move(0,-1);
  if(e.key === 'ArrowDown') move(0,1);
});

document.getElementById('restart').addEventListener('click', ()=>{
  score = 0;
  document.getElementById('score').innerText = score;
  player.x = 1; player.y = 1;
  placeItems(14);
  draw();
});

// initialize
placeItems(14);
draw();
