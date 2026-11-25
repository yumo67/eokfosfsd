// Boot/loading screen and the title screen.
import { S, bus, dirty } from '../core/state.js';
import { P } from '../core/palette.js';
import { W, H, hiCanvas, releaseCanvas, h, wait, fade } from '../core/stage.js';
import { L, t } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import { STORY } from '../data/story.js';
import { openPanel, setLang, panelOpen } from './panels.js';
import { runMinigame, MG_LIST, maxDiff, loadMg } from './mg.js';
import { iconCanvas } from './icons.js';
import { wipeSave } from '../core/save.js';
import { skyline } from '../core/scenery.js';

// animated background shared by boot & title
function bg(cv, mode) {
  const g = hiCanvas(cv); let raf = 0, T = 0, last = performance.now(); let alive = true;
  const art=document.createElement('canvas');art.width=W;art.height=H;
  const a=art.getContext('2d'); skyline(a,0,{wide:true});
  const reduced=S.settings.anim==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loop = now => {
    if (!alive) return; raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
    g.drawImage(art,0,0);
    for(let i=0;i<32;i++){
      const x=4+(i*73+(reduced?0:Math.floor(T*(3+i%3))))%474,y=8+(i*17)%228;
      g.fillStyle=i%6===0?P.rose2:P.ash2;g.fillRect(x,y,i%6===0?3:1,1);
      if(i%6===0)g.fillRect(x+1,y-1,1,3);
    }
  };
  raf = requestAnimationFrame(loop);
  return () => { alive = false; cancelAnimationFrame(raf); releaseCanvas(cv); };
}

// ---------------------------------------------------------------- boot
const boot = document.getElementById('boot');
let bootStop = null, bar = null, tip = null;
export function showBoot() {
  boot.innerHTML = ''; boot.classList.remove('hidden');
  const cv = h('canvas', { class: 'bg', width: W, height: H }); boot.append(cv); bootStop = bg(cv, 'boot');
  bar = h('div', { class: 'boot-bar' }, h('i')); tip = h('div', { class: 'boot-tip' });
  const heart=h('div',{class:'night-seal','aria-hidden':'true'},h('i'));
  boot.append(h('div',{class:'boot-dossier'},heart,h('div', { class: 'boot-title' }, '夜光', h('em', {}, 'カルテ')), h('div', { class: 'boot-sub' }, 'YAKŌ KARTE / ' + t('loading')), bar, tip));
  nextTip();
}
let tipTimer = null;
function nextTip() { if (!tip) return; tip.textContent = L(STORY.loading[Math.floor(Math.random() * STORY.loading.length)]); tipTimer = setTimeout(nextTip, 3200); }
function bootLanguage(ready=false){
  const sub=boot.querySelector('.boot-sub'), tap=boot.querySelector('.boot-tap');
  if(!sub)return;
  sub.replaceChildren(h('span',{class:'yk-wordmark'},'YAKŌ KARTE'),' / ',ready?L({ja:'夜勤の準備完了',en:'SHIFT READY',ru:'СМЕНА ГОТОВА'}):t('loading'));
  if(tap)tap.textContent=t('tapStart');
  clearTimeout(tipTimer);nextTip();
  boot.querySelectorAll('[data-boot-lang]').forEach(b=>{b.classList.toggle('primary',b.dataset.bootLang===S.lang);b.setAttribute('aria-pressed',String(b.dataset.bootLang===S.lang));});
}
bus.on('lang',()=>bootLanguage(!!boot.querySelector('.boot-tap')));
export function bootProgress(p) { if (bar) bar.firstChild.style.width = `calc(${Math.round(p * 100)}% - var(--u) * 2)`; }
export function bootReady() {
  return new Promise(res => {
    const langs=h('div',{class:'boot-languages'});
    [['ja','日本語'],['en','EN'],['ru','RU']].forEach(([k,v])=>langs.append(h('button',{class:'btn sm',type:'button','data-boot-lang':k,onclick:()=>setLang(k)},v)));
    const tap = h('button', { class: 'boot-tap btn primary', type:'button' }, t('tapStart')); boot.querySelector('.boot-dossier').append(tap,langs);
    bootLanguage(true);
    const go = () => {
      tap.disabled=true; audio.unlock(); audio.sfx('good');
      clearTimeout(tipTimer);
      boot.style.transition = 'opacity .5s'; boot.style.opacity = '0';
      setTimeout(() => { bootStop?.(); boot.classList.add('hidden'); boot.innerHTML = ''; boot.style.opacity = '';bar=tip=null; res(); }, 500);
    };
    tap.addEventListener('click', go,{once:true});
  });
}

// ---------------------------------------------------------------- title
const root = document.getElementById('title');
let titleStop = null;
let titleArgs = null;
bus.on('lang', () => { if (titleArgs && !root.classList.contains('hidden')) { titleStop?.(); showTitle(titleArgs); } });
export function showTitle({ onPlay }) {
  titleStop?.();
  titleArgs = { onPlay };
  root.classList.remove('hidden'); root.innerHTML = '';
  audio.play('menu');
  const cv = h('canvas', { class: 'bg', width: W, height: H }); root.append(cv); titleStop = bg(cv, 'title');
  root.append(h('div',{class:'t-file','aria-hidden':'true'}), h('div',{class:'t-hero-label','aria-hidden':'true'},'E. HALE',h('span',{},'03:33')),h('img', { class: 't-splash', src: 'assets/emrys_splash.webp', alt: 'Emrys Hale' }));
  const logo = h('div', { class: 't-logo' }, h('div', { class: 'jp' }, '夜光', h('em', {}, 'カルテ')), h('div', { class: 'en' }, 'YAKŌ KARTE'), h('div', { class: 'sub' }, t('subtitle')));
  logo.prepend(h('div',{class:'t-kicker'},h('i'),'YK / 0333'));
  root.append(logo);
  const hasProgress = !!S.flags.prologue_done;
  if(!hasProgress)root.append(h('div',{class:'t-note'},h('span',{},'02:00'),h('p',{},L({
    ja:'夜勤が始まる。時計はいつも、同じ時刻で止まる。',
    en:'Your shift starts at two. The clock always stops at the same minute.',
    ru:'Смена начинается в два. Часы всегда останавливаются на одной и той же минуте.',
  }))));
  const menu = h('div', { class: 't-menu' });
  const item = (label, fn, cls = '') => menu.append(h('button', { class: 'btn ' + cls, onclick: () => { audio.sfx('click'); fn(); } }, label));
  if (hasProgress) item(t('cont') + `  ·  ${S.stage === 'free' ? t('freeNight') : t('night', { n: S.night })}`, () => start(false), 'primary');
  item(t('newGame'), () => hasProgress ? confirmNew() : start(true), hasProgress ? '' : 'primary');
  if (hasProgress) item(t('arcade'), () => arcadeFromTitle());
  item(t('settings'), () => { document.getElementById('ui').classList.add('top'); openPanel('settings'); const off = bus.on('panel:closed', () => { off(); document.getElementById('ui').classList.remove('top'); refresh(); }); });
  item(t('credits'), () => credits());
  root.append(menu);
  root.append(h('div', { class: 't-dev' }, t('dev')));
  const lang = h('div', { class: 't-lang' });
  [['ja', '日本語'], ['en', 'EN'], ['ru', 'RU']].forEach(([k, l]) => lang.append(h('button', { class: 'btn sm' + (S.lang === k ? ' primary' : ''), onclick: () => { setLang(k); } }, l)));
  root.append(lang);
  function refresh() { titleStop?.(); showTitle({ onPlay }); }
  async function start(fresh) {
    await fade(() => { titleStop?.(); root.classList.add('hidden'); root.innerHTML = ''; });
    onPlay(fresh);
  }
  function confirmNew() {
    const ov = h('div', { class: 'veil' }, h('div', { class: 'mg-card px' }, h('h2', {}, t('newGame')), h('div', {}, t('s_resetQ')),
      h('div', { class: 'acts' }, h('button', { class: 'btn', onclick: () => ov.remove() }, t('no')),
        h('button', { class: 'btn primary', onclick: async () => { ov.remove(); await wipeSave(); bus.emit('save:resume'); } }, t('s_erase')))));
    root.append(ov);
  }
  async function arcadeFromTitle() {
    const ov = h('div', { class: 'veil' }); const card = h('div', { class: 'panel px', style: 'height:80cqh' }); ov.append(card);
    card.append(h('div', { class: 'panel-head' }, h('h2', {}, t('arcadeTitle')), h('button', { class: 'btn sm', onclick: () => ov.remove() }, t('close'))));
    const body = h('div', { class: 'panel-body' }); const grid = h('div', { class: 'shop' }); body.append(grid); card.append(body);
    for (const id of MG_LIST) {
      if (!maxDiff(id)) continue; const m = await loadMg(id);
      const b = h('button', { class: 'ware', type: 'button' }, h('div', { style: 'width:2.8em;height:2.8em;display:grid;place-items:center;background:var(--ink2)' }, iconCanvas(m.control, P.milk2, P.rose)), h('div', {}, h('div', { class: 'wn' }, L(m.title)), h('div', { class: 'wp' }, t('c_' + m.control))));
      b.onclick = async () => { ov.remove(); root.classList.add('hidden'); await runMinigame(id, {}); root.classList.remove('hidden'); audio.play('menu'); };
      grid.append(b);
    }
    root.append(ov);
  }
  function credits() {
    const ov = h('div', { class: 'ending', style: 'z-index:5' }, h('h1', {}, '夜光カルテ'), h('div', { class: 'para' }, t('credits_text')), h('button', { class: 'btn', onclick: () => ov.remove() }, t('back')));
    root.append(ov);
  }
}
