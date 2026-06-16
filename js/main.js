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

  // Play background audio on first interaction
  const playAudio = () => {
    const bgAudio = document.getElementById('background-audio');
    if (bgAudio) {
      bgAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
    }
    // Remove listener after first interaction
    document.removeEventListener('click', playAudio);
    document.removeEventListener('touchstart', playAudio);
  };
  
  document.addEventListener('click', playAudio);
  document.addEventListener('touchstart', playAudio);

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
