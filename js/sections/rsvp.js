/**
 * Section 9: RSVP Experience
 * Premium modal with form + lotus confirmation animation
 */

import { gsap } from 'gsap';

export function initRsvp() {
  const openBtns = document.querySelectorAll('#rsvp-open, #rsvp-open-top');
  const modal = document.getElementById('rsvp-modal');
  const closeBtn = document.getElementById('rsvp-close');
  const form = document.getElementById('rsvp-form');
  const confirmation = document.getElementById('rsvp-confirmation');
  const overlay = modal?.querySelector('.rsvp-modal__overlay');
  const content = modal?.querySelector('.rsvp-modal__content');

  if (openBtns.length === 0 || !modal) return;

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
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
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

  // 'Other' input toggles
  const setupOtherToggle = (radioName, inputId) => {
    const radios = document.querySelectorAll(`input[name="${radioName}"]`);
    const otherInput = document.getElementById(inputId);
    if (!otherInput) return;
    
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'Other') {
          otherInput.style.display = 'block';
          otherInput.required = true;
          // Animate in
          gsap.fromTo(otherInput, { opacity: 0, height: 0 }, { opacity: 1, height: 'auto', duration: 0.3 });
        } else {
          otherInput.style.display = 'none';
          otherInput.required = false;
        }
      });
    });
  };

  setupOtherToggle('attending_as', 'attending_as_other_text');
  setupOtherToggle('source', 'source_other_text');

  // Form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>SUBMITTING...</span>';
      submitBtn.disabled = true;

      try {
        // Gather all form data dynamically
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Replace 'Other' with the custom text
        if (data.attending_as === 'Other' && data.attending_as_other_text) {
          data.attending_as = data.attending_as_other_text;
        }
        if (data.source === 'Other' && data.source_other_text) {
          data.source = data.source_other_text;
        }

        const response = await fetch('/api/rsvp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        console.log('RSVP Successfully Saved!');

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
      } catch (error) {
        console.error('RSVP Submission Error:', error);
        alert('There was an error submitting your RSVP. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
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
