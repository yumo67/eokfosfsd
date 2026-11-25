// Tiny software rasterizer: low-poly 3D models rendered into a low-res pixel buffer with palette ramps + outline.
import { P } from '../core/palette.js';

const hex = c => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const RAMPS = {
  milk: [P.milk3, P.milk2, P.milk, P.gray3, P.gray2].map(hex),
  red: [P.rose, P.red, P.red2, P.red3, P.red3].map(hex),
  ink: [P.ash2, P.ash, P.ink3, P.ink2, P.ink].map(hex),
  gray: [P.gray3, P.gray2, P.gray, P.ash2, P.ash].map(hex),
  rose: [P.rose2, P.rose, P.red, P.red2, P.red2].map(hex),
};
const OUT = hex(P.ink);

// ---------- geometry builders: tri = [v0,v1,v2, ramp]
function lathe(profile, seg, ramp, y0 = 0) {
  const tris = [];
  for (let i = 0; i < seg; i++) {
    const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
    for (let j = 0; j < profile.length - 1; j++) {
      const [r0, h0] = profile[j], [r1, h1] = profile[j + 1];
      const rp = typeof ramp === 'function' ? ramp(j, i) : ramp;
      const p = (r, hh, a) => [Math.cos(a) * r, hh + y0, Math.sin(a) * r];
      const A = p(r0, h0, a0), B = p(r0, h0, a1), C = p(r1, h1, a1), D = p(r1, h1, a0);
      if (r0 > 0) tris.push([A, B, C, rp]);
      if (r1 > 0) tris.push([A, C, D, rp]);
    }
  }
  return tris;
}
function extrude(poly, depth, ramp, ox = 0, oy = 0, oz = 0) {
  const tris = []; const d = depth / 2;
  const f = (x, y, z) => [x + ox, y + oy, z + oz];
  // caps (fan)
  for (let i = 1; i < poly.length - 1; i++) {
    tris.push([f(poly[0][0], poly[0][1], d), f(poly[i][0], poly[i][1], d), f(poly[i + 1][0], poly[i + 1][1], d), ramp]);
    tris.push([f(poly[0][0], poly[0][1], -d), f(poly[i + 1][0], poly[i + 1][1], -d), f(poly[i][0], poly[i][1], -d), ramp]);
  }
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    tris.push([f(a[0], a[1], d), f(b[0], b[1], -d), f(b[0], b[1], d), ramp]);
    tris.push([f(a[0], a[1], d), f(a[0], a[1], -d), f(b[0], b[1], -d), ramp]);
  }
  return tris;
}
const rectP = (w, h, x = 0, y = 0) => [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]];
const box = (w, h, d, ramp, x = 0, y = 0, z = 0) => extrude(rectP(w, h), d, ramp, x, y, z);
const circleP = (r, n = 10, cx = 0, cy = 0) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * Math.PI * 2) * r, cy + Math.sin(i / n * Math.PI * 2) * r]);
const sphere = (r, ramp, seg = 8, y = 0) => lathe(Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + i / 6 * Math.PI; return [Math.cos(a) * r, Math.sin(a) * r]; }), seg, ramp, y);
function torus(R, r, ramp, seg = 12, sides = 6, tilt = true) {
  const tris = [];
  for (let i = 0; i < seg; i++) for (let j = 0; j < sides; j++) {
    const pt = (a, b) => { const x = (R + r * Math.cos(b)) * Math.cos(a), y = (R + r * Math.cos(b)) * Math.sin(a), z = r * Math.sin(b); return tilt ? [x, y, z] : [x, z, y]; };
    const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2, b0 = j / sides * Math.PI * 2, b1 = (j + 1) / sides * Math.PI * 2;
    tris.push([pt(a0, b0), pt(a1, b0), pt(a1, b1), ramp], [pt(a0, b0), pt(a1, b1), pt(a0, b1), ramp]);
  }
  return tris;
}
const crossShape = (s, t, x = 0, y = 0) => [[x - t, y - s], [x + t, y - s], [x + t, y - t], [x + s, y - t], [x + s, y + t], [x + t, y + t], [x + t, y + s], [x - t, y + s], [x - t, y + t], [x - s, y + t], [x - s, y - t], [x - t, y - t]];

const MODELS = {
  onigiri: () => [...extrude([[0, -1], [0.95, 0.75], [-0.95, 0.75]], 0.6, 'milk'), ...box(0.7, 0.55, 0.66, 'ink', 0, 0.5)],
  pudding: () => [...lathe([[0, 0.7], [0.75, 0.7], [0.55, -0.2], [0, -0.2]], 10, 'milk'), ...lathe([[0, -0.2], [0.55, -0.2], [0.45, -0.45], [0, -0.45]], 10, 'red'), ...lathe([[0, 0.8], [0.95, 0.8], [0.95, 0.7], [0, 0.7]], 10, 'gray')],
  candy: () => [...sphere(0.5, 'red', 8), ...extrude([[0.45, 0], [1.05, -0.4], [1.05, 0.4]], 0.15, 'rose'), ...extrude([[-0.45, 0], [-1.05, 0.4], [-1.05, -0.4]], 0.15, 'rose')],
  bottle: () => lathe([[0, 1], [0.55, 1], [0.6, 0.9], [0.6, -0.2], [0.3, -0.5], [0.3, -0.8], [0.35, -0.85], [0.35, -1], [0, -1]], 10, (j) => j === 3 ? 'red' : (j >= 5 ? 'gray' : 'milk')),
  cake: () => [...extrude([[-0.9, 0.6], [0.9, 0.6], [0.9, -0.2], [-0.9, 0.6]], 0.9, 'milk'), ...extrude([[-0.9, 0.62], [0.9, -0.18], [0.9, -0.35], [-0.9, 0.45]], 0.92, 'rose'), ...sphere(0.22, 'red', 6, -0.45).map(t => t.map((v, i) => i < 3 ? [v[0] + 0.5, v[1], v[2]] : v))],
  pill: () => [...lathe([[0, -0.9], [0.25, -0.75], [0.35, -0.4], [0.35, 0], [0, 0]], 8, 'red'), ...lathe([[0, 0], [0.35, 0], [0.35, 0.4], [0.25, 0.75], [0, 0.9]], 8, 'milk')],
  capsule: () => [...lathe([[0, -1], [0.3, -0.85], [0.42, -0.45], [0.42, 0], [0, 0]], 8, 'rose'), ...lathe([[0, 0], [0.42, 0], [0.42, 0.45], [0.3, 0.85], [0, 1]], 8, 'red')],
  box: () => [...box(1.5, 1.0, 1.0, 'milk'), ...box(0.4, 1.02, 1.02, 'red')],
  ball: () => [...sphere(0.85, (j, i) => (i + j) % 3 === 0 ? 'rose' : 'red', 10)],
  yarn: () => [...sphere(0.8, 'red', 10), ...torus(0.82, 0.06, 'rose', 12, 3, false), ...torus(0.82, 0.06, 'red2' in RAMPS ? 'red' : 'rose', 12, 3, true)],
  bell: () => [...lathe([[0, -0.9], [0.2, -0.85], [0.45, -0.5], [0.55, 0.3], [0.8, 0.6], [0.8, 0.7], [0, 0.7]], 10, 'gray'), ...torus(0.18, 0.06, 'ink', 8, 4, true).map(t => t.map((v, i) => i < 3 ? [v[0], v[1] - 1.05, v[2]] : v))],
  cap: () => [...extrude([[-1, 0.4], [1, 0.4], [0.8, -0.6], [-0.8, -0.6]], 0.8, 'milk'), ...extrude(crossShape(0.3, 0.1, 0, -0.1), 0.84, 'red')],
  ribbon: () => [...extrude([[0, 0], [-1, -0.6], [-1, 0.6]], 0.2, 'red'), ...extrude([[0, 0], [1, 0.6], [1, -0.6]], 0.2, 'red'), ...box(0.3, 0.35, 0.3, 'rose')],
  leaf: () => [...extrude([[0, -1], [0.5, -0.4], [0.45, 0.4], [0, 1], [-0.45, 0.4], [-0.5, -0.4]], 0.12, 'ink'), ...box(0.06, 1.6, 0.16, 'gray')],
  card: () => [...box(1.6, 1.1, 0.08, 'milk'), ...box(1.6, 0.25, 0.1, 'red', 0, -0.35)],
  crown: () => [...lathe([[0.7, 0.4], [0.7, -0.1], [0.62, -0.1], [0.62, 0.4]], 10, 'ink'), ...Array.from({ length: 5 }, (_, i) => { const a = i / 5 * Math.PI * 2; return extrude([[-0.15, 0], [0.15, 0], [0, -0.5]], 0.12, 'ink', Math.cos(a) * 0.66, -0.1, Math.sin(a) * 0.66); }).flat(), ...sphere(0.12, 'red', 6, -0.15)],
  flashlight: () => lathe([[0, -1], [0.45, -1], [0.45, -0.4], [0.28, -0.1], [0.28, 1], [0, 1]], 10, (j) => j === 0 ? 'milk' : (j === 4 ? 'red' : 'ink')).map(t => t.map((v, i) => i < 3 ? [v[1], v[0], v[2]] : v)),
  stethoscope: () => [...torus(0.6, 0.07, 'gray', 14, 4, true).map(t => t.map((v, i) => i < 3 ? [v[0], v[1] - 0.2, v[2]] : v)), ...lathe([[0, 0.7], [0.35, 0.7], [0.35, 0.95], [0, 0.95]], 10, 'gray'), ...lathe([[0, 0.6], [0.3, 0.6], [0.3, 0.7], [0, 0.7]], 10, 'red')],
  cup: () => [...lathe([[0, 0.8], [0.6, 0.8], [0.6, -0.6], [0.5, -0.6], [0.5, 0.65], [0, 0.65]], 10, (j) => j === 1 ? 'milk' : 'ink'), ...torus(0.25, 0.07, 'milk', 8, 4, true).map(t => t.map((v, i) => i < 3 ? [v[0] + 0.7, v[1] + 0.05, v[2]] : v))],
  keybow: () => [...torus(0.45, 0.13, 'ink', 10, 4, true).map(tt => tt.map((v, i) => i < 3 ? [v[0], v[1] - 0.3, v[2]] : v)), ...box(0.25, 0.4, 0.2, 'red', 0, 0.3)],
  keyblade: () => [...box(0.2, 1.5, 0.18, 'ink', 0, 0), ...box(0.35, 0.18, 0.18, 'ink', 0.25, 0.55), ...box(0.25, 0.18, 0.18, 'ink', 0.2, 0.3)],
  key: () => [...torus(0.38, 0.11, 'ink', 10, 4, true).map(tt => tt.map((v, i) => i < 3 ? [v[0], v[1] - 0.6, v[2]] : v)), ...box(0.18, 1.3, 0.16, 'ink', 0, 0.35), ...box(0.32, 0.16, 0.16, 'ink', 0.22, 0.85), ...box(0.22, 0.16, 0.16, 'ink', 0.18, 0.6), ...box(0.2, 0.2, 0.2, 'red', 0, -0.15)],
  watch: () => [...lathe([[0, -0.12], [0.6, -0.12], [0.6, 0.12], [0, 0.12]], 12, (j) => j === 0 ? 'milk' : 'gray').map(t => t.map((v, i) => i < 3 ? [v[0], v[2], v[1]] : v)), ...box(0.5, 1.9, 0.08, 'ink', 0, 0, 0.12)],
  figure: () => [...lathe([[0, 0.8], [0.6, 0.75], [0.8, 0.3], [0.75, -0.3], [0.45, -0.7], [0, -0.78]], 10, 'milk'), ...extrude(crossShape(0.25, 0.08, 0, -0.35), 0.3, 'red', 0, 0, 0.62)],
  coin: () => lathe([[0, -0.1], [0.8, -0.1], [0.8, 0.1], [0, 0.1]], 12, (j) => j === 1 ? 'red' : 'rose').map(t => t.map((v, i) => i < 3 ? [v[0], v[2], v[1]] : v)),
  nothing: () => [],
};
const cache = {};
export function model(id) { return cache[id] ||= (MODELS[id] || MODELS.box)(); }

// Render into ImageData-sized buffer (N x N), returns ImageData
export function render(id, N, rotY, rotX = 0.35, zoom = 1) {
  const tris = model(id);
  const img = new ImageData(N, N); const px = img.data; const zb = new Float32Array(N * N).fill(1e9);
  const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
  const L = [-0.5, -0.7, -0.6]; const ll = Math.hypot(...L); L[0] /= ll; L[1] /= ll; L[2] /= ll;
  const sc = N * 0.33 * zoom;
  const tr = v => { let x = v[0] * cy + v[2] * sy, z = -v[0] * sy + v[2] * cy, y = v[1]; const y2 = y * cx - z * sx; const z2 = y * sx + z * cx; return [x, y2, z2 + 4]; };
  for (const t of tris) {
    const a = tr(t[0]), b = tr(t[1]), c = tr(t[2]);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
    const proj = p => [N / 2 + p[0] / p[2] * 4 * sc, N / 2 + p[1] / p[2] * 4 * sc, p[2]];
    const A = proj(a), B = proj(b), C = proj(c);
    const area = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    if (Math.abs(area) < 0.01) continue;
    let lit = Math.abs(nx * L[0] + ny * L[1] + nz * L[2]);
    const ramp = RAMPS[t[3]] || RAMPS.milk;
    const idx = Math.min(4, Math.max(0, Math.floor((1 - lit) * 4.2)));
    const col = ramp[idx];
    const minX = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0]))), maxX = Math.min(N - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
    const minY = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1]))), maxY = Math.min(N - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
    for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
      const pxl = x + 0.5, pyl = y + 0.5;
      const w0 = ((B[0] - pxl) * (C[1] - pyl) - (B[1] - pyl) * (C[0] - pxl)) / area;
      const w1 = ((C[0] - pxl) * (A[1] - pyl) - (C[1] - pyl) * (A[0] - pxl)) / area;
      const w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const z = w0 * A[2] + w1 * B[2] + w2 * C[2];
      const k = y * N + x; if (z >= zb[k]) continue; zb[k] = z;
      px[k * 4] = col[0]; px[k * 4 + 1] = col[1]; px[k * 4 + 2] = col[2]; px[k * 4 + 3] = 255;
    }
  }
  // outline pass
  const copy = new Uint8ClampedArray(px);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const k = (y * N + x) * 4; if (copy[k + 3]) continue;
    const n = (dx, dy) => { const xx = x + dx, yy = y + dy; return xx >= 0 && yy >= 0 && xx < N && yy < N && copy[((yy * N + xx) * 4) + 3]; };
    if (n(1, 0) || n(-1, 0) || n(0, 1) || n(0, -1)) { px[k] = OUT[0]; px[k + 1] = OUT[1]; px[k + 2] = OUT[2]; px[k + 3] = 255; }
  }
  return img;
}

// Draw a model into a target canvas element (pixelated)
const tmp = document.createElement('canvas');
export function drawModel(cv, id, rotY = 0.7, N = 40, rotX = 0.35, zoom = 1) {
  tmp.width = N; tmp.height = N;
  const tg = tmp.getContext('2d'); tg.putImageData(render(id, N, rotY, rotX, zoom), 0, 0);
  const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.clearRect(0, 0, cv.width, cv.height);
  g.drawImage(tmp, 0, 0, cv.width, cv.height);
}
export function icon(id, size = 48, N = 32) {
  const cv = document.createElement('canvas'); cv.width = size; cv.height = size; drawModel(cv, id, 0.7, N); return cv;
}
