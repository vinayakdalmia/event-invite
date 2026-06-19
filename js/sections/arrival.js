/**
 * Section 1: Arrival — Envelope + Wax Seal
 * The first screen: tap the seal to open
 */

import { gsap } from 'gsap';

export function initArrival({ onEnvelopeOpened }) {
  const videoWrapper = document.getElementById('video-wrapper');
  const video = document.getElementById('intro-video');
  const arrivalSection = document.getElementById('arrival');

  if (!videoWrapper || !video) return;

  let hasPausedForDoor = false;
  let isVideoPlaying = false;

  // IMPORTANT: Set this to the exact second where the door is fully closed.
  const isDesktop = window.innerWidth >= 1200;
  const DOOR_PAUSE_TIME = isDesktop ? 5.0 : 1.2;

  const VIDEO_BLEND_TIME = isDesktop ? 12.5 : 10.5;

  let hasEnded = false;

  // 1. Play the video initially and wait for the door frame or blend time
  video.addEventListener('timeupdate', () => {
    // Check for pause time
    if (!hasPausedForDoor && video.currentTime >= DOOR_PAUSE_TIME) {
      video.pause();
      hasPausedForDoor = true;
      isVideoPlaying = false;

      // Wait for user tap
    }

    // Check for blend time
    if (!hasEnded && video.currentTime >= VIDEO_BLEND_TIME) {
      hasEnded = true;

      // 1. Trigger the invitation card to render immediately (it will be placed underneath)
      if (onEnvelopeOpened) onEnvelopeOpened();

      // 2. Take the arrival section out of document flow so the invitation card moves to the top of the page underneath it
      arrivalSection.style.position = 'absolute';
      arrivalSection.style.top = '0';
      arrivalSection.style.left = '0';
      arrivalSection.style.zIndex = '50';

      const tl = gsap.timeline({
        onComplete: () => {
          arrivalSection.style.display = 'none';
          video.pause(); // Pause it only after it has fully faded out and disappeared
        }
      });

      // 3. Fade out the entire video section slowly over 2 seconds to seamlessly reveal the invitation underneath
      tl.to(arrivalSection, {
        opacity: 0,
        duration: 2.0,
        ease: 'power2.inOut',
      });
    }
  });

  // If user taps anywhere else on the wrapper
  videoWrapper.addEventListener('click', () => {
    if (window.playBackgroundAudio) window.playBackgroundAudio();
    
    // If paused, tapping the screen acts as a play button
    if (video.paused && !hasEnded) {
      if (!hasPausedForDoor) {
        hasPausedForDoor = true; // Bypass door pause if they tapped early
      }

      video.play().catch(() => {});
      isVideoPlaying = true;

      if (navigator.vibrate) {
        navigator.vibrate([15, 50, 10]);
      }
    }
  });

  // Let the browser handle the start time natively via the HTML #t= fragment
  // Force a play attempt to catch autoplay blocks
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked.
    });
  }
}

function createGoldBurst(rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const count = 12;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = 2 + Math.random() * 3;
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: #B99874;
      border-radius: 50%;
      left: ${centerX}px;
      top: ${centerY}px;
      z-index: 10000;
      pointer-events: none;
      opacity: 0.8;
    `;
    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / count;
    const distance = 60 + Math.random() * 80;

    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      scale: 0.2,
      duration: 1 + Math.random() * 0.5,
      ease: 'power2.out',
      onComplete: () => particle.remove(),
    });
  }
}
