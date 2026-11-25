// Minigame runner: tutorial card, difficulty select & unlocks, countdown, HUD, pause, results, records, rewards.
import { S, dirty, todayKey } from '../core/state.js';
import { P } from '../core/palette.js';
import { W, H, hiCanvas, releaseCanvas, bindPointer, h, wait } from '../core/stage.js';
import { L, t } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import { addCoins, unlockAch, checkAch, RANK_COINS, toast } from './game.js';
import { iconCanvas } from './icons.js';

export const MG_LIST = ['diagnosis', 'disinfect', 'sort', 'monitor', 'lab', 'cpr', 'suture', 'delivery', 'memory', 'emergency', 'stethoscope'];
const mods = {};
export async function loadMg(id) { if (!mods[id]) mods[id] = (await import(`../minigames/${id}.js`)).default; return mods[id]; }
export const MG_TITLES = mods;
export function preloadMinigames() { return Promise.all(MG_LIST.map(id => loadMg(id).catch(e => console.error('mg load', id, e)))); }

const root = document.getElementById('mg');
const RANKS = ['C', 'B', 'A', 'S'];
function rankOf(mod, d, score, success) {
  const r = typeof mod.ranks === 'function' ? mod.ranks(d) : mod.ranks;
  if (!success) return 'C';
  if (score >= r[2]) return 'S'; if (score >= r[1]) return 'A'; if (score >= r[0]) return 'B'; return 'C';
}
export function unlockMg(id) { if (!S.mg[id]) { S.mg[id] = 1; dirty(); return true; } return false; }
export function maxDiff(id) { return S.mg[id] || 0; }

// opts: { story: bool, difficulty, special, title }
export async function runMinigame(id, opts = {}) {
  const mod = await loadMg(id);
  unlockMg(id);
  root.dataset.activity=id;
  root.classList.remove('hidden'); root.innerHTML = '';
  audio.play('game');
  let diff = opts.difficulty || Math.min(maxDiff(id), opts.prefer || maxDiff(id));
  let result;
  while (true) {
    const choice = await introCard(mod, diff, opts);
    if (choice == null) { result = { cancel: true, success: false, rank: 'C', score: 0 }; break; }
    diff = choice;
    result = await play(mod, diff, opts);
    if (result.quit) { if (opts.story) { result = { cancel: true, success: false, rank: 'C', score: 0 }; break; } continue; }
    const again = await results(mod, diff, result, opts);
    if (!again) break;
  }
  root.classList.add('hidden'); root.innerHTML = '';
  delete root.dataset.activity;
  return result;
}

function controlLabel(c) { return t('c_' + c); }

function introCard(mod, diff, opts) {
  return new Promise(res => {
    root.innerHTML = '';
    const rec = S.records[mod.id] || {};
    const seg = h('div', { class: 'seg' });
    const lockNote = h('div', { class: 'muted', style: 'font-size:.8em;min-height:1.2em' });
    const sel = { d: diff };
    const fixed = !!opts.special;
    const draw = () => {
      seg.innerHTML = '';
      [1, 2, 3].forEach(d => {
        const locked = d > maxDiff(mod.id) && !(opts.story && d === opts.difficulty);
        const b = h('button', { type: 'button', class: (sel.d === d ? 'on' : '') + (locked ? ' off' : '') }, (locked ? '× ' : '') + t('d' + d));
        b.onclick = () => { if (fixed) return; if (locked) { lockNote.textContent = d === 2 ? t('d_locked2') : t('d_locked'); audio.sfx('bad'); return; } sel.d = d; audio.sfx('click'); lockNote.textContent = ''; draw(); };
        seg.append(b);
      });
    };
    draw();
    const how = h('div', { class: 'how' }); (mod.how || []).forEach((s, i) => how.append(h('b', {}, String(i + 1)), h('span', {}, L(s))));
    const bests = h('div', { class: 'muted', style: 'font-size:.85em' }, `${t('mg_best')}: ${[1, 2, 3].map(d => (rec[d] ?? '—') + (rec.rank?.[d] ? ` (${rec.rank[d]})` : '')).join(' / ')}`);
    const card = h('div', { class: 'mg-card px' },
      h('h2', {}, iconCanvas(mod.control || 'tap'), L(mod.title), h('span', { class: 'tag red' }, controlLabel(mod.control || 'tap'))),
      h('div', {}, L(mod.desc)),
      h('div', { class: 'redtext', style: 'font-size:.9em' }, t('mg_how')), how,
      fixed ? null : h('div', { class: 'field' }, h('span', {}, t('mg_diff')), seg), fixed ? null : lockNote, bests,
      S.flags.coffee_buff ? h('div', { class: 'redtext', style: 'font-size:.85em' }, '+10% '+t('time')) : null,
      h('div', { class: 'acts' },
        h('button', { class: 'btn', onclick: () => { audio.sfx('click'); res(null); } }, t('back')),
        h('button', { class: 'btn primary', onclick: () => { audio.sfx('good'); res(sel.d); } }, t('mg_start'))));
    const badge=String(MG_LIST.indexOf(mod.id)+1).padStart(2,'0');
    card.prepend(h('div',{class:'mg-file-code','aria-hidden':'true'},h('i'),'YK / '+badge));
    root.append(h('div', { class: 'mg-over mg-file' }, card));
  });
}

function play(mod, difficulty, opts) {
  return new Promise(async res => {
    root.innerHTML = '';
    const cv = h('canvas', { width: W, height: H }); root.append(cv);
    const g = hiCanvas(cv);
    const hud = h('div', { class: 'mg-hud' });
    const tt = h('span', { class: 'tt' }, L(mod.title)); const sc = h('span', { class: 'num' }); const tm = h('span', { class: 'num' }); const lv = h('span', { class: 'redtext' });
    const bar = h('div', { class: 'bar' }, h('i')); const lab = h('span', { class: 'muted' });
    const pauseB = h('button', { class: 'btn dark sm icon-btn', 'aria-label': t('mg_pause') }, iconCanvas('pause', P.milk2));
    hud.append(tt, sc, tm, lv, lab, h('span', { class: 'sp' }), bar, pauseB); root.append(hud);
    const buff = !!S.flags.coffee_buff; if (buff) { S.flags.coffee_buff = 0; dirty(); }
    let shakeAmt = 0;
    const ctx = {
      W, H, g, difficulty, lang: S.lang, L, special: opts.special || null,
      sfx: n => audio.sfx(n), vibrate: ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (_) { } },
      shake: a => { if (S.settings.shake && S.settings.anim !== 'reduced') shakeAmt = Math.max(shakeAmt, a); },
      reduced: S.settings.anim === 'reduced', assist: !!S.settings.assist, time: 0,
    };
    let inst;
    try { inst = mod.create(ctx); } catch (e) { console.error(e); res({ quit: true }); return; }
    let paused = true, ended = false, last = performance.now(), raf = 0;
    const unbind = bindPointer(cv, { down: (x, y, id) => !paused && inst.down?.(x, y, id), move: (x, y, id) => !paused && inst.move?.(x, y, id), up: (x, y, id) => !paused && inst.up?.(x, y, id) });
    const onKey = e => { if (!paused) inst.key?.(e.code); if (e.code === 'Escape') doPause(); };
    window.addEventListener('keydown', onKey);
    const cleanup = () => { cancelAnimationFrame(raf); unbind(); window.removeEventListener('keydown', onKey); try { inst.destroy?.(); } catch (_) { } releaseCanvas(cv); };
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      let dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!paused && !ended) { if (buff) dt *= 0.9; ctx.time += dt; try { inst.update(dt); } catch (e) { console.error(e); } }
      g.save();
      if (shakeAmt > 0) { g.translate((Math.random() - .5) * shakeAmt * 2, (Math.random() - .5) * shakeAmt * 2); shakeAmt *= 0.85; if (shakeAmt < 0.2) shakeAmt = 0; }
      try { inst.draw(); } catch (e) { console.error(e); }
      g.restore();
      const s = inst.state() || {};
      sc.textContent = `${t('mg_score')} ${Math.round(s.score || 0)}`;
      tm.textContent = s.time != null ? `${t('time')} ${Math.max(0, Math.ceil(s.time))}` : '';
      lv.textContent = s.lives != null ? '♥'.repeat(Math.max(0, s.lives)) : '';
      lab.textContent = s.label || '';
      bar.style.display = s.progress != null ? '' : 'none'; bar.firstChild.style.width = ((s.progress || 0) * 100) + '%';
      if (s.done && !ended) { ended = true; setTimeout(() => { cleanup(); res({ score: Math.round(s.score || 0), success: !!s.success }); }, 700); audio.sfx(s.success ? 'win' : 'lose'); }
    };
    raf = requestAnimationFrame(frame);
    const doPause = () => {
      if (paused || ended) return; paused = true; audio.sfx('click');
      const ov = h('div', { class: 'mg-over' }, h('div', { class: 'mg-card px' }, h('h2', {}, t('mg_pause')),
        h('div', { class: 'acts' },
          h('button', { class: 'btn', onclick: () => { cleanup(); res({ quit: true }); } }, t('mg_quit')),
          h('button', { class: 'btn primary', onclick: () => { ov.remove(); paused = false; last = performance.now(); } }, t('mg_resume')))));
      root.append(ov);
    };
    pauseB.onclick = doPause;
    // countdown
    const cd = h('div', { class: 'countdown' }); root.append(cd);
    for (const n of ['3', '2', '1']) { cd.innerHTML = ''; cd.append(h('span', {}, n)); audio.sfx('beep'); await wait(S.settings.anim === 'reduced' ? 300 : 650); }
    cd.remove(); paused = false; last = performance.now();
    S.stats.mgPlays++; dirty();
  });
}

function results(mod, d, r, opts) {
  return new Promise(res => {
    const rank = rankOf(mod, d, r.score, r.success); r.rank = rank;
    const rec = S.records[mod.id] ||= { rank: {} }; rec.rank ||= {};
    const isNew = r.success && (rec[d] == null || r.score > rec[d]);
    const firstClear = r.success && rec.rank[d] == null;
    if (r.success) { if (isNew) rec[d] = r.score; if (!rec.rank[d] || RANKS.indexOf(rank) > RANKS.indexOf(rec.rank[d])) rec.rank[d] = rank; S.stats.mgWins++; }
    else { S.stats.mgFails++; if (rec[d] == null) rec[d] = rec[d] ?? null; }
    // unlocks
    let unlockMsg = '';
    if (r.success && d === 1 && RANKS.indexOf(rank) >= 1 && maxDiff(mod.id) < 2) { S.mg[mod.id] = 2; unlockMsg = t('d2') + ' ✓'; }
    if (r.success && d === 2 && RANKS.indexOf(rank) >= 2 && maxDiff(mod.id) < 3) { S.mg[mod.id] = 3; unlockMsg = t('modeUnlocked'); }
    // rewards: rank based, harder = more, repeats of the same game on the same day give less
    const dayKey = 'mgday_' + mod.id + '_' + todayKey(); const reps = S.flags[dayKey] || 0; S.flags[dayKey] = reps + 1;
    for (const k of Object.keys(S.flags)) if (k.startsWith('mgday_') && !k.endsWith(todayKey())) delete S.flags[k];
    const damp = Math.max(0.25, 1 - reps * 0.2);
    let coins = Math.round((RANK_COINS[rank] || 0) * [1, 1, 1.4, 1.9][d] * damp);
    if (!r.success) coins = 2;
    const bonus = firstClear ? 15 * d : 0;
    if (opts.special) coins = 0;
    dirty();
    if (r.success && rank === 'S' && d === 3) unlockAch('hard_s');
    if (MG_LIST.every(id => S.records[id] && Object.values(S.records[id].rank || {}).length)) unlockAch('all_mg');
    const card = h('div', { class: 'mg-card px', style: 'text-align:center' },
      h('h2', { style: 'justify-content:center' }, L(mod.title), h('span', { class: 'tag ' + (r.success ? 'red' : '') }, r.success ? t('mg_clear') : t('mg_fail'))),
      opts.special ? h('div', { class: 'rank', style: 'font-size:2em' }, '……') : h('div', { class: 'rank' }, rank),
      h('div', {}, `${t('mg_score')} ${r.score}` + (rec[d] != null ? ` · ${t('mg_best')} ${rec[d]}` : '')),
      isNew && !opts.special ? h('div', { class: 'redtext' }, t('mg_new')) : null,
      coins + bonus > 0 ? h('div', {}, `${t('mg_reward')}: +${coins} ${t('coins')}` + (bonus ? ` · ${t('firstClear')} +${bonus}` : '')) : null,
      unlockMsg ? h('div', { class: 'redtext' }, unlockMsg) : null,
      h('div', { class: 'acts', style: 'justify-content:center' },
        !opts.story ? h('button', { class: 'btn', onclick: () => { audio.sfx('click'); res(true); } }, t('mg_retry')) : null,
        opts.story && !r.success ? h('button', { class: 'btn', onclick: () => { audio.sfx('click'); res(true); } }, t('mg_retry')) : null,
        h('button', { class: 'btn primary', onclick: () => { audio.sfx('click'); res(false); } }, t('mg_continue'))));
    root.append(h('div', { class: 'mg-over' }, card));
    audio.sfx(r.success ? 'good' : 'bad');
    setTimeout(() => { if (coins + bonus > 0) addCoins(coins + bonus); checkAch(); }, 500);
  });
}
