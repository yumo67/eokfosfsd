// Procedural chiptune / lo-fi audio engine. All music is original and generated live.
const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
function freq(n) { // "A4", "C#5"
  const m = /^([A-G]#?)(-?\d)$/.exec(n); if (!m) return 0;
  const midi = (parseInt(m[2]) + 1) * 12 + NOTE[m[1]];
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Tracks: each voice is a list of steps (16th notes). '.' = rest, '-' = hold
const TRACKS = {
  menu: {
    bpm: 84, swing: 0.08, len: 64,
    lead: 'E5 . G5 . B5 - A5 . G5 . E5 . D5 - . . E5 . G5 . B5 - D6 . B5 . A5 - G5 - . . C5 . E5 . G5 - F#5 . E5 . D5 . B4 - . . C5 . D5 . E5 - G5 . F#5 - - - . . . .',
    bass: 'E3 - - - . . E3 . C3 - - - . . C3 . A2 - - - . . A2 . B2 - - - . . B2 . C3 - - - . . C3 . G2 - - - . . G2 . A2 - - - . . B2 . B2 - - - . . . .',
    pad: ['E4 G4 B4', 'C4 E4 G4', 'A3 C4 E4', 'B3 D#4 F#4'],
    box: true, hat: '..x...x...x...x.', kick: 'x.......x.......',
  },
  clinic: {
    bpm: 96, swing: 0.1, len: 64,
    lead: 'A4 . C5 . E5 . . . D5 . C5 . A4 - - . G4 . A4 . C5 . . . B4 - G4 - - - . . A4 . C5 . E5 . G5 . F5 . E5 . D5 - - . C5 . D5 . E5 . . . A4 - - - - - . .',
    bass: 'A2 . . A2 . . A2 . F2 . . F2 . . F2 . C3 . . C3 . . C3 . G2 . . G2 . . G2 . A2 . . A2 . . A2 . F2 . . F2 . . F2 . D2 . . D2 . . E2 . E2 . . E2 . . . .',
    pad: ['A3 C4 E4', 'F3 A3 C4', 'C4 E4 G4', 'G3 B3 D4'],
    box: false, hat: 'x.x.x.x.x.x.x.x.', kick: 'x...x...x...x...', snare: '....x.......x...',
  },
  game: {
    bpm: 138, swing: 0, len: 32,
    lead: 'C5 . E5 G5 . E5 C6 . B5 . G5 . A5 G5 E5 . F5 . A5 C6 . A5 F5 . G5 . B5 D6 . B5 G5 .',
    bass: 'C3 C3 . C3 . C3 C3 . E2 E2 . E2 . E2 E2 . F2 F2 . F2 . F2 F2 . G2 G2 . G2 . G2 B2 .',
    pad: null, box: false, hat: 'xxxxxxxxxxxxxxxx', kick: 'x...x...x...x...', snare: '....x.......x...',
  },
  dialog: {
    bpm: 72, swing: 0.12, len: 32,
    lead: 'E5 - - . . . B4 - - . D5 - C5 - - - A4 - - . . . C5 - B4 - - - - - - .',
    bass: 'A2 - - - - - - - F2 - - - - - - - C3 - - - - - - - E2 - - - - - - -',
    pad: ['A3 C4 E4', 'F3 A3 C4', 'C3 E3 G3', 'E3 G#3 B3'],
    box: true, hat: '........x.......', kick: null,
  },
  door: { ambient: true },
  roof: {
    bpm: 60, swing: 0, len: 32,
    lead: 'B4 - - - - - - - . . . . A4 - - - G4 - - - - - - - . . . . E4 - - -',
    bass: 'E2 - - - - - - - - - - - - - - - C2 - - - - - - - - - - - - - - -',
    pad: ['E3 G3 B3', 'C3 E3 G3'], box: true, hat: null, kick: null,
  },
};

class Audio {
  constructor() {
    this.ctx = null; this.vol = { music: 0.6, sfx: 0.7, voice: 0.6 };
    this.track = null; this.wanted = null; this.step = 0; this.nextTime = 0; this.timer = null;
    this.wrongness = 0; // 0..1 increases with story progress
    this.amb = null;
  }
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.9; this.master.connect(this.ctx.destination);
      this.mBus = this.ctx.createGain(); this.mBus.connect(this.master);
      this.sBus = this.ctx.createGain(); this.sBus.connect(this.master);
      this.vBus = this.ctx.createGain(); this.vBus.connect(this.master);
      // lo-fi: gentle lowpass on music
      this.lp = this.ctx.createBiquadFilter(); this.lp.type = 'lowpass'; this.lp.frequency.value = 3800;
      this.lp.connect(this.mBus);
      // echo send
      this.delay = this.ctx.createDelay(1); this.delay.delayTime.value = 0.32;
      this.fb = this.ctx.createGain(); this.fb.gain.value = 0.28;
      this.delay.connect(this.fb); this.fb.connect(this.delay); this.delay.connect(this.lp);
      this.noiseBuf = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.applyVol();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.wanted && !this.track) this.play(this.wanted);
  }
  setVol(v) { Object.assign(this.vol, v); this.applyVol(); }
  applyVol() {
    if (!this.ctx) return; const t = this.ctx.currentTime;
    this.mBus.gain.setTargetAtTime(this.vol.music * 0.5, t, 0.05);
    this.sBus.gain.setTargetAtTime(this.vol.sfx * 0.6, t, 0.02);
    this.vBus.gain.setTargetAtTime(this.vol.voice * 0.35, t, 0.02);
  }
  play(name) {
    this.wanted = name;
    if (!this.ctx) return;
    if (this.track === name) return;
    this.stopMusic();
    this.track = name;
    const tr = TRACKS[name]; if (!tr) return;
    if (tr.ambient) { this.startAmbient(); return; }
    this.tr = this.compile(tr); this.step = 0; this.nextTime = this.ctx.currentTime + 0.08;
    this.timer = setInterval(() => this.tick(), 25);
  }
  stopMusic() {
    if (this.timer) clearInterval(this.timer); this.timer = null; this.track = null;
    if (this.amb) { const t = this.ctx.currentTime; this.amb.g.gain.setTargetAtTime(0, t, 0.4); const a = this.amb; setTimeout(() => a.nodes.forEach(n => { try { n.stop(); } catch (e) { } }), 1500); this.amb = null; }
  }
  compile(tr) {
    const sp = s => s ? s.trim().split(/\s+/) : null;
    return { ...tr, leadA: sp(tr.lead), bassA: sp(tr.bass) };
  }
  tick() {
    const c = this.ctx; const tr = this.tr; if (!tr) return;
    const stepDur = 60 / tr.bpm / 4;
    while (this.nextTime < c.currentTime + 0.12) {
      const s = this.step % tr.len; const t = this.nextTime + ((s % 2) ? stepDur * tr.swing : 0);
      const ln = tr.leadA && tr.leadA[s % tr.leadA.length];
      if (ln && ln !== '.' && ln !== '-') {
        let f = freq(ln); let dur = stepDur;
        for (let k = s + 1; k < s + 8 && tr.leadA[k % tr.leadA.length] === '-'; k++) dur += stepDur;
        // the "wrong" note: rare detune / drop
        if (this.wrongness > 0 && Math.random() < this.wrongness * 0.05) f *= Math.pow(2, -0.55 / 12);
        if (!(this.wrongness > 0.4 && Math.random() < 0.02)) {
          if (tr.box) this.boxNote(f, t, dur * 1.6, 0.16); else this.pulse(f, t, dur * 0.9, 0.07, 0.25);
        }
      }
      const bn = tr.bassA && tr.bassA[s % tr.bassA.length];
      if (bn && bn !== '.' && bn !== '-') {
        let dur = stepDur; for (let k = s + 1; k < s + 16 && tr.bassA[k % tr.bassA.length] === '-'; k++) dur += stepDur;
        this.tri(freq(bn), t, dur * 0.95, 0.22);
      }
      if (tr.pad && s % 16 === 0) {
        const ch = tr.pad[Math.floor(s / 16) % tr.pad.length].split(' ');
        ch.forEach(n => this.pad(freq(n), t, stepDur * 16, 0.035));
      }
      const p16 = s % 16;
      if (tr.hat && tr.hat[p16] === 'x') this.noise(t, 0.03, 0.04, 7000);
      if (tr.kick && tr.kick[p16] === 'x') this.kick(t);
      if (tr.snare && tr.snare[p16] === 'x') this.noise(t, 0.09, 0.07, 2200);
      // vinyl crackle for lo-fi
      if (Math.random() < 0.15) this.noise(t, 0.004, 0.02, 9000, this.lp);
      this.nextTime += stepDur; this.step++;
    }
  }
  osc(type, f, t, dur, vol, dest, attack = 0.005, release = 0.06) {
    const c = this.ctx; const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.setValueAtTime(vol, t + Math.max(attack, dur - release));
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); g.connect(dest || this.lp); o.start(t); o.stop(t + dur + 0.02);
    return { o, g };
  }
  pulse(f, t, dur, vol, duty = 0.5) {
    const n = this.osc('square', f, t, dur, vol);
    const s = this.ctx.createGain(); s.gain.value = 0.25; n.g.connect(s); s.connect(this.delay);
  }
  tri(f, t, dur, vol) { this.osc('triangle', f, t, dur, vol); }
  pad(f, t, dur, vol) {
    const a = this.osc('sawtooth', f, t, dur, vol, this.lp, dur * 0.3, dur * 0.4);
    a.o.detune.value = (Math.random() - 0.5) * 12;
  }
  boxNote(f, t, dur, vol) {
    const a = this.osc('sine', f * 2, t, Math.min(dur, 0.9), vol, this.lp, 0.002, Math.min(dur, 0.9) - 0.01);
    a.g.gain.cancelScheduledValues(t); a.g.gain.setValueAtTime(vol, t); a.g.gain.exponentialRampToValueAtTime(0.0008, t + Math.min(dur, 0.9));
    const s = this.ctx.createGain(); s.gain.value = 0.4; a.g.connect(s); s.connect(this.delay);
  }
  noise(t, dur, vol, fc = 5000, dest) {
    const c = this.ctx; const src = c.createBufferSource(); src.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = fc;
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    src.connect(f); f.connect(g); g.connect(dest || this.lp); src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.02);
  }
  kick(t) {
    const c = this.ctx; const o = c.createOscillator(); const g = c.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g); g.connect(this.lp); o.start(t); o.stop(t + 0.2);
  }
  startAmbient() {
    const c = this.ctx; const g = c.createGain(); g.gain.value = 0; g.connect(this.mBus);
    g.gain.setTargetAtTime(0.9, c.currentTime, 1.5);
    const nodes = [];
    [55, 55.7, 82.4].forEach((f, i) => {
      const o = c.createOscillator(); o.type = i === 2 ? 'sine' : 'sawtooth'; o.frequency.value = f;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180;
      const og = c.createGain(); og.gain.value = i === 2 ? 0.04 : 0.06;
      o.connect(lp); lp.connect(og); og.connect(g); o.start(); nodes.push(o);
    });
    const src = c.createBufferSource(); src.buffer = this.noiseBuf; src.loop = true;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 400; bp.Q.value = 0.6;
    const ng = c.createGain(); ng.gain.value = 0.05; src.connect(bp); bp.connect(ng); ng.connect(g); src.start(); nodes.push(src);
    this.amb = { g, nodes };
    // slow heartbeat
    const beat = () => {
      if (!this.amb || this.track !== 'door') return;
      const t = c.currentTime + 0.05;
      [0, 0.28].forEach((d, k) => {
        const o = c.createOscillator(); const bg = c.createGain(); o.frequency.setValueAtTime(70, t + d); o.frequency.exponentialRampToValueAtTime(35, t + d + 0.15);
        bg.gain.setValueAtTime(k ? 0.12 : 0.18, t + d); bg.gain.exponentialRampToValueAtTime(0.001, t + d + 0.22);
        o.connect(bg); bg.connect(g); o.start(t + d); o.stop(t + d + 0.25);
      });
      setTimeout(beat, 1900 + Math.random() * 900);
    };
    setTimeout(beat, 1200);
  }
  // ---------- SFX ----------
  sfx(name) {
    if (!this.ctx) return; const c = this.ctx; const t = c.currentTime + 0.005; const B = this.sBus;
    const env = (type, f0, f1, dur, vol, dest = B) => {
      const o = c.createOscillator(); const g = c.createGain(); o.type = type;
      o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.02);
    };
    const seq = (type, notes, gap, dur, vol) => notes.forEach((n, i) => {
      const o = c.createOscillator(); const g = c.createGain(); o.type = type; o.frequency.value = typeof n === 'number' ? n : freq(n);
      const tt = t + i * gap; g.gain.setValueAtTime(vol, tt); g.gain.exponentialRampToValueAtTime(0.0008, tt + dur);
      o.connect(g); g.connect(B); o.start(tt); o.stop(tt + dur + 0.02);
    });
    const nz = (dur, vol, fc, type = 'highpass') => {
      const s = c.createBufferSource(); s.buffer = this.noiseBuf; const f = c.createBiquadFilter(); f.type = type; f.frequency.value = fc;
      const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      s.connect(f); f.connect(g); g.connect(B); s.start(t); s.stop(t + dur);
    };
    switch (name) {
      case 'tap': case 'click': env('square', 880, 660, 0.05, 0.12); break;
      case 'beep': env('square', 1320, 0, 0.08, 0.1); break;
      case 'tick': env('triangle', 2000, 0, 0.03, 0.15); break;
      case 'pop': env('sine', 500, 1100, 0.08, 0.25); break;
      case 'pick': env('triangle', 600, 900, 0.07, 0.2); break;
      case 'drop': env('triangle', 700, 300, 0.09, 0.22); break;
      case 'good': seq('square', ['E5', 'B5'], 0.06, 0.1, 0.1); break;
      case 'combo': seq('square', ['C6', 'E6', 'G6'], 0.04, 0.08, 0.09); break;
      case 'bad': env('sawtooth', 220, 110, 0.22, 0.12); break;
      case 'whoosh': case 'swish': nz(0.18, 0.15, 1800, 'bandpass'); break;
      case 'beat': env('sine', 90, 40, 0.18, 0.4); break;
      case 'alarm': seq('square', ['A5', 'E5', 'A5', 'E5'], 0.12, 0.1, 0.09); break;
      case 'win': seq('square', ['C5', 'E5', 'G5', 'C6', 'G5', 'C6'], 0.08, 0.16, 0.1); break;
      case 'lose': seq('triangle', ['G4', 'E4', 'C4', 'B3'], 0.14, 0.25, 0.2); break;
      case 'item': seq('square', ['G5', 'C6', 'E6', 'G6', 'C7'], 0.07, 0.3, 0.08); seq('triangle', ['C4', 'G4', 'C5'], 0.14, 0.5, 0.2); break;
      case 'rare': seq('sine', ['E6', 'B5', 'G#5', 'E5', 'B4', 'E5', 'G#5', 'B5', 'E6'], 0.09, 0.6, 0.12); break;
      case 'ach': seq('square', ['A5', 'C#6', 'E6', 'A6'], 0.06, 0.2, 0.08); break;
      case 'coin': seq('square', ['B5', 'E6'], 0.05, 0.12, 0.08); break;
      case 'door': env('sawtooth', 70, 45, 1.2, 0.18); nz(0.9, 0.08, 300, 'lowpass'); break;
      case 'creak': env('sawtooth', 180, 120, 0.6, 0.05); env('sawtooth', 186, 110, 0.7, 0.04); break;
      case 'unlock': seq('square', [1400, 900], 0.09, 0.06, 0.15); nz(0.08, 0.2, 3000); break;
      case 'knock': [0, 0.22, 0.44].forEach(d => { const o = c.createOscillator(); const g = c.createGain(); o.frequency.setValueAtTime(120, t + d); o.frequency.exponentialRampToValueAtTime(60, t + d + 0.08); g.gain.setValueAtTime(0.4, t + d); g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.1); o.connect(g); g.connect(B); o.start(t + d); o.stop(t + d + 0.12); }); break;
      case 'save': env('sine', 1200, 1600, 0.06, 0.04); break;
      case 'step': nz(0.04, 0.04, 800, 'lowpass'); break;
      case 'hiccup': env('sine', 400, 1400, 0.12, 0.25); break;
      case 'eat': nz(0.06, 0.12, 1200, 'bandpass'); setTimeout(() => this.sfx('pop'), 120); break;
      case 'clock': seq('triangle', [1800, 1500], 0.5, 0.04, 0.12); break;
      default: env('square', 660, 0, 0.05, 0.08);
    }
  }
  // text blip voice
  blip(who) {
    if (!this.ctx || this.vol.voice <= 0) return; const c = this.ctx; const t = c.currentTime;
    const prof = { emrys: [150, 'triangle', 0.5], rin: [520, 'square', 0.25], oda: [330, 'sine', 0.6], kai: [640, 'square', 0.22], sato: [210, 'square', 0.25], tsubu: [880, 'sine', 0.7], voice: [62, 'sawtooth', 0.35], narr: [0], unknown: [90, 'sawtooth', 0.3] }[who] || [300, 'triangle', 0.4];
    if (!prof[0]) return;
    const o = c.createOscillator(); const g = c.createGain(); o.type = prof[1];
    o.frequency.value = prof[0] * (1 + (Math.random() - 0.5) * 0.12);
    g.gain.setValueAtTime(prof[2] * 0.5, t); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.05);
    o.connect(g); g.connect(this.vBus); o.start(t); o.stop(t + 0.06);
  }
}
export const audio = new Audio();
