/**
 * Floating gold dust particles — lightweight Canvas-based system
 */

let canvas, ctx;
let particles = [];
let animationId;
let isVisible = true;

const CONFIG = {
  count: 35,
  minSize: 1,
  maxSize: 2.5,
  minSpeed: 0.15,
  maxSpeed: 0.5,
  minOpacity: 0.15,
  maxOpacity: 0.45,
  color: { r: 185, g: 152, b: 116 }, // Gold #B99874
  drift: 0.3,
};

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
    this.speedY = -(CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed));
    this.speedX = (Math.random() - 0.5) * CONFIG.drift;
    this.opacity = CONFIG.minOpacity + Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity);
    this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
    this.fadeSpeed = 0.002 + Math.random() * 0.003;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.01 + Math.random() * 0.02;
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.2;
    this.y += this.speedY;

    // Fade in/out
    this.opacity += this.fadeDirection * this.fadeSpeed;
    if (this.opacity >= CONFIG.maxOpacity) {
      this.fadeDirection = -1;
    } else if (this.opacity <= CONFIG.minOpacity) {
      this.fadeDirection = 1;
    }

    // Reset when off screen
    if (this.y < -10) {
      this.y = canvas.height + 10;
      this.x = Math.random() * canvas.width;
    }
    if (this.x < -10) this.x = canvas.width + 10;
    if (this.x > canvas.width + 10) this.x = -10;
  }

  draw() {
    const { r, g, b } = CONFIG.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    ctx.fill();
  }
}

function animate() {
  if (!isVisible) {
    animationId = requestAnimationFrame(animate);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.update();
    p.draw();
  }

  animationId = requestAnimationFrame(animate);
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(dpr, dpr);
}

export function initParticles() {
  // Completely disable on mobile to prevent throttling and battery drain
  if (window.innerWidth <= 768) {
    const canvasEl = document.getElementById('particles-canvas');
    if (canvasEl) canvasEl.style.display = 'none';
    return;
  }

  canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  resize();

  // Create particles
  for (let i = 0; i < CONFIG.count; i++) {
    particles.push(new Particle());
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  animate();
}
