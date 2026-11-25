// 監視 Monitor — keep drifting vitals inside the safe band by holding their buttons.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station, bezel } from './pixel-set.js';

const T = {
  stab: { ja: '安定度', en: 'Stability', ru: 'Стабильность' },
  hold: { ja: '長押しで戻す', en: 'Hold to correct', ru: 'Держите' },
  warn: { ja: '危険！', en: 'Danger!', ru: 'Опасно!' },
  good: { ja: '安定', en: 'Stable', ru: 'Норма' },
  glitch: [
    { ja: 'まだ ねむれない', en: 'still awake', ru: 'ещё не сплю' },
    { ja: 'ここに いるよ', en: 'i am here', ru: 'я здесь' },
    { ja: 'みてる？', en: 'watching?', ru: 'смотришь?' },
  ],
  calm: { ja: 'しずかな夜…', en: 'A quiet night…', ru: 'Тихая ночь…' },
};
// dir: which way it naturally drifts (+1 up), button pushes opposite.
const DEF = [
  { k: 'hr', name: { ja: '心拍', en: 'HR', ru: 'ПУЛЬС' }, lo: 40, hi: 160, unit: '', dir: 1, wave: 'ecg' },
  { k: 'spo2', name: { ja: '酸素', en: 'SpO2', ru: 'SpO2' }, lo: 80, hi: 100, unit: '%', dir: -1, wave: 'pleth' },
  { k: 'temp', name: { ja: '体温', en: 'TEMP', ru: 'ТЕМП' }, lo: 35, hi: 41, unit: '°', dir: 1, wave: 'flat', dec: 1 },
  { k: 'drip', name: { ja: '点滴', en: 'DRIP', ru: 'КАПЕЛЬН' }, lo: 0, hi: 100, unit: '%', dir: -1, wave: 'drop' },
  { k: 'bp', name: { ja: '血圧', en: 'BP', ru: 'ДАВЛ' }, lo: 80, hi: 200, unit: '', dir: 1, wave: 'pleth' },
];
const SAFE = [0.36, 0.64], RED = [0.14, 0.86];

export default {
  id: 'monitor',
  control: 'hold',
  title: { ja: '監視', en: 'Monitor', ru: 'Монитор' },
  desc: { ja: '揺れ動くバイタルを、ボタン長押しで安全域に保とう。', en: 'Hold the buttons to keep drifting vitals inside the safe band.', ru: 'Удерживайте кнопки, чтобы показатели оставались в норме.' },
  how: [
    { ja: '各メーターは少しずつ ずれていく。', en: 'Each meter slowly drifts away from normal.', ru: 'Каждый показатель постепенно уходит от нормы.' },
    { ja: '下のボタンを長押しすると、矢印の方向へ戻る。押しすぎ注意。', en: 'Hold the button below to push it the arrow’s way. Don’t overdo it.', ru: 'Держите кнопку снизу — стрелка покажет направление. Не перестарайтесь.' },
    { ja: '赤いゾーンに長くいると安定度が減る。', en: 'Staying in the red drains stability.', ru: 'Красная зона снижает стабильность.' },
    { ja: 'ときどき画面が おかしくなる。…気にしないで。', en: 'Sometimes a screen acts strange. …Ignore it.', ru: 'Иногда экран ведёт себя странно. …Не обращайте внимания.' },
  ],
  ranks: d => [[350, 560, 720], [430, 700, 880], [500, 820, 1040]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L, R = Math.random;
    const n = dif + 2;
    const order = [0, 1, 2, 3, 4];
    const meters = order.slice(0, n).map((i, j) => ({
      ...DEF[i], v: 0.5 + (R() - 0.5) * 0.1, vel: 0, base: (0.035 + R() * 0.02) * (0.8 + dif * 0.25), held: 0, redT: 0,
      wave: DEF[i].wave, buf: new Array(40).fill(0), ph: R() * 6, glitch: 0, gmsg: 0, surge: 0, safeT: 0, flash: 0,
    }));
    let timeLeft = 45, t = 0, stab = 100, score = 0, done = false, success = false, glitchT = 9 + R() * 5;
    let scoreAcc = 0, alarmCd = 0, beatCd = 0, dim = 0, calmT = 0;
    const holds = new Map(); const pops = [], parts = [];
    const pushRate = 0.32 * (ctx.assist ? 0.85 : 1);
    const redRate = [9, 12, 15][dif - 1] * (ctx.assist ? 0.7 : 1);
    const colW = Math.floor(452 / n), x0 = Math.floor((480 - colW * n) / 2);
    const colX = i => x0 + i * colW;
    const pop = (x, y, s, c) => pops.push({ x, y, s, c, t: 0 });

    function zone(v) { return v < RED[0] || v > RED[1] ? 2 : v < SAFE[0] || v > SAFE[1] ? 1 : 0; }
    function readout(m) { const val = D.lerp(m.lo, m.hi, D.clamp(m.v, 0, 1)); return (m.dec ? val.toFixed(1) : Math.round(val)) + m.unit; }
    function btnRect(i) { return { x: colX(i) + 4, y: 216, w: colW - 8, h: 44 }; }
    function hitBtn(x, y) { for (let i = 0; i < n; i++) { const b = btnRect(i); if (x >= b.x && x < b.x + b.w && y >= b.y - 12 && y < b.y + b.h + 6) return i; } for (let i = 0; i < n; i++) if (x >= colX(i) && x < colX(i) + colW && y > 30) return i; return -1; }
    function recount() { for (const m of meters) m.held = 0; for (const i of holds.values()) meters[i].held = 1; }

    function waveSample(m, ph) {
      if (m.glitch > 0) return 0;
      if (m.wave === 'ecg') { const p = ph % 1; return p < 0.06 ? -p * 6 : p < 0.1 ? 1 : p < 0.14 ? -0.5 : p > 0.35 && p < 0.45 ? 0.2 : 0; }
      if (m.wave === 'pleth') { const p = ph % 1; return Math.sin(p * Math.PI) ** 3 * 0.8; }
      if (m.wave === 'drop') { const p = ph % 1; return p < 0.15 ? 0.6 : 0; }
      return Math.sin(ph * 0.8) * 0.15;
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; timeLeft -= dt; alarmCd -= dt; beatCd -= dt; dim = Math.max(0, dim - dt * 0.5);
        const ramp = 1 + t / 45 * 0.6;
        let anyRed = 0, allSafe = true;
        for (const m of meters) {
          m.flash = Math.max(0, m.flash - dt);
          if (m.glitch > 0) {
            m.glitch -= dt;
            if (m.glitch <= 0) { m.flash = 0.3; ctx.sfx('beep'); }
            m.buf.push(0); m.buf.shift();
            continue;
          }
          // drift: bias in natural dir + wandering noise + occasional surge
          m.vel += ((R() - 0.5) * 0.25) * dt * 6; m.vel *= 0.96;
          if (m.surge > 0) m.surge -= dt; else if (R() < dt * 0.06 * dif) { m.surge = 1.2; }
          const drift = m.dir * m.base * ramp * (m.surge > 0 ? 2.6 : 1) + m.vel * 0.05;
          m.v += drift * dt;
          if (m.held) m.v -= m.dir * pushRate * dt;
          m.v = D.clamp(m.v, 0, 1);
          const z = zone(m.v);
          if (z === 2) { m.redT += dt; anyRed++; allSafe = false; }
          else { m.redT = 0; if (z === 1) allSafe = false; else { scoreAcc += dt * 4; m.safeT += dt; } }
          const hz = m.k === 'hr' ? 0.8 + m.v * 2.2 : m.k === 'drip' ? 0.6 : 1.1;
          m.ph += dt * hz;
          m.buf.push(waveSample(m, m.ph)); m.buf.shift();
        }
        if (anyRed) {
          stab -= redRate * dt * (0.6 + anyRed * 0.4);
          if (alarmCd <= 0) { ctx.sfx('alarm'); alarmCd = 1.1; ctx.vibrate(30); }
        } else if (allSafe) { stab = Math.min(100, stab + dt * 3); calmT += dt; } else calmT = 0;
        if (calmT > 8) { calmT = 0; pop(240, 40, L(T.calm), P.gray2); score += 20; ctx.sfx('good'); }
        const whole = Math.floor(scoreAcc); if (whole) { score += whole; scoreAcc -= whole; }
        // eerie glitch: one meter silently flatlines, then recovers
        glitchT -= dt;
        if (glitchT <= 0) {
          const m = meters[(R() * n) | 0];
          if (m.glitch <= 0) { m.glitch = 2.2 + R() * 1.4; m.gmsg = (R() * T.glitch.length) | 0; dim = 0.6; }
          glitchT = 11 + R() * 7;
        }
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1.4) pops.splice(i, 1);
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        if (stab <= 0) { stab = 0; done = true; success = false; ctx.sfx('lose'); ctx.shake(3); }
        else if (timeLeft <= 0) { timeLeft = 0; done = true; success = true; score += Math.round(stab * 2); ctx.sfx('win'); }
      },
      draw() {
        // room: dark ward, window w/ moon, bed silhouette behind monitors
        station(g,'monitor',t);
        for (let i = 0; i < n; i++) {
          const m = meters[i], x = colX(i), w = colW - 4;
          const z = m.glitch > 0 ? -1 : zone(m.v);
          const blink = z === 2 && Math.floor(t * 6) % 2;
          bezel(g,x+2,30,w,180,{invert:true});
          D.panel(g, x + 5, 34, w-6, 172, { fill: P.ink3, line: blink ? P.red : P.ash2, shadow: null, r: 3 });
          // label + readout
          D.text(g, L(m.name), x + 8, 34, { size: 12, color: z === 2 ? P.rose : P.gray2 });
          const ro = m.glitch > 0 ? '- - -' : readout(m);
          D.text(g, ro, x + w - 4, 34, { size: 12, color: z === -1 ? P.ash2 : z === 2 ? P.red : z === 1 ? P.rose2 : P.milk3, align: 'right' });
          // waveform
          const wx = x + 8, wy = 66, ww = w - 12;
          D.rect(g, wx, wy - 14, ww, 28, P.ink2);
          for (let k = 1; k < m.buf.length; k++) {
            const ax = wx + ((k - 1) * ww / m.buf.length) | 0, bx = wx + (k * ww / m.buf.length) | 0;
            D.line(g, ax, wy - m.buf[k - 1] * 12, bx, wy - m.buf[k] * 12, m.glitch > 0 ? P.ash2 : z === 2 ? P.red : P.milk);
          }
          // gauge
          const gx = x + 8, gy = 90, gh = 110, gw = Math.min(30, w - 46);
          D.rect(g, gx, gy, gw, gh, P.ink2);
          const ys = v => Math.round(gy + gh - v * gh);
          D.rect(g, gx, ys(1), gw, ys(RED[1]) - ys(1), P.red3);
          D.rect(g, gx, ys(RED[0]), gw, ys(0) - ys(RED[0]), P.red3);
          D.rect(g, gx, ys(SAFE[1]), gw, ys(SAFE[0]) - ys(SAFE[1]), P.ash);
          D.stroke(g, gx, gy, gw, gh, P.ash2);
          if (m.glitch <= 0) {
            const vy = ys(m.v);
            D.rect(g, gx - 3, vy - 1, gw + 6, 3, z === 2 ? P.red : z === 1 ? P.rose2 : P.milk3);
            D.rect(g, gx + gw + 4, vy - 2, 3, 5, P.milk);
          } else {
            D.rect(g, gx, gy + gh - 2, gw, 2, P.ash2);
            g.globalAlpha = 0.5 + 0.3 * Math.sin(t * 2);
            D.text(g, L(T.glitch[m.gmsg]), x + 2 + w / 2, 160, { size: 12, color: P.gray, align: 'center', maxW: w - 6, shadow: P.ink });
            g.globalAlpha = 1;
          }
          // channel icon in the free space next to the gauge
          { const ix = Math.round((gx + gw + 8 + x + w - 4) / 2), iy = 112, hot = z === 2, beat = m.k === 'hr' && (t * 2.2) % 1 < 0.15 ? 1 : 0;
            if (m.k === 'hr') { const r = 6 + beat; D.circle(g, ix - 4, iy - 3, r, P.ink); D.circle(g, ix + 4, iy - 3, r, P.ink); for (let k = 0; k < 10 + beat; k++) D.rect(g, ix - 10 - beat + k, iy - 2 + k, 21 + beat * 2 - k * 2, 1, P.ink); D.circle(g, ix - 4, iy - 3, r - 1, hot ? P.red : P.red2); D.circle(g, ix + 4, iy - 3, r - 1, hot ? P.red : P.red2); for (let k = 0; k < 9 + beat; k++) D.rect(g, ix - 9 - beat + k, iy - 2 + k, 19 + beat * 2 - k * 2, 1, hot ? P.red : P.red2); D.rect(g, ix - 7, iy - 6, 2, 2, P.rose); }
            else if (m.k === 'spo2') { D.rect(g, ix - 6, iy - 14, 12, 24, P.ink); D.rect(g, ix - 5, iy - 13, 10, 22, P.gray3); D.rect(g, ix - 5, iy - 13, 10, 3, P.milk3); D.rect(g, ix - 10, iy - 4, 20, 10, P.ink); D.rect(g, ix - 9, iy - 3, 18, 8, hot ? P.red : P.ash2); D.rect(g, ix - 9, iy - 3, 18, 2, hot ? P.rose : P.gray); D.rect(g, ix + 6, iy + 2, 2, 2, (t * 3) % 1 < .5 ? P.red : P.red3); D.line(g, ix + 10, iy + 1, ix + 14, iy + 12, P.ash2); }
            else if (m.k === 'temp') { D.rect(g, ix - 3, iy - 16, 7, 24, P.ink); D.rect(g, ix - 2, iy - 15, 5, 22, P.milk3); D.circle(g, ix, iy + 9, 5, P.ink); D.circle(g, ix, iy + 9, 4, P.red); const lv = Math.round(4 + m.v * 16); D.rect(g, ix - 1, iy + 7 - lv, 3, lv, P.red); for (let k = 0; k < 5; k++) D.rect(g, ix + 4, iy - 12 + k * 4, 2, 1, P.gray); D.rect(g, ix - 1, iy + 7, 1, 2, P.rose); }
            else if (m.k === 'drip') { D.rect(g, ix - 9, iy - 16, 18, 20, P.ink); D.rect(g, ix - 8, iy - 15, 16, 18, P.milk2); const lv = Math.round(m.v * 14); D.rect(g, ix - 8, iy + 3 - lv, 16, lv, P.rose2); D.rect(g, ix - 8, iy + 3 - lv, 16, 1, P.rose); D.rect(g, ix - 6, iy - 13, 2, 12, P.milk3); D.rect(g, ix - 2, iy - 19, 4, 3, P.ink); D.rect(g, ix - 2, iy + 4, 4, 5, P.ink); D.rect(g, ix - 1, iy + 5, 2, 3, P.gray2); const dr = ((t * 1.6) % 1) * 8 | 0; D.rect(g, ix - 1, iy + 9 + dr, 2, 2, hot ? P.red : P.rose); }
            else { D.rect(g, ix - 11, iy - 8, 22, 14, P.ink); D.rect(g, ix - 10, iy - 7, 20, 12, P.ash2); for (let k = 0; k < 4; k++) D.rect(g, ix - 8 + k * 5, iy - 7, 1, 12, P.ash); D.line(g, ix, iy + 6, ix, iy + 12, P.ink, 2); D.circle(g, ix, iy + 14, 4, P.ink); D.circle(g, ix, iy + 14, 3, hot ? P.red : P.red2); }
          }
          // side mini trend arrow (natural drift dir)
          if (m.glitch <= 0) {
            const ax = x + w - 12, ay = 150;
            D.text(g, m.dir > 0 ? '▲' : '▼', ax, ay, { size: 12, color: m.surge > 0 ? P.red : P.ash2, align: 'center' });
          }
          if (m.flash > 0) { g.globalAlpha = m.flash; D.rect(g, x + 3, 31, w - 2, 178, P.milk3); g.globalAlpha = 1; }
          // button
          const b = btnRect(i), pressed = m.held;
          D.panel(g, b.x, b.y + (pressed ? 2 : 0), b.w, b.h - 2, { fill: pressed ? P.red2 : P.red, line: P.ink, shadow: pressed ? null : P.red3, r: 3 });
          D.rect(g, b.x + 3, b.y + 2 + (pressed ? 2 : 0), b.w - 6, 2, pressed ? P.red : P.rose);
          D.text(g, m.dir > 0 ? '▼' : '▲', b.x + b.w / 2, b.y + 6 + (pressed ? 2 : 0), { size: 16, color: P.milk3, align: 'center' });
          if (t < 5 && i === 0) D.text(g, L(T.hold), b.x + b.w / 2, b.y + 26, { size: 8, color: P.milk3, align: 'center' });
        }
        // stability bar (bottom-left over buttons top)
        D.rect(g, 14, 211, 452, 4, P.ink3);
        D.rect(g, 14, 211, Math.round(452 * stab / 100), 4, stab < 30 ? P.red : stab < 60 ? P.rose : P.milk);
        D.text(g, `${L(T.stab)} ${Math.round(stab)}`, 18, 24, { size: 8, color: P.gray, align: 'left' });
        for (const p of pops) { g.globalAlpha = Math.max(0, 1 - p.t / 1.4); D.text(g, p.s, p.x, p.y - p.t * 8, { size: 12, color: p.c, align: 'center' }); g.globalAlpha = 1; }
        // scanlines + glitch dim
        g.globalAlpha = 0.12; for (let y = 24; y < 210; y += 3) D.rect(g, 0, y, 480, 1, P.ink); g.globalAlpha = 1;
        if (dim > 0) { g.globalAlpha = dim * 0.4; D.rect(g, 0, 22, 480, 248, P.ink); g.globalAlpha = 1; }
      },
      down(x, y, id) { if (done) return; const i = hitBtn(x, y); if (i >= 0) { holds.set(id, i); recount(); ctx.sfx('click'); } },
      move(x, y, id) { if (!holds.has(id)) return; const i = hitBtn(x, y); if (i >= 0 && i !== holds.get(id)) { holds.set(id, i); recount(); } },
      up(x, y, id) { holds.delete(id); recount(); },
      key(code) {
        const i = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4 }[code];
        if (i != null && i < n && meters[i].glitch <= 0) { meters[i].v = D.clamp(meters[i].v - meters[i].dir * 0.05, 0, 1); ctx.sfx('click'); }
      },
      state() { return { score, time: Math.ceil(timeLeft), lives: null, progress: Math.max(0, stab / 100), done, success, label: `${L(T.stab)} ${Math.round(stab)}%` }; },
      _dbg() { return { meters, stab }; },
      destroy() { holds.clear(); },
    };
  },
};
