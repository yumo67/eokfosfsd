// 診断カード Diagnosis — read the symptoms, tap the matching diagnosis card in time.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station, bezel } from './pixel-set.js';
import { seatedPatient, outlined } from './art.js';

const T = {
  ok: { ja: '正解！', en: 'Correct!', ru: 'Верно!' },
  ng: { ja: 'ちがう…', en: 'Wrong…', ru: 'Неверно…' },
  late: { ja: '時間切れ', en: 'Too late', ru: 'Не успели' },
  combo: { ja: 'コンボ', en: 'combo', ru: 'комбо' },
  next: { ja: '次の方どうぞ', en: 'Next, please', ru: 'Следующий' },
  pt: { ja: '診察', en: 'Patient', ru: 'Пациент' },
  hint: { ja: '症状に合うカードをタップ', en: 'Tap the card that fits the symptoms', ru: 'Выберите карту по симптомам' },
  odd: { ja: '…今の人、待合室にいた？', en: '…was that one in the waiting room?', ru: '…а он был в приёмной?' },
};
// symptom icon ids
const SYM = ['cough', 'fever', 'rash', 'chest', 'dizzy', 'stomach', 'sneeze', 'tired', 'swell', 'pale', 'moon', 'head', 'sweat', 'itch', 'bruise'];
const DIS = [
  { k: 'cold', n: { ja: '風邪', en: 'Cold', ru: 'Простуда' }, s: ['cough', 'sneeze', 'fever'] },
  { k: 'flu', n: { ja: 'インフル', en: 'Flu', ru: 'Грипп' }, s: ['fever', 'tired', 'head'] },
  { k: 'gastro', n: { ja: '胃炎', en: 'Gastritis', ru: 'Гастрит' }, s: ['stomach', 'pale', 'tired'] },
  { k: 'anemia', n: { ja: '貧血', en: 'Anemia', ru: 'Анемия' }, s: ['pale', 'dizzy', 'tired'] },
  { k: 'sprain', n: { ja: '捻挫', en: 'Sprain', ru: 'Растяжение' }, s: ['swell', 'bruise'] },
  { k: 'insomnia', n: { ja: '不眠', en: 'Insomnia', ru: 'Бессонница' }, s: ['moon', 'tired', 'head'] },
  { k: 'allergy', n: { ja: 'アレルギー', en: 'Allergy', ru: 'Аллергия' }, s: ['rash', 'sneeze', 'itch'] },
  { k: 'heat', n: { ja: '熱中症', en: 'Heatstroke', ru: 'Тепловой удар' }, s: ['fever', 'dizzy', 'sweat'] },
  { k: 'food', n: { ja: '食あたり', en: 'Food poisoning', ru: 'Отравление' }, s: ['stomach', 'fever', 'sweat'] },
  { k: 'heart', n: { ja: '胸の病気', en: 'Heart trouble', ru: 'Сердце' }, s: ['chest', 'sweat', 'dizzy'] },
  { k: 'measles', n: { ja: 'はしか', en: 'Measles', ru: 'Корь' }, s: ['rash', 'fever', 'cough'] },
];

// 12x12 pixel icons drawn with rects
function icon(g, id, x, y, s = 1) {
  const R = (a, b, w, h, c) => D.rect(g, x + a * s, y + b * s, w * s, h * s, c);
  switch (id) {
    case 'cough': R(1, 3, 6, 6, P.milk3); R(2, 6, 4, 1, P.ink); R(8, 3, 1, 1, P.gray); R(9, 5, 2, 1, P.gray); R(8, 7, 1, 1, P.gray); R(10, 8, 1, 1, P.gray2); break;
    case 'fever': R(5, 0, 3, 9, P.ink); R(6, 1, 1, 7, P.milk3); R(6, 4, 1, 4, P.red); R(4, 8, 5, 4, P.ink); R(5, 9, 3, 2, P.red); break;
    case 'rash': R(1, 1, 10, 10, P.rose2); for (const [a, b] of [[3, 3], [7, 2], [5, 6], [2, 8], [8, 8]]) R(a, b, 2, 2, P.red); break;
    case 'chest': R(1, 2, 4, 4, P.red); R(7, 2, 4, 4, P.red); R(2, 5, 8, 3, P.red); R(4, 8, 4, 2, P.red); R(5, 10, 2, 1, P.red); R(6, 1, 1, 10, P.milk3); break;
    case 'dizzy': for (let i = 0; i < 14; i++) { const a = i * 0.9, r = i * 0.38; R(Math.round(5.5 + Math.cos(a) * r), Math.round(5.5 + Math.sin(a) * r), 1, 1, P.ink); } break;
    case 'stomach': R(2, 2, 8, 8, P.rose); R(3, 1, 6, 1, P.rose); R(4, 4, 1, 4, P.red2); R(7, 4, 1, 4, P.red2); R(5, 6, 2, 1, P.red2); break;
    case 'sneeze': R(2, 4, 4, 4, P.milk3); R(6, 3, 1, 1, P.gray); R(8, 5, 1, 1, P.gray); R(7, 7, 1, 1, P.gray); R(10, 4, 1, 1, P.gray); R(10, 8, 1, 1, P.gray); R(9, 6, 2, 1, P.gray); break;
    case 'tired': R(5, 1, 5, 1, P.ink); R(8, 2, 1, 1, P.ink); R(7, 3, 1, 1, P.ink); R(6, 4, 1, 1, P.ink); R(5, 5, 5, 1, P.ink); R(1, 7, 3, 1, P.ash); R(2, 8, 1, 1, P.ash); R(1, 9, 3, 1, P.ash); break;
    case 'swell': R(3, 0, 4, 7, P.milk); R(2, 6, 8, 4, P.rose); R(2, 10, 9, 2, P.milk); R(1, 5, 1, 1, P.red); R(10, 5, 1, 1, P.red); R(0, 7, 1, 1, P.red); R(11, 8, 1, 1, P.red); break;
    case 'pale': D.circle(g, x + 6 * s, y + 6 * s, 5 * s, P.gray3); R(3, 5, 2, 1, P.ash); R(7, 5, 2, 1, P.ash); R(4, 8, 4, 1, P.ash); R(2, 1, 8, 1, P.gray); break;
    case 'moon': D.circle(g, x + 6 * s, y + 6 * s, 5 * s, P.gray2); D.circle(g, x + 8 * s, y + 4 * s, 4 * s, P.ink3); R(1, 10, 3, 1, P.milk3); break;
    case 'head': D.circle(g, x + 6 * s, y + 7 * s, 4 * s, P.milk); R(2, 0, 2, 3, P.red); R(8, 0, 2, 3, P.red); R(5, 0, 2, 2, P.red); break;
    case 'sweat': R(5, 1, 2, 2, P.gray2); R(4, 3, 4, 3, P.gray2); R(3, 6, 6, 4, P.gray2); R(4, 10, 4, 1, P.gray2); R(5, 4, 1, 2, P.milk3); break;
    case 'bruise': R(2, 3, 8, 6, P.red3); R(3, 2, 6, 8, P.red3); R(4, 4, 4, 4, P.red2); R(5, 5, 1, 1, P.rose); break;
    case 'itch': R(1, 2, 2, 8, P.ink); R(4, 2, 2, 8, P.ink); R(7, 2, 2, 8, P.ink); R(0, 1, 11, 1, P.rose); R(0, 10, 11, 1, P.rose); break;
  }
}
function oicon(g, id, x, y, s = 2) { outlined(g, 'dx-' + id + s, 12 * s, 12 * s, a => icon(a, id, 0, 0, s), x, y); }
const DI = { cold: 'cough', flu: 'fever', gastro: 'stomach', anemia: 'pale', sprain: 'swell', insomnia: 'moon', allergy: 'rash', heat: 'sweat', food: 'stomach', heart: 'chest', measles: 'rash' };

export default {
  id: 'diagnosis',
  control: 'tap',
  title: { ja: '診断カード', en: 'Diagnosis Cards', ru: 'Карты диагнозов' },
  desc: { ja: '患者の症状を見て、正しい診断カードを選ぼう。', en: 'Read each patient’s symptoms and pick the right diagnosis card.', ru: 'Смотрите на симптомы и выбирайте верный диагноз.' },
  how: [
    { ja: '症状のアイコンが ひとつずつ出てくる。', en: 'Symptom icons appear one by one.', ru: 'Иконки симптомов появляются по одной.' },
    { ja: '一番よく合う診断カードをタップ。', en: 'Tap the diagnosis that fits best.', ru: 'Нажмите диагноз, который подходит лучше всего.' },
    { ja: '早く当てるほど高得点。連続正解でコンボ。', en: 'Faster answers score more. Streaks make combos.', ru: 'Быстрые ответы дают больше очков. Серии — комбо.' },
    { ja: '難しいと、関係ない症状もまじる。', en: 'On harder levels a misleading symptom may appear.', ru: 'На сложности бывают ложные симптомы.' },
  ],
  ranks: d => [[750, 1200, 1550], [950, 1500, 1950], [1100, 1800, 2300]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L, R = Math.random;
    const nPat = [10, 12, 14][dif - 1];
    const nCards = dif === 1 ? 3 : 4;
    let lim = [7, 6, 5][dif - 1] * (ctx.assist ? 1.3 : 1);
    const symGap = [0.8, 0.65, 0.5][dif - 1];
    let pi = 0, cur = null, t = 0, pt = 0, score = 0, combo = 0, best = 0, right = 0, done = false, success = false;
    let phase = 'enter', phT = 0, oddT = 0, oddDone = false, lastK = '';
    const parts = [], pops = [];
    const pop = (x, y, s, c) => pops.push({ x, y, s, c, t: 0 });
    const CW = nCards === 3 ? 92 : 72, CH = 70;
    const cardX = i => 470 - nCards * (CW + 6) + i * (CW + 6);
    const CY = 186;

    function newPatient() {
      let d; do { d = DIS[(R() * DIS.length) | 0]; } while (d.k === lastK); lastK = d.k;
      let syms = d.s.slice().sort(() => R() - 0.5);
      const mislead = dif >= 2 && pi >= (dif === 2 ? 5 : 2) && R() < 0.5;
      if (mislead) { const others = SYM.filter(s => !d.s.includes(s)); syms.splice(1 + ((R() * 2) | 0), 0, others[(R() * others.length) | 0]); }
      if (dif === 1) syms = syms.slice(0, 3);
      // choose distractors; correct must have strictly highest overlap with shown symptoms
      const score = x => x.s.filter(s => syms.includes(s)).length;
      const top = score(d);
      const pool = DIS.filter(x => x !== d && score(x) < top).sort(() => R() - 0.5);
      // prefer near-misses on harder levels
      pool.sort((a, b) => (score(b) - score(a)) * (dif - 1) + (R() - 0.5));
      const cards = [d, ...pool.slice(0, nCards - 1)].sort(() => R() - 0.5).map(c => ({ d: c, wob: 0, state: 0 }));
      cur = { d, syms, cards, mislead, shown: 0, look: (R() * 3) | 0, hair: (R() * 3) | 0, x: -60 };
      pt = 0; phase = 'enter'; phT = 0;
    }
    newPatient();

    function answer(i) {
      const c = cur.cards[i];
      if (c.d === cur.d) {
        combo++; best = Math.max(best, combo); right++;
        const speed = Math.max(0, 1 - pt / lim);
        const gain = Math.round(60 + 60 * speed + 15 * Math.min(combo - 1, 8));
        score += gain; c.state = 1;
        ctx.sfx(combo >= 3 ? 'combo' : 'good');
        pop(cardX(i) + CW / 2, CY - 12, `${L(T.ok)} +${gain}`, P.red);
        if (combo >= 2) pop(cardX(i) + CW / 2, CY - 26, `${combo} ${L(T.combo)}`, P.ink);
        for (let k = 0; k < 12; k++) { const a = R() * 6.28; parts.push({ x: cardX(i) + CW / 2, y: CY + 30, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60 - 30, l: 0.6, c: k % 2 ? P.red : P.milk3 }); }
      } else {
        combo = 0; c.state = 2; c.wob = 0.4;
        const ci = cur.cards.findIndex(x => x.d === cur.d); cur.cards[ci].state = 3;
        ctx.sfx('bad'); ctx.shake(3); ctx.vibrate(50); pop(cardX(i) + CW / 2, CY - 12, L(T.ng), P.red);
      }
      phase = 'leave'; phT = 0;
    }

    function drawPatient(x, y) {
      seatedPatient(g, x, y, { t, hair: cur.hair, look: cur.look, syms: cur.syms.slice(0, cur.shown) });
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; phT += dt; oddT -= dt;
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 140 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1) pops.splice(i, 1);
        for (const c of cur.cards) c.wob = Math.max(0, c.wob - dt);
        if (phase === 'enter') { cur.x = D.lerp(-60, 96, D.ease(Math.min(1, phT / 0.45))); if (phT > 0.45) { phase = 'ask'; phT = 0; ctx.sfx('pop'); } return; }
        if (phase === 'ask') {
          pt += dt;
          const want = Math.min(cur.syms.length, 1 + Math.floor(pt / symGap));
          if (want > cur.shown) { cur.shown = want; ctx.sfx('tick'); }
          if (pt >= lim) {
            combo = 0; cur.cards.find(x => x.d === cur.d).state = 3; ctx.sfx('bad'); pop(96, 60, L(T.late), P.red);
            phase = 'leave'; phT = 0;
          }
          return;
        }
        if (phase === 'leave') {
          if (phT > 0.9) {
            cur.x = D.lerp(96, 560, D.ease(Math.min(1, (phT - 0.9) / 0.4)));
            if (phT > 1.3) {
              pi++;
              if (pi === Math.floor(nPat * 0.6) && dif >= 2 && !oddDone && !ctx.reduced) { oddDone = true; oddT = 2.2; }
              if (pi >= nPat) { done = true; success = right >= Math.ceil(nPat * 0.6); score += best * 20; ctx.sfx(success ? 'win' : 'lose'); }
              else { newPatient(); lim = Math.max(3.2, lim - 0.08); }
            }
          }
        }
      },
      draw() {
        // clinic exam room: wall, window blind, waiting room door
        station(g,'diagnosis',t);
        for (let y = 22; y < 150; y += 12) D.rect(g, 0, y, 480, 1, P.milk);
        D.rect(g, 0, 150, 480, 120, P.gray3); D.rect(g, 0, 150, 480, 3, P.gray2);
        for (let x = 0; x < 480; x += 32) D.rect(g, x, 153, 1, 117, P.gray2);
        // door to waiting room (left)
        D.rect(g, 6, 34, 64, 120, P.ink); D.rect(g, 8, 36, 60, 116, P.gray);
        D.panel(g, 10, 40, 56, 112, { fill: P.gray2, line: P.ink, shadow: null, r: 1 });
        D.rect(g, 14, 84, 48, 1, P.gray); D.rect(g, 14, 118, 48, 1, P.gray); D.rect(g, 14, 86, 48, 30, P.gray3); D.rect(g, 14, 120, 48, 28, P.gray3);
        D.rect(g, 18, 50, 40, 28, oddT > 0 ? P.ink3 : P.ash); D.rect(g, 18, 50, 40, 2, P.ink3); D.rect(g, 20, 54, 2, 20, P.ash2); D.rect(g, 24, 54, 1, 12, P.ash2);
        D.rect(g, 16, 46, 44, 2, P.ink); D.rect(g, 30, 41, 16, 6, P.milk3); D.rect(g, 30, 41, 16, 1, P.ink); D.text(g, '02', 38, 41, { size: 6, color: P.red, align: 'center' });
        D.rect(g, 52, 94, 10, 4, P.ink); D.rect(g, 53, 95, 8, 2, P.gray3);
        // eye chart + hand-wash poster
        D.panel(g, 104, 38, 46, 62, { fill: P.milk3, line: P.ink, shadow: P.gray2, r: 1 });
        [[6, 0], [5, 1], [4, 2], [3, 3], [2, 4], [2, 5]].forEach(([n, i]) => { const sz = 6 - i; for (let k = 0; k < n; k++) { const ex = Math.round(127 - n * (sz + 2) / 2 + k * (sz + 2)), ey = 44 + i * 9, c = i === 0 ? P.red : P.ink, o = (k + i) % 4; if (sz < 3) { D.rect(g, ex, ey, sz, sz, c); continue; } if (o < 2) { D.rect(g, ex + (o ? sz - 1 : 0), ey, 1, sz, c); for (let j = 0; j < 3; j++) D.rect(g, ex, ey + Math.round(j * (sz - 1) / 2), sz, 1, c); } else { D.rect(g, ex, ey + (o === 3 ? sz - 1 : 0), sz, 1, c); for (let j = 0; j < 3; j++) D.rect(g, ex + Math.round(j * (sz - 1) / 2), ey, 1, sz, c); } } });
        D.rect(g, 108, 94, 38, 1, P.red2);
        if (oddT > 0) { g.globalAlpha = Math.min(1, oddT) * 0.6; D.circle(g, 38, 62, 6, P.gray); D.rect(g, 32, 68, 12, 10, P.gray); g.globalAlpha = 1; }
        D.rect(g, 56, 96, 3, 8, P.ink);
        // desk + chart board
        bezel(g,173,31,136,102);
        D.panel(g, 178, 36, 126, 92, { fill: P.milk3, line: P.ink, shadow: null, r: 4 });
        D.rect(g, 226, 30, 30, 8, P.ash); D.rect(g, 232, 32, 18, 4, P.gray2);
        D.text(g, `${L(T.pt)} ${Math.min(pi + 1, nPat)}/${nPat}`, 241, 40, { size: 12, color: P.ash, align: 'center' });
        // symptom slots
        const n = cur.syms.length, sw = 32;
        const sx0 = 241 - (n * sw) / 2;
        for (let i = 0; i < n; i++) {
          const x = Math.round(sx0 + i * sw), y = 62, pulse = i === cur.shown - 1 && pt - (cur.shown - 1) * symGap < 0.2 ? 2 : 0;
          D.panel(g, x + 1, y - pulse, 30, 30, { fill: i < cur.shown ? P.milk2 : P.gray3, line: i < cur.shown ? P.ink : P.gray2, shadow: null, r: 3 });
          if (i < cur.shown) oicon(g, cur.syms[i], x + 3, y + 3 - pulse, 2);
          else D.text(g, '?', x + 16, y + 8, { size: 12, color: P.gray, align: 'center' });
        }
        if (pi === 0 && phase === 'ask') D.text(g, L(T.hint), 241, 108, { size: 8, color: P.gray, align: 'center' });
        // timer bar
        if (phase === 'ask') { const f = 1 - pt / lim; D.rect(g, 176, 134, 130, 4, P.gray2); D.rect(g, 176, 134, Math.round(130 * f), 4, f < 0.3 ? P.red : P.ash); }
        // patient + chair
        drawPatient(Math.round(cur.x), 140);
        // cards
        cur.cards.forEach((c, i) => {
          let x = cardX(i), y = CY;
          if (c.wob > 0) x += Math.round(Math.sin(c.wob * 60) * 3);
          if (c.state === 1) y -= 6;
          const fill = c.state === 1 ? P.rose2 : c.state === 2 ? P.gray : c.state === 3 ? P.milk3 : P.milk3;
          D.panel(g, x, y, CW, CH, { fill, line: c.state === 3 && Math.floor(t * 6) % 2 ? P.red : P.ink, shadow: P.ash, r: 3 });
          D.rect(g,x+4,y+3,CW-8,1,P.milk3);D.rect(g,x+5,y+CH-5,10,2,P.red2);
          D.rect(g, x + 4, y + 4, CW - 8, 34, P.milk);
          oicon(g, DI[c.d.k], x + CW / 2 - 12, y + 9, 2);
          D.text(g, L(c.d.n), x + CW / 2, y + 44, { size: 12, color: P.ink, align: 'center', maxW: CW - 6 });
          D.cross(g, x + CW - 8, y + 8, 1, P.red);
        });
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 14, { size: 12, color: p.c, align: 'center', shadow: P.milk3 });
        if (combo >= 2) D.text(g, `${combo} ${L(T.combo)}`, 470, 26, { size: 12, color: P.red, align: 'right' });
        if (oddT > 0) { g.globalAlpha = Math.min(1, oddT) * 0.7; D.text(g, L(T.odd), 12, 156, { size: 8, color: P.ash }); g.globalAlpha = 1; }
      },
      down(x, y) {
        if (done || phase !== 'ask') return;
        cur.cards.forEach((c, i) => { if (x >= cardX(i) && x < cardX(i) + CW && y >= CY - 6 && y < CY + CH + 6) answer(i); });
      },
      move() {}, up() {},
      key(code) { const i = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 }[code]; if (i != null && i < nCards && phase === 'ask') answer(i); },
      state() { return { score, time: null, lives: null, progress: pi / nPat, done, success, label: `${right}/${nPat}` }; },
      _dbg() { return { cur, phase }; },
      destroy() {},
    };
  },
};
