// The black door: tactile key → keyhole → align → turn → push sequence, the conversation engine, endings.
import { S, dirty, flag, setFlag, addFlag, cond, applyEffects } from '../core/state.js';
import { P } from '../core/palette.js';
import { W, H, hiCanvas, releaseCanvas, bindPointer, h, wait, fade } from '../core/stage.js';
import { L, t } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import * as D from '../core/draw.js';
import { DOOR, DOOR_META } from '../data/door.js';
import { speak, choose, close as closeDialog, setVoiceName, open as openDialog } from './dialogue.js';
import { hasItem, toast, checkAch } from './game.js';
import { render as renderMesh } from './mesh3d.js';
import { slab, rivets, label } from '../core/scenery.js';

const root = document.getElementById('doorv');
setVoiceName(() => L(flag('d_named') ? DOOR_META.name : DOOR_META.unknownName));

const KH = { x: 240, y: 150 }; // keyhole
const vib = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (_) { } };

export function openDoor() {
  return new Promise(res => {
    root.classList.remove('hidden'); root.innerHTML = '';
    audio.play('door');
    const cv = h('canvas', { width: W, height: H }); root.append(cv); const g = hiCanvas(cv);
    const hint = h('div', { class: 'door-hint' }); root.append(hint);
    const back = h('button', { class: 'btn sm dark door-back', onclick: () => finish(false) }, t('back')); root.append(back);
    const visits = flag('door_visits');
    const st = { phase: 'carry', kx: 120, ky: 232, ka: Math.PI / 2, drag: false, turn: 0, lastAng: null, open: 0, pushing: false, py: 0, t: 0, flash: 0, ins: 0, wrongT: 0, clickAcc: 0 };
    if (visits > 0) st.ka = Math.PI / 4; // it remembers you a little
    const setHint = () => { hint.textContent = { carry: t('door_dragKey'), align: t('door_turn') + ' ↻', turn: t('door_turn'), push: t('door_push'), dark: '' }[st.phase]; };
    setHint();
    if (hasItem('flashlight')) root.append(h('button', { class: 'btn sm dark', style: 'position:absolute;right:calc(var(--u)*6);top:calc(var(--u)*6)', onclick: () => { st.flash = 3; audio.sfx('click'); if (!S.flags.flash_door) { setFlag('flash_door', 1); checkAch(); } toast(t('flashUse'), t('door_tooDark'), { badge: '◎', mini: true }); } }, t('use') + ': ' + L({ ja: '懐中電灯', en: 'Flashlight', ru: 'Фонарик' })));
    const angTo = (x, y) => Math.atan2(y - KH.y, x - KH.x);
    const norm = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
    const unbind = bindPointer(cv, {
      down: (x, y) => {
        audio.unlock();
        if (st.phase === 'carry' && Math.hypot(x - st.kx, y - st.ky) < 26) { st.drag = true; audio.sfx('pick'); }
        else if (st.phase === 'align' || st.phase === 'turn') { st.drag = true; st.lastAng = angTo(x, y); }
        else if (st.phase === 'push' && x > 150 && x < 330 && y > 40 && y < 260) { st.pushing = true; st.py = y; st.px = x; }
      },
      move: (x, y) => {
        if (st.phase === 'carry' && st.drag) { st.kx = x; st.ky = y; }
        else if (st.phase === 'align' && st.drag) { const a = angTo(x, y); const d = norm(a - st.lastAng); st.lastAng = a; st.ka = norm(st.ka + d); }
        else if (st.phase === 'turn' && st.drag) {
          const a = angTo(x, y); const d = norm(a - st.lastAng); st.lastAng = a;
          if (d > 0) { st.turn += d * 0.8; st.clickAcc += d; if (st.clickAcc > Math.PI / 6) { st.clickAcc = 0; audio.sfx('tick'); vib(12); } }
          else { st.turn = Math.max(0, st.turn + d * 0.2); }
          if (st.turn >= Math.PI) { st.phase = 'push'; st.drag = false; audio.sfx('unlock'); vib(60); setHint(); }
        } else if (st.phase === 'push' && st.pushing) { const dist = Math.hypot(x - st.px, y - st.py); st.open = Math.min(1, Math.max(st.open, dist / 100) * 0.98 + 0.004); }
      },
      up: (x, y) => {
        if (st.phase === 'carry' && st.drag) {
          st.drag = false;
          if (Math.hypot(st.kx - KH.x, st.ky - KH.y) < 22) { st.kx = KH.x; st.ky = KH.y; st.phase = 'align'; audio.sfx('drop'); vib(20); setHint(); }
          else { audio.sfx('whoosh'); st.kx = 120; st.ky = 232; }
        } else if (st.phase === 'align') {
          st.drag = false;
          const off = Math.abs(norm(st.ka + Math.PI / 2)); // upright = pointing up (-90°)
          if (off < 0.2) { st.ka = -Math.PI / 2; st.phase = 'turn'; st.turn = 0; st.ins = 1; audio.sfx('click'); vib(30); setHint(); }
          else if (off < 1.2) { st.wrongT = 1; hint.textContent = t('door_angle'); setTimeout(setHint, 1200); }
        } else if (st.phase === 'turn') st.drag = false;
        else if (st.phase === 'push') {
          st.pushing = false;
          if (st.open >= 0.75) { st.phase = 'dark'; setHint(); audio.sfx('creak'); enterDark(); }
        }
      },
    });
    let raf = 0, last = performance.now(), t0 = Date.now();
    const loop = now => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now; st.t += dt; st.flash = Math.max(0, st.flash - dt); st.wrongT = Math.max(0, st.wrongT - dt * 2); st.ins = Math.max(0, st.ins - dt * 2);
      if (st.phase === 'push' && !st.pushing && st.open > 0) st.open = Math.max(0, st.open - dt * 1.4); // springs back
      drawDoor(g, st);
    };
    raf = requestAnimationFrame(loop);
    async function enterDark() {
      await wait(500);
      cancelAnimationFrame(raf); unbind();
      g.fillStyle = P.ink; g.fillRect(0, 0, W, H);
      hint.remove(); back.remove(); root.querySelectorAll('button').forEach(b => b.remove());
      const ending = await conversation();
      S.stats.doorTime += Math.round((Date.now() - t0) / 1000); dirty();
      releaseCanvas(cv); root.classList.add('hidden'); root.innerHTML = '';
      if (ending) await showEnding(ending, false);
      audio.play('clinic'); checkAch(); res(true);
    }
    function finish() { cancelAnimationFrame(raf); unbind(); releaseCanvas(cv); root.classList.add('hidden'); root.innerHTML = ''; audio.play('clinic'); res(false); }
  });
}

function drawDoor(g, st) {
  const T = st.t;
  D.rect(g, 0, 0, W, H, P.ink);
  // corridor walls in perspective
  g.fillStyle = P.ink2; g.beginPath(); g.moveTo(0, 0); g.lineTo(140, 30); g.lineTo(140, 250); g.lineTo(0, 270); g.fill();
  g.beginPath(); g.moveTo(480, 0); g.lineTo(340, 30); g.lineTo(340, 250); g.lineTo(480, 270); g.fill();
  D.rect(g, 0, 160, 140, 2, P.red3);
  D.rect(g, 340, 160, 140, 2, P.red3);
  // door frame
  slab(g,145,17,190,246,P.ink3,P.ash,P.ink);
  rivets(g,145,17,190,246,P.red3);
  D.rect(g,156,27,168,233,P.ink);
  label(g,211,6,58,'03 / 33',true);
  for(let i=0;i<6;i++){
    const y=36+i*37;
    D.line(g,0,y-10,144,y+11,P.ink3);D.line(g,336,y+11,480,y-10,P.ink3);
    D.rect(g,143,y+11,2,11,P.ash);D.rect(g,335,y+11,2,11,P.ash);
  }
  // door leaf (opens: narrows towards hinge)
  const ow = 164 * (1 - st.open * 0.85);
  slab(g,158,30,ow,230,P.ink2,P.ash,P.ink);
  slab(g,164,41,ow-12,81,P.ink2,P.ink3,P.ink);
  slab(g,164,166,ow-12,77,P.ink2,P.ink3,P.ink);
  for(let i=1;i<10;i++){
    const x=165+Math.floor((ow-14)*i/10);
    D.rect(g,x,47,1,69,P.ink3);D.rect(g,x,171,1,65,P.ink3);
  }
  if (st.open > 0) { D.rect(g, 158 + ow, 30, 164 - ow, 230, '#000'); for (let i = 0; i < 20; i++) D.rect(g, 158 + ow + Math.random() * (164 - ow), 30 + Math.random() * 230, 1, 1, P.red3); }
  // keyhole plate
  if (st.open < 0.3) {
    slab(g,KH.x-10,KH.y-18,20,40,P.ash,P.gray,P.ink);
    rivets(g,KH.x-10,KH.y-18,20,40,P.ink);
    D.circle(g, KH.x, KH.y - 3, 4, '#000'); D.rect(g, KH.x - 2, KH.y - 1, 4, 12, '#000');
    const pulse = (Math.sin(T * 2) + 1) / 2;
    if (st.phase === 'carry') { D.ring(g, KH.x, KH.y, 22 + pulse * 3, `rgba(179,40,58,${0.25 + pulse * 0.25})`); }
  }
  // flashlight: the door swallows the beam
  if (st.flash > 0) { g.fillStyle = `rgba(251,248,242,${0.15 * st.flash})`; g.beginPath(); g.moveTo(240, 270); g.lineTo(150, 40); g.lineTo(330, 40); g.fill(); D.rect(g, 170, 60, 140, 180, `rgba(18,16,18,${0.3 * st.flash})`); }
  // key
  if (st.phase !== 'push' && st.phase !== 'dark') drawKey(g, st);
  // turn gauge
  if (st.phase === 'turn') { g.strokeStyle = P.red; g.lineWidth = 2; g.beginPath(); g.arc(KH.x, KH.y, 34, -Math.PI / 2, -Math.PI / 2 + st.turn); g.stroke(); D.ring(g, KH.x, KH.y, 34, 'rgba(110,103,106,0.4)'); }
  if (st.phase === 'align') { D.ring(g, KH.x, KH.y, 34, 'rgba(110,103,106,0.4)'); D.rect(g, KH.x - 1, KH.y - 40, 2, 6, P.red); }
  if (st.phase === 'push') { const p = (Math.sin(T * 3) + 1) / 2; D.text(g, '⇢', 250 + p * 10, 150, { size: 20, color: P.red, align: 'center' }); D.rect(g, 190, 240, 100, 4, P.ink3); D.rect(g, 190, 240, 100 * st.open, 4, P.red); }
  if (st.wrongT > 0) { D.rect(g, 0, 0, W, H, `rgba(179,40,58,${st.wrongT * 0.15})`); }
  // dust
  for (let i = 0; i < 14; i++) { const x = (i * 71 + T * 6 * (1 + i % 3)) % 480, y = (i * 37 + Math.sin(T + i) * 10) % 270; D.rect(g, x, y, 1, 1, 'rgba(189,184,184,0.35)'); }
}
let keyTex = null;
function drawKey(g, st) {
  if (!keyTex) { keyTex = document.createElement('canvas'); keyTex.width = 40; keyTex.height = 40; keyTex.getContext('2d').putImageData(renderMesh('key', 40, 0.0, 0.0, 1.1), 0, 0); }
  g.save(); g.translate(st.kx, st.ky); g.rotate(st.ka + Math.PI / 2);
  const sc = 1 - st.ins * 0.2 - (st.phase === 'turn' ? 0.25 : 0);
  g.scale(sc, sc);
  // pixel key drawn procedurally (bow + blade) for crisp shape
  const R = (x, y, w, hh, c) => { g.fillStyle = c; g.fillRect(x, y, w, hh); };
  R(-8, 6, 16, 16, P.ink); R(-6, 8, 12, 12, P.ash); R(-3, 11, 6, 6, P.ink); R(-2, 12, 4, 4, '#000');
  R(-2, -22, 4, 30, P.ink); R(-1, -22, 2, 28, P.ash2);
  R(2, -20, 5, 3, P.ink); R(2, -14, 4, 3, P.ink); R(2, -9, 6, 2, P.ink);
  R(-1, 9, 2, 1, P.red);
  g.restore();
  if (st.phase === 'carry' && !st.drag) { D.text(g, '▲', st.kx, st.ky - 34, { size: 8, color: P.red, align: 'center' }); }
}

// ---------------------------------------------------------- conversation engine
async function conversation() {
  addFlag('door_visits'); setFlag('door_seen', 1);
  const g = DOOR.greetings.find(x => cond(x.req));
  const leftLast = flag('door_left_last'); S.flags.door_left_last = 0;
  // remembered greeting flags (acknowledgements) — mark per-greeting "seen" vars used by req
  markGreeting(g?.node);
  S.flags.d_def = ((S.flags.d_def || 0) + 1) % 5;
  dirty(); checkAch();
  let id = g ? g.node : DOOR.hub;
  const opts = { dark: true, sprite: false };
  openDialog(opts);
  let steps = 0;
  while (id && steps++ < 400) {
    if (id === 'hub') id = DOOR.hub;
    const node = DOOR.nodes[id];
    if (!node) { console.warn('door: missing node', id); break; }
    if (node.req && !cond(node.req)) { id = node.alt || node.next || DOOR.hub; continue; }
    applyEffects(node);
    if (node.t) await speak([{ who: node.who || 'voice', emo: node.emo, t: node.t }], opts);
    if (node.ending) { closeDialog(); return node.ending; }
    if (node.choices) {
      const list = node.choices.map((c, i) => ({ c, i })).filter(({ c, i }) => (!c.req || cond(c.req)) && !(c.once && S.once[id + ':' + i]));
      const isHub = id === DOOR.hub;
      const choices = list.map(({ c, i }) => ({ label: L(c.t), value: i }));
      choices.push({ label: isHub ? t('leave') : t('walkAway'), value: -1, cls: 'leave' });
      const v = await choose(choices, opts);
      if (v === -1) {
        if (!isHub) { addFlag('door_left_mid'); S.flags.door_left_last = 1; }
        dirty(); checkAch();
        if (!isHub) await speak([{ who: 'narr', t: { ja: '背中に、視線のような静けさが残った。', en: 'A silence like a gaze stays on your back.', ru: 'Спину провожает тишина, похожая на взгляд.' } }], opts);
        break;
      }
      const ch = node.choices[v];
      if (ch.once) S.once[id + ':' + v] = 1;
      applyEffects(ch); dirty();
      id = ch.next; continue;
    }
    id = node.next;
  }
  closeDialog(); dirty(); checkAch();
  return null;
}
function markGreeting(node) {
  const map = { g_e_both: 'd_ack_both', g_e_dawn: 'd_ack_dawn', g_e_forget: 'd_ack_forget', g_e_tsubu: 'd_ack_tsubu', g_e_shift: 'd_ack_shift', g_leftmany: 'd_g_leftmany', g_n6: 'd_g_n6', g_room4: 'd_g_room4', g_clock2: 'd_g_clk2', g_clock: 'd_g_clk', g_silence: 'd_g_sil', g_v25: 'd_g_25', g_v10: 'd_g_10', g_fails: 'd_g_fails', g_srank: 'd_g_srank', g_anom: 'd_g_anom', g_r3: 'd_g_r3', g_day: 'd_g_day', g_pud: 'd_g_pud' };
  if (node === 'g_neglect') S.flags.d_g_neg = 1;
  else if (node === 'g_neglect2') S.flags.d_g_neg = 2;
  else if (map[node] && !S.flags[map[node]]) S.flags[map[node]] = 1;
}

// ---------------------------------------------------------- endings
export function showEnding(key, replay) {
  return new Promise(async res => {
    const e = DOOR.endings[key]; if (!e) return res();
    if (!replay) { S.endings[key] = Date.now(); dirty(); }
    audio.play(key === 'dawn' || key === 'both' ? 'roof' : 'door');
    const el = h('div', { class: 'ending' + (key === 'dawn' || key === 'both' ? ' dawn' : '') });
    const head = h('div', { class: 'muted', style: 'letter-spacing:.3em' }, t('end_title'));
    const title = h('h1', {}, L(e.title));
    const para = h('div', { class: 'para' });
    const tap = h('div', { class: 'boot-tap', style: 'font-size:.85em' }, t('tapToContinue'));
    el.append(head, title, para, tap);
    document.getElementById('stage').append(el);
    let i = 0, typing = false, full = '';
    const showNext = async () => {
      if (typing) { typing = false; para.textContent = full; return; }
      if (i >= e.text.length) {
        el.removeEventListener('pointerdown', showNext); tap.remove();
        el.append(h('button', { class: 'btn primary', onclick: () => { audio.sfx('click'); el.remove(); res(); } }, t('end_back')));
        return;
      }
      full = L(e.text[i++]); para.textContent = ''; typing = true; audio.sfx('tick');
      for (const ch of full) { if (!typing) break; para.textContent += ch; await wait(S.settings.textSpeed >= 4 ? 0 : 28); }
      typing = false; para.textContent = full;
    };
    el.addEventListener('pointerdown', showNext);
    await wait(1200); showNext();
    checkAch();
  });
}
