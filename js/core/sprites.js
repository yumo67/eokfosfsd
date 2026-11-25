// Hand-built pixel characters & props, drawn into 1x pixel buffers.
import { P } from './palette.js';
import { patient } from './cast.js';
import { drawEmrys } from './emrys-px.js';

const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };

// Characters: ~16x30 px chibi. (x,y) = feet center-bottom.
// opts: { who, frame (0..3 walk), blink, flip, sit }
export const LOOKS = {
  emrys: { hair: P.milk, hairS: P.gray2, streak: P.ink, skin: P.milk3, coat: P.milk2, coatS: P.gray2, shirt: P.ink, pants: P.ink2, shoes: P.ink, cap: true, style: 'long', band: P.red2, tired: true },
  rin: { hair: P.ink2, hairS: P.ink, skin: P.milk3, coat: P.milk2, coatS: P.gray3, shirt: P.rose2, pants: P.milk, shoes: P.gray, cap: true, style: 'bob', band: null },
  oda: { hair: P.gray3, hairS: P.gray, skin: P.milk2, coat: P.rose2, coatS: P.rose, shirt: P.milk, pants: P.gray2, shoes: P.ash, cap: false, style: 'bun' },
  kai: { hair: P.ink3, hairS: P.ink, skin: P.milk3, coat: P.milk, coatS: P.gray2, shirt: P.milk, pants: P.milk, shoes: P.red, cap: false, style: 'short', stripes: P.gray2, small: true },
  sato: { hair: P.ash2, hairS: P.ash, skin: P.milk2, coat: P.ink3, coatS: P.ink2, shirt: P.milk, pants: P.ink3, shoes: P.ink, cap: false, style: 'slick', tie: P.red },
};

export function chibi(g, who, x, y, { frame = 0, blink = false, flip = false, bob = 0, time=0, pose='stand', portrait=false, moving=false } = {}) {
  if(who==='emrys') return drawEmrys(g,x,y,{frame,blink,flip,bob,time,moving});
  return patient(g,who,x,y,{blink,flip,bob,time,pose,portrait});
}

// Tsubu: round milky bean with red cross, ~12x11. mood: 'happy','sad','sleep','sick','eat','normal','wow'
export function tsubu(g, x, y, { mood = 'normal', t = 0, s = 1, hat = null, acc = null } = {}) {
  g.save(); g.translate(x | 0, y | 0); g.scale(s, s);
  const sq = mood === 'sleep' ? Math.sin(t * 2) * 0.6 : (mood === 'happy' ? Math.abs(Math.sin(t * 8)) * -2 : Math.sin(t * 3) * 0.5);
  const O = P.ink, B = mood === 'sick' ? P.gray3 : P.milk3;
  const w = 14, h = 12; const ox = -7, oy = -12 + Math.round(sq);
  R(g, -6, -1, 12, 2, 'rgba(18,16,18,0.2)');
  R(g, ox + 2, oy, w - 4, h, O); R(g, ox, oy + 2, w, h - 3, O); R(g, ox + 1, oy + 1, w - 2, h - 1, O);
  R(g, ox + 2, oy + 1, w - 4, h - 2, B); R(g, ox + 1, oy + 3, w - 2, h - 5, B);
  R(g, ox + 2, oy + h - 3, w - 4, 2, mood === 'sick' ? P.gray : P.gray3);
  // cross
  R(g, -1, oy + 2, 2, 4, P.red); R(g, -2, oy + 3, 4, 2, P.red);
  // face
  const ey = oy + 6;
  if (mood === 'sleep') { R(g, -5, ey + 1, 3, 1, O); R(g, 2, ey + 1, 3, 1, O); }
  else if (mood === 'happy') { R(g, -5, ey, 1, 1, O); R(g, -4, ey - 1, 1, 1, O); R(g, -3, ey, 1, 1, O); R(g, 2, ey, 1, 1, O); R(g, 3, ey - 1, 1, 1, O); R(g, 4, ey, 1, 1, O); }
  else if (mood === 'sad') { R(g, -4, ey, 2, 2, O); R(g, 2, ey, 2, 2, O); R(g, -5, ey - 1, 2, 1, O); R(g, 3, ey - 1, 2, 1, O); R(g, 4, ey + 2, 1, 2, P.gray2); }
  else if (mood === 'sick') { R(g, -5, ey, 1, 1, O); R(g, -3, ey + 1, 1, 1, O); R(g, -4, ey, 1, 2, O); R(g, 2, ey, 3, 1, O); }
  else if (mood === 'wow') { R(g, -5, ey - 1, 3, 3, O); R(g, 2, ey - 1, 3, 3, O); R(g, -4, ey, 1, 1, P.milk3); R(g, 3, ey, 1, 1, P.milk3); }
  else { R(g, -4, ey, 2, 2, O); R(g, 2, ey, 2, 2, O); R(g, -4, ey, 1, 1, P.ash); }
  R(g, -6, ey + 2, 2, 1, P.rose2); R(g, 4, ey + 2, 2, 1, P.rose2);
  if (mood === 'eat') { R(g, -1, ey + 3, 3, 2, P.red3); } else if (mood === 'happy' || mood === 'wow') { R(g, -1, ey + 3, 2, 1, O); R(g, -2, ey + 2, 1, 1, O); R(g, 1, ey + 2, 1, 1, O); }
  else if (mood !== 'sleep') R(g, -1, ey + 3, 2, 1, O);
  // feet
  R(g, -5, oy + h - 1, 3, 1, O); R(g, 2, oy + h - 1, 3, 1, O);
  // decorations
  if (hat === 'cap') { R(g, -5, oy - 3, 10, 3, O); R(g, -4, oy - 2, 8, 1, P.milk3); R(g, -1, oy - 3, 2, 2, P.red); }
  if (hat === 'ribbon') { R(g, 2, oy - 2, 3, 3, P.red); R(g, 5, oy - 1, 1, 1, P.red2); R(g, 6, oy - 2, 3, 3, P.red); }
  if (hat === 'crown') { R(g, -4, oy - 3, 8, 3, P.ink); R(g, -3, oy - 4, 1, 1, P.ink); R(g, 0, oy - 5, 1, 2, P.ink); R(g, 3, oy - 4, 1, 1, P.ink); R(g, -1, oy - 2, 2, 1, P.red); }
  if (hat === 'bandage') { R(g, -6, oy + 3, 12, 2, P.milk); R(g, -6, oy + 3, 12, 1, P.gray3); R(g, 4, oy + 2, 1, 1, P.rose); }
  if (hat === 'leaf') { R(g, 0, oy - 3, 1, 3, P.ash); R(g, 1, oy - 4, 3, 2, P.ash2); }
  if (acc === 'bell') { R(g, -1, oy + h - 3, 3, 3, P.gray); R(g, 0, oy + h - 1, 1, 1, P.ink); }
  if (acc === 'scarf') { R(g, -6, oy + h - 4, 12, 2, P.red); R(g, 3, oy + h - 2, 2, 3, P.red2); }
  if (acc === 'glasses') { R(g, -6, ey - 1, 5, 4, P.ink); R(g, 1, ey - 1, 5, 4, P.ink); R(g, -5, ey, 3, 2, P.milk3); R(g, 2, ey, 3, 2, P.milk3); R(g, -4, ey, 1, 1, P.ink); R(g, 3, ey, 1, 1, P.ink); }
  g.restore();
}

// beds etc
export function bed(g, x, y, w = 56) {
  R(g, x, y, w, 4, P.ink); R(g, x + 1, y + 1, w - 2, 2, P.gray2);
  R(g, x, y + 4, w, 12, P.ink); R(g, x + 1, y + 5, w - 2, 10, P.milk3); R(g, x + 1, y + 12, w - 2, 3, P.gray3);
  R(g, x + 2, y - 4, 12, 6, P.ink); R(g, x + 3, y - 3, 10, 4, P.milk2);
  R(g, x - 2, y - 14, 3, 34, P.ink); R(g, x - 1, y - 13, 1, 32, P.gray);
  R(g, x + w - 1, y - 6, 3, 26, P.ink); R(g, x + w, y - 5, 1, 24, P.gray);
  R(g, x + 2, y + 16, 3, 4, P.ink); R(g, x + w - 5, y + 16, 3, 4, P.ink);
}
