// Autosave: server-side save slots per visitor (the preview sandbox blocks browser storage),
// with checksum, versioning, migration, backups and an offline export/import code fallback.
import { S, setState, freshState, bus, SAVE_VERSION } from './state.js';

const API = (window.__API__ && !window.__API__.startsWith('__PORT_')) ? window.__API__.replace(/\/$/,'') : (window.__API_LOCAL__ || '');
let snapshot = '', backup = '';
let online = false, timer = null, pending = false, lastJson = '';
export const saveInfo = { online: false, lastSave: 0, error: null, restored: false };

function hash(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16); }

function migrate(d) {
  const base = freshState();
  if (!d || typeof d !== 'object') return base;
  // deep-merge missing keys from fresh state (forward compatible)
  const merge = (a, b) => { for (const k in b) { if (a[k] === undefined) a[k] = b[k]; else if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && typeof a[k] === 'object') merge(a[k], b[k]); } return a; };
  merge(d, base);
  if ((d.v || 1) < 3) { d.log = d.log || []; }
  d.v = SAVE_VERSION;
  return d;
}

function pack() { S.lastSeen = Date.now(); const body = JSON.stringify(S); return JSON.stringify({ v: SAVE_VERSION, sum: hash(body), body }); }
function unpack(txt) {
  const o = JSON.parse(txt); if (!o || !o.body) throw new Error('empty');
  if (hash(o.body) !== o.sum) throw new Error('checksum');
  return migrate(JSON.parse(o.body));
}

async function req(path, opt = {}) {
  const r = await fetch(API + path, { credentials: 'same-origin', ...opt, headers: { 'Content-Type': 'application/json' } });
  if (!r.ok && r.status !== 404) throw new Error('http ' + r.status);
  return r;
}

export async function loadGame() {
  if (!API) return false;
  try {
    const r = await req('/api/save');
    online = true; saveInfo.online = true;
    if (r.status === 404) return false;
    const txt = await r.text();
    try { setState(unpack(txt)); return true; }
    catch (e) {
      // corrupted -> restore last valid backup
      const rb = await req('/api/save?backup=1');
      if (rb.status === 200) {
        const list = await rb.json();
        for (const b of list) { try { setState(unpack(b)); saveInfo.restored = true; return true; } catch (e2) { } }
      }
      return false;
    }
  } catch (e) {
    online = false; saveInfo.online = false; saveInfo.error = 'offline'; return false;
  }
}

export function scheduleSave(delay = 1200) {
  pending = true; clearTimeout(timer); timer = setTimeout(saveNow, delay);
}
export async function saveNow() {
  pending = false; const data = pack(); const body = JSON.parse(data).body;
  if (body === lastJson) return;
  if (snapshot && body !== lastJson) backup = snapshot;
  snapshot = data;
  if (!online) {
    lastJson = body;
    return;
  }
  bus.emit('save:start');
  try {
    await req('/api/save', { method: 'PUT', body: data });
    lastJson = body; saveInfo.lastSave = Date.now(); saveInfo.error = null; bus.emit('save:end', { ok: true });
  } catch (e) { saveInfo.error = String(e.message || e); bus.emit('save:end', { ok: false }); }
}
export async function wipeSave() {
  // the page addressed to "myself, next night" survives a new game
  const keepMemo = !!(S.inv?.door_memo || S.seen?.door_memo);
  const ns = freshState();
  ns.lang=S.lang;
  if (keepMemo) { ns.inv.door_memo = 1; ns.seen.door_memo = 1; ns.flags.memo_carried = 1; }
  setState(ns); lastJson = '';
  if (online) { try { await req('/api/save', { method: 'DELETE' }); } catch (e) { } }
  snapshot = ''; backup = '';
  await saveNow();
}
export async function restoreBackup() {
  if (!online) {
    try { if (!backup) return false; setState(unpack(backup)); await saveNow(); return true; } catch { return false; }
  }
  const rb = await req('/api/save?backup=1'); if (rb.status !== 200) return false;
  const list = await rb.json();
  for (const b of list.slice(1)) { try { setState(unpack(b)); await saveNow(); return true; } catch (e) { } }
  return false;
}
// offline transfer code
export function exportCode() { return btoa(unescape(encodeURIComponent(pack()))); }
export function importCode(code) {
  try { const s = unpack(decodeURIComponent(escape(atob(code.trim())))); setState(s); scheduleSave(10); return true; } catch (e) { return false; }
}
bus.on('dirty', () => scheduleSave());
window.addEventListener('pagehide', () => { if (pending) saveNow(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && pending) saveNow(); });
