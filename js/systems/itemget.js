// Ceremonial item reveal: pause, zoom in, spinning low-poly pixel model, name + description, sound, fly to bag.
import { render } from './mesh3d.js';
import { ITEMS } from '../data/items.js';
import { L, t } from '../core/i18n.js';
import { audio } from '../core/audio.js';
import { h } from '../core/stage.js';
import { S } from '../core/state.js';

const root = document.getElementById('itemget');
const queue = []; let busy = false;
export function revealItem(id, n = 1) { return new Promise(res => { queue.push({ id, n, res }); pump(); }); }
export const isRevealing = () => busy;

async function pump() {
  if (busy || !queue.length) return; busy = true;
  const { id, n, res } = queue.shift(); const it = ITEMS[id];
  const rare = it.rarity >= 3; const reduced = S.settings.anim === 'reduced';
  root.innerHTML = ''; root.className = 'layer';
  const N = 56; const cv = h('canvas', { width: N * 4, height: N * 4 });
  const tmp = document.createElement('canvas'); tmp.width = N; tmp.height = N; const tg = tmp.getContext('2d');
  const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
  const wrap = h('div', { class: 'ig-wrap' },
    h('div', { class: 'ig-rar tag ' + (rare ? 'red' : '') }, t('rar' + it.rarity) + ' · ' + t('gotItem')),
    cv,
    h('div', { class: 'ig-name' }, L(it.name) + (n > 1 ? ` ×${n}` : '')),
    h('div', { class: 'ig-desc' }, L(it.desc)),
    h('div', { class: 'boot-tap', style: 'font-size:.8em;margin-top:.6em' }, t('tapToContinue')));
  root.append(h('div', { class: 'ig-ray' + (rare ? ' rare' : '') }), wrap);
  requestAnimationFrame(() => root.classList.add('on'));
  audio.sfx(rare ? 'rare' : 'item');
  let t0 = performance.now(), alive = true, canClose = false;
  const loop = (now) => {
    if (!alive) return;
    const e = (now - t0) / 1000;
    const zoom = reduced ? 1 : Math.min(1, 0.2 + e * 1.6) * (1 + Math.max(0, 0.15 - Math.abs(e - 0.55)) * 1.2);
    const spin = (rare ? 2.2 : 1.6) * e + (reduced ? 0.7 : 0);
    tg.clearRect(0, 0, N, N); tg.putImageData(render(it.mesh, N, spin, 0.3 + Math.sin(e * 1.3) * 0.12, zoom), 0, 0);
    g.clearRect(0, 0, cv.width, cv.height);
    // sparkles
    g.drawImage(tmp, 0, Math.round(Math.sin(e * 2) * 2) * 4, cv.width, cv.height);
    g.fillStyle = rare ? '#d86a72' : '#fbf8f2';
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + e; const r = 80 + Math.sin(e * 3 + i) * 14; if ((Math.floor(e * 6) + i) % 3) g.fillRect(Math.round(N * 2 + Math.cos(a) * r) & ~3, Math.round(N * 2 + Math.sin(a) * r) & ~3, 4, 4); }
    if (it.mesh === 'nothing') { g.fillStyle = '#4a4447'; g.font = '40px DotGothic16'; g.textAlign = 'center'; g.fillText('　', N * 2, N * 2); }
    if (e > 0.7 && !root.classList.contains('text')) { root.classList.add('text'); canClose = true; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  const close = async () => {
    if (!canClose) return; canClose = false; root.removeEventListener('pointerdown', close);
    // fly to bag
    const rect = cv.getBoundingClientRect(); const sr = document.getElementById('stage').getBoundingClientRect();
    const fly = h('canvas', { class: 'ig-fly', width: N, height: N }); fly.getContext('2d').drawImage(tmp, 0, 0);
    Object.assign(fly.style, { left: (rect.left - sr.left + rect.width * 0.3) + 'px', top: (rect.top - sr.top + rect.height * 0.3) + 'px' });
    root.append(fly); cv.style.visibility = 'hidden'; root.classList.remove('on', 'text');
    const bag = document.querySelector('[data-hud="bag"]'); const br = bag ? bag.getBoundingClientRect() : { left: sr.right - 60, top: sr.top + 10, width: 20, height: 20 };
    requestAnimationFrame(() => Object.assign(fly.style, { left: (br.left - sr.left) + 'px', top: (br.top - sr.top) + 'px', width: br.width + 'px', height: br.height + 'px', opacity: '0.3' }));
    audio.sfx('whoosh');
    await new Promise(r => setTimeout(r, reduced ? 50 : 620));
    if (bag) { bag.classList.add('press'); setTimeout(() => bag.classList.remove('press'), 160); }
    alive = false; root.className = 'layer hidden'; root.innerHTML = ''; busy = false; res(); pump();
  };
  root.addEventListener('pointerdown', close);
}
