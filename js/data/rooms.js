// Room definitions: static pixel art (drawn once to a 1x buffer), animated layer, hotspots, exits.
import { P } from '../core/palette.js';
import * as K from '../core/furniture.js';
import { chibi, tsubu as drawTsubu } from '../core/sprites.js';
import { architecture, fixtures, pane, skyline, slab, label } from '../core/scenery.js';

const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };
const O = (g, x, y, w, h, fill, line = P.ink) => { R(g, x, y, w, h, line); R(g, x + 1, y + 1, w - 2, h - 2, fill); };
export const FLOOR_Y = 232;

export function shell(g, { id='reception', wall=P.milk, wains=P.gray3, floorA=P.gray3, floorB=P.milk2, dark=0, stripe=P.red }={}) {
  architecture(g,id,{wall,wains,floorA,floorB,stripe,dark});
}
const lights=(g,t,xs,flick)=>fixtures(g,null,t,xs,flick);

function doorShape(g, x, label, { w = 34, h = 70, fill = P.gray2, win = true, plate = P.milk3, open = false } = {}) {
  h+=8;const y=211-h;
  slab(g,x-4,y-4,w+8,h+4,P.ash,P.gray3,P.ink);
  slab(g,x,y,w,h,open?P.ink:fill,P.milk3,P.ash2);
  if(win) {
    slab(g,x+4,y+7,w-8,27,P.ink2,P.gray,P.ink);
    R(g,x+8,y+10,2,12,P.ash2);R(g,x+11,y+10,1,8,P.ash);
    for(let i=0;i<3;i++)R(g,x+7,y+22+i*2,w-16,1,P.ash);
  }
  slab(g,x+4,y+48,w-8,h-55,fill,P.milk2,P.gray);
  for(let i=7;i<w-6;i+=4)R(g,x+i,y+52,1,h-64,P.gray);
  R(g,x+w-9,y+39,5,8,P.ash);R(g,x+w-15,y+40,9,3,P.ink3);R(g,x+w-14,y+40,8,1,P.milk);
  for(const z of [y+15,y+h-14])R(g,x+1,z,2,5,P.ash2);
  if(label){slab(g,x+3,y-13,w-6,9,plate,P.milk3,P.ash);R(g,x+7,y-9,w-15,1,P.ink3);}
}
function windowNight(g, x, y, w, h, t = 0, { corridor = false } = {}) {
  pane(g,x,y,w,h,corridor);
}
function poster(g, x, y, w, h, kind = 0) {
  O(g, x, y, w, h, P.milk3);
  if (kind === 0) { R(g, x + w / 2 - 2, y + 5, 4, 12, P.red); R(g, x + w / 2 - 6, y + 9, 12, 4, P.red); for (let i = 0; i < 3; i++) R(g, x + 4, y + 22 + i * 4, w - 8, 1, P.gray); }
  if (kind === 1) { R(g, x + 4, y + 4, w - 8, h / 2, P.gray3); R(g, x + w / 2 - 4, y + 8, 8, 8, P.milk); R(g, x + w / 2 - 2, y + 8, 4, 8, P.red); for (let i = 0; i < 3; i++) R(g, x + 4, y + h / 2 + 8 + i * 4, w - 8, 1, P.gray); }
  if (kind === 2) { R(g, x + 3, y + 3, w - 6, 4, P.red); for (let i = 0; i < 5; i++) R(g, x + 4, y + 11 + i * 4, (w - 8) * (0.5 + ((i * 7) % 5) / 10), 1, P.ash2); }
}
function clockFace(g, cx, cy, r, t, back = false, frozen = false) {
  for (let dy = -r - 2; dy <= r + 2; dy++) { const dx = Math.floor(Math.sqrt((r + 2) ** 2 - dy * dy)); R(g, cx - dx, cy + dy, dx * 2 + 1, 1, P.ink); }
  for (let dy = -r; dy <= r; dy++) { const dx = Math.floor(Math.sqrt(r * r - dy * dy)); R(g, cx - dx, cy + dy, dx * 2 + 1, 1, P.milk3); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; R(g, cx + Math.round(Math.sin(a) * (r - 3)), cy - Math.round(Math.cos(a) * (r - 3)), i % 3 ? 1 : 2, i % 3 ? 1 : 2, P.ink); }
  // 3:33 — minute hand creeps but always returns
  let mins = 33 + (frozen ? 0 : (Math.sin(t * 0.05) * 0.4));
  if (back) mins = 33 - (t * 40) % 60;
  const hrs = 3 + mins / 60;
  const hand = (ang, len, c, w) => { for (let k = 0; k < len; k++) R(g, cx + Math.round(Math.sin(ang) * k), cy - Math.round(Math.cos(ang) * k), w, w, c); };
  hand(hrs / 12 * Math.PI * 2, r * 0.5, P.ink, 2);
  hand(mins / 60 * Math.PI * 2, r * 0.8, P.ink, 1);
  const sec = back ? -t * 6 : t; hand((sec % 60) / 60 * Math.PI * 2, r * 0.85, P.red, 1);
  R(g, cx - 1, cy - 1, 2, 2, P.red);
}

// ------------------------------------------------------------------
export const ROOMS = {
  reception: {
    floor: [24, 456], lights: [80, 240, 400],
    music: 'clinic',
    draw(g, st) {
      shell(g);
      windowNight(g, 40, 56, 70, 66);
      label(g,153,60,58,'NIGHT / 01'); label(g,269,60,58,'YAKŌ / RX');
      slab(g,120,112,24,25,P.gray2,P.milk3,P.ash);
      R(g,125,116,14,2,P.red);
      poster(g, 392, 60, 34, 46, 0); poster(g, 432, 70, 26, 34, 2);
      // big clock base
      O(g, 226, 44, 28, 6, P.gray2);
      K.counter(g, 150, 150, 200, 62);
      K.guestbook(g, 167, 142); K.deskBell(g, 311, 141);
      K.plant(g, 390, 211);
      K.bench(g, 404, 211, 40);
      // exit arrow right
      doorShape(g, 446, false, { w: 30, h: 76, fill: P.gray3, win: false });
      // entrance glass doors left
      K.glassDoor(g, 0, 212, 18, 84);
    },
    anim(g, t, st) {
      lights(g, t, this.lights, st.night >= 3 ? 1 : 0);
      clockFace(g, 240, 74, 18, t, st.clockBack, false);
    },
    hotspots: [
      { id: 'clock', x: 220, y: 54, w: 40, h: 42, act: 'clock' },
      { id: 'guestbook', x: 164, y: 138, w: 34, h: 16 },
      { id: 'bell', x: 306, y: 138, w: 24, h: 16, act: 'bell' },
      { id: 'plant', x: 374, y: 160, w: 34, h: 54 },
      { id: 'poster', x: 390, y: 58, w: 70, h: 50 },
      { id: 'window_rec', x: 36, y: 52, w: 78, h: 74 },
      { id: 'rin', x: 196, y: 108, w: 34, h: 44, act: 'npc', who: 'rin' },
      { id: 'exit_corridor', x: 444, y: 130, w: 36, h: 82, act: 'go', to: 'corridor', at: 40, label: 'r_corridor' },
    ],
    npcs: [{ who: 'rin', x: 214, y: 174, behind: true }],
  },

  corridor: {
    floor: [16, 470], lights: [60, 180, 300, 420], music: 'clinic',
    doors: [
      { to: 'reception', x: 8, label: 'r_reception', arrow: 'L' },
      { to: 'office', x: 50, label: 'r_office' },
      { to: 'ward', x: 116, label: 'r_ward' },
      { to: 'pharmacy', x: 182, label: 'r_pharmacy' },
      { to: 'lounge', x: 248, label: 'r_lounge' },
      { to: 'storage', x: 314, label: 'r_storage' },
    ],
    draw(g, st) {
      shell(g,{id:'corridor'});
      for (const d of this.doors) {
        if (d.arrow) { R(g, 0, 132, 14, 80, P.ink); R(g, 2, 134, 10, 76, P.gray2); continue; }
        doorShape(g, d.x, false, { fill: d.to === 'storage' ? P.ash2 : P.gray2 });
        label(g,d.x-2,108,38,'0'+(this.doors.indexOf(d)+1), d.to==='storage');
      }
      poster(g, 360, 66, 30, 40, 1);
      K.waterCooler(g, 361, 211);
      K.wheelchair(g, 391, 211);
      // end of corridor: darker zone
      const grd = g.createLinearGradient(420, 0, 480, 0); grd.addColorStop(0, 'rgba(18,16,18,0)'); grd.addColorStop(1, 'rgba(18,16,18,0.45)');
      g.fillStyle = grd; g.fillRect(420, 34, 60, 182);
      if (st.doorNoticed) {
        K.blackDoor(g, 432, 212);
      } else {
        // almost-a-door: wall seam
        R(g, 434, 130, 1, 80, P.gray2); R(g, 470, 130, 1, 80, P.gray2); R(g, 434, 130, 37, 1, P.gray2);
      }
    },
    anim(g, t, st) {
      lights(g, t, this.lights, 1);
      if (st.doorNoticed && Math.sin(t * 0.7) > 0.7) { g.fillStyle = 'rgba(179,40,58,0.08)'; g.fillRect(426, 120, 52, 96); }
    },
    get hotspots() {
      const hs = this.doors.map(d => ({ id: 'go_' + d.to, x: d.arrow ? 0 : d.x - 2, y: 130, w: d.arrow ? 16 : 38, h: 84, act: 'go', to: d.to, at: d.to === 'reception' ? 420 : 240, label: d.label }));
      return hs.concat([
        { id: 'poster_cor', x: 358, y: 62, w: 34, h: 46 },
        { id: 'water', x: 360, y: 146, w: 22, h: 66 },
        { id: 'wheelchair', x: 386, y: 166, w: 42, h: 46 },
        { id: 'black_door', x: 428, y: 124, w: 50, h: 90, act: 'door' },
      ]);
    },
  },

  office: {
    floor: [30, 450], lights: [150, 330], music: 'clinic',
    draw(g, st) {
      shell(g, { id:'office',wall: P.milk2, wains: P.gray3 });
      windowNight(g, 330, 54, 84, 70, 0, { corridor: st.night >= 3 });
      K.bookshelf(g, 30, 211, 64, 146);
      // diploma & photo
      K.frame(g, 120, 62, 40, 28, 'diploma');
      O(g, 176, 66, 22, 26, P.ink3); R(g, 179, 69, 16, 20, P.gray3); R(g, 183, 72, 8, 8, P.milk); R(g, 182, 80, 10, 9, P.gray2);
      R(g, 182, 73, 10, 1, P.ink); R(g, 183, 75, 8, 1, P.ink); R(g, 182, 77, 9, 1, P.ink); // scratched face
      K.desk(g, 200, 211, 150);
      K.monitor(g, 236, 159);
      K.mug(g, 299, 151);
      K.officeChair(g, 262, 211);
      R(g, 0, 132, 14, 80, P.ink); R(g, 2, 134, 10, 76, P.gray2);
    },
    anim(g, t, st) {
      lights(g, t, this.lights, st.night >= 4 ? 1 : 0);
      // pc screen
      for (let i = 0; i < 4; i++) R(g, 243, 125 + i * 6, 14 + ((i * 11 + Math.floor(t * 2)) % 22), 2, i === 0 ? P.red : P.gray);
      if (Math.floor(t * 2) % 2) R(g, 243 + 26, 143, 3, 2, P.milk3);
      // steam
      for (let i = 0; i < 3; i++) { const yy = 144 - ((t * 8 + i * 5) % 14); R(g, 303 + Math.round(Math.sin(t * 2 + i) * 2), yy, 1, 2, 'rgba(189,184,184,0.7)'); }
    },
    hotspots: [
      { id: 'pc', x: 232, y: 114, w: 60, h: 48, act: 'pc' },
      { id: 'mug', x: 296, y: 142, w: 18, h: 20 },
      { id: 'diploma', x: 116, y: 58, w: 48, h: 36 },
      { id: 'photo', x: 172, y: 62, w: 30, h: 34 },
      { id: 'window_off', x: 326, y: 50, w: 92, h: 78 },
      { id: 'bookshelf', x: 28, y: 62, w: 68, h: 150 },
      { id: 'exit_corridor', x: 0, y: 130, w: 18, h: 84, act: 'go', to: 'corridor', at: 66, label: 'r_corridor' },
    ],
  },

  ward: {
    floor: [24, 456], lights: [70, 200, 330, 440], music: 'clinic',
    draw(g, st) {
      shell(g, { id:'ward',wall: P.milk });
      for(let x=41;x<310;x+=96)label(g,x,107,46,'BED / '+(1+(x-41)/96));
      // kai drawing
      O(g, 150, 70, 28, 22, P.milk3); R(g, 160, 74, 6, 6, P.ink3); R(g, 158, 80, 10, 9, P.milk); R(g, 158, 80, 10, 1, P.ink); R(g, 157, 80, 1, 9, P.ink); R(g, 168, 80, 1, 9, P.ink); R(g, 162, 72, 3, 2, P.red);
      // tv
      K.wallTV(g, 270, 50, 40, 28);
      const show = (b) => b === 'kai' ? !(st.night > 5) : b === 'none' ? true : !(st.night > 4);
      K.bedsideTable(g, 100, 211); K.bedsideTable(g, 196, 211); K.ivStand(g, 300, 211);
      K.hospitalBed(g, 36, 186, 56); K.hospitalBed(g, 132, 186, 56); K.hospitalBed(g, 228, 186, 56);
      // curtain bed 4
      if (!st.curtainOpen) {
        K.curtain(g, 322, 40, 140, 170);
      } else {
        K.hospitalBed(g, 360, 186, 56); K.curtain(g, 322, 40, 22, 170);
        O(g, 400, 160, 22, 10, P.milk3); R(g, 403, 164, 16, 1, P.ink);
      }
      for (let i = 0; i < 3; i++) { O(g, 56 + i * 96, 140, 16, 8, P.milk3); R(g, 58 + i * 96, 143, 12, 1, P.gray); }
    },
    anim(g, t, st) {
      lights(g, t, this.lights, st.night >= 4 ? 1 : 0);
      // tv static
      for (let i = 0; i < 40; i++) R(g, 272 + ((i * 17 + Math.floor(t * 30) * 7) % 36), 52 + ((i * 11 + Math.floor(t * 30) * 3) % 24), 2, 1, i % 3 ? P.gray : P.milk);
      // patients in beds
      const pt = [['oda', 64, st.night <= 4], ['kai', 160, st.night <= 5], ['sato', 256, st.night <= 4]];
      pt.forEach(([w, x, here], i) => {
        if (!here) return;
        g.save();g.translate(x,199);g.scale(1.36,1.36);
        chibi(g,w,0,0,{pose:'seated',blink:(t+i)%5<.15,bob:Math.round(Math.sin(t*1.8+i)),time:t+i});
        g.restore();
        slab(g,x-24,185,49,14,P.milk3,P.milk3,P.gray);
        R(g,x-21,189,43,2,P.rose2);
        for(let j=-19;j<19;j+=5)R(g,x+j,194,3,1,P.gray2);
      });
      if (st.curtainOpen) { R(g, 372, 182, 40, 6, P.gray3); }
    },
    hotspots: [
      { id: 'oda', x: 46, y: 160, w: 40, h: 40, act: 'npc', who: 'oda', req: 'night<=4' },
      { id: 'kai', x: 142, y: 160, w: 40, h: 40, act: 'npc', who: 'kai', req: 'night<=5' },
      { id: 'sato', x: 238, y: 160, w: 40, h: 40, act: 'npc', who: 'sato', req: 'night<=4' },
      { id: 'drawing', x: 146, y: 66, w: 36, h: 30 },
      { id: 'tv_ward', x: 266, y: 46, w: 48, h: 36 },
      { id: 'curtain4', x: 322, y: 40, w: 140, h: 170, act: 'curtain' },
      { id: 'exit_corridor', x: 0, y: 130, w: 20, h: 84, act: 'go', to: 'corridor', at: 132, label: 'r_corridor' },
    ],
  },

  pharmacy: {
    floor: [24, 456], lights: [120, 300, 420], music: 'clinic',
    draw(g, st) {
      shell(g, { id:'pharmacy',wall: P.milk2,stripe: P.red2 });
      K.medShelf(g, 40, 211, 96, 156, 0); K.medShelf(g, 150, 211, 96, 156, 5);
      // note
      O(g, 262, 96, 20, 16, P.milk3); R(g, 265, 100, 14, 1, P.gray); R(g, 265, 104, 10, 1, P.gray); R(g, 270, 94, 4, 3, P.red);
      K.medFridge(g, 300, 211, 56, 134);
      K.labBench(g, 370, 211, 100);
      K.scale(g, 389, 148); K.tubeRack(g, 428, 159);
      R(g, 0, 132, 14, 80, P.ink); R(g, 2, 134, 10, 76, P.gray2);
    },
    anim(g, t, st) {
      lights(g, t, this.lights, 0);
      // fridge reflection: room reflection, but no Emrys
      g.fillStyle = 'rgba(251,248,242,0.06)'; g.fillRect(306 + Math.round(Math.sin(t) * 2), 84, 6, 78);
      R(g, 0, 0, 0, 0, P.ink);
    },
    hotspots: [
      { id: 'shelves', x: 38, y: 52, w: 210, h: 160 },
      { id: 'note_pharm', x: 258, y: 90, w: 28, h: 26 },
      { id: 'fridge', x: 298, y: 74, w: 60, h: 138 },
      { id: 'scale', x: 384, y: 136, w: 36, h: 28 },
      { id: 'exit_corridor', x: 0, y: 130, w: 18, h: 84, act: 'go', to: 'corridor', at: 198, label: 'r_corridor' },
    ],
  },

  lounge: {
    floor: [24, 456], lights: [140, 340], music: 'clinic',
    draw(g, st) {
      shell(g, { id:'lounge',wall: P.milk,wains: P.gray2, floorA: P.gray2, floorB: P.gray3 });
      slab(g,28,222,128,22,P.red3,P.rose,P.red2);
      for(let x=31;x<153;x+=4){R(g,x,226,2,1,P.rose);R(g,x,239,2,1,P.rose);}
      K.calendar(g, 40, 62);
      K.sofa(g, 26, 211, 126); K.cushion(g, 44, 178);
      K.coffeeTable(g, 168, 211, 54);
      K.pillBottle(g, 182, 181); K.pillCap(g, 208, 176);
      K.tvStand(g, 236, 60, 56, 40);
      K.vending(g, 316, 211, 60, 136);
      K.arcade(g, 398, 211, 50, 126);
      R(g, 0, 132, 14, 80, P.ink); R(g, 2, 134, 10, 76, P.gray2);
    },
    anim(g, t, st) {
      lights(g, t, this.lights, 0);
      for (let i = 0; i < 60; i++) R(g, 238 + ((i * 23 + Math.floor(t * 24) * 13) % 52), 62 + ((i * 7 + Math.floor(t * 24) * 5) % 36), 2, 1, i % 4 ? P.ash2 : P.gray2);
      // vending glow
      g.fillStyle = `rgba(236,179,178,${0.05 + Math.sin(t * 2) * 0.03})`; g.fillRect(310, 70, 72, 150);
      // arcade attract
      const k = Math.floor(t * 4) % 4; R(g, 404, 103, 38, 32, P.ink2); R(g, 410 + k * 7, 114, 6, 6, P.red); R(g, 408, 128, 30, 1, P.ash); if (Math.floor(t * 2) % 2) R(g, 414, 106, 18, 2, P.milk3);
      // Tsubu peeking from the bottle
      drawTsubu(g, 195, 163 - Math.max(0, Math.round(Math.sin(t * 1.3) * 4)), { mood: st.tsubuMood || 'normal', t, s: 1, hat: st.tsubuHat, acc: null });
      K.pillBottle(g, 182, 181);
    },
    hotspots: [
      { id: 'calendar', x: 36, y: 58, w: 42, h: 48 },
      { id: 'couch', x: 26, y: 150, w: 126, h: 50 },
      { id: 'tsubu_home', x: 176, y: 130, w: 38, h: 54, act: 'tsubu', label: 'tsubu' },
      { id: 'tv_static', x: 232, y: 56, w: 64, h: 48 },
      { id: 'vending', x: 312, y: 70, w: 68, h: 142, act: 'shop' },
      { id: 'arcade', x: 394, y: 80, w: 58, h: 132, act: 'arcade' },
      { id: 'exit_corridor', x: 0, y: 130, w: 18, h: 84, act: 'go', to: 'corridor', at: 264, label: 'r_corridor' },
    ],
  },

  storage: {
    floor: [24, 456], lights: [120, 330], music: 'clinic',
    draw(g, st) {
      shell(g, { id:'storage',wall: P.gray3,wains: P.gray2, floorA: P.gray2, floorB: P.gray, stripe: P.ash, dark: 0.12 });
      K.metalShelf(g, 36, 211, 116, 92);
      K.cardboard(g, 40, 211, 44, 40); K.cardboard(g, 86, 211, 34, 30); K.cardboard(g, 44, 171, 36, 30, false); K.cardboard(g, 122, 211, 26, 24, false);
      K.cardboard(g, 90, 148, 40, 26); K.cardboard(g, 46, 117, 30, 22, false);
      K.lostFound(g, 170, 211);
      K.mopBucket(g, 238, 211);
      K.stairsDown(g, 290, 211, st.night >= 3);
      if (st.night >= 4) K.ladder(g, 392, 211, 42); else K.hatchClosed(g, 390, 211);
      R(g, 0, 132, 14, 80, P.ink); R(g, 2, 134, 10, 76, P.gray2);
    },
    anim(g, t, st) {
      lights(g, t, this.lights, 1);
      if (st.longPress > 0) { const r = st.longPress * 26; g.fillStyle = 'rgba(179,40,58,0.25)'; g.fillRect(193 - r / 2, 176, r, 2); }
    },
    hotspots: [
      { id: 'boxes', x: 38, y: 136, w: 112, h: 76 },
      { id: 'lost_found', x: 166, y: 156, w: 54, h: 56, act: 'lostfound' },
      { id: 'mop', x: 236, y: 118, w: 30, h: 94 },
      { id: 'stairs_down', x: 286, y: 146, w: 68, h: 66, act: 'stairs' },
      { id: 'ladder', x: 384, y: 34, w: 42, h: 178, act: 'ladder' },
      { id: 'exit_corridor', x: 0, y: 130, w: 18, h: 84, act: 'go', to: 'corridor', at: 330, label: 'r_corridor' },
    ],
  },

  records: {
    floor: [24, 456], lights: [240], music: 'dialog',
    draw(g, st) {
      shell(g, { id:'records',wall: P.gray2,wains: P.ash2, floorA: P.ash2, floorB: P.gray, stripe: P.red3, dark: 0.35 });
      for (let c = 0; c < 4; c++) K.fileCabinet(g, 60 + c * 90, 211, 70, 140);
      K.shadow(g, 398, 211, 64);
      R(g, 398, 158, 64, 4, P.ink); R(g, 399, 159, 62, 1, P.ash2);
      K.box(g, 400, 162, 60, 22, P.ash, P.ash2, P.ink3); R(g, 422, 170, 16, 2, P.ink);
      R(g, 402, 184, 3, 27, P.ink); R(g, 455, 184, 3, 27, P.ink);
      K.fileStack(g, 403, 158, 6); K.deskLamp(g, 440, 158);
      R(g, 0, 132, 14, 80, P.ink); R(g, 2, 134, 10, 76, P.gray2);
    },
    anim(g, t, st) {
      lights(g, t, this.lights, 1);
      g.fillStyle = `rgba(236,179,178,${0.12 + Math.sin(t * 3) * 0.03})`; g.beginPath(); g.moveTo(441, 124); g.lineTo(452, 124); g.lineTo(476, 211); g.lineTo(404, 211); g.fill();
    },
    hotspots: [
      { id: 'files', x: 396, y: 136, w: 68, h: 76 },
      { id: 'cabinet', x: 58, y: 68, w: 344, h: 144 },
      { id: 'lamp', x: 416, y: 104, w: 30, h: 22 },
      { id: 'exit_storage', x: 0, y: 130, w: 18, h: 84, act: 'go', to: 'storage', at: 320, label: 'r_storage' },
    ],
  },

  rooftop: {
    floor: [24, 456], lights: [], music: 'roof',
    draw(g, st) {
      // night sky — always the same minute before dawn
      skyline(g);
      R(g, 0, 210, 480, 60, P.ash); for (let x = 0; x < 480; x += 24) R(g, x, 210, 1, 60, P.ash2);
      K.waterTank(g, 404, 205);
      R(g, 0, 176, 480, 2, P.ink); R(g, 0, 177, 480, 1, P.ash2); for (let x = 4; x < 480; x += 12) R(g, x, 178, 2, 32, P.ink); R(g, 0, 196, 480, 1, P.ink);
      K.bench(g, 300, 213, 64);
      K.roofDoor(g, 16, 212);
    },
    anim(g, t) {
      for(let i=0;i<12;i++){const x=(i*73+Math.floor(t*8))%490-5,y=42+i*23%101;R(g,x,y,i%3?1:3,1,i%3?P.ash2:P.rose2);}
    },
    hotspots: [
      { id: 'railing', x: 80, y: 170, w: 200, h: 42 },
      { id: 'sky', x: 80, y: 30, w: 360, h: 130 },
      { id: 'bench', x: 296, y: 190, w: 72, h: 24 },
      { id: 'exit_storage', x: 18, y: 118, w: 44, h: 94, act: 'go', to: 'storage', at: 400, label: 'r_storage' },
    ],
  },
};
export const ROOM_ORDER = ['reception', 'corridor', 'office', 'ward', 'pharmacy', 'lounge', 'storage', 'records', 'rooftop'];
