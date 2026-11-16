// Web Audio API Synthesizer for Customer Order Ready Chime
export const playReadyChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Harmonic bell chime chords (F6, A6, C7, E7)
    const notes = [1396.91, 1760.0, 2093.0, 2637.02];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      // Attack and exponential decay
      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, now + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 1.3);
    });

    // Trigger device vibration if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  } catch (e) {
    console.warn('Audio chime could not be played:', e);
  }
};

// Kitchen Double Beep for New Incoming Ticket
export const playKitchenNewOrderBeep = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const beeps = [960, 1280];

    beeps.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square'; // crisp industrial ticket alert
      osc.frequency.setValueAtTime(freq, now + index * 0.18);

      gain.gain.setValueAtTime(0, now + index * 0.18);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.18 + 0.01);
      gain.gain.linearRampToValueAtTime(0, now + index * 0.18 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.18);
      osc.stop(now + index * 0.18 + 0.13);
    });
  } catch (e) {
    console.warn('Kitchen beep could not be played:', e);
  }
};
