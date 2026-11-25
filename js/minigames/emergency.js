// 緊急呼出 Emergency Call — rapid 3-second microgames that keep speeding up.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station, bezel } from './pixel-set.js';
import { blob } from './art.js';

const T = {
  ok: { ja: 'セーフ！', en: 'Safe!', ru: 'Успел!' },
  ng: { ja: 'アウト…', en: 'Missed…', ru: 'Провал…' },
  faster: { ja: 'スピードアップ！', en: 'Speed up!', ru: 'Быстрее!' },
  call: { ja: '呼出', en: 'Call', ru: 'Вызов' },
  hold: { ja: '長押し→離す', en: 'Hold → release', ru: 'Держи → отпусти' },
  find: { ja: 'さがす:', en: 'Find:', ru: 'Найди:' },
};
const MG = {
  phone: { ja: 'でて！', en: 'ANSWER!', ru: 'ОТВЕТЬ!' },
  curtain: { ja: 'あけて！', en: 'OPEN!', ru: 'ОТКРОЙ!' },
  defib: { ja: 'ためて！', en: 'CHARGE!', ru: 'ЗАРЯДИ!' },
  bandage: { ja: 'はって！', en: 'BANDAGE!', ru: 'ПЕРЕВЯЖИ!' },
  redcross: { ja: 'えらんで！', en: 'FIND IT!', ru: 'НАЙДИ!' },
  rub: { ja: 'こすって！', en: 'RUB!', ru: 'ТРИ!' },
  beds: { ja: 'かぞえて！', en: 'COUNT!', ru: 'СОСЧИТАЙ!' },
};
const KINDS = Object.keys(MG);

export default {
  id: 'emergency',
  control: 'mixed',
  title: { ja: '緊急呼出', en: 'Emergency Call', ru: 'Срочный вызов' },
  desc: { ja: '次々に鳴る呼出に、3秒以内で対応しよう。', en: 'Handle a rapid string of 3-second emergencies.', ru: 'Справьтесь с чередой трёхсекундных вызовов.' },
  how: [
    { ja: '画面に出る指示を見て、すぐ動こう。', en: 'Read the flashing order and act fast.', ru: 'Читайте команду и действуйте быстро.' },
    { ja: 'タップ・スワイプ・長押し・ドラッグ、全部使う。', en: 'Tap, swipe, hold and drag — all of them.', ru: 'Тап, свайп, удержание и перетаскивание.' },
    { ja: '失敗するとライフが減る。3回でおしまい。', en: 'Each miss costs a life. Three and you’re out.', ru: 'Ошибка отнимает жизнь. Три — конец.' },
  ],
  ranks: d => [[700, 1150, 1550], [850, 1450, 1950], [1000, 1650, 2250]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L, R = Math.random;
    const total = [12, 14, 15][dif - 1];
    let sp = [1, 1.12, 1.25][dif - 1];
    let lives = 3, score = 0, done = false, success = false, t = 0, n = 0;
    let phase = 'intro', pt = 0, dur = 0, cur = null, lastKind = '', res = null, flash = 0;
    const parts = [], pops = [];
    const pop = (x, y, s, c) => pops.push({ x, y, s, c, t: 0 });
    const burst = (x, y, k, cols) => { for (let i = 0; i < k; i++) { const a = R() * 6.283, v = 30 + R() * 70; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, l: 0.6, c: cols[i % cols.length] }); } };
    const lenient = ctx.assist ? 1.3 : 1;

    function make(kind) {
      const m = { kind, res: null };
      if (kind === 'phone') {
        const k = dif === 3 || n > 6 ? 2 : 1;
        m.ph = []; for (let i = 0; i < k; i++) m.ph.push({ x: 90 + ((R() * 300) | 0), y: 80 + ((R() * 130) | 0), ring: i === 0 });
        if (k === 2 && D.dist(m.ph[0].x, m.ph[0].y, m.ph[1].x, m.ph[1].y) < 70) m.ph[1].x = (m.ph[0].x + 200) % 380 + 60;
        m.down = (x, y) => { for (const p of m.ph) if (D.dist(x, y, p.x, p.y) < 26 * lenient) { m.res = p.ring; burst(p.x, p.y, 8, [P.red, P.milk3]); return; } };
      } else if (kind === 'curtain') {
        m.open = 0; m.drag = null;
        m.down = (x, y) => { m.drag = x; }; m.move = (x) => { if (m.drag != null) { m.open = Math.min(1, m.open + Math.abs(x - m.drag) / (220 / lenient)); m.drag = x; if (m.open >= 1) m.res = true; } };
        m.up = () => { m.drag = null; };
      } else if (kind === 'defib') {
        m.c = 0; m.on = false; m.lo = 0.5 + R() * 0.3; m.hw = (0.11 - dif * 0.015) * lenient;
        m.down = () => { m.on = true; ctx.sfx('beep'); };
        m.up = () => { if (!m.on) return; m.on = false; m.res = Math.abs(m.c - m.lo) <= m.hw; if (m.res) { ctx.shake(3); burst(240, 140, 14, [P.milk3, P.rose2]); } };
        m.update = dt => { if (m.on) { m.c += dt * 0.55 * (1 + (sp - 1) * 0.5); if (m.c > 1) { m.c = 1; m.res = false; } } };
      } else if (kind === 'bandage') {
        m.tx = 160 + ((R() * 220) | 0); m.ty = 112 + ((R() * 44) | 0); m.bx = 92; m.by = 214; m.drag = false;
        m.down = (x, y) => { if (D.dist(x, y, m.bx, m.by) < 34) m.drag = true; };
        m.move = (x, y) => { if (m.drag) { m.bx = x; m.by = y; } };
        m.up = () => { if (!m.drag) return; m.drag = false; if (D.dist(m.bx, m.by, m.tx, m.ty) < 18 * lenient) { m.res = true; m.bx = m.tx; m.by = m.ty; } else { m.bx = 92; m.by = 214; ctx.sfx('tick'); } };
      } else if (kind === 'redcross') {
        const cols = dif === 1 ? 4 : 5, rows = dif === 3 ? 3 : 2; m.cells = [];
        const ans = (R() * cols * rows) | 0;
        for (let i = 0; i < cols * rows; i++) m.cells.push({ x: 240 - cols * 30 + 30 + (i % cols) * 60, y: 96 + ((i / cols) | 0) * 52 + (rows === 2 ? 22 : 0), k: i === ans ? 0 : 1 + ((R() * 4) | 0) });
        m.down = (x, y) => { for (const c of m.cells) if (Math.abs(x - c.x) < 26 && Math.abs(y - c.y) < 24) { m.res = c.k === 0; burst(c.x, c.y, 6, [c.k ? P.ash : P.red, P.milk3]); return; } };
      } else if (kind === 'rub') {
        m.w = 0; m.lx = null; m.dir = 0;
        m.down = x => { m.lx = x; }; m.up = () => { m.lx = null; };
        m.move = x => { if (m.lx == null) return; const dx = x - m.lx; m.lx = x; m.w = Math.min(1, m.w + Math.abs(dx) / (520 / lenient)); const d = Math.sign(dx); if (d && d !== m.dir) { m.dir = d; ctx.sfx('swish'); } if (m.w >= 1) m.res = true; };
      } else if (kind === 'beds') {
        m.k = 2 + ((R() * (dif + 3)) | 0); const opts = new Set([m.k]); while (opts.size < 3) opts.add(Math.max(1, m.k + ((R() * 5) | 0) - 2));
        m.opts = [...opts].sort((a, b) => a - b); m.bed = [];
        const slots = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => R() - 0.5).slice(0, m.k);
        for (const s of slots) m.bed.push({ x: 74 + (s % 4) * 92, y: 76 + ((s / 4) | 0) * 56, pat: R() < 0.5 });
        m.down = (x, y) => { m.opts.forEach((o, i) => { const bx = 150 + i * 90; if (Math.abs(x - bx) < 36 && y > 196 && y < 246) m.res = o === m.k; }); };
      }
      return m;
    }

    function next() {
      if (n >= total) { done = true; success = lives > 0; score += lives * 100; ctx.sfx('win'); return; }
      let k; do { k = KINDS[(R() * KINDS.length) | 0]; } while (k === lastKind);
      lastKind = k; cur = make(k); n++;
      if (n > 1 && (n - 1) % 4 === 0) { sp += 0.14; pop(240, 230, L(T.faster), P.red); ctx.sfx('combo'); }
      phase = 'intro'; pt = 0; dur = (k === 'beds' ? 3.8 : k === 'rub' || k === 'curtain' || k === 'defib' ? 3.4 : 3.0) / sp * (ctx.assist ? 1.3 : 1);
      ctx.sfx('alarm');
    }
    function finish(win) {
      phase = 'result'; pt = 0; res = win;
      if (win) { const gain = Math.round(100 * sp + 30 * Math.max(0, 1 - cur.el / dur)); score += gain; ctx.sfx('good'); pop(240, 70, `${L(T.ok)} +${gain}`, P.red); ctx.vibrate(15); }
      else { lives--; ctx.sfx('bad'); ctx.shake(4); ctx.vibrate(80); flash = 0.4; pop(240, 70, L(T.ng), P.milk3); }
    }

    // ---- drawing helpers for microgames
    function arrows(x, y, c) {
      const o = Math.round(Math.sin(t * 8) * 4);
      for (let i = 0; i < 6; i++) { D.rect(g, x - 30 - o + i, y - i, 1, i * 2 + 1, c); D.rect(g, x + 30 + o - i, y - i, 1, i * 2 + 1, c); }
      D.rect(g, x - 24 - o, y - 1, 48 + o * 2, 3, c);
    }
    function phoneSprite(x, y, ring) {
      const sx = ring ? Math.round(Math.sin(t * 50) * 2) : 0, X = x + sx;
      const body = ring ? P.red : P.gray, dark = ring ? P.red2 : P.ash, lite = ring ? P.rose : P.gray2;
      g.fillStyle = 'rgba(18,16,18,.3)'; g.fillRect(x - 22, y + 13, 44, 3);
      // base
      D.rect(g, X - 20, y - 6, 40, 20, P.ink); D.rect(g, X - 19, y - 5, 38, 18, body); D.rect(g, X - 19, y - 5, 38, 2, lite); D.rect(g, X - 19, y + 10, 38, 3, dark);
      // dial / keypad
      D.circle(g, X, y + 3, 7, P.ink); D.circle(g, X, y + 3, 6, P.milk3);
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + t * (ring ? 0 : 0); D.rect(g, X + Math.round(Math.cos(a) * 4), y + 3 + Math.round(Math.sin(a) * 4), 1, 1, P.ink); }
      D.rect(g, X - 1, y + 2, 2, 2, P.red);
      // handset (lifts slightly while ringing)
      const lift = ring && Math.floor(t * 16) % 2 ? 2 : 0;
      D.rect(g, X - 24, y - 15 - lift, 48, 8, P.ink); D.rect(g, X - 23, y - 14 - lift, 46, 6, dark); D.rect(g, X - 23, y - 14 - lift, 46, 1, lite);
      D.rect(g, X - 26, y - 13 - lift, 9, 10, P.ink); D.rect(g, X - 25, y - 12 - lift, 7, 8, body); D.rect(g, X + 17, y - 13 - lift, 9, 10, P.ink); D.rect(g, X + 18, y - 12 - lift, 7, 8, body);
      D.rect(g, X - 12, y - 8, 4, 3, P.ink); D.rect(g, X + 8, y - 8, 4, 3, P.ink);
      // coiled cord
      for (let i = 0; i < 5; i++) D.ring(g, X + 23 + i * 2, y + 6 + (i % 2), 2, P.ink);
      if (ring && Math.floor(t * 8) % 2) { D.line(g, x - 30, y - 22, x - 36, y - 28, P.red, 2); D.line(g, x + 30, y - 22, x + 36, y - 28, P.red, 2); D.line(g, x, y - 26, x, y - 34, P.red, 2); D.line(g, x - 34, y - 12, x - 40, y - 12, P.red, 2); D.line(g, x + 34, y - 12, x + 40, y - 12, P.red, 2); }
    }
    function hand(x, y, flip, col) {
      const s = flip ? -1 : 1, sh = col === P.rose ? P.red : col === P.rose2 ? P.rose : P.gray2;
      // coat cuff with red band
      D.rect(g, x - 15, y + 22, 30, 22, P.ink); D.rect(g, x - 14, y + 23, 28, 20, P.milk2); D.rect(g, x - 14, y + 30, 28, 4, P.red); D.rect(g, x - 14, y + 31, 28, 1, P.red2); D.rect(g, x + s * 10 - 1, y + 23, 2, 20, P.gray3);
      // palm
      blob(g, x, y + 6, 14, 18, col, P.ink);
      // fingers
      for (let i = 0; i < 4; i++) {
        const fx = x - 12 + i * 6 + (flip ? 1 : 0), fh = [18, 22, 21, 16][flip ? 3 - i : i];
        D.rect(g, fx, y - 6 - fh + 10, 6, fh, P.ink); D.rect(g, fx + 1, y - 5 - fh + 10, 4, fh, col); D.rect(g, fx + 1, y - 5 - fh + 10, 4, 1, P.milk3);
        D.rect(g, fx + 1, y - 5 - fh + 16, 4, 1, sh); D.rect(g, fx + 2, y - 4 - fh + 10, 2, 2, P.milk3);
      }
      // thumb on the inner side
      const tx = x + s * 12;
      D.rect(g, tx - 4, y - 2, 9, 16, P.ink); D.rect(g, tx - 3, y - 1, 7, 14, col); D.rect(g, tx - 3, y - 1, 7, 1, P.milk3);
      D.rect(g, x - 6, y + 10, 12, 1, sh); D.rect(g, x - 4, y + 14, 8, 1, sh);
    }
    function clock(x, y) { D.circle(g, x, y, 13, P.ink); D.circle(g, x, y, 12, P.gray2); D.circle(g, x, y, 10, P.milk3); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; D.rect(g, x + Math.round(Math.cos(a) * 8), y + Math.round(Math.sin(a) * 8), 1, 1, i % 3 ? P.gray : P.ink); } const a = t * 0.5; D.line(g, x, y, x + Math.round(Math.cos(a) * 8), y + Math.round(Math.sin(a) * 8), P.red); D.line(g, x, y, x, y - 6, P.ink, 2); D.rect(g, x - 1, y - 1, 2, 2, P.ink); }
    function crossIcon(x, y, k) {
      // hospital signage tiles; only the bright red cross is the right one
      D.rect(g, x - 23, y - 21, 46, 42, P.ink); D.rect(g, x - 22, y - 20, 44, 40, P.milk2);
      D.rect(g, x - 22, y - 20, 44, 2, P.milk3); D.rect(g, x - 22, y + 16, 44, 4, P.gray3); D.rect(g, x + 20, y - 20, 2, 40, P.gray3);
      D.rect(g, x - 19, y - 17, 2, 2, P.gray); D.rect(g, x + 17, y - 17, 2, 2, P.gray); D.rect(g, x - 19, y + 13, 2, 2, P.gray); D.rect(g, x + 17, y + 13, 2, 2, P.gray);
      const plus = (c, hi, lo) => { D.rect(g, x - 5, y - 13, 10, 26, P.ink); D.rect(g, x - 13, y - 5, 26, 10, P.ink); D.rect(g, x - 4, y - 12, 8, 24, c); D.rect(g, x - 12, y - 4, 24, 8, c); D.rect(g, x - 4, y - 12, 8, 2, hi); D.rect(g, x - 12, y - 4, 8, 2, hi); D.rect(g, x + 4, y - 4, 8, 2, hi); D.rect(g, x - 4, y + 10, 8, 2, lo); D.rect(g, x - 12, y + 2, 8, 2, lo); D.rect(g, x + 4, y + 2, 8, 2, lo); };
      if (k === 0) plus(P.red, P.rose, P.red2);
      else if (k === 1) plus(P.gray, P.gray2, P.ash2);
      else if (k === 2) { D.circle(g, x, y, 12, P.ink); D.circle(g, x, y, 11, P.red); D.circle(g, x - 2, y - 2, 8, P.red); D.rect(g, x - 6, y - 7, 4, 2, P.rose); D.rect(g, x - 8, y - 4, 2, 3, P.rose); }
      else if (k === 3) plus(P.rose2, P.milk3, P.rose);
      else { D.line(g, x - 10, y - 10, x + 10, y + 10, P.ink, 9); D.line(g, x + 10, y - 10, x - 10, y + 10, P.ink, 9); D.line(g, x - 9, y - 9, x + 9, y + 9, P.red, 6); D.line(g, x + 9, y - 9, x - 9, y + 9, P.red, 6); D.rect(g, x - 9, y - 9, 3, 1, P.rose); }
    }
    function bedSprite(x, y, pat) {
      g.fillStyle = 'rgba(18,16,18,.25)'; g.fillRect(x - 32, y + 16, 66, 3);
      // frame, legs, wheels
      D.rect(g, x - 34, y - 16, 5, 34, P.ink); D.rect(g, x - 33, y - 15, 3, 32, P.gray2); D.rect(g, x + 30, y - 6, 5, 24, P.ink); D.rect(g, x + 31, y - 5, 3, 22, P.gray2);
      D.rect(g, x - 34, y - 18, 5, 3, P.ink); D.rect(g, x - 31, y + 8, 62, 3, P.ink);
      for (const wx of [x - 30, x + 30]) { D.rect(g, wx - 2, y + 16, 4, 3, P.ink); }
      // mattress + sheet
      D.rect(g, x - 30, y - 3, 60, 12, P.ink); D.rect(g, x - 29, y - 2, 58, 10, P.milk3); D.rect(g, x - 29, y + 5, 58, 3, P.gray3);
      // pillow
      D.rect(g, x - 28, y - 9, 16, 8, P.ink); D.rect(g, x - 27, y - 8, 14, 6, P.milk2); D.rect(g, x - 27, y - 4, 14, 2, P.gray3);
      if (pat) {
        D.circle(g, x - 18, y - 7, 5, P.ink); D.circle(g, x - 18, y - 7, 4, P.milk); D.rect(g, x - 22, y - 11, 8, 3, P.ink2); D.rect(g, x - 17, y - 7, 2, 1, P.ink);
        D.rect(g, x - 13, y - 6, 42, 9, P.ink); D.rect(g, x - 12, y - 5, 40, 7, P.gray2); D.rect(g, x - 12, y - 5, 40, 2, P.milk); for (let i = 0; i < 3; i++) D.rect(g, x - 4 + i * 10, y - 3, 1, 5, P.gray);
        D.rect(g, x + 22, y - 7, 6, 3, P.gray2);
      }
      // chart clipboard on the foot rail
      D.rect(g, x + 28, y - 2, 8, 10, P.ink); D.rect(g, x + 29, y - 1, 6, 8, P.milk3); D.rect(g, x + 30, y + 1, 4, 1, P.red);
    }

    function drawMicro(m) {
      const k = m.kind;
      if (k === 'phone') {
        D.rect(g, 40, 40, 400, 200, P.gray3); for (let x = 40; x < 440; x += 50) D.rect(g, x, 40, 1, 200, P.milk);
        clock(400, 66); D.panel(g, 60, 52, 70, 26, { fill: P.milk3, line: P.ash, shadow: null }); D.cross(g, 74, 65, 3, P.red); D.rect(g, 84, 60, 38, 2, P.gray); D.rect(g, 84, 67, 28, 2, P.gray);
        D.rect(g, 40, 220, 400, 20, P.ash2); D.rect(g, 40, 220, 400, 2, P.gray);
        D.rect(g, 40, 120, 400, 1, P.gray2); for (let x = 60; x < 440; x += 90) { D.rect(g, x, 186, 40, 20, P.milk2); D.stroke(g, x, 186, 40, 20, P.gray); D.rect(g, x + 4, 192, 24, 1, P.gray); D.rect(g, x + 4, 197, 18, 1, P.gray); }
        for (const p of m.ph) phoneSprite(p.x, p.y, p.ring);
      }
      else if (k === 'curtain') {
        D.rect(g, 40, 40, 400, 200, P.ink3); bedSprite(240, 170, true);
        if (Math.floor(t * 2) % 2) D.text(g, 'z', 252, 140, { size: 12, color: P.gray2 });
        const w = Math.round(200 * (1 - m.open));
        for (const [x0, dir] of [[40, 1], [440, -1]]) {
          const x = dir > 0 ? x0 : x0 - w;
          D.rect(g, x, 44, w, 196, P.milk);
          for (let i = 0; i < w; i += 12) { const sw = Math.round(Math.sin(t * 2 + i * 0.3) * 1); D.rect(g, x + i + 7 + sw, 48, 3, 190, P.gray3); D.rect(g, x + i + 9 + sw, 48, 1, 190, P.gray2); D.rect(g, x + i + 2, 48, 2, 190, P.milk3); D.ring(g, x + i + 6, 45, 3, P.ash); }
          D.rect(g, x, 226, w, 14, P.gray3); for (let i = 0; i < w; i += 6) D.rect(g, x + i, 236, 3, 4, P.gray2);
          if (w > 4) D.rect(g, dir > 0 ? x + w - 2 : x, 44, 2, 196, P.gray2);
        }
        D.rect(g, 40, 40, 400, 4, P.ash);
        arrows(240, 206, P.red);
      } else if (k === 'defib') {
        D.rect(g, 40, 40, 400, 200, P.ink3);
        D.panel(g, 200, 54, 80, 160, { fill: P.ink2, line: P.gray, shadow: P.ink, r: 4 });
        const ys = v => Math.round(206 - v * 144);
        D.rect(g, 208, ys(m.lo + m.hw), 64, ys(m.lo - m.hw) - ys(m.lo + m.hw), P.red2);
        D.stroke(g, 206, ys(m.lo + m.hw) - 1, 68, ys(m.lo - m.hw) - ys(m.lo + m.hw) + 2, P.rose);
        D.rect(g, 214, ys(m.c), 52, Math.round(m.c * 144), m.c > m.lo + m.hw ? P.red : P.milk);
        D.rect(g, 196, ys(m.c), 88, 2, P.milk3);
        for (const sx of [100, 380]) {
          // cable to the device
          for (let i = 0; i < 10; i++) { const u = i / 10, u2 = (i + 1) / 10; const ax = D.lerp(sx, sx < 240 ? 200 : 280, u), ay = 166 + Math.sin(u * 3.1) * 40, bx2 = D.lerp(sx, sx < 240 ? 200 : 280, u2), by2 = 166 + Math.sin(u2 * 3.1) * 40; D.line(g, ax, ay, bx2, by2, P.ink, 3); D.line(g, ax, ay, bx2, by2, P.ash, 1); }
          // paddle: plate + grip with red thumb button
          D.rect(g, sx - 24, 146, 48, 22, P.ink); D.rect(g, sx - 23, 147, 46, 20, m.on ? P.rose : P.gray2); D.rect(g, sx - 23, 147, 46, 3, m.on ? P.rose2 : P.gray3); D.rect(g, sx - 23, 162, 46, 5, m.on ? P.red : P.gray);
          D.rect(g, sx - 9, 104, 18, 44, P.ink); D.rect(g, sx - 8, 105, 16, 42, P.ash2); D.rect(g, sx - 8, 105, 3, 42, P.gray); for (let j = 0; j < 5; j++) D.rect(g, sx - 8, 112 + j * 7, 16, 1, P.ash);
          D.rect(g, sx - 5, 98, 10, 8, P.ink); D.rect(g, sx - 4, 99, 8, 6, m.on ? P.rose : P.red); D.rect(g, sx - 4, 99, 8, 1, P.rose2);
        }
        if (m.on && Math.floor(t * 20) % 2) { for (const [x0, x1] of [[126, 168], [354, 312]]) { let px = x0, py = 156; for (let i = 1; i <= 4; i++) { const nx = D.lerp(x0, x1, i / 4), ny = 156 + (i % 2 ? -8 : 6); D.line(g, px, py, nx, ny, P.milk3, 2); px = nx; py = ny; } } }
        D.rect(g, 222, 40, 36, 12, P.ink); D.rect(g, 223, 41, 34, 10, P.red2); D.text(g, `${Math.round(m.c * 360)}J`, 240, 41, { size: 8, color: P.milk3, align: 'center' });
        D.text(g, L(T.hold), 240, 220, { size: 12, color: P.gray2, align: 'center' });
      } else if (k === 'bandage') {
        D.rect(g, 40, 40, 400, 200, P.gray2);
        D.rect(g, 40, 40, 400, 6, P.gray); D.rect(g, 40, 200, 400, 40, P.gray3);
        D.panel(g, 120, 96, 300, 76, { fill: P.milk, line: P.ink, shadow: P.ash, r: 10 });
        D.rect(g, 128, 100, 280, 2, P.milk3); D.rect(g, 128, 164, 280, 2, P.gray3);
        D.panel(g, 404, 90, 30, 88, { fill: P.milk, line: P.ink, shadow: null, r: 8 });
        for (let i = 0; i < 3; i++) D.rect(g, 410, 108 + i * 18, 18, 1, P.gray2);
        D.panel(g, 100, 92, 26, 84, { fill: P.gray2, line: P.ink, shadow: null, r: 3 });
        for (let i = 0; i < 14; i++) D.rect(g, 136 + (i * 37) % 260, 104 + (i * 19) % 60, 2, 1, P.gray3);
        D.line(g, m.tx - 8, m.ty - 3, m.tx + 8, m.ty + 3, P.rose2, 6); D.line(g, m.tx - 7, m.ty - 3, m.tx + 7, m.ty + 3, P.ink, 4); D.line(g, m.tx - 7, m.ty - 3, m.tx + 7, m.ty + 3, P.red, 2); D.rect(g, m.tx - 2, m.ty + 5, 2, 3, P.red); D.rect(g, m.tx + 3, m.ty + 7, 1, 2, P.red);
        if (Math.floor(t * 4) % 2) D.ring(g, m.tx, m.ty, 15, P.rose);
        // adhesive bandage: rounded strip with holes and a gauze pad
        { const bx = m.bx, by = m.by;
          if (m.drag) { g.fillStyle = 'rgba(18,16,18,.3)'; g.fillRect(bx - 20, by + 11, 42, 3); }
          D.rect(g, bx - 22, by - 7, 44, 14, P.ink); D.rect(g, bx - 24, by - 5, 48, 10, P.ink);
          D.rect(g, bx - 21, by - 6, 42, 12, P.rose2); D.rect(g, bx - 23, by - 4, 46, 8, P.rose2); D.rect(g, bx - 21, by - 6, 42, 2, P.milk3); D.rect(g, bx - 21, by + 4, 42, 2, P.rose);
          for (const sx of [-17, -13, 13, 17]) for (const sy of [-3, 2]) D.rect(g, bx + sx, by + sy, 1, 1, P.rose);
          D.rect(g, bx - 9, by - 6, 18, 12, P.ink); D.rect(g, bx - 8, by - 5, 16, 10, P.milk3); D.rect(g, bx - 8, by + 3, 16, 2, P.gray3);
          for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) D.rect(g, bx - 6 + i * 4, by - 3 + j * 4, 1, 1, P.gray2);
        }
      } else if (k === 'redcross') {
        D.rect(g, 40, 40, 400, 200, P.gray3); for (let x = 40; x < 440; x += 40) D.rect(g, x, 40, 1, 200, P.gray2);
        D.rect(g, 170, 46, 140, 22, P.ink); D.rect(g, 171, 47, 138, 20, P.milk3);
        D.text(g, L(T.find), 236, 51, { size: 12, color: P.ink, align: 'right' });
        D.rect(g, 251, 49, 6, 16, P.ink); D.rect(g, 246, 54, 16, 6, P.ink); D.rect(g, 252, 50, 4, 14, P.red); D.rect(g, 247, 55, 14, 4, P.red);
        for (const c of m.cells) crossIcon(c.x, c.y, c.k);
      }
      else if (k === 'rub') {
        D.rect(g, 40, 40, 400, 200, P.ink3);
        g.globalAlpha = 1 - m.w; for (let i = 0; i < 14; i++) D.rect(g, 60 + (i * 53) % 360, 50 + (i * 37) % 180, 2, 2, P.gray3); g.globalAlpha = 1;
        const off = Math.round(Math.sin(t * 30) * (m.lx != null ? 6 : 0));
        const hc = m.w > 0.66 ? P.rose : m.w > 0.33 ? P.rose2 : P.gray3;
        hand(214 + off, 128, true, hc); hand(266 - off, 128, false, hc);
        if (m.w > 0.5 && !ctx.reduced) for (let i = 0; i < 3; i++) { const yy = 92 - ((t * 30 + i * 12) % 30); D.rect(g, 228 + i * 12, Math.round(yy), 2, 4, P.rose2); }
        for (let i = 0; i < 6; i++) { const fx = 70 + i * 66, fy = 60 + ((t * 20 + i * 40) % 160); g.globalAlpha = 1 - m.w; D.rect(g, fx, Math.round(fy), 3, 1, P.milk3); D.rect(g, fx + 1, Math.round(fy) - 1, 1, 3, P.milk3); g.globalAlpha = 1; }
        D.panel(g, 140, 210, 200, 10, { fill: P.ink2, line: P.ash, shadow: null }); D.rect(g, 142, 212, Math.round(196 * m.w), 6, m.w > 0.6 ? P.red : P.rose);
        arrows(240, 186, P.rose);
      } else if (k === 'beds') {
        D.rect(g, 40, 40, 400, 200, P.gray3); D.rect(g, 40, 40, 400, 18, P.gray2); for (let y = 60; y < 190; y += 14) D.rect(g, 40, y, 400, 1, P.gray2); for (let x = 132; x < 440; x += 92) D.rect(g, x, 58, 2, 130, P.milk);
        for (const b of m.bed) bedSprite(b.x + 16, b.y, b.pat);
        m.opts.forEach((o, i) => { const bx = 150 + i * 90; D.panel(g, bx - 32, 200, 64, 38, { fill: P.milk3, line: P.ink, shadow: P.ash, r: 4 }); D.text(g, o, bx, 207, { size: 24, color: P.ink, align: 'center' }); });
      }
    }

    next();
    return {
      update(dt) {
        if (done) return;
        t += dt; pt += dt; flash = Math.max(0, flash - dt);
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 150 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1) pops.splice(i, 1);
        if (phase === 'intro') { if (pt > Math.max(0.45, 0.85 / sp)) { phase = 'play'; pt = 0; cur.el = 0; } }
        else if (phase === 'play') {
          cur.el = pt; if (cur.update) cur.update(dt);
          if (Math.floor(pt * 2) !== Math.floor((pt - dt) * 2)) ctx.sfx('tick');
          if (cur.res !== null) finish(cur.res); else if (pt >= dur) finish(false);
        } else if (phase === 'result') {
          if (pt > 0.7) { if (lives <= 0) { done = true; success = false; ctx.sfx('lose'); } else next(); }
        }
      },
      draw() {
        // nurse station frame
        station(g,'emergency',t);
        bezel(g,4,27,470,232,{invert:true});
        for (let y = 22; y < 270; y += 8) for (let x = (y / 8 % 2) * 8; x < 480; x += 16) D.rect(g, x, y, 8, 8, P.red2);
        D.panel(g, 34, 34, 412, 212, { fill: P.ink, line: P.ink, shadow: P.ink, r: 6 });
        if (phase !== 'intro') drawMicro(cur);
        else {
          D.rect(g, 40, 40, 400, 200, P.ink2);
          const s = 1 + Math.max(0, 0.3 - pt) * 2;
          const on = Math.floor(pt * 10) % 2 === 0 || ctx.reduced;
          D.text(g, L(MG[cur.kind]), 240, 140, { size: Math.round(32 * s), color: on ? P.milk3 : P.rose, align: 'center', base: 'middle', shadow: P.red });
          D.text(g, `${L(T.call)} ${n}/${total}`, 240, 186, { size: 12, color: P.gray, align: 'center' });
        }
        // timer bar (IV drip draining)
        if (phase === 'play') { const f = 1 - pt / dur; D.rect(g, 40, 236, 400, 4, P.ink2); D.rect(g, 40, 236, Math.round(400 * f), 4, f < 0.3 ? P.red : P.milk); }
        if (phase === 'result') { g.globalAlpha = 0.35; D.rect(g, 40, 40, 400, 200, res ? P.milk3 : P.red); g.globalAlpha = 1; }
        // lives
        for (let i = 0; i < 3; i++) { D.panel(g, 404 + i * 0 - (2 - i) * 18, 248, 14, 14, { fill: i < lives ? P.milk3 : P.ink3, line: P.ink, shadow: null }); D.cross(g, 411 - (2 - i) * 18, 255, 2, i < lives ? P.red : P.ash); }
        D.text(g, `${n}/${total}`, 40, 250, { size: 12, color: P.rose2 });
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 14, { size: 16, color: p.c, align: 'center', shadow: P.ink });
        if (flash > 0) { g.globalAlpha = flash; D.rect(g, 0, 22, 480, 248, P.red); g.globalAlpha = 1; }
      },
      down(x, y, id) { if (phase === 'play' && cur.down && cur.res === null) { cur.down(x, y, id); ctx.sfx('tap'); } },
      move(x, y, id) { if (phase === 'play' && cur.move && cur.res === null) cur.move(x, y, id); },
      up(x, y, id) { if (phase === 'play' && cur.up && cur.res === null) cur.up(x, y, id); },
      key(code) { if (code === 'Space' && phase === 'play' && cur.kind === 'defib') cur.on ? cur.up() : cur.down(); },
      state() { return { score, time: null, lives, progress: n / total, done, success, label: `${L(T.call)} ${n}/${total}` }; },
      _dbg() { return { cur, phase }; },
      destroy() {},
    };
  },
};
