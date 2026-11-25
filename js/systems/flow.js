// Story flow: prologue, nights & tasks, night transitions, epilogue, daily requests.
import { S, dirty, setFlag, addFlag, todayKey } from '../core/state.js';
import { h, fade, wait } from '../core/stage.js';
import { L, t } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import { STORY } from '../data/story.js';
import { ITEMS, DOOR_MEMO } from '../data/items.js';
import { say } from './dialogue.js';
import { giveItem, addCoins, toast, noteAnomaly, checkAch } from './game.js';
import { runMinigame, unlockMg } from './mg.js';
import { goRoom, renderHud, renderLabels, invalidateRoom, setWrongness, showClinic } from './clinic.js';

export const currentNight = () => (S.stage === 'night' ? STORY.nights[S.night - 1] : null);
export function pendingTasks() { const n = currentNight(); return n ? n.tasks.filter(tk => !S.tasks[tk.id]) : []; }
export function taskFor(who, room) { return pendingTasks().find(tk => tk.who === who && tk.room === room) || null; }
export function nightDone() { const n = currentNight(); return !!n && n.tasks.every(tk => S.tasks[tk.id]); }

const DEFAULT_FAIL = [{ who: 'emrys', emo: 'annoyed', t: { ja: '……もう一度。手順を思い出せ。', en: '……again. Remember the steps.', ru: '……ещё раз. Вспомни порядок.' } }];
const TASK_REWARD = { n1_oda: 'onigiri', n2_kai: 'candy', n3_kai: 'kai_drawing', n3_oda: 'acc_scarf', n4_sato: 'sato_watch', n2_sato: 'coffee', n3_rin: 'pudding', n4_calls: 'flashlight' };

export async function runTask(task) {
  await say(task.pre || []);
  const diff = S.night <= 2 ? 1 : 2;
  while (true) {
    const r = await runMinigame(task.minigame, { story: true, difficulty: diff, special: task.special || (task.id === 'n5_bed4' ? 'bed4' : null) });
    if (r.cancel) return false;
    if (r.success) {
      S.tasks[task.id] = r.rank; dirty();
      await say(task.success || []);
      const it = TASK_REWARD[task.id]; if (it) await giveItem(it);
      if (task.id === 'n4_sato') noteAnomaly('sato_watch');
      addCoins(10 + S.night * 4);
      renderHud(); renderLabels(); checkAch();
      return true;
    }
    await say(task.fail || DEFAULT_FAIL);
    return false;
  }
}

export async function startPrologue() {
  S.stage = 'prologue'; S.room = 'reception'; S.x = 120; dirty();
  showClinic(true);
  await wait(600);
  await say(STORY.prologue);
  await giveItem('stethoscope');
  setFlag('prologue_done', 1);
  S.stage = 'night'; S.night = 1; dirty();
  STORY.nights[0].tasks.forEach(tk => unlockMg(tk.minigame));
  toast(t('tutorial_move'), '', { badge: '✚' });
  await nightIntro();
}
export async function nightIntro() {
  const n = currentNight(); if (!n || S.flags['intro_' + n.id]) return;
  setFlag('intro_' + n.id, 1);
  n.tasks.forEach(tk => unlockMg(tk.minigame));
  await titleCard(L(n.title));
  await say(n.intro || []);
  renderHud(); renderLabels(); checkAch();
}
function titleCard(text, sub = '') {
  return new Promise(res => {
    const el = h('div', { class: 'ending shift-card', style: 'animation:fadeIn .6s' },
      h('div',{class:'shift-serial'},h('i'),'YAKŌ KARTE / '+String(S.night).padStart(2,'0')),
      h('h1', {}, text), sub ? h('div', { class: 'shift-sub' }, sub) : null);
    document.getElementById('stage').append(el);
    audio.sfx('beat');
    setTimeout(() => { el.style.transition = 'opacity .6s'; el.style.opacity = '0'; setTimeout(() => { el.remove(); res(); }, 600); }, 2000);
  });
}

export async function endNight() {
  const n = currentNight(); if (!n) return;
  await say(n.outro || []);
  await titleCard(t('shiftOver'), L(n.title));
  await fade(async () => {
    S.night++; S.tasks = {};
    S.flags.kai_candy_today = 0;
    if (S.night > STORY.nights.length) { S.stage = 'epilogue'; }
    S.room = 'reception'; S.x = 140; dirty();
    invalidateRoom(); setWrongness();
    await goRoom('reception', 140, { instant: true });
  }, { hold: 300 });
  if (S.stage === 'epilogue') await runEpilogue();
  else await nightIntro();
  renderHud(); renderLabels(); checkAch();
}

export async function runEpilogue() {
  await say(STORY.epilogue || []);
  S.stage = 'free'; S.night = 6; dirty();
  await titleCard(t('freeNight'));
  await grantDoorMemo();
  renderHud(); renderLabels(); checkAch();
}
// After the story ends, Emrys finds a page addressed to himself: the black-door walkthrough.
export async function grantDoorMemo() {
  if (S.seen.door_memo) return;
  await say([
    { who: 'narr', t: { ja: '受付のカウンターに、さっきまでなかった紙切れが一枚。', en: 'On the reception counter lies a scrap of paper that wasn\'t there a moment ago.', ru: 'На стойке регистратуры лежит клочок бумаги. Минуту назад его не было.' } },
    { who: 'emrys', emo: 'wary', t: { ja: '……俺の字だ。書いた覚えはない。', en: '……that\'s my handwriting. I don\'t remember writing it.', ru: '……это мой почерк. Не помню, чтобы я это писал.' } },
  ]);
  await giveItem('door_memo', 1, { reveal: true });
  await say(DOOR_MEMO);
  toast(L(ITEMS.door_memo.name), t('memoFound'), { badge: '紙', mini: true });
}

// --- daily requests (3 per real day, seeded)
export function dailyList() {
  const key = todayKey();
  if (S.daily.date !== key) {
    let seed = [...key].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const pool = STORY.daily.slice(); const list = [];
    while (list.length < 3 && pool.length) list.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0].id);
    S.daily = { date: key, list, done: {} }; dirty();
  }
  return S.daily.list.map(id => STORY.daily.find(d => d.id === id)).filter(Boolean);
}
export async function startDaily(d) {
  if (S.daily.done[d.id]) return;
  await say(d.pre || []);
  const r = await runMinigame(d.minigame, { story: false, prefer: 2 });
  if (r.success && !r.cancel) {
    S.daily.done[d.id] = 1; addFlag('daily_total'); dirty();
    await say(d.success || []);
    addCoins(25);
    if (Object.keys(S.daily.done).length === 3) { toast(t('allDone')); addCoins(30); }
  }
  renderHud(); checkAch();
}
