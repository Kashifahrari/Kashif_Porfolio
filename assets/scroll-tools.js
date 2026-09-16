/**
 * ===================================================
 * SCROLL PROGRESS, ACTIVE NAV & ONE-CLICK COPY ENGINE
 * ===================================================
 */

(function () {
  // Inject self-contained styles so subpages are 100% styled independently
  function injectScrollStyles() {
    if (document.getElementById("scrollToolsStyles")) return;
    const style = document.createElement("style");
    style.id = "scrollToolsStyles";
    style.textContent = `
      .scroll-top-wrap {
        position: fixed !important;
        bottom: 2.5rem !important;
        right: 2.5rem !important;
        z-index: 99990 !important;
        width: 48px !important;
        height: 48px !important;
        cursor: pointer !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transform: translateY(20px) scale(0.9) !important;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 171, 240, 0.2) !important;
        background: transparent !important;
        user-select: none !important;
      }
      .scroll-top-wrap.visible {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) scale(1) !important;
      }
      .scroll-top-wrap:hover {
        transform: translateY(-4px) scale(1.08) !important;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 171, 240, 0.4) !important;
      }
      .scroll-progress-svg {
        position: absolute !important;
        inset: 0 !important;
        width: 48px !important;
        height: 48px !important;
        transform: rotate(-90deg) !important;
        border-radius: 50% !important;
        overflow: hidden !important;
      }
      .scroll-progress-bg {
        fill: #081b29 !important;
        stroke: rgba(0, 171, 240, 0.25) !important;
        stroke-width: 3.5 !important;
      }
      .light-theme .scroll-progress-bg {
        fill: #ffffff !important;
        stroke: rgba(2, 132, 199, 0.25) !important;
      }
      .scroll-progress-bar {
        fill: none !important;
        stroke: #00abf0 !important;
        stroke-width: 3.5 !important;
        stroke-linecap: round !important;
        transition: stroke-dashoffset 0.1s ease-out !important;
      }
      .light-theme .scroll-progress-bar {
        stroke: #0284c7 !important;
      }
      .scroll-top-icon {
        position: relative !important;
        z-index: 2 !important;
        font-size: 24px !important;
        color: #00abf0 !important;
        transition: transform 0.25s ease !important;
        line-height: 1 !important;
        display: inline-block !important;
      }
      .light-theme .scroll-top-icon {
        color: #0284c7 !important;
      }
      .scroll-top-wrap:hover .scroll-top-icon {
        transform: translateY(-2px) !important;
      }

      /* Copy Toast */
      .cyber-toast-container {
        position: fixed !important;
        top: 2.5rem !important;
        left: 50% !important;
        transform: translateX(-50%) translateY(-30px) !important;
        z-index: 1000000 !important;
        pointer-events: none !important;
        opacity: 0 !important;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      .cyber-toast-container.active {
        opacity: 1 !important;
        transform: translateX(-50%) translateY(0) !important;
      }
      .cyber-toast {
        display: inline-flex !important;
        align-items: center !important;
        gap: 1.2rem !important;
        padding: 1.2rem 2.2rem !important;
        background: rgba(8, 27, 41, 0.95) !important;
        border: 1.5px solid #10b981 !important;
        border-radius: 3rem !important;
        color: #ffffff !important;
        font-family: 'Poppins', sans-serif !important;
        font-size: 1.4rem !important;
        font-weight: 600 !important;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.35) !important;
        backdrop-filter: blur(15px) !important;
        -webkit-backdrop-filter: blur(15px) !important;
      }
      .cyber-toast i {
        font-size: 2rem !important;
        color: #10b981 !important;
      }
      .cyber-toast-highlight {
        color: #ffd166 !important;
        font-family: monospace !important;
        font-size: 1.3rem !important;
      }
    `;
    document.head.appendChild(style);
  }

  injectScrollStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  function initAll() {
    injectScrollStyles();
    initScrollToTop();
    initCopyToast();
    initActiveNavScrollSpy();
  }

  /* ===================================================
     1. SCROLL-TO-TOP PROGRESS RING BUTTON
     =================================================== */
  function initScrollToTop() {
    if (document.getElementById("scrollTopBtn")) return;

    const btn = document.createElement("div");
    btn.id = "scrollTopBtn";
    btn.className = "scroll-top-wrap";
    btn.setAttribute("title", "Scroll back to top");
    btn.setAttribute("role", "button");
    btn.setAttribute("aria-label", "Scroll back to top");

    btn.innerHTML = `
      <svg class="scroll-progress-svg" width="48" height="48" viewBox="0 0 48 48" style="position: absolute; inset: 0; width: 48px; height: 48px; transform: rotate(-90deg); border-radius: 50%;">
        <circle class="scroll-progress-bg" cx="24" cy="24" r="22" />
        <circle class="scroll-progress-bar" id="scrollProgressBar" cx="24" cy="24" r="22" />
      </svg>
      <i class="bx bx-chevron-up scroll-top-icon"></i>
    `;

    document.body.appendChild(btn);

    const progressBar = document.getElementById("scrollProgressBar");
    const circumference = 2 * Math.PI * 22; // ~138.23

    if (progressBar) {
      progressBar.style.strokeDasharray = `${circumference}`;
      progressBar.style.strokeDashoffset = `${circumference}`;
    }

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollTop > 200) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }

      if (docHeight > 0 && progressBar) {
        const progress = scrollTop / docHeight;
        const offset = circumference - progress * circumference;
        progressBar.style.strokeDashoffset = `${Math.max(0, offset)}`;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* ===================================================
     2. ONE-CLICK COPY TO CLIPBOARD & TOAST
     =================================================== */
  function initCopyToast() {
    let toastContainer = document.getElementById("cyberToastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "cyberToastContainer";
      toastContainer.className = "cyber-toast-container";
      document.body.appendChild(toastContainer);
    }

    let toastTimer = null;

    window.showCyberToast = function (textToCopy, label) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        toastContainer.innerHTML = `
          <div class="cyber-toast">
            <i class="bx bx-check-circle"></i>
            <span>Copied <strong class="cyber-toast-highlight">${label || textToCopy}</strong> to clipboard! ✓</span>
          </div>
        `;
        toastContainer.classList.add("active");

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toastContainer.classList.remove("active");
        }, 2800);
      }).catch((err) => {
        console.warn("Clipboard copy failed:", err);
      });
    };

    // Auto-attach to mailto and tel links or data-copy attributes
    document.addEventListener("click", (e) => {
      const target = e.target.closest("a[href^='mailto:'], a[href^='tel:'], [data-copy]");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const copyVal = target.getAttribute("data-copy");

      if (copyVal) {
        e.preventDefault();
        window.showCyberToast(copyVal, target.getAttribute("data-copy-label") || copyVal);
      } else if (href.startsWith("mailto:")) {
        const email = href.replace("mailto:", "").split("?")[0];
        window.showCyberToast(email, "Email Address");
      } else if (href.startsWith("tel:")) {
        const phone = href.replace("tel:", "");
        window.showCyberToast(phone, "Phone Number");
      }
    });
  }

  /* ===================================================
     3. SMART ACTIVE SECTION SCROLL SPY IN NAVBAR
     =================================================== */
  function initActiveNavScrollSpy() {
    const navLinks = document.querySelectorAll(".navbar a[href^='#']");
    if (!navLinks.length) return;

    const sections = [];
    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href").slice(1);
      const section = document.getElementById(targetId);
      if (section) {
        sections.push({ id: targetId, el: section, link: link });
      }
    });

    if (!sections.length) return;

    window.addEventListener("scroll", () => {
      const scrollPos = window.scrollY + 200;

      let currentSection = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPos >= sections[i].el.offsetTop) {
          currentSection = sections[i];
          break;
        }
      }

      if (currentSection) {
        navLinks.forEach((l) => l.classList.remove("active"));
        currentSection.link.classList.add("active");
      } else if (window.scrollY < 200) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const homeLink = document.querySelector(".navbar a[href='#home'], .navbar a[href='#']");
        if (homeLink) homeLink.classList.add("active");
      }
    }, { passive: true });
  }

  // Global Keyboard Shortcut: Press 'T' to toggle theme
  document.addEventListener("keydown", (e) => {
    if (e.key === "t" || e.key === "T") {
      if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
        return;
      }
      const toggle = document.getElementById("theme-toggle");
      if (toggle) {
        toggle.click();
        if (window.showCyberToast) {
          const isLight = document.documentElement.classList.contains("light-theme");
          window.showCyberToast(isLight ? "Light Mode ☀️" : "Dark Mode 🌙", "Theme Switched");
        }
      }
    }
  });
})();
