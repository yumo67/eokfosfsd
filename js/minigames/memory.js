// 思い出のカルテ Memory Chart — match pairs of old photographs before memory fades.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station, bezel } from './pixel-set.js';

const T = {
  match: { ja: 'おもいだした', en: 'Remembered', ru: 'Вспомнил' },
  miss: { ja: '…ちがう', en: '…not quite', ru: '…не то' },
  shuffle: { ja: '…記憶が ゆれる', en: '…memories shift', ru: '…воспоминания путаются' },
  who: { ja: '……誰だっけ', en: '……who was this?', ru: '……кто это был?' },
  tries: { ja: '残り', en: 'Tries', ru: 'Попытки' },
  pairs: { ja: 'ペア', en: 'Pairs', ru: 'Пары' },
  hint: { ja: '同じ写真を 2枚めくろう', en: 'Flip two matching photos', ru: 'Откройте две одинаковые' },
  all: { ja: '小田さんの思い出、ぜんぶ', en: 'All of Oda’s memories', ru: 'Все воспоминания Оды' },
};
const ITEMS = ['teacup', 'scarf', 'cat', 'umbrella', 'letter', 'flower', 'key', 'glasses', 'clock', 'bird'];

function art(g, id, x, y, faded) {
  const c = faded ? P.gray2 : P.ink2, r = faded ? P.gray3 : P.red, m = faded ? P.gray3 : P.milk3, a = faded ? P.gray2 : P.ash;
  const R = (dx, dy, w, h, col) => D.rect(g, x + dx, y + dy, w, h, col);
  switch (id) {
    case 'teacup': R(-9, -2, 16, 9, m); D.stroke(g, x - 9, y - 2, 16, 9, c); R(7, 0, 4, 5, c); R(8, 1, 2, 3, m); R(-11, 7, 20, 2, c); R(-4, -9, 1, 4, a); R(0, -10, 1, 5, a); break;
    case 'scarf': R(-10, -8, 20, 6, r); R(2, -2, 6, 16, r); R(-10, -6, 20, 1, m); R(2, 8, 6, 1, m); R(3, 14, 1, 2, r); R(6, 14, 1, 2, r); break;
    case 'cat': D.circle(g, x, y + 2, 9, c); R(-8, -10, 4, 6, c); R(4, -10, 4, 6, c); R(-4, 0, 2, 2, faded ? P.gray3 : P.rose2); R(3, 0, 2, 2, faded ? P.gray3 : P.rose2); R(-1, 4, 2, 1, m); R(9, 6, 6, 2, c); break;
    case 'umbrella': D.circle(g, x, y - 2, 11, r); R(-12, -1, 24, 13, faded ? P.milk2 : P.milk); R(0, -2, 1, 14, c); R(-3, 11, 4, 1, c); R(-3, 9, 1, 2, c); R(-11, -2, 22, 1, c); break;
    case 'letter': R(-11, -7, 22, 15, m); D.stroke(g, x - 11, y - 7, 22, 15, c); D.line(g, x - 10, y - 6, x, y + 1, c); D.line(g, x + 10, y - 6, x, y + 1, c); D.circle(g, x, y + 2, 2, r); break;
    case 'flower': R(0, 0, 1, 12, a); R(1, 5, 4, 2, a); for (let i = 0; i < 5; i++) { const an = i / 5 * 6.283; D.circle(g, x + Math.round(Math.cos(an) * 5), y - 4 + Math.round(Math.sin(an) * 5), 3, r); } D.circle(g, x, y - 4, 2, m); break;
    case 'key': D.ring(g, x - 6, y, 5, c, 2); R(-1, -1, 14, 3, c); R(9, 2, 2, 4, c); R(5, 2, 2, 3, c); break;
    case 'glasses': D.ring(g, x - 6, y, 5, c, 2); D.ring(g, x + 6, y, 5, c, 2); R(-1, -1, 2, 1, c); R(-14, -2, 3, 1, c); R(11, -2, 3, 1, c); break;
    case 'clock': D.circle(g, x, y, 10, c); D.circle(g, x, y, 9, m); R(0, -6, 1, 6, c); R(0, 0, 5, 1, r); R(-1, -12, 3, 2, c); break;
    case 'bird': D.circle(g, x, y, 6, a); D.circle(g, x - 6, y - 5, 4, a); R(-12, -6, 3, 2, r); R(-7, -6, 1, 1, m); R(4, -3, 8, 3, c); R(-2, 6, 1, 3, c); R(1, 6, 1, 3, c); break;
    case 'faded': D.circle(g, x, y - 4, 6, P.gray2); R(-9, 4, 18, 10, P.gray2); R(-3, -5, 1, 1, P.gray3); break;
  }
}

export default {
  id: 'memory',
  control: 'tap',
  title: { ja: '思い出のカルテ', en: 'Memory Chart', ru: 'Карта воспоминаний' },
  desc: { ja: '小田さんの古い写真をめくって、同じ思い出をそろえよう。', en: 'Flip Oda’s old photographs and match the memories.', ru: 'Переворачивайте старые фото Оды и находите пары.' },
  how: [
    { ja: '写真を2枚タップしてめくる。同じならペア成立。', en: 'Tap two photos. If they match, they stay.', ru: 'Откройте два фото. Совпали — остаются.' },
    { ja: 'めくれる回数と時間には限りがある。', en: 'Tries and time are limited.', ru: 'Попытки и время ограничены.' },
    { ja: '途中で、写真の位置が入れかわることも。', en: 'Midway, the photos may shift places.', ru: 'В середине фото могут перемешаться.' },
  ],
  ranks: d => [[350, 520, 680], [450, 680, 900], [520, 800, 1050]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L, R = Math.random;
    const nPairs = [6, 8, 9][dif - 1];
    const faded = dif === 3;
    let tries = [14, 18, 20][dif - 1] + (ctx.assist ? 4 : 0);
    let timeLeft = [55, 65, 70][dif - 1] * (ctx.assist ? 1.25 : 1), t = 0, score = 0, combo = 0, matched = 0, done = false, success = false;
    let open = [], lock = 0, shuffled = false, shufT = 0, msg = null, msgT = 0, preview = 1.6 - dif * 0.3, endT = 0;
    const pops = [], parts = [];
    const pop = (x, y, s, c) => pops.push({ x, y, s, c, t: 0 });
    const ids = ITEMS.slice().sort(() => R() - 0.5).slice(0, nPairs);
    let deck = [];
    for (const id of ids) deck.push(id, id);
    if (faded) deck.push('faded');
    deck.sort(() => R() - 0.5);
    // layout rows
    const cols = dif === 1 ? 4 : 5, CW = 44, CH = 50, GX = 10, GY = 6;
    const rows = Math.ceil(deck.length / cols);
    const cards = deck.map((id, i) => ({ id, i, up: 0, face: false, done: false, x: 0, y: 0, tx: 0, ty: 0, fadeTaps: 0 }));
    function place(c, slot, snap) {
      const r = (slot / cols) | 0, inRow = r === rows - 1 ? deck.length - r * cols : cols;
      const k = slot - r * cols;
      const x0 = 210 - (inRow * (CW + GX) - GX) / 2, y0 = 135 - (rows * (CH + GY) - GY) / 2 + 6;
      c.tx = Math.round(x0 + k * (CW + GX)); c.ty = Math.round(y0 + r * (CH + GY));
      if (snap) { c.x = c.tx; c.y = c.ty; }
    }
    cards.forEach((c, i) => place(c, i, true));
    cards.forEach(c => { c.face = true; c.up = 1; });

    function flip(c) {
      if (c.done || c.face || lock > 0 || open.length >= 2) return;
      c.face = true; ctx.sfx('click');
      if (c.id === 'faded') { c.fadeTaps = 1; setTimeoutLike(c); return; }
      open.push(c);
      if (open.length === 2) {
        tries--;
        const [a, b] = open;
        if (a.id === b.id) {
          a.done = b.done = true; combo++; matched++;
          const gain = 50 + 20 * (combo - 1); score += gain;
          ctx.sfx(combo >= 3 ? 'combo' : 'good');
          pop((a.x + b.x) / 2 + CW / 2, Math.min(a.y, b.y) - 4, `${L(T.match)} +${gain}`, P.red);
          for (const c2 of [a, b]) for (let k = 0; k < 8; k++) { const an = R() * 6.28; parts.push({ x: c2.x + CW / 2, y: c2.y + CH / 2, vx: Math.cos(an) * 40, vy: Math.sin(an) * 40 - 20, l: 0.6, c: k % 2 ? P.milk3 : P.rose2 }); }
          open = [];
          if (!shuffled && dif >= 2 && matched === Math.floor(nPairs / 2)) shufT = 0.9;
          if (matched >= nPairs) finish(true);
        } else { combo = 0; lock = 0.8; ctx.sfx('tick'); }
        if (!done && tries <= 0 && lock <= 0 && matched < nPairs) finish(false);
      }
    }
    // faded card: flips alone; a second tap shows the line
    function setTimeoutLike(c) { c.fadeT = 1.2; }
    function tapFaded(c) { if (c.fadeTaps === 1) { c.fadeT = 0;  c.fadeTaps = 2; msg = L(T.who); msgT = 3; ctx.sfx('beep'); } }
    function finish(win) {
      done = true; endT = 0;
      success = win || matched >= Math.ceil(nPairs * 0.7);
      if (win) { score += Math.max(0, tries) * 15 + Math.round(timeLeft * 3); msg = L(T.all); msgT = 4; }
      ctx.sfx(success ? 'win' : 'lose');
    }
    function doShuffle() {
      const free = cards.filter(c => !c.done && c.id !== 'faded' || (c.id === 'faded' && !c.face));
      const slots = free.map(c => cards.indexOf(c));
      const order = slots.slice().sort(() => R() - 0.5);
      const pos = slots.map(s => ({ tx: cards[s].tx, ty: cards[s].ty }));
      free.forEach((c, i) => { c.tx = pos[slots.indexOf(order[i])].tx; c.ty = pos[slots.indexOf(order[i])].ty; });
      shuffled = true; msg = L(T.shuffle); msgT = 2.2; ctx.sfx('whoosh'); ctx.shake(1);
    }

    return {
      update(dt) {
        t += dt; msgT -= dt;
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 90 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1.2) pops.splice(i, 1);
        for (const c of cards) {
          c.up = D.clamp(c.up + (c.face || c.done ? dt : -dt) * 6, 0, 1);
          c.x = D.lerp(c.x, c.tx, Math.min(1, dt * 6)); c.y = D.lerp(c.y, c.ty, Math.min(1, dt * 6));
          if (c.fadeT) { c.fadeT -= dt; if (c.fadeT <= 0) { c.fadeT = 0; if (c.fadeTaps < 2) { c.face = false; c.fadeTaps = 1; } } }
        }
        if (done) return;
        if (preview > 0) { preview -= dt; if (preview <= 0) cards.forEach(c => { if (!c.done) c.face = false; }); return; }
        timeLeft -= dt;
        if (lock > 0) { lock -= dt; if (lock <= 0) { for (const c of open) c.face = false; open = []; if (tries <= 0) finish(false); } }
        if (shufT > 0) { shufT -= dt; if (shufT <= 0) doShuffle(); }
        if (timeLeft <= 0) { timeLeft = 0; finish(false); }
      },
      draw() {
        // dim study: wooden desk (gray tones), lamp light, cork board
        station(g,'memory',t);
        bezel(g,14,26,392,236,{invert:true});
        D.rect(g, 18, 30, 384, 228, P.ash);
        for (let y = 30; y < 258; y += 4) { const o = Math.round(Math.sin(y * 0.21) * 30); for (let x = 18; x < 402; x += 1) { const v = Math.sin((x + o) * 0.05 + y * 0.9); if (v > 0.93) D.rect(g, x, y, 3, 1, P.ash2); else if (v < -0.96) D.rect(g, x, y + 2, 2, 1, P.ink3); } }
        for (let y = 30; y < 258; y += 38) D.rect(g, 18, y, 384, 1, P.ink3);
        // corner props: pen and a teacup ring
        D.line(g, 30, 248, 70, 238, P.ink, 3); D.line(g, 30, 248, 70, 238, P.red2, 1); D.rect(g, 68, 236, 4, 4, P.gray2);
        D.ring(g, 380, 238, 9, P.ash2);
        g.globalAlpha = 0.08; D.circle(g, 210, 140, 160, P.milk3); g.globalAlpha = 1;
        for (const c of cards) {
          const w = Math.max(1, Math.round(CW * Math.abs(c.up * 2 - 1)));
          const x = Math.round(c.x + (CW - w) / 2), y = Math.round(c.y);
          const front = c.up > 0.5;
          if (front) {
            // polaroid photo
            D.panel(g, x, y, w, CH, { fill: c.id === 'faded' ? P.gray3 : P.milk3, line: c.done ? P.ash2 : P.ink, shadow: P.ink, r: 1 });
            if (w > 30) {
              const fx = x + 4, fy = y + 4, fw = w - 8, fh = CH - 16;
              D.rect(g, fx, fy, fw, fh, P.ink3);
              D.rect(g, fx + 1, fy + 1, fw - 2, fh - 2, c.id === 'faded' ? P.gray2 : P.gray3);
              D.rect(g, fx + 1, fy + 1, fw - 2, 10, c.id === 'faded' ? P.gray3 : P.milk);
              D.rect(g, fx + 1, fy + fh - 9, fw - 2, 8, c.id === 'faded' ? P.gray2 : P.gray2);
              D.rect(g, fx + 1, fy + fh - 9, fw - 2, 1, P.gray);
              if (!c.done || true) { D.rect(g, fx + fw - 8, fy + 3, 4, 4, c.id === 'faded' ? P.gray3 : P.milk3); }
              if (c.id === 'faded') { g.globalAlpha = 0.5 + 0.2 * Math.sin(t); art(g, 'faded', x + w / 2 | 0, y + 20, true); g.globalAlpha = 1; D.dither(g, fx + 1, fy + 1, fw - 2, fh - 2, P.milk, .25, (t * 4) | 0); }
              else art(g, c.id, x + w / 2 | 0, y + 20, false);
              D.rect(g, fx + 1, fy + 1, 2, fh - 2, P.milk3);
              // handwritten caption
              for (let k = 0; k < 4; k++) D.rect(g, x + 8 + k * 7, y + CH - 8 + (k % 2), 5, 1, c.done ? P.gray2 : P.ash2);
              if (c.done) D.cross(g, x + w - 7, y + CH - 7, 2, P.red);
            }
          } else {
            // card back: night-shift chart pattern
            D.panel(g, x, y, w, CH, { fill: P.red2, line: P.ink, shadow: P.ink, r: 1 });
            if (w > 8) { D.rect(g, x + 2, y + 2, w - 4, CH - 4, P.red3); D.stroke(g, x + 3, y + 3, w - 6, CH - 6, P.rose); }
            if (w > 30) {
              for (let j = 6; j < CH - 5; j += 5) for (let k = 6; k < w - 5; k += 5) if (((j + k) / 5) % 2 === 0) D.rect(g, x + k, y + j, 1, 1, P.red2);
              const cx = x + w / 2 | 0, cy = y + CH / 2 | 0;
              D.circle(g, cx, cy, 11, P.ink); D.circle(g, cx, cy, 10, P.milk2); D.circle(g, cx + 4, cy - 3, 8, P.red3);
              D.rect(g, cx - 5, cy - 1, 2, 7, P.red); D.rect(g, cx - 7, cy + 1, 6, 2, P.red);
              D.rect(g, cx + 5, cy - 7, 1, 1, P.milk3); D.rect(g, cx + 8, cy + 3, 1, 1, P.milk3); D.rect(g, cx + 2, cy + 6, 1, 1, P.rose2);
              D.rect(g, x + 5, y + 5, w - 10, 1, P.red); D.rect(g, x + 5, y + CH - 6, w - 10, 1, P.red);
            }
          }
          // a strip of tape instead of a pin
          if (!c.done && w > 20) { g.globalAlpha = .85; D.rect(g, x + w / 2 - 8, y - 3, 16, 6, P.gray3); g.globalAlpha = 1; D.rect(g, x + w / 2 - 8, y - 3, 1, 6, P.gray2); D.rect(g, x + w / 2 + 7, y - 3, 1, 6, P.gray2); }

        }
        // side panel: notebook
        D.panel(g, 414, 26, 58, 236, { fill: P.milk, line: P.ink, shadow: P.ink, r: 3 });
        for (let y = 40; y < 256; y += 10) D.rect(g, 418, y, 50, 1, P.gray3);
        D.rect(g, 424, 26, 1, 236, P.rose2);
        D.text(g, L(T.pairs), 443, 34, { size: 8, color: P.ash, align: 'center' });
        D.text(g, `${matched}/${nPairs}`, 443, 46, { size: 12, color: P.ink, align: 'center' });
        D.text(g, L(T.tries), 443, 74, { size: 8, color: P.ash, align: 'center' });
        D.text(g, String(Math.max(0, tries)), 443, 86, { size: 16, color: tries <= 3 ? P.red : P.ink, align: 'center' });
        ids.forEach((id, i) => { const yy = 120 + i * 14; if (cards.some(c => c.id === id && c.done)) { D.rect(g, 432, yy, 22, 10, P.milk2); art(g, id, 443, yy + 5, true); } });
        if (preview > 0) D.text(g, L(T.hint), 210, 252, { size: 12, color: P.milk3, align: 'center', shadow: P.ink });
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 12, { size: 12, color: p.c, align: 'center', shadow: P.milk3 });
        if (msgT > 0 && msg) { g.globalAlpha = Math.min(1, msgT) * 0.85; D.text(g, msg, 210, 252, { size: 12, color: P.gray3, align: 'center', shadow: P.ink }); g.globalAlpha = 1; }
        // vignette sepia-ish dim edges
        g.globalAlpha = 0.15; D.rect(g, 0, 22, 480, 8, P.ink); D.rect(g, 0, 262, 480, 8, P.ink); g.globalAlpha = 1;
      },
      down(x, y) {
        if (done || preview > 0) return;
        for (const c of cards) if (x >= c.tx && x < c.tx + CW && y >= c.ty && y < c.ty + CH) {
          if (c.id === 'faded' && c.face) tapFaded(c); else flip(c);
          return;
        }
      },
      move() {}, up() {},
      state() { return { score, time: Math.ceil(timeLeft), lives: null, progress: matched / nPairs, done, success, label: `${L(T.tries)} ${Math.max(0, tries)}` }; },
      _dbg() { return { cards, lock, preview, open }; },
      destroy() {},
    };
  },
};
