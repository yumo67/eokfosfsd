// Stage sizing (16:9 letterboxed, safe-area aware), hi-DPI canvases, pointer mapping, transitions.
export const W = 480, H = 270;
export const stage = document.getElementById('stage');
export let unit = 2;

export function fit() {
  const cs = getComputedStyle(document.getElementById('app'));
  const pw = window.innerWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const ph = window.innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  let w = pw, h = pw * 9 / 16;
  if (h > ph) { h = ph; w = ph * 16 / 9; }
  w = Math.floor(w); h = Math.floor(h);
  unit = h / H;
  const r = document.documentElement.style;
  r.setProperty('--sw', w + 'px'); r.setProperty('--sh', h + 'px');
  r.setProperty('--u', unit + 'px');
  r.setProperty('--fs', Math.round(Math.max(12, Math.min(22, unit * 7.4))) + 'px');
  canvases.forEach(c => sizeCanvas(c));
}
const canvases = new Set();
// Canvas whose 2D context is in logical 480x270 coordinates, rendered at device resolution
export function hiCanvas(cv) {
  cv._hi = true; canvases.add(cv); sizeCanvas(cv);
  return cv.getContext('2d');
}
function sizeCanvas(cv) {
  const k = Math.max(1, Math.ceil(unit * (window.devicePixelRatio || 1)));
  const s = Math.min(k, 6);
  if (cv.width !== W * s) { cv.width = W * s; cv.height = H * s; }
  const g = cv.getContext('2d'); g.setTransform(s, 0, 0, s, 0, 0); g.imageSmoothingEnabled = false;
}
export function releaseCanvas(cv) { canvases.delete(cv); }

export function toLogical(cv, e) {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
}

// unified pointer binding
export function bindPointer(el, { down, move, up }, cv = el) {
  const onDown = e => { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (_) { } const p = toLogical(cv, e); down && down(p.x, p.y, e.pointerId, e); };
  const onMove = e => { const p = toLogical(cv, e); move && move(p.x, p.y, e.pointerId, e); };
  const onUp = e => { const p = toLogical(cv, e); up && up(p.x, p.y, e.pointerId, e); };
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
  return () => { el.removeEventListener('pointerdown', onDown); el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerup', onUp); el.removeEventListener('pointercancel', onUp); };
}

const fadeEl = document.getElementById('fade');
export function fade(fn, { wipe = false, hold = 120 } = {}) {
  return new Promise(res => {
    fadeEl.classList.toggle('wipe', wipe);
    fadeEl.classList.add('on');
    setTimeout(async () => { try { await fn?.(); } catch (e) { console.error(e); } setTimeout(() => { fadeEl.classList.remove('on'); res(); }, hold); }, 460);
  });
}
export const wait = ms => new Promise(r => setTimeout(r, ms));

export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const k in attrs) {
    const v = attrs[k];
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const c of kids.flat()) { if (c == null || c === false) continue; el.append(c.nodeType ? c : document.createTextNode(String(c))); }
  return el;
}

window.addEventListener('resize', fit);
window.addEventListener('orientationchange', () => setTimeout(fit, 250));
if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
// block accidental scroll/zoom gestures
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });
document.addEventListener('touchmove', e => { if (!e.target.closest('.panel-body, .vn-choices, .mg-card, textarea')) e.preventDefault(); }, { passive: false });
document.addEventListener('contextmenu', e => e.preventDefault());
