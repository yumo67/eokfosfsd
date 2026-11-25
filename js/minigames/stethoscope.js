// 聴診 Stethoscope — find hidden heart/lung sounds by pulse feedback; know when there is none.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station, bezel } from './pixel-set.js';

const T = {
  heart: { ja: '心音', en: 'Heart', ru: 'Сердце' },
  lung: { ja: '呼吸音', en: 'Lungs', ru: 'Лёгкие' },
  lungR: { ja: '右の呼吸音', en: 'Right lung', ru: 'Правое лёгкое' },
  lungL: { ja: '左の呼吸音', en: 'Left lung', ru: 'Левое лёгкое' },
  nopulse: { ja: '脈なし', en: 'No pulse', ru: 'Нет пульса' },
  found: { ja: '聞こえた！', en: 'Got it!', ru: 'Слышно!' },
  wrong: { ja: 'まだ 音がある…', en: 'There is a sound…', ru: 'Звук есть…' },
  right: { ja: '…確認しました', en: '…Confirmed', ru: '…Подтверждено' },
  patient: { ja: '患者', en: 'Patient', ru: 'Пациент' },
  chart: { ja: '聴診記録', en: 'Auscultation', ru: 'Аускультация' },
  drag: { ja: '聴診器をドラッグ', en: 'Drag the stethoscope', ru: 'Тяните стетоскоп' },
  holdit: { ja: '強く響く所で 長押し', en: 'Hold where it beats loudest', ru: 'Держите, где громче всего' },
  more: { ja: 'もう少し 聴いて…', en: 'Listen a little longer…', ru: 'Послушайте ещё…' },
  bed4: [
    { ja: '……', en: '……', ru: '……' },
    { ja: 'しずか', en: 'so quiet', ru: 'так тихо' },
    { ja: 'つめたい', en: 'cold', ru: 'холодно' },
    { ja: '4番ベッド', en: 'Bed 4', ru: 'Койка 4' },
  ],
};
const BX = 186; // body center x

function inBody(x, y) {
  if (y >= 96 && y <= 236) { const half = y < 120 ? 48 + (y - 96) * 0.6 : 62 - Math.max(0, y - 190) * 0.25; return Math.abs(x - BX) <= half; }
  return D.dist(x, y, BX, 64) < 22;
}

export default {
  id: 'stethoscope',
  control: 'drag',
  title: { ja: '聴診', en: 'Stethoscope', ru: 'Стетоскоп' },
  desc: { ja: '聴診器を当てて、心音と呼吸音の場所を探しあてよう。', en: 'Slide the stethoscope to locate hidden heart and lung sounds.', ru: 'Водите стетоскопом, чтобы найти сердце и дыхание.' },
  how: [
    { ja: '聴診器をドラッグして体の上を探る。', en: 'Drag the stethoscope across the body.', ru: 'Ведите стетоскоп по телу.' },
    { ja: '近いほど輪が赤く、鼓動が速くなる。', en: 'The closer you are, the redder the ring and faster the beat.', ru: 'Чем ближе — тем краснее кольцо и чаще стук.' },
    { ja: '一番響く場所で長押しして確定。', en: 'Hold on the loudest spot to confirm.', ru: 'Удерживайте в самой громкой точке.' },
    { ja: 'どこにも鼓動がない時は「脈なし」を押す。', en: 'If there is no heartbeat anywhere, press “No pulse”.', ru: 'Если пульса нигде нет — жмите «Нет пульса».' },
  ],
  ranks: d => [[220, 380, 520], [350, 600, 820], [450, 780, 1050]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L, R = Math.random;
    const bed4 = ctx.special === 'bed4';
    const nP = bed4 ? 1 : [4, 5, 5][dif - 1];
    const nPts = [1, 2, 3][dif - 1];
    const rad = [11, 8, 6][dif - 1] * (ctx.assist ? 1.3 : 1);
    const holdNeed = 0.8;
    const noIdx = bed4 ? 0 : 1 + ((R() * (nP - 1)) | 0);
    let timeLeft = bed4 ? 0 : [70, 70, 75][dif - 1] * (ctx.assist ? 1.3 : 1);
    let t = 0, score = 0, done = false, success = false, pi = -1, correct = 0, mistakes = 0;
    let pat = null, sx = 300, sy = 200, ptr = null, holdT = 0, beatCd = 0, pulse = 0, prox = 0, trans = 0, searchT = 0, msgT = 0, msg = null, bedMsg = 0;
    const parts = [], pops = [];
    const pop = (x, y, s, c = P.ink) => pops.push({ x, y, s, c, t: 0 });
    const NP = { x: 344, y: 212, w: 120, h: 34 };

    function newPatient() {
      pi++; holdT = 0; searchT = 0; sx = 300; sy = 200;
      const none = pi === noIdx;
      const pts = [];
      if (!none) {
        pts.push({ k: 'heart', x: BX + 8 + ((R() * 26) | 0), y: 136 + ((R() * 34) | 0), found: false });
        for (let i = 1; i < nPts; i++) { const side = i === 1 ? -1 : 1; pts.push({ k: 'lung', lab: side < 0 ? 'lungR' : 'lungL', x: BX + side * (22 + ((R() * 18) | 0)), y: 114 + ((R() * 60) | 0), found: false }); }
        if (nPts === 3 && D.dist(pts[0].x, pts[0].y, pts[2].x, pts[2].y) < 26) pts[2].y = pts[0].y > 150 ? 112 : 196;
      }
      pat = { none, faint: none && !bed4 && R() < 0.5, pts, hair: (R() * 3) | 0, blink: 2 + R() * 2, breathe: R() * 6 };
    }
    newPatient();

    function nearest() { let b = null, bd = 1e9; for (const p of pat.pts) if (!p.found) { const d = D.dist(sx, sy, p.x, p.y); if (d < bd) { bd = d; b = p; } } return [b, bd]; }
    function endPatient() { trans = 1.1; if (pi + 1 >= nP) { done = true; success = bed4 ? true : correct >= Math.ceil(nP * 0.6); if (!bed4) score += Math.round(Math.max(0, timeLeft) * 2); ctx.sfx(success ? 'win' : 'lose'); trans = 0; } }
    function pressNoPulse() {
      if (done || trans > 0) return;
      if (bed4) {
        if (searchT < 8) { msg = L(T.more); msgT = 2; ctx.sfx('tick'); return; }
        score = 100; correct = 1; ctx.sfx('beep'); pop(240, 120, L(T.right), P.gray2); endPatient(); return;
      }
      if (pat.none) { correct++; score += 100 + Math.min(40, Math.round(40 - searchT * 3)); ctx.sfx('good'); pop(BX, 80, L(T.right), P.ink); endPatient(); }
      else { mistakes++; score = Math.max(0, score - 40); ctx.sfx('bad'); ctx.shake(2); pop(BX, 80, L(T.wrong), P.red); timeLeft -= 4; }
    }

    function drawBody() {
      const br = (pat.none ? 0 : Math.round(Math.sin(t * 1.6 + pat.breathe))) || 0;
      const skin = bed4 ? P.ash : pat.none ? P.gray3 : P.milk;
      const ln = bed4 ? P.ink2 : P.ink;
      // table / bed
      if (!bed4) { D.rect(g, 88, 232, 196, 12, P.ink); D.rect(g, 89, 233, 194, 4, P.milk2); D.rect(g, 89, 237, 194, 6, P.gray); for (let x = 96; x < 280; x += 22) D.rect(g, x, 238, 12, 3, P.gray2); D.rect(g, 100, 244, 6, 26, P.ink3); D.rect(g, 266, 244, 6, 26, P.ink3); }
      // arms
      D.panel(g, BX - 76, 112 + br, 22, 110, { fill: skin, line: ln, shadow: null, r: 6 });
      D.panel(g, BX + 54, 112 + br, 22, 110, { fill: skin, line: ln, shadow: null, r: 6 });
      // torso
      g.fillStyle = ln; for (let y = 94; y <= 238; y++) { const half = y < 120 ? 48 + (y - 96) * 0.6 : 62 - Math.max(0, y - 190) * 0.25; g.fillRect(Math.round(BX - half) - 1, y + br, Math.round(half * 2) + 2, 1); }
      g.fillStyle = skin; for (let y = 96; y <= 236; y++) { const half = y < 120 ? 48 + (y - 96) * 0.6 : 62 - Math.max(0, y - 190) * 0.25; g.fillRect(Math.round(BX - half), y + br, Math.round(half * 2), 1); }
      if (!bed4) {
        // anatomy: deltoids, collarbones, chest, ribs, belly
        for (const sd of [-1, 1]) {
          const ax = BX + sd * 65;
          D.rect(g, ax - 9, 116 + br, 18, 2, P.milk2); D.rect(g, ax + (sd < 0 ? -10 : 8), 120 + br, 2, 96, P.gray3);
          D.rect(g, ax - 8, 168 + br, 16, 1, P.gray3); // elbow crease
          for (let k = 0; k < 18; k++) D.rect(g, BX + sd * (12 + k * 2.4), 103 + br + Math.round(Math.sin(k / 18 * Math.PI) * -2 + k * 0.25), 2, 1, P.gray2);
          for (let k = 0; k < 22; k++) { const yy = 150 + br + Math.round(Math.sin(k / 22 * Math.PI) * 4); D.rect(g, BX + sd * (6 + k * 1.6), yy, 2, 1, P.gray3); }
          for (let r = 0; r < 3; r++) D.rect(g, BX + sd * (30 + r * 2) - (sd < 0 ? 12 : 0), 166 + r * 9 + br, 12, 1, P.milk2);
        }
        D.rect(g, BX - 9, 99 + br, 18, 2, P.gray3); D.rect(g, BX, 112 + br, 1, 80, P.gray3);
        D.rect(g, BX - 26, 146 + br, 3, 3, P.rose); D.rect(g, BX + 24, 146 + br, 3, 3, P.rose);
        D.rect(g, BX - 1, 196 + br, 3, 2, P.gray2);
        D.rect(g, BX + 56, 196 + br, 18, 5, P.ink); D.rect(g, BX + 57, 197 + br, 16, 3, P.milk3); D.rect(g, BX + 60, 197 + br, 4, 3, P.red); // ID band
        // gown folded at the waist
        D.rect(g, BX - 63, 204 + br, 126, 32, P.ink); D.rect(g, BX - 62, 205 + br, 124, 30, P.gray2);
        D.rect(g, BX - 62, 205 + br, 124, 3, P.milk); for (let x = BX - 58; x < BX + 60; x += 9) { D.rect(g, x, 209 + br, 1, 26, P.gray); D.rect(g, x + 1, 209 + br, 1, 26, P.gray3); }
        for (let x = BX - 54; x < BX + 56; x += 18) D.cross(g, x + 4, 222 + br, 1, P.rose);
        // hands resting on the table
        for (const sd of [-1, 1]) { const ax = BX + sd * 65; D.rect(g, ax - 10, 218 + br, 20, 14, P.ink); D.rect(g, ax - 9, 219 + br, 18, 12, skin); D.rect(g, ax - 9, 219 + br, 18, 2, P.milk2); for (let k = 0; k < 3; k++) D.rect(g, ax - 5 + k * 5, 226 + br, 1, 5, P.gray2); D.rect(g, ax + (sd < 0 ? 6 : -9), 222 + br, 3, 6, P.gray3); }
        // sloped shoulders (trapezius)
        for (let k = 0; k < 10; k++) { const w = 10 - k; for (const sd of [-1, 1]) { const x0 = sd < 0 ? BX - 49 : BX + 49 - w; D.rect(g, x0, 93 + k + br, w, 1, P.milk); D.rect(g, sd < 0 ? x0 + w : x0 - 1, 93 + k + br, 1, 1, P.ink); } }
      }
      // neck + head
      D.rect(g, BX - 9, 80 + br, 18, 18, ln); D.rect(g, BX - 8, 80 + br, 16, 18, skin);
      D.circle(g, BX, 62 + br, 22, ln); D.circle(g, BX, 62 + br, 21, skin);
      if (!bed4) { D.circle(g, BX, 56 + br, 22, ln); D.circle(g, BX, 56 + br, 21, [P.ink2, P.ash, P.red3][pat.hair]); D.circle(g, BX, 66 + br, 18, skin); D.rect(g, BX - 18, 52 + br, 36, 8, [P.ink2, P.ash, P.red3][pat.hair]); for (let i = 0; i < 5; i++) D.rect(g, BX - 15 + i * 7, 60 + br, 4, 2, [P.ink2, P.ash, P.red3][pat.hair]); }
      if (bed4) { if (t > 12 && Math.floor(t / 7) % 2) D.rect(g, BX - 6, 58, 12, 1, P.ink2); return; }
      D.rect(g, BX - 23, 62 + br, 4, 8, ln); D.rect(g, BX - 22, 63 + br, 3, 6, skin); D.rect(g, BX + 19, 62 + br, 4, 8, ln); D.rect(g, BX + 19, 63 + br, 3, 6, skin);
      { const hc = [P.ink2, P.ash, P.red3][pat.hair]; D.rect(g, BX - 10, 41 + br, 8, 2, hc === P.ink2 ? P.ash : P.gray); D.rect(g, BX - 12, 44 + br, 4, 1, hc === P.ink2 ? P.ash : P.gray); }
      D.rect(g, BX - 10, 58 + br, 6, 1, P.ash); D.rect(g, BX + 4, 58 + br, 6, 1, P.ash); D.rect(g, BX, 67 + br, 2, 3, P.gray3);
      const closed = pat.none || (t % pat.blink) < 0.12;
      if (closed) { D.rect(g, BX - 10, 64 + br, 6, 1, P.ink); D.rect(g, BX + 4, 64 + br, 6, 1, P.ink); }
      else { for (const ex of [BX - 9, BX + 5]) { D.rect(g, ex, 61 + br, 5, 4, P.ink); D.rect(g, ex + 1, 62 + br, 2, 2, P.ash2); D.rect(g, ex + 1, 61 + br, 1, 1, P.milk3); } }
      D.rect(g, BX - 3, 74 + br, 6, 1, pat.none ? P.gray : P.rose);
      if (!pat.none) { D.rect(g, BX - 14, 69 + br, 3, 1, P.rose2); D.rect(g, BX + 11, 69 + br, 3, 1, P.rose2); }
    }

    function drawScope() {
      const c = prox > 0.75 ? P.red : prox > 0.4 ? P.rose : P.gray2;
      // rubber tube curving up to the earpieces off-panel
      let px0 = sx + 6, py0 = sy - 6;
      for (let i = 1; i <= 16; i++) { const u = i / 16; const x1 = sx + 6 + u * 30 + Math.sin(u * 3.1) * 18, y1 = (sy - 6) + (22 - (sy - 6)) * u; D.line(g, px0, py0, x1, y1, P.ink, 3); D.line(g, px0, py0, x1, y1, P.ash, 1); px0 = x1; py0 = y1; }
      D.rect(g, sx + 3, sy - 9, 5, 5, P.ink); D.rect(g, sx + 4, sy - 8, 3, 3, P.gray2);
      const pr = Math.round(10 + pulse * 10);
      if (pulse > 0.05) D.ring(g, sx, sy, pr, c, pulse > 0.5 ? 2 : 1);
      D.circle(g, sx, sy, 9, P.ink); D.circle(g, sx, sy, 8, P.gray); D.circle(g, sx - 1, sy - 1, 7, P.gray2); D.circle(g, sx, sy, 5, P.ink3); D.circle(g, sx, sy, 4, P.milk); D.rect(g, sx - 3, sy - 3, 2, 2, P.milk3); D.rect(g, sx - 6, sy - 5, 2, 1, P.milk3);
      if (holdT > 0) { const n = Math.round(24 * holdT / holdNeed); for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i / 24 * 6.283; D.rect(g, Math.round(sx + Math.cos(a) * 14), Math.round(sy + Math.sin(a) * 14), 2, 2, P.red); } }
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; beatCd -= dt; msgT -= dt; pulse = Math.max(0, pulse - dt * 2.2);
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 100 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1.2) pops.splice(i, 1);
        if (trans > 0) { trans -= dt; if (trans <= 0) newPatient(); return; }
        if (!bed4) { timeLeft -= dt; if (timeLeft <= 0) { timeLeft = 0; done = true; success = correct >= Math.ceil(nP * 0.6); ctx.sfx(success ? 'win' : 'lose'); return; } }
        const on = inBody(sx, sy);
        if (ptr && on) searchT += dt;
        if (bed4) { bedMsg = Math.min(T.bed4.length - 1, Math.floor(searchT / 4)); prox = 0; return; }
        const [tg, d] = nearest();
        prox = tg && on ? D.clamp(1 - d / 110, 0, 1) : 0;
        if (on && ptr) {
          if (tg) {
            const iv = D.lerp(1.3, 0.26, prox * prox);
            if (beatCd <= 0) { beatCd = tg.k === 'lung' ? iv * 1.6 : iv; pulse = 0.3 + prox * 0.7; ctx.sfx(tg.k === 'lung' ? 'whoosh' : 'beat'); if (prox > 0.85) ctx.vibrate(10); }
          } else if (pat.faint && beatCd <= 0) { beatCd = 3 + R() * 2; pulse = 0.12; }
        }
        if (tg && ptr && d <= rad) {
          holdT += dt;
          if (holdT >= holdNeed) {
            tg.found = true; holdT = 0; const gain = 60 + Math.max(0, Math.round(30 - searchT * 2)); score += gain;
            ctx.sfx('good'); pop(tg.x, tg.y - 20, L(T.found), P.red);
            for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; parts.push({ x: tg.x, y: tg.y, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, l: 0.6, c: i % 2 ? P.red : P.rose2 }); }
            if (pat.pts.every(p => p.found)) { correct++; score += 30; endPatient(); }
          }
        } else holdT = Math.max(0, holdT - dt * 2);
      },
      draw() {
        if (bed4) {
          station(g,'empty',t);
          D.rect(g, 40, 30, 300, 220, P.ink2);
          // curtain with silhouette shadow
          drawBody();
          g.globalAlpha = 0.82; D.rect(g, 40, 30, 300, 220, P.gray);
          for (let x = 40; x < 340; x += 12) { const sw = Math.round(Math.sin(t * 0.5 + x * 0.05) * 1); D.rect(g, x + sw, 30, 12, 220, (x / 12) % 2 ? P.gray : P.ash2); }
          g.globalAlpha = 1;
          D.rect(g, 36, 26, 308, 4, P.ash);
          for (let x = 44; x < 340; x += 24) D.ring(g, x, 28, 3, P.gray);
        } else {
          station(g,'stethoscope',t);
          D.rect(g, 0, 22, 480, 170, P.milk);
          for (let x = 0; x < 480; x += 40) D.rect(g, x, 22, 1, 170, P.milk2);
          D.rect(g, 0, 190, 480, 80, P.gray2); D.rect(g, 0, 190, 480, 2, P.gray);
          // eye chart + lamp
          D.panel(g, 40, 40, 34, 48, { fill: P.milk3, line: P.ash, shadow: null }); for (let i = 0; i < 5; i++) D.rect(g, 57 - (5 - i) * 2, 46 + i * 8, (5 - i) * 4, 3 - (i > 2 ? 1 : 0), P.ink);
          D.cross(g, 300, 50, 4, P.red);
          drawBody();
        }
        // chart panel
        bezel(g,341,27,126,180,{invert:bed4});
        D.panel(g, 345, 31, 118, 172, { fill: bed4 ? P.ink3 : P.milk2, line: P.ink, shadow: null, r: 3 });
        D.text(g, L(T.chart), 404, 36, { size: 12, color: bed4 ? P.gray : P.ink, align: 'center' });
        if (!bed4) D.text(g, `${L(T.patient)} ${pi + 1}/${nP}`, 404, 52, { size: 12, color: P.ash, align: 'center' });
        // what you hear: waveform
        D.rect(g, 352, 70, 104, 34, P.ink2);
        for (let i = 0; i < 100; i += 1) {
          const ph = (t * 1.5 + i / 50) % 1; const a = pulse * (ph < 0.08 ? 1 : ph < 0.14 ? -0.6 : 0) * 14 + (bed4 ? 0 : (Math.sin(i * 1.7 + t * 30) * prox * 1.5));
          D.rect(g, 354 + i, Math.round(87 - a), 1, 1, prox > 0.75 ? P.red : P.gray2);
        }
        if (!bed4) pat.pts.forEach((p, i) => {
          D.stroke(g, 354, 112 + i * 18, 10, 10, P.ink); if (p.found) D.cross(g, 359, 117 + i * 18, 2, P.red);
          D.text(g, L(T[p.lab || p.k]), 370, 111 + i * 18, { size: 12, color: p.found ? P.gray : P.ink, maxW: 88 });
        });
        else D.text(g, L(T.bed4[bedMsg]), 404, 130, { size: 12, color: P.ash2, align: 'center' });
        // no pulse button
        const ready = !bed4 || searchT >= 8;
        D.panel(g, NP.x, NP.y, NP.w, NP.h, { fill: bed4 ? (ready ? P.ash : P.ink3) : P.milk3, line: bed4 ? P.ash2 : P.red, shadow: P.ink, r: 3 });
        D.text(g, L(T.nopulse), NP.x + NP.w / 2, NP.y + 10, { size: 12, color: bed4 ? (ready ? P.milk : P.ash2) : P.red, align: 'center' });
        D.rect(g, NP.x + 10, NP.y + 26, NP.w - 20, 1, bed4 ? P.ash2 : P.rose2);
        if (!done) drawScope();
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 12, { size: 12, color: p.c, align: 'center', shadow: bed4 ? P.ink : P.milk3 });
        if (msgT > 0 && msg) D.text(g, msg, 190, 252, { size: 12, color: P.gray, align: 'center' });
        if (!bed4 && pi === 0 && t < 6) D.text(g, t < 3 ? L(T.drag) : L(T.holdit), 190, 254, { size: 12, color: P.ash, align: 'center' });
        if (bed4) { g.globalAlpha = 0.25 + 0.1 * Math.sin(t * 0.4); D.rect(g, 0, 22, 480, 248, P.ink); g.globalAlpha = 1; }
        if (trans > 0) { g.globalAlpha = Math.min(0.6, (1.1 - trans)); D.rect(g, 0, 22, 480, 248, P.milk3); g.globalAlpha = 1; }
      },
      down(x, y, id) {
        if (done || trans > 0) return;
        if (x >= NP.x && x < NP.x + NP.w && y >= NP.y && y < NP.y + NP.h) { pressNoPulse(); return; }
        if (x < 340) { ptr = { id, ox: sx - x, oy: sy - y }; if (D.dist(x, y, sx, sy) > 24) { ptr.ox = 0; ptr.oy = -14; sx = x; sy = y - 14; } ctx.sfx('pick'); }
      },
      move(x, y, id) { if (ptr && ptr.id === id) { sx = D.clamp(Math.round(x + ptr.ox), 20, 336); sy = D.clamp(Math.round(y + ptr.oy), 30, 262); } },
      up(x, y, id) { if (ptr && ptr.id === id) { ptr = null; holdT = 0; } },
      key(code) { if (code === 'KeyN') pressNoPulse(); },
      state() { return { score, time: bed4 ? null : Math.ceil(timeLeft), lives: null, progress: done && pi + 1 >= nP ? 1 : (pi + (trans > 0 ? 1 : 0)) / nP, done, success, label: bed4 ? null : `${L(T.patient)} ${pi + 1}/${nP}` }; },
      _dbg() { return { pat, trans, sx, sy }; },
      destroy() {},
    };
  },
};
