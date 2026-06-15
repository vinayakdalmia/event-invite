/**
 * Section 4: Experience Highlights
 * Editorial text-only cards with scroll-triggered reveals
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHighlights() {
  const header = document.querySelector('.highlights__header');
  const cards = document.querySelectorAll('.exp-card');

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

  // Animate each card
  cards.forEach((card) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 25,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}
