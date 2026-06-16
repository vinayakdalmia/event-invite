/**
 * Section 6: The Collaboration
 * Split layout with side-by-side cards
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initCollaboration() {
  const card = document.querySelector('.collab-card');
  const header = document.querySelector('.collab__header');
  const cards = document.querySelectorAll('.collab__logo-link');
  const separator = document.querySelector('.collab__separator');
  const quote = document.querySelector('.collab__quote');

  if (!card) return;

  // Create unified timeline triggered when card scrolls into view
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });

  // 1. Animate card sliding up and fading in
  tl.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
  });

  // 2. Animate section header
  if (header) {
    tl.fromTo(header,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.5' // overlaps with card slide
    );
  }

  // 3. Stagger logo links in
  if (cards.length > 0) {
    tl.fromTo(cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }

  // 4. Scale and fade separator
  if (separator) {
    tl.fromTo(separator,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 0.8,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.5'
    );
  }

  // 4.5. Fade in gifting
  const gifting = document.querySelector('.collab__gifting');
  if (gifting) {
    tl.fromTo(gifting,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }

  // 5. Fade in bottom quote
  if (quote) {
    tl.fromTo(quote,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.3'
    );
  }
}
