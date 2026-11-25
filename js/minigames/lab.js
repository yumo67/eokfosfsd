// 調合 Lab — water-sort logic puzzle with patterned liquids (color-blind friendly).
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station } from './pixel-set.js';

const T = {
  undo: { ja: '戻す', en: 'Undo', ru: 'Назад' },
  reset: { ja: '最初から', en: 'Reset', ru: 'Сброс' },
  solved: { ja: '調合成功！', en: 'Mixed!', ru: 'Готово!' },
  no: { ja: '注げない', en: "Can't pour", ru: 'Нельзя' },
  moves: { ja: '手数', en: 'Moves', ru: 'Ходы' },
  rx: { ja: '処方', en: 'Rx', ru: 'Рецепт' },
  hint: { ja: '試験管をタップ → 注ぐ先をタップ', en: 'Tap a tube, then tap where to pour', ru: 'Тапните пробирку, затем куда лить' },
};
const CAP = 4;
// liquids: base color + pattern for accessibility
const LIQ = [
  { c: P.red, p: 'none', k: P.red2 },
  { c: P.milk3, p: 'none', k: P.gray2 },
  { c: P.gray2, p: 'hstripe', k: P.gray },
  { c: P.rose, p: 'dots', k: P.milk3 },
  { c: P.ash2, p: 'vstripe', k: P.gray },
  { c: P.red3, p: 'check', k: P.rose },
  { c: P.rose2, p: 'diag', k: P.rose },
];

function canPour(a, b) {
  if (!a.length || b.length >= CAP) return false;
  return !b.length || b[b.length - 1] === a[a.length - 1];
}
function pour(a, b) { const c = a[a.length - 1]; let n = 0; while (a.length && a[a.length - 1] === c && b.length < CAP) { b.push(a.pop()); n++; } return n; }
function isSolved(ts) { return ts.every(t => !t.length || (t.length === CAP && t.every(x => x === t[0]))); }

// Build by random reverse pours from the solved state: each reverse step is the
// exact inverse of a legal forward pour, so the puzzle is always solvable.
function generate(colors, empties, R) {
  for (let attempt = 0; attempt < 60; attempt++) {
    const ts = [];
    for (let c = 0; c < colors; c++) ts.push(new Array(CAP).fill(c));
    for (let e = 0; e < empties; e++) ts.push([]);
    let last = null;
    for (let step = 0; step < 400; step++) {
      const A = (R() * ts.length) | 0, B = (R() * ts.length) | 0;
      if (A === B) continue;
      const a = ts[A], b = ts[B];
      if (!a.length || b.length >= CAP) continue;
      const c = a[a.length - 1];
      // remaining A after removal must accept c back (top == c or empty)
      if (a.length > 1 && a[a.length - 2] !== c) continue;
      // B's top must differ so forward pour moves exactly this unit
      if (b.length && b[b.length - 1] === c) continue;
      if (last && last[0] === B && last[1] === A) continue;
      b.push(a.pop()); last = [A, B];
    }
    // quality: few already-complete tubes, empties mostly used
    const complete = ts.filter(t => t.length === CAP && t.every(x => x === t[0])).length;
    const mixed = ts.filter(t => new Set(t).size >= 2).length;
    if (complete === 0 && mixed >= Math.min(colors, 3)) {
      // shuffle tube order
      for (let i = ts.length - 1; i > 0; i--) { const j = (R() * (i + 1)) | 0; [ts[i], ts[j]] = [ts[j], ts[i]]; }
      return ts;
    }
  }
  const ts = []; for (let c = 0; c < colors; c++) ts.push([c, (c + 1) % colors, c, (c + 1) % colors]);
  for (let e = 0; e < empties; e++) ts.push([]); return ts;
}

export default {
  id: 'lab',
  control: 'tap',
  title: { ja: '調合', en: 'Lab Mix', ru: 'Лаборатория' },
  desc: { ja: '試験管の薬液を注ぎ分けて、同じ薬を一本ずつそろえよう。', en: 'Pour the liquids between tubes until each holds a single medicine.', ru: 'Переливайте жидкости, пока в каждой пробирке не останется одно лекарство.' },
  how: [
    { ja: '試験管をタップして選び、注ぐ先の試験管をタップ。', en: 'Tap a tube to pick it, then tap the target tube.', ru: 'Тапните пробирку, затем пробирку-цель.' },
    { ja: '同じ薬の上か、空の試験管にだけ注げる。', en: 'You can pour only onto the same liquid or into an empty tube.', ru: 'Лить можно только на такую же жидкость или в пустую.' },
    { ja: '模様（しま・点）でも薬を見分けられる。', en: 'Patterns (stripes, dots) help tell liquids apart.', ru: 'Узоры (полосы, точки) помогают различать жидкости.' },
    { ja: '少ない手数・短い時間ほど高得点。「戻す」も使える。', en: 'Fewer moves and less time score higher. Undo is free-ish.', ru: 'Меньше ходов и времени — больше очков. Есть «Назад».' },
  ],
  ranks: [360, 620, 820],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L, R = Math.random;
    const plan = [[3, 3, 4], [3, 4, 5], [4, 5, 6]][dif - 1];
    let timeLeft = 75 * (ctx.assist ? 1.3 : 1), t = 0, score = 0, done = false, success = false;
    let pi = 0, tubes = [], start = [], hist = [], sel = -1, moves = 0, pt = 0, trans = 0, solvedN = 0;
    const parts = [], pops = [], streams = [];
    let shakeTube = -1, shakeT = 0;
    const pop = (x, y, s, c = P.milk3) => pops.push({ x, y, s, c, t: 0 });

    function load() {
      const nc = plan[pi];
      tubes = generate(nc, 2, R); start = tubes.map(x => x.slice()); hist = []; sel = -1; moves = 0; pt = 0;
    }
    load();
    const UH = 18;
    function layout(i) {
      const n = tubes.length, sp = Math.min(56, Math.floor(440 / n));
      const x = Math.round(240 - (n * sp) / 2 + i * sp + sp / 2 - 12);
      return { x, y: 92, w: 24, h: CAP * UH + 14 };
    }
    const UNDO = { x: 12, y: 232, w: 72, h: 28 }, RESET = { x: 396, y: 232, w: 72, h: 28 };
    const inR = (r, x, y) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;

    function drawUnit(x, y, w, h, li, seed) {
      const q = LIQ[li];
      D.rect(g, x, y, w, h, q.c);
      g.fillStyle = q.k;
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        let on = false;
        if (q.p === 'hstripe') on = j % 4 === 1;
        else if (q.p === 'vstripe') on = i % 4 === 1;
        else if (q.p === 'dots') on = i % 4 === 1 && j % 4 === 1;
        else if (q.p === 'check') on = (i + j) % 6 === 0 && j % 3 === 0;
        else if (q.p === 'diag') on = (i + j) % 5 === 0;
        if (on) g.fillRect(x + i, y + j, 1, 1);
      }
      D.rect(g, x, y, w, 1, q.k);
    }

    function drawTube(i) {
      const r = layout(i); let { x, y, w, h } = r;
      if (i === sel) y -= 10;
      if (i === shakeTube && shakeT > 0) x += Math.round(Math.sin(shakeT * 60) * 2);
      const tb = tubes[i];
      g.fillStyle = 'rgba(18,16,18,.35)'; g.fillRect(x + 3, y + h + 1, w, 3);
      // glass tube: outline, faint tint, U-bottom
      g.fillStyle = P.ink; D.roundFill(g, x - 2, y - 1, w + 4, h + 3, 10);
      g.fillStyle = P.ash; D.roundFill(g, x - 1, y, w + 2, h + 1, 9);
      g.fillStyle = P.ink2; D.roundFill(g, x, y, w, h, 8);
      D.rect(g, x - 2, y - 1, w + 4, 14, P.ink); D.rect(g, x - 1, y - 1, w + 2, 14, P.ash); D.rect(g, x, y - 1, w, 14, P.ink2);
      const ix = x + 3, iw = w - 6;
      for (let k = 0; k < tb.length; k++) {
        const uy = y + h - 4 - (k + 1) * UH;
        drawUnit(ix, uy, iw, UH, tb[k], k);
      }
      // rounded bottom of the liquid
      D.rect(g, ix, y + h - 5, 2, 2, P.ink2); D.rect(g, ix + iw - 2, y + h - 5, 2, 2, P.ink2); D.rect(g, ix, y + h - 6, 1, 1, P.ink2); D.rect(g, ix + iw - 1, y + h - 6, 1, 1, P.ink2);
      // meniscus on the top layer
      if (tb.length) { const ty = y + h - 4 - tb.length * UH; D.rect(g, ix + 1, ty, iw - 2, 1, P.milk3); D.rect(g, ix, ty + 1, 1, 1, P.milk3); D.rect(g, ix + iw - 1, ty + 1, 1, 1, P.milk3); g.globalAlpha = .35; D.rect(g, ix, ty - 1, iw, 1, P.gray2); g.globalAlpha = 1; }
      // bubbles rising through the liquid
      if (tb.length && !ctx.reduced) for (let b = 0; b < 3; b++) { const span = tb.length * UH - 4; const by = y + h - 6 - ((t * (10 + b * 4) + i * 13 + b * 17) % span); D.rect(g, ix + 2 + ((i * 5 + b * 6) % (iw - 4)), Math.round(by), b === 1 ? 2 : 1, b === 1 ? 2 : 1, P.milk3); }
      // glass highlights + graduation marks
      g.globalAlpha = .75; D.rect(g, x + 2, y + 5, 2, h - 16, P.milk3); D.rect(g, x + 2, y + h - 9, 2, 2, P.milk3); g.globalAlpha = .35; D.rect(g, x + w - 4, y + 8, 1, h - 20, P.milk3); g.globalAlpha = 1;
      for (let k = 1; k < CAP; k++) D.rect(g, x + w - 7, y + h - 4 - k * UH, 4, 1, P.gray);
      // flared lip
      D.rect(g, x - 4, y - 3, w + 8, 4, P.ink); D.rect(g, x - 3, y - 2, w + 6, 2, i === sel ? P.red : P.gray2); D.rect(g, x - 3, y - 2, w + 6, 1, i === sel ? P.rose : P.milk3);
      const full = tb.length === CAP && tb.every(c => c === tb[0]);
      if (full) { D.rect(g, x + 4, y - 7, w - 8, 6, P.gray); D.rect(g, x + 5, y - 7, w - 10, 1, P.gray3); }
      if (i === sel) D.text(g, '▼', x + w / 2, y - 22, { size: 12, color: P.red, align: 'center' });
    }

    function tap(x, y) {
      if (inR(UNDO, x, y)) { if (hist.length) { tubes = hist.pop(); moves++; sel = -1; ctx.sfx('whoosh'); } else ctx.sfx('tick'); return; }
      if (inR(RESET, x, y)) { tubes = start.map(a => a.slice()); hist = []; sel = -1; moves += 2; ctx.sfx('whoosh'); return; }
      let hit = -1;
      for (let i = 0; i < tubes.length; i++) { const r = layout(i); if (x >= r.x - 10 && x < r.x + r.w + 10 && y >= r.y - 30 && y < r.y + r.h + 24) hit = i; }
      if (hit < 0) { sel = -1; return; }
      if (sel < 0) { if (tubes[hit].length) { sel = hit; ctx.sfx('pick'); } else ctx.sfx('tick'); return; }
      if (hit === sel) { sel = -1; ctx.sfx('click'); return; }
      const a = tubes[sel], b = tubes[hit];
      if (!canPour(a, b)) { shakeTube = hit; shakeT = 0.3; pop(layout(hit).x + 12, layout(hit).y - 14, L(T.no), P.rose); ctx.sfx('bad'); sel = -1; return; }
      hist.push(tubes.map(z => z.slice()));
      const li = a[a.length - 1];
      pour(a, b); moves++;
      const ra = layout(sel), rb = layout(hit);
      streams.push({ x0: ra.x + 12, y0: ra.y - 12, x1: rb.x + 12, y1: rb.y, c: LIQ[li].c, l: 0.3 });
      for (let k = 0; k < 6; k++) parts.push({ x: rb.x + 12, y: rb.y + 4, vx: (R() - 0.5) * 40, vy: -R() * 50, l: 0.4, c: LIQ[li].c });
      ctx.sfx('drop'); sel = -1;
      const tb = tubes[hit];
      if (tb.length === CAP && tb.every(c => c === tb[0])) { ctx.sfx('pop'); for (let k = 0; k < 10; k++) parts.push({ x: rb.x + 12, y: rb.y - 4, vx: (R() - 0.5) * 80, vy: -30 - R() * 60, l: 0.7, c: k % 2 ? P.milk3 : P.rose2 }); }
      if (isSolved(tubes)) solve();
    }

    function solve() {
      const nc = plan[pi], par = nc * 3 + 2;
      const ms = Math.max(0, 120 - 5 * Math.max(0, moves - par));
      const ts = Math.max(0, Math.round((nc * 9 - pt) * 2));
      const gain = 120 + ms + ts;
      score += gain; solvedN++;
      pop(240, 60, L(T.solved), P.red); pop(240, 76, '+' + gain, P.milk3);
      ctx.sfx('win'); ctx.vibrate(30);
      trans = 1.2;
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; shakeT -= dt;
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const s of streams) s.l -= dt;
        for (let i = streams.length - 1; i >= 0; i--) if (streams[i].l <= 0) streams.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1.2) pops.splice(i, 1);
        if (trans > 0) { trans -= dt; if (trans <= 0) { pi++; if (pi >= plan.length) { done = true; success = true; score += Math.round(timeLeft * 2); } else load(); } return; }
        timeLeft -= dt; pt += dt;
        if (timeLeft <= 0) { timeLeft = 0; done = true; success = solvedN >= 2; ctx.sfx(success ? 'win' : 'lose'); }
      },
      draw() {
        // lab wall with shelves and jars
        station(g,'lab',t);
        for (let y = 22; y < 200; y += 16) for (let x = (y % 32 ? 0 : 16); x < 480; x += 32) D.rect(g, x, y, 31, 15, P.ink3);
        D.rect(g, 0, 50, 480, 3, P.ash); D.rect(g, 0, 53, 480, 2, P.ink);
        for (let i = 0; i < 9; i++) { const x = 20 + i * 52, h = 12 + (i * 7) % 12; D.panel(g, x, 50 - h, 16, h, { fill: i % 3 ? P.ash : P.red3, line: P.ink, shadow: null, r: 2 }); D.rect(g, x + 2, 52 - h, 2, h - 6, P.ash2); D.rect(g, x + 3, 46 - h, 10, 4, P.ink); D.rect(g, x + 4, 47 - h, 8, 2, P.gray); D.rect(g, x + 4, 50 - h + 4, 8, 5, P.milk2); D.rect(g, x + 5, 50 - h + 6, 6, 1, P.gray); if (i % 4 === 1) { D.circle(g, x + 30, 46, 4, P.ink); D.circle(g, x + 30, 46, 3, P.gray); D.rect(g, x + 29, 38, 3, 6, P.ink); } }
        // lamp glow
        g.globalAlpha = 0.07; for (let r = 0; r < 3; r++) D.circle(g, 240, 140, 150 + r * 40, P.milk); g.globalAlpha = 1;
        // bench
        D.rect(g, 0, 204, 480, 66, P.ash); D.rect(g, 0, 204, 480, 3, P.gray); D.rect(g, 0, 207, 480, 1, P.ink3);
        for(let i=8;i<480;i+=21){D.rect(g,i,211,13,1,P.gray);D.rect(g,i+3,214,5,1,P.ash2);}
        // rack
        const r0 = layout(0), rn = layout(tubes.length - 1);
        const rw = rn.x - r0.x + 48;
        D.rect(g, r0.x - 13, 120, 4, 88, P.ink); D.rect(g, rn.x + 33, 120, 4, 88, P.ink); D.rect(g, r0.x - 12, 121, 2, 86, P.gray); D.rect(g, rn.x + 34, 121, 2, 86, P.gray);
        D.rect(g, r0.x - 12, 146, rw, 5, P.ink); D.rect(g, r0.x - 11, 147, rw - 2, 2, P.gray2);
        D.rect(g, r0.x - 12, 180, rw, 6, P.gray2); D.rect(g, r0.x - 12, 186, rw, 2, P.ink);
        for (let i = 0; i < tubes.length; i++) drawTube(i);
        D.rect(g, r0.x - 13, 195, rw + 2, 11, P.ink); D.rect(g, r0.x - 12, 196, rw, 9, P.gray); D.rect(g, r0.x - 12, 196, rw, 2, P.gray3); D.rect(g, r0.x - 12, 203, rw, 2, P.ash2);
        for (let i = 0; i < tubes.length; i++) { const r = layout(i); D.rect(g, r.x + 6, 199, 12, 4, P.milk3); D.rect(g, r.x + 6, 199, 12, 1, P.gray2); D.text(g, String.fromCharCode(65 + i), r.x + 12, 197, { size: 8, color: P.ash, align: 'center' }); }
        D.rect(g, r0.x - 10, 205, 4, 4, P.ink); D.rect(g, rn.x + 30, 205, 4, 4, P.ink);
        for (const s of streams) { D.line(g, s.x0, s.y0, s.x1, s.y1 - 2, s.c, 2); }
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        // buttons
        for (const [b, lab, ic] of [[UNDO, T.undo, '↶'], [RESET, T.reset, '⟲']]) {
          D.panel(g, b.x, b.y, b.w, b.h, { fill: P.milk2, line: P.ink, shadow: P.ink, r: 3 });
          D.text(g, L(lab), b.x + b.w / 2, b.y + 8, { size: 12, color: P.ink, align: 'center' });
        }
        // info card
        D.panel(g, 150, 232, 180, 28, { fill: P.ink3, line: P.ink, shadow: null, r: 3 });
        D.text(g, `${L(T.rx)} ${Math.min(pi + 1, plan.length)}/${plan.length}   ${L(T.moves)} ${moves}`, 240, 240, { size: 12, color: P.milk, align: 'center' });
        if (pi === 0 && moves === 0) { D.panel(g, 110, 56, 260, 18, { fill: P.ink2, line: P.ink, shadow: null, r: 3 }); } if (pi === 0 && moves === 0) D.text(g, L(T.hint), 240, 59, { size: 12, color: P.gray2, align: 'center' });
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 14, { size: 12, color: p.c, align: 'center', shadow: P.ink });
        if (trans > 0) { g.globalAlpha = Math.max(0, 0.5 - trans * 0.3); D.rect(g, 0, 22, 480, 248, P.milk3); g.globalAlpha = 1; }
      },
      down(x, y) { if (!done && trans <= 0) tap(x, y); },
      move() {}, up() {},
      key(code) { if (code === 'KeyZ' || code === 'Backspace') tap(UNDO.x + 1, UNDO.y + 1); },
      state() { return { score, time: Math.ceil(timeLeft), lives: null, progress: solvedN / plan.length, done, success, label: `${L(T.moves)} ${moves}` }; },
      _dbg() { return { tubes, layout, trans }; },
      destroy() {},
    };
  },
};
