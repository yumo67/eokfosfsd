// 縫合 Suture — trace the dotted wound line precisely before time runs out.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station, bezel } from './pixel-set.js';

const T = {
  stitch: { ja: '縫合！', en: 'Stitch!', ru: 'Шов!' },
  off: { ja: 'ずれた', en: 'Off line', ru: 'Мимо' },
  done: { ja: '縫合完了', en: 'Closed', ru: 'Зашито' },
  perfect: { ja: '完璧な縫い目', en: 'Perfect seam', ru: 'Идеальный шов' },
  start: { ja: '針から なぞって', en: 'Trace from the needle', ru: 'Ведите от иглы' },
  wound: { ja: '傷', en: 'Wound', ru: 'Рана' },
  acc: { ja: '精度', en: 'ACC', ru: 'ТОЧН' },
  shaky: { ja: '手が ふるえる…', en: 'Hands trembling…', ru: 'Руки дрожат…' },
};

function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function catmull(pts, step) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < 40; k++) {
      const t = k / 40, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  out.push({ ...pts[pts.length - 1] });
  // resample to even spacing
  const res = [out[0]]; let acc = 0;
  for (let i = 1; i < out.length; i++) {
    const a = res[res.length - 1], b = out[i];
    const d = D.dist(a.x, a.y, b.x, b.y);
    acc = d;
    if (acc >= step) { res.push({ x: b.x, y: b.y }); }
  }
  return res;
}

export default {
  id: 'suture',
  control: 'trace',
  title: { ja: '縫合', en: 'Suture', ru: 'Швы' },
  desc: { ja: '点線の傷口を、ふるえる手でなぞって縫い合わせよう。', en: 'Trace the dotted wound to stitch it closed before time runs out.', ru: 'Ведите по пунктиру раны, чтобы зашить её, пока не вышло время.' },
  how: [
    { ja: '針の位置から指をおいて、点線にそってなぞる。', en: 'Touch the needle and trace along the dotted line.', ru: 'Коснитесь иглы и ведите по пунктиру.' },
    { ja: '丸い縫い目を通ると、糸がカチッと留まる。', en: 'Passing a round stitch point locks the thread.', ru: 'Круглые точки шва фиксируют нить.' },
    { ja: '線から外れると精度が下がる。指を離しても続きから再開できる。', en: 'Leaving the line drains accuracy. Lift and resume anytime.', ru: 'Отклонение снижает точность. Можно отпустить и продолжить.' },
    { ja: '難しいほど 線は細く、手もふるえる。', en: 'Harder levels: thinner margin and a shaky hand.', ru: 'На сложности уже допуск и дрожат руки.' },
  ],
  ranks: d => [[400, 650, 820], [640, 1050, 1320], [930, 1520, 1900]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L;
    const R = rng(((Math.random() * 1e9) | 0) + 7);
    const nW = [3, 4, 5][dif - 1];
    const tol = [11, 8, 5.5][dif - 1] * (ctx.assist ? 1.3 : 1);
    const drift = ctx.reduced ? [0, 0.8, 1.6][dif - 1] : [0, 1.6, 3.4][dif - 1];
    let timeLeft = [50, 55, 60][dif - 1] * (ctx.assist ? 1.3 : 1);
    let score = 0, wIdx = 0, done = false, success = false, t = 0, finishedW = 0;
    let path = [], stitches = [], cur = 0, nextSt = 1, acc = 100, accSum = 0;
    let wT = 0, ptr = null, offT = 0, badCd = 0, transition = 0, flash = 0, hintT = 3;
    const parts = [], pops = [];
    const pop = (x, y, s, c = P.ink) => pops.push({ x, y, s, c, t: 0 });
    const burst = (x, y, n, cols) => { for (let i = 0; i < n; i++) { const a = R() * 6.283, v = 20 + R() * 50; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, l: 0.5 + R() * 0.4, c: cols[i % cols.length] }); } };

    function newWound() {
      const k = [3, 4, 5][dif - 1] + Math.min(2, (wIdx / 2) | 0);
      const amp = [28, 42, 56][dif - 1];
      const pts = []; const x0 = 96, x1 = 384, yc = 146;
      const flip = R() < 0.5;
      for (let i = 0; i < k; i++) {
        const fx = i / (k - 1);
        let y = yc + (i === 0 || i === k - 1 ? (R() - 0.5) * amp : (R() - 0.5) * 2 * amp);
        let x = x0 + (x1 - x0) * fx + (i > 0 && i < k - 1 ? (R() - 0.5) * 30 : 0);
        if (dif === 3 && i > 0 && i < k - 1 && R() < 0.3) x -= 28; // hook-back bends
        pts.push({ x: flip ? 480 - x : x, y: D.clamp(y, 64, 228) });
      }
      path = catmull(pts, 2);
      stitches = [];
      const gap = [16, 14, 12][dif - 1];
      for (let i = 0; i < path.length; i += (gap / 2) | 0) stitches.push({ i, done: false });
      if (stitches[stitches.length - 1].i !== path.length - 1) stitches.push({ i: path.length - 1, done: false });
      stitches[0].done = true;
      cur = 0; nextSt = 1; acc = 100; ptr = null; offT = 0; wT = 0;
    }
    newWound();

    function driftAt() { return { x: Math.sin(t * 1.7) * drift + Math.sin(t * 4.3) * drift * 0.4, y: Math.cos(t * 1.3) * drift + Math.sin(t * 3.7 + 1) * drift * 0.5 }; }
    function needle() { const p = path[cur]; return p; }

    function track(x, y) {
      if (transition > 0 || done) return;
      const dr = driftAt(); x += dr.x; y += dr.y;
      ptr.ex = x; ptr.ey = y;
      let best = 1e9, bi = cur;
      const win = Math.min(path.length - 1, cur + 9);
      for (let i = cur; i <= win; i++) { const d = D.dist(x, y, path[i].x, path[i].y); if (d < best) { best = d; bi = i; } }
      ptr.dev = best;
      if (best <= tol) {
        offT = 0;
        if (bi > cur) cur = bi;
        while (nextSt < stitches.length && stitches[nextSt].i <= cur) {
          const s = stitches[nextSt]; s.done = true; nextSt++;
          const q = path[s.i];
          score += Math.round(12 * (acc / 100) ** 2);
          acc = Math.min(100, acc + 1.5);
          ctx.sfx('pop'); burst(q.x, q.y, 4, [P.red, P.rose, P.milk3]);
        }
        if (cur >= path.length - 1) finishWound();
      } else if (best > tol * 1.15) {
        offT += 1 / 60;
        if (badCd <= 0) { ctx.sfx('bad'); ctx.vibrate(20); pop(x, y - 8, L(T.off), P.red); badCd = 0.6; flash = 0.25; burst(x, y, 3, [P.red2, P.red]); }
      }
    }

    function finishWound() {
      finishedW++; accSum += acc;
      const bonus = Math.round(150 * (acc / 100) ** 2 + Math.max(0, 50 - wT * 5));
      score += bonus;
      const q = path[path.length - 1];
      pop(240, 120, acc >= 92 ? L(T.perfect) : L(T.done), acc >= 92 ? P.red : P.ink);
      pop(240, 136, '+' + bonus, P.red2);
      ctx.sfx(acc >= 92 ? 'combo' : 'good'); burst(q.x, q.y, 14, [P.milk3, P.rose2, P.red]);
      ptr = null; transition = 1.0; wIdx++;
      if (wIdx >= nW) { done = true; success = true; ctx.sfx('win'); }
    }

    function drawBg() {
      station(g,'suture',t);
      // tiled floor
      for (let y = 22; y < 270; y += 24) for (let x = (y / 24 % 2) * 12; x < 480; x += 24) D.rect(g, x, y, 12, 12, P.ink3);
      // lamp glow
      for (let r = 0; r < 4; r++) { g.globalAlpha = 0.06 + 0.01 * Math.sin(t * 3); D.circle(g, 240, 146, 210 - r * 30, P.gray3); }
      g.globalAlpha = 1;
      // surgical drape with a window cut out over the forearm
      bezel(g,52,40,376,214,{invert:true});
      D.rect(g,56,44,368,206,P.ash);
      for(let y=46;y<248;y+=6)for(let x=58+((y/6|0)%2)*3;x<422;x+=6)D.rect(g,x,y,1,1,P.ash2);
      // forearm skin, shaded as a cylinder (light from upper left)
      D.panel(g, 72, 52, 336, 190, { fill: P.milk, line: P.ink, shadow: null, r: 8 });
      D.rect(g,76,56,328,10,P.milk2);D.rect(g,80,58,300,3,P.milk3);
      D.dither(g,76,206,328,18,P.gray3,.35,3);D.rect(g,76,224,328,14,P.gray3);D.dither(g,76,230,328,8,P.gray2,.5,5);D.rect(g,78,236,324,2,P.gray2);
      for(let i=0;i<90;i++){const x=82+(i*41)%316,y=64+(i*23)%164;D.rect(g,x,y,i%3?1:2,1,i%7?P.gray3:P.rose2);}
      for(let i=0;i<26;i++){const x=90+(i*67)%300,y=70+(i*37)%150;D.rect(g,x,y,1,1,P.gray2);D.rect(g,x+1,y-1,1,1,P.gray2);}
      // drape clamps at the corners
      for(const [cx,cy] of [[76,56],[404,56],[76,238],[404,238]]){D.circle(g,cx,cy,5,P.ink);D.circle(g,cx,cy,4,P.gray2);D.circle(g,cx,cy,2,P.ash);D.rect(g,cx-2,cy-3,2,1,P.milk3);}
      // iodine stain around the field
      // instrument tray right side bottom
      D.panel(g, 432, 192, 42, 58, { fill: P.gray2, line: P.ink, shadow: P.ink, r: 2 });
      D.line(g, 438, 200, 466, 206, P.ash2, 2); D.rect(g, 436, 214, 30, 2, P.ash); D.circle(g, 450, 230, 5, P.gray3); D.ring(g, 450, 230, 5, P.ash);
    }

    function drawWound() {
      // tolerance band ahead
      for (let i = cur; i < path.length; i += 2) D.rect(g, path[i].x - tol + 1, path[i].y - 1, (tol - 1) * 2, 2, P.gray3);
      // open gash: swollen rose lips, deep red inside
      const sw = 1 + Math.sin(t * 2) * 0.3;
      for (let i = cur; i < path.length; i++) { const p = path[i]; D.circle(g, p.x, p.y, 4, P.rose2); }
      for (let i = cur; i < path.length; i++) { const p = path[i]; D.circle(g, p.x, p.y, 3, P.ink); }
      for (let i = cur; i < path.length; i++) { const p = path[i]; D.circle(g, p.x, p.y, 2, P.red2); }
      for (let i = cur; i < path.length; i++) { const p = path[i]; D.rect(g, p.x - 1, p.y, 2, 1, P.red3); if (i % 9 === 0) D.rect(g, p.x - 1, p.y - 2, 1, 1, P.rose); }
      // blood drops under the open part
      for (let i = cur + 6; i < path.length; i += 23) { const p = path[i]; const d = ((t * 6 + i) % 10) | 0; D.rect(g, p.x, p.y + 3, 2, 2 + (d > 5 ? 1 : 0), P.red); D.rect(g, p.x, p.y + 3, 1, 1, P.rose); }
      // closed part: pink healing line
      for (let i = 0; i < cur; i++) { const p = path[i]; D.rect(g, p.x - 1, p.y - 1, 3, 3, P.rose2); }
      for (let i = 0; i < cur; i++) { const p = path[i]; D.rect(g, p.x - 1, p.y, 2, 1, P.rose); }
      // dotted guide ahead
      for (let i = cur; i < path.length; i += 4) if (((i / 4) | 0) % 2 === 0) D.rect(g, path[i].x - 1, path[i].y - 7, 2, 1, P.ash2);
      // thread behind needle
      for (let i = 1; i <= cur; i++) D.line(g, path[i - 1].x, path[i - 1].y - 1, path[i].x, path[i].y - 1, P.ink3);
      // stitches
      for (const s of stitches) {
        const p = path[s.i];
        if (s.done) {
          const a = s.i > 0 ? Math.atan2(p.y - path[s.i - 1].y, p.x - path[s.i - 1].x) : 0;
          const nx = -Math.sin(a) * 5, ny = Math.cos(a) * 5;
          D.line(g, p.x - nx - 2, p.y - ny, p.x + nx + 2, p.y + ny, P.ink, 2);
          D.rect(g, p.x - nx - 3, p.y - ny - 1, 2, 2, P.ink3); D.rect(g, p.x + nx + 1, p.y + ny - 1, 2, 2, P.ink3);
        } else {
          const nxt = s === stitches[nextSt];
          const pulse = nxt ? (Math.sin(t * 8) > 0 ? 4 : 3) : 2;
          D.circle(g, p.x, p.y, pulse + 1, P.ink); D.circle(g, p.x, p.y, pulse, nxt ? P.milk3 : P.gray2); if (nxt) D.circle(g, p.x, p.y, pulse - 2, P.red);
        }
      }
      void sw;
      // end marker
      const e = path[path.length - 1]; D.cross(g, e.x + 9, e.y - 9, 3, P.red);
    }

    function drawNeedle() {
      const n = needle();
      const px = ptr && ptr.ex != null ? ptr.ex : n.x, py = ptr && ptr.ey != null ? ptr.ey : n.y;
      if (!ptr) { const r = 6 + Math.floor((t * 6) % 4); D.ring(g, n.x, n.y, r, P.red); }
      if (ptr && ptr.dev > tol) D.line(g, px, py, n.x, n.y, P.rose, 1);
      // thread trailing back to the last stitch
      D.line(g, px, py, px - 6, py + 6, P.ink3);
      // curved surgical needle held in a needle driver
      const arc = [[0,0],[1,-2],[2,-4],[4,-6],[6,-7],[9,-8],[12,-8]];
      for (const [ax,ay] of arc) { D.rect(g, px + ax - 1, py + ay - 1, 3, 3, P.ink); }
      for (const [ax,ay] of arc) { D.rect(g, px + ax, py + ay, 1, 1, P.gray2); }
      D.rect(g, px, py, 1, 1, P.milk3); D.rect(g, px + 2, py - 4, 1, 1, P.milk3);
      // driver jaws + shanks + finger rings
      D.line(g, px + 10, py - 9, px + 30, py - 25, P.ink, 3); D.line(g, px + 13, py - 7, px + 33, py - 21, P.ink, 3);
      D.line(g, px + 10, py - 9, px + 30, py - 25, P.gray2, 1); D.line(g, px + 13, py - 7, px + 33, py - 21, P.gray, 1);
      D.rect(g, px + 9, py - 11, 6, 5, P.ink); D.rect(g, px + 10, py - 10, 4, 3, P.ash2);
      D.ring(g, px + 34, py - 29, 5, P.ink, 2); D.ring(g, px + 38, py - 22, 5, P.ink, 2);
      D.ring(g, px + 34, py - 29, 4, P.gray2); D.ring(g, px + 38, py - 22, 4, P.gray2);
      D.rect(g, px + 20, py - 18, 3, 3, P.red);
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; badCd -= dt; flash = Math.max(0, flash - dt); hintT -= dt;
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1) pops.splice(i, 1);
        if (transition > 0) { transition -= dt; if (transition <= 0 && !done) newWound(); return; }
        timeLeft -= dt; wT += dt;
        if (ptr && ptr.dev > tol) acc = Math.max(0, acc - dt * (8 + (ptr.dev - tol) * 1.2));
        if (ptr && ptr.ex != null && drift > 0) track(ptr.x, ptr.y);
        if (timeLeft <= 0) { timeLeft = 0; done = true; success = finishedW >= Math.ceil(nW * 0.6); ctx.sfx(success ? 'win' : 'lose'); }
      },
      draw() {
        drawBg();
        if (transition <= 0 || transition > 0.6) drawWound();
        if (!done && transition <= 0) drawNeedle();
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 14, { size: 12, color: p.c, align: 'center', shadow: P.milk3 });
        // accuracy meter (left)
        D.panel(g, 14, 60, 22, 150, { fill: P.ink3, line: P.ink, shadow: null });
        const h = Math.round(140 * acc / 100);
        D.rect(g, 18, 205 - h, 14, h, acc < 40 ? P.red : acc < 70 ? P.rose : P.milk);
        for (let y = 70; y < 205; y += 14) D.rect(g, 18, y, 3, 1, P.ash);
        D.text(g, L(T.acc), 25, 214, { size: 8, color: P.gray2, align: 'center' });
        // wound counter
        D.text(g, `${L(T.wound)} ${Math.min(wIdx + 1, nW)}/${nW}`, 240, 28, { size: 12, color: P.milk, align: 'center', shadow: P.ink });
        for (let i = 0; i < nW; i++) D.rect(g, 240 - nW * 6 + i * 12 + 2, 44, 8, 3, i < wIdx ? P.red : P.ash);
        if (hintT > 0 && wIdx === 0 && cur === 0) D.text(g, L(T.start), 240, 246, { size: 12, color: P.ink, align: 'center' });
        if (drift > 1 && wIdx === 0 && t < 4) D.text(g, L(T.shaky), 400, 28, { size: 8, color: P.rose, align: 'center' });
        if (flash > 0) { g.globalAlpha = flash * 1.2; D.rect(g, 0, 22, 480, 248, P.red3); g.globalAlpha = 1; }
      },
      down(x, y, id) {
        if (done || transition > 0) return;
        const n = needle();
        const dr = driftAt();
        if (D.dist(x + dr.x, y + dr.y, n.x, n.y) <= Math.max(18, tol * 2.2)) { ptr = { id, x, y, dev: 0 }; ctx.sfx('pick'); track(x, y); }
        else { pop(n.x, n.y - 14, '↓', P.red); ctx.sfx('tick'); }
      },
      move(x, y, id) { if (ptr && ptr.id === id) { ptr.x = x; ptr.y = y; track(x, y); } },
      up(x, y, id) { if (ptr && ptr.id === id) ptr = null; },
      state() {
        return { score, time: Math.ceil(timeLeft), lives: null, progress: (wIdx + (transition > 0 ? 0 : cur / path.length)) / nW, done, success, label: `${L(T.acc)} ${Math.round(acc)}%` };
      },
      _dbg() { return { path, cur, drift: driftAt(), tol, transition }; },
      destroy() {},
    };
  },
};
