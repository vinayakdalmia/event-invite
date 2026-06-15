/**
 * Section 5: Sacred Narrative — 2×2 Grid
 * Story chapter cards with scroll-triggered reveals
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initShaktiStory() {
  const header = document.querySelector('.story__header');
  const cards = document.querySelectorAll('.story-card');

  // Animate section header
  if (header) {
    gsap.fromTo(header,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Stagger cards in
  cards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}
