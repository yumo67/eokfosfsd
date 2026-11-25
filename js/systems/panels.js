// Menu panels: bag (inventory), vending shop, chart (journal), settings, map, night board, arcade.
import { S, bus, dirty, flag, setFlag, addFlag, cond } from '../core/state.js';
import { setFontLang } from '../core/draw.js';
import { P } from '../core/palette.js';
import { h, wait } from '../core/stage.js';
import { L, t } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import { ITEMS, SHOP_LIST, SHOP_REQ, DOOR_MEMO } from '../data/items.js';
import { ACH } from '../data/achievements.js';
import { STORY } from '../data/story.js';
import { DOOR } from '../data/door.js';
import { icon, drawModel } from './mesh3d.js';
import { toast, giveItem, hasItem, takeItem, addCoins, unlockAch, noteAnomaly, checkAch } from './game.js';
import { revealItem } from './itemget.js';
import { say } from './dialogue.js';
import { MG_LIST, loadMg, runMinigame, maxDiff } from './mg.js';
import { saveInfo, exportCode, importCode, restoreBackup, wipeSave, saveNow } from '../core/save.js';
import { iconCanvas } from './icons.js';

const host = document.getElementById('ui');
let current = null;
export const panelOpen = () => !!current;
export function closePanel() { if (current) { current.cleanup?.(); current.el.remove(); current = null; bus.emit('panel:closed'); } }

function shell(title, body, { tabs = null, onClose, extraHead = null } = {}) {
  const veil = h('div', { class: 'veil' });
  const panel = h('div', { class: 'panel px' },
    h('div', { class: 'panel-head' }, h('h2', {}, title), h('div', { style: 'display:flex;gap:.6em;align-items:center' }, extraHead, h('button', { class: 'btn sm', onclick: () => { audio.sfx('click'); closePanel(); onClose?.(); } }, t('close')))),
    tabs, body);
  veil.append(panel);
  veil.addEventListener('pointerdown', e => { if (e.target === veil) { closePanel(); onClose?.(); } });
  return veil;
}
function tabsBar(list, cur, fn) {
  const bar = h('div', { class: 'tabs' });
  list.forEach(([k, label]) => bar.append(h('button', { class: 'tab' + (k === cur ? ' on' : ''), type: 'button', onclick: () => { audio.sfx('click'); fn(k); } }, label)));
  return bar;
}

export function openPanel(name, arg) {
  closePanel();
  audio.sfx('pop');
  const fn = { bag, shop, journal, settings, map, board, arcade }[name];
  if (!fn) return;
  current = fn(arg) || null;
  if (current) host.append(current.el);
}

// ------------------------------------------------------------- BAG
const CATS = ['all', 'care', 'toy', 'decor', 'tool', 'story', 'collect'];
let bagCat = 'all', bagSel = null;
function bag() {
  const body = h('div', { class: 'panel-body' });
  let spinRaf = 0;
  const el = shell(t('bag'), body, { tabs: h('div') });
  const tabsHost = el.querySelector('.tabs') || el.querySelector('.panel > div:nth-child(2)');
  const render = () => {
    cancelAnimationFrame(spinRaf);
    const tb = tabsBar(CATS.map(c => [c, t('cat_' + c)]), bagCat, c => { bagCat = c; render(); });
    el.querySelector('.panel').children[1].replaceWith(tb);
    body.innerHTML = '';
    const ids = Object.keys(S.inv).filter(id => ITEMS[id] && S.inv[id] > 0 && (bagCat === 'all' || ITEMS[id].cat === bagCat));
    ids.sort((a, b) => ITEMS[b].rarity - ITEMS[a].rarity);
    if (!ids.includes(bagSel)) bagSel = ids[0] || null;
    const grid = h('div', { class: 'grid' });
    ids.forEach(id => {
      const it = ITEMS[id];
      const sl = h('button', { class: 'slot' + (id === bagSel ? ' on' : ''), type: 'button', onclick: () => { audio.sfx('tick'); bagSel = id; render(); } },
        icon(it.mesh, 48, 32), h('span', { class: 'rar r' + it.rarity }), S.inv[id] > 1 ? h('span', { class: 'cnt' }, '×' + S.inv[id]) : null,
        (S.tsubu.hat === id || S.tsubu.acc === id || (it.ui && S.decor.frame === it.ui)) ? h('span', { class: 'cnt redtext' }, '●') : null);
      grid.append(sl);
    });
    if (!ids.length) grid.append(h('div', { class: 'muted' }, t('emptyBag')));
    const detail = h('div', { class: 'detail' });
    if (bagSel) {
      const it = ITEMS[bagSel];
      const view = h('div', { class: 'view' }); const cv = h('canvas', { width: 96, height: 96 }); view.append(cv);
      let a = 0.6; const spin = () => { a += 0.025; drawModel(cv, it.mesh, a, 48, 0.35, 0.9); spinRaf = requestAnimationFrame(spin); }; spin();
      const acts = h('div', { class: 'acts' });
      actionsFor(bagSel).forEach(([label, fn, cls]) => acts.append(h('button', { class: 'btn sm ' + (cls || ''), onclick: async () => { audio.sfx('click'); await fn(); render(); } }, label)));
      detail.append(view, h('div', {}, h('span', { class: 'tag ' + (it.rarity >= 3 ? 'red' : '') }, t('rar' + it.rarity)), ' ', h('span', { class: 'muted', style: 'font-size:.8em' }, t('cat_' + it.cat) + ` · ${t('owned')} ${S.inv[bagSel]}`)),
        h('h3', {}, L(it.name)), h('p', {}, L(it.desc)), acts);
    }
    body.append(h('div', { class: 'inv' }, grid, detail));
  };
  render();
  const off = bus.on('inv', () => current?.el === el && render());
  return { el, cleanup: () => { cancelAnimationFrame(spinRaf); off(); } };
}

function actionsFor(id) {
  const it = ITEMS[id]; const out = [];
  out.push([t('inspect'), () => revealItem(id)]);
  if (it.combine) out.push([t('combine'), () => combine(id), 'primary']);
  if (id === 'door_memo') out.push([t('readMemo'), async () => { closePanel(); await say(DOOR_MEMO); }, 'primary']);
  if (it.slot) {
    const on = S.tsubu[it.slot] === id;
    out.push([on ? t('unequip') : t('equip'), () => { S.tsubu[it.slot] = on ? null : id; dirty(); toast(L(it.name), on ? t('unequip') : t('equip'), { badge: '✿', mini: true }); if (S.tsubu.hat && S.tsubu.acc) unlockAch('tsubu_fashion'); bus.emit('tsubu:dress'); }]);
  }
  if (it.ui) { const on = S.decor.frame === it.ui; out.push([on ? t('unequip') : t('equip'), () => { S.decor.frame = on ? 'milk' : it.ui; dirty(); applyTheme(); }]); }
  if (it.cat === 'care' || it.cat === 'toy') out.push([t('use'), async () => { closePanel(); const tg = await import('./tamagotchi.js'); await tg.openTsubu(id); }]);
  if (id === 'coffee') out.push([t('use'), () => { takeItem('coffee'); S.flags.coffee_buff = 1; dirty(); audio.sfx('eat'); toast(t('coffeeUse')); }]);
  if (id === 'flashlight') out.push([t('use'), async () => { closePanel(); audio.sfx('click'); await say([{ who: 'narr', t: { ja: t('flashUse'), en: t('flashUse'), ru: t('flashUse') } }, flashLine()]); addFlag('flash_uses'); }]);
  if (id === 'stethoscope') out.push([t('use'), async () => { closePanel(); if (S.room === 'lounge') { const tg = await import('./tamagotchi.js'); await tg.openTsubu('stethoscope'); } else await say([stethLine()]); }]);
  if (id === 'cassette') out.push([t('use'), async () => { closePanel(); for (let i = 0; i < 6; i++) { audio.sfx('tick'); await wait(500); } await say([{ who: 'emrys', emo: 'ponder', t: { ja: '……受付の時計の音だけ。三時三十三分で、テープが切れてる。', en: '……just the reception clock. The tape ends at 3:33.', ru: '……только часы регистратуры. Запись обрывается на 3:33.' } }]); }]);
  if (id === 'black_candle') out.push([t('use'), async () => { closePanel(); const f = document.getElementById('fade'); f.style.transition = 'opacity 1.5s'; f.classList.add('on'); audio.sfx('creak'); await wait(2200); f.classList.remove('on'); await wait(800); f.style.transition = ''; setFlag('candle_lit', 1); await say([{ who: 'emrys', emo: 'wary', t: { ja: '……今、扉の方から、ありがとうって聞こえた気がする。', en: '……for a second I thought the door said thank you.', ru: '……на миг показалось, что дверь сказала «спасибо».' } }]); }]);
  if (id === 'nothing') out.push([t('use'), async () => { closePanel(); await say([{ who: 'emrys', emo: 'think', t: { ja: '……使った。何も起きない。正しい。', en: '……used it. Nothing happens. Correct.', ru: '……использовал. Ничего не происходит. Всё верно.' } }]); }]);
  return out;
}
function flashLine() {
  const r = S.room;
  if (r === 'corridor' && S.flags.door_noticed) return { who: 'emrys', emo: 'wary', t: { ja: '扉の表面は、光を返さない。……吸い込んでる。', en: 'The door doesn\'t reflect the light. ……it drinks it.', ru: 'Дверь не отражает свет. ……она его пьёт.' } };
  if (r === 'storage' || r === 'records') return { who: 'emrys', emo: 'think', t: { ja: '箱の影が、光より少し遅れて動いた。', en: 'The shadows of the boxes moved a little after the light did.', ru: 'Тени коробок сдвинулись чуть позже света.' } };
  return { who: 'emrys', emo: 'annoyed', t: { ja: '……明るい。前から明るい。', en: '……bright. It was already bright.', ru: '……светло. И так было светло.' } };
}
function stethLine() {
  return { who: 'emrys', emo: 'ponder', t: { ja: '自分の胸に当ててみた。……ちゃんと鳴ってる。たぶん。', en: 'I tried it on my own chest. ……it\'s beating. Probably.', ru: 'Приложил к своей груди. ……бьётся. Наверное.' } };
}
async function combine(id) {
  const it = ITEMS[id]; const other = it.combine.with;
  if (!hasItem(other)) { toast(t('combineFail'), t('combineWith'), { badge: '？', mini: true }); audio.sfx('bad'); return; }
  closePanel();
  takeItem(id); takeItem(other); audio.sfx('unlock');
  toast(t('keyCombine'), '', { badge: '鍵' });
  await giveItem(it.combine.into, 1, { reveal: true });
  await say([{ who: 'emrys', emo: 'wary', t: { ja: '……鍵だ。廊下の、あの壁の。', en: '……a key. For that wall in the corridor.', ru: '……ключ. От той стены в коридоре.' } }]);
}
export function applyTheme() {
  document.body.classList.remove('theme-red', 'theme-ink');
  if (S.decor.frame === 'red') document.body.classList.add('theme-red');
  if (S.decor.frame === 'ink') document.body.classList.add('theme-ink');
}

// ------------------------------------------------------------- SHOP
function shop() {
  const body = h('div', { class: 'panel-body' });
  const coinsEl = h('div', { class: 'chip px' }, iconCanvas('coin'), h('span', { class: 'num' }));
  const el = shell(t('shop'), body, { extraHead: coinsEl });
  const render = () => {
    coinsEl.lastChild.textContent = S.coins;
    body.innerHTML = '';
    body.append(h('div', { class: 'muted', style: 'margin-bottom:.6em' }, t('shopHello')));
    const grid = h('div', { class: 'shop' });
    for (const id of SHOP_LIST) {
      const it = ITEMS[id]; if (!it || it.price == null) continue;
      if (SHOP_REQ[id] && !cond(SHOP_REQ[id])) continue;
      const unique = !!(it.slot || it.ui || it.reusable || it.cat === 'collect');
      const sold = unique && (S.inv[id] > 0 || (S.seen[id] && it.cat === 'collect' && id !== 'nothing'));
      const can = S.coins >= it.price && !sold;
      const b = h('button', { class: 'ware' + (it.secret ? ' secret' : '') + (can ? '' : ' cant'), type: 'button' },
        icon(it.mesh, 44, 32), h('div', {}, h('div', { class: 'wn' }, L(it.name)), h('div', { class: 'wp' }, sold ? t('soldOut') : `${it.price} ${t('coins')}`)));
      b.onclick = async () => {
        if (sold) { audio.sfx('bad'); return; }
        if (S.coins < it.price) { audio.sfx('bad'); toast(t('notEnough'), '', { badge: '灯', mini: true }); return; }
        addCoins(-it.price); addFlag('shop_buys'); audio.sfx('drop'); toast(t('bought'), L(it.name), { badge: '⊡', mini: true });
        await giveItem(id);
        if (id === 'nothing') { unlockAch('nothing'); noteAnomaly('vending_nothing'); }
        checkAch(); render();
      };
      grid.append(b);
    }
    body.append(grid);
  };
  render();
  return { el };
}

// ------------------------------------------------------------- JOURNAL
let jTab = 'anom';
function journal() {
  const body = h('div', { class: 'panel-body' });
  const el = shell(t('journal'), body, { tabs: h('div') });
  const render = () => {
    el.querySelector('.panel').children[1].replaceWith(tabsBar([['anom', t('j_anom')], ['ach', t('j_ach')], ['stats', t('j_stats')], ['rec', t('j_rec')], ['end', t('j_end')]], jTab, k => { jTab = k; render(); }));
    body.innerHTML = '';
    const rows = h('div', { class: 'rows' });
    if (jTab === 'anom') {
      const ids = Object.keys(STORY.anomalies);
      rows.append(h('div', { class: 'muted' }, `${Object.keys(S.anomalies).length} / ${ids.length}`));
      ids.forEach(id => { const a = STORY.anomalies[id]; const got = !!S.anomalies[id];
        rows.append(h('div', { class: 'row' + (got ? ' got' : ' locked') }, h('div', { class: 'badge' }, got ? '？' : '・'), h('div', { class: 't' }, h('b', {}, got ? L(a.title) : '？？？'), h('small', {}, got ? L(a.desc) : t('j_unknown'))))); });
    } else if (jTab === 'ach') {
      rows.append(h('div', { class: 'muted' }, `${Object.keys(S.ach).length} / ${ACH.length}`));
      ACH.forEach(a => { const got = !!S.ach[a.id]; const hidden = (a.type === 'hidden' || a.type === 'door') && !got;
        rows.append(h('div', { class: 'row' + (got ? ' got' : ' locked') }, h('div', { class: 'badge' }, got ? '★' : '☆'), h('div', { class: 't' }, h('b', {}, hidden ? '？？？' : L(a.name)), h('small', {}, hidden ? t('j_hiddenAch') : L(a.desc))), a.coins ? h('span', { class: 'muted', style: 'font-size:.8em' }, '+' + a.coins) : null)); });
    } else if (jTab === 'stats') {
      const s = S.stats; const hm = x => `${Math.floor(x / 3600)}h ${Math.floor(x / 60) % 60}m`;
      [[t('st_playtime'), hm(s.playtime)], [t('st_sessions'), s.sessions], [t('st_taps'), s.taps], [t('st_steps'), s.steps], [t('st_mg'), s.mgPlays], [t('st_wins'), s.mgWins], [t('st_fails'), s.mgFails], [t('st_earned'), s.coinsEarned], [t('st_spent'), s.coinsSpent], [t('st_visits'), flag('door_visits')], [t('st_door'), hm(s.doorTime)], [t('st_bond'), S.tsubu.bond + ' / 10'], [t('j_anom'), Object.keys(S.anomalies).length], [t('j_ach'), Object.keys(S.ach).length]]
        .forEach(([k, v]) => rows.append(h('div', { class: 'row' }, h('div', { class: 't' }, k), h('div', { class: 'num' }, String(v)))));
    } else if (jTab === 'rec') {
      MG_LIST.forEach(id => { const r = S.records[id] || {}; const m = mods(id);
        rows.append(h('div', { class: 'row' + (maxDiff(id) ? '' : ' locked') }, h('div', { class: 'badge' }, iconCanvas(m?.control || 'tap')), h('div', { class: 't' }, h('b', {}, maxDiff(id) ? L(m?.title) : '？？？'), h('small', {}, [1, 2, 3].map(d => `${t('d' + d)} ${r[d] ?? '—'}${r.rank?.[d] ? ' ' + r.rank[d] : ''}`).join(' · '))))); });
    } else {
      Object.keys(DOOR.endings).forEach(k => { const got = !!S.endings[k];
        rows.append(h('div', { class: 'row' + (got ? ' got' : ' locked') }, h('div', { class: 'badge' }, got ? '◐' : '・'), h('div', { class: 't' }, h('b', {}, got ? L(DOOR.endings[k].title) : t('j_endLocked')), got ? h('button', { class: 'btn sm', onclick: async () => { closePanel(); const d = await import('./doorway.js'); await d.showEnding(k, true); } }, t('inspect')) : null))); });
    }
    body.append(rows);
  };
  render();
  return { el };
}
const modCache = {};
function mods(id) { if (!modCache[id]) loadMg(id).then(m => { modCache[id] = m; if (current && jTab === 'rec') { /* refresh lazily */ } }).catch(() => { }); return modCache[id]; }
export async function warmMods() { for (const id of MG_LIST) { try { modCache[id] = await loadMg(id); } catch (_) { } } }

// ------------------------------------------------------------- SETTINGS
export function applySettings() {
  const s = S.settings;
  audio.setVol({ music: s.music, sfx: s.sfx, voice: s.voice });
  document.getElementById('scan').classList.toggle('off', !s.scanlines);
  document.body.classList.toggle('big', !!s.bigText);
  document.body.classList.toggle('contrast', !!s.contrast);
  document.body.classList.toggle('reduced', s.anim === 'reduced');
  document.documentElement.lang = S.lang; setFontLang(S.lang);
  applyTheme();
}
function slider(val, onChange) {
  const el = h('div', { class: 'slider', role: 'slider' }); const tr = h('div', { class: 'tr' }), fi = h('div', { class: 'fi' }), kn = h('div', { class: 'kn' });
  el.append(tr, fi, kn);
  const set = v => { v = Math.round(Math.max(0, Math.min(1, v)) * 10) / 10; fi.style.width = v * 100 + '%'; kn.style.left = v * 100 + '%'; el.setAttribute('aria-valuenow', v); return v; };
  set(val);
  let drag = false;
  const pick = e => { const r = el.getBoundingClientRect(); const v = set((e.clientX - r.left) / r.width); onChange(v); };
  el.addEventListener('pointerdown', e => { drag = true; try { el.setPointerCapture(e.pointerId); } catch (_) { } pick(e); });
  el.addEventListener('pointermove', e => drag && pick(e));
  el.addEventListener('pointerup', () => { drag = false; audio.sfx('tick'); });
  el.addEventListener('pointercancel', () => drag = false);
  return el;
}
function seg(options, cur, fn) {
  const el = h('div', { class: 'seg' });
  options.forEach(([v, label]) => el.append(h('button', { type: 'button', class: v === cur ? 'on' : '', onclick: () => { audio.sfx('click'); fn(v); } }, label)));
  return el;
}
function settings() {
  const body = h('div', { class: 'panel-body' });
  const el = shell(t('settings'), body);
  const s = S.settings;
  const render = () => {
    body.innerHTML = '';
    const grid = h('div', { class: 'set' });
    const field = (label, ctl) => grid.append(h('div', { class: 'field' }, h('span', {}, label), ctl));
    const toggle = (key) => seg([[true, t('on')], [false, t('off')]], !!s[key], v => { s[key] = v; dirty(); applySettings(); render(); });
    grid.append(h('h3', {}, t('s_lang')));
    field('言語 · Language · Язык', seg([['ja', '日本語'], ['en', 'English'], ['ru', 'Русский']], S.lang, v => setLang(v)));
    grid.append(h('h3', {}, t('s_music') + ' / ' + t('s_sfx')));
    const secret = h('div', { class: 'secretline' });
    const checkSilence = () => {
      secret.innerHTML = '';
      if (s.music === 0 && s.sfx === 0 && s.voice === 0) {
        secret.append(h('div', {}, t('s_secret1')), h('button', { class: 'btn sm dark', style: 'margin-top:.4em', onclick: async () => {
          secret.innerHTML = ''; const line = h('div', {}); secret.append(line);
          const txt = t('s_knock'); for (const ch of txt) { line.textContent += ch; await wait(ch === '。' || ch === '.' ? 420 : 60); }
          await wait(700); secret.append(h('div', { class: 'muted', style: 'margin-top:.3em' }, t('s_knock2')));
          if (!S.flags.heard_knock) { setFlag('heard_knock', 1); checkAch(); }
        } }, t('s_listen')));
      }
    };
    field(t('s_music'), slider(s.music, v => { s.music = v; dirty(); applySettings(); checkSilence(); }));
    field(t('s_sfx'), slider(s.sfx, v => { s.sfx = v; dirty(); applySettings(); checkSilence(); }));
    field(t('s_voice'), slider(s.voice, v => { s.voice = v; dirty(); applySettings(); checkSilence(); }));
    grid.append(secret); checkSilence();
    grid.append(h('h3', {}, t('s_text') + ' / ' + t('s_anim')));
    field(t('s_text'), seg([[0, '1'], [1, '2'], [2, '3'], [3, '4'], [4, '∞']], s.textSpeed, v => { s.textSpeed = v; dirty(); render(); }));
    field(t('s_anim'), seg([['full', t('s_animFull')], ['reduced', t('s_animReduced')]], s.anim, v => { s.anim = v; dirty(); applySettings(); render(); }));
    grid.append(h('h3', {}, t('s_screen')));
    field(t('s_scan'), toggle('scanlines')); field(t('s_noise'), toggle('noise')); field(t('s_shake'), toggle('shake'));
    grid.append(h('h3', {}, t('s_access')));
    field(t('s_big'), toggle('bigText')); field(t('s_contrast'), toggle('contrast')); field(t('s_assist'), toggle('assist'));
    grid.append(h('h3', {}, t('s_data')));
    grid.append(h('div', { class: 'field', style: 'grid-column:1/-1' }, h('span', { class: saveInfo.online ? '' : 'redtext' }, saveInfo.online ? t('s_online') : t('s_offline'))));
    const ta = h('textarea', { class: 'code', spellcheck: 'false', placeholder: 'code…' });
    const msg = h('span', { class: 'muted' });
    grid.append(h('div', { style: 'grid-column:1/-1;display:flex;flex-direction:column;gap:.4em' }, ta,
      h('div', { style: 'display:flex;gap:.5em;flex-wrap:wrap;align-items:center' },
        h('button', { class: 'btn sm', onclick: () => { ta.value = exportCode(); try { ta.select(); navigator.clipboard?.writeText(ta.value).catch(() => { }); } catch (_) { } msg.textContent = '✓'; } }, t('s_export')),
        h('button', { class: 'btn sm', onclick: () => { const ok = importCode(ta.value.trim()); msg.textContent = ok ? t('s_importOk') : t('s_importBad'); if (ok) setTimeout(() => bus.emit('save:resume'), 450); } }, t('s_import')),
        h('button', { class: 'btn sm', onclick: async () => { const ok = await restoreBackup(); msg.textContent = ok ? t('s_backupOk') : t('s_backupNo'); if (ok) setTimeout(() => bus.emit('save:resume'), 450); } }, t('s_backup')),
        msg)));
    // reset: two-step with hold
    const resetBox = h('div', { style: 'grid-column:1/-1;display:flex;gap:.6em;align-items:center;flex-wrap:wrap;margin-top:.4em' });
    const resetBtn = h('button', { class: 'btn sm', onclick: () => {
      resetBox.innerHTML = '';
      const hold = h('button', { class: 'btn sm primary', style: 'position:relative;overflow:hidden' }, h('i', { style: 'position:absolute;left:0;top:0;bottom:0;width:0;background:var(--ink);opacity:.35' }), t('s_erase'));
      let timer = null, t0 = 0, raf = 0;
      const bar = hold.firstChild;
      const stop = () => { clearTimeout(timer); cancelAnimationFrame(raf); bar.style.width = '0'; };
      hold.addEventListener('pointerdown', () => { t0 = performance.now(); const step = () => { bar.style.width = Math.min(100, (performance.now() - t0) / 20) + '%'; raf = requestAnimationFrame(step); }; step(); timer = setTimeout(async () => { stop(); await wipeSave(); bus.emit('save:resume'); }, 2000); });
      hold.addEventListener('pointerup', stop); hold.addEventListener('pointerleave', stop); hold.addEventListener('pointercancel', stop);
      resetBox.append(h('span', { class: 'redtext' }, t('s_resetQ')), h('span', { class: 'muted' }, t('s_resetQ2')), hold, h('button', { class: 'btn sm', onclick: () => render() }, t('no')));
    } }, t('s_reset'));
    resetBox.append(resetBtn);
    grid.append(resetBox);
    grid.append(h('div', { class: 'muted', style: 'grid-column:1/-1;font-size:.8em;margin-top:.6em' }, `${t('title')} · ${t('dev')} · v${S.v}`));
    body.append(grid);
  };
  render();
  return { el };
}
export function setLang(v) {
  if (S.lang === v) return;
  S.lang = v; addFlag('lang_changes'); dirty(); applySettings();
  bus.emit('lang'); checkAch();
  if (current) { const name = current.name; }
}

// ------------------------------------------------------------- MAP
const MAP_POS = { reception: [12, 50], corridor: [36, 50], office: [36, 18], ward: [58, 18], pharmacy: [58, 82], lounge: [80, 82], storage: [80, 18], records: [92, 42], rooftop: [92, 64] };
function map() {
  const body = h('div', { class: 'panel-body' });
  const el = shell(t('map'), body);
  const gridEl = h('div', { class: 'mapgrid' });
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('class', 'maplines'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none');
  const link = (a, b) => { const l = document.createElementNS(svgNS, 'line'); const [x1, y1] = MAP_POS[a], [x2, y2] = MAP_POS[b]; Object.entries({ x1, y1, x2, y2, stroke: P.gray, 'stroke-width': 0.6, 'stroke-dasharray': '1.5 1' }).forEach(([k, v]) => l.setAttribute(k, v)); svg.append(l); };
  ['office', 'ward', 'pharmacy', 'lounge', 'storage', 'reception'].forEach(r => link('corridor', r));
  if (S.flags.records_seen) link('storage', 'records'); if (S.flags.rooftop_seen) link('storage', 'rooftop');
  gridEl.append(svg);
  const pend = new Set();
  import('./flow.js').then(f => { f.pendingTasks().forEach(tk => pend.add(tk.room)); draw(); });
  const draw = () => {
    gridEl.querySelectorAll('.mapnode').forEach(n => n.remove());
    Object.entries(MAP_POS).forEach(([id, [x, y]]) => {
      const locked = (id === 'records' && !S.flags.records_seen) || (id === 'rooftop' && !S.flags.rooftop_seen);
      if (locked) return;
      const b = h('button', { class: 'btn sm mapnode' + (S.room === id ? ' here' : ''), style: `left:${x}%;top:${y}%` }, (pend.has(id) ? '! ' : '') + t('r_' + id));
      b.onclick = async () => { closePanel(); if (S.room !== id) { const c = await import('./clinic.js'); await c.goRoom(id, id === 'corridor' ? 240 : 200); } };
      gridEl.append(b);
    });
    if (S.flags.door_noticed) { const b = h('button', { class: 'btn sm dark mapnode', style: 'left:50%;top:50%' }, t('r_door')); b.onclick = async () => { closePanel(); const c = await import('./clinic.js'); if (S.room !== 'corridor') await c.goRoom('corridor', 420); else c.walkTo(420); }; gridEl.append(b); }
  };
  draw();
  body.append(gridEl);
  return { el };
}

// ------------------------------------------------------------- NIGHT BOARD (PC in the office)
function board() {
  const body = h('div', { class: 'panel-body' });
  const el = shell(t('pcTitle'), body);
  import('./flow.js').then(f => {
    const rows = h('div', { class: 'rows' });
    const n = f.currentNight();
    if (n) {
      rows.append(h('div', { class: 'redtext' }, L(n.title)));
      n.tasks.forEach(tk => rows.append(h('div', { class: 'row' + (S.tasks[tk.id] ? ' got' : '') }, h('div', { class: 'badge' }, S.tasks[tk.id] || '!'), h('div', { class: 't' }, h('b', {}, L(tk.title)), h('small', {}, t('r_' + tk.room))))));
    }
    if (S.flags.prologue_done && (S.night >= 2 || S.stage === 'free')) {
      rows.append(h('div', { class: 'redtext', style: 'margin-top:.6em' }, t('daily')));
      f.dailyList().forEach(d => {
        const done = !!S.daily.done[d.id];
        rows.append(h('div', { class: 'row' + (done ? ' got' : '') }, h('div', { class: 'badge' }, done ? '■' : '□'), h('div', { class: 't' }, h('b', {}, L(d.title)), h('small', {}, L(STORY_NAME(d.who)))),
          done ? null : h('button', { class: 'btn sm primary', onclick: async () => { closePanel(); await f.startDaily(d); } }, t('mg_start'))));
      });
    } else rows.append(h('div', { class: 'muted', style: 'margin-top:.6em' }, t('daily') + ': ' + t('locked')));
    const hintN = Math.min(S.night, 6);
    rows.append(h('div', { class: 'muted', style: 'margin-top:.8em;font-size:.85em' }, L(STORY.loading[(hintN * 7 + Object.keys(S.anomalies).length) % STORY.loading.length])));
    body.append(rows);
  });
  return { el };
}
import { NAMES } from '../data/story.js';
const STORY_NAME = who => NAMES[who] || who;

// ------------------------------------------------------------- ARCADE
function arcade() {
  const body = h('div', { class: 'panel-body' });
  const el = shell(t('arcadeTitle'), body);
  (async () => {
    body.append(h('div', { class: 'muted', style: 'margin-bottom:.6em' }, t('arcadeInsert')));
    const grid = h('div', { class: 'shop' });
    for (const id of MG_LIST) {
      let m; try { m = await loadMg(id); } catch (_) { continue; }
      const un = maxDiff(id) > 0; const r = S.records[id] || {};
      const best = Math.max(...[1, 2, 3].map(d => r[d] || 0));
      const ranks = [1, 2, 3].map(d => r.rank?.[d] || '·').join(' ');
      const b = h('button', { class: 'ware' + (un ? '' : ' cant'), type: 'button' }, h('div', { style: 'width:2.8em;height:2.8em;display:grid;place-items:center;background:var(--ink2)' }, iconCanvas(m.control, P.milk2, P.rose)),
        h('div', {}, h('div', { class: 'wn' }, un ? L(m.title) : '？？？'), h('div', { class: 'wp' }, un ? `${t('mg_best')} ${best || '—'} · ${ranks}` : t('mg_lockHint'))));
      b.onclick = async () => { if (!un) { audio.sfx('bad'); return; } closePanel(); await runMinigame(id, {}); const c = await import('./clinic.js'); audio.play('clinic'); c.renderHud(); };
      grid.append(b);
    }
    body.append(grid);
  })();
  return { el };
}
