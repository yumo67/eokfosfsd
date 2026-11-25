// Tsubu — the bean in the pill bottle. Real-time needs, care actions, memory, bond, hidden reactions.
import { S, dirty, flag, setFlag, addFlag } from '../core/state.js';
import { P } from '../core/palette.js';
import { W, H, hiCanvas, releaseCanvas, bindPointer, h, wait } from '../core/stage.js';
import { L, t, fmt } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import { tsubu as drawTsubu } from '../core/sprites.js';
import * as D from '../core/draw.js';
import { ITEMS } from '../data/items.js';
import { TSUBU } from '../data/story.js';
import { icon } from './mesh3d.js';
import { iconCanvas } from './icons.js';
import { say } from './dialogue.js';
import { toast, giveItem, hasItem, takeItem, unlockAch, checkAch } from './game.js';

const root = document.getElementById('tg');
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const TB = () => S.tsubu;

// ---------------------------------------------------------- simulation (runs always)
export function tickTsubu(now = Date.now()) {
  const s = TB(); if (!S.flags.tsubu_met) { s.last = now; return; }
  let mins = (now - (s.last || now)) / 60000; if (mins <= 0) return;
  s.last = now;
  const away = mins;
  mins = Math.min(mins, 720); // cap offline decay at 12h
  const k = s.asleep ? 0.4 : 1;
  s.hunger = clamp(s.hunger - mins * 0.45 * k);
  s.clean = clamp(s.clean - mins * 0.22);
  s.mood = clamp(s.mood - mins * (s.hunger < 25 || s.clean < 25 ? 0.6 : 0.3) * k);
  s.energy = s.asleep ? clamp(s.energy + mins * 1.4) : clamp(s.energy - mins * 0.3);
  if (s.asleep && s.energy >= 98) s.asleep = false;
  if (!s.asleep && s.energy < 8) s.asleep = true;
  const bad = (s.hunger < 12 ? 1 : 0) + (s.clean < 12 ? 1 : 0);
  if (bad) s.health = clamp(s.health - mins * 0.5 * bad); else if (!s.sick) s.health = clamp(s.health + mins * 0.3);
  if (!s.sick && s.health < 40) { s.sick = true; s.mem.sickCount++; react('sick'); }
  if (away > 240 && (s.hunger < 30 || s.mood < 30)) { s.mem.neglect++; s._neglected = true; }
  dirty();
}
export function tsubuMood() {
  const s = TB();
  if (s.asleep) return 'sleep'; if (s.sick) return 'sick';
  if (s.hunger < 25 || s.mood < 30) return 'sad';
  if (s.mood > 75) return 'happy';
  return 'normal';
}
function react(id) { const s = TB(); if (!s.reactions[id]) { s.reactions[id] = Date.now(); S.flags.tsubu_reacts = Object.keys(s.reactions).length; dirty(); checkAch(); } }
function bondXp(n) {
  const s = TB(); s.bondXp += n;
  const need = 10 + s.bond * 4;
  if (s.bondXp >= need && s.bond < 10) { s.bondXp -= need; s.bond++; bubbleSay(pick(TSUBU.bond_up)); audio.sfx('ach'); toast(`${t('tg_bond')} ${s.bond}`, t('tsubu'), { badge: '♥', mini: true }); checkAch(); }
  dirty();
}

// ---------------------------------------------------------- view
let cv, g, raf = 0, last = 0, T = 0, running = false, resolveClose = null;
const anim = { jump: 0, eat: 0, dizzy: 0, wow: 0, bubbles: [], hearts: [], crumbs: [], petAcc: 0, petTimes: [], rub: 0, mode: null, ball: null, plays: 0 };
let bubble = null;
const TX = 240, TY = 196, TS = 6;

export function openTsubu(withItem = null) {
  return new Promise(async res => {
    resolveClose = res; running = true;
    tickTsubu();
    root.classList.remove('hidden'); root.innerHTML = '';
    cv = h('canvas', { width: W, height: H }); root.append(cv); g = hiCanvas(cv);
    bindPointer(cv, { down: onDown, move: onMove, up: onUp });
    buildUi();
    audio.play('dialog');
    last = performance.now(); raf = requestAnimationFrame(loop);
    const first = !S.flags.tsubu_met;
    if (first) {
      setFlag('tsubu_met', 1); TB().last = Date.now();
      await wait(400); await bubbleSeq([TSUBU.greet[0]]);
      await giveItem('ball'); checkAch();
    } else greet();
    if (withItem) useItem(withItem);
  });
}
function closeTsubu() {
  running = false; cancelAnimationFrame(raf); releaseCanvas(cv); root.classList.add('hidden'); root.innerHTML = ''; bubble = null;
  anim.mode = null; anim.ball = null;
  audio.play('clinic'); dirty();
  const r = resolveClose; resolveClose = null; r && r();
}

function greet() {
  const s = TB(); const hr = new Date().getHours(); const mn = new Date().getMinutes();
  if (hr === 3 && mn === 33) { react('333'); unlockAch('real333'); return bubbleSay(pick(TSUBU.late_night)); }
  if (s.asleep) return bubbleSay(pick(TSUBU.sleep));
  if (s._neglected) { s._neglected = false; react('neglected'); return bubbleSeq([pick(TSUBU.neglected_return), ...(s.mem.neglect >= 2 ? [pick(TSUBU.remembers_neglect)] : [])]); }
  if (s.sick) return bubbleSay(pick(TSUBU.sick));
  if (S.flags.heard_knock && !S.flags.has_bow && Math.random() < 0.6) { react('shiny'); return bubbleSay(pick(TSUBU.hint_shiny)); }
  if (hr >= 0 && hr < 5 && Math.random() < 0.4) { react('late'); return bubbleSay(pick(TSUBU.late_night)); }
  if (S.night >= 4 && Math.random() < 0.25) { react('eerie'); return bubbleSay(pick(TSUBU.eerie)); }
  if (s.mem.lastFood && Math.random() < 0.35) { react('remember_food'); return bubbleSay(TSUBU.remembers_food[Math.floor(Math.random() * TSUBU.remembers_food.length)], { food: L(ITEMS[s.mem.lastFood]?.name) }); }
  if (s.hunger < 30) return bubbleSay(pick(TSUBU.hungry));
  if (s.clean < 30) return bubbleSay(pick(TSUBU.dirty));
  if (s.mood < 35) return bubbleSay(pick(TSUBU.attention));
  bubbleSay(pick(s.mood > 70 ? TSUBU.happy.concat(TSUBU.greet) : TSUBU.greet));
}
let bubbleTimer = null;
function bubbleSay(txt, vars) {
  const s = fmt(L(txt), vars || {});
  if (bubble) bubble.remove();
  bubble = h('div', { class: 'tg-bubble px' }, s); bubble.style.left = (TX / W * 100) + '%'; bubble.style.top = ((TY - 92) / H * 100) + '%';
  root.append(bubble);
  for (let i = 0; i < Math.min(8, [...s].length / 3); i++) setTimeout(() => audio.blip('tsubu'), i * 70);
  clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => { bubble?.remove(); bubble = null; }, 2600 + s.length * 40);
}
async function bubbleSeq(list) { for (const x of list) { bubbleSay(x); await wait(2200 + L(x).length * 35); } }

let sideEl = null;
function buildUi() {
  sideEl = h('div', { class: 'tg-side px' }); root.append(sideEl); renderSide();
  const acts = h('div', { class: 'tg-acts' });
  const A = (ico, key, fn) => acts.append(h('button', { class: 'btn', onclick: () => { audio.sfx('click'); fn(); } }, ico, t(key)));
  const mi = id => { const c = icon(id, 24, 24); return c; };
  A(mi('onigiri'), 'tg_feed', () => picker('food'));
  A(mi('ball'), 'tg_play', () => picker('toy'));
  A(mi('box'), 'tg_clean', () => startClean());
  A(mi('ribbon'), 'tg_dress', () => picker('decor'));
  A(mi('capsule'), 'tg_med', () => picker('med'));
  A(mi('candy'), 'tg_light', () => toggleSleep());
  root.append(acts);
  root.append(h('button', { class: 'btn sm tg-close', onclick: () => { audio.sfx('click'); closeTsubu(); } }, t('close')));
}
function renderSide() {
  if (!sideEl) return; const s = TB();
  sideEl.innerHTML = '';
  const status = s.sick ? t('tg_status_sick') : s.asleep ? t('tg_status_sleep') : s.hunger < 25 ? t('tg_status_hungry') : s.mood < 30 ? t('tg_status_lonely') : t('tg_status_ok');
  sideEl.append(h('div', { style: 'display:flex;justify-content:space-between' }, h('b', { style: 'font-weight:400' }, t('tsubu')), h('span', { class: s.sick ? 'redtext' : 'muted' }, status)));
  const meter = (k, v) => sideEl.append(h('div', { class: 'meter' + (v < 25 ? ' low' : '') }, h('span', {}, t(k)), h('div', { class: 'mb' }, h('i', { style: `width:${v}%` }))));
  meter('tg_hunger', s.hunger); meter('tg_mood', s.mood); meter('tg_energy', s.energy); meter('tg_clean2', s.clean);
  const hearts = h('div', { class: 'hearts' }); for (let i = 0; i < 10; i++) hearts.append(h('span', { class: i < s.bond ? 'on' : '' }, '♥'));
  sideEl.append(h('div', { class: 'meter' }, h('span', {}, t('tg_bond')), hearts));
  sideEl.append(h('div', { class: 'muted', style: 'font-size:.85em' }, `${t('tg_reactions')}: ${Object.keys(s.reactions).length}`));
}

function picker(kind) {
  root.querySelector('.tg-picker')?.remove();
  const ids = Object.keys(S.inv).filter(id => {
    const it = ITEMS[id]; if (!it || !S.inv[id]) return false;
    if (kind === 'food') return it.food != null;
    if (kind === 'toy') return it.cat === 'toy';
    if (kind === 'decor') return !!it.slot;
    if (kind === 'med') return id === 'medicine' || id === 'bitter';
  });
  if (!ids.length) { toast(t(kind === 'food' ? 'tg_noFood' : kind === 'toy' ? 'tg_noToy' : kind === 'med' ? 'tg_noMed' : 'emptyBag'), '', { badge: '…', mini: true }); audio.sfx('bad'); return; }
  const pk = h('div', { class: 'tg-picker px' });
  ids.forEach(id => {
    const on = ITEMS[id].slot && TB()[ITEMS[id].slot] === id;
    pk.append(h('button', { class: 'slot' + (on ? ' on' : ''), type: 'button', title: L(ITEMS[id].name), onclick: () => { pk.remove(); useItem(id); } }, icon(ITEMS[id].mesh, 40, 32), S.inv[id] > 1 ? h('span', { class: 'cnt' }, '×' + S.inv[id]) : null));
  });
  pk.append(h('button', { class: 'btn sm', onclick: () => pk.remove() }, t('close')));
  root.append(pk);
}

function useItem(id) {
  const s = TB(); const it = ITEMS[id]; if (!it) return;
  if (id === 'stethoscope') { setFlag('steth_tsubu', 1); react('steth'); checkAch(); say(TSUBU.stethoscope); return; }
  if (s.asleep && id !== 'medicine') { wakeUp(); return; }
  if (it.food != null) return feed(id);
  if (it.cat === 'toy') return startPlay(id);
  if (it.slot) {
    const on = s[it.slot] === id; s[it.slot] = on ? null : id; dirty();
    if (!on) { bubbleSay(pick(TSUBU.decor)); anim.wow = 1; audio.sfx('pop'); bondXp(1); if (s.hat && s.acc) { unlockAch('tsubu_fashion'); react('fashion'); } }
    return;
  }
  if (id === 'medicine') {
    takeItem('medicine'); audio.sfx('eat');
    if (s.sick) { s.sick = false; s.health = 80; bubbleSeq([pick(TSUBU.medicine), pick(TSUBU.recover)]); unlockAch('tsubu_sick'); react('recover'); bondXp(4); }
    else { s.mood = clamp(s.mood - 8); bubbleSay(pick(TSUBU.medicine)); }
    dirty(); renderSide(); return;
  }
  if (it.cat === 'care' && id === 'sponge') return startClean();
}

function feed(id) {
  const s = TB(); const it = ITEMS[id];
  if (s.hunger > 92) { bubbleSay(pick(TSUBU.full)); react('full'); return; }
  takeItem(id); anim.eat = 1.2; audio.sfx('eat');
  s.hunger = clamp(s.hunger + it.food); s.mem.lastFood = id; s.mem.foods[id] = (s.mem.foods[id] || 0) + 1;
  S.flags.tsubu_fed = (S.flags.tsubu_fed || 0) + 1;
  for (let i = 0; i < 6; i++) anim.crumbs.push({ x: TX + (Math.random() - .5) * 20, y: TY - 30, vx: (Math.random() - .5) * 40, vy: -40 - Math.random() * 30, life: 1 });
  if (it.fav) { s.mood = clamp(s.mood + 20); bubbleSay(pick(TSUBU.eat_fav)); react('fav'); bondXp(3); anim.jump = 1; }
  else if (it.dislike) { s.mood = clamp(s.mood - 10); bubbleSay(pick(TSUBU.eat_dislike)); react('dislike'); }
  else { s.mood = clamp(s.mood + 6); bubbleSay(pick(TSUBU.eat)); bondXp(1); }
  dirty(); renderSide(); checkAch();
}
function toggleSleep() {
  const s = TB();
  if (s.asleep) { wakeUp(true); return; }
  s.asleep = true; dirty(); bubbleSay(pick(TSUBU.sleep)); renderSide();
}
function wakeUp(gentle = false) {
  const s = TB(); s.asleep = false;
  if (!gentle) { s.mem.wakes++; s.mood = clamp(s.mood - 10); bubbleSay(pick(TSUBU.wake_grumpy)); react('grumpy'); anim.jump = .6; if (s.mem.wakes >= 3) unlockAch('tsubu_wake'); }
  else bubbleSay(pick(TSUBU.greet));
  dirty(); renderSide();
}

// --- cleaning: rub over Tsubu
function startClean() { anim.mode = 'clean'; anim.rub = 0; toast(t('tg_rubHint'), '', { badge: '○', mini: true }); }
// --- play: tap the ball to keep it bouncing towards Tsubu
function startPlay(id) {
  const s = TB();
  if (s.energy < 12) { bubbleSay(pick(TSUBU.sad)); return; }
  if (!s.mem['toy_' + id]) { s.mem['toy_' + id] = 1; bubbleSay(pick(TSUBU.toy_new)); } else bubbleSay(pick(TSUBU.play));
  anim.mode = 'play'; anim.ball = { id, x: 120, y: 60, vx: 60, vy: 0, hits: 0, time: 12 };
  toast(t('tg_catchHint'), '', { badge: '●', mini: true });
}

// ---------------------------------------------------------- input
let lastPt = null;
function onDown(x, y) {
  const s = TB();
  root.querySelector('.tg-picker')?.remove();
  if (anim.mode === 'play' && anim.ball) {
    const b = anim.ball; if (Math.hypot(x - b.x, y - b.y) < 22) { b.vy = -180 - Math.random() * 40; b.vx = (TX - b.x) * 0.9 + (Math.random() - .5) * 80; b.hits++; audio.sfx('pop'); anim.hearts.push({ x: b.x, y: b.y, life: 1 }); }
    return;
  }
  if (anim.mode === 'clean') { lastPt = { x, y }; return; }
  if (Math.hypot(x - TX, y - (TY - 36)) < 46) {
    if (s.asleep) { wakeUp(); return; }
    tapTsubu();
  }
}
function onMove(x, y) {
  if (anim.mode === 'clean' && lastPt) {
    const d = Math.hypot(x - lastPt.x, y - lastPt.y);
    if (Math.hypot(x - TX, y - (TY - 36)) < 60) {
      anim.rub += d; if (Math.random() < 0.4) anim.bubbles.push({ x, y, r: 2 + Math.random() * 4, life: 1, vy: -10 - Math.random() * 20 });
      if (Math.floor(anim.rub / 60) !== Math.floor((anim.rub - d) / 60)) audio.sfx('swish');
      const k = S.inv.sponge ? 2 : 1;
      TB().clean = clamp(TB().clean + d * 0.04 * k);
      if (anim.rub > 900) { anim.mode = null; TB().mem.cleans++; bubbleSay(pick(TSUBU.clean)); react('bath'); bondXp(2); TB().mood = clamp(TB().mood + 6); renderSide(); dirty(); }
    }
    lastPt = { x, y };
  }
}
function onUp() { lastPt = null; }

function tapTsubu() {
  const s = TB(); const now = performance.now();
  // rhythm log for the secret: 3 · 1 · 3
  s.tapLog = (s.tapLog || []).filter(x => now - x < 6000); s.tapLog.push(now);
  if (S.flags.heard_knock && !S.flags.has_bow && checkRhythm(s.tapLog)) { s.tapLog = []; keyCough(); return; }
  anim.petTimes = anim.petTimes.filter(x => now - x < 5000); anim.petTimes.push(now);
  s.mem.pets++; audio.sfx('tap'); anim.jump = 0.5;
  anim.hearts.push({ x: TX + (Math.random() - .5) * 30, y: TY - 70, life: 1 });
  if (anim.petTimes.length >= 14) { anim.petTimes = []; anim.dizzy = 3; s.mood = clamp(s.mood - 5); bubbleSay(pick(TSUBU.pet_too_much)); react('dizzy'); unlockAch('tsubu_dizzy'); return; }
  s.mood = clamp(s.mood + 2.5);
  if (s.mem.pets % 6 === 0) { bubbleSay(pick(TSUBU.pet)); bondXp(1); }
  dirty(); if (s.mem.pets % 3 === 0) renderSide();
}
function checkRhythm(log) {
  if (log.length < 7) return false;
  const last7 = log.slice(-7); const gaps = []; for (let i = 1; i < 7; i++) gaps.push(last7[i] - last7[i - 1]);
  // expected: short short LONG LONG short short  (3 taps, pause, 1 tap, pause, 3 taps)
  const sh = gp => gp < 420, lo = gp => gp >= 480 && gp < 1800;
  return sh(gaps[0]) && sh(gaps[1]) && lo(gaps[2]) && lo(gaps[3]) && sh(gaps[4]) && sh(gaps[5]);
}
async function keyCough() {
  react('hiccup'); anim.jump = 1; audio.sfx('hiccup');
  await say(TSUBU.key_cough);
  audio.sfx('hiccup');
  await giveItem('key_bow');
  setFlag('has_bow', 1); checkAch();
}

// ---------------------------------------------------------- loop & drawing
function loop(now) {
  if (!running) return;
  raf = requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
  update(dt); draw();
}
let sideT = 0, simT = 0;
function update(dt) {
  anim.jump = Math.max(0, anim.jump - dt * 2); anim.eat = Math.max(0, anim.eat - dt); anim.dizzy = Math.max(0, anim.dizzy - dt); anim.wow = Math.max(0, anim.wow - dt);
  for (const b of anim.bubbles) { b.y += b.vy * dt; b.life -= dt; } anim.bubbles = anim.bubbles.filter(b => b.life > 0);
  for (const b of anim.hearts) { b.y -= 30 * dt; b.life -= dt; } anim.hearts = anim.hearts.filter(b => b.life > 0);
  for (const c of anim.crumbs) { c.x += c.vx * dt; c.y += c.vy * dt; c.vy += 200 * dt; c.life -= dt; } anim.crumbs = anim.crumbs.filter(c => c.life > 0);
  const b = anim.ball;
  if (anim.mode === 'play' && b) {
    b.time -= dt; b.vy += 260 * dt; b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < 20 || b.x > 460) { b.vx *= -1; b.x = Math.max(20, Math.min(460, b.x)); }
    if (b.y > 236) {
      b.y = 236; b.vy = -Math.abs(b.vy) * 0.45; b.vx *= 0.7; if (Math.abs(b.vy) < 40) b.vy = 0;
    }
    if (b.time <= 0 || (b.vy === 0 && Math.abs(b.vx) < 5 && b.time < 10)) {
      const s = TB(); anim.mode = null;
      s.mood = clamp(s.mood + 4 + b.hits * 3); s.energy = clamp(s.energy - 6 - b.hits); s.mem.plays++;
      bondXp(1 + Math.floor(b.hits / 3)); bubbleSay(pick(b.hits >= 5 ? TSUBU.happy : TSUBU.play)); react(b.hits >= 8 ? 'play_star' : 'play'); anim.ball = null; renderSide(); dirty();
    }
  }
  simT += dt; if (simT > 5) { simT = 0; tickTsubu(); renderSide(); }
}
function draw() {
  const s = TB();
  // room: milk wall with pill-bottle wallpaper, window, cushion
  D.rect(g, 0, 0, W, H, P.milk);
  for (let x = 0; x < W; x += 20) D.rect(g, x, 0, 10, 200, P.milk2);
  for (let y = 30; y < 200; y += 40) for (let x = (y / 40 % 2) * 20 + 10; x < W; x += 40) { D.rect(g, x, y, 4, 7, P.gray3); D.rect(g, x, y, 4, 2, P.rose2); }
  D.rect(g, 0, 200, W, 70, P.gray3); for (let x = 0; x < W; x += 32) D.rect(g, x, 200, 1, 70, P.gray2);
  D.rect(g, 0, 198, W, 2, P.ink);
  // window
  D.rect(g, 330, 40, 100, 80, P.ink); D.rect(g, 333, 43, 94, 74, s.asleep ? P.ink2 : P.ink3);
  D.rect(g, 379, 43, 2, 74, P.ink); D.rect(g, 333, 79, 94, 2, P.ink);
  D.circle(g, 405, 60, 7, P.milk3); D.circle(g, 402, 58, 6, s.asleep ? P.ink2 : P.ink3);
  for (let i = 0; i < 6; i++) D.rect(g, 340 + (i * 37) % 80, 50 + (i * 23) % 60, 1, 1, P.milk2);
  // bottle (Tsubu's home)
  D.rect(g, TX - 44, TY - 86, 88, 92, 'rgba(235,229,220,0.5)'); D.stroke(g, TX - 44, TY - 86, 88, 92, P.ash, 1);
  D.rect(g, TX - 48, TY - 98, 96, 12, P.red); D.rect(g, TX - 48, TY - 98, 96, 2, P.rose); D.rect(g, TX - 48, TY - 88, 96, 2, P.red2);
  D.rect(g, TX - 40, TY - 60, 80, 22, P.milk3); D.stroke(g, TX - 40, TY - 60, 80, 22, P.gray2, 1);
  D.text(g, 'TSUBU', TX, TY - 56, { size: 8, color: P.red, align: 'center' });
  D.text(g, 'No.4', TX, TY - 47, { size: 6, color: P.gray, align: 'center' });
  D.rect(g, TX - 52, TY + 4, 104, 6, P.rose2); D.rect(g, TX - 52, TY + 8, 104, 2, P.rose);
  // dirt specks
  if (s.clean < 50) for (let i = 0; i < (50 - s.clean) / 4; i++) D.rect(g, TX - 30 + (i * 17) % 60, TY - 20 - (i * 11) % 40, 2, 2, P.ash2);
  // Tsubu
  let mood = tsubuMood(); if (anim.eat > 0) mood = 'eat'; else if (anim.wow > 0 || anim.ball) mood = 'wow'; else if (anim.jump > 0.3 && mood === 'normal') mood = 'happy';
  const jy = -Math.round(Math.sin(anim.jump * Math.PI) * 10);
  g.save();
  if (anim.dizzy > 0) { g.translate(TX, TY); g.rotate(Math.sin(T * 14) * 0.15); g.translate(-TX, -TY); }
  const hat = (s.hat || '').replace('hat_', '') || null, acc = (s.acc || '').replace('acc_', '') || null;
  drawTsubu(g, TX, TY + jy, { mood, t: T, s: TS, hat, acc });
  g.restore();
  if (anim.dizzy > 0) for (let i = 0; i < 3; i++) { const a = T * 6 + i * 2.1; D.rect(g, TX + Math.cos(a) * 30, TY - 80 + Math.sin(a) * 6, 3, 3, P.red); }
  if (s.asleep) { const z = Math.floor(T * 1.2) % 3; D.text(g, 'z'.repeat(z + 1), TX + 40, TY - 90 - z * 4, { size: 10, color: P.ash }); }
  if (s.sick) { D.rect(g, TX + 30, TY - 70, 3, 10, P.red); D.rect(g, TX + 30, TY - 58, 3, 3, P.red); }
  for (const b of anim.bubbles) { D.ring(g, b.x, b.y, b.r, P.milk3); }
  for (const hh of anim.hearts) { g.globalAlpha = hh.life; D.text(g, '♥', hh.x, hh.y, { size: 10, color: P.red, align: 'center' }); g.globalAlpha = 1; }
  for (const c of anim.crumbs) D.rect(g, c.x, c.y, 2, 2, P.milk3);
  if (anim.mode === 'clean') { D.text(g, t('tg_rubHint'), TX, 32, { size: 10, color: P.ash, align: 'center' }); D.rect(g, TX - 50, 46, 100, 4, P.gray3); D.rect(g, TX - 50, 46, Math.min(100, anim.rub / 9), 4, P.red); }
  if (anim.mode === 'play' && anim.ball) {
    const b = anim.ball; D.circle(g, b.x, b.y, 8, b.id === 'yarn' ? P.rose : P.red); D.rect(g, b.x - 3, b.y - 4, 3, 2, P.milk3); D.rect(g, b.x - 6, 238, 12, 2, 'rgba(18,16,18,0.2)');
    D.text(g, `${t('tg_catchHint')}  ×${b.hits}`, TX, 32, { size: 10, color: P.ash, align: 'center' });
  }
}
