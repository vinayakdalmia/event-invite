/**
 * Audio System
 * Procedurally generated ambient sound using Web Audio API
 * Tanpura drone + gentle bells + subtle veena-like plucks
 */

let audioCtx = null;
let isPlaying = false;
let masterGain = null;
let droneOscillators = [];
let bellInterval = null;

export function initAudio() {
  const toggle = document.getElementById('audio-toggle');
  if (!toggle) return;

  const iconOff = toggle.querySelector('.audio-icon--off');
  const iconOn = toggle.querySelector('.audio-icon--on');

  toggle.addEventListener('click', () => {
    if (!isPlaying) {
      startAudio();
      toggle.classList.add('is-playing');
      if (iconOff) iconOff.style.display = 'none';
      if (iconOn) iconOn.style.display = '';
    } else {
      stopAudio();
      toggle.classList.remove('is-playing');
      if (iconOff) iconOff.style.display = '';
      if (iconOn) iconOn.style.display = 'none';
    }
    isPlaying = !isPlaying;
  });
}

function startAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioCtx.destination);

  // Fade in master volume
  masterGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 2);

  // Create tanpura drone
  createDrone();

  // Schedule periodic bells
  scheduleBells();

  // Schedule occasional veena plucks
  scheduleVeenaPlucks();
}

function stopAudio() {
  if (!audioCtx) return;

  // Fade out
  masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);

  setTimeout(() => {
    droneOscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    droneOscillators = [];

    if (bellInterval) clearInterval(bellInterval);
    bellInterval = null;

    audioCtx.close();
    audioCtx = null;
  }, 1600);
}

function createDrone() {
  // Sa (C3 ≈ 130.81 Hz) — the fundamental tanpura drone
  const frequencies = [130.81, 130.81 * 1.005, 196.0, 261.63]; // Sa with slight detune, Pa, upper Sa
  const gains = [0.3, 0.25, 0.15, 0.1];

  frequencies.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Very slight vibrato
    const vibrato = audioCtx.createOscillator();
    const vibratoGain = audioCtx.createGain();
    vibrato.frequency.value = 4 + Math.random() * 2;
    vibratoGain.gain.value = 0.5 + Math.random() * 0.3;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start();

    // Warm filter
    filter.type = 'lowpass';
    filter.frequency.value = 600 + Math.random() * 200;
    filter.Q.value = 0.5;

    gain.gain.value = gains[i];

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start();
    droneOscillators.push(osc);
    droneOscillators.push(vibrato);
  });
}

function scheduleBells() {
  function playBell() {
    if (!audioCtx || audioCtx.state === 'closed') return;

    const freq = 800 + Math.random() * 1200;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;

    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 10;

    gain.gain.value = 0.03 + Math.random() * 0.03;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + 3);
  }

  // Random intervals between 4-10 seconds
  function scheduleNext() {
    const delay = 4000 + Math.random() * 6000;
    bellInterval = setTimeout(() => {
      playBell();
      scheduleNext();
    }, delay);
  }

  // First bell after 3 seconds
  setTimeout(playBell, 3000);
  scheduleNext();
}

function scheduleVeenaPlucks() {
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0]; // C4, D4, E4, G4, A4

  function pluck() {
    if (!audioCtx || audioCtx.state === 'closed') return;

    const freq = notes[Math.floor(Math.random() * notes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = freq * 3;
    filter.Q.value = 2;

    // Sharp attack, long decay (pluck-like)
    gain.gain.value = 0.04;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + 4);
  }

  // Random intervals between 8-15 seconds
  function scheduleNext() {
    const delay = 8000 + Math.random() * 7000;
    setTimeout(() => {
      pluck();
      if (isPlaying) scheduleNext();
    }, delay);
  }

  setTimeout(() => {
    pluck();
    scheduleNext();
  }, 5000);
}
