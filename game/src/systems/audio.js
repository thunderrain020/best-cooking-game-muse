// Ember & Tide — systems/audio.js
// All sound is synthesized with the Web Audio API: no audio files, no network.
// Chop is a filtered noise burst, the wok sizzles with looped noise, the bell
// is a struck sine with harmonics, and serves get a little major arpeggio.

export class AudioSys {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sizzle = null; // { src, gain } while the wok or pot cooks
    this.muted = false;
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.5;
    this.master.connect(this.ctx.destination);
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.5;
  }

  _noiseBuffer(seconds = 1) {
    const len = Math.floor(this.ctx.sampleRate * seconds);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  _burst({ freq = 1200, dur = 0.08, gain = 0.5, type = 'bandpass', q = 1 }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuffer(dur + 0.05);
    const filt = this.ctx.createBiquadFilter();
    filt.type = type;
    filt.frequency.value = freq;
    filt.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  _tone({ freq = 440, dur = 0.2, gain = 0.3, type = 'sine', slide = 0 }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  chop() { this._burst({ freq: 2400, dur: 0.07, gain: 0.6, q: 2 }); this._tone({ freq: 180, dur: 0.06, gain: 0.25, type: 'triangle' }); }
  pickup() { this._tone({ freq: 520, dur: 0.08, gain: 0.2, type: 'triangle' }); }
  place() { this._tone({ freq: 340, dur: 0.09, gain: 0.25, type: 'triangle', slide: -80 }); }
  flip() { this._burst({ freq: 900, dur: 0.12, gain: 0.4, q: 1.5 }); }
  perfect() { this._tone({ freq: 880, dur: 0.12, gain: 0.3 }); this._tone({ freq: 1318, dur: 0.18, gain: 0.25 }); }
  burn() { this._burst({ freq: 300, dur: 0.3, gain: 0.5, type: 'lowpass' }); this._tone({ freq: 140, dur: 0.3, gain: 0.3, type: 'sawtooth', slide: -60 }); }
  bell() {
    this._tone({ freq: 1174, dur: 0.5, gain: 0.35 });
    this._tone({ freq: 1760, dur: 0.4, gain: 0.2 });
    this._tone({ freq: 2349, dur: 0.3, gain: 0.12 });
  }
  serve() {
    [523, 659, 784].forEach((f, i) => setTimeout(() => this._tone({ freq: f, dur: 0.16, gain: 0.25, type: 'triangle' }), i * 70));
  }
  fail() { this._tone({ freq: 220, dur: 0.25, gain: 0.25, type: 'sawtooth', slide: -90 }); }
  coin() { this._tone({ freq: 988, dur: 0.1, gain: 0.22, type: 'triangle' }); this._tone({ freq: 1319, dur: 0.14, gain: 0.18, type: 'triangle' }); }
  click() { this._tone({ freq: 700, dur: 0.05, gain: 0.15, type: 'triangle' }); }

  // Sizzle loop: start when something cooks, stop when the station is empty.
  setSizzle(on) {
    if (!this.ctx) return;
    if (on && !this.sizzle) {
      const src = this.ctx.createBufferSource();
      src.buffer = this._noiseBuffer(2);
      src.loop = true;
      const filt = this.ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.value = 5200;
      filt.Q.value = 0.6;
      const g = this.ctx.createGain();
      g.gain.value = 0.05;
      src.connect(filt).connect(g).connect(this.master);
      src.start();
      this.sizzle = { src, gain: g };
    } else if (!on && this.sizzle) {
      try { this.sizzle.src.stop(); } catch (e) { /* already stopped */ }
      this.sizzle = null;
    }
  }
}
