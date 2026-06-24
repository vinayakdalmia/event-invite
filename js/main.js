/**
 * Shakti: The Sacred Feminine
 * Main orchestrator — initializes all sections and effects
 */

import { inject } from '@vercel/analytics';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { inject } from '@vercel/analytics';

inject();
import { initParticles } from './effects/particles.js';
import { initInvitationCard } from './sections/invitation-card.js';

import { initHighlights } from './sections/highlights.js';
import { initShaktiStory } from './sections/shakti-story.js';
import { initCollaboration } from './sections/collaboration.js';
import { initRsvp } from './sections/rsvp.js';

gsap.registerPlugin(ScrollTrigger);

// Initialize Vercel Analytics
inject();

// Wait for fonts + DOM
document.addEventListener('DOMContentLoaded', () => {
  // Lock scrolling until envelope is opened
  document.body.classList.add('no-scroll');

  // Initialize background effects
  initParticles();

  // Audio logic
  let audioPlayed = false;
  const audioToggleBtn = document.getElementById('audio-toggle');
  const iconOn = document.getElementById('audio-icon-on');
  const iconOff = document.getElementById('audio-icon-off');

  const setAudioUI = (isOn) => {
    if (iconOn && iconOff) {
      iconOn.style.display = isOn ? 'inline-flex' : 'none';
      iconOff.style.display = isOn ? 'none' : 'inline-flex';
    }
  };

  window.playBackgroundAudio = () => {
    if (audioPlayed) return;
    const bgAudio = document.getElementById('background-audio');
    if (bgAudio) {
      bgAudio.currentTime = 0;
      bgAudio.volume = 1;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioPlayed = true;
          setAudioUI(true);
          
          // Only play for 35 seconds total
          const timeCheck = () => {
            if (bgAudio.currentTime >= 33) {
              bgAudio.removeEventListener('timeupdate', timeCheck);
              gsap.to(bgAudio, {
                volume: 0,
                duration: 2.0,
                ease: 'power2.out',
                onComplete: () => {
                  bgAudio.pause();
                  setAudioUI(false);
                }
              });
            }
          };
          bgAudio.addEventListener('timeupdate', timeCheck);
        }).catch(e => {
          console.log('Audio autoplay prevented:', e);
          audioPlayed = false;
        });
      }
    }
  };

  // Attach to document just in case they click elsewhere first
  document.addEventListener('click', window.playBackgroundAudio, { once: true });
  document.addEventListener('touchstart', window.playBackgroundAudio, { once: true, passive: true });

  // Audio Toggle Button Logic
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const bgAudio = document.getElementById('background-audio');
      if (!bgAudio) return;

      if (bgAudio.paused || bgAudio.volume === 0) {
        // Turn ON
        if (bgAudio.currentTime >= 33) bgAudio.currentTime = 0; // reset if it finished
        bgAudio.volume = 1;
        bgAudio.play().then(() => {
          setAudioUI(true);
          audioPlayed = true; // prevent document click from interfering
        }).catch(() => {});
      } else {
        // Turn OFF
        bgAudio.pause();
        setAudioUI(false);
      }
    });
  }

  // Animate the invitation card in
  initInvitationCard({
    onComplete: () => {
      // NOW unlock scrolling
      document.body.classList.remove('no-scroll');

      // Initialize all scroll-based sections
      initHighlights();
      initShaktiStory();
      initCollaboration();
      initRsvp();

      // Refresh scroll triggers
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  });
});
