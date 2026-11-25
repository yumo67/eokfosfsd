// 薬棚の整理 Shelf Sort — drag medicine off the conveyor into the matching bin.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station } from './pixel-set.js';

const T = {
  ok: { ja: 'OK', en: 'OK', ru: 'ОК' },
  ng: { ja: 'ちがう棚！', en: 'Wrong bin!', ru: 'Не та полка!' },
  drop: { ja: '落とした…', en: 'Dropped…', ru: 'Уронили…' },
  goal: { ja: '整理', en: 'Sorted', ru: 'Разложено' },
  danger: { ja: '劇薬', en: 'TOXIC', ru: 'ЯД' },
  rule: { ja: '赤ラベルは 劇薬の箱へ！', en: 'Red labels go to the TOXIC box!', ru: 'Красные — в ящик ЯД!' },
  hint: { ja: '形で分けて ドラッグ', en: 'Drag by shape', ru: 'Тяните по форме' },
  faster: { ja: 'スピードアップ', en: 'Speed up', ru: 'Быстрее' },
  names: {
    capsule: { ja: 'カプセル', en: 'Capsule', ru: 'Капсулы' }, tablet: { ja: '錠剤', en: 'Tablet', ru: 'Таблетки' },
    bottle: { ja: '水薬', en: 'Bottle', ru: 'Флаконы' }, ointment: { ja: '軟膏', en: 'Ointment', ru: 'Мази' },
  },
};
const COLS = ['milk', 'ink', 'red'];
const BELT_Y = 76;

export default {
  id: 'sort',
  control: 'drag',
  title: { ja: '薬棚の整理', en: 'Shelf Sort', ru: 'Аптечная полка' },
  desc: { ja: '流れてくる薬を、形ごとに正しい棚へ仕分けよう。', en: 'Drag the medicine off the conveyor into the right bins.', ru: 'Перетаскивайте лекарства с ленты в нужные ящики.' },
  how: [
    { ja: 'ベルトの薬をつかんで、同じ形の箱へドラッグ。', en: 'Grab medicine from the belt and drag it to the bin with the same shape.', ru: 'Хватайте лекарство и тяните в ящик той же формы.' },
    { ja: '間違えると減点。落としても減点。', en: 'Wrong bins and drops cost points.', ru: 'Ошибки и падения отнимают очки.' },
    { ja: 'ハードでは、赤ラベルの薬は形に関係なく「劇薬」箱へ。', en: 'On Hard, red-label items go to TOXIC regardless of shape.', ru: 'На сложном красные — в «ЯД», независимо от формы.' },
  ],
  ranks: d => [[550, 890, 1160], [700, 1150, 1500], [690, 1120, 1460]][d - 1],
  create(ctx) {
    let g = ctx.g; const dif = ctx.difficulty, L = ctx.L, R = Math.random;
    const ICACHE = new Map();
    const shapes = dif === 1 ? ['capsule', 'tablet', 'bottle'] : ['capsule', 'tablet', 'bottle', 'ointment'];
    const toxic = dif === 3;
    const bins = shapes.map(s => ({ k: s })); if (toxic) bins.push({ k: 'toxic' });
    const goal = [14, 18, 22][dif - 1];
    let timeLeft = 50 * (ctx.assist ? 1.2 : 1), t = 0, score = 0, combo = 0, sorted = 0, wrong = 0, done = false, success = false;
    let speed = [34, 42, 48][dif - 1], spawnT = 0.3, beltOff = 0, lvl = 0;
    const items = [], parts = [], pops = [], drags = new Map();
    const pop = (x, y, s, c) => pops.push({ x, y, s, c, t: 0 });
    const bw = Math.floor(456 / bins.length);
    bins.forEach((b, i) => { b.x = 12 + i * bw; b.w = bw - 8; b.y = 170; b.h = 84; b.sh = 0; b.glow = 0; });

    function target(it) { if (toxic && it.col === 'red') return 'toxic'; return it.shape; }
    function spawn() {
      const shape = shapes[(R() * shapes.length) | 0];
      const col = COLS[(R() * (toxic ? 3 : 3)) | 0];
      items.push({ shape, col, x: 500, y: BELT_Y, rot: 0, drag: false, vy: 0, fall: false });
    }
    function drawItem(it) {
      const key = it.shape + it.col + (toxic ? 't' : '');
      let c = ICACHE.get(key);
      if (!c) { c = document.createElement('canvas'); c.width = c.height = 48; const og = g; g = c.getContext('2d'); drawItem0({ ...it, x: 24, y: 24, drag: false }); g = og; ICACHE.set(key, c); }
      const x = Math.round(it.x), y = Math.round(it.y);
      if (it.drag) { g.fillStyle = 'rgba(18,16,18,.25)'; g.fillRect(x - 14, y + 19, 28, 3); }
      const sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false; g.drawImage(c, x - 30, y - 30, 60, 60); g.imageSmoothingEnabled = sm;
    }
    function drawItem0(it) {
      const x = Math.round(it.x), y = Math.round(it.y);
      const c = it.col === 'red' ? P.red : it.col === 'ink' ? P.ink2 : P.milk3;
      const c2 = it.col === 'red' ? P.red2 : it.col === 'ink' ? P.ash : P.gray2;
      const ln = it.col === 'ink' ? P.gray2 : P.ink;
      if (it.drag) D.rect(g, x - 10, y + 16, 20, 3, P.ink3);
      if (it.shape === 'capsule') {
        const cB = it.col === 'red' ? P.milk3 : it.col === 'ink' ? P.gray2 : P.gray2;
        const sB = it.col === 'red' ? P.gray3 : it.col === 'ink' ? P.gray : P.gray;
        pill(g, x, y, 30, 6, c, c2, cB, sB, ln);
      } else if (it.shape === 'tablet') {
        D.circle(g, x, y + 2, 10, ln); D.circle(g, x, y + 1, 10, ln); D.circle(g, x, y + 1, 9, c2); D.circle(g, x, y - 1, 9, ln); D.circle(g, x, y - 1, 8, c);
        D.rect(g, x - 6, y - 1, 13, 1, c2); D.rect(g, x - 5, y - 6, 4, 1, P.milk3); D.rect(g, x - 6, y - 5, 1, 2, P.milk3);
      } else if (it.shape === 'bottle') {
        D.panel(g, x - 9, y - 7, 18, 21, { fill: c, line: ln, shadow: null, r: 3 });
        D.rect(g, x - 8, y + 10, 16, 3, c2); D.rect(g, x - 6, y - 5, 2, 13, P.milk3);
        D.rect(g, x - 4, y - 10, 8, 4, ln); D.rect(g, x - 3, y - 9, 6, 2, c2);
        D.rect(g, x - 6, y - 16, 12, 7, ln); D.rect(g, x - 5, y - 15, 10, 5, P.gray2); for (let k = 0; k < 4; k++) D.rect(g, x - 4 + k * 3, y - 15, 1, 5, P.gray);
        D.rect(g, x - 8, y - 1, 16, 9, ln); D.rect(g, x - 7, y, 14, 7, it.col === 'red' ? P.milk3 : P.rose2); D.cross(g, x - 3, y + 3, 1, it.col === 'red' ? P.red : P.red2); D.rect(g, x + 1, y + 2, 5, 1, P.ash2); D.rect(g, x + 1, y + 4, 4, 1, P.ash2);
      } else {
        tube(g, x, y, c, c2, ln);
      }
      if (toxic && it.col === 'red') { D.rect(g, x - 3, y - 16, 6, 3, P.red3); D.rect(g, x - 1, y - 18, 2, 7, P.red3); }
    }
    function binIcon(b) {
      const cx = b.x + b.w / 2, cy = b.y + 44;
      if (b.k === 'toxic') { D.circle(g, cx, cy - 2, 9, P.ink); D.circle(g, cx, cy - 2, 8, P.milk3); D.rect(g, cx - 5, cy - 4, 3, 3, P.ink); D.rect(g, cx + 2, cy - 4, 3, 3, P.ink); D.rect(g, cx - 1, cy, 2, 2, P.ink); D.rect(g, cx - 5, cy + 6, 10, 4, P.milk3); D.stroke(g, cx - 5, cy + 6, 10, 4, P.ink); D.line(g, cx - 12, cy + 12, cx + 12, cy + 18, P.milk3, 3); D.line(g, cx + 12, cy + 12, cx - 12, cy + 18, P.milk3, 3); return; }
      drawItem({ shape: b.k, col: 'milk', x: cx, y: cy });
    }
    function drop(it) {
      it.drag = false;
      const b = bins.find(b => it.x >= b.x - 4 && it.x < b.x + b.w + 4 && it.y >= b.y - 30);
      if (!b) { it.home = true; ctx.sfx('tick'); return; }
      it.dead = true;
      if (b.k === target(it)) {
        combo++; sorted++; const gain = 20 + Math.min(combo, 10) * 3; score += gain; b.glow = 0.4;
        ctx.sfx(combo % 5 === 0 ? 'combo' : 'drop'); pop(b.x + b.w / 2, b.y - 6, `+${gain}`, P.red);
        for (let k = 0; k < 8; k++) parts.push({ x: b.x + b.w / 2, y: b.y + 10, vx: (R() - 0.5) * 80, vy: -40 - R() * 60, l: 0.5, c: k % 2 ? P.milk3 : P.rose2 });
      } else {
        combo = 0; wrong++; score = Math.max(0, score - 15); b.sh = 0.35;
        ctx.sfx('bad'); ctx.shake(3); ctx.vibrate(50); pop(b.x + b.w / 2, b.y - 6, L(T.ng), P.red);
      }
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; timeLeft -= dt; beltOff += speed * dt;
        const nl = Math.floor(t / 12);
        if (nl > lvl) { lvl = nl; speed *= 1.15; pop(240, 40, L(T.faster), P.red); ctx.sfx('whoosh'); }
        spawnT -= dt;
        if (spawnT <= 0) { spawn(); spawnT = Math.max(0.75, 64 / speed) * (0.8 + R() * 0.5); }
        for (const it of items) {
          if (it.drag) continue;
          if (it.home) { it.y = D.lerp(it.y, BELT_Y, Math.min(1, dt * 12)); if (Math.abs(it.y - BELT_Y) < 1) { it.y = BELT_Y; it.home = false; } }
          if (it.fall) { it.vy += 400 * dt; it.y += it.vy * dt; it.x -= 30 * dt; if (it.y > 300) it.dead = true; continue; }
          it.x -= speed * dt;
          if (it.x < 34 && !it.fall) { it.fall = true; it.vy = -40; combo = 0; score = Math.max(0, score - 5); ctx.sfx('bad'); pop(40, 60, L(T.drop), P.gray); }
        }
        for (let i = items.length - 1; i >= 0; i--) if (items[i].dead) { for (const [k, v] of drags) if (v === items[i]) drags.delete(k); items.splice(i, 1); }
        for (const b of bins) { b.sh = Math.max(0, b.sh - dt); b.glow = Math.max(0, b.glow - dt); }
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1) pops.splice(i, 1);
        if (timeLeft <= 0) { timeLeft = 0; done = true; success = sorted >= goal; ctx.sfx(success ? 'win' : 'lose'); }
      },
      draw() {
        // pharmacy back room: wooden-ish gray shelves, conveyor
        station(g,'sort',t);
        // back shelving with stocked medicine
        D.rect(g, 0, 22, 480, 52, P.ash); for (let x = 0; x < 480; x += 96) D.rect(g, x, 22, 3, 52, P.ink3);
        for (let row = 0; row < 2; row++) {
          const sy = 46 + row * 26;
          D.rect(g, 0, sy, 480, 3, P.gray); D.rect(g, 0, sy, 480, 1, P.gray3); D.rect(g, 0, sy + 3, 480, 1, P.ink3);
          for (let i = 0; i < 26; i++) {
            const x = 6 + i * 18 + (row * 7), k = (i * 7 + row * 3) % 5;
            if (k === 0) { D.rect(g, x, sy - 14, 9, 14, P.ink); D.rect(g, x + 1, sy - 13, 7, 13, i % 3 ? P.milk2 : P.rose2); D.rect(g, x + 2, sy - 17, 5, 4, P.ink); D.rect(g, x + 2, sy - 8, 5, 4, P.milk3); D.rect(g, x + 4, sy - 7, 1, 2, P.red); }
            else if (k === 1) { D.rect(g, x, sy - 10, 14, 10, P.ink); D.rect(g, x + 1, sy - 9, 12, 9, P.milk); D.rect(g, x + 1, sy - 9, 12, 2, P.red); D.rect(g, x + 3, sy - 5, 8, 1, P.gray); }
            else if (k === 2) { D.rect(g, x + 1, sy - 12, 7, 12, P.ink); D.rect(g, x + 2, sy - 11, 5, 11, P.gray2); D.rect(g, x + 2, sy - 11, 1, 11, P.milk3); }
            else if (k === 3) { D.rect(g, x, sy - 8, 12, 8, P.ink); D.rect(g, x + 1, sy - 7, 10, 7, P.milk3); D.rect(g, x + 5, sy - 6, 1, 4, P.red); D.rect(g, x + 3, sy - 4, 5, 1, P.red); }
          }
        }
        // conveyor: frame, rubber belt, rollers, legs
        D.rect(g, 14, BELT_Y + 8, 466, 4, P.ink); D.rect(g, 14, BELT_Y + 9, 466, 2, P.gray2);
        D.rect(g, 20, BELT_Y + 12, 460, 14, P.ink3); D.rect(g, 20, BELT_Y + 12, 460, 1, P.ash2);
        for (let x = 20 - Math.floor(beltOff) % 12; x < 480; x += 12) if (x >= 20) { D.rect(g, x, BELT_Y + 13, 1, 12, P.ink); D.rect(g, x + 1, BELT_Y + 13, 1, 12, P.ash); }
        D.rect(g, 14, BELT_Y + 26, 466, 4, P.ink); D.rect(g, 14, BELT_Y + 26, 466, 1, P.gray);
        for (let x = 36; x < 480; x += 40) {
          D.rect(g, x - 2, BELT_Y + 30, 4, 14, P.ink3);
          D.circle(g, x, BELT_Y + 32, 5, P.ink); D.circle(g, x, BELT_Y + 32, 4, P.gray); D.circle(g, x, BELT_Y + 32, 2, P.ash);
          const a = beltOff / 5; D.rect(g, x + Math.round(Math.cos(a) * 3) - 1, BELT_Y + 32 + Math.round(Math.sin(a) * 3) - 1, 2, 2, P.milk3);
        }
        D.rect(g, 10, BELT_Y + 6, 10, 38, P.ink); D.rect(g, 11, BELT_Y + 7, 8, 36, P.red2); D.rect(g, 12, BELT_Y + 8, 2, 34, P.red);
        D.rect(g, 0, BELT_Y + 44, 480, 1, P.ash2);
        // bins
        for (const b of bins) {
          const ox = b.sh > 0 ? Math.round(Math.sin(b.sh * 60) * 3) : 0;
          const tox = b.k === 'toxic', bx = b.x + ox;
          D.panel(g, bx, b.y, b.w, b.h, { fill: tox ? P.red3 : P.gray3, line: P.ink, shadow: P.ash, r: 3 });
          D.rect(g, bx + 2, b.y + 2, b.w - 4, 2, tox ? P.red : P.milk2);
          // label card holder
          D.rect(g, bx + 6, b.y + 4, b.w - 12, 17, P.ink); D.rect(g, bx + 7, b.y + 5, b.w - 14, 15, tox ? P.red : P.milk3); D.rect(g, bx + 7, b.y + 18, b.w - 14, 2, tox ? P.red2 : P.gray3);
          // drawer opening with inner shadow
          D.rect(g, bx + 4, b.y + 24, b.w - 8, b.h - 30, P.ink); D.rect(g, bx + 5, b.y + 25, b.w - 10, b.h - 32, b.glow > 0 ? P.rose2 : tox ? P.red2 : P.gray);
          D.rect(g, bx + 5, b.y + 25, b.w - 10, 6, b.glow > 0 ? P.rose : tox ? P.red3 : P.ash2);
          // front lip + pull handle
          D.rect(g, bx + 2, b.y + b.h - 8, b.w - 4, 6, tox ? P.red2 : P.gray2); D.rect(g, bx + 2, b.y + b.h - 8, b.w - 4, 1, tox ? P.rose : P.milk2);
          D.rect(g, bx + b.w / 2 - 10, b.y + b.h - 6, 20, 2, P.ink); D.rect(g, bx + b.w / 2 - 9, b.y + b.h - 6, 18, 1, P.ash2);
          if (tox) { for (let i = 8; i < b.w - 8; i += 8) { D.rect(g, bx + i, b.y + 25, 4, 2, P.ink); } }
          const nm = b.k === 'toxic' ? L(T.danger) : L(T.names[b.k]);
          D.text(g, nm, b.x + ox + b.w / 2, b.y + 6, { size: 12, color: b.k === 'toxic' ? P.milk3 : P.ink, align: 'center', maxW: b.w - 16 });
          binIcon({ ...b, x: b.x + ox });
        }
        const sortedItems = items.slice().sort((a, b) => (a.drag ? 1 : 0) - (b.drag ? 1 : 0));
        for (const it of sortedItems) drawItem(it);
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 14, { size: 12, color: p.c, align: 'center', shadow: P.milk3 });
        D.panel(g, 360, 130, 110, 22, { fill: P.ink3, line: P.ink, shadow: null, r: 2 });
        D.text(g, `${L(T.goal)} ${sorted}/${goal}`, 415, 135, { size: 12, color: sorted >= goal ? P.rose2 : P.milk, align: 'center' });
        if (t < 5) D.text(g, toxic ? L(T.rule) : L(T.hint), 180, 136, { size: 12, color: toxic ? P.red : P.ash, align: 'center' });
        if (combo >= 3) D.text(g, `×${combo}`, 20, 136, { size: 12, color: P.red });
      },
      down(x, y, id) {
        if (done) return;
        let best = null, bd = 26;
        for (const it of items) { if (it.drag || it.fall) continue; const d = D.dist(x, y, it.x, it.y); if (d < bd) { bd = d; best = it; } }
        if (best) { best.drag = true; best.home = false; drags.set(id, best); ctx.sfx('pick'); best.x = x; best.y = y - 6; }
      },
      move(x, y, id) { const it = drags.get(id); if (it) { it.x = D.clamp(x, 10, 470); it.y = D.clamp(y - 6, 30, 262); } },
      up(x, y, id) { const it = drags.get(id); if (it) { drags.delete(id); drop(it); } },
      state() { return { score, time: Math.ceil(timeLeft), lives: null, progress: Math.min(1, sorted / goal), done, success, label: `${L(T.goal)} ${sorted}/${goal}` }; },
      _dbg() { return { items, bins, target }; },
      destroy() { drags.clear(); },
    };
  },
};

// pixel-perfect stadium capsule: two coloured halves, outline, seam, highlight, bottom shade
function pill(g, cx, cy, len, r, cA, sA, cB, sB, ln) {
  const x0 = cx - len / 2, y0 = cy - r, H = r * 2, W = len;
  const inside = (i, j) => {
    if (i < 0 || j < 0 || i >= W || j >= H) return false;
    const py = j + 0.5 - r; const px = i + 0.5;
    if (px < r) return (px - r) ** 2 + py * py <= r * r;
    if (px > W - r) return (px - (W - r)) ** 2 + py * py <= r * r;
    return true;
  };
  const seam = Math.round(W * 0.48);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    if (!inside(i, j)) continue;
    const edge = !inside(i - 1, j) || !inside(i + 1, j) || !inside(i, j - 1) || !inside(i, j + 1);
    let col;
    if (edge) col = ln;
    else if (i === seam || i === seam + 1) col = i === seam ? ln : (i < seam ? sA : sB);
    else {
      const left = i < seam;
      col = left ? cA : cB;
      if (j >= H - 3) col = left ? sA : sB;
      if (j === 2 && i > 3 && i < W - 4 && i !== seam - 1) col = P.milk3;
      if (j === 3 && (i === 3 || i === seam + 3)) col = P.milk3;
    }
    g.fillStyle = col; g.fillRect(x0 + i, y0 + j, 1, 1);
  }
}
// ointment tube: crimped end, tapered body with label, ribbed cap
function tube(g, cx, cy, c, c2, ln) {
  const x0 = cx - 16;
  // crimp
  for (let j = -5; j <= 5; j++) { g.fillStyle = ln; g.fillRect(x0, cy + j, 4, 1); if (j % 2 === 0) { g.fillStyle = c2; g.fillRect(x0 + 1, cy + j, 2, 1); } }
  // body: half-height grows from 5 to 6 then shoulder
  for (let i = 4; i < 26; i++) {
    const hh = i < 22 ? 5 + (i > 10 ? 1 : 0) : 6 - (i - 21);
    g.fillStyle = ln; g.fillRect(x0 + i, cy - hh - 1, 1, hh * 2 + 3);
    if (i < 25) {
      g.fillStyle = c; g.fillRect(x0 + i, cy - hh, 1, hh * 2 + 1);
      g.fillStyle = c2; g.fillRect(x0 + i, cy + hh - 1, 1, 2);
      if (i > 6 && i < 21) { g.fillStyle = P.milk3; g.fillRect(x0 + i, cy - hh + 1, 1, 1); }
    }
  }
  // label band
  g.fillStyle = c === P.red ? P.milk3 : P.red; g.fillRect(x0 + 9, cy - 2, 9, 4);
  g.fillStyle = c === P.red ? P.red2 : P.milk3; g.fillRect(x0 + 13, cy - 2, 1, 3); g.fillRect(x0 + 12, cy - 1, 3, 1);
  // cap
  g.fillStyle = ln; g.fillRect(x0 + 26, cy - 4, 7, 9);
  g.fillStyle = P.gray2; g.fillRect(x0 + 27, cy - 3, 5, 7);
  g.fillStyle = P.gray; for (let k = 0; k < 3; k++) g.fillRect(x0 + 28 + k * 2, cy - 3, 1, 7);
}
