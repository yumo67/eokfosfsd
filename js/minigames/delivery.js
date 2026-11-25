// 夜間配達 Night Delivery — 3-lane corridor runner. Collect medicine, deliver at lit doors.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station, bezel } from './pixel-set.js';
import { drawEmrys } from '../core/emrys-px.js';

const T = {
  got: { ja: '薬 +1', en: 'Meds +1', ru: 'Лекарство +1' },
  deliv: { ja: 'お届け！', en: 'Delivered!', ru: 'Доставлено!' },
  perfect: { ja: 'ぴったり！', en: 'Spot on!', ru: 'Точно!' },
  empty: { ja: '薬がない', en: 'No meds', ru: 'Нет лекарств' },
  ouch: { ja: 'いたっ', en: 'Ouch', ru: 'Ой' },
  miss: { ja: '通りすぎた…', en: 'Missed…', ru: 'Проехали…' },
  tapDoor: { ja: 'ドアの前で 壁をタップ', en: 'Tap the wall at a lit door', ru: 'Тапните стену у горящей двери' },
  carry: { ja: '所持', en: 'Carrying', ru: 'С собой' },
  goal: { ja: '配達', en: 'Delivered', ru: 'Доставки' },
};
const LANES = [146, 190, 234];
const PX = 92;

export default {
  id: 'delivery',
  control: 'swipe',
  title: { ja: '夜間配達', en: 'Night Delivery', ru: 'Ночная доставка' },
  desc: { ja: '真夜中の廊下を走り、薬を拾って病室へ届けよう。', en: 'Dash down the midnight corridor, grab medicine and deliver it to the rooms.', ru: 'Мчитесь по ночному коридору, собирайте лекарства и разносите их по палатам.' },
  how: [
    { ja: '上下にスワイプ（または上・下をタップ）でレーン移動。', en: 'Swipe up/down (or tap above/below you) to change lanes.', ru: 'Свайп вверх/вниз (или тап выше/ниже) — смена дорожки.' },
    { ja: '薬の箱を拾う。バケツ・車いす・点滴台はよけよう。', en: 'Grab medicine boxes. Dodge buckets, wheelchairs and IV stands.', ru: 'Собирайте коробки. Уклоняйтесь от вёдер, колясок и капельниц.' },
    { ja: 'ランプの灯るドアの前で、壁をタップして配達。', en: 'When a lit door passes you, tap the wall to deliver.', ru: 'Когда горящая дверь рядом, тапните по стене — доставка.' },
  ],
  ranks: d => [[280, 520, 760], [300, 560, 820], [320, 600, 860]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L;
    const R = Math.random;
    let timeLeft = 50, t = 0, score = 0, lives = 3, done = false, success = false;
    let lane = 1, py = LANES[1], carry = 1, delivered = 0, inv = 0, scroll = 0;
    const goal = [3, 4, 5][dif - 1];
    let speed = [95, 115, 135][dif - 1];
    const accel = [1.4, 2.0, 2.8][dif - 1];
    const objs = [], doors = [], parts = [], pops = [];
    let spawnT = 1, doorT = 2.2, doorNum = 401, swipe = null, hint = 5;
    const win = (ctx.assist ? 30 : 22) + (3 - dif) * 4;
    const pop = (x, y, s, c = P.ink) => pops.push({ x, y, s, c, t: 0 });
    const burst = (x, y, n, cols) => { for (let i = 0; i < n; i++) { const a = R() * 6.283, v = 20 + R() * 60; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, l: 0.6, c: cols[i % cols.length] }); } };

    function spawn() {
      const r = R(), ln = (R() * 3) | 0;
      const kind = r < 0.36 ? 'box' : r < 0.6 ? 'bucket' : r < 0.82 ? 'chair' : 'iv';
      if (objs.some(o => o.x > 470 && o.lane === ln)) return;
      objs.push({ kind, lane: ln, y: LANES[ln], x: 500, vx: kind === 'chair' ? -30 - dif * 10 : 0, wt: 1 + R() * 2, w: kind === 'box' ? 14 : kind === 'chair' ? 26 : 16 });
      // guarantee at least one lane free: avoid triple wall
      const near = objs.filter(o => o.x > 470 && o.kind !== 'box').map(o => o.lane);
      if (new Set(near).size >= 3) objs.pop();
    }
    function setLane(n) { n = D.clamp(n, 0, 2); if (n !== lane) { lane = n; ctx.sfx('swish'); } }
    function deliver() {
      if (done) return;
      let best = null;
      for (const d of doors) if (d.req && !d.done && Math.abs(d.x + 18 - PX) < win + 18) if (!best || Math.abs(d.x + 18 - PX) < Math.abs(best.x + 18 - PX)) best = d;
      if (!best) { ctx.sfx('tick'); return; }
      if (carry <= 0) { pop(PX, py - 40, L(T.empty), P.red); ctx.sfx('bad'); return; }
      const off = Math.abs(best.x + 18 - PX);
      best.done = true; carry--; delivered++;
      const perfect = off < 10;
      score += 50 + (perfect ? 25 : 0);
      pop(best.x + 18, 60, perfect ? L(T.perfect) : L(T.deliv), perfect ? P.red : P.ink);
      ctx.sfx(perfect ? 'combo' : 'good'); ctx.vibrate(15); burst(best.x + 18, 80, 12, [P.red, P.milk3, P.rose]);
    }

    function drawPlayer() {
      const x = PX, y = Math.round(py);
      if (inv > 0 && Math.floor(t * 16) % 2) return;
      const fr = Math.floor(t * 10);
      g.fillStyle = 'rgba(18,16,18,.22)'; g.fillRect(x - 16, y, 54, 3);
      // medicine cart pushed ahead
      const cx = x + 8, bump = fr % 2;
      D.rect(g, cx - 3, y - 25, 3, 2, P.ink); D.rect(g, cx - 3, y - 25, 2, 14, P.ink); D.rect(g, cx - 2, y - 24, 1, 12, P.ash2); // handle
      D.rect(g, cx, y - 22 - bump, 26, 3, P.ink); D.rect(g, cx + 1, y - 21 - bump, 24, 1, P.gray2);
      D.rect(g, cx, y - 12 - bump, 26, 3, P.ink); D.rect(g, cx + 1, y - 11 - bump, 24, 1, P.gray2);
      D.rect(g, cx + 1, y - 19 - bump, 2, 10, P.ash); D.rect(g, cx + 23, y - 19 - bump, 2, 10, P.ash);
      D.rect(g, cx + 4, y - 18 - bump, 18, 6, P.milk); D.rect(g, cx + 4, y - 18 - bump, 18, 1, P.ink3); D.rect(g, cx + 12, y - 16 - bump, 3, 1, P.ash);
      D.rect(g, cx + 2, y - 9 - bump, 2, 6, P.ash); D.rect(g, cx + 22, y - 9 - bump, 2, 6, P.ash);
      for (const wx of [cx + 3, cx + 23]) { D.circle(g, wx, y - 2, 2, P.ink); D.rect(g, wx + (fr % 2 ? -1 : 0), y - 2, 1, 1, P.gray); }
      for (let i = 0; i < Math.min(carry, 6); i++) {
        const bx = cx + 2 + (i % 3) * 8, by = y - 29 - bump - ((i / 3) | 0) * 7;
        D.rect(g, bx, by, 7, 7, P.ink); D.rect(g, bx + 1, by + 1, 5, 5, P.milk3); D.rect(g, bx + 1, by + 5, 5, 1, P.gray3);
        D.rect(g, bx + 3, by + 2, 1, 3, P.red); D.rect(g, bx + 2, by + 3, 3, 1, P.red);
      }
      // Emrys behind the cart
      g.save(); g.translate(x - 8, y); g.scale(1.5, 1.5);
      drawEmrys(g, 0, 0, { moving: true, frame: fr, time: t });
      g.restore();
    }

    function drawObj(o) {
      const x = Math.round(o.x), y = Math.round(o.y);
      g.fillStyle = 'rgba(18,16,18,.22)'; g.fillRect(x - o.w / 2 - 3, y, o.w + 6, 3);
      if (o.kind === 'box') {
        const f = Math.sin(t * 5 + o.x * 0.05) * 2 | 0;
        // glow so it reads as a pickup
        if (Math.floor(t * 4) % 2) { D.rect(g, x - 1, y - 27 + f, 2, 3, P.rose2); D.rect(g, x - 12, y - 14 + f, 3, 2, P.rose2); D.rect(g, x + 10, y - 14 + f, 3, 2, P.rose2); }
        D.rect(g, x - 3, y - 22 + f, 6, 3, P.ink); D.rect(g, x - 2, y - 21 + f, 4, 1, P.gray2);
        D.rect(g, x - 9, y - 19 + f, 18, 15, P.ink); D.rect(g, x - 8, y - 18 + f, 16, 13, P.milk3);
        D.rect(g, x - 8, y - 18 + f, 16, 2, P.milk2); D.rect(g, x - 8, y - 7 + f, 16, 2, P.gray3); D.rect(g, x + 6, y - 18 + f, 2, 13, P.gray3);
        D.rect(g, x - 1, y - 16 + f, 3, 9, P.red); D.rect(g, x - 4, y - 13 + f, 9, 3, P.red); D.rect(g, x - 1, y - 16 + f, 1, 2, P.rose);
      } else if (o.kind === 'bucket') {
        // mop bucket with wringer and mop
        D.line(g, x + 3, y - 14, x + 9, y - 40, P.ink, 3); D.line(g, x + 3, y - 14, x + 9, y - 40, P.ash2, 1);
        D.rect(g, x - 10, y - 16, 20, 14, P.ink); D.rect(g, x - 9, y - 15, 18, 12, P.gray);
        D.rect(g, x - 9, y - 15, 18, 2, P.gray3); D.rect(g, x - 9, y - 9, 18, 1, P.ash2); D.rect(g, x + 6, y - 15, 3, 12, P.ash2);
        D.rect(g, x - 8, y - 17, 6, 3, P.ash); D.rect(g, x - 7, y - 17, 4, 1, P.gray2);
        D.rect(g, x - 6, y - 15, 8, 1, P.gray2);
        for (const wx of [x - 7, x + 7]) D.rect(g, wx - 1, y - 2, 3, 2, P.ink);
        D.rect(g, x - 4, y - 25, 10, 6, P.ink); D.rect(g, x - 3, y - 24, 8, 4, P.milk2); D.text(g, '!', x + 1, y - 25, { size: 8, color: P.red, align: 'center' });
      } else if (o.kind === 'chair') {
        const sp = Math.floor(t * 12) % 4;
        D.rect(g, x - 10, y - 32, 3, 18, P.ink); D.rect(g, x - 9, y - 31, 1, 16, P.ash2); D.rect(g, x - 13, y - 33, 6, 2, P.ink);
        D.rect(g, x - 9, y - 28, 6, 12, P.red2); D.rect(g, x - 8, y - 27, 4, 10, P.red);
        D.rect(g, x - 9, y - 18, 20, 4, P.ink); D.rect(g, x - 8, y - 17, 18, 2, P.red); D.rect(g, x - 8, y - 17, 18, 1, P.rose);
        D.rect(g, x - 6, y - 23, 14, 2, P.ink); D.rect(g, x + 8, y - 16, 2, 13, P.ink); D.rect(g, x + 6, y - 4, 6, 2, P.ink);
        D.circle(g, x - 5, y - 8, 8, P.ink); D.circle(g, x - 5, y - 8, 6, P.gray2); D.circle(g, x - 5, y - 8, 4, P.ink3); D.circle(g, x - 5, y - 8, 1, P.gray);
        const a = sp * Math.PI / 4; D.line(g, x - 5 - Math.cos(a) * 5, y - 8 - Math.sin(a) * 5, x - 5 + Math.cos(a) * 5, y - 8 + Math.sin(a) * 5, P.gray);
        D.circle(g, x + 10, y - 2, 2, P.ink); D.rect(g, x + 10, y - 3, 1, 1, P.gray);
      } else {
        const sw = Math.sin(t * 3 + o.wt) * 1.5 | 0;
        D.rect(g, x - 1, y - 44, 3, 42, P.ink); D.rect(g, x, y - 43, 1, 40, P.gray2);
        D.rect(g, x - 7 + sw, y - 46, 15, 2, P.ink); D.rect(g, x - 7 + sw, y - 47, 2, 3, P.ink); D.rect(g, x + 6 + sw, y - 47, 2, 3, P.ink);
        D.rect(g, x - 11, y - 3, 23, 2, P.ink); for (const wx of [x - 10, x, x + 10]) D.rect(g, wx - 1, y - 1, 3, 2, P.ink3);
        D.rect(g, x + 2 + sw, y - 44, 10, 14, P.ink); D.rect(g, x + 3 + sw, y - 43, 8, 12, P.rose2); D.rect(g, x + 3 + sw, y - 37, 8, 6, P.rose); D.rect(g, x + 4 + sw, y - 43, 1, 10, P.milk3);
        D.rect(g, x + 6 + sw, y - 31, 2, 3, P.ink); const dr = ((t * 3) % 1) * 6 | 0; D.rect(g, x + 7 + sw, y - 28 + dr, 1, 1, P.red);
        D.line(g, x + 7 + sw, y - 28, x + 12, y - 10, P.gray2);
      }
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; timeLeft -= dt; inv -= dt; hint -= dt;
        speed += accel * dt;
        scroll += speed * dt;
        py = D.lerp(py, LANES[lane], Math.min(1, dt * 16));
        spawnT -= dt;
        if (spawnT <= 0) { spawn(); spawnT = Math.max(0.42, (1.15 - dif * 0.12) - t * 0.008) * (95 / speed + 0.4); }
        doorT -= dt;
        if (doorT <= 0) { doors.push({ x: 490, num: doorNum++, req: R() < 0.75, done: false, missed: false }); doorT = 2.6 + R() * 1.6; }
        for (const d of doors) {
          d.x -= speed * dt;
          if (d.req && !d.done && !d.missed && d.x + 18 < PX - win - 18) { d.missed = true; pop(PX + 10, 70, L(T.miss), P.gray); }
        }
        for (const o of objs) {
          o.x -= (speed - o.vx) * dt;
          if (o.kind === 'iv') {
            o.wt -= dt;
            if (o.wt <= 0 && o.x > PX + 60) { const nl = D.clamp(o.lane + (R() < 0.5 ? -1 : 1), 0, 2); o.lane = nl; o.wt = 1.2 + R() * 1.5; }
            o.y = D.lerp(o.y, LANES[o.lane], Math.min(1, dt * 2.5));
          }
          if (o.hit) continue;
          const sameLane = Math.abs(o.y - py) < 14;
          if (sameLane && Math.abs(o.x - (PX + 4)) < o.w / 2 + 12) {
            o.hit = true;
            if (o.kind === 'box') { carry = Math.min(6, carry + 1); score += 10; ctx.sfx('pick'); pop(o.x, o.y - 26, L(T.got), P.red2); burst(o.x, o.y - 10, 6, [P.milk3, P.red]); o.gone = true; }
            else if (inv <= 0) {
              lives--; inv = 1.3; carry = Math.max(0, carry - 1); ctx.sfx('bad'); ctx.shake(4); ctx.vibrate(60);
              pop(PX, py - 44, L(T.ouch), P.red); burst(PX, py - 14, 10, [P.gray2, P.ash, P.red]);
              speed = Math.max(80, speed * 0.85);
              if (lives <= 0) { done = true; success = delivered >= goal; ctx.sfx('lose'); }
            }
          }
        }
        for (let i = objs.length - 1; i >= 0; i--) if (objs[i].x < -40 || objs[i].gone) objs.splice(i, 1);
        for (let i = doors.length - 1; i >= 0; i--) if (doors[i].x < -60) doors.splice(i, 1);
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 140 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1) pops.splice(i, 1);
        if (timeLeft <= 0) { timeLeft = 0; done = true; success = delivered >= goal; ctx.sfx(success ? 'win' : 'lose'); }
      },
      draw() {
        // ceiling & wall
        station(g,'delivery',t);
        D.rect(g, 0, 22, 480, 100, P.milk);
        D.rect(g, 0, 22, 480, 10, P.gray2);
        const o1 = Math.floor(scroll * 0.5) % 120;
        for (let x = -o1; x < 500; x += 120) { D.rect(g, x + 30, 22, 40, 4, P.milk3); g.globalAlpha = 0.25; D.rect(g, x + 22, 26, 56, 8, P.milk3); g.globalAlpha = 1; }
        D.rect(g, 0, 90, 480, 32, P.gray3);
        D.rect(g, 0, 90, 480, 1, P.gray);
        const o2 = Math.floor(scroll) % 48;
        for (let x = -o2; x < 500; x += 48) D.rect(g, x, 91, 1, 31, P.gray2);
        D.rect(g, 0, 80, 480, 3, P.ash2); D.rect(g, 0, 83, 480, 1, P.ash); // handrail
        for (let x = -o2; x < 500; x += 96) { D.rect(g, x + 20, 78, 2, 6, P.ash); D.rect(g, x + 70, 78, 2, 6, P.ash); }
        const o3 = Math.floor(scroll * 0.9) % 240;
        for (let x = -o3; x < 520; x += 240) {
          // notice board + hand-wash sign + wall lamp
          D.rect(g, x + 120, 46, 40, 26, P.ink); D.rect(g, x + 121, 47, 38, 24, P.gray2);
          D.rect(g, x + 124, 50, 14, 10, P.milk3); D.rect(g, x + 125, 52, 10, 1, P.gray); D.rect(g, x + 125, 54, 8, 1, P.gray); D.rect(g, x + 130, 49, 2, 2, P.red);
          D.rect(g, x + 141, 52, 14, 15, P.milk2); D.rect(g, x + 146, 55, 3, 9, P.red); D.rect(g, x + 143, 58, 9, 3, P.red); D.rect(g, x + 147, 50, 2, 2, P.ink);
          D.rect(g, x + 200, 40, 10, 4, P.ink); D.rect(g, x + 201, 41, 8, 2, P.milk3);
          g.globalAlpha = 0.25; D.rect(g, x + 196, 44, 18, 20, P.milk3); g.globalAlpha = 1;
        }
        D.rect(g, 0, 117, 480, 5, P.ash2); D.rect(g, 0, 117, 480, 1, P.gray);
        // doors
        for (const d of doors) {
          const x = Math.round(d.x);
          bezel(g,x,38,36,84);
          D.rect(g,x+6,93,24,19,P.gray);D.rect(g,x+7,94,22,1,P.milk2);
          for(let j=0;j<4;j++)D.rect(g,x+8+j*5,97,1,12,P.ash2);
          D.rect(g, x + 4, 44, 28, 76, P.gray);
          D.rect(g, x + 5, 45, 26, 1, P.gray2); D.rect(g, x + 30, 45, 1, 74, P.ash2);
          D.rect(g, x + 9, 49, 18, 18, P.ink); D.rect(g, x + 10, 50, 16, 16, d.done ? P.milk3 : P.ink3);
          if (!d.done) { for (let j = 0; j < 4; j++) D.rect(g, x + 10, 52 + j * 4, 16, 1, P.ash); if (d.req && !d.missed) { D.rect(g, x + 14, 60, 9, 4, P.ash2); D.rect(g, x + 12, 59, 4, 3, P.gray); } }
          else { D.rect(g, x + 11, 51, 4, 2, P.milk2); D.rect(g, x + 14, 60, 9, 4, P.gray2); D.rect(g, x + 12, 59, 4, 3, P.milk); }
          D.rect(g, x + 24, 80, 5, 2, P.ink); D.rect(g, x + 26, 82, 3, 6, P.ink); D.rect(g, x + 27, 82, 1, 4, P.gray2);
          D.rect(g, x + 5, 108, 26, 10, P.ash2); D.rect(g, x + 5, 108, 26, 1, P.gray2);
          D.panel(g, x + 6, 28, 24, 9, { fill: P.milk3, line: P.ash, shadow: null, r: 1 });
          D.text(g, d.num, x + 18, 29, { size: 8, color: P.ink, align: 'center' });
          if (d.req && !d.done && !d.missed) {
            const on = Math.floor(t * 4) % 2;
            D.rect(g, x + 32, 30, 4, 4, on ? P.red : P.red2);
            const near = Math.abs(x + 18 - PX) < win + 18;
            if (near) { D.stroke(g, x - 2, 36, 40, 88, P.red, 2); D.cross(g, x + 18, 58, 3, P.red); }
          }
          if (d.done) D.cross(g, x + 18, 58, 2, P.rose);
        }
        // floor
        D.rect(g, 0, 122, 480, 148, P.gray3);
        D.rect(g, 0, 122, 480, 4, P.ash2);
        for (let i = 0; i < 2; i++) { const y = (LANES[i] + LANES[i + 1]) / 2 | 0; for (let x = -(Math.floor(scroll) % 32); x < 480; x += 32) D.rect(g, x, y, 16, 1, P.gray2); }
        for (let x = -(Math.floor(scroll) % 64); x < 480; x += 64) { g.globalAlpha = 0.5; D.rect(g, x + 8, 128, 30, 2, P.milk3); g.globalAlpha = 1; }
        // sort by y
        const all = objs.map(o => ({ y: o.y, f: () => drawObj(o) }));
        all.push({ y: py + 0.5, f: drawPlayer });
        all.sort((a, b) => a.y - b.y).forEach(e => e.f());
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 16, { size: 12, color: p.c, align: 'center', shadow: P.milk3 });
        // bottom HUD strip
        D.panel(g, 6, 250, 150, 16, { fill: P.ink3, line: P.ink, shadow: null });
        D.text(g, `${L(T.goal)} ${delivered}/${goal}`, 12, 252, { size: 12, color: delivered >= goal ? P.rose2 : P.milk });
        for (let i = 0; i < 3; i++) D.cross(g, 136 + i * 0 - (2 - i) * 9, 258, 2, i < lives ? P.red : P.ash);
        if (hint > 0) D.text(g, L(T.tapDoor), 240, 106, { size: 12, color: P.ink, align: 'center' });
      },
      down(x, y, id) {
        if (done) return;
        if (y < 124) { deliver(); return; }
        swipe = { id, x, y, t: t };
      },
      move(x, y, id) {
        if (!swipe || swipe.id !== id) return;
        const dy = y - swipe.y;
        if (Math.abs(dy) > 18) { setLane(lane + (dy > 0 ? 1 : -1)); swipe.used = true; swipe.y = y; }
      },
      up(x, y, id) {
        if (!swipe || swipe.id !== id) return;
        if (!swipe.used) { if (y < py - 12) setLane(lane - 1); else if (y > py + 4) setLane(lane + 1); }
        swipe = null;
      },
      key(code) { if (code === 'ArrowUp' || code === 'KeyW') setLane(lane - 1); else if (code === 'ArrowDown' || code === 'KeyS') setLane(lane + 1); else if (code === 'Space' || code === 'Enter') deliver(); },
      state() { return { score, time: Math.ceil(timeLeft), lives, progress: Math.min(1, delivered / goal), done, success, label: `${L(T.carry)} ${carry}` }; },
      _dbg() { return { objs, doors, lane, py, carry, win, PX }; },
      destroy() {},
    };
  },
};
