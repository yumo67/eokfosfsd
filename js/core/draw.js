// Pixel drawing helpers. All coordinates are logical pixels (stage 480x270).
import { P } from './palette.js';

// Typography: Japanese uses DotGothic16 (bold = pixel-doubled stroke), Latin/Cyrillic use Pixelify Sans (real weights).
const FB = "'Hiragino Kaku Gothic ProN', 'Yu Gothic', monospace";
export let FONT = `'DotGothic16', 'Pixelify Sans', ${FB}`;
let JA = true;
export function setFontLang(l) {
  JA = l === 'ja';
  FONT = JA ? `'DotGothic16', 'Pixelify Sans', ${FB}` : `'IBM Plex Mono', 'DejaVu Sans Mono', monospace`;
}
const fontOf = (size, bold) => `${bold ? 700 : 500} ${size}px ${FONT}`;
const display = s => JA ? String(s) : String(s).toUpperCase();

const ri = Math.round;

export function rect(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(ri(x), ri(y), ri(w), ri(h)); }

export function stroke(g, x, y, w, h, c, t = 1) {
  x = ri(x); y = ri(y); w = ri(w); h = ri(h);
  g.fillStyle = c;
  g.fillRect(x, y, w, t); g.fillRect(x, y + h - t, w, t);
  g.fillRect(x, y, t, h); g.fillRect(x + w - t, y, t, h);
}

// Soft pixel panel: rounded corners by 2px notches, outline + fill + optional shadow
export function panel(g, x, y, w, h, { fill = P.milk2, line = P.ink, shadow = P.ink3, r = 2 } = {}) {
  x = ri(x); y = ri(y); w = ri(w); h = ri(h);
  if (shadow) { g.fillStyle = shadow; roundFill(g, x + 2, y + 2, w, h, r); }
  g.fillStyle = line; roundFill(g, x, y, w, h, r);
  g.fillStyle = fill; roundFill(g, x + 1, y + 1, w - 2, h - 2, Math.max(0, r - 1));
}

export function roundFill(g, x, y, w, h, r = 2) {
  if (r <= 0) { g.fillRect(x, y, w, h); return; }
  g.fillRect(x + r, y, w - 2 * r, h);
  g.fillRect(x, y + r, w, h - 2 * r);
  for (let i = 1; i < r; i++) {
    g.fillRect(x + r - i, y + i, w - 2 * (r - i), h - 2 * i);
  }
}

export function circle(g, cx, cy, r, c) {
  g.fillStyle = c;
  cx = ri(cx); cy = ri(cy); r = Math.max(0, ri(r));
  for (let dy = -r; dy <= r; dy++) {
    const dx = Math.floor(Math.sqrt(r * r - dy * dy + r * 0.8));
    g.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
  }
}

export function ring(g, cx, cy, r, c, t = 1) {
  g.fillStyle = c;
  const steps = Math.max(24, r * 8);
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    g.fillRect(ri(cx + Math.cos(a) * r - t / 2), ri(cy + Math.sin(a) * r - t / 2), t, t);
  }
}

export function line(g, x0, y0, x1, y1, c, t = 1) {
  g.fillStyle = c;
  const dx = x1 - x0, dy = y1 - y0;
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
  for (let i = 0; i <= n; i++) {
    g.fillRect(ri(x0 + dx * i / n - t / 2), ri(y0 + dy * i / n - t / 2), t, t);
  }
}

// bold: true/false; default = bold for display sizes (>= 14)
export function text(g, str, x, y, { size = 12, color = P.ink, align = 'left', base = 'top', shadow = null, maxW = 0, bold = null } = {}) {
  str = display(str);
  const b = bold == null ? size >= 14 : bold;
  g.font = fontOf(size, b);
  g.textAlign = align; g.textBaseline = base;
  str = String(str);
  const mw = maxW || undefined; const X = ri(x), Y = ri(y);
  const thick = b && JA ? Math.max(0.5, size / 16) : 0;
  if (shadow) { g.fillStyle = shadow; g.fillText(str, X + 1, Y + 1, mw); if (thick) g.fillText(str, X + 1 + thick, Y + 1, mw); }
  g.fillStyle = color; g.fillText(str, X, Y, mw);
  if (thick) g.fillText(str, X + thick, Y, mw);
}

// Wrap text into lines within width (works for CJK by char)
export function wrap(g, str, maxW, size = 12, bold = false) {
  str = display(str);
  g.font = fontOf(size, bold);
  const out = []; let cur = '';
  const tokens = /[\u3000-\u9fff\uff00-\uffef]/.test(str) ? [...str] : str.split(/(\s+)/);
  for (const tk of tokens) {
    const test = cur + tk;
    if (g.measureText(test).width > maxW && cur.trim()) { out.push(cur.trim()); cur = tk.trimStart(); }
    else cur = test;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// Pixel sprite from string rows. map: char -> color ('.' or ' ' transparent)
export function sprite(g, rows, map, x, y, s = 1, flip = false) {
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      const ch = row[i]; const c = map[ch];
      if (!c) continue;
      g.fillStyle = c;
      const ix = flip ? (row.length - 1 - i) : i;
      g.fillRect(ri(x + ix * s), ri(y + j * s), s, s);
    }
  }
}

// Red cross icon
export function cross(g, cx, cy, s = 2, c = P.red) {
  rect(g, cx - s * 0.5, cy - s * 1.5, s, s * 3, c);
  rect(g, cx - s * 1.5, cy - s * 0.5, s * 3, s, c);
}

// Dither fill (subtle pixel noise texture) using 2 colors
export function dither(g, x, y, w, h, c, density = 0.06, seed = 1) {
  g.fillStyle = c;
  let s = seed * 9301 + 49297;
  for (let j = 0; j < h; j += 1) for (let i = 0; i < w; i += 1) {
    s = (s * 9301 + 49297) % 233280;
    if (s / 233280 < density) g.fillRect(ri(x + i), ri(y + j), 1, 1);
  }
}

export function lerp(a, b, t) { return a + (b - a) * t; }
export function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
export function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
export function dist(x0, y0, x1, y1) { return Math.hypot(x1 - x0, y1 - y0); }
