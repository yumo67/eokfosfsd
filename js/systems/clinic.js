// The clinic: room rendering, Emrys walking, hotspots, NPCs, story tasks, HUD, special interactions.
import { S, bus, dirty, flag, setFlag, addFlag, cond } from '../core/state.js';
import { P } from '../core/palette.js';
import { ring, rect } from '../core/draw.js';
import { W, H, hiCanvas, bindPointer, fade, wait, h, unit } from '../core/stage.js';
import { L, t } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import { chibi } from '../core/sprites.js';
import { ROOMS, FLOOR_Y } from '../data/rooms.js';
import { STORY, NAMES } from '../data/story.js';
import { ITEMS } from '../data/items.js';
import { say, choose, inDialog } from './dialogue.js';
import { toast, giveItem, hasItem, takeItem, noteAnomaly, addCoins, checkAch, unlockAch } from './game.js';
import { iconCanvas } from './icons.js';
import { runMinigame, MG_TITLES } from './mg.js';
import { openPanel, panelOpen } from './panels.js';
import { openTsubu, tsubuMood } from './tamagotchi.js';
import { openDoor } from './doorway.js';
import { nightDone, endNight, currentNight, dailyList, startDaily, pendingTasks, taskFor, runTask } from './flow.js';

const cv = document.getElementById('scene');
const labels = document.getElementById('labels');
const hud = document.getElementById('hud');
let g = null, active = false, raf = 0, last = 0, T = 0;
const emrys = { x: 200, tx: 200, dir: 1, walk: 0, moving: false, onArrive: null, blinkT: 0 };
const fx = { clockBack: 0, longPress: 0, shake: 0 };
const ripples=[];
const bufs = {};

export function initClinic() {
  g = hiCanvas(cv);
  bindPointer(cv, { down: onDown, up: onUp, move: () => { } });
  bus.on('inv', renderHud); bus.on('coins', renderHud); bus.on('anomaly', renderHud);
}
export function clinicActive() { return active; }

export function showClinic(on = true) {
  active = on;
  hud.classList.toggle('hidden', !on);
  labels.classList.toggle('hidden', !on);
  if (on) { renderHud(); renderLabels(); audio.play(ROOMS[S.room].music || 'clinic'); if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  else { cancelAnimationFrame(raf); raf = 0; }
}

function st() {
  return { night: S.night, clockBack: fx.clockBack > 0, doorNoticed: !!S.flags.door_noticed, curtainOpen: !!S.flags.curtain_open, longPress: fx.longPress, tsubuMood: tsubuMood(), tsubuHat: (S.tsubu.hat || '').replace('hat_', '') || null };
}
function buffer(id) {
  const s = st(); const key = [id, s.night, s.doorNoticed, s.curtainOpen].join('|');
  if (bufs[id]?.key === key) return bufs[id].cv;
  const b = document.createElement('canvas'); b.width = W; b.height = H; const bg = b.getContext('2d');
  ROOMS[id].draw(bg, s);
  bufs[id] = { key, cv: b }; return b;
}
export function invalidateRoom() { for (const k in bufs) delete bufs[k]; }

function hotspots() {
  const r = ROOMS[S.room]; let list = (r.hotspots || []).filter(hs => !hs.req || cond(hs.req));
  // task NPCs placed into rooms where they don't normally stand
  const extra = [];
  for (const task of pendingTasks()) {
    if (task.room !== S.room) continue;
    if (task.who === 'unknown') continue; // attached to curtain4
    if (list.some(hs => hs.act === 'npc' && hs.who === task.who)) continue;
    extra.push({ id: 'tnpc_' + task.who, x: 226, y: 150, w: 32, h: 66, act: 'npc', who: task.who, visitor: true });
  }
  return list.concat(extra);
}
function visitors() { return hotspots().filter(hs => hs.visitor); }

// ---------------------------------------------------------------- loop
function loop(now) {
  raf = requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
  if (!active) return;
  update(dt); draw();
}
function update(dt) {
  for(let i=ripples.length-1;i>=0;i--){ripples[i].age+=dt;if(ripples[i].age>=.55)ripples.splice(i,1);}
  if (fx.clockBack > 0) fx.clockBack -= dt;
  if (pressing) { fx.longPress = Math.min(1, (performance.now() - pressing.t0) / 3000); if (fx.longPress >= 1) { const p = pressing; pressing = null; fx.longPress = 0; longPressDone(p.hs); } }
  else fx.longPress = Math.max(0, fx.longPress - dt * 2);
  if (emrys.moving) {
    const d = emrys.tx - emrys.x; const sp = 115 * dt;
    if (Math.abs(d) <= sp) { emrys.x = emrys.tx; emrys.moving = false; const f = emrys.onArrive; emrys.onArrive = null; S.x = emrys.x; dirty(); f && f(); }
    else { emrys.x += Math.sign(d) * sp; emrys.dir = Math.sign(d); emrys.walk += dt * 8; if (Math.floor(emrys.walk) !== Math.floor(emrys.walk - dt * 8)) { S.stats.steps++; if (Math.floor(emrys.walk) % 2 === 0) audio.sfx('step'); } }
  }
}
function draw() {
  const r = ROOMS[S.room]; const s = st();
  g.save();
  if (fx.shake > 0 && S.settings.shake) { g.translate((Math.random() - .5) * fx.shake, (Math.random() - .5) * fx.shake); fx.shake *= 0.9; if (fx.shake < .3) fx.shake = 0; }
  g.drawImage(buffer(S.room), 0, 0, W, H);
  r.anim && r.anim.call(r, g, T, s);
  for(const q of ripples){
    g.save();g.translate(q.x,FLOOR_Y+1);g.scale(1,.36);g.globalAlpha=Math.max(0,1-q.age/.55);
    ring(g,0,0,4+q.age*25,P.red,1);rect(g,-1,-1,2,2,P.milk3);g.restore();
  }
  // standing NPCs
  const actors = [];
  (r.npcs || []).forEach(n => { if (n.who === 'rin' && pendingTasks().some(tk => tk.who === 'rin' && tk.room !== S.room)) return; actors.push({ who: n.who, x: n.x, y: n.y, flip: false, behind: n.behind }); });
  visitors().forEach(v => actors.push({ who: v.who, x: v.x + 16, y: FLOOR_Y - 4, flip: true }));
  const ems = { who: 'emrys', x: emrys.x, y: FLOOR_Y, flip: emrys.dir < 0, frame: emrys.moving ? Math.floor(emrys.walk) % 4 : 0, me: true, moving: emrys.moving };
  actors.push(ems); actors.sort((a, b) => a.y - b.y);
  for (const a of actors) {
    const blink = (Math.floor(T * 1.3 + a.x) % 7 === 0) && (T * 1.3 % 1 < 0.15);
    const scale=a.me?2.4:2.25;
    g.save(); g.translate(Math.round(a.x), a.y); g.scale(scale,scale);
    const motion=S.settings.anim!=='reduced';
    chibi(g, a.who, 0, 0, { frame: a.frame || 0, moving: !!a.moving, flip: a.flip, blink:motion&&blink, time:motion?T+a.x:0,bob: a.me?0:(motion && Math.sin(T*2+a.x)>.65 ? 1 : 0) });
    g.restore();
    if (a.behind) { // counter in front of Rin
      const b = buffer(S.room); g.drawImage(b, 150, 150, 200, 62, 150, 150, 200, 62);
    }
  }
  // night wrongness: vignette + occasional red flicker
  const wr = Math.min(1, (S.night - 1) / 5);
  if (wr > 0) {
    const grd = g.createRadialGradient(240, 150, 120, 240, 150, 300); grd.addColorStop(0, 'rgba(18,16,18,0)'); grd.addColorStop(1, `rgba(18,16,18,${0.15 + wr * 0.35})`);
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    if (S.night >= 4 && Math.sin(T * 0.37) > 0.995) { g.fillStyle = 'rgba(179,40,58,0.12)'; g.fillRect(0, 0, W, H); }
  }
  if (S.settings.noise) { g.fillStyle = 'rgba(18,16,18,0.05)'; for (let i = 0; i < 40; i++) g.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1, 1); }
  if (fx.longPress > 0) { g.fillStyle = 'rgba(18,16,18,' + fx.longPress * 0.5 + ')'; g.fillRect(0, 0, W, H); }
  g.restore();
  positionMarks();
}

// ---------------------------------------------------------------- input
let pressing = null, tapInfo = null;
function hit(x, y) { const list = hotspots(); for (let i = list.length - 1; i >= 0; i--) { const hs = list[i]; if (x >= hs.x && x <= hs.x + hs.w && y >= hs.y && y <= hs.y + hs.h) return hs; } return null; }
function onDown(x, y) {
  if (!active || inDialog() || panelOpen() || busy) return;
  S.stats.taps++; audio.unlock();
  // Emrys himself
  if (Math.abs(x - emrys.x) < 15 && y > FLOOR_Y - 74 && y < FLOOR_Y + 2 && !emrys.moving) { pokeEmrys(); return; }
  const hs = hit(x, y);
  if (hs && hs.act === 'lostfound') { pressing = { hs, t0: performance.now() }; return; }
  if (hs && hs.act === 'clock') { emrys.dir = hs.x + hs.w / 2 < emrys.x ? -1 : 1; clockTap(hs); return; }
  if (hs) { audio.sfx('tap'); walkTo(hs.x + hs.w / 2, () => interact(hs)); return; }
  if (y > 200) { walkTo(x); spawnRipple(x, y); }
}
function onUp() {
  if (pressing) { const p = pressing; const held = performance.now() - p.t0; pressing = null; if (held < 600) walkTo(p.hs.x + p.hs.w / 2, () => examine(p.hs.id)); else if (fx.longPress < 1) toast(t('holdOn'), '', { badge: '…', mini: true }); }
}
function spawnRipple(x) {
  if(S.settings.anim==='reduced')return;
  const [a,b]=ROOMS[S.room].floor;ripples.push({x:Math.max(a,Math.min(b,x)),age:0});
}
export function walkTo(x, cb) {
  const r = ROOMS[S.room]; const [a, b] = r.floor || [20, 460];
  emrys.tx = Math.max(a, Math.min(b, x)); emrys.moving = Math.abs(emrys.tx - emrys.x) > 1; emrys.onArrive = cb || null;
  if (!emrys.moving) { emrys.onArrive = null; cb && cb(); }
}

let busy = false;
async function guard(fn) { if (busy) return; busy = true; try { await fn(); } catch (e) { console.error(e); } busy = false; renderHud(); renderLabels(); checkAch(); }

async function pokeEmrys() {
  addFlag('emrys_pokes'); audio.sfx('pop');
  const q = STORY.emrys_quips; const i = flag('emrys_pokes') % q.length;
  const emo = ['normal', 'annoyed', 'think', 'crossed', 'wary', 'ponder'][i % 6];
  guard(() => say([{ who: 'emrys', emo, t: q[i] }]));
}

export function examineLines(id) {
  const ex = STORY.examine[id]; if (!ex) return null;
  let lines = ex.def; let best = 0;
  for (const k in ex.n || {}) { const n = +k; if (n <= S.night && n >= best) { best = n; lines = ex.n[k]; } }
  return lines;
}
async function examine(id) {
  return guard(async () => {
    const lines = examineLines(id);
    if (lines) await say(lines);
    S.flags['ex_' + id] = (S.flags['ex_' + id] || 0) + 1; dirty();
    anomalyFor(id);
  });
}
function anomalyFor(id) {
  const n = S.night;
  const map = { calendar: n >= 2 && 'calendar_same', drawing: n >= 2 && 'kai_shadow', guestbook: n >= 3 && 'guestbook_empty', photo: 'photo_scratched', window_off: n >= 3 && 'window_corridor', fridge: 'fridge_reflect', files: 'records_same', cabinet: 'records_same', sky: 'rooftop_nodawn' };
  if (map[id]) noteAnomaly(map[id]);
}

async function interact(hs) {
  switch (hs.act) {
    case 'go': return goRoom(hs.to, hs.at);
    case 'clock': return clockTap(hs);
    case 'bell': audio.sfx('beep'); addFlag('bell_rings'); return examine('bell');
    case 'npc': return talkNpc(hs.who);
    case 'curtain': return curtain();
    case 'door': return blackDoor();
    case 'stairs': if (S.night >= 3) { setFlag('records_seen', 1); return goRoom('records', 60); } return examine('stairs_down');
    case 'ladder': if (S.night >= 4) { setFlag('rooftop_seen', 1); return goRoom('rooftop', 80); } return examine('ladder');
    case 'shop': return guard(async () => { if (!S.flags.ex_vending) await say(examineLines('vending') || []); S.flags.ex_vending = 1; openPanel('shop'); });
    case 'arcade': return guard(async () => { if (!S.flags.ex_arcade) { await say(examineLines('arcade') || []); S.flags.ex_arcade = 1; } openPanel('arcade'); });
    case 'pc': return guard(async () => { if (!S.flags.ex_pc) { await say(examineLines('pc') || []); S.flags.ex_pc = 1; } openPanel('board'); });
    case 'tsubu': return guard(() => openTsubu());
    default: return examine(hs.id);
  }
}

// --- reception clock: three quick taps make it run backwards
let clockTimes = [], clockTimer = null;
function clockTap() {
  const now = performance.now(); clockTimes = clockTimes.filter(x => now - x < 1300); clockTimes.push(now);
  audio.sfx('tick'); clearTimeout(clockTimer);
  if (clockTimes.length >= 3) {
    clockTimes = []; fx.clockBack = 2.4; fx.shake = 2; addFlag('clock_taps'); audio.sfx('clock');
    audio.wrongness = Math.min(1, audio.wrongness + 0.2); setTimeout(() => setWrongness(), 2500);
    if (flag('clock_taps') === 1) setTimeout(() => guard(() => say(examineLines('clock') || [])), 2400);
    noteAnomaly('clock_back'); checkAch(); return;
  }
  clockTimer = setTimeout(() => { if (clockTimes.length === 1) examine('clock'); clockTimes = []; }, 650);
}
export function setWrongness() { audio.wrongness = Math.min(1, Math.max(0, (S.night - 2) * 0.12 + (S.flags.door_visits ? 0.1 : 0))); }

async function longPressDone(hs) {
  return guard(async () => {
    if (S.night >= 2 && !S.flags.has_blade && !hasItem('key_blade') && !hasItem('black_key')) {
      fx.shake = 3; audio.sfx('drop');
      await say([{ who: 'narr', t: { ja: '……箱の底で、何かが小さく鳴った。', en: '……something small clinked at the bottom of the box.', ru: '……на дне коробки что-то тихо звякнуло.' } }]);
      await giveItem('key_blade');
      await say([{ who: 'emrys', emo: 'wary', t: { ja: '……さっきまで、なかった。', en: '……that wasn\'t there a minute ago.', ru: '……минуту назад этого тут не было.' } }]);
    } else {
      await say([{ who: 'emrys', emo: 'ponder', t: { ja: '……待っても、もう何も出てこない。', en: '……waiting won\'t bring out anything else.', ru: '……сколько ни жди, больше ничего не появится.' } }]);
    }
  });
}

async function curtain() {
  const bed4 = pendingTasks().find(tk => tk.who === 'unknown');
  if (bed4) return guard(() => runTask(bed4));
  if (S.night >= 5 || S.flags.curtain_open) {
    return guard(async () => {
      if (!S.flags.curtain_open) { setFlag('curtain_open', 1); invalidateRoom(); audio.sfx('swish'); await wait(300); }
      await say(examineLines('nametag4') || []);
      setFlag('room4_seen', 1); noteAnomaly('room4_tag');
      if (!hasItem('nametag') && !S.seen.nametag) await giveItem('nametag');
    });
  }
  return examine('curtain4');
}

async function blackDoor() {
  if (!S.flags.door_noticed) {
    await examine('black_door');
    setFlag('door_noticed', 1); invalidateRoom(); fx.shake = 2; audio.sfx('creak');
    return;
  }
  if (!hasItem('black_key')) {
    return guard(async () => {
      await say(examineLines('black_door_locked') || [{ who: 'narr', t: { ja: t('door_noKey'), en: t('door_noKey'), ru: t('door_noKey') } }]);
      if (hasItem('key_bow') || hasItem('key_blade')) toast(t('door_noKey'), '', { badge: '鍵', mini: true });
    });
  }
  return guard(async () => { showClinic(false); await openDoor(); showClinic(true); });
}

// --- NPCs
async function talkNpc(who) {
  const task = taskFor(who, S.room);
  if (task) return guard(() => runTask(task));
  return guard(async () => {
    // Kai + candy
    if (who === 'kai' && hasItem('candy') && !S.flags.kai_candy_today) {
      const c = await choose([{ label: L({ ja: 'あめをあげる', en: 'Give a candy', ru: 'Дать леденец' }), value: 1 }, { label: L({ ja: '話す', en: 'Talk', ru: 'Поговорить' }), value: 0 }]);
      if (c) {
        takeItem('candy'); addFlag('kai_candy'); S.flags.kai_candy_today = 1;
        await say([{ who: 'kai', t: { ja: 'やった！ ……リンさんには内緒ね。先生も、一個食べる？', en: 'Yes! ……don\'t tell Rin. Want one too, doctor?', ru: 'Ура! ……только Рин не говорите. Доктор, хотите тоже?' } }, { who: 'emrys', emo: 'ponder', t: { ja: '……虫歯になるなよ。', en: '……don\'t get cavities.', ru: '……только без кариеса.' } }]);
        toast(t('giveKai')); return;
      }
    }
    const pool = STORY.idle[who]; if (!pool) return;
    let n = Math.min(S.night, Math.max(...Object.keys(pool).map(Number)));
    while (n > 0 && !pool[n]) n--;
    const convs = pool[n] || []; if (!convs.length) return;
    const key = `idle_${who}_${n}`; const i = (S.flags[key] || 0) % convs.length; S.flags[key] = (S.flags[key] || 0) + 1; dirty();
    await say(convs[i]);
    if (who === 'rin' && S.night >= 4) noteAnomaly('rin_dayshift');
  });
}

// ---------------------------------------------------------------- rooms
export async function goRoom(id, at = 240, { instant = false } = {}) {
  if (!ROOMS[id]) return;
  const doIt = () => { ripples.length=0;S.room = id; emrys.x = emrys.tx = at; emrys.moving = false; S.x = at; dirty(); renderLabels(); renderHud(); audio.play(ROOMS[id].music || 'clinic'); };
  if (instant) doIt(); else { audio.sfx('door'); await fade(doIt, { wipe: true }); }
  const banner = h('div', { class: 'room-name px' }, t('r_' + id)); document.getElementById('stage').append(banner); setTimeout(() => banner.remove(), 2300);
  S.flags['visit_' + id] = 1;
  checkAch();
}
export function placeEmrys(x) { emrys.x = emrys.tx = x ?? S.x ?? 200; }

// ---------------------------------------------------------------- labels/marks
let markEls = [];
export function renderLabels() {
  labels.innerHTML = ''; markEls = [];
  for (const hs of hotspots()) {
    if (hs.label && hs.act === 'go') {
      const el = h('div', { class: 'label show' }, (hs.to && ['records', 'rooftop'].includes(hs.to) && !S.flags[hs.to + '_seen']) ? '？' : t(hs.label));
      el.style.left = ((hs.x + hs.w / 2) / W * 100) + '%'; el.style.top = ((hs.y - 2) / H * 100) + '%'; labels.append(el);
    }
  }
  // task markers
  for (const task of pendingTasks()) {
    if (task.room !== S.room) continue;
    let hs = task.who === 'unknown' ? hotspots().find(x => x.id === 'curtain4') : hotspots().find(x => x.act === 'npc' && x.who === task.who);
    if (!hs) continue;
    const el = h('div', { class: 'mark' }, '!'); el.dataset.x = hs.x + hs.w / 2; el.dataset.y = hs.y - 4; labels.append(el); markEls.push(el);
  }
  // corridor hint toward rooms with tasks
  if (S.room === 'corridor') for (const task of pendingTasks()) {
    const d = ROOMS.corridor.doors.find(dd => dd.to === task.room); if (!d) continue;
    const el = h('div', { class: 'mark' }, '!'); el.dataset.x = (d.arrow ? 8 : d.x + 17); el.dataset.y = 112; labels.append(el); markEls.push(el);
  }
  // door hint after night 2 if not noticed
  positionMarks();
}
function positionMarks() { for (const el of markEls) { el.style.left = (el.dataset.x / W * 100) + '%'; el.style.top = (el.dataset.y / H * 100) + '%'; } }

// ---------------------------------------------------------------- HUD
export function renderHud() {
  if (!active) return;
  hud.innerHTML = '';
  const night = currentNight();
  const nightLabel = S.stage === 'free' ? t('freeNight') : t('night', { n: S.night });
  const done = Object.keys(S.tasks).filter(id => night?.tasks.some(tk => tk.id === id)).length;
  const mins = Math.min(93, done * 25 + (S.flags.clock_taps ? 3 : 0));
  const hh = 2 + Math.floor(mins / 60), mm = mins % 60;
  const clock = S.night >= 3 ? '03:33' : `0${hh}:${String(mm).padStart(2, '0')}`;
  const left = h('div', { class: 'hud-left' });
  left.append(h('div', { class: 'chip px dark' }, h('span', { class: 'redtext' }, '✚'), nightLabel, h('span', { class: 'clock-chip muted' }, clock)));
  // task card
  const card = h('div', { class: 'task-card px' });
  if (night && S.stage === 'night') {
    card.append(h('h4', {}, L(night.title)));
    const ul = h('ul');
    night.tasks.forEach(tk => ul.append(h('li', { class: S.tasks[tk.id] ? 'done' : '' }, L(tk.title) + (S.tasks[tk.id] ? '' : ' · ' + t('r_' + tk.room)))));
    card.append(ul);
    if (nightDone()) card.append(h('button', { class: 'btn primary sm', style: 'margin-top:.4em', onclick: () => guard(endNight) }, t('endShift')));
  } else {
    const dl = dailyList(); card.append(h('h4', {}, t('daily')));
    const ul = h('ul'); dl.forEach(d => ul.append(h('li', { class: S.daily.done[d.id] ? 'done' : '' }, L(d.title)))); card.append(ul);
    card.append(h('div', { class: 'muted', style: 'font-size:.85em' }, t('pcTitle') + ' → ' + t('r_office')));
  }
  card.onclick = () => card.classList.toggle('min');
  left.append(card);
  const right = h('div', { class: 'hud-right' });
  right.append(h('div', { class: 'chip px' }, iconCanvas('coin'), h('span', { class: 'num' }, String(S.coins))));
  const btn = (ico, key, fn) => { const b = h('button', { class: 'btn icon-btn', 'aria-label': t(key), title: t(key), onclick: () => { audio.sfx('click'); if (!busy && !inDialog()) fn(); } }, iconCanvas(ico)); b.dataset.hud = ico; return b; };
  right.append(btn('map', 'map', () => openPanel('map')), btn('bag', 'bag', () => openPanel('bag')), btn('chart', 'journal', () => openPanel('journal')));
  if (S.flags.tsubu_met) right.append(btn('bean', 'tsubu', () => guard(async () => { if (S.room !== 'lounge') await goRoom('lounge', 230); await openTsubu(); })));
  right.append(btn('gear', 'settings', () => openPanel('settings')));
  hud.append(left, right);
}
export function shakeScene(n = 3) { fx.shake = n; }
export const isBusy = () => busy;
export { guard };
