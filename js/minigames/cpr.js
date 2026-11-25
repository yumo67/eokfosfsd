// 胸骨圧迫 CPR — compress in time with the metronome; give 2 breaths every 30.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { station, bezel } from './pixel-set.js';
import { lyingPatient, cprHands } from './art.js';

const T = {
  perfect: { ja: 'パーフェクト', en: 'Perfect', ru: 'Идеально' },
  good: { ja: 'グッド', en: 'Good', ru: 'Хорошо' },
  miss: { ja: 'ミス', en: 'Miss', ru: 'Мимо' },
  early: { ja: 'はやい', en: 'Early', ru: 'Рано' },
  breath: { ja: '人工呼吸', en: 'Breathe', ru: 'Вдох' },
  holdB: { ja: '1秒 長押し ×2', en: 'Hold 1 s ×2', ru: 'Держите 1 с ×2' },
  tapChest: { ja: 'リングが重なったら 胸をタップ', en: 'Tap the chest as the ring closes', ru: 'Тапайте, когда кольцо сойдётся' },
  acc: { ja: '精度', en: 'ACC', ru: 'ТОЧН' },
  back: { ja: '…脈が戻った', en: '…a pulse returns', ru: '…пульс вернулся' },
  cycle: { ja: 'サイクル', en: 'Cycle', ru: 'Цикл' },
};

export default {
  id: 'cpr',
  control: 'rhythm',
  title: { ja: '胸骨圧迫', en: 'Chest Compressions', ru: 'Массаж сердца' },
  desc: { ja: 'メトロノームに合わせて胸を押し、30回ごとに人工呼吸を。', en: 'Compress to the metronome and give two breaths every 30.', ru: 'Нажимайте в такт метроному и делайте два вдоха каждые 30.' },
  how: [
    { ja: '輪が中心に重なる瞬間に、胸をタップ。', en: 'Tap the chest the moment the ring meets the center.', ru: 'Тапайте по груди, когда кольцо сойдётся с центром.' },
    { ja: '30回押したら「人工呼吸」を1秒ずつ2回長押し。', en: 'After 30, hold “Breathe” for 1 second, twice.', ru: 'После 30 — дважды держите «Вдох» по 1 секунде.' },
    { ja: '精度が高いほど心電図が元に戻っていく。', en: 'The better your rhythm, the more the ECG recovers.', ru: 'Чем точнее ритм, тем лучше ЭКГ.' },
  ],
  ranks: d => [[700, 1200, 1600], [1000, 1750, 2400], [1000, 1750, 2400]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L;
    const bpm = [100, 110, 120][dif - 1];
    const per = 60 / bpm;
    const cycles = [2, 3, 3][dif - 1];
    const winP = 0.07 * (ctx.assist ? 1.3 : 1), winG = 0.15 * (ctx.assist ? 1.3 : 1);
    const need = [0.55, 0.62, 0.7][dif - 1];
    let t = 0, clock = 0, phase = 'lead', phT = 0, beatI = 0, cnt = 0, cyc = 0;
    let nP = 0, nG = 0, nM = 0, combo = 0, score = 0, done = false, success = false;
    let press = 0, judge = null, judgeT = 0, recov = 0, breaths = 0, holdT = 0, holding = false, breathT = 0, beepCd = 0, chestPulse = 0;
    const pops = [], parts = [], ecg = new Array(120).fill(0);
    let ecgPh = 0;
    const lead = 4; // lead-in beats
    const BTN = { x: 352, y: 196, w: 116, h: 58 };
    const pop = (x, y, s, c) => pops.push({ x, y, s, c, t: 0 });

    const beatTime = i => (lead + i) * per;
    const total = 30;
    function judgeTap() {
      const b = beatTime(beatI), d = clock - b;
      if (d < -winG) { // too early (before window of the next beat)
        judge = 'early'; judgeT = 0.35; combo = 0; ctx.sfx('tick'); score = Math.max(0, score - 2); return;
      }
      const a = Math.abs(d);
      let j = a <= winP ? 'perfect' : a <= winG ? 'good' : 'miss';
      register(j);
    }
    function register(j) {
      judge = j; judgeT = 0.4; beatI++; cnt++;
      if (j === 'perfect') { nP++; combo++; score += 10 + Math.min(combo, 20); ctx.sfx('beat'); recov = Math.min(1, recov + 0.012); }
      else if (j === 'good') { nG++; combo++; score += 6 + Math.min(combo, 20) / 2 | 0; ctx.sfx('beat'); recov = Math.min(1, recov + 0.007); }
      else { nM++; combo = 0; ctx.sfx('bad'); recov = Math.max(0, recov - 0.01); }
      if (j !== 'miss') { press = 0.12; chestPulse = 1; ctx.vibrate(10); for (let k = 0; k < 4; k++) parts.push({ x: 170 + (Math.random() - 0.5) * 40, y: 150, vx: (Math.random() - 0.5) * 60, vy: -30 - Math.random() * 30, l: 0.4, c: j === 'perfect' ? P.red : P.rose2 }); }
      if (cnt >= total) { phase = 'breath'; phT = 0; breaths = 0; holdT = 0; breathT = [6, 5, 4.5][dif - 1]; ctx.sfx('whoosh'); }
    }
    const acc = () => { const n = nP + nG + nM; return n ? (nP + nG * 0.6) / n : 1; };

    function finishBreaths() {
      cyc++;
      if (cyc >= cycles) { done = true; const a = acc(); success = a >= need; score += Math.round(a * 200); if (success) pop(240, 60, L(T.back), P.milk3); ctx.sfx(success ? 'win' : 'lose'); return; }
      phase = 'lead'; cnt = 0; beatI = 0; clock = 0;
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; phT += dt; judgeT -= dt; press = Math.max(0, press - dt); chestPulse = Math.max(0, chestPulse - dt * 4);
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1.4) pops.splice(i, 1);
        // ECG: flat-ish with noise, recovering beats as recov rises
        ecgPh += dt * (0.6 + recov * 0.9);
        const p = ecgPh % 1;
        let v = Math.sin(t * 23) * 0.04 + Math.sin(t * 7) * 0.05;
        if (recov > 0.15) v += (p < 0.04 ? -0.3 : p < 0.08 ? 1 : p < 0.12 ? -0.4 : p > 0.3 && p < 0.42 ? 0.2 : 0) * recov;
        ecg.push(v); ecg.shift();
        if (phase === 'lead' || phase === 'press') {
          clock += dt;
          // metronome ticks
          const bi = Math.floor(clock / per + 1e-6);
          if (bi !== Math.floor((clock - dt) / per + 1e-6)) ctx.sfx(bi < lead ? 'click' : 'tick');
          if (phase === 'lead' && clock >= beatTime(0) - per) phase = 'press';
          if (phase === 'press' && clock - beatTime(beatI) > winG) register('miss');
        } else if (phase === 'breath') {
          breathT -= dt;
          if (holding) {
            holdT += dt;
            if (holdT >= 1) { holding = false; holdT = 0; breaths++; score += 30; ctx.sfx('good'); pop(BTN.x + BTN.w / 2, BTN.y - 10, `${L(T.breath)} ${breaths}/2`, P.ink); recov = Math.min(1, recov + 0.03); if (breaths >= 2) finishBreaths(); }
          }
          if (phase === 'breath' && breathT <= 0) { nM += 2 - breaths; ctx.sfx('bad'); pop(BTN.x + BTN.w / 2, BTN.y - 10, L(T.miss), P.red); holding = false; finishBreaths(); }
        }
      },
      draw() {
        // floor view from above: ward floor tiles + emergency light sweep
        station(g,'cpr',t);
        for (let y = 22; y < 270; y += 20) for (let x = (y / 20 % 2) * 20; x < 480; x += 40) D.rect(g, x, y, 20, 20, P.ash2);
        g.globalAlpha = 0.1 + 0.06 * Math.sin(t * 4); D.rect(g, 0, 22, 480, 248, P.red); g.globalAlpha = 1;
        // patient (top-down), lying left->right
        const cx = 170, cy = 150, sq = press > 0 ? 2 : 0;
        bezel(g,37,88,276,129);
        lyingPatient(g, cx, cy, { sq, recov, t });
        // target + beat ring
        if (chestPulse > 0) D.circle(g, cx, cy, 12 + Math.round(chestPulse * 4), P.rose2); D.ring(g, cx, cy, 12, P.red, 1); D.ring(g, cx, cy, 13, P.red2, 1);
        D.cross(g, cx, cy, 3, P.red);
        if (phase === 'press' || phase === 'lead') {
          const nb = beatTime(beatI), f = (nb - clock) / per;
          if (f >= 0 && f <= 1) D.ring(g, cx, cy, Math.round(12 + f * 46), f < 0.15 ? P.red : P.milk3, 2);
          const f2 = f + 1; if (f2 <= 1.5) D.ring(g, cx, cy, Math.round(12 + f2 * 46), P.gray2, 1);
        }
        // hands
        const hy = cy - 30 + (press > 0 ? 8 : 0);
        cprHands(g, cx, hy);
        // count
        D.text(g, `${cnt}/30`, cx, 206, { size: 16, color: P.milk3, align: 'center', shadow: P.ink });
        D.text(g, `${L(T.cycle)} ${Math.min(cyc + 1, cycles)}/${cycles}  ${bpm} BPM`, 176, 26, { size: 12, color: P.milk, align: 'center', shadow: P.ink });
        // monitor (right)
        bezel(g,327,33,146,98,{invert:true});
        D.panel(g, 331, 37, 138, 90, { fill: P.ink2, line: P.ink, shadow: null, r: 4 });
        D.rect(g, 338, 46, 124, 56, P.ink);
        for (let i = 1; i < ecg.length; i++) D.line(g, 338 + (i - 1) * 124 / ecg.length, 76 - ecg[i - 1] * 22, 338 + i * 124 / ecg.length, 76 - ecg[i] * 22, recov > 0.5 ? P.milk3 : P.gray);
        D.text(g, `${L(T.acc)} ${Math.round(acc() * 100)}%`, 340, 108, { size: 12, color: acc() >= need ? P.milk : P.rose });
        D.rect(g, 338, 122, 124, 3, P.ink3); D.rect(g, 338, 122, Math.round(124 * recov), 3, P.red);
        D.rect(g, 338 + Math.round(124 * need), 120, 1, 7, P.milk3);
        // breath button
        const act = phase === 'breath';
        D.panel(g, BTN.x, BTN.y + (holding ? 2 : 0), BTN.w, BTN.h, { fill: act ? (holding ? P.red2 : P.red) : P.ash, line: P.ink, shadow: holding ? null : P.ink, r: 4 });
        D.text(g, L(T.breath), BTN.x + BTN.w / 2, BTN.y + 10, { size: 12, color: act ? P.milk3 : P.gray, align: 'center' });
        D.text(g, `${breaths}/2`, BTN.x + BTN.w / 2, BTN.y + 28, { size: 12, color: act ? P.milk3 : P.gray, align: 'center' });
        if (holding) D.rect(g, BTN.x + 6, BTN.y + BTN.h - 8, Math.round((BTN.w - 12) * holdT), 3, P.milk3);
        if (act) { D.text(g, L(T.holdB), BTN.x + BTN.w / 2, BTN.y - 26, { size: 12, color: P.milk3, align: 'center', shadow: P.ink }); D.rect(g, BTN.x, BTN.y - 8, Math.round(BTN.w * Math.max(0, breathT) / 6), 2, P.milk3); }
        if (judgeT > 0 && judge) D.text(g, L(T[judge]), cx, 64, { size: 16, color: judge === 'perfect' ? P.red : judge === 'good' ? P.milk3 : P.gray2, align: 'center', shadow: P.ink });
        if (combo >= 5) D.text(g, `×${combo}`, 300, 64, { size: 12, color: P.rose2, align: 'right' });
        if (cyc === 0 && cnt < 4 && phase !== 'breath') D.text(g, L(T.tapChest), 176, 232, { size: 12, color: P.milk3, align: 'center', shadow: P.ink });
        for (const p of parts) D.rect(g, p.x, p.y, 2, 2, p.c);
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 10, { size: 12, color: p.c, align: 'center', shadow: P.ink });
      },
      down(x, y, id) {
        if (done) return;
        if (phase === 'breath') { if (x >= BTN.x - 6 && y >= BTN.y - 10) { holding = true; holdT = 0; ctx.sfx('click'); } return; }
        if (x < 330 && phase === 'press') judgeTap();
      },
      move() {},
      up() { if (holding) { holding = false; if (holdT < 1) { ctx.sfx('tick'); } holdT = 0; } },
      key(code) { if (code === 'Space' && phase === 'press') judgeTap(); },
      state() { return { score, time: null, lives: null, progress: done ? 1 : (cyc + cnt / 30) / cycles, done, success, label: `${L(T.acc)} ${Math.round(acc() * 100)}%` }; },
      _dbg() { return { phase, clock, beatTime: beatTime(beatI), holding }; },
      destroy() {},
    };
  },
};
