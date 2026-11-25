// 夜光カルテ — Yakō Karte. Developer: y_yumo67. Entry point.
import { S, bus, dirty, flag } from './core/state.js';
import { fit, wait } from './core/stage.js';
import { t } from './core/i18n.js';
import { audio } from './core/audio.js';
import { loadGame, saveInfo, saveNow } from './core/save.js';
import { preloadSprites } from './systems/dialogue.js';
import { preloadMinigames } from './systems/mg.js';
import { initClinic, showClinic, goRoom, placeEmrys, renderHud, renderLabels, setWrongness, invalidateRoom } from './systems/clinic.js';
import { applySettings, warmMods, closePanel, panelOpen, setLang } from './systems/panels.js';
import { tickTsubu } from './systems/tamagotchi.js';
import { startPrologue, nightIntro, dailyList, runEpilogue, grantDoorMemo } from './systems/flow.js';
import { showBoot, bootProgress, bootReady, showTitle } from './systems/title.js';
import { toast, unlockAch, checkAch } from './systems/game.js';

window.addEventListener('error', e => console.error('[game]', e.message));
window.addEventListener('unhandledrejection', e => console.error('[game] promise', e.reason));
document.querySelectorAll('[data-rot-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.rotLang)));

if (location.search.includes('debug')) Object.defineProperty(window, '__S', { get: () => S });
async function main() {
  fit();
  showBoot();
  let p = 0; const step = n => { p += n; bootProgress(Math.min(1, p)); };
  const tasks = [
    loadGame().then(ok => { step(0.25); return ok; }),
    preloadSprites().then(() => step(0.25)),
    preloadMinigames().then(() => step(0.2)),
    (document.fonts ? Promise.all(['16px "DotGothic16"', '500 16px "Pixelify Sans"', '700 16px "Pixelify Sans"'].map(f => document.fonts.load(f).catch(() => { }))) : Promise.resolve()).then(() => step(0.15)),
    wait(900).then(() => step(0.15)),
  ];
  await Promise.all(tasks);
  bootProgress(1);
  applySettings(); fit();
  S.stats.sessions++; dirty();
  tickTsubu(); dailyList(); setWrongness();
  initClinic(); warmMods();
  await bootReady();
  if (saveInfo.restored) toast(t('restored'), '', { badge: '⟲' });
  if (!saveInfo.online) toast(t('saveOffline'), '', { badge: '!' });
  showTitle({ onPlay });
  timers();
}

async function onPlay() {
  invalidateRoom();
  placeEmrys(S.x);
  await goRoom(S.room || 'reception', S.x || 200, { instant: true });
  showClinic(true);
  if (!S.flags.prologue_done) await startPrologue();
  else if (S.stage === 'night') await nightIntro();
  else if (S.stage === 'epilogue') await runEpilogue();
  else if (S.stage === 'free') await grantDoorMemo();
  renderHud(); renderLabels(); checkAch();
}

// ---------------------------------------------------------------- save indicator
const chip = document.getElementById('savechip');
let chipT = null;
bus.on('save:start', () => { clearTimeout(chipT); chip.className = 'px'; chip.innerHTML = '<i></i>' + t('saving'); });
bus.on('save:end', ({ ok }) => { chip.className = 'px ok'; chip.innerHTML = '<i></i>' + (ok ? t('saved') : t('saveOffline')); chipT = setTimeout(() => chip.classList.add('hidden'), ok ? 1200 : 3000); });
bus.on('lang', () => { renderHud(); renderLabels(); });
bus.on('save:resume', () => {
  closePanel();
  showClinic(false);
  applySettings();
  tickTsubu(); dailyList(); setWrongness();
  fit(); invalidateRoom();
  showTitle({ onPlay });
});

function timers() {
  let n = 0;
  setInterval(() => {
    if (document.hidden) return;
    S.stats.playtime++; n++;
    if (n % 20 === 0) { dirty(); tickTsubu(); }
    const d = new Date();
    if (d.getHours() === 3 && d.getMinutes() === 33 && !S.ach.real333) unlockAch('real333');
  }, 1000);
}

window.addEventListener('keydown', e => { if (e.code === 'Escape' && panelOpen()) closePanel(); });

main().catch(e => { console.error(e); });
