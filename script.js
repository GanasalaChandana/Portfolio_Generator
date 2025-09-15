/* ============================
   Portfolio: script.js
   ============================ */

/** Toggle this:
 *  - false → buttons use real links (projects opens URL, contact opens mailto)
 *  - true  → buttons open the on-page modals
 */
const USE_MODALS = false;

// ---------- Utilities ----------
function safeParseJSON(text) {
  try { return JSON.parse(text); } catch { return null; }
}
function deepMerge(target, source) {
  if (!source || typeof source !== "object") return target;
  const out = Array.isArray(target) ? [...target] : { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = deepMerge(target[k] || {}, v);
    } else {
      out[k] = v;
    }
  }
  return out;
}
function getQueryParams() {
  const p = new URLSearchParams(location.search);
  const val = (k) => (p.get(k) || "").trim();
  const q = {
    name: val("name"),
    title: val("title"),
    description: val("description") || val("desc"),
    email: val("email"),
    projects: val("projects"),
    contact: val("contact"),
    linkedin: val("linkedin"),
    github: val("github"),
    website: val("website"),
    save: val("save"),
  };
  Object.keys(q).forEach((k) => !q[k] && delete q[k]);
  return q;
}
function toMailto(email) {
  return email ? `mailto:${email}` : null;
}

// ---------- Load Config (JSON tag → localStorage → URL params override) ----------
const DEFAULT_CONFIG = {
  profile: {
    name: "Your Name",
    title: "Your Title",
    description: "Short professional summary.",
    email: "you@example.com",
  },
  links: {
    projects: "https://example.com",
    contact: "mailto:you@example.com",
  },
  projects: [], // optional: [{title, description, technologies: []}]
};

function loadBaseConfig() {
  const tag = document.getElementById("portfolio-config");
  const fromTag = tag ? safeParseJSON(tag.textContent) : null;

  const stored = safeParseJSON(localStorage.getItem("portfolioConfig"));

  let cfg = deepMerge(DEFAULT_CONFIG, fromTag || {});
  cfg = deepMerge(cfg, stored || {});

  const q = getQueryParams();
  if (Object.keys(q).length) {
    cfg.profile.name = q.name || cfg.profile.name;
    cfg.profile.title = q.title || cfg.profile.title;
    cfg.profile.description = q.description || cfg.profile.description;
    cfg.profile.email = q.email || cfg.profile.email;

    const projectsUrl = q.projects || q.github || q.website || cfg.links.projects;
    let contactUrl = q.contact || q.linkedin || cfg.links.contact;
    if (!contactUrl) contactUrl = toMailto(cfg.profile.email);

    cfg.links.projects = projectsUrl;
    cfg.links.contact = contactUrl;

    if (q.save === "1" || q.save === "true") {
      localStorage.setItem("portfolioConfig", JSON.stringify(cfg));
    }
  }

  return cfg;
}

let CONFIG;

// ---------- Init ----------
function initializePortfolio() {
  console.log("[portfolio] initializePortfolio()");
  CONFIG = loadBaseConfig();
  loadConfiguration();
  setupEventListeners();
  loadProjects();
}

// Apply config to DOM
function loadConfiguration() {
  const c = CONFIG;

  const nameEl = document.querySelector('[data-config="profile.name"]');
  const titleEl = document.querySelector('[data-config="profile.title"]');
  const descEl = document.querySelector('[data-config="profile.description"]');

  if (nameEl) nameEl.textContent = c.profile.name;
  if (titleEl) titleEl.textContent = c.profile.title;
  if (descEl) descEl.textContent = c.profile.description;

  const projectsLink = document.getElementById("projectsLink");
  const contactLink  = document.getElementById("contactLink");

  // Projects button/link
  if (projectsLink && c.links.projects) {
    projectsLink.href = c.links.projects;
    if (/^https?:\/\//i.test(c.links.projects)) {
      projectsLink.target = "_blank";
      projectsLink.rel = "noopener noreferrer";
    } else {
      projectsLink.removeAttribute("target");
      projectsLink.removeAttribute("rel");
    }
  }

  // Contact button/link
  if (contactLink) {
    const contactUrl = c.links.contact || toMailto(c.profile.email);
    if (contactUrl) contactLink.href = contactUrl;

    if (/^https?:\/\//i.test(contactUrl)) {
      contactLink.target = "_blank";
      contactLink.rel = "noopener noreferrer";
    } else {
      contactLink.removeAttribute("target");
      contactLink.removeAttribute("rel");
    }
  }

  // Log final resolved URLs for quick debugging
  console.log("[portfolio] links:", {
    projects: projectsLink ? projectsLink.getAttribute("href") : null,
    contact: contactLink ? contactLink.getAttribute("href") : null,
  });
}

// Listeners (modals + contact form)
function setupEventListeners() {
  // Close buttons
  document.querySelectorAll(".close").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  // Optional: intercept buttons to open modals
  const projectsLink = document.getElementById("projectsLink");
  const contactLink  = document.getElementById("contactLink");

  if (USE_MODALS && projectsLink) {
    projectsLink.addEventListener("click", (e) => {
      e.preventDefault();
      showModal("projectsModal");
    });
  }
  if (USE_MODALS && contactLink) {
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      showModal("contactModal");
    });
  }

  // Contact form submit → mailto
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }

  // Click outside modal to close
  document.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("modal")) {
      closeAllModals();
    }
  });

  // Esc to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });
}

// Populate projects (optional)
function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid || !Array.isArray(CONFIG.projects)) return;

  grid.innerHTML = CONFIG.projects
    .map((p) => {
      const tags = (p.technologies || [])
        .map((t) => `<span class="tech-tag">${t}</span>`)
        .join("");
      return `
        <div class="project-card">
          <div class="project-title">${p.title || ""}</div>
          <div class="project-description">${p.description || ""}</div>
          <div class="tech-tags">${tags}</div>
        </div>`;
    })
    .join("");
}

// Modals
function showModal(id) {
  closeAllModals();
  const m = document.getElementById(id);
  if (!m) return;
  m.style.display = "block";
  m.classList.add("show");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const closeBtn = m.querySelector(".close");
  if (closeBtn) closeBtn.focus();
}
function closeAllModals() {
  document.querySelectorAll(".modal").forEach((m) => {
    m.style.display = "none";
    m.classList.remove("show");
    m.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

// Contact form → mailto target email
function handleContactSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
  const to = CONFIG?.profile?.email || "you@example.com";
  const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

  try {
    window.location.href = mailto;
    closeAllModals();
    e.target.reset();
    setTimeout(() => alert("Email client opened! Your message has been prepared."), 400);
  } catch (err) {
    console.error("Email open failed:", err);
    alert("Unable to open email client. Please email: " + to);
  }
}

// Public helpers (optional)
window.updatePortfolioConfig = function (newConfig) {
  CONFIG = deepMerge(CONFIG, newConfig || {});
  localStorage.setItem("portfolioConfig", JSON.stringify(CONFIG));
  loadConfiguration();
  loadProjects();
};
window.getShareURL = function () {
  const q = new URLSearchParams();
  q.set("name", CONFIG.profile.name);
  q.set("title", CONFIG.profile.title);
  q.set("desc", CONFIG.profile.description);
  q.set("email", CONFIG.profile.email);
  if (CONFIG.links.projects) q.set("projects", CONFIG.links.projects);
  if (CONFIG.links.contact) q.set("contact", CONFIG.links.contact);
  return `${location.origin}${location.pathname}?${q.toString()}`;
};

// ---------- Boot (safe, idempotent) ----------
console.log("[portfolio] script loaded");
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[portfolio] DOM ready");
    initializePortfolio();
  });
} else {
  console.log("[portfolio] DOM already ready");
  initializePortfolio();
}
