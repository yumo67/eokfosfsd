// Hand-built pixel-art furniture & props for the clinic rooms.
// Light comes from the upper left: highlights on top/left edges, shade on bottom/right, 1px ink outline.
import { P } from './palette.js';

export const R = (g, x, y, w, h, c) => { if (w <= 0 || h <= 0) return; g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
// outlined box
export const O = (g, x, y, w, h, fill, line = P.ink) => { R(g, x, y, w, h, line); R(g, x + 1, y + 1, w - 2, h - 2, fill); };
// shaded outlined box: base fill, light top/left, dark bottom/right
export function box(g, x, y, w, h, c, l, d, line = P.ink) {
  O(g, x, y, w, h, c, line);
  if (l) { R(g, x + 1, y + 1, w - 2, 1, l); R(g, x + 1, y + 1, 1, h - 2, l); }
  if (d) { R(g, x + 1, y + h - 2, w - 2, 1, d); R(g, x + w - 2, y + 1, 1, h - 2, d); }
}
// soft contact shadow on the floor
export function shadow(g, x, y, w, a = 0.2) {
  g.fillStyle = `rgba(18,16,18,${a})`;
  g.fillRect(Math.round(x + 2), Math.round(y), Math.round(w - 4), 1);
  g.fillStyle = `rgba(18,16,18,${a * 0.55})`;
  g.fillRect(Math.round(x), Math.round(y + 1), Math.round(w), 2);
}
// crisp pixel disc / ring
export function disc(g, cx, cy, r, c) {
  g.fillStyle = c;
  for (let dy = -r; dy <= r; dy++) { const dx = Math.floor(Math.sqrt(r * r - dy * dy) + 0.35); g.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1); }
}
export function ring(g, cx, cy, r, c, t = 1) {
  g.fillStyle = c;
  for (let dy = -r; dy <= r; dy++) {
    const o = Math.floor(Math.sqrt(r * r - dy * dy) + 0.35);
    const ri = r - t; const i = Math.abs(dy) <= ri ? Math.floor(Math.sqrt(ri * ri - dy * dy) + 0.35) : -1;
    if (i < 0) g.fillRect(cx - o, cy + dy, o * 2 + 1, 1);
    else { g.fillRect(cx - o, cy + dy, o - i, 1); g.fillRect(cx + i + 1, cy + dy, o - i, 1); }
  }
}
export function line(g, x0, y0, x1, y1, c) {
  g.fillStyle = c; const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0;
  for (let i = 0; i <= n; i++) g.fillRect(Math.round(x0 + (x1 - x0) * i / (n || 1)), Math.round(y0 + (y1 - y0) * i / (n || 1)), 1, 1);
}
// pixel map sprite: rows of chars, map char->color
export function spr(g, x, y, rows, map) {
  for (let j = 0; j < rows.length; j++) { const r = rows[j]; for (let i = 0; i < r.length; i++) { const c = map[r[i]]; if (c) { g.fillStyle = c; g.fillRect(x + i, y + j, 1, 1); } } }
}

// ------------------------------------------------------------------ corridor
// Wheelchair, side view facing left. (x, y) = left end at floor level.
export function wheelchair(g, x, y) {
  shadow(g, x - 2, y, 40);
  // push handle + backrest
  R(g, x + 27, y - 42, 7, 2, P.ink); R(g, x + 31, y - 42, 3, 3, P.ink);
  R(g, x + 26, y - 42, 2, 24, P.ink); // back tube
  box(g, x + 21, y - 39, 6, 19, P.ash, P.ash2, P.ink3);
  R(g, x + 22, y - 35, 4, 1, P.ink3); R(g, x + 22, y - 30, 4, 1, P.ink3);
  // seat cushion
  box(g, x + 6, y - 22, 21, 5, P.ash, P.ash2, P.ink3);
  // armrest
  R(g, x + 11, y - 29, 15, 2, P.ink); R(g, x + 12, y - 30, 13, 1, P.ash2);
  R(g, x + 12, y - 27, 2, 5, P.ink);
  // front frame down to footrest
  line(g, x + 7, y - 18, x + 4, y - 7, P.ink); line(g, x + 8, y - 18, x + 5, y - 7, P.gray);
  R(g, x - 1, y - 7, 8, 2, P.ink); R(g, x, y - 8, 6, 1, P.ash2);
  // lower frame to caster
  R(g, x + 7, y - 17, 18, 1, P.ink);
  line(g, x + 8, y - 16, x + 6, y - 5, P.ink);
  // big rear wheel
  const cx = x + 22, cy = y - 13;
  ring(g, cx, cy, 13, P.ink, 2);
  ring(g, cx, cy, 11, P.ash, 1);
  ring(g, cx, cy, 9, P.gray2, 1);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + 0.2; line(g, cx, cy, cx + Math.round(Math.cos(a) * 8), cy + Math.round(Math.sin(a) * 8), P.gray); }
  disc(g, cx, cy, 2, P.ink); R(g, cx - 1, cy - 1, 1, 1, P.gray2);
  R(g, cx - 9, cy - 12, 4, 1, P.gray2); // tyre highlight
  // caster
  disc(g, x + 6, y - 3, 3, P.ink); disc(g, x + 6, y - 3, 1, P.gray);
}

// Water cooler with a jug on top. (x,y) = left, floor.
export function waterCooler(g, x, y) {
  shadow(g, x - 1, y, 22);
  // cabinet
  box(g, x, y - 42, 20, 42, P.milk3, P.milk3, P.gray3);
  R(g, x + 18, y - 41, 1, 40, P.gray2);
  R(g, x + 2, y - 34, 16, 9, P.gray3); R(g, x + 2, y - 34, 16, 1, P.gray);       // recess
  R(g, x + 5, y - 33, 3, 4, P.red); R(g, x + 5, y - 30, 3, 1, P.red2);           // hot tap
  R(g, x + 12, y - 33, 3, 4, P.ash2); R(g, x + 12, y - 30, 3, 1, P.ash);         // cold tap
  R(g, x + 3, y - 26, 14, 2, P.ink); R(g, x + 4, y - 27, 12, 1, P.ash2);         // drip tray
  R(g, x + 3, y - 20, 14, 17, P.milk2); R(g, x + 3, y - 20, 14, 1, P.gray2); R(g, x + 3, y - 4, 14, 1, P.gray2); R(g, x + 14, y - 13, 2, 3, P.gray);
  R(g, x - 1, y - 43, 22, 2, P.ink); R(g, x, y - 44, 20, 1, P.gray2);
  // jug
  R(g, x + 7, y - 47, 6, 4, P.ink); R(g, x + 8, y - 47, 4, 3, P.gray2);
  spr(g, x + 1, y - 66, [
    '...kkkkkkkkkkk...',
    '..kwwwwwwwwwwwkk.',
    '.kwlggggggggggdk.',
    'kwlgggggggggggddk',
    'kwlgggggggggggddk',
    'kblbbbbbbbbbbbddk',
    'kblbbbbbbbbbbbddk',
    'kwlgggggggggggddk',
    'kwlgggggggggggddk',
    'kblbbbbbbbbbbbddk',
    'kblbbbbbbbbbbbddk',
    'kwlgggggggggggddk',
    'kwlgggggggggggddk',
    '.kwlggggggggggdk.',
    '..kkwwwwwwwwwkk..',
    '....kkkkkkkkk....',
    '......kkkkk......',
    '......kgggk......',
    '......kkkkk......',
  ], { k: P.ink, w: P.milk3, l: P.milk3, g: P.gray3, b: P.gray2, d: P.gray });
}

// Waiting bench with backrest. (x,y) = left, floor.
export function bench(g, x, y, w = 56) {
  shadow(g, x, y, w);
  // legs
  R(g, x + 4, y - 14, 3, 14, P.ink); R(g, x + w - 7, y - 14, 3, 14, P.ink);
  R(g, x + 2, y - 1, 7, 1, P.ink); R(g, x + w - 9, y - 1, 7, 1, P.ink);
  R(g, x + 5, y - 13, 1, 12, P.ash2); R(g, x + w - 6, y - 13, 1, 12, P.ash2);
  // back supports
  R(g, x + 6, y - 32, 2, 18, P.ink); R(g, x + w - 8, y - 32, 2, 18, P.ink);
  // back cushion
  box(g, x + 1, y - 34, w - 2, 10, P.ash2, P.gray, P.ash);
  for (let i = 1; i < 3; i++) R(g, x + Math.round((w - 2) * i / 3), y - 33, 1, 8, P.ash);
  // seat
  box(g, x, y - 19, w, 6, P.ash2, P.gray, P.ash);
  for (let i = 1; i < 3; i++) R(g, x + Math.round(w * i / 3), y - 18, 1, 4, P.ash);
  R(g, x + 1, y - 13, w - 2, 1, P.ink3);
}

// Potted plant (leaves in gray/ink tones). (x,y) = centre, floor.
export function plant(g, x, y) {
  shadow(g, x - 11, y, 22);
  // stems
  const stems = [[-10, -42], [-3, -50], [6, -46], [11, -36], [-12, -30], [2, -38], [8, -28]];
  stems.forEach(([dx, dy]) => line(g, x, y - 18, x + dx * 0.6, y + dy + 6, P.ink3));
  // leaves: pointed ovals with a vein
  const leaf = (lx, ly, flip, c, l) => {
    spr(g, lx - 6, ly - 3, flip ? [
      '....kkkk...', '..kkllcck..', '.kllccccck.', 'kccccccccck', '.kcvvvvcck.', '..kkcccck..', '....kkk....'
    ] : [
      '...kkkk....', '..kccllkk..', '.kcccccllk.', 'kccccccccck', '.kccvvvvck.', '..kccccckk.', '....kkk....'
    ], { k: P.ink, c, l, v: P.ink3 });
  };
  stems.forEach(([dx, dy], i) => leaf(x + dx, y + dy + 4, dx < 0, i % 3 === 0 ? P.ash : i % 3 === 1 ? P.ash2 : P.ink3, i % 3 === 2 ? P.ash : P.gray));
  // pot
  R(g, x - 11, y - 20, 22, 4, P.ink); R(g, x - 10, y - 19, 20, 2, P.red); R(g, x - 10, y - 19, 20, 1, P.rose);
  spr(g, x - 10, y - 16, [
    'kkkkkkkkkkkkkkkkkkkk',
    'kmmllmmmmmmmmmmmmgdk',
    '.kmlmmmmmmmmmmmmgdk.',
    '.kmlmmmmmmmmmmmmgdk.',
    '.kmlmmmmmmmmmmmmgdk.',
    '..kmlmmmmmmmmmmgdk..',
    '..kmlmmmmmmmmmmgdk..',
    '..kmlmmmmmmmmmmgdk..',
    '..kmmmmmmmmmmmmgdk..',
    '...kmmmmmmmmmmgdk...',
    '...kmmmmmmmmmmgdk...',
    '...kmmmmmmmmmmgdk...',
    '...kmmmmmmmmmmgdk...',
    '....kmmmmmmmmgdk....',
    '....kmmmmmmmmgdk....',
    '....kkkkkkkkkkkk....',
  ], { k: P.ink, m: P.milk2, l: P.milk3, g: P.gray3, d: P.gray2 });
}

// Black door at the corridor's end (when noticed)
export function blackDoor(g, x, y) {
  R(g, x - 2, y - 86, 44, 86, P.ink);
  R(g, x, y - 84, 40, 84, P.ink2);
  R(g, x + 3, y - 81, 34, 36, P.ink); R(g, x + 3, y - 41, 34, 38, P.ink);
  R(g, x + 4, y - 80, 32, 34, P.ink2); R(g, x + 4, y - 40, 32, 36, P.ink2);
  R(g, x + 4, y - 80, 32, 1, P.ink3); R(g, x + 4, y - 40, 32, 1, P.ink3);
  // knob plate & keyhole
  R(g, x + 30, y - 50, 5, 12, P.ink3); R(g, x + 31, y - 49, 3, 10, P.ash);
  R(g, x + 32, y - 47, 1, 1, P.ink); R(g, x + 32, y - 45, 1, 3, P.ink);
  R(g, x - 2, y - 1, 44, 2, P.red3);
}

// ------------------------------------------------------------------ reception
export function counter(g, x, y, w, h) {
  // top
  R(g, x - 2, y, w + 4, 5, P.ink); R(g, x - 1, y + 1, w + 2, 2, P.milk3); R(g, x - 1, y + 3, w + 2, 1, P.gray2);
  // body
  box(g, x, y + 5, w, h - 5, P.milk2, P.milk3, P.gray3);
  R(g, x + 1, y + 5, w - 2, 2, P.gray2);
  // panels
  const n = 6, pw = Math.floor((w - 8) / n);
  for (let i = 0; i < n; i++) {
    const px = x + 4 + i * pw;
    R(g, px, y + 10, pw - 3, h - 25, P.gray3); R(g, px + 1, y + 11, pw - 5, h - 27, P.milk2); R(g, px, y + 10, pw - 3, 1, P.gray2);
  }
  // red stripe and kick plate
  R(g, x + 1, y + h - 13, w - 2, 2, P.red); R(g, x + 1, y + h - 11, w - 2, 1, P.red2);
  R(g, x + 1, y + h - 10, w - 2, 9, P.gray2); R(g, x + 1, y + h - 10, w - 2, 1, P.gray);
  // cross sign
  const cx = x + w / 2;
  box(g, cx - 15, y + 13, 30, 22, P.red, P.rose, P.red2);
  R(g, cx - 2, y + 16, 4, 16, P.milk3); R(g, cx - 8, y + 22, 16, 4, P.milk3);
}
export function guestbook(g, x, y) {
  spr(g, x, y, [
    '.kkkkkkkkkkkkkkkkkkkkkkkk.',
    'kwwwwwwwwwwwkkwwwwwwwwwwwk',
    'kwggggggwwwwkkwgggggwwwwwk',
    'kwwwwwwwwwwwkkwwwwwwwwwwwk',
    'kwgggggwwwwwkkwggggggwwwwk',
    'kwwwwwwwwwwwkkwwwwwwwwwwwk',
    'kggggggggggggggggggggggggk',
    '.kkkkkkkkkkkkkkkkkkkkkkkk.',
  ], { k: P.ink, w: P.milk3, g: P.gray2 });
  line(g, x + 18, y + 2, x + 24, y - 3, P.ink); R(g, x + 24, y - 4, 1, 1, P.red);
}
export function deskBell(g, x, y) {
  spr(g, x, y, [
    '......kk......',
    '.....kggk.....',
    '....kkkkkk....',
    '..kkwggggakk..',
    '.kwggggggaaak.',
    '.kggggggaaaak.',
    'kkkkkkkkkkkkkk',
    'kaaaaaaaaaaaak',
    '.kkkkkkkkkkkk.',
  ], { k: P.ink, w: P.milk3, g: P.gray2, a: P.gray });
}
export function glassDoor(g, x, y, w, h) {
  R(g, x, y - h, w, h, P.ink);
  R(g, x + 2, y - h + 2, w - 4, h - 4, P.ink3);
  R(g, x + 3, y - h + 3, w - 6, h - 6, P.ash);
  line(g, x + 4, y - h + 20, x + w - 5, y - h + 8, P.ash2); line(g, x + 4, y - h + 30, x + w - 5, y - h + 18, P.ash2);
  R(g, x + w - 5, y - h / 2 - 6, 2, 12, P.gray2);
}

// ------------------------------------------------------------------ office
export function bookshelf(g, x, y, w, h) {
  shadow(g, x, y, w);
  box(g, x, y - h, w, h, P.ash, P.ash2, P.ink3);
  R(g, x - 1, y - h - 2, w + 2, 3, P.ink); R(g, x, y - h - 1, w, 1, P.ash2);
  const shelves = 4, sh = Math.floor((h - 10) / shelves);
  for (let s = 0; s < shelves; s++) {
    const sy = y - h + 4 + s * sh;
    R(g, x + 3, sy, w - 6, sh - 3, P.ink2);
    // books
    let bx = x + 4; let k = s * 5 + 1;
    while (bx < x + w - 8) {
      k = (k * 7 + 3) % 17;
      const bw = 4 + (k % 3), bh = sh - 6 - (k % 4) * 2;
      const col = [P.milk2, P.gray2, P.red, P.milk, P.ash2, P.red2, P.gray3][k % 7];
      if (k % 11 === 0 && bx < x + w - 14) { // leaning book
        for (let j = 0; j < bh - 2; j++) R(g, bx + Math.floor(j / 3), sy + sh - 4 - j, bw, 1, col);
        bx += bw + 4; continue;
      }
      R(g, bx, sy + sh - 3 - bh, bw, bh, P.ink); R(g, bx + 1, sy + sh - 2 - bh, bw - 2, bh - 1, col);
      R(g, bx + 1, sy + sh - bh + 1, bw - 2, 1, P.ink3); R(g, bx + 1, sy + sh - 7, bw - 2, 1, P.ink3);
      bx += bw;
    }
    R(g, x + 2, sy + sh - 3, w - 4, 3, P.ink); R(g, x + 3, sy + sh - 3, w - 6, 1, P.ash2);
  }
}
export function frame(g, x, y, w, h, kind) {
  R(g, x + 2, y + 2, w, h, 'rgba(18,16,18,0.18)');
  box(g, x, y, w, h, P.ash2, P.gray, P.ash);
  R(g, x + 3, y + 3, w - 6, h - 6, P.milk3);
  if (kind === 'diploma') {
    R(g, x + 6, y + 6, w - 12, 2, P.ink); for (let i = 0; i < 3; i++) R(g, x + 6, y + 11 + i * 3, w - 12 - (i === 2 ? 10 : 0), 1, P.gray);
    disc(g, x + w - 9, y + h - 8, 3, P.red); R(g, x + w - 10, y + h - 5, 1, 3, P.red2); R(g, x + w - 8, y + h - 5, 1, 3, P.red2);
  }
}
export function desk(g, x, y, w) {
  shadow(g, x, y, w);
  // top
  R(g, x - 2, y - 52, w + 4, 5, P.ink); R(g, x - 1, y - 51, w + 2, 2, P.gray3); R(g, x - 1, y - 49, w + 2, 1, P.gray);
  // drawer pedestals
  const ped = (px) => {
    box(g, px, y - 47, 40, 47, P.ash2, P.gray, P.ash);
    for (let d = 0; d < 3; d++) {
      const dy = y - 44 + d * 14; R(g, px + 3, dy, 34, 12, P.ink3); R(g, px + 4, dy + 1, 32, 10, P.ash2); R(g, px + 4, dy + 1, 32, 1, P.gray);
      R(g, px + 15, dy + 5, 10, 2, P.ink); R(g, px + 16, dy + 5, 8, 1, P.gray2);
    }
  };
  ped(x + 2); ped(x + w - 42);
  // modesty panel
  R(g, x + 42, y - 47, w - 84, 26, P.ink); R(g, x + 43, y - 47, w - 86, 25, P.ash);
}
export function monitor(g, x, y) {
  // stand
  R(g, x + 20, y - 8, 12, 6, P.ink); R(g, x + 21, y - 8, 10, 5, P.ash2);
  R(g, x + 14, y - 3, 24, 3, P.ink); R(g, x + 15, y - 3, 22, 1, P.gray);
  // bezel & screen
  box(g, x, y - 44, 52, 37, P.ash, P.ash2, P.ink3);
  R(g, x + 3, y - 41, 46, 29, P.ink); R(g, x + 4, y - 40, 44, 27, P.ink2);
  R(g, x + 44, y - 10, 2, 1, P.red);
  // keyboard
  R(g, x - 4, y + 1, 40, 4, P.ink); R(g, x - 3, y + 1, 38, 2, P.gray2);
  for (let i = 0; i < 9; i++) R(g, x - 2 + i * 4, y + 2, 3, 1, P.gray);
}
export function mug(g, x, y) {
  spr(g, x, y, [
    '.kkkkkkkk..',
    'kiiiiiiiikk',
    'kwwwwwwwk.k',
    'kwrrwwwwk.k',
    'kwrrwwwwk.k',
    'kwwwwwwgkkk',
    'kwwwwwwgk..',
    '.kkkkkkkk..',
  ], { k: P.ink, w: P.milk3, g: P.gray3, r: P.red, i: P.ink3 });
}
export function officeChair(g, x, y) {
  shadow(g, x - 4, y, 30);
  // back
  box(g, x + 2, y - 46, 18, 22, P.ink3, P.ash, P.ink2);
  R(g, x + 5, y - 42, 12, 1, P.ash);
  R(g, x + 9, y - 24, 4, 6, P.ink);
  // seat
  box(g, x - 1, y - 20, 24, 6, P.ink3, P.ash, P.ink2);
  // gas lift
  R(g, x + 9, y - 14, 4, 8, P.ink); R(g, x + 10, y - 14, 1, 8, P.gray);
  // star base
  R(g, x - 3, y - 6, 28, 2, P.ink); line(g, x + 11, y - 6, x - 3, y - 3, P.ink); line(g, x + 11, y - 6, x + 25, y - 3, P.ink);
  disc(g, x - 2, y - 2, 1, P.ink); disc(g, x + 24, y - 2, 1, P.ink); disc(g, x + 11, y - 2, 1, P.ink);
}

// ------------------------------------------------------------------ ward
export function hospitalBed(g, x, y, w = 60) {
  shadow(g, x - 2, y + 22, w + 6);
  // head board (left) and foot board (right)
  R(g, x - 3, y - 18, 4, 40, P.ink); R(g, x - 2, y - 17, 2, 38, P.gray);
  R(g, x - 1, y - 18, 8, 3, P.ink); R(g, x, y - 17, 6, 1, P.gray2);
  box(g, x, y - 16, 8, 16, P.milk3, P.milk3, P.gray3);
  R(g, x + w - 2, y - 6, 4, 28, P.ink); R(g, x + w - 1, y - 5, 2, 26, P.gray);
  box(g, x + w - 8, y - 6, 8, 10, P.milk3, P.milk3, P.gray3);
  // frame
  R(g, x, y + 12, w, 4, P.ink); R(g, x + 1, y + 13, w - 2, 1, P.gray);
  // mattress + sheet
  R(g, x + 1, y, w - 2, 12, P.ink); R(g, x + 2, y + 1, w - 4, 10, P.milk3); R(g, x + 2, y + 8, w - 4, 3, P.gray3);
  // side rail
  R(g, x + 14, y + 4, 30, 1, P.ash); R(g, x + 14, y + 4, 1, 8, P.ash); R(g, x + 43, y + 4, 1, 8, P.ash);
  // pillow
  spr(g, x + 3, y - 5, [
    '.kkkkkkkkkkkk.',
    'kwwwwwwwwwwwwk',
    'kwwwwwwwwwwggk',
    'kgwwwwwwwwgggk',
    '.kkkkkkkkkkkk.',
  ], { k: P.ink, w: P.milk3, g: P.gray3 });
  // legs + wheels
  R(g, x + 3, y + 16, 2, 4, P.ink); R(g, x + w - 5, y + 16, 2, 4, P.ink);
  disc(g, x + 4, y + 21, 1, P.ink); disc(g, x + w - 4, y + 21, 1, P.ink);
}
export function bedsideTable(g, x, y) {
  shadow(g, x, y, 18);
  box(g, x, y - 26, 18, 26, P.milk2, P.milk3, P.gray3);
  R(g, x - 1, y - 27, 20, 2, P.ink); R(g, x, y - 26, 18, 1, P.gray2);
  R(g, x + 2, y - 22, 14, 8, P.gray3); R(g, x + 7, y - 19, 4, 2, P.ink);
  R(g, x + 2, y - 12, 14, 10, P.gray3); R(g, x + 7, y - 9, 4, 2, P.ink);
}
export function ivStand(g, x, y) {
  shadow(g, x - 6, y, 13, 0.15);
  R(g, x, y - 76, 1, 74, P.ink); R(g, x + 1, y - 76, 1, 74, P.gray);
  R(g, x - 5, y - 77, 12, 1, P.ink); R(g, x - 5, y - 76, 1, 2, P.ink); R(g, x + 6, y - 76, 1, 2, P.ink);
  spr(g, x - 8, y - 74, [
    '..kkkk..',
    '.kwwwwk.',
    'kwwwwgwk',
    'kwrrrrgk',
    'kwrrrrgk',
    'kwrrrrgk',
    '.kwwwgk.',
    '..kkkk..',
    '...kk...',
  ], { k: P.ink, w: P.milk3, g: P.gray3, r: P.rose2 });
  line(g, x - 4, y - 65, x - 6, y - 40, P.gray2);
  R(g, x - 5, y - 2, 11, 1, P.ink); disc(g, x - 5, y - 1, 1, P.ink); disc(g, x + 6, y - 1, 1, P.ink);
}
export function wallTV(g, x, y, w = 40, h = 28) {
  R(g, x + w / 2 - 2, y - 6, 4, 6, P.ink);
  box(g, x, y, w, h, P.ink3, P.ash, P.ink2);
  R(g, x + 3, y + 3, w - 6, h - 7, P.ink);
  R(g, x + w - 6, y + h - 3, 2, 1, P.red);
}
export function curtain(g, x, y, w, h) {
  R(g, x, y, w, 2, P.ink); R(g, x, y + 2, w, 1, P.gray);
  for (let cx = x + 2; cx < x + w; cx += 10) {
    R(g, cx + 4, y + 1, 2, 3, P.ink);
    R(g, cx, y + 4, 10, h - 4, P.gray3);
    R(g, cx, y + 4, 2, h - 4, P.milk2); R(g, cx + 3, y + 4, 2, h - 4, P.milk3);
    R(g, cx + 7, y + 4, 2, h - 4, P.gray2); R(g, cx + 9, y + 4, 1, h - 4, P.gray);
  }
  R(g, x, y + h - 2, w, 2, P.gray2);
}

// ------------------------------------------------------------------ pharmacy
export function medShelf(g, x, y, w, h, seed = 0) {
  shadow(g, x, y, w);
  box(g, x, y - h, w, h, P.gray3, P.milk2, P.gray2);
  R(g, x - 1, y - h - 2, w + 2, 3, P.ink);
  const rows = 5, rh = Math.floor((h - 8) / rows);
  for (let r = 0; r < rows; r++) {
    const sy = y - h + 4 + r * rh;
    R(g, x + 3, sy, w - 6, rh - 3, P.milk);
    let bx = x + 5, k = r * 3 + seed;
    while (bx < x + w - 10) {
      k = (k * 5 + 7) % 13; const t = k % 4;
      const base = sy + rh - 3;
      if (t === 0) { // brown-free bottle: milk bottle with red cap
        R(g, bx, base - 13, 7, 13, P.ink); R(g, bx + 1, base - 12, 5, 12, P.milk3); R(g, bx + 1, base - 15, 5, 3, P.ink); R(g, bx + 2, base - 14, 3, 2, P.red);
        R(g, bx + 1, base - 8, 5, 3, P.rose2); bx += 9;
      } else if (t === 1) { // box
        R(g, bx, base - 10, 12, 10, P.ink); R(g, bx + 1, base - 9, 10, 9, P.milk2); R(g, bx + 1, base - 9, 10, 2, P.red); R(g, bx + 4, base - 5, 4, 1, P.gray);
        bx += 13;
      } else if (t === 2) { // small vials
        for (let i = 0; i < 3; i++) { R(g, bx + i * 4, base - 8, 3, 8, P.ink); R(g, bx + i * 4 + 1, base - 7, 1, 7, i === 1 ? P.rose : P.gray2); }
        bx += 13;
      } else { // dark jar
        R(g, bx, base - 11, 9, 11, P.ink); R(g, bx + 1, base - 10, 7, 10, P.ash); R(g, bx + 1, base - 13, 7, 2, P.ink); R(g, bx + 2, base - 7, 5, 3, P.milk3);
        bx += 11;
      }
    }
    R(g, x + 2, sy + rh - 3, w - 4, 3, P.ink); R(g, x + 3, sy + rh - 3, w - 6, 1, P.gray);
  }
}
export function medFridge(g, x, y, w, h) {
  shadow(g, x, y, w);
  box(g, x, y - h, w, h, P.milk2, P.milk3, P.gray2);
  R(g, x + w - 3, y - h + 1, 1, h - 2, P.gray);
  // glass door
  R(g, x + 4, y - h + 6, w - 12, h - 30, P.ink); R(g, x + 5, y - h + 7, w - 14, h - 32, P.ash);
  for (let i = 0; i < 3; i++) {
    const sy = y - h + 26 + i * 24;
    R(g, x + 5, sy, w - 14, 1, P.gray);
    for (let k = 0; k < 5; k++) { R(g, x + 8 + k * 8, sy - 10, 5, 10, P.ink); R(g, x + 9 + k * 8, sy - 9, 3, 9, k % 2 ? P.rose2 : P.milk2); }
  }
  line(g, x + 7, y - h + 12, x + 15, y - h + 30, 'rgba(251,248,242,0.35)');
  // handle
  R(g, x + w - 7, y - h + 30, 2, 22, P.ink); R(g, x + w - 8, y - h + 30, 1, 22, P.gray);
  // control panel & grille
  R(g, x + 4, y - 20, w - 8, 6, P.ink3); R(g, x + 6, y - 18, 10, 2, P.red); R(g, x + 20, y - 18, 3, 2, P.milk3);
  for (let i = 0; i < 4; i++) R(g, x + 4, y - 11 + i * 2, w - 8, 1, P.gray2);
}
export function labBench(g, x, y, w) {
  shadow(g, x, y, w);
  R(g, x - 2, y - 52, w + 4, 4, P.ink); R(g, x - 1, y - 51, w + 2, 2, P.milk3);
  box(g, x, y - 48, w, 48, P.gray3, P.milk2, P.gray2);
  const n = 3, dw = Math.floor((w - 6) / n);
  for (let i = 0; i < n; i++) { const dx = x + 3 + i * dw; R(g, dx, y - 44, dw - 2, 40, P.gray2); R(g, dx + 1, y - 43, dw - 4, 38, P.gray3); R(g, dx + dw / 2 - 4, y - 38, 6, 2, P.ink); }
}
export function scale(g, x, y) {
  spr(g, x, y, [
    '..kkkkkkkkkkkkkkkkkkkk..',
    '.kwwwwwwwwwwwwwwwwwwwwk.',
    '.kggggggggggggggggggggk.',
    '..kkkkkkkkkkkkkkkkkkkk..',
    '..........kkkk..........',
    'kkkkkkkkkkkkkkkkkkkkkkkk',
    'kwwwwwwwwwwwwwwwwwwwwwwk',
    'kwkkkkkkkkkwwwwwwwwrrwwk',
    'kwkrrrrrrrkwwwwaawwrrwwk',
    'kwkkkkkkkkkwwwwaawwwwwwk',
    'kggggggggggggggggggggggk',
    'kkkkkkkkkkkkkkkkkkkkkkkk',
  ], { k: P.ink, w: P.milk3, g: P.gray2, r: P.red, a: P.ash2 });
}
export function tubeRack(g, x, y) {
  const cols = [P.red, P.rose, P.gray, P.ink3];
  for (let i = 0; i < 4; i++) { const tx = x + 2 + i * 7; R(g, tx, y - 22, 5, 20, P.ink); R(g, tx + 1, y - 21, 3, 18, P.milk3); R(g, tx + 1, y - 12, 3, 9, cols[i]); R(g, tx + 1, y - 21, 1, 9, P.milk3); }
  R(g, x, y - 10, 30, 3, P.ink); R(g, x + 1, y - 10, 28, 1, P.gray2);
  R(g, x, y - 3, 30, 3, P.ink); R(g, x + 1, y - 3, 28, 1, P.gray2);
  R(g, x + 1, y - 7, 1, 4, P.ink); R(g, x + 28, y - 7, 1, 4, P.ink);
}

// ------------------------------------------------------------------ lounge
export function calendar(g, x, y) {
  R(g, x + 2, y + 2, 34, 42, 'rgba(18,16,18,0.15)');
  box(g, x, y, 34, 42, P.milk3, P.milk3, P.gray3);
  R(g, x + 1, y + 1, 32, 10, P.red); R(g, x + 1, y + 10, 32, 1, P.red2);
  R(g, x + 8, y - 2, 2, 5, P.ink); R(g, x + 24, y - 2, 2, 5, P.ink);
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) R(g, x + 3 + c * 4, y + 15 + r * 5, 2, 2, (r === 1 && c === 3) ? P.red : c === 0 ? P.rose : P.gray);
  R(g, x + 1, y + 39, 32, 2, P.gray3);
}
export function sofa(g, x, y, w) {
  shadow(g, x - 2, y, w + 4);
  // back
  box(g, x + 6, y - 40, w - 12, 18, P.ash2, P.gray, P.ash);
  const cw = Math.floor((w - 12) / 2);
  R(g, x + 6 + cw, y - 39, 1, 16, P.ash);
  // seat cushions
  box(g, x + 8, y - 24, cw - 1, 10, P.ash2, P.gray, P.ash);
  box(g, x + 8 + cw - 1, y - 24, cw - 2, 10, P.ash2, P.gray, P.ash);
  // base
  R(g, x + 4, y - 14, w - 8, 6, P.ink); R(g, x + 5, y - 14, w - 10, 5, P.ash);
  // armrests
  const arm = (ax) => { box(g, ax, y - 30, 11, 22, P.ash2, P.gray, P.ash); R(g, ax + 1, y - 30, 9, 3, P.gray); R(g, ax, y - 31, 11, 1, P.ink); };
  arm(x); arm(x + w - 11);
  // legs
  R(g, x + 3, y - 8, 3, 8, P.ink); R(g, x + w - 6, y - 8, 3, 8, P.ink);
}
export function cushion(g, x, y) {
  spr(g, x, y, [
    '..kkkkkkkkkkkkkkk.',
    '.kwwwwwwwwwwwwwwgk',
    'kwwwwwrrrrrwwwwwgk',
    'kwwwwwwwwwwwwwwggk',
    'kwwwwwwwwwwwwwgggk',
    'kgwwwwwwwwwwwggggk',
    '.kggggggggggggggk.',
    '..kkkkkkkkkkkkkk..',
  ], { k: P.ink, w: P.milk2, g: P.gray3, r: P.red });
}
export function coffeeTable(g, x, y, w) {
  shadow(g, x, y, w);
  R(g, x - 1, y - 30, w + 2, 4, P.ink); R(g, x, y - 29, w, 1, P.gray3); R(g, x, y - 28, w, 1, P.gray);
  R(g, x + 3, y - 26, 3, 26, P.ink); R(g, x + w - 6, y - 26, 3, 26, P.ink);
  R(g, x + 4, y - 26, 1, 25, P.ash2); R(g, x + w - 5, y - 26, 1, 25, P.ash2);
  R(g, x + 5, y - 10, w - 10, 2, P.ink);
}
export function tvStand(g, x, y, w = 56, h = 40) {
  box(g, x, y, w, h, P.ink3, P.ash, P.ink2);
  R(g, x + 3, y + 3, w - 6, h - 8, P.ink);
  R(g, x + w / 2 - 6, y + h - 3, 12, 1, P.ash2); R(g, x + w - 8, y + h - 3, 2, 1, P.red);
  R(g, x + w / 2 - 2, y + h, 4, 6, P.ink); R(g, x + w / 2 - 10, y + h + 5, 20, 2, P.ink);
}
export function vending(g, x, y, w, h) {
  shadow(g, x - 2, y, w + 4);
  box(g, x, y - h, w, h, P.red, P.rose, P.red2);
  R(g, x + 1, y - h + 1, w - 2, 9, P.red2); R(g, x + 4, y - h + 3, w - 8, 5, P.milk3);
  for (let i = 0; i < 5; i++) R(g, x + 8 + i * 9, y - h + 5, 5, 1, P.red);
  // display window
  const wx = x + 5, wy = y - h + 14, ww = w - 20, wh = 86;
  R(g, wx - 1, wy - 1, ww + 2, wh + 2, P.ink); R(g, wx, wy, ww, wh, P.milk3);
  for (let r = 0; r < 4; r++) {
    const sy = wy + 4 + r * 21;
    for (let c = 0; c < 3; c++) {
      const cx = wx + 3 + c * Math.floor((ww - 4) / 3);
      const k = (r * 3 + c) % 4;
      if (k === 0) { R(g, cx + 2, sy, 6, 14, P.ink); R(g, cx + 3, sy + 1, 4, 12, P.red); R(g, cx + 3, sy + 5, 4, 3, P.milk3); }       // can
      else if (k === 1) { R(g, cx + 3, sy - 2, 4, 2, P.ink); R(g, cx + 2, sy, 6, 14, P.ink); R(g, cx + 3, sy + 1, 4, 12, P.gray3); R(g, cx + 3, sy + 6, 4, 3, P.rose); } // bottle
      else if (k === 2) { R(g, cx + 1, sy + 2, 8, 12, P.ink); R(g, cx + 2, sy + 3, 6, 10, P.milk2); R(g, cx + 2, sy + 3, 6, 3, P.red); }        // carton
      else { R(g, cx + 2, sy + 1, 6, 13, P.ink); R(g, cx + 3, sy + 2, 4, 11, P.ash2); R(g, cx + 3, sy + 5, 4, 2, P.milk3); }                  // coffee
      R(g, cx + 1, sy + 15, 9, 3, P.ink); R(g, cx + 2, sy + 16, 7, 1, P.milk3);  // price tag + button
      R(g, cx + 4, sy + 16, 2, 1, P.red);
    }
    R(g, wx, sy + 18, ww, 1, P.gray2);
  }
  line(g, wx + 2, wy + 8, wx + 12, wy + 40, 'rgba(255,255,255,0.5)');
  // side panel: coin slot, buttons
  const px = x + w - 14;
  R(g, px, wy, 10, 40, P.ink); R(g, px + 1, wy + 1, 8, 38, P.ink2);
  R(g, px + 3, wy + 4, 4, 6, P.milk3); R(g, px + 4, wy + 5, 2, 4, P.ink);
  for (let i = 0; i < 3; i++) R(g, px + 2, wy + 15 + i * 6, 6, 3, P.gray2);
  R(g, px + 3, wy + 33, 4, 2, P.red);
  // dispenser
  R(g, x + 6, y - 26, w - 22, 14, P.ink); R(g, x + 8, y - 24, w - 26, 10, P.ink2); R(g, x + 8, y - 24, w - 26, 2, P.ash);
  R(g, x + 2, y - 6, w - 4, 4, P.red2);
}
export function arcade(g, x, y, w, h) {
  shadow(g, x - 2, y, w + 4);
  // side silhouette
  spr(g, x, y - h, [], {});
  box(g, x, y - h, w, h, P.ink3, P.ash, P.ink2);
  // marquee
  R(g, x + 1, y - h + 1, w - 2, 12, P.red); R(g, x + 1, y - h + 12, w - 2, 1, P.red2);
  R(g, x + 6, y - h + 4, w - 12, 5, P.milk3); R(g, x + 9, y - h + 6, w - 18, 1, P.red);
  // screen bezel (slanted inset)
  R(g, x + 4, y - h + 16, w - 8, 36, P.ink); R(g, x + 6, y - h + 18, w - 12, 32, P.ink2);
  // control panel
  R(g, x - 2, y - h + 56, w + 4, 4, P.ink); R(g, x - 1, y - h + 57, w + 2, 2, P.ash2);
  box(g, x - 1, y - h + 60, w + 2, 12, P.ash, P.ash2, P.ink3);
  R(g, x + 9, y - h + 58, 2, 5, P.ink); disc(g, x + 10, y - h + 57, 2, P.red);   // joystick
  disc(g, x + 24, y - h + 65, 2, P.milk3); disc(g, x + 31, y - h + 64, 2, P.red); disc(g, x + 38, y - h + 65, 2, P.milk3);
  // lower door with coin slots
  R(g, x + 8, y - h + 80, w - 16, 30, P.ink2); R(g, x + 8, y - h + 80, w - 16, 1, P.ash);
  R(g, x + w / 2 - 7, y - h + 86, 5, 8, P.ink); R(g, x + w / 2 - 6, y - h + 87, 3, 6, P.red);
  R(g, x + w / 2 + 2, y - h + 86, 5, 8, P.ink); R(g, x + w / 2 + 3, y - h + 87, 3, 6, P.red);
  R(g, x + 2, y - 6, w - 4, 4, P.ink);
}
export function pillBottle(g, x, y) { // Tsubu's home, x,y = left, bottom
  box(g, x, y - 26, 26, 26, P.milk3, P.milk3, P.gray3);
  R(g, x + 1, y - 26, 24, 2, P.gray2);
  // label
  R(g, x + 3, y - 20, 20, 13, P.ink); R(g, x + 4, y - 19, 18, 11, P.milk2);
  R(g, x + 11, y - 18, 4, 9, P.red); R(g, x + 9, y - 16, 8, 4, P.red);
  R(g, x + 3, y - 4, 20, 1, P.gray3);
}
export function pillCap(g, x, y) { // cap resting beside bottle
  spr(g, x, y, [
    '.kkkkkkkkkkkk.',
    'krrrrrrrrrrrrk',
    'krkrkrkrkrkrrk',
    'kddddddddddddk',
    '.kkkkkkkkkkkk.',
  ], { k: P.ink, r: P.red, d: P.red2 });
}

// ------------------------------------------------------------------ storage
export function cardboard(g, x, y, w, h, tape = true) {
  box(g, x, y - h, w, h, P.milk2, P.milk3, P.gray3);
  R(g, x + 1, y - h + 1, w - 2, 3, P.gray3); R(g, x + 1, y - h + 4, w - 2, 1, P.gray2);
  if (tape) { R(g, x + w / 2 - 3, y - h + 1, 6, h - 2, P.gray3); R(g, x + w / 2 - 3, y - h + 1, 1, h - 2, P.gray2); }
  // label + red cross mark
  R(g, x + 4, y - h + 8, 10, 7, P.milk3); R(g, x + 4, y - h + 8, 10, 1, P.gray2);
  R(g, x + 8, y - h + 9, 2, 5, P.red); R(g, x + 6, y - h + 11, 6, 1, P.red);
  R(g, x + w - 8, y - 6, 5, 1, P.gray2); R(g, x + w - 8, y - 4, 3, 1, P.gray2);
}
export function lostFound(g, x, y) {
  shadow(g, x, y, 48);
  // items peeking: umbrella handle, red scarf, glove
  R(g, x + 8, y - 48, 2, 14, P.ink); R(g, x + 8, y - 50, 6, 2, P.ink); R(g, x + 13, y - 50, 2, 4, P.ink);
  spr(g, x + 14, y - 40, ['..kkkkkkkk....', '.krrrrrrrrkk..', 'krrrrdrrrrrrk.', 'krdrrrrrrdrrrk', '.kkkkkkkkkkkk.'], { k: P.ink, r: P.red, d: P.red2 });
  spr(g, x + 31, y - 41, ['.k.k.k..', 'kwkwkwk.', 'kwwwwwwk', 'kwwwwwwk', '.kkkkkk.'], { k: P.ink, w: P.gray2 });
  // bin
  box(g, x, y - 36, 48, 36, P.gray2, P.gray3, P.gray);
  R(g, x - 1, y - 37, 50, 3, P.ink); R(g, x, y - 36, 48, 1, P.gray3);
  for (let i = 0; i < 4; i++) R(g, x + 6 + i * 11, y - 30, 2, 24, P.gray);
  // label card
  box(g, x + 12, y - 26, 24, 14, P.milk3, P.milk3, P.gray3);
  R(g, x + 15, y - 22, 18, 1, P.ink); R(g, x + 15, y - 18, 12, 1, P.ash2);
  R(g, x + 22, y - 28, 4, 3, P.red);
}
export function mopBucket(g, x, y) {
  shadow(g, x - 2, y, 30);
  // mop handle leaning
  line(g, x + 16, y - 12, x + 6, y - 90, P.ink); line(g, x + 17, y - 12, x + 7, y - 90, P.gray);
  R(g, x + 4, y - 92, 5, 3, P.red);
  // bucket
  spr(g, x, y - 18, [
    '.kkkkkkkkkkkkkkkkkkkkkk.',
    'kggggggggggggggggggggggk',
    'kkkkkkkkkkkkkkkkkkkkkkkk',
    '.krllrrrrrrrrrrrrrrrrdk.',
    '.krlrrrrrrrrrrrrrrrrrdk.',
    '.krlrrrrrrrrrrrrrrrrrdk.',
    '..krlrrrrrrrrrrrrrrrdk..',
    '..kddddddddddddddddddk..',
    '..krrrrrrrrrrrrrrrrrdk..',
    '..krrrrrrrrrrrrrrrrrdk..',
    '..krrrrrrrrrrrrrrrrrdk..',
    '...krrrrrrrrrrrrrrrdk...',
    '...krrrrrrrrrrrrrrrdk...',
    '...krrrrrrrrrrrrrrrdk...',
    '...kkkkkkkkkkkkkkkkkk...',
    '....kk...........kk.....',
    '....kk...........kk.....',
    '........................',
  ], { k: P.ink, g: P.gray3, r: P.red, l: P.rose, d: P.red2 });
  // mop head resting on the rim
  for (let i = 0; i < 8; i++) line(g, x + 12 + i, y - 22, x + 9 + i * 2, y - 15, i % 2 ? P.milk2 : P.gray2);
  R(g, x + 11, y - 23, 10, 2, P.ink);
}
export function metalShelf(g, x, y, w, h) {
  shadow(g, x, y, w);
  R(g, x, y - h, 2, h, P.ink); R(g, x + w - 2, y - h, 2, h, P.ink);
  for (let i = 0; i < 4; i++) { const sy = y - h + 4 + i * Math.floor((h - 6) / 3); R(g, x, sy, w, 3, P.ink); R(g, x + 1, sy, w - 2, 1, P.gray2); }
}
export function stairsDown(g, x, y, open) {
  if (!open) { // sealed floor hatch
    box(g, x, y - 12, 60, 12, P.ash2, P.gray, P.ash);
    for (let i = 0; i < 6; i++) R(g, x + 5 + i * 9, y - 9, 5, 6, P.ash);
    R(g, x + 2, y - 2, 56, 1, P.ink3); return;
  }
  R(g, x - 2, y - 62, 64, 62, P.ink); R(g, x, y - 60, 60, 60, P.ink2);
  for (let i = 0; i < 7; i++) { const sy = y - 34 + i * 5; R(g, x + 2 + i * 2, sy, 56 - i * 4, 2, i % 2 ? P.ash : P.ash2); R(g, x + 2 + i * 2, sy + 2, 56 - i * 4, 3, P.ink3); }
  line(g, x + 6, y - 46, x + 22, y - 6, P.gray); line(g, x + 6, y - 45, x + 22, y - 5, P.ink3);
  box(g, x + 14, y - 76, 32, 12, P.red, P.rose, P.red2); R(g, x + 18, y - 72, 24, 1, P.milk3); R(g, x + 28, y - 69, 4, 2, P.milk3);
}
export function ladder(g, x, y, top) {
  R(g, x, top, 2, y - top, P.ink); R(g, x + 26, top, 2, y - top, P.ink);
  R(g, x + 1, top, 1, y - top, P.gray); R(g, x + 27, top, 1, y - top, P.gray);
  for (let ry = top + 8; ry < y - 2; ry += 10) { R(g, x + 2, ry, 24, 2, P.ink); R(g, x + 2, ry, 24, 1, P.ash2); }
  box(g, x - 6, top - 8, 40, 8, P.gray2, P.gray3, P.gray);
}
export function hatchClosed(g, x, y) {
  box(g, x, y - 70, 30, 70, P.gray2, P.gray3, P.gray);
  R(g, x + 4, y - 62, 22, 2, P.ink); R(g, x + 22, y - 36, 3, 6, P.ink);
  R(g, x + 3, y - 50, 24, 40, P.gray3); R(g, x + 3, y - 50, 24, 1, P.gray);
}

// ------------------------------------------------------------------ records
export function fileCabinet(g, x, y, w, h) {
  shadow(g, x, y, w);
  box(g, x, y - h, w, h, P.gray2, P.gray3, P.gray);
  R(g, x - 1, y - h - 1, w + 2, 2, P.ink);
  const n = 5, dh = Math.floor((h - 6) / n);
  for (let d = 0; d < n; d++) {
    const dy = y - h + 4 + d * dh;
    R(g, x + 3, dy, w - 6, dh - 3, P.gray); R(g, x + 4, dy + 1, w - 8, dh - 5, P.gray2); R(g, x + 4, dy + 1, w - 8, 1, P.gray3);
    box(g, x + w / 2 - 6, dy + 3, 12, 6, P.milk3, null, null); R(g, x + w / 2 - 4, dy + 5, 8, 1, P.gray);
    R(g, x + w / 2 - 8, dy + 11, 16, 2, P.ink); R(g, x + w / 2 - 7, dy + 11, 14, 1, P.gray3);
  }
}
export function deskLamp(g, x, y) {
  R(g, x - 6, y - 2, 14, 2, P.ink); R(g, x - 5, y - 3, 12, 1, P.red2);
  line(g, x, y - 3, x - 6, y - 22, P.ink); line(g, x - 6, y - 22, x + 6, y - 32, P.ink);
  spr(g, x + 2, y - 38, ['..kkkkkk..', '.krrrrrrk.', 'krrrrrrrrk', 'kkkkkkkkkk', '..wwwwww..'], { k: P.ink, r: P.red, w: P.milk3 });
}
export function fileStack(g, x, y, n = 6) {
  for (let i = 0; i < n; i++) { const off = (i * 3) % 4 - 1; box(g, x + off, y - (i + 1) * 3, 22, 3, i % 3 === 1 ? P.rose2 : P.milk3, null, null); }
}

// ------------------------------------------------------------------ rooftop
export function roofDoor(g, x, y) {
  box(g, x, y - 96, 46, 96, P.ash, P.ash2, P.ink3);
  R(g, x - 2, y - 98, 50, 3, P.ink);
  R(g, x + 7, y - 82, 32, 82, P.ink); R(g, x + 8, y - 81, 30, 81, P.ink3);
  R(g, x + 12, y - 76, 22, 14, P.ink); R(g, x + 13, y - 75, 20, 12, P.ash);
  R(g, x + 32, y - 40, 3, 4, P.gray);
  R(g, x + 19, y - 92, 8, 6, P.ink); R(g, x + 20, y - 91, 6, 4, P.milk3);
}
export function railing(g, y) {
  R(g, 0, y - 34, 480, 2, P.ink); R(g, 0, y - 33, 480, 1, P.ash2);
  for (let x = 4; x < 480; x += 12) { R(g, x, y - 32, 2, 32, P.ink); }
  R(g, 0, y - 14, 480, 1, P.ink);
}
export function waterTank(g, x, y) {
  R(g, x + 4, y - 12, 3, 12, P.ink); R(g, x + 41, y - 12, 3, 12, P.ink); R(g, x + 4, y - 6, 40, 1, P.ink);
  box(g, x, y - 50, 48, 38, P.ash, P.ash2, P.ink3);
  for (let i = 0; i < 3; i++) R(g, x + 1, y - 42 + i * 10, 46, 1, P.ink3);
  R(g, x + 18, y - 54, 12, 4, P.ink); R(g, x + 19, y - 53, 10, 2, P.ash2);
}
