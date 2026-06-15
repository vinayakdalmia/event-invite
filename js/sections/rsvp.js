/**
 * Section 9: RSVP Experience
 * Premium modal with form + lotus confirmation animation
 */

import { gsap } from 'gsap';

export function initRsvp() {
  const openBtn = document.getElementById('rsvp-open');
  const modal = document.getElementById('rsvp-modal');
  const closeBtn = document.getElementById('rsvp-close');
  const form = document.getElementById('rsvp-form');
  const confirmation = document.getElementById('rsvp-confirmation');
  const overlay = modal?.querySelector('.rsvp-modal__overlay');
  const content = modal?.querySelector('.rsvp-modal__content');

  if (!openBtn || !modal) return;

  // Guest stepper
  const guestCount = document.getElementById('guest-count');
  const minusBtn = document.getElementById('guest-minus');
  const plusBtn = document.getElementById('guest-plus');
  let guests = 1;

  if (minusBtn && plusBtn && guestCount) {
    minusBtn.addEventListener('click', () => {
      if (guests > 1) {
        guests--;
        guestCount.textContent = guests;
      }
    });

    plusBtn.addEventListener('click', () => {
      if (guests < 10) {
        guests++;
        guestCount.textContent = guests;
      }
    });
  }

  // Attendance toggle
  const attendanceOptions = document.querySelectorAll('.rsvp-attendance__option');
  attendanceOptions.forEach(option => {
    option.addEventListener('click', () => {
      attendanceOptions.forEach(o => o.classList.remove('rsvp-attendance__option--active'));
      option.classList.add('rsvp-attendance__option--active');
    });
  });

  // Open modal
  openBtn.addEventListener('click', () => {
    modal.style.display = '';
    document.body.classList.add('no-scroll');

    gsap.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    gsap.fromTo(content,
      { y: '100%' },
      { y: '0%', duration: 0.6, ease: 'power2.out', delay: 0.1 }
    );
  });

  // Close modal
  function closeModal() {
    gsap.to(content, {
      y: '100%',
      duration: 0.5,
      ease: 'power2.in',
    });

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      delay: 0.1,
      onComplete: () => {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather form data
      const formData = {
        name: document.getElementById('rsvp-name')?.value,
        phone: document.getElementById('rsvp-phone')?.value,
        email: document.getElementById('rsvp-email')?.value,
        guests: guests,
        attendance: document.querySelector('.rsvp-attendance__option--active')?.dataset.value,
      };

      console.log('RSVP Submitted:', formData);

      // Animate out form, animate in confirmation
      gsap.to(form, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          form.style.display = 'none';
          if (confirmation) {
            confirmation.style.display = '';
            animateConfirmation();
          }
        }
      });
    });
  }

  function animateConfirmation() {
    const lotusEl = confirmation.querySelector('.rsvp-confirmation__lotus');
    const textEl = confirmation.querySelector('.rsvp-confirmation__text');
    const lotusPaths = lotusEl?.querySelectorAll('path');
    const lotusCircle = lotusEl?.querySelector('circle');

    const tl = gsap.timeline();

    // Set initial states
    gsap.set([lotusEl, textEl], { opacity: 0 });
    if (lotusPaths) gsap.set(lotusPaths, { opacity: 0, scale: 0.3, transformOrigin: 'center' });
    if (lotusCircle) gsap.set(lotusCircle, { opacity: 0, scale: 0 });

    // Animate lotus bloom
    tl.to(lotusEl, { opacity: 1, duration: 0.3 });

    if (lotusCircle) {
      tl.to(lotusCircle, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (lotusPaths) {
      tl.to(lotusPaths, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
      }, '-=0.3');
    }

    tl.to(textEl, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.3');

    gsap.set(textEl, { y: 15 });

    // Haptic
    if (navigator.vibrate) {
      navigator.vibrate([10]);
    }
  }
}
