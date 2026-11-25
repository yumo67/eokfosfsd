// Visual-novel dialogue: typewriter text, speed-up/skip/auto, history log, choices, emotion sprites, NPC standing sprites & portraits.
import { S, dirty, flag } from '../core/state.js';
import { L, t, fmt } from '../core/i18n.js';
import { NAMES } from '../data/story.js';
import { audio } from '../core/audio.js';
import { h } from '../core/stage.js';
import { P } from '../core/palette.js';

const root = document.getElementById('dialog');
export const EMO = ['normal', 'think', 'annoyed', 'crossed', 'wary', 'ponder'];
export const NPCS = ['rin', 'oda', 'kai', 'sato', 'tsubu', 'unknown'];
const imgs = {};
export function preloadSprites() {
  const list = EMO.map(e => `assets/emrys_${e}.webp`)
    .concat(['assets/emrys_portrait.webp', 'assets/emrys_splash.webp'])
    .concat(NPCS.flatMap(n => [`assets/${n}_normal.webp`, `assets/${n}_portrait.webp`]));
  return Promise.all(list.map(src => new Promise(res => {
    const i = new Image();
    i.onload = i.onerror = () => res();
    i.src = src;
    imgs[src] = i;
  })));
}
let voiceName = null;
export function setVoiceName(fn) { voiceName = fn; }
let active = false; export const inDialog = () => active;
let mode = { skip: false, auto: false };

function nameOf(who) {
  if (who === 'voice') return voiceName ? voiceName() : '???';
  if (who === 'narr') return '';
  if (who === 'memo') return L({ ja: 'カルテの切れ端', en: 'Torn chart page', ru: 'Обрывок карты' });
  return NAMES[who] ? L(NAMES[who]) : who;
}

function portraitFor(who) {
  if (who === 'emrys') return h('div', { class: 'vn-portrait px dark' }, h('img', { src: 'assets/emrys_portrait.webp', alt: '' }));
  if (NPCS.includes(who)) return h('div', { class: 'vn-portrait px dark' }, h('img', { class: 'npc-port', src: `assets/${who}_portrait.webp`, alt: '' }));
  if (who === 'narr') return null;
  if (who === 'memo') {
    const cv = h('canvas', { width: 40, height: 40 }); const g = cv.getContext('2d');
    g.fillStyle = P.ash; g.fillRect(0, 0, 40, 40);
    g.fillStyle = P.ink; g.fillRect(8, 5, 25, 31);
    g.fillStyle = P.milk3; g.fillRect(9, 6, 23, 29);
    g.fillStyle = P.ash; for (let i = 0; i < 23; i += 4) g.fillRect(9 + i, 33 - (i % 8 ? 1 : 0), 2, 2 + (i % 8 ? 1 : 0)); // torn edge
    g.fillStyle = P.red; g.fillRect(11, 8, 19, 2);
    g.fillStyle = P.ink3; for (let r = 0; r < 6; r++) g.fillRect(11, 13 + r * 3, 12 + ((r * 5) % 7), 1);
    g.fillStyle = P.red2; g.fillRect(24, 27, 6, 1); g.fillRect(25, 28, 4, 1);
    return h('div', { class: 'vn-portrait px dark' }, cv);
  }
  if (who === 'voice') {
    const cv = h('canvas', { width: 48, height: 48 }); const g = cv.getContext('2d');
    g.fillStyle = P.ink; g.fillRect(0, 0, 48, 48);
    g.fillStyle = P.red3; g.fillRect(30, 20, 2, 1); g.fillRect(17, 20, 2, 1);
    return h('div', { class: 'vn-portrait px dark' }, cv);
  }
  return null;
}

function speedMs() { return [40, 26, 14, 6, 0][S.settings.textSpeed] ?? 26; }

// Present lines. opts: { dark, sprite (bool), vars, onLine(line) }
export async function say(lines, opts = {}) {
  if (!lines || !lines.length) return;
  open(opts);
  for (const line of lines) {
    if (line.req && !opts.ignoreReq) { /* conditional lines from data */ }
    await showLine(line, opts);
  }
  close();
}
export function open(opts = {}) {
  active = true; root.classList.remove('hidden'); root.classList.toggle('dark-mode', !!opts.dark);
  if (!root.firstChild) build();
  ui.sprite.classList.toggle('hidden', opts.sprite === false);
  ui.npcSprite.classList.toggle('hidden', opts.sprite === false);
  ui.root.dataset.sprite = opts.sprite === false ? '0' : '1';
}
export function close() {
  active = false;
  root.classList.add('hidden');
  root.innerHTML = '';
  ui = {};
  lastWho = null;
  lastNpc = null;
  mode.skip = false;
}

let ui = {};
function build() {
  root.innerHTML = '';
  const dim = h('div', { class: 'dim' });
  const npcSprite = h('img', { class: 'vn-sprite vn-npc-stand hidden', alt: '' });
  const sprite = h('img', { class: 'vn-sprite hidden', alt: '', src: 'assets/emrys_normal.webp' });
  const name = h('div', { class: 'vn-name' });
  const text = h('div', { class: 'vn-text' });
  const next = h('div', { class: 'vn-next hidden' });
  const bSkip = h('button', { type: 'button' }, t('skip'));
  const bAuto = h('button', { type: 'button' }, t('auto'));
  const bLog = h('button', { type: 'button' }, t('log'));
  const ctrl = h('div', { class: 'vn-ctrl' }, bLog, bAuto, bSkip);
  const main = h('div', { class: 'vn-main px' }, name, text, next, ctrl);
  const portrait = h('div', { class: 'vn-pwrap' });
  const box = h('div', { class: 'vn-box' }, portrait, main);
  const choices = h('div', { class: 'vn-choices hidden' });
  root.append(dim, npcSprite, sprite, box, choices);
  ui = { root, npcSprite, sprite, name, text, next, main, portrait, box, choices, bSkip, bAuto };
  bSkip.onclick = e => { e.stopPropagation(); mode.skip = !mode.skip; bSkip.classList.toggle('on', mode.skip); ui.advance?.(); };
  bAuto.onclick = e => { e.stopPropagation(); mode.auto = !mode.auto; bAuto.classList.toggle('on', mode.auto); ui.advance?.(); };
  bLog.onclick = e => { e.stopPropagation(); showLog(); };
  bSkip.classList.toggle('on', mode.skip); bAuto.classList.toggle('on', mode.auto);
  box.addEventListener('pointerdown', e => { if (e.target.closest('.vn-ctrl')) return; ui.tap?.(); });
  dim.addEventListener('pointerdown', () => ui.tap?.());
}

let lastWho = null;
let lastNpc = null;
function showLine(line, opts) {
  return new Promise(res => {
    if (!ui.text) build();
    const who = line.who || 'narr';
    const raw = fmt(L(line.t), Object.assign(varsBase(), opts.vars || {}));
    // log
    S.log.push({ w: who, x: raw }); if (S.log.length > 150) S.log.splice(0, S.log.length - 150);
    S.stats.dialogs++;
    ui.name.textContent = nameOf(who);
    ui.name.classList.toggle('hidden', !ui.name.textContent);
    ui.name.classList.toggle('red', who === 'voice' || who === 'tsubu');
    ui.text.classList.toggle('voice', who === 'voice'); ui.text.classList.toggle('memo', who === 'memo');
    if (who !== lastWho || !ui.portrait.firstChild) { ui.portrait.innerHTML = ''; const p = portraitFor(who); if (p) ui.portrait.append(p); lastWho = who; }
    // standing sprites (Emrys on right, NPC on left)
    if (ui.root.dataset.sprite !== '0') {
      if (who === 'emrys') {
        const emo = EMO.includes(line.emo) ? line.emo : 'normal';
        const src = `assets/emrys_${emo}.webp`;
        const wasHidden = ui.sprite.classList.contains('hidden');
        if (!ui.sprite.src.endsWith(src)) { ui.sprite.src = src; ui.sprite.classList.remove('bounce'); void ui.sprite.offsetWidth; if (!wasHidden) ui.sprite.classList.add('bounce'); }
        ui.sprite.classList.remove('hidden', 'dim2');
        if (wasHidden) { ui.sprite.classList.remove('enter'); void ui.sprite.offsetWidth; ui.sprite.classList.add('enter'); }
        if (!ui.npcSprite.classList.contains('hidden')) ui.npcSprite.classList.add('dim2');
      } else if (NPCS.includes(who)) {
        const src = `assets/${who}_normal.webp`;
        const wasHidden = ui.npcSprite.classList.contains('hidden');
        const changedNpc = lastNpc !== who;
        ui.npcSprite.dataset.who = who;
        if (!ui.npcSprite.src.endsWith(src)) {
          ui.npcSprite.src = src;
          ui.npcSprite.classList.remove('bounce');
          void ui.npcSprite.offsetWidth;
          if (!wasHidden && !changedNpc) ui.npcSprite.classList.add('bounce');
        }
        ui.npcSprite.classList.remove('hidden', 'dim2');
        if (wasHidden || changedNpc) { ui.npcSprite.classList.remove('enter'); void ui.npcSprite.offsetWidth; ui.npcSprite.classList.add('enter'); }
        lastNpc = who;
        if (!ui.sprite.classList.contains('hidden')) ui.sprite.classList.add('dim2');
      } else {
        if (!ui.sprite.classList.contains('hidden')) ui.sprite.classList.add('dim2');
        if (!ui.npcSprite.classList.contains('hidden')) ui.npcSprite.classList.add('dim2');
      }
    }
    opts.onLine?.(line);
    // typewriter
    const chars = [...raw]; let i = 0; let done = false; let timer = null;
    ui.text.textContent = ''; ui.next.classList.add('hidden');
    const ms = mode.skip ? 0 : speedMs();
    const finish = () => { done = true; clearTimeout(timer); ui.text.textContent = raw; ui.next.classList.remove('hidden'); scheduleAuto(); };
    const step = () => {
      if (done) return;
      const n = ms === 0 ? chars.length : 1;
      for (let k = 0; k < n && i < chars.length; k++) { ui.text.textContent += chars[i]; if (i % 2 === 0 && !/[\s…。、.,!?！？]/.test(chars[i])) audio.blip(who); i++; }
      if (i >= chars.length) return finish();
      const c = chars[i - 1]; const pause = /[。！？.!?]/.test(c) ? ms * 6 : /[、,…]/.test(c) ? ms * 3 : ms;
      timer = setTimeout(step, pause);
    };
    let autoT = null;
    const scheduleAuto = () => { clearTimeout(autoT); if (mode.skip) autoT = setTimeout(go, 90); else if (mode.auto) autoT = setTimeout(go, 900 + chars.length * 45); };
    const go = () => { clearTimeout(autoT); clearTimeout(timer); ui.tap = null; ui.advance = null; audio.sfx('tick'); res(); };
    ui.tap = () => { if (!done) finish(); else go(); };
    ui.advance = () => { if (done) scheduleAuto(); else if (mode.skip) finish(); };
    step();
  });
}

function varsBase() {
  const d = new Date();
  return { visits: flag('door_visits'), clock_taps: flag('clock_taps'), hour: d.getHours(), minute: String(d.getMinutes()).padStart(2, '0'), fails: flag('mg_fails'), coins: S.coins, anomalies: flag('anomalies') };
}

// choices: [{label, value, cls}] -> value
export function choose(choices, opts = {}) {
  return new Promise(res => {
    if (!ui.choices) { open(opts); }
    ui.next.classList.add('hidden');
    mode.skip = false; ui.bSkip?.classList.remove('on');
    ui.choices.innerHTML = ''; ui.choices.classList.remove('hidden');
    choices.forEach((c, i) => {
      const b = h('button', { class: 'btn ' + (c.cls || ''), type: 'button', style: `animation-delay:${i * 50}ms` }, c.label);
      b.onclick = e => { e.stopPropagation(); audio.sfx('click'); ui.choices.classList.add('hidden'); ui.choices.innerHTML = ''; S.log.push({ w: 'choice', x: '▶ ' + c.label }); dirty(); res(c.value); };
      ui.choices.append(b);
    });
  });
}

function showLog() {
  const host = document.getElementById('ui');
  const body = h('div', { class: 'panel-body rows logpanel' }, ...S.log.slice(-80).map(e => h('div', { class: 'row' }, h('div', { class: 'who' }, e.w === 'choice' ? '' : nameOf(e.w)), h('div', { class: 't' }, e.x))));
  const veil = h('div', { class: 'veil' }, h('div', { class: 'panel px' }, h('div', { class: 'panel-head' }, h('h2', {}, t('log')), h('button', { class: 'btn sm', onclick: () => veil.remove() }, t('close'))), body));
  host.append(veil); setTimeout(() => body.scrollTop = body.scrollHeight, 30);
}

// Show lines without closing the box afterwards (used by the door conversation engine).
export async function speak(lines, opts = {}) {
  if (!active || !ui.text) open(opts);
  for (const line of lines) await showLine(line, opts);
}
