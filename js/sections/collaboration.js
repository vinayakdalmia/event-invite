/**
 * Section 6: The Collaboration
 * Split layout with side-by-side cards
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initCollaboration() {
  const header = document.querySelector('.collab__header');
  const cards = document.querySelectorAll('.collab__card');
  const quote = document.querySelector('.collab__quote');

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
  cards.forEach((card, index) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: index * 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Animate bottom quote
  if (quote) {
    gsap.fromTo(quote,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3, // delays slightly after cards
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quote,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }
}
