// Hi-density pixel puppet atlas for all NPCs (drawn at 0.5 scale to match Emrys's crispness).
import { P } from './palette.js';

const C = {
  O: P.ink, k: P.ink2, K: P.ink3, a: P.ash, A: P.ash2,
  g: P.gray, G: P.gray2, t: P.gray3, h: P.milk, w: P.milk2, s: P.milk3,
  r: P.red, R: P.red2, d: P.red3, p: P.rose, q: P.rose2,
};

function drawGrid(g, rows, ox, oy) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      g.fillStyle = C[ch] || ch;
      g.fillRect(ox + x, oy + y, 1, 1);
    }
  }
}

function q(g, x, y, w, h, c) { g.fillStyle = C[c] || c; g.fillRect(x, y, w, h); }
function box(g, x, y, w, h, c) { q(g, x, y, w, h, 'O'); q(g, x + 1, y + 1, w - 2, h - 2, c); }

// ── RIN: cheerful nurse with cap, dark bob + white streaks, open white coat, crimson pouch & armband ──
const RIN_HEAD = [
  '..........OOOOOOOOOO..........',
  '.........OssssssssssO.........',
  '........OssssrrrrssssO........',
  '........OssssrrrrssssO........',
  '........OsssrrrrrrsssO........',
  '.......OOkkkkkkkkkkkkOO.......',
  '.....OOkkkkkkkkkkkkkkkkOO.....',
  '....OkkkkkkksskksskkkkkkkO....',
  '...OkkkkkksssssssssskkkkkkO...',
  '..OkkhkkksssssssssssskkkhkkO..',
  '.OkkhkkOOssssssssssssOOkkhkkO.',
  '.OkhkkOsskOssssssssOsskOkkhkO.',
  '.OkhkOOsOOOsOssssOsOOOsOOkhkO.',
  'OkkhkOsOOOOOssssssOOOOOsOkhkkO',
  'OkkhkOsOOkOssssssssOOkOsOkhkkO',
  '.OkhkOskkOssssssssssOkkOsOhkO.',
  '.OkkhOssqssssssssssssqssOhkkO.',
  '..OkhOssssssOssssOssssssOhkO..',
  '..OkkOOssssssOOOOssssssOOkkO..',
  '...OkkhOOssssssssssssOOhkkO...',
  '....OOOkkOOtsssssstOOkkOOO....',
];

// ── ODA: silver-gray hair with low bun & crimson hairpin, round glasses, dusty-rose cardigan, scarf ──
const ODA_HEAD = [
  '.........OOOOOOOOOO...........',
  '.......OOggggGGggggOO.........',
  '......OgggGGGGGGGGgggO........',
  '.....OggGGssssssssGGggO.......',
  '....OgGGssssssssssssGGgO......',
  '...OgGssOssssssssssOssGgO.....',
  '..OgGsOsOOOOssssOOOOsOsGgO....',
  '.RROgsOsOkkOssssOkkOsOsggO....',
  'OggOgsOsOOOOssssOOOOsOsggO....',
  'OggOGsOssssssssssssssOsggO....',
  '.OOOGsOssssqssssqssssOsGO.....',
  '....GsOssssssOOssssssOsG......',
  '.....GOsssssOggOsssssOG.......',
  '......OOtsssssssssstOO........',
  '........OOOssssssOOO..........',
];

// ── KAI: spiky dark hair, cheek cross bandaid, big curious eyes ──
const KAI_HEAD = [
  '......OO....OOO...OO..........',
  '.....OkkO..OkkkO.OkkO.........',
  '....OkkkkOOkkkkkOkkkkO........',
  '...OkkkkkkkkkkkkkkkkkkO.......',
  '..OkkkkkkkkkkkkkkkkkkkkO......',
  '..OkkkkkkOkkkkkkOkkkkkkO......',
  '.OkkkkkkOsOkkkkOsOkkkkkkO.....',
  '.OkkkkkOsssOkkOsssOkkkkkO.....',
  '..OkkkOssssssssssssOkkkO......',
  '..OkOOsOOOOssssOOOOsOOkO......',
  '...OOsOOkOssssssOOkOsOO.......',
  '...OOsOkksssssssskkOsO........',
  '....OsOqqssssssssssOsO........',
  '....OssqssOsOssssssOsO........',
  '....OOsssssOssssssOO..........',
  '.....OOssssssssssOO...........',
  '.......OOssssssOO.............',
];

// ── SATO: slicked-back ash-gray hair, sharp rectangular glasses, stern face ──
const SATO_HEAD = [
  '.......OOOOOOOOOOOO...........',
  '......OAAggggggggAAO..........',
  '.....OAkkkkggggggkkkkO........',
  '....OAAssssssssssssAAO........',
  '....OAOsOOOOssOOOOsOAO........',
  '....OAOsOkkOOsOkkOsOAO........',
  '....OGsOssssssOssssOG.........',
  '.....GsOssssAAsssssOG.........',
  '.....GsOssssOOsssssOG.........',
  '......OssssssssssssO..........',
  '......OOtssssssssstO..........',
  '.......OOssssssssOO...........',
];

// ── UNKNOWN: long messy ink hair obscuring upper face, faint crimson eyes ──
const UNK_HEAD = [
  '......OOOOOOOOOOOOOO..........',
  '.....OkkkkkkkkkkkkkkO.........',
  '....OkkkkkkkkkkkkkkkkO........',
  '...OkkkkkkkkkkkkkkkkkkO.......',
  '..OkkkkkkkkkkkkkkkkkkkkO......',
  '..OkkkkkkOkkkkkkOkkkkkkO......',
  '.OkkkkkkdkkkkkkkkdkkkkkkO.....',
  '.OkkkkkOrkOkkkkOkrOkkkkkO.....',
  '.OkkkkkOkkOkkkkOkkOkkkkkO.....',
  '.OkkkkkOssssssssssOkkkkkO.....',
  '..OkkkOOssssssssssOOkkkO......',
  '..OkkO..OOtssssstOO..OkkO.....',
  '...OO.....OOOOOOO.....OO......',
];

export function patient(g, who, x, y, { blink = false, flip = false, bob = 0, time = 0, pose = 'stand', portrait = false } = {}) {
  if (!['rin', 'oda', 'kai', 'sato', 'unknown'].includes(who)) return;
  g.save();
  g.translate(x, y);
  if (flip) g.scale(-1, 1);
  if (portrait) { g.scale(2, 2); g.translate(0, 18); }
  g.scale(0.5, 0.5);
  if (pose === 'seated') g.translate(0, 10);

  const sway = Math.round(Math.sin(time * 1.4 + who.length) * 0.6);
  const gesture = Math.sin(time * 1.6 + who.length * 2) > 0.82;
  const by = bob * 2;

  if (!portrait && pose !== 'seated') {
    g.fillStyle = 'rgba(18,16,18,.26)';
    g.fillRect(-12, -2, 24, 3);
    g.fillRect(-9, 1, 18, 1);
  }

  if (who === 'rin') {
    // Legs & black loafers
    box(g, -6, -12 + by, 5, 11, 'k'); box(g, 1, -12 + by, 5, 11, 'k');
    q(g, -7, -3 + by, 6, 3, 'O'); q(g, 1, -3 + by, 6, 3, 'O');
    q(g, -6, -3 + by, 4, 1, 'a'); q(g, 2, -3 + by, 4, 1, 'a');
    // Open white coat skirt
    box(g, -9, -22 + by, 18, 12, 'w');
    q(g, -3, -21 + by, 6, 11, 'k'); // dark turtleneck/pants center
    // Crimson waist pouch
    q(g, -9, -23 + by, 18, 3, 'O'); q(g, -8, -22 + by, 16, 1, 'R');
    box(g, 2, -24 + by, 8, 7, 'R'); q(g, 5, -22 + by, 2, 3, 's'); q(g, 4, -21 + by, 4, 1, 's');
    // Torso
    box(g, -8, -36 + by, 16, 14, 'w');
    box(g, -4, -36 + by, 8, 13, 'k');
    // Arms (left on hip, right waving/gesturing)
    box(g, -13, -34 + by, 5, 12, 'w'); q(g, -12, -22 + by, 3, 3, 's');
    box(g, 8, -34 + by + (gesture ? -2 : 0), 5, 14, 'w');
    q(g, 8, -28 + by + (gesture ? -2 : 0), 5, 3, 'R'); // crimson armband
    q(g, 10, -27 + by + (gesture ? -2 : 0), 1, 1, 's');
    q(g, 9, -20 + by + (gesture ? -2 : 0), 3, 3, 's');
    // Head
    drawGrid(g, RIN_HEAD, -15, -56 + by);
    if (blink) {
      q(g, -7, -43 + by, 4, 2, 's'); q(g, 3, -43 + by, 4, 2, 's');
      q(g, -7, -42 + by, 4, 1, 'O'); q(g, 3, -42 + by, 4, 1, 'O');
    }
  } else if (who === 'oda') {
    // Skirt & stockings & shoes
    box(g, -5, -10 + by, 4, 9, 's'); box(g, 1, -10 + by, 4, 9, 's');
    q(g, -6, -3 + by, 5, 3, 'O'); q(g, 1, -3 + by, 5, 3, 'O');
    box(g, -9, -22 + by, 18, 13, 'K');
    // Cardigan + blouse
    box(g, -10, -36 + by, 20, 15, 'p');
    q(g, -4, -35 + by, 8, 13, 'w');
    q(g, -9, -31 + by, 4, 1, 'R'); q(g, 5, -31 + by, 4, 1, 'R'); // knit pattern
    q(g, -9, -26 + by, 4, 1, 'R'); q(g, 5, -26 + by, 4, 1, 'R');
    // Knitting needles + long striped scarf
    box(g, -13, -34 + by, 4, 11, 'p'); box(g, 9, -34 + by, 4, 11, 'p');
    q(g, -9, -25 + by, 3, 2, 's'); q(g, 6, -25 + by, 3, 2, 's');
    box(g, 2, -26 + by, 6, 17, 'w');
    q(g, 4, -25 + by, 2, 13, 'R'); q(g, 3, -12 + by, 4, 2, 'R');
    q(g, -7, -28 + by, 14, 1, 'a'); // needle
    // Head
    drawGrid(g, ODA_HEAD, -15, -51 + by);
    if (blink) {
      q(g, -6, -44 + by, 3, 1, 'O'); q(g, 3, -44 + by, 3, 1, 'O');
    }
  } else if (who === 'kai') {
    // Shorter kid proportions + red sneakers
    box(g, -5, -10 + by, 4, 8, 'w'); box(g, 1, -10 + by, 4, 8, 'w');
    q(g, -6, -3 + by, 5, 3, 'O'); q(g, 1, -3 + by, 5, 3, 'O');
    q(g, -5, -2 + by, 3, 1, 'r'); q(g, 2, -2 + by, 3, 1, 'r');
    // Striped pajamas
    box(g, -8, -31 + by, 16, 22, 'w');
    for (let sx = -6; sx <= 5; sx += 3) q(g, sx, -30 + by, 1, 20, 'G');
    // Left arm + stitched gray bunny plushie under right arm
    box(g, -12, -29 + by + (gesture ? -2 : 0), 4, 10, 'w');
    q(g, -11, -19 + by + (gesture ? -2 : 0), 2, 3, 's');
    box(g, 8, -29 + by, 4, 10, 'w');
    box(g, 5, -23 + by, 6, 8, 'A'); // plushie body
    q(g, 6, -26 + by, 1, 3, 'O'); q(g, 9, -26 + by, 1, 3, 'O'); // bunny ears
    q(g, 6, -21 + by, 1, 1, 'O'); q(g, 9, -21 + by, 1, 1, 'O');
    // Head
    drawGrid(g, KAI_HEAD, -14, -47 + by);
    // Cheek bandaid
    q(g, -7, -34 + by, 2, 1, 's'); q(g, -6, -35 + by, 1, 3, 's');
    if (blink) {
      q(g, -6, -37 + by, 3, 1, 'O'); q(g, 3, -37 + by, 3, 1, 'O');
    }
  } else if (who === 'sato') {
    // Tall dark suit
    box(g, -6, -15 + by, 5, 14, 'k'); box(g, 1, -15 + by, 5, 14, 'k');
    q(g, -7, -3 + by, 6, 3, 'O'); q(g, 1, -3 + by, 6, 3, 'O');
    // Suit jacket + vest + white shirt + red tie
    box(g, -10, -40 + by, 20, 26, 'K');
    q(g, -3, -39 + by, 6, 12, 's');
    q(g, -1, -38 + by, 2, 11, 'r'); // crimson tie
    // Arms: right arm raised checking wristwatch!
    box(g, -14, -38 + by, 4, 16, 'K'); q(g, -13, -22 + by, 2, 3, 's');
    box(g, 9, -38 + by, 5, 10, 'K');
    box(g, 4, -32 + by, 9, 4, 'K'); // forearm across chest
    q(g, 5, -31 + by, 2, 2, 's');
    q(g, 7, -32 + by, 2, 3, 'G'); // wristwatch!
    // Head
    drawGrid(g, SATO_HEAD, -14, -52 + by);
    if (blink) {
      q(g, -6, -47 + by, 3, 1, 'O'); q(g, 2, -47 + by, 3, 1, 'O');
    }
  } else {
    // Unknown (Bed 4): pale hospital gown + bandaged neck/wrists + slippers
    box(g, -5, -12 + by, 4, 10, 's'); box(g, 1, -12 + by, 4, 10, 's');
    q(g, -6, -3 + by, 5, 3, 'O'); q(g, 1, -3 + by, 5, 3, 'O');
    q(g, -5, -2 + by, 3, 1, 'w'); q(g, 2, -2 + by, 3, 1, 'w');
    box(g, -9, -37 + by, 18, 27, 'w');
    for (let sx = -6; sx <= 6; sx += 4) q(g, sx, -36 + by, 1, 25, 'G');
    q(g, -3, -39 + by, 6, 3, 's'); // neck bandages
    box(g, -13, -35 + by, 4, 15, 'w'); box(g, 9, -35 + by, 4, 15, 'w');
    q(g, -12, -20 + by, 2, 3, 's'); q(g, 10, -20 + by, 2, 3, 's');
    drawGrid(g, UNK_HEAD, -15 + sway, -52 + by);
  }

  g.restore();
}
