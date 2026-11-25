// Global game state, flags, condition evaluator, event bus.
export const SAVE_VERSION = 3;

export function freshState() {
  const now = Date.now();
  return {
    v: SAVE_VERSION, created: now, lastSeen: now,
    lang: 'ja',
    settings: { music: 0.6, sfx: 0.7, voice: 0.5, textSpeed: 2, anim: 'full', scanlines: true, shake: true, bigText: false, contrast: false, assist: false, noise: true },
    coins: 40,
    stage: 'prologue', night: 1, tasks: {}, // taskId -> best rank
    flags: {}, once: {},
    inv: { pudding: 1, onigiri: 1 }, seen: {},
    ach: {}, stats: { playtime: 0, taps: 0, steps: 0, mgPlays: 0, mgWins: 0, mgFails: 0, coinsEarned: 0, coinsSpent: 0, dialogs: 0, doorTime: 0, itemsUsed: 0, sessions: 0 },
    records: {}, // mgId -> { 1:best, 2:best, 3:best, rank:{1:'A'} }
    mg: { diagnosis: 1, disinfect: 1, sort: 1 }, // unlocked max difficulty
    tsubu: { hunger: 70, mood: 70, energy: 80, clean: 80, health: 100, bond: 0, bondXp: 0, asleep: false, sick: false, last: now,
      mem: { lastFood: null, foods: {}, neglect: 0, pets: 0, sickCount: 0, plays: 0, cleans: 0, wakes: 0 }, reactions: {}, hat: null, acc: null, room: null, tapLog: [] },
    anomalies: {}, room: 'reception', x: 200,
    daily: { date: '', list: [], done: {} },
    endings: {},
    log: [],
    decor: { lounge: null, frame: 'milk' },
  };
}

export let S = freshState();
export function setState(ns) { S = ns; bus.emit('state:replaced'); }

// ---- event bus
const handlers = {};
export const bus = {
  on(ev, fn) { (handlers[ev] ||= []).push(fn); return () => { handlers[ev] = handlers[ev].filter(f => f !== fn); }; },
  emit(ev, data) { (handlers[ev] || []).forEach(f => { try { f(data); } catch (e) { console.error(e); } }); },
};

export function dirty() { bus.emit('dirty'); }

// ---- flags
const computed = {
  night: () => S.night,
  coins: () => S.coins,
  anomalies: () => Object.keys(S.anomalies).length,
  tsubu_bond: () => S.tsubu.bond,
  tsubu_fed: () => S.flags.tsubu_fed || 0,
  tsubu_sick_neglect: () => S.tsubu.mem.sickCount,
  mg_plays: () => S.stats.mgPlays,
  mg_fails: () => S.stats.mgFails,
  mg_best_rank_s: () => Object.values(S.records).reduce((n, r) => n + Object.values(r.rank || {}).filter(x => x === 'S').length, 0),
  real_hour: () => new Date().getHours(),
  silence: () => (S.settings.music === 0 && S.settings.sfx === 0 && S.settings.voice === 0) ? 1 : 0,
  endings_seen: () => Object.keys(S.endings).length,
  has_stethoscope: () => (S.inv.stethoscope ? 1 : 0),
  has_flashlight: () => (S.inv.flashlight ? 1 : 0),
  has_pudding: () => (S.inv.pudding ? 1 : 0),
  oda_done: () => (S.night > 4 ? 1 : 0),
  sato_done: () => (S.night > 4 ? 1 : 0),
  kai_done: () => (S.night > 5 ? 1 : 0),
};
['dawn', 'shift', 'forget', 'tsubu', 'both'].forEach(e => { computed['ending_' + e] = () => (S.endings[e] ? 1 : 0); });

export function flag(name) {
  if (computed[name]) return computed[name]();
  return S.flags[name] || 0;
}
export function setFlag(name, v) { S.flags[name] = v; dirty(); }
export function addFlag(name, n = 1) { S.flags[name] = (S.flags[name] || 0) + n; dirty(); }

// condition: "a>=2 && !b || c"
export function cond(expr) {
  if (!expr || !expr.trim()) return true;
  return expr.split('||').some(part => part.split('&&').every(term => {
    term = term.trim(); if (!term) return true;
    const m = /^(!?)([a-zA-Z_][\w]*)\s*(>=|<=|==|!=|>|<)?\s*(-?\d+(?:\.\d+)?)?$/.exec(term);
    if (!m) { console.warn('bad cond', term); return false; }
    const v = flag(m[2]);
    if (!m[3]) return m[1] ? !v : !!v;
    const n = parseFloat(m[4]);
    switch (m[3]) { case '>=': return v >= n; case '<=': return v <= n; case '==': return v == n; case '!=': return v != n; case '>': return v > n; case '<': return v < n; }
    return false;
  }));
}

export function applyEffects(node) {
  if (node.set) for (const k in node.set) S.flags[k] = node.set[k];
  if (node.add) for (const k in node.add) S.flags[k] = (S.flags[k] || 0) + node.add[k];
  if (node.set || node.add) dirty();
}

export function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
