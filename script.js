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

    "footer.rights": "All rights reserved.",
  },

  ru: {
    "meta.title": "Дилшод Улмасов — Портфолио",
    "meta.description":
      "Дилшод Улмасов — студент Computer Science и веб-разработчик из Лондона.",
    "lang.label": "Язык",

    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.skills": "Навыки",
    "nav.education": "Образование",
    "nav.certificates": "Сертификаты",
    "nav.contact": "Контакты",
    "nav.toggle": "Открыть или закрыть меню",

    "hero.title": "Студент Computer Science и разработчик",
    "hero.tagline":
      "Создаю аккуратное, продуманное ПО — превращаю сложные задачи в интерфейсы, которыми легко и понятно пользоваться.",
    "hero.ctaContact": "Связаться со мной",

    "about.eyebrow": "Обо мне",
    "about.heading": "Кто я",
    "about.p1":
      "Я студент направления Computer Science в Pathway College при Brunel University London, живу в Лондоне и всё больше сосредотачиваюсь на веб-разработке. В вебе меня привлекает сочетание логики и мастерства: страница должна не только правильно работать, но и ощущаться правильно. Мне нравится находиться именно на этом стыке — превращать идею в то, что люди могут открыть и реально использовать.",
    "about.p2":
      "Большую часть знаний я получил на практике: создавал сайты с нуля, решал задачи вёрстки и интерактивности и освоил инструменты, которые делают разработку устойчивой, — Git и принципы адаптивного дизайна. Для меня важно писать код, к которому легко вернуться, и делать интерфейсы, которые не мешают пользователю. Я всегда ищу следующий проект, который расширит границы моих возможностей.",

    "skills.eyebrow": "Навыки",
    "skills.heading": "С чем я работаю",
    "tag.markup": "Разметка",
    "tag.styling": "Стилизация",
    "tag.language": "Язык",
    "tag.framework": "Фреймворк",
    "tag.tooling": "Инструменты",
    "tag.practice": "Практика",
    "skill.responsive": "Адаптивный дизайн",
    "skill.uiux": "UI / UX-дизайн",


    "edu.eyebrow": "Образование",
    "edu.heading": "Где я учусь",
    "edu.program": "Computer Science",
    "edu.location": "Лондон, Великобритания",
    "edu.status": "Учусь сейчас",

    "certs.eyebrow": "Сертификаты",
    "certs.heading": "Пройденные курсы",
    "certs.type": "Онлайн-курс",
    "certs.issued": "Выдан",
    "certs.date": "Июль 2026",
    "certs.id": "ID сертификата",
    "certs.view": "Открыть сертификат",
    "certs.note": "Откроется официальная страница HP LIFE, где любой может проверить сертификат.",
    "c1.desc":
      "Ключевые практики, методы и инструменты науки о данных и аналитики, преимущества и сложности подхода, основанного на данных, для бизнеса, а также основные навыки для карьеры в этой сфере.",
    "c2.desc":
      "Значение нетворкинга для карьерного роста, практические стратегии построения связей, роль личного бренда и цифровые инструменты для уверенного развития профессиональной сети контактов.",

    "contact.eyebrow": "Контакты",
    "contact.heading": "Связаться со мной",
    "contact.social": "Или найдите меня здесь",
    "form.name": "Имя",
    "form.namePh": "Ваше имя",
    "form.email": "Эл. почта",
    "form.message": "Сообщение",
    "form.messagePh": "О чём вы хотите написать?",
    "form.submit": "Отправить сообщение",
    "form.success": "Спасибо, {name}! Я скоро вам отвечу.",
    "form.successNoName": "Спасибо! Я скоро вам отвечу.",
    "form.sending": "Отправка...",
    "form.error": "Что-то пошло не так. Попробуйте ещё раз.",

    "footer.rights": "Все права защищены.",
  },

  uz: {
    "meta.title": "Dilshod Ulmasov — Portfolio",
    "meta.description":
      "Dilshod Ulmasov — Londonda tahsil olayotgan Kompyuter fanlari talabasi va veb-dasturchi.",
    "lang.label": "Til",

    "nav.home": "Bosh sahifa",
    "nav.about": "Men haqimda",
    "nav.skills": "Ko‘nikmalar",
    "nav.education": "Ta’lim",
    "nav.certificates": "Sertifikatlar",
    "nav.contact": "Aloqa",
    "nav.toggle": "Menyuni ochish yoki yopish",

    "hero.title": "Kompyuter fanlari talabasi va dasturchi",
    "hero.tagline":
      "Toza va puxta o‘ylangan dasturlar yarataman — murakkab muammolarni foydalanish oson va tushunarli interfeyslarga aylantiraman.",
    "hero.ctaContact": "Bog‘lanish",

    "about.eyebrow": "Men haqimda",
    "about.heading": "Men kimman",
    "about.p1":
      "Men Brunel University London qoshidagi Pathway College’da Kompyuter fanlari yo‘nalishida tahsil olaman, Londonda yashayman va asosiy e’tiborimni veb-dasturlashga qaratyapman. Vebning menga yoqadigan tomoni — unda mantiq va mahorat birlashadi: sahifa nafaqat to‘g‘ri ishlashi, balki qulay ham bo‘lishi kerak. Men aynan shu nuqtada ishlashni yaxshi ko‘raman — g‘oyani odamlar haqiqatan ham ochib, foydalana oladigan mahsulotga aylantirishni.",
    "about.p2":
      "Bilimlarimning aksariyatini amaliyot orqali egallaganman: saytlarni noldan yaratdim, sahifa tuzilishi va interaktivlik bilan bog‘liq muammolarni hal qildim, Git va moslashuvchan dizayn tamoyillari kabi ishni barqaror qiladigan vositalarni o‘zlashtirdim. Keyinchalik qaytib ishlash oson bo‘lgan kod yozishga va foydalanuvchiga xalaqit bermaydigan interfeyslar yaratishga intilaman. Doimo imkoniyatlarimni kengaytiradigan navbatdagi loyihani izlayman.",

    "skills.eyebrow": "Ko‘nikmalar",
    "skills.heading": "Qaysi texnologiyalar bilan ishlayman",
    "tag.markup": "Belgilash tili",
    "tag.styling": "Uslublar",
    "tag.language": "Dasturlash tili",
    "tag.framework": "Freymvork",
    "tag.tooling": "Vositalar",
    "tag.practice": "Amaliyot",
    "skill.responsive": "Moslashuvchan dizayn",
    "skill.uiux": "UI / UX dizayn",


    "edu.eyebrow": "Ta’lim",
    "edu.heading": "Qayerda o‘qiyman",
    "edu.program": "Kompyuter fanlari",
    "edu.location": "London, Buyuk Britaniya",
    "edu.status": "Hozirda o‘qiyapman",

    "certs.eyebrow": "Sertifikatlar",
    "certs.heading": "Tugatgan kurslarim",
    "certs.type": "Onlayn kurs",
    "certs.issued": "Berilgan sana",
    "certs.date": "2026-yil, iyul",
    "certs.id": "Sertifikat raqami",
    "certs.view": "Sertifikatni ko‘rish",
    "certs.note": "HP LIFE rasmiy sahifasi ochiladi — u yerda istalgan kishi sertifikatni tekshira oladi.",
    "c1.desc":
      "Ma’lumotlar fani va tahlilining asosiy amaliyotlari, usullari va vositalari, biznes uchun ma’lumotlarga asoslangan yondashuvning afzalliklari va qiyinchiliklari hamda bu sohada karyera qurish uchun zarur ko‘nikmalar.",
    "c2.desc":
      "Karyera o‘sishida networkingning ahamiyati, aloqalar o‘rnatishning amaliy strategiyalari, shaxsiy brendning roli va professional aloqalar tarmog‘ini ishonch bilan kengaytirish uchun raqamli vositalar.",

    "contact.eyebrow": "Aloqa",
    "contact.heading": "Men bilan bog‘laning",
    "contact.social": "Yoki meni bu yerda toping",
    "form.name": "Ism",
    "form.namePh": "Ismingiz",
    "form.email": "Elektron pochta",
    "form.message": "Xabar",
    "form.messagePh": "Xabaringizni yozing",
    "form.submit": "Xabarni yuborish",
    "form.success": "Rahmat, {name}! Tez orada sizga javob beraman.",
    "form.successNoName": "Rahmat! Tez orada sizga javob beraman.",
    "form.sending": "Yuborilmoqda...",
    "form.error": "Xatolik yuz berdi. Qayta urinib ko‘ring.",

    "footer.rights": "Barcha huquqlar himoyalangan.",
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

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === currentLang));
  });

  renderSuccessMessage();
}

function detectInitialLanguage() {
  // 1. ?lang=ru in the URL (handy for sharing a link in a specific language)
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (SUPPORTED_LANGS.includes(fromUrl)) return fromUrl;

  // 2. The browser's language
  for (const browserLang of navigator.languages || [navigator.language]) {
    const code = (browserLang || "").slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(code)) return code;
  }

  return "en";
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

applyLanguage(detectInitialLanguage());

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

  
