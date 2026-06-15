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
import { initAudio } from './audio.js';

gsap.registerPlugin(ScrollTrigger);

// Wait for fonts + DOM
document.addEventListener('DOMContentLoaded', () => {
  // Lock scrolling until envelope is opened
  document.body.classList.add('no-scroll');

  // Initialize background effects
  initParticles();

  // Initialize audio toggle
  initAudio();

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
