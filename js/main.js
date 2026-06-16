/**
 * Shakti: The Sacred Feminine
 * Main orchestrator — initializes all sections and effects
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initParticles } from './effects/particles.js';
import { initArrival } from './sections/arrival.js';
import { initInvitationCard } from './sections/invitation-card.js';

import { initHighlights } from './sections/highlights.js';
import { initShaktiStory } from './sections/shakti-story.js';
import { initCollaboration } from './sections/collaboration.js';
import { initRsvp } from './sections/rsvp.js';

gsap.registerPlugin(ScrollTrigger);

// Wait for fonts + DOM
document.addEventListener('DOMContentLoaded', () => {
  // Lock scrolling until envelope is opened
  document.body.classList.add('no-scroll');

  // Initialize background effects
  initParticles();

  // Play background audio function (called on first interaction)
  let audioPlayed = false;
  window.playBackgroundAudio = () => {
    if (audioPlayed) return;
    const bgAudio = document.getElementById('background-audio');
    if (bgAudio) {
      // Force audio to start from 0:00 as requested
      bgAudio.currentTime = 0;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioPlayed = true;
        }).catch(e => {
          console.log('Audio autoplay prevented:', e);
          audioPlayed = false; // Allow retry on the next event (e.g. click after touchstart)
        });
      }
    }
  };
  
  // Also attach to document just in case they click elsewhere first
  document.addEventListener('click', window.playBackgroundAudio, { once: true });
  document.addEventListener('touchstart', window.playBackgroundAudio, { once: true });

  // Initialize arrival (envelope + seal)
  initArrival({
    onEnvelopeOpened: () => {
      // Show invitation card section
      const cardSection = document.getElementById('invitation-card');
      if (cardSection) cardSection.style.display = '';

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
    }
  });
});
