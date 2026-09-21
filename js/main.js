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
        if (key === "conclusion.final") {
          el.innerHTML = dict[key].replace(/\n/g, "<br />");
        } else {
          el.textContent = dict[key];
        }
      }
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
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

  // ===== FAQ accordion =====
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("open");

      // Close others (optional – single open)
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-answer").hidden = true;
          openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("open", !isOpen);
      answer.hidden = isOpen;
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // ===== Share =====
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);
  const shareText = encodeURIComponent(
    document.documentElement.lang === "en"
      ? "The risk perimeter is no longer the IS — a GRC reflection by Innocent TWAGIRUMUKIZA"
      : "Le périmètre de risque n’est plus le SI — une réflexion GRC d’Innocent TWAGIRUMUKIZA"
  );

  const shareUrls = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
    x: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    whatsapp: `https://wa.me/?text=${shareText}%20${pageUrl}`,
    telegram: `https://t.me/share/url?url=${pageUrl}&text=${shareText}`,
    reddit: `https://reddit.com/submit?url=${pageUrl}&title=${pageTitle}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${shareText}`,
    teams: `https://teams.microsoft.com/share?href=${pageUrl}&msgText=${shareText}`
  };

  document.querySelectorAll("[data-share]").forEach((btn) => {
    const network = btn.getAttribute("data-share");
    if (shareUrls[network]) {
      btn.href = shareUrls[network];
    }
  });

  function showFeedback(msg) {
    const el = document.getElementById("copyFeedback");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    setTimeout(() => { el.hidden = true; }, 2500);
  }

  function getLangDict() {
    const lang = document.documentElement.lang || "fr";
    return (typeof translations !== "undefined" && translations[lang]) ? translations[lang] : {};
  }

  // Copy link
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const dict = getLangDict();
        showFeedback(dict["share.linkCopied"] || "Lien copié !");
      } catch (e) {
        prompt("Copiez ce lien :", window.location.href);
      }
    });
  }

  // Copy embed code
  const copyEmbedBtn = document.getElementById("copyEmbedBtn");
  if (copyEmbedBtn) {
    copyEmbedBtn.addEventListener("click", async () => {
      const title = document.querySelector("h1")?.textContent || document.title;
      const embed = `<!-- Réflexion GRC – Innocent TWAGIRUMUKIZA -->
<blockquote cite="${window.location.href}">
  <p><strong>${title}</strong></p>
  <p>Le périmètre de risque n’est plus le SI. C’est l’écosystème.</p>
  <footer>
    <cite><a href="${window.location.href}">Lire la réflexion complète</a> — Innocent TWAGIRUMUKIZA, Cybersecurity &amp; Risk Management Consultant</cite>
  </footer>
</blockquote>`;
      try {
        await navigator.clipboard.writeText(embed);
        const dict = getLangDict();
        showFeedback(dict["share.copied"] || "Copié !");
      } catch (e) {
        prompt("Code d’intégration :", embed);
      }
    });
  }

  // Copy article text (main content)
  const copyTextBtn = document.getElementById("copyTextBtn");
  if (copyTextBtn) {
    copyTextBtn.addEventListener("click", async () => {
      const main = document.getElementById("main");
      const text = main ? main.innerText.replace(/\n{3,}/g, "\n\n").trim() : "";
      const full = text + "\n\n— Innocent TWAGIRUMUKIZA\n" + window.location.href;
      try {
        await navigator.clipboard.writeText(full);
        const dict = getLangDict();
        showFeedback(dict["share.copied"] || "Copié !");
      } catch (e) {
        prompt("Texte de l’article :", full);
      }
    });
  }
})();
