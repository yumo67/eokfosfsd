// 消毒 Disinfect — rub away cute germ blobs; peel old bandages; spare the healthy wound.
import { P } from '../core/palette.js';
import * as D from '../core/draw.js';
import { washStation, bezel } from './pixel-set.js';

const T = {
  clean: { ja: 'ピカピカ！', en: 'Squeaky clean!', ru: 'Чисто!' },
  ouch: { ja: 'いたい！', en: 'Ouch!', ru: 'Больно!' },
  peel: { ja: '古い絆創膏をはがして', en: 'Peel the old plaster', ru: 'Снимите старый пластырь' },
  rub: { ja: 'ゴシゴシこすって！', en: 'Rub back and forth!', ru: 'Трите туда-сюда!' },
  wound: { ja: '傷はやさしく', en: 'Gentle on the wound', ru: 'Рану — бережно' },
  split: { ja: 'ふえた！', en: 'It split!', ru: 'Размножился!' },
  parts: [{ ja: '手', en: 'Hand', ru: 'Кисть' }, { ja: 'ひざ', en: 'Knee', ru: 'Колено' }, { ja: 'うで', en: 'Arm', ru: 'Рука' }],
  germs: { ja: 'ばい菌', en: 'Germs', ru: 'Микробы' },
};

export default {
  id: 'disinfect',
  control: 'swipe',
  title: { ja: '消毒', en: 'Disinfect', ru: 'Дезинфекция' },
  desc: { ja: '肌にくっついた ばい菌を、ゴシゴシこすって退治しよう。', en: 'Scrub the little germs off the skin before they multiply.', ru: 'Ототрите микробов с кожи, пока они не размножились.' },
  how: [
    { ja: 'ばい菌の上を 指で往復してこする。', en: 'Rub back and forth over germs.', ru: 'Трите по микробам туда-сюда.' },
    { ja: '汚れた古い絆創膏は ドラッグしてはがす。下に隠れているかも。', en: 'Drag dirty old plasters off — germs may hide underneath.', ru: 'Сдирайте грязные пластыри — под ними прячутся микробы.' },
    { ja: '放っておくと増える。赤い十字の傷は こすりすぎ注意。', en: 'Germs multiply if left. Don’t scrub the red-cross wound too hard.', ru: 'Микробы множатся. Рану с красным крестом не трите сильно.' },
  ],
  ranks: d => [[420, 680, 880], [500, 820, 1060], [520, 860, 1110]][d - 1],
  create(ctx) {
    const g = ctx.g, dif = ctx.difficulty, L = ctx.L, R = Math.random;
    let timeLeft = [55, 55, 60][dif - 1] * (ctx.assist ? 1.25 : 1), t = 0, score = 0, done = false, success = false;
    let stage = 0, germs = [], patches = [], wound = null, trans = 0, cleared = 0, pain = 0, painFlash = 0, stT = 0;
    const ptrs = new Map(), parts = [], pops = [], foam = [];
    const hp = [60, 80, 95][dif - 1] / (ctx.assist ? 1.3 : 1);
    const pop = (x, y, s, c) => pops.push({ x, y, s, c, t: 0 });
    // body part shapes: list of rounded panels (skin area)
    const SHAPES = [
      [[150, 70, 200, 150, 30], [110, 96, 60, 40, 16], [150, 40, 34, 60, 14], [192, 30, 34, 60, 14], [234, 34, 34, 60, 14], [276, 46, 34, 56, 14]],
      [[24, 84, 240, 92, 30], [180, 56, 130, 140, 60], [270, 96, 190, 80, 30]],
      [[30, 90, 420, 100, 40], [380, 70, 80, 130, 34]],
    ];
    function onSkin(x, y) { return SHAPES[Math.min(stage, 2)].some(([a, b, w, h]) => x >= a + 4 && x < a + w - 4 && y >= b + 4 && y < b + h - 4); }
    function randSpot() { for (let k = 0; k < 200; k++) { const x = 40 + R() * 400, y = 40 + R() * 200; if (onSkin(x, y) && (!wound || D.dist(x, y, wound.x, wound.y) > 34)) return { x, y }; } return { x: 240, y: 140 }; }
    function addGerm(x, y, kind) { germs.push({ x, y, kind, hp, maxHp: hp, ph: R() * 6, vx: (R() - 0.5) * 30, vy: (R() - 0.5) * 30, age: 0, hidden: false, wob: 0 }); }

    function setup() {
      germs = []; patches = []; stT = 0; pain = 0;
      wound = dif >= 2 ? (() => { const s = randSpot(); return { x: s.x, y: s.y }; })() : null;
      const n = [5, 6, 7][dif - 1] + stage;
      for (let i = 0; i < n; i++) {
        const s = randSpot(); const r = R();
        const kind = r < 0.35 ? 'still' : r < 0.65 ? 'walk' : (dif >= 2 || stage > 0) ? 'split' : 'walk';
        addGerm(s.x, s.y, kind);
      }
      const np = [1, 2, 2][dif - 1];
      for (let i = 0; i < np; i++) {
        const s = randSpot(); patches.push({ x: s.x, y: s.y, peel: 0, gone: false, fly: 0 });
        for (let k = 0; k < 2; k++) { addGerm(s.x + (k ? 8 : -8), s.y + (k ? 3 : -2), 'still'); germs[germs.length - 1].hidden = true; }
      }
    }
    setup();

    function scrub(x0, y0, x1, y1, rev) {
      const d = D.dist(x0, y0, x1, y1);
      if (d < 0.5) return;
      const pow = d * (rev ? 2.2 : 1);
      for (const gm of germs) {
        if (gm.hidden) continue;
        if (D.dist(x1, y1, gm.x, gm.y) < 18) {
          gm.hp -= pow; gm.wob = 0.2;
          if (R() < 0.25) parts.push({ x: gm.x, y: gm.y, vx: (R() - 0.5) * 40, vy: -R() * 40, l: 0.3, c: P.gray2 });
          if (gm.hp <= 0 && !gm.dead) {
            gm.dead = true; score += 20 + (gm.kind === 'split' ? 10 : 0); ctx.sfx('pop');
            for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; parts.push({ x: gm.x, y: gm.y, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, l: 0.5, c: k % 2 ? P.milk3 : P.gray3, star: k % 3 === 0 }); }
          }
        }
      }
      if (wound && D.dist(x1, y1, wound.x, wound.y) < 20) {
        pain += pow * 0.012;
        if (pain > 1) { pain = 0.4; painFlash = 0.4; score = Math.max(0, score - 30); ctx.sfx('bad'); ctx.shake(3); ctx.vibrate(60); pop(wound.x, wound.y - 24, L(T.ouch), P.red); }
      }
      if (R() < 0.6) foam.push({ x: x1 + (R() - 0.5) * 10, y: y1 + (R() - 0.5) * 10, r: 2 + (R() * 3 | 0), l: 1.4 });
    }

    // adhesive plaster: rounded strip, breathing holes, gauze pad; old ones are stained with a curled corner
    function plaster(x, y, dirty, curl) {
      x = Math.round(x); y = Math.round(y);
      const base = dirty ? P.gray2 : P.rose2, hi = dirty ? P.gray3 : P.milk3, lo = dirty ? P.gray : P.rose;
      D.rect(g, x - 20, y - 9, 40, 18, P.ink); D.rect(g, x - 22, y - 7, 44, 14, P.ink);
      D.rect(g, x - 19, y - 8, 38, 16, base); D.rect(g, x - 21, y - 6, 42, 12, base);
      D.rect(g, x - 19, y - 8, 38, 2, hi); D.rect(g, x - 19, y + 5, 38, 3, lo);
      for (const sx of [-16, -12, 11, 15]) for (const sy of [-4, 1]) D.rect(g, x + sx, y + sy, 1, 1, lo);
      D.rect(g, x - 8, y - 7, 16, 14, P.ink); D.rect(g, x - 7, y - 6, 14, 12, dirty ? P.gray3 : P.milk3); D.rect(g, x - 7, y + 3, 14, 3, dirty ? P.gray2 : P.gray3);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) D.rect(g, x - 5 + i * 4, y - 4 + j * 4, 1, 1, P.gray);
      if (dirty) {
        D.rect(g, x - 5, y - 2, 6, 4, P.ash2); D.rect(g, x - 3, y - 4, 3, 2, P.ash2); D.rect(g, x + 2, y + 1, 3, 2, P.gray);
        D.rect(g, x - 17, y - 1, 3, 2, P.ash); D.rect(g, x + 13, y + 3, 2, 2, P.ash);
        // curled corner
        const c = Math.min(8, curl);
        if (c > 0) { D.rect(g, x + 18 - c, y - 9 - c, c + 4, c + 2, P.ink); D.rect(g, x + 19 - c, y - 8 - c, c + 2, c, P.gray3); D.rect(g, x + 19 - c, y - 8 - c, c + 2, 1, P.milk3); }
      }
    }
    function drawGerm(gm) {
      if (gm.hidden) return;
      const x = Math.round(gm.x + (gm.wob > 0 ? Math.sin(t * 80) * 2 : 0)), y = Math.round(gm.y);
      const b = Math.round(Math.sin(t * 4 + gm.ph) * 1.5);
      const s = 7 + Math.round(3 * gm.hp / gm.maxHp);
      const body = gm.kind === 'split' ? P.red : gm.kind === 'walk' ? P.ash2 : P.rose;
      D.circle(g, x, y + b, s + 1, P.ink); D.circle(g, x, y + b, s, body);
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + t; D.rect(g, Math.round(x + Math.cos(a) * (s + 2)), Math.round(y + b + Math.sin(a) * (s + 2)), 2, 2, P.ink); }
      D.rect(g, x - 3, y + b - 2, 2, 2, P.milk3); D.rect(g, x + 2, y + b - 2, 2, 2, P.milk3);
      D.rect(g, x - 2, y + b - 1, 1, 1, P.ink); D.rect(g, x + 3, y + b - 1, 1, 1, P.ink);
      D.rect(g, x - 1, y + b + 2, 3, 1, P.ink);
      if (gm.kind === 'split' && gm.age > 4) D.rect(g, x, y + b - s, 1, s * 2, P.red2);
    }

    return {
      update(dt) {
        if (done) return;
        t += dt; painFlash = Math.max(0, painFlash - dt); pain = Math.max(0, pain - dt * 0.15);
        for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 80 * dt; p.l -= dt; }
        for (let i = parts.length - 1; i >= 0; i--) if (parts[i].l <= 0) parts.splice(i, 1);
        for (const f of foam) { f.l -= dt; f.y -= dt * 4; }
        for (let i = foam.length - 1; i >= 0; i--) if (foam[i].l <= 0) foam.splice(i, 1);
        if (foam.length > 160) foam.splice(0, foam.length - 160);
        for (const p of pops) p.t += dt;
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].t > 1) pops.splice(i, 1);
        if (trans > 0) { trans -= dt; if (trans <= 0) { stage++; if (stage >= 3) { done = true; success = true; score += Math.round(timeLeft * 3); ctx.sfx('win'); } else setup(); } return; }
        timeLeft -= dt; stT += dt;
        for (const gm of germs) {
          gm.wob = Math.max(0, gm.wob - dt); if (gm.hidden) continue;
          gm.age += dt;
          if (gm.kind === 'walk') {
            gm.x += gm.vx * dt * (0.6 + dif * 0.3); gm.y += gm.vy * dt * (0.6 + dif * 0.3);
            if (!onSkin(gm.x, gm.y) || (wound && D.dist(gm.x, gm.y, wound.x, wound.y) < 26)) { gm.x -= gm.vx * dt * 2; gm.y -= gm.vy * dt * 2; gm.vx = (R() - 0.5) * 40; gm.vy = (R() - 0.5) * 40; }
            if (R() < dt * 0.5) { gm.vx = (R() - 0.5) * 40; gm.vy = (R() - 0.5) * 40; }
          }
          if (gm.kind === 'split' && gm.age > [7, 6, 5][dif - 1] && germs.filter(x => !x.dead).length < 16) {
            gm.age = 0; const nx = gm.x + 14, ny = gm.y + (R() - 0.5) * 10;
            addGerm(onSkin(nx, ny) ? nx : gm.x - 14, ny, 'split'); gm.hp = Math.min(gm.hp, gm.maxHp);
            ctx.sfx('beep'); if (!pops.some(q => q.s === L(T.split))) pop(gm.x, gm.y - 18, L(T.split), P.red);
          }
        }
        germs = germs.filter(x => !x.dead);
        for (const p of patches) if (p.gone) p.fly += dt;
        if (!germs.length && patches.every(p => p.gone)) {
          cleared++; const bonus = 80 + Math.max(0, Math.round(60 - stT * 3));
          score += bonus; pop(240, 120, L(T.clean), P.red); pop(240, 136, '+' + bonus, P.ink); ctx.sfx('combo');
          for (let k = 0; k < 24; k++) parts.push({ x: 60 + R() * 360, y: 60 + R() * 160, vx: 0, vy: -20, l: 0.8, c: P.milk3, star: true });
          trans = 1.2;
        }
        if (timeLeft <= 0) { timeLeft = 0; done = true; success = cleared >= 2; ctx.sfx(success ? 'win' : 'lose'); }
      },
      draw() {
        const show=(trans<=0||trans>.6)&&stage<3;
        washStation(g,show?stage:null,t);
        D.rect(g,0,240,480,30,P.gray3);D.rect(g,0,240,480,1,P.ash2);
        bezel(g,424,238,45,30);D.panel(g,438,231,17,9,{fill:P.rose2,line:P.ink3,shadow:null,r:2});D.cross(g,446,251,3,P.red);
        if ((trans <= 0 || trans > 0.6) && stage < 3) {
          if (wound) {
            g.globalAlpha = .5; D.circle(g, wound.x, wound.y, 17, P.rose2); g.globalAlpha = 1;
            plaster(wound.x, wound.y, false, 0); D.cross(g, wound.x, wound.y, 2, P.red);
            if (pain > 0.4) D.ring(g, wound.x, wound.y, 22, P.red, 1);
          }
          for (const gm of germs) drawGerm(gm);
          for (const p of patches) {
            if (p.gone) { if (p.fly < 0.6) { const fx = p.x + p.fly * 300, fy = p.y - p.fly * 200; plaster(fx, fy, true, 6); } continue; }
            const lift = Math.round(p.peel * 10);
            if (lift) { g.fillStyle = 'rgba(18,16,18,.25)'; g.fillRect(p.x - 20, p.y - 4, 42, 10); }
            plaster(p.x, p.y - lift, true, 2 + lift);
            if (Math.floor(t * 2) % 2) { D.rect(g, p.x + 19, p.y - 15 - lift, 2, 6, P.red); D.rect(g, p.x + 19, p.y - 8 - lift, 2, 2, P.red); }
          }
        }
        for (const f of foam) { g.globalAlpha = Math.min(1, f.l); D.ring(g, f.x, f.y, f.r, P.milk3); g.globalAlpha = 1; }
        for (const p of parts) { if (p.star) { D.rect(g, p.x - 2, p.y, 5, 1, p.c); D.rect(g, p.x, p.y - 2, 1, 5, p.c); } else D.rect(g, p.x, p.y, 2, 2, p.c); }
        for (const p of pops) D.text(g, p.s, p.x, p.y - p.t * 14, { size: 12, color: p.c, align: 'center', shadow: P.milk3 });
        // hud bottom
        D.panel(g, 8, 242, 200, 22, { fill: P.ink3, line: P.ink, shadow: null, r: 2 });
        D.text(g, `${L(T.parts[Math.min(stage, 2)])} ${Math.min(stage + 1, 3)}/3 · ${L(T.germs)} ${germs.filter(x => !x.hidden).length + patches.filter(p => !p.gone).length * 2}`, 14, 247, { size: 11,maxW:186, color: P.milk });
        if (trans<=0) D.text(g, patches.some(p => !p.gone) && stT % 7 > 3 ? L(T.peel) : wound && stT % 7 > 2 ? L(T.wound) : L(T.rub), 316, 247, { size: 11,maxW:198,color:P.ink,align:'center' });
        if (painFlash > 0) { g.globalAlpha = painFlash; D.rect(g, 0, 22, 480, 248, P.red); g.globalAlpha = 1; }
      },
      down(x, y, id) {
        if (done || trans > 0) return;
        const pa = patches.find(p => !p.gone && Math.abs(x - p.x) < 22 && Math.abs(y - p.y) < 14);
        ptrs.set(id, { x, y, dx: 0, patch: pa || null, sx: x, sy: y });
        ctx.sfx(pa ? 'pick' : 'swish');
      },
      move(x, y, id) {
        const p = ptrs.get(id); if (!p || trans > 0) return;
        if (p.patch) {
          p.patch.peel = Math.min(1, D.dist(p.sx, p.sy, x, y) / 50);
          if (p.patch.peel >= 1) { p.patch.gone = true; ctx.sfx('whoosh'); for (const gm of germs) if (gm.hidden && D.dist(gm.x, gm.y, p.patch.x, p.patch.y) < 20) gm.hidden = false; p.patch = null; }
          p.x = x; p.y = y; return;
        }
        const dx = x - p.x; const rev = Math.sign(dx) !== 0 && Math.sign(dx) !== Math.sign(p.dx) && Math.abs(dx) > 1;
        if (rev) ctx.sfx('swish');
        scrub(p.x, p.y, x, y, rev);
        if (Math.abs(dx) > 1) p.dx = dx;
        p.x = x; p.y = y;
      },
      up(x, y, id) { const p = ptrs.get(id); if (p && p.patch) p.patch.peel = 0; ptrs.delete(id); },
      state() { return { score, time: Math.ceil(timeLeft), lives: null, progress: (stage + (trans > 0 ? 1 : 0)) / 3, done, success, label: `${L(T.germs)} ${germs.length}` }; },
      _dbg() { return { germs, patches, wound, trans }; },
      destroy() { ptrs.clear(); },
    };
  },
};
