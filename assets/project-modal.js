/**
 * ===================================================
 * PROJECT ARCHITECTURE & DEEP DIVE MODAL ENGINE
 * ===================================================
 */

(function () {
  if (document.getElementById("projectModalRoot")) return;

  const PROJECTS_DATA = {
    cba: {
      title: "CBSE Aakalan (CBA Platform)",
      category: "Enterprise Assessment Architecture",
      company: "Dhira Software Labs",
      tagline: "High-concurrency assessment management and dynamic blueprint calculation system for educational institutions.",
      architecture: [
        { title: "Frontend Layer", desc: "React 19 + TanStack Query" },
        { title: "API Gateway", desc: "Express RESTful Endpoints" },
        { title: "Synthesis Engine", desc: "jsPDF Client Document Synthesizer" },
        { title: "Data Storage", desc: "SQL Relational Schemas" }
      ],
      problemSolved: "Manual blueprint assessment creation was error-prone, slow, and non-standardized across hundreds of test centers.",
      highlights: [
        "Architected reactive assessment management workflows using React 19 and TanStack Query with optimistic UI updates.",
        "Engineered client-side high-precision question paper & blueprint PDF synthesizer using jsPDF, reducing server computation load by 60%.",
        "Implemented secure JWT authentication rotation and role-based access control for educators and administrators.",
        "Built responsive data grids with automated marks calculation, weightage distribution, and validation rules."
      ],
      techStack: ["React 19", "TypeScript", "TanStack Query", "Node.js", "Express", "jsPDF", "REST APIs", "CSS Modules"],
      github: "https://github.com/Kashifahrari"
    },
    stayease: {
      title: "Stay Ease Rental Platform",
      category: "Full-Stack Web Architecture",
      company: "Full-Stack Production App",
      tagline: "Comprehensive property rental and short-term booking platform with secure session authentication and geolocation listing.",
      architecture: [
        { title: "Client Layer", desc: "Interactive UI + EJS/Tailwind" },
        { title: "Auth & Security", desc: "Passport.js Session / Bcrypt" },
        { title: "API Controllers", desc: "Node.js & Express REST" },
        { title: "Database", desc: "MongoDB Atlas Document Cluster" }
      ],
      problemSolved: "Travelers and property hosts needed a seamless, secure portal to manage listings, customer reviews, and dynamic pricing without third-party commission overhead.",
      highlights: [
        "Engineered complete CRUD listing pipeline with multi-image cloud uploads and real-time form validation.",
        "Implemented session-based user authentication using Passport.js with encrypted cookie persistence and flash notification alerts.",
        "Designed MongoDB schemas with relational embedding for user reviews, star ratings, and host author verification.",
        "Implemented search and filter algorithms for location-based and price-range property discovery."
      ],
      techStack: ["Node.js", "Express.js", "MongoDB", "Mongoose", "Passport.js", "Tailwind CSS", "RESTful APIs"],
      github: "https://github.com/Kashifahrari"
    },
    megavlog: {
      title: "Mega-Vlog Platform",
      category: "Cloud BaaS & React SPA",
      company: "Cloud Blogging Platform",
      tagline: "Modern scalable blogging ecosystem powered by Appwrite Cloud Backend-as-a-Service and Redux Toolkit state management.",
      architecture: [
        { title: "React SPA", desc: "React 19 + Redux Toolkit" },
        { title: "Editor Pipeline", desc: "TinyMCE WYSIWYG Engine" },
        { title: "Cloud BaaS", desc: "Appwrite Cloud SDK Service" },
        { title: "Media Bucket", desc: "Encrypted Storage & CDN" }
      ],
      problemSolved: "Content creators needed a lightning-fast, distraction-free blogging portal with instant media uploads, draft persistence, and responsive reading views.",
      highlights: [
        "Integrated TinyMCE rich-text editor with markdown compatibility and client-side image compression.",
        "Architected centralized global state with Redux Toolkit, providing instantaneous post feed hydration and state rollback.",
        "Implemented secure Appwrite BaaS authentication with session cookies and fine-grained collection read/write permissions.",
        "Engineered slug-based dynamic routing and responsive dark-mode optimized reading views."
      ],
      techStack: ["React.js", "Redux Toolkit", "Appwrite Cloud", "Tailwind CSS", "TinyMCE", "JavaScript (ES6+)"],
      github: "https://github.com/Kashifahrari"
    },
    attendance: {
      title: "Student Attendance Management System",
      category: "Real-Time Academic Engine",
      company: "Academic Management System",
      tagline: "Automated student attendance tracking, percentage calculation, and exam eligibility evaluation engine.",
      architecture: [
        { title: "Frontend UI", desc: "HTML5/CSS3 + Interactive JS Grid" },
        { title: "Processing Scripts", desc: "PHP Server-Side Handlers" },
        { title: "Database Layer", desc: "Normalized MySQL Relations" },
        { title: "Report Export", desc: "CSV & Summary Generators" }
      ],
      problemSolved: "Manual pen-and-paper attendance calculations often caused miscalculations and delayed exam eligibility determination.",
      highlights: [
        "Engineered automated percentage calculation algorithms that instantly flag students below the 75% mandatory attendance threshold.",
        "Designed normalized MySQL database schema with foreign keys connecting students, subjects, semesters, and attendance logs.",
        "Built subject-wise attendance filtering and automated warning notice generation for faculty and students.",
        "Implemented admin dashboard with real-time class statistics and exportable CSV reports."
      ],
      techStack: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
      github: "https://github.com/Kashifahrari"
    }
  };

  const root = document.createElement("div");
  root.id = "projectModalRoot";

  root.innerHTML = `
    <div class="project-modal-overlay" id="projectModalOverlay" role="dialog" aria-hidden="true">
      <div class="project-modal-dialog">
        <!-- Header -->
        <div class="project-modal-header">
          <div>
            <div class="project-modal-badge-row">
              <span class="project-modal-category" id="pmCategory">ENTERPRISE SYSTEM</span>
              <span class="project-modal-company-tag" id="pmCompany">Dhira Software Labs</span>
            </div>
            <h2 class="project-modal-title" id="pmTitle">CBSE Aakalan (CBA Platform)</h2>
          </div>
          <button class="project-modal-close" id="pmCloseBtn" aria-label="Close modal">
            <i class="bx bx-x"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="project-modal-body">
          <!-- Tagline & Overview -->
          <div class="project-modal-section">
            <h3 class="project-section-heading"><i class="bx bx-info-circle"></i> Project Overview</h3>
            <p id="pmTagline" style="color: #cbd5e1; font-size: 1.4rem;">Overview description...</p>
          </div>

          <!-- System Architecture Pipeline -->
          <div class="project-modal-section">
            <h3 class="project-section-heading"><i class="bx bx-sitemap"></i> System Architecture & Data Flow</h3>
            <div class="architecture-pipeline" id="pmArchPipeline">
              <!-- Populated dynamically -->
            </div>
          </div>

          <!-- Problem & Engineering Highlights -->
          <div class="project-modal-section">
            <h3 class="project-section-heading"><i class="bx bx-bulb"></i> Problem Solved & Engineering Highlights</h3>
            <p id="pmProblemSolved" style="color: #ffd166; font-size: 1.35rem; font-weight: 500; margin-bottom: 0.5rem;"></p>
            <ul class="project-highlights-list" id="pmHighlightsList">
              <!-- Populated dynamically -->
            </ul>
          </div>

          <!-- Tech Stack -->
          <div class="project-modal-section">
            <h3 class="project-section-heading"><i class="bx bx-layer"></i> Technologies & Libraries Used</h3>
            <div class="project-tech-badges" id="pmTechBadges">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="project-modal-footer">
          <div style="font-size: 1.3rem; color: #94a3b8;">
            <span>👨‍💻 Architecture & Implementation by <strong>Mohd Kashif Ahrari</strong></span>
          </div>
          <div class="project-modal-actions">
            <a href="https://github.com/Kashifahrari" target="_blank" rel="noopener noreferrer" class="btn btn-primary" id="pmGithubBtn">
              <i class="bx bxl-github"></i> View GitHub Source ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  const modal = document.getElementById("projectModalOverlay");
  const closeBtn = document.getElementById("pmCloseBtn");
  const pmTitle = document.getElementById("pmTitle");
  const pmCategory = document.getElementById("pmCategory");
  const pmCompany = document.getElementById("pmCompany");
  const pmTagline = document.getElementById("pmTagline");
  const pmArchPipeline = document.getElementById("pmArchPipeline");
  const pmProblemSolved = document.getElementById("pmProblemSolved");
  const pmHighlightsList = document.getElementById("pmHighlightsList");
  const pmTechBadges = document.getElementById("pmTechBadges");
  const pmGithubBtn = document.getElementById("pmGithubBtn");

  function openProjectModal(projectKey) {
    const data = PROJECTS_DATA[projectKey];
    if (!data) return;

    pmTitle.textContent = data.title;
    pmCategory.textContent = data.category;
    pmCompany.textContent = data.company;
    pmTagline.textContent = data.tagline;
    pmProblemSolved.textContent = `🎯 Core Problem: ${data.problemSolved}`;
    if (pmGithubBtn) pmGithubBtn.href = data.github;

    // Build Architecture Pipeline HTML
    pmArchPipeline.innerHTML = data.architecture
      .map(
        (node, idx) => `
        <div class="arch-node">
          <span class="arch-node-title">${node.title}</span>
          <span class="arch-node-desc">${node.desc}</span>
        </div>
        ${idx < data.architecture.length - 1 ? '<span class="arch-arrow">→</span>' : ''}
      `
      )
      .join('');

    // Build Highlights HTML
    pmHighlightsList.innerHTML = data.highlights.map((h) => `<li>${h}</li>`).join('');

    // Build Tech Badges HTML
    pmTechBadges.innerHTML = data.techStack.map((t) => `<span class="project-tech-pill">${t}</span>`).join('');

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeProjectModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeProjectModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeProjectModal();
  });

  // Attach to project cards & buttons
  function bindProjectTriggers() {
    const triggers = document.querySelectorAll("[data-project-key], .project-card");
    triggers.forEach((card) => {
      card.addEventListener("click", (e) => {
        // If user specifically clicked an external link with target=_blank, don't hijack unless it's view details
        const key = card.getAttribute("data-project-key") || (card.querySelector("[data-project-key]") && card.querySelector("[data-project-key]").getAttribute("data-project-key"));
        if (key) {
          e.preventDefault();
          openProjectModal(key);
        }
      });
    });
  }

  bindProjectTriggers();
  document.addEventListener("DOMContentLoaded", bindProjectTriggers);
  window.openProjectModal = openProjectModal;
})();
