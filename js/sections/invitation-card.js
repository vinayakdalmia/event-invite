/**
 * Section 2: Invitation Card Reveal
 * The formal invitation card slides up elegantly after the envelope opens
 * Content fades in with staggered timing
 */

import { gsap } from 'gsap';

export function initInvitationCard({ onComplete } = {}) {
  const section = document.getElementById('invitation-card');
  const invitation = document.getElementById('invitation');
  const scrollIndicator = document.getElementById('scroll-indicator');

  if (!section || !invitation) return;

  // Scroll to top
  window.scrollTo(0, 0);

  // Gather all text elements for staggered reveal
  const labels = invitation.querySelectorAll('.invitation__label');
  const title = invitation.querySelector('.invitation__title');
  const subtitle = invitation.querySelector('.invitation__subtitle');
  const dividers = invitation.querySelectorAll('.invitation__divider');
  const date = invitation.querySelector('.invitation__date');
  const dateSub = invitation.querySelector('.invitation__date-sub');
  const time = invitation.querySelector('.invitation__time');
  const timeSub = invitation.querySelector('.invitation__time-sub');
  const venue = invitation.querySelector('.invitation__venue');
  const venueSub = invitation.querySelector('.invitation__venue-sub');
  const description = invitation.querySelector('.invitation__description');
  const rsvpLabel = invitation.querySelector('.invitation__rsvp-label');
  const corners = invitation.querySelectorAll('.invitation__corner');

  // Set initial states
  const allTextElements = [
    ...labels, title, subtitle, ...dividers,
    date, dateSub, time, timeSub,
    venue, venueSub, description, rsvpLabel
  ].filter(Boolean);

  gsap.set(allTextElements, { opacity: 0, y: 12 });
  gsap.set(corners, { opacity: 0 });

  const tl = gsap.timeline({
    delay: 0.2,
    onComplete: () => {
      // Show scroll indicator
      if (scrollIndicator) {
        gsap.to(scrollIndicator, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 0.5,
        });

        // Gentle float animation
        gsap.to(scrollIndicator, {
          y: 6,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.5,
        });

        // Fade out on scroll
        const handleScroll = () => {
          gsap.to(scrollIndicator, {
            opacity: 0,
            duration: 0.4,
          });
          window.removeEventListener('scroll', handleScroll);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
      }

      // Fire completion after a brief pause
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 300);
    }
  });

  // 1. Instantly fade everything in
  gsap.set(allTextElements, { opacity: 1, y: 0 });
  gsap.set(corners, { opacity: 0.5 });
  
  // 2. Animate the card sliding up quickly
  tl.to(invitation, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
  });
}
