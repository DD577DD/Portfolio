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

// Phones / tablets: far fewer particles, and the canvas rests while the
// page is being scrolled, so scrolling stays smooth.
const isTouch = window.matchMedia("(hover: none)").matches;
let lastScrollAt = 0;
window.addEventListener("scroll", () => { lastScrollAt = performance.now(); }, { passive: true });

const CONFIG = {
  maxDistance: isTouch ? 100 : 130, // px within which two particles link
  mouseRadius: 160, // px within which a particle links to the cursor
  particleRGB: "94, 200, 255", // --blue-bright
  lineRGB: "47, 111, 237", // --blue
  minParticles: isTouch ? 18 : 40,
  maxParticles: isTouch ? 34 : 110,
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

let frameSkip = false;

function step() {
  // On touch devices: skip every other frame, stand still while scrolling,
  // and do nothing when the tab is hidden.
  if (isTouch && !prefersReducedMotion) {
    frameSkip = !frameSkip;
    if (frameSkip || document.hidden || performance.now() - lastScrollAt < 180) {
      requestAnimationFrame(step);
      return;
    }
  }

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
   Social profiles
   Paste your profile links here — they are used
   in both the Contact section and the footer.
   A link left empty is hidden automatically.
   ============================================ */
const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/dilshod-ulmasov-722513415",
  facebook: "https://www.facebook.com/share/1HMrix9ABb/",
  x: "https://x.com/ulmasoffd",
};

document.querySelectorAll("[data-social]").forEach((link) => {
  const url = SOCIAL_LINKS[link.dataset.social];
  if (url) {
    link.href = url;
  } else {
    link.hidden = true;
  }
});

/* ============================================
   Translations (English / Russian / Uzbek)
   Every element with data-i18n="key" gets its
   text from here. data-i18n-placeholder and
   data-i18n-aria-label do the same for those
   attributes. To edit a text, change it here.
   ============================================ */
const I18N = {
  en: {
    "meta.title": "Dilshod Ulmasov — Portfolio",
    "meta.description":
      "Dilshod Ulmasov — Computer Science student and web developer based in London.",
    "lang.label": "Language",

    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.education": "Education",
    "nav.certificates": "Certificates",
    "nav.contact": "Contact",
    "nav.toggle": "Toggle navigation menu",

    "hero.title": "Computer Science Student & Developer",
    "hero.tagline":
      "I build clean, thoughtful software — turning complicated problems into interfaces that feel obvious to use.",
    "hero.ctaContact": "Get In Touch",

    "about.eyebrow": "About",
    "about.heading": "Who I Am",
    "about.p1":
      "I'm a Computer Science student at Brunel University London's Pathway College, based in London, with a growing focus on web development. What draws me to the web is the mix of logic and craft it demands — a page has to work correctly and feel right, and I like sitting at that intersection, turning an idea into something people can actually click through and use.",
    "about.p2":
      "Most of what I know I've picked up by building: putting together full sites from scratch, working through layout and interaction problems, and getting comfortable with the tools that make development sustainable, like Git and responsive design principles. I care about writing code that's easy to come back to and interfaces that don't get in the user's way, and I'm always looking for the next project that pushes what I can build.",

    "skills.eyebrow": "Skills",
    "skills.heading": "What I Work With",
    "tag.markup": "Markup",
    "tag.styling": "Styling",
    "tag.language": "Language",
    "tag.framework": "Framework",
    "tag.tooling": "Tooling",
    "tag.practice": "Practice",
    "skill.responsive": "Responsive Design",
    "skill.uiux": "UI / UX Design",


    "edu.eyebrow": "Education",
    "edu.heading": "Where I Study",
    "edu.program": "Computer Science",
    "edu.location": "London, United Kingdom",
    "edu.status": "Currently studying",

    "certs.eyebrow": "Certificates",
    "certs.heading": "Courses I've Completed",
    "certs.type": "Online course",
    "certs.issued": "Issued",
    "certs.date": "July 2026",
    "certs.id": "Credential ID",
    "certs.view": "View certificate",
    "certs.note": "Opens the official HP LIFE page, where anyone can verify it.",
    "c1.desc":
      "Core data science and analytics practices, methods, and tools, the benefits and challenges of a data-driven approach for businesses, and the key skills for a career in the field.",
    "c2.desc":
      "Why networking matters for career growth, practical networking strategies, the role of personal branding, and using digital tools to build a professional network with confidence.",

    "c3.desc":
      "An introductory course in IT customer support, completed through the Cisco Networking Academy program.",
    "c3.date": "November 2026",

    "c4.desc":
      "An introductory course on working with Claude, completed through Anthropic’s online learning platform.",
    "c4.note": "Opens the official Skilljar page, where anyone can verify it.",

    "certs.prev": "Previous certificate",
    "certs.next": "Next certificate",
    "c3.note": "Opens the full certificate image.",

    "contact.eyebrow": "Contact",
    "contact.heading": "Get In Touch",
    "contact.social": "Or find me on",
    "form.name": "Name",
    "form.namePh": "Your name",
    "form.email": "Email",
    "form.message": "Message",
    "form.messagePh": "What would you like to say?",
    "form.submit": "Send Message",
    "form.success": "Thanks, {name} — I'll get back to you soon.",
    "form.successNoName": "Thanks — I'll get back to you soon.",
    "form.sending": "Sending...",
    "form.error": "Something went wrong. Please try again.",

    "nav.projects": "Projects",
    "projects.eyebrow": "Projects",
    "projects.heading": "My Projects",
    "projects.view": "View project",
    "p1.desc": "A trilingual (Uzbek / Russian / English) website for a kindergarten in Termiz, with daily photos and videos managed through a Telegram bot.",
    "p2.desc": "A Block Blast-style puzzle game running as a Telegram Mini App, with player accounts, friends and global and country rankings.",
    "p3.desc": "A Telegram bot that uploads, updates and deletes daily videos and photos on a website without redeploying it.",

    "footer.rights": "All rights reserved.",
  },

};

const SUPPORTED_LANGS = Object.keys(I18N);
let currentLang = "en";
let submittedName = null; // remembered so the success message can be re-translated

function t(key) {
  return I18N[currentLang]?.[key] ?? I18N.en[key] ?? key;
}

function renderSuccessMessage() {
  const successMessage = document.getElementById("contact-success");
  if (!successMessage || submittedName === null) return;
  successMessage.textContent = submittedName
    ? t("form.success").replace("{name}", submittedName)
    : t("form.successNoName");
}

function applyLanguage(lang) {
  currentLang = SUPPORTED_LANGS.includes(lang) ? lang : "en";

  document.documentElement.lang = currentLang;
  document.title = t("meta.title");
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", t("meta.description"));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });

  renderSuccessMessage();
}

// The site is English only.
applyLanguage("en");

/* ============================================
   Scroll reveal for section content
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
   Skills: staggered entrance, cursor spotlight
   and 3D tilt
   ============================================ */
const skillsGrid = document.getElementById("skills-grid");

if (skillsGrid) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    skillsGrid.classList.add("is-in");
  } else {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          skillsGrid.classList.add("is-in");
          skillsObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    skillsObserver.observe(skillsGrid);
  }

  const canTilt =
    !prefersReducedMotion &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  skillsGrid.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      if (canTilt) {
        card.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
        card.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
      }
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

/* ============================================
   Contact form
   Validates, then sends the message to my email
   through Web3Forms.
   ============================================ */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const errorMessage = document.getElementById("contact-error");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    errorMessage.hidden = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = t("form.sending");
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      submittedName = document.getElementById("contact-name").value.trim();
      const successMessage = document.getElementById("contact-success");

      contactForm.reset();
      contactForm.hidden = true;
      renderSuccessMessage();
      successMessage.hidden = false;
    } catch (err) {
      errorMessage.textContent = t("form.error");
      errorMessage.hidden = false;
    } finally {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    }
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
   Nav: scrolled state + active section
   A pill slides behind the link of the section
   currently on screen.
   ============================================ */
const siteNav = document.getElementById("site-nav");
const navIndicator = document.querySelector(".nav-indicator");
const navLinkEls = Array.from(document.querySelectorAll(".nav-link"));
const spySections = navLinkEls
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
let activeLink = null;

function moveIndicator() {
  if (!navIndicator) return;
  if (!activeLink) {
    navIndicator.style.opacity = "0";
    return;
  }
  navIndicator.style.width = `${activeLink.offsetWidth}px`;
  navIndicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
  navIndicator.style.opacity = "1";
}

function updateNavState() {
  siteNav?.classList.toggle("is-scrolled", window.scrollY > 24);

  const probe = window.innerHeight * 0.35;
  let current = spySections[0];
  for (const section of spySections) {
    if (section.getBoundingClientRect().top <= probe) current = section;
  }
  // At the very bottom, the last section is the active one
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
    current = spySections[spySections.length - 1];
  }

  const next = navLinkEls.find(
    (link) => link.getAttribute("href") === `#${current?.id}`
  );
  if (next !== activeLink) {
    activeLink?.classList.remove("is-active");
    next?.classList.add("is-active");
    activeLink = next || null;
    moveIndicator();
  }
}

window.addEventListener("scroll", updateNavState, { passive: true });
window.addEventListener("resize", moveIndicator);
// Link widths change when the language changes or fonts finish loading
if ("ResizeObserver" in window && navLinks) {
  new ResizeObserver(moveIndicator).observe(navLinks);
}
document.fonts?.ready.then(moveIndicator);
updateNavState();

/* ============================================
   Footer year
   ============================================ */
const footerYear = document.getElementById("footer-year");
if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}

  


/* ============================================
   Certificates carousel
   Endless loop: slides left to right forever,
   drag / swipe / arrows / dots still work.
   ============================================ */
(function () {
  const wrap = document.getElementById("certs-carousel");
  const track = document.getElementById("certs-grid");
  const dotsBox = document.getElementById("certs-dots");
  if (!wrap || !track) return;

  const prev = wrap.querySelector(".certs-prev");
  const next = wrap.querySelector(".certs-next");
  const total = track.children.length;
  Array.from(track.children).forEach((c, i) => (c.dataset.i = i));
  prev.disabled = false;
  next.disabled = false;

  const dots = Array.from(track.children).map((_, i) => {
    const d = document.createElement("span");
    d.className = "certs-dot";
    d.addEventListener("click", () => jumpTo(i));
    dotsBox.appendChild(d);
    return d;
  });

  function step() {
    const c = track.children[0];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return c.getBoundingClientRect().width + gap;
  }

  function maxIndex() {
    return Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step()));
  }

  function currentIndex() {
    return Math.max(0, Math.min(maxIndex(), Math.round(track.scrollLeft / step())));
  }

  function instant(fn) {
    const snap = track.style.scrollSnapType;
    track.style.scrollSnapType = "none";
    track.style.scrollBehavior = "auto";
    fn();
    // restore on the next frame so the browser does not re-snap mid-change
    requestAnimationFrame(() => {
      track.style.scrollSnapType = snap;
      track.style.scrollBehavior = "";
    });
  }

  // Cards that have scrolled past the left edge go to the back of the line
  function normalise() {
    const k = currentIndex();
    if (k <= 0) return;
    instant(() => {
      const st = step();
      for (let n = 0; n < k; n++) track.appendChild(track.firstElementChild);
      track.scrollLeft -= k * st;
    });
  }

  function goNext() {
    track.scrollTo({ left: step(), behavior: "smooth" });
  }

  function goPrev() {
    instant(() => {
      const st = step();
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      track.scrollLeft += st;
    });
    requestAnimationFrame(() =>
      track.scrollTo({ left: 0, behavior: "smooth" })
    );
  }

  function jumpTo(i) {
    const pos = Array.from(track.children).findIndex((c) => Number(c.dataset.i) === i);
    if (pos <= 0) return;
    instant(() => {
      for (let n = 0; n < pos; n++) track.appendChild(track.firstElementChild);
      track.scrollLeft = 0;
    });
    update();
  }

  function update() {
    const first = track.children[currentIndex()];
    const act = first ? Number(first.dataset.i) : 0;
    dots.forEach((d, k) => d.classList.toggle("is-active", k === act));
  }

  let settle = 0;
  track.addEventListener("scroll", () => {
    update();
    clearTimeout(settle);
    settle = setTimeout(() => { if (!down) normalise(); update(); }, 140);
  }, { passive: true });
  window.addEventListener("resize", update);

  prev.addEventListener("click", goPrev);
  next.addEventListener("click", goNext);
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
  });

  // Mouse drag (touch already swipes natively)
  let down = false, startX = 0, startLeft = 0, moved = 0;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true; moved = 0;
    startX = e.clientX; startLeft = track.scrollLeft;
    track.classList.add("is-dragging");
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    track.scrollLeft = startLeft - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    track.classList.remove("is-dragging");
    track.scrollTo({ left: currentIndex() * step(), behavior: "smooth" });
  });
  // A drag should not open a certificate link
  track.addEventListener("click", (e) => {
    if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; }
  }, true);
  track.addEventListener("dragstart", (e) => e.preventDefault());

  // ---- Auto-advance: always slides the same way, round and round ----
  const AUTO_MS = 4000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;
  let inView = false;
  let hovering = false;

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function start() {
    if (reduceMotion || timer || !inView || hovering || down || document.hidden) return;
    timer = setInterval(() => {
      if (performance.now() - lastScrollAt < 1500) return;
      goNext();
    }, AUTO_MS);
  }

  function restart() { stop(); start(); }

  wrap.addEventListener("mouseenter", () => { hovering = true; stop(); });
  wrap.addEventListener("mouseleave", () => { hovering = false; start(); });
  wrap.addEventListener("focusin", () => { hovering = true; stop(); });
  wrap.addEventListener("focusout", () => { hovering = false; start(); });
  track.addEventListener("touchstart", stop, { passive: true });
  track.addEventListener("touchend", () => setTimeout(start, 2500), { passive: true });
  [prev, next].forEach((b) => b.addEventListener("click", restart));
  dotsBox.addEventListener("click", restart);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      inView ? start() : stop();
    }, { threshold: 0.3 }).observe(wrap);
  } else {
    inView = true;
    start();
  }

  update();
})();
