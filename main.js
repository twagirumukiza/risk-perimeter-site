(function () {
  "use strict";

  const html = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  const storedLang = localStorage.getItem("lang") || "fr";
  const storedFont = localStorage.getItem("fontScale");

  // Theme
  if (storedTheme) {
    html.setAttribute("data-theme", storedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    html.setAttribute("data-theme", "dark");
  }

  // Font size
  if (storedFont) {
    html.style.setProperty("--base-size", storedFont);
  }

  // Language
  setLanguage(storedLang);

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // Font size controls
  const fontDecrease = document.getElementById("fontDecrease");
  const fontReset = document.getElementById("fontReset");
  const fontIncrease = document.getElementById("fontIncrease");

  function getCurrentScale() {
    return parseFloat(getComputedStyle(html).getPropertyValue("--base-size")) || 1;
  }

  if (fontDecrease) {
    fontDecrease.addEventListener("click", () => {
      const scale = Math.max(0.85, getCurrentScale() - 0.05);
      html.style.setProperty("--base-size", scale + "rem");
      localStorage.setItem("fontScale", scale + "rem");
    });
  }
  if (fontIncrease) {
    fontIncrease.addEventListener("click", () => {
      const scale = Math.min(1.25, getCurrentScale() + 0.05);
      html.style.setProperty("--base-size", scale + "rem");
      localStorage.setItem("fontScale", scale + "rem");
    });
  }
  if (fontReset) {
    fontReset.addEventListener("click", () => {
      html.style.setProperty("--base-size", "1rem");
      localStorage.removeItem("fontScale");
    });
  }

  // Language switch
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      localStorage.setItem("lang", lang);
    });
  });

  function setLanguage(lang) {
    const dict = translations[lang] || translations.fr;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        // Preserve line breaks for conclusion
        if (key === "conclusion.final") {
          el.innerHTML = dict[key].replace(/\n/g, "<br />");
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update active state
    document.querySelectorAll(".lang-btn").forEach((b) => {
      const isActive = b.dataset.lang === lang;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", isActive);
    });

    html.setAttribute("lang", lang);
  }

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.querySelector(".main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open);
    });

    // Close on link click
    mainNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth active nav (optional enhancement)
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav a");

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
})();
