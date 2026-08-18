/**
 * ===================================================
 * DEV LOG & MILESTONE ROADMAP - ADVANCED INTERACTIONS
 * ===================================================
 */

// Default Seed Data
const DEFAULT_LOGS = [
  {
    id: "log-1",
    date: "2026-08-18",
    category: "fullstack",
    categoryLabel: "Full-Stack Web 💻",
    title: "CBSE Aakalan (CBA Platform) - Rich Question Authoring & PDF Export",
    highlights: [
      "Engineered automated question banking with rich formula authoring and Excel bulk import at Dhira Software Labs.",
      "Implemented client-side PDF export for official print-ready question papers and blueprints using jsPDF.",
      "Integrated TanStack Query for optimal server-state caching and built silent JWT refresh interceptors."
    ],
    tech: ["React 19", "TypeScript", "Vite", "TanStack Query", "Tailwind CSS", "jsPDF"],
    link: "https://github.com/Kashifahrari"
  },
  {
    id: "log-2",
    date: "2026-08-17",
    category: "fullstack",
    categoryLabel: "Full-Stack Web 💻",
    title: "Interactive Canvas Frontend Modules using React Flow",
    highlights: [
      "Built custom draggable node interfaces and animated dynamic bezier edges using @xyflow/react.",
      "Integrated state persistence in localStorage and created node CRUD creation/deletion engine.",
      "Engineered node-to-feed event bus connecting canvas milestones to daily dev logs."
    ],
    tech: ["React Flow", "React 19", "JavaScript (ES6+)", "CSS3 Glassmorphism"],
    link: "https://github.com/Kashifahrari"
  },
  {
    id: "log-3",
    date: "2026-08-16",
    category: "backend",
    categoryLabel: "Backend & APIs ⚡",
    title: "Node.js REST API & Database Query Optimization (SM Web Solutions)",
    highlights: [
      "Designed and optimized SQL queries to improve database performance across MySQL and MongoDB.",
      "Built robust RESTful endpoints with Express.js, structured error handlers, and input validation schemas.",
      "Integrated secure authentication with session management and Passport.js."
    ],
    tech: ["Node.js", "Express", "MySQL", "MongoDB", "REST APIs"],
    link: "https://github.com/Kashifahrari"
  },
  {
    id: "log-4",
    date: "2026-08-15",
    category: "dsa",
    categoryLabel: "DSA & Logic 🧠",
    title: "Solved Advanced Graph BFS/DFS & Dynamic Programming in Java",
    highlights: [
      "Solved LeetCode 200 (Number of Islands) and Dijkstra's Shortest Path algorithm in Java.",
      "Implemented 0/1 Knapsack & Longest Common Subsequence (LCS) with space optimization.",
      "Strengthened time-complexity bounds (Big-O analysis) for high-scale enterprise computing."
    ],
    tech: ["Java", "DSA", "Graphs", "Dynamic Programming", "LeetCode"],
    link: "https://www.geeksforgeeks.org/user/kashifahrari/"
  },
  {
    id: "log-5",
    date: "2026-08-14",
    category: "learning",
    categoryLabel: "Research & Notes 📚",
    title: "Published Technical Article on GeeksforGeeks (Surpassed 61,000+ Readers)",
    highlights: [
      "Published in-depth technical guide on JavaScript HTML DOM manipulation and Event Flow architecture.",
      "Article reached 61,000+ global readers with high community engagement.",
      "Explored AI productivity workflows with GitHub Copilot and LLM prompt engineering."
    ],
    tech: ["GeeksforGeeks", "Technical Authoring", "JavaScript", "AI Velocity"],
    link: "https://www.geeksforgeeks.org/javascript-html-dom/"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initMobileNavbar();
  init3DTilt();
  initDevLogSystem();

  // Stealth Access: Press Ctrl + Shift + K to open private 24 LPA portal
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "K" || e.key === "k")) {
      e.preventDefault();
      window.location.href = "../roadmap-24lpa/index.html";
    }
  });

  // Stealth Double-Click on status badge
  const statusBadge = document.querySelector(".status-badge");
  if (statusBadge) {
    statusBadge.addEventListener("dblclick", () => {
      window.location.href = "../roadmap-24lpa/index.html";
    });
  }
});

/* ===================================================
   1. PARTICLES.JS INITIALIZATION
   =================================================== */
function initParticles() {
  if (typeof window.particlesJS === "function" && document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 65, density: { enable: true, value_area: 800 } },
        color: { value: "#00abf0" },
        shape: { type: "circle" },
        opacity: { value: 0.45, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 140,
          color: "#00abf0",
          opacity: 0.35,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.8,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 150, line_linked: { opacity: 0.6 } },
          push: { particles_nb: 3 },
        },
      },
      retina_detect: true,
    });
  }
}

/* ===================================================
   2. MOBILE NAVBAR TOGGLE
   =================================================== */
function initMobileNavbar() {
  const menuIcon = document.getElementById("menu-icon");
  const navbar = document.querySelector(".navbar");

  if (menuIcon && navbar) {
    menuIcon.onclick = () => {
      menuIcon.classList.toggle("bx-x");
      navbar.classList.toggle("active");
    };

    document.querySelectorAll(".navbar a").forEach((link) => {
      link.addEventListener("click", () => {
        menuIcon.classList.remove("bx-x");
        navbar.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
        menuIcon.classList.remove("bx-x");
        navbar.classList.remove("active");
      }
    });
  }
}

/* ===================================================
   3. DEV LOG & MODAL ENGINE
   =================================================== */
function initDevLogSystem() {
  const logsFeed = document.getElementById("logsFeed");
  const openModalBtn = document.getElementById("openLogModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const modalOverlay = document.getElementById("postModalOverlay");
  const progressForm = document.getElementById("progressForm");
  const exportBtn = document.getElementById("exportLogsBtn");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const flowNodes = document.querySelectorAll(".flow-node");
  const dateInput = document.getElementById("logDate");

  // Set default date to today
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  // Load custom logs from localStorage or fallback
  let customLogs = [];
  try {
    const saved = localStorage.getItem("kashif_dev_logs");
    if (saved) customLogs = JSON.parse(saved);
  } catch (e) {
    customLogs = [];
  }

  let allLogs = [...customLogs, ...DEFAULT_LOGS];

  // Render logs
  function renderLogs(filter = "all") {
    if (!logsFeed) return;
    logsFeed.innerHTML = "";

    const filtered = allLogs.filter((log) => {
      if (filter === "all") return true;
      return log.category === filter;
    });

    if (filtered.length === 0) {
      logsFeed.innerHTML = `
        <div class="glass-card" style="padding: 4rem; text-align: center; color: var(--text-muted);">
          <i class="bx bx-folder-open" style="font-size: 4rem; color: var(--main-color); margin-bottom: 1rem; display: block;"></i>
          <h3>No logs found in this category yet.</h3>
        </div>
      `;
      return;
    }

    filtered.forEach((log) => {
      const card = document.createElement("div");
      card.className = "glass-card log-card";
      card.setAttribute("data-category", log.category);
      card.setAttribute("data-tilt", "");

      const formattedDate = new Date(log.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      const highlightsHtml = log.highlights
        .map((h) => `<li><i class="bx bx-check-circle"></i> <span>${h}</span></li>`)
        .join("");

      const tagsHtml = log.tech
        .map((t) => `<span class="log-tag">${t.trim()}</span>`)
        .join("");

      const linkHtml = log.link
        ? `<a href="${log.link}" target="_blank" rel="noopener noreferrer" class="log-link"><span>View Demo / Repo</span> <i class="bx bx-link-external"></i></a>`
        : ``;

      card.innerHTML = `
        <div class="log-header">
          <div class="log-header-left">
            <span class="log-category-pill ${log.category}">${log.categoryLabel || log.category}</span>
            <span class="log-date"><i class="bx bx-calendar"></i> ${formattedDate}</span>
          </div>
        </div>
        <h3 class="log-title">${log.title}</h3>
        <ul class="log-highlights">
          ${highlightsHtml}
        </ul>
        <div class="log-footer">
          <div class="log-tags">${tagsHtml}</div>
          ${linkHtml}
        </div>
      `;

      logsFeed.appendChild(card);
    });

    // Re-bind 3D tilt
    init3DTilt();
  }

  // Initial render
  renderLogs("all");

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderLogs(filter);
    });
  });

  // React Flow Node Interaction (Clicking a node in the React Flow canvas filters related logs)
  window.addEventListener("milestoneSelected", (e) => {
    const { category, title } = e.detail;
    filterBtns.forEach((b) => {
      if (b.getAttribute("data-filter") === category) {
        b.click();
      }
    });
    showToast(`🎯 Filtered logs for: ${title}`);
    const logsSection = document.querySelector(".logs-section");
    if (logsSection) {
      logsSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Modal open/close
  function openModal() {
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  if (openModalBtn) openModalBtn.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Form submission
  if (progressForm) {
    progressForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const categoryEl = document.getElementById("logCategory");
      const category = categoryEl.value;
      const categoryLabel = categoryEl.options[categoryEl.selectedIndex].text;
      const date = document.getElementById("logDate").value;
      const title = document.getElementById("logTitle").value;
      const highlightsText = document.getElementById("logHighlights").value;
      const techText = document.getElementById("logTech").value;
      const link = document.getElementById("logLink").value;

      const highlights = highlightsText
        .split("\n")
        .map((s) => s.replace(/^[-•*]\s*/, "").trim())
        .filter((s) => s.length > 0);

      const tech = techText
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const newLog = {
        id: "custom-" + Date.now(),
        date,
        category,
        categoryLabel,
        title,
        highlights,
        tech,
        link
      };

      customLogs.unshift(newLog);
      localStorage.setItem("kashif_dev_logs", JSON.stringify(customLogs));
      allLogs = [...customLogs, ...DEFAULT_LOGS];

      progressForm.reset();
      dateInput.value = new Date().toISOString().split("T")[0];
      closeModal();
      renderLogs("all");

      // Show success toast
      showToast("✨ Daily progress logged successfully!");
    });
  }

  // Export JSON
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allLogs, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "progress.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast("💾 progress.json exported!");
    });
  }
}

/* ===================================================
   4. TOAST NOTIFICATION
   =================================================== */
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="bx bx-check-shield"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Global toast event bridge for React Flow
window.addEventListener("showGlobalToast", (e) => {
  if (e.detail) {
    showToast(e.detail);
  }
});

/* ===================================================
   5. 3D TILT EFFECT
   =================================================== */
function init3DTilt() {
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const tiltCards = document.querySelectorAll("[data-tilt]");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
      });
    });
  }
}
