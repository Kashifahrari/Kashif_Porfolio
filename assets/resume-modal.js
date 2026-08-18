/**
 * ===================================================
 * RESUME ATS QUICK-VIEW MODAL ENGINE
 * ===================================================
 */

(function () {
  if (document.getElementById("resumeModalRoot")) return;

  const root = document.createElement("div");
  root.id = "resumeModalRoot";

  root.innerHTML = `
    <div class="resume-modal-overlay" id="resumeModalOverlay" role="dialog" aria-hidden="true">
      <div class="resume-modal-dialog">
        <!-- Header -->
        <div class="resume-modal-header">
          <div class="resume-header-title-group">
            <h2 class="resume-modal-title">Mohd Kashif Ahrari</h2>
            <span class="resume-ats-badge">✨ ATS Score: 98/100</span>
          </div>
          <button class="resume-modal-close" id="resumeCloseBtn" aria-label="Close modal">
            <i class="bx bx-x"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="resume-modal-body">
          <!-- Summary -->
          <div class="resume-section-card">
            <h3 class="resume-section-title"><i class="bx bx-user-pin"></i> Professional Summary</h3>
            <p style="color: #cbd5e1; font-size: 1.35rem;">
              Software Engineer at <strong>Dhira Software Labs</strong> and Computer Science graduate from <strong>Cambridge Institute of Technology (8.66 CGPA / 86.6%)</strong>. Proficient in <strong>React 19, TypeScript, React Flow, Node.js, Express, Java DSA, SQL, and MongoDB</strong>. Published technical author on GeeksforGeeks with <strong>61,000+ global readers</strong>.
            </p>
          </div>

          <!-- Experience -->
          <div class="resume-section-card">
            <h3 class="resume-section-title"><i class="bx bx-briefcase"></i> Experience</h3>
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div>
                <div class="resume-item-header">
                  <span class="resume-role-title">Software Engineer (Promoted from Full-Stack Intern)</span>
                  <span class="resume-date-tag">Feb 2026 – Present</span>
                </div>
                <div class="resume-org">Dhira Software Labs • Bengaluru, India</div>
                <ul class="resume-bullets">
                  <li>Architected CBSE Aakalan (CBA Platform) assessment management module with TanStack Query and automated formula parsing.</li>
                  <li>Engineered client-side high-fidelity PDF report generation with jsPDF for official question papers and blueprints.</li>
                  <li>Implemented JWT authentication rotation and secure RESTful middleware in Node.js & Express.</li>
                </ul>
              </div>

              <div>
                <div class="resume-item-header">
                  <span class="resume-role-title">Web Developer Intern</span>
                  <span class="resume-date-tag">Aug 2023 – Sep 2023</span>
                </div>
                <div class="resume-org">Rooman Technologies • Bengaluru, India</div>
                <ul class="resume-bullets">
                  <li>Built responsive frontend web interfaces and integrated RESTful API endpoints.</li>
                  <li>Collaborated with senior engineers on cross-browser testing and performance optimization.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div class="resume-section-card">
            <h3 class="resume-section-title"><i class="bx bx-graduation"></i> Education</h3>
            <div class="resume-item-header">
              <span class="resume-role-title">Bachelor of Engineering in Computer Science & Engineering</span>
              <span class="resume-date-tag">2020 – 2024</span>
            </div>
            <div class="resume-org">Cambridge Institute of Technology • VTU</div>
            <p style="color: #cbd5e1; font-size: 1.35rem;">
              <strong>Cumulative CGPA: 8.66 / 10.0 (86.6% Distinction)</strong> • Relevant Coursework: Data Structures & Algorithms, Database Management Systems, Computer Networks, Operating Systems.
            </p>
          </div>

          <!-- Key Skills -->
          <div class="resume-section-card">
            <h3 class="resume-section-title"><i class="bx bx-code-alt"></i> Technical Competencies</h3>
            <div class="resume-skills-cloud">
              <span class="resume-skill-pill">React 19</span>
              <span class="resume-skill-pill">TypeScript</span>
              <span class="resume-skill-pill">React Flow</span>
              <span class="resume-skill-pill">Node.js</span>
              <span class="resume-skill-pill">Express.js</span>
              <span class="resume-skill-pill">Java (DSA)</span>
              <span class="resume-skill-pill">SQL / MySQL</span>
              <span class="resume-skill-pill">MongoDB</span>
              <span class="resume-skill-pill">Tailwind CSS</span>
              <span class="resume-skill-pill">TanStack Query</span>
              <span class="resume-skill-pill">REST APIs</span>
              <span class="resume-skill-pill">Git & GitHub</span>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="resume-modal-footer">
          <div style="font-size: 1.3rem; color: #94a3b8;">
            <span>📍 Bengaluru, India • Available for Full-Time & High-Impact Roles</span>
          </div>
          <div class="resume-footer-actions">
            <button class="btn btn-glass" id="resumePrintBtn">
              <i class="bx bx-printer"></i> Print / Save PDF
            </button>
            <a href="https://wa.me/917905291957?text=Hi%20Kashif,%20I%20reviewed%20your%20Resume%20and%20would%20love%20to%20schedule%20an%20interview!" target="_blank" class="btn btn-primary">
              <i class="bx bxl-whatsapp"></i> Schedule Interview 💬
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  const modal = document.getElementById("resumeModalOverlay");
  const closeBtn = document.getElementById("resumeCloseBtn");
  const printBtn = document.getElementById("resumePrintBtn");

  function openResumeModal(e) {
    if (e) e.preventDefault();
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeResumeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeResumeModal);
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeResumeModal();
  });

  // Attach to any Resume trigger button
  function bindResumeTriggers() {
    const triggers = document.querySelectorAll("[data-action='open-resume'], a[href*='resume'], .open-resume-trigger");
    triggers.forEach((btn) => {
      btn.addEventListener("click", openResumeModal);
    });
  }

  bindResumeTriggers();
  document.addEventListener("DOMContentLoaded", bindResumeTriggers);
  window.openResumeModal = openResumeModal;
})();
