// Core gameplay services: economy, inventory, achievements, anomalies, toasts.
import { S, bus, dirty, cond, flag, addFlag } from '../core/state.js';
import { ITEMS } from '../data/items.js';
import { ACH } from '../data/achievements.js';
import { STORY } from '../data/story.js';
import { L, t } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import { h } from '../core/stage.js';
import { revealItem } from './itemget.js';

const toasts = document.getElementById('toasts');
export function toast(title, sub = '', { badge = '✚', mini = false } = {}) {
  const el = h('div', { class: 'toast px' + (mini ? ' mini' : '') }, h('div', { class: 'badge' }, badge), h('div', {}, sub ? h('small', {}, sub) : null, title));
  toasts.append(el); setTimeout(() => el.remove(), 4000);
  while (toasts.children.length > 4) toasts.firstChild.remove();
}

export function addCoins(n, silent = false) {
  if (!n) return;
  S.coins = Math.max(0, S.coins + n);
  if (n > 0) S.stats.coinsEarned += n; else S.stats.coinsSpent -= n;
  if (!silent && n > 0) { audio.sfx('coin'); toast(t('coinsGot', { n }), '', { badge: '灯', mini: true }); }
  bus.emit('coins'); dirty(); checkAch();
}

export async function giveItem(id, n = 1, { reveal = null } = {}) {
  const it = ITEMS[id]; if (!it) return;
  const first = !S.seen[id];
  S.inv[id] = (S.inv[id] || 0) + n; S.seen[id] = 1; dirty();
  bus.emit('inv');
  const doReveal = reveal ?? (first || it.rarity >= 3);
  if (doReveal) await revealItem(id, n);
  else toast(L(it.name) + (n > 1 ? ` ×${n}` : ''), t('gotItem'), { badge: '＋', mini: true });
  if (id === 'key_blade') S.flags.has_blade = 1;
  if (id === 'key_bow') S.flags.has_bow = 1;
  if (id === 'black_key') S.flags.has_key = 1;
  checkAch();
}
export function hasItem(id) { return (S.inv[id] || 0) > 0; }
export function takeItem(id, n = 1) {
  if (!hasItem(id)) return false; S.inv[id] -= n; if (S.inv[id] <= 0) delete S.inv[id]; S.stats.itemsUsed++; dirty(); bus.emit('inv'); return true;
}

export function unlockAch(id) {
  if (S.ach[id]) return; const a = ACH.find(x => x.id === id); if (!a) return;
  S.ach[id] = Date.now(); dirty();
  audio.sfx('ach');
  toast(L(a.name), t('achUnlocked'), { badge: '★' });
  if (a.coins) setTimeout(() => addCoins(a.coins), 600);
}
let achTimer = null;
export function checkAch() {
  clearTimeout(achTimer);
  achTimer = setTimeout(() => {
    for (const a of ACH) { if (!S.ach[a.id] && a.cond && cond(a.cond)) unlockAch(a.id); }
    const reacts = Object.keys(S.tsubu.reactions).length; S.flags.tsubu_reacts = reacts;
  }, 200);
}

export function noteAnomaly(id) {
  if (S.anomalies[id] || !STORY.anomalies[id]) return false;
  S.anomalies[id] = Date.now(); dirty();
  audio.sfx('rare');
  toast(L(STORY.anomalies[id].title), t('anomFound'), { badge: '？' });
  addCoins(8, true);
  bus.emit('anomaly', id); checkAch();
  return true;
}

// minigame reward from rank
export const RANK_COINS = { C: 4, B: 10, A: 18, S: 28 };
export { flag, addFlag };
