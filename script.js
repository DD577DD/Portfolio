/* ============================================
   Particle network background
   A subtle constellation of connected nodes —
   drifting on its own, and linking toward the
   cursor when it's near.
   ============================================ */

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const CONFIG = {
  maxDistance: 130, // px within which two particles link
  mouseRadius: 160, // px within which a particle links to the cursor
  particleRGB: "94, 200, 255", // --blue-bright
  lineRGB: "47, 111, 237", // --blue
  minParticles: 40,
  maxParticles: 110,
};

let width = 0;
let height = 0;
let particles = [];
const mouse = { x: null, y: null };

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createParticles() {
  const area = width * height;
  const count = Math.min(
    CONFIG.maxParticles,
    Math.max(CONFIG.minParticles, Math.floor(area / 16000))
  );

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.6 + 0.6,
  }));
}

function updateParticle(p) {
  p.x += p.vx;
  p.y += p.vy;

  if (p.x <= 0 || p.x >= width) p.vx *= -1;
  if (p.y <= 0 || p.y >= height) p.vy *= -1;
}

function drawParticle(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${CONFIG.particleRGB}, 0.8)`;
  ctx.fill();
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];

    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.maxDistance) {
        const opacity = (1 - dist / CONFIG.maxDistance) * 0.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${CONFIG.lineRGB}, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (mouse.x !== null) {
      const dx = a.x - mouse.x;
      const dy = a.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.mouseRadius) {
        const opacity = (1 - dist / CONFIG.mouseRadius) * 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${CONFIG.particleRGB}, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function step() {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    updateParticle(p);
    drawParticle(p);
  }

  drawConnections();

  if (!prefersReducedMotion) {
    requestAnimationFrame(step);
  }
}

function init() {
  resizeCanvas();
  createParticles();
  step(); // if reduced motion is on, this draws a single static frame
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

init();

/* ============================================
   Scroll reveal for About / Skills content
   Fades and lifts each .reveal element in as
   it enters the viewport. Skipped entirely
   when reduced motion is requested — the CSS
   already renders those elements fully visible.
   ============================================ */
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${(index % 4) * 60}ms`;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  // No IntersectionObserver support (or reduced motion): show the
  // content immediately instead of leaving it stuck at opacity 0.
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("is-visible"));
}

/* ============================================
   Contact form
   No backend yet, so this just validates and
   swaps in a confirmation message client-side.
   ============================================ */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const nameValue = document.getElementById("contact-name").value.trim();
    const successMessage = document.getElementById("contact-success");

    contactForm.hidden = true;
    successMessage.textContent = nameValue
      ? `Thanks, ${nameValue} — I'll get back to you soon.`
      : "Thanks — I'll get back to you soon.";
    successMessage.hidden = false;
  });
}

/* ============================================
   Mobile nav toggle
   ============================================ */
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
  const closeNav = () => {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeNav();
  });
}

/* ============================================
   Footer year
   ============================================ */
const footerYear = document.getElementById("footer-year");
if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}
