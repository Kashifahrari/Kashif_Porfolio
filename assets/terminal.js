/**
 * ===================================================
 * KASHIF CLI v2.0 - DEVELOPER INTERACTIVE TERMINAL
 * ===================================================
 */

(function () {
  if (document.getElementById("kashif-terminal-root")) return;

  // Container root
  const root = document.createElement("div");
  root.id = "kashif-terminal-root";

  root.innerHTML = `
    <!-- Floating Launcher Button -->
    <button class="terminal-launcher-btn" id="terminalLauncherBtn" title="Open Interactive Developer CLI (Press ~ or click)">
      <span class="cli-dot"></span>
      <span>&gt;_ CLI</span>
    </button>

    <!-- Terminal Modal Backdrop -->
    <div class="terminal-modal-overlay" id="terminalModal" role="dialog" aria-hidden="true">
      <div class="terminal-window">
        <!-- Terminal Header -->
        <div class="terminal-header">
          <div class="terminal-controls">
            <button class="t-btn t-close" id="tCloseBtn" title="Close"></button>
            <button class="t-btn t-min" id="tMinBtn" title="Clear screen"></button>
            <button class="t-btn t-max" id="tMaxBtn" title="Help"></button>
          </div>
          <div class="terminal-title">
            <span>kashif@ahrari-engine</span>: ~ (v2.0)
          </div>
          <div class="terminal-shortcut-hint">ESC or ~ to exit</div>
        </div>

        <!-- Terminal Output Screen -->
        <div class="terminal-body" id="terminalBody">
          <div class="t-welcome-banner">
  ███╗   ███╗██╗  ██╗    ████████╗███████╗██████╗ ███╗   ███╗
  ████╗ ████║██║ ██╔╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
  ██╔████╔██║█████═╝        ██║   █████╗  ██████╔╝██╔████╔██║
  ██║╚██╔╝██║██╔═██╗        ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
  ██║ ╚═╝ ██║██║  ██╗       ██║   ███████╗██║  ██║██║ ╚═╝ ██║
  ╚═╝     ╚═╝╚═╝  ╚═╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
          </div>
          <p style="color: #94a3b8;">Welcome to <strong>Mohd Kashif Ahrari's Interactive CLI</strong> [Version 2.0.26].</p>
          <p class="t-hint">Type <strong style="color: #00abf0;">'help'</strong> to see available commands or <strong style="color: #10b981;">'sudo hire'</strong> to collaborate.</p>
          <hr style="border: 0; border-top: 1px solid rgba(0, 171, 240, 0.2); margin: 0.5rem 0;" />
          
          <div id="terminalLogContainer"></div>

          <!-- Active Input Row -->
          <div class="terminal-input-row">
            <div class="t-prompt-row">
              <span class="t-prompt-user">visitor</span><span class="t-prompt-at">@</span><span class="t-prompt-host">kashif.dev</span>:<span class="t-prompt-path">~</span>$
            </div>
            <input type="text" class="t-input-field" id="terminalInput" autocomplete="off" spellcheck="false" placeholder="Type a command..." />
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  const modal = document.getElementById("terminalModal");
  const launcherBtn = document.getElementById("terminalLauncherBtn");
  const closeBtn = document.getElementById("tCloseBtn");
  const minBtn = document.getElementById("tMinBtn");
  const maxBtn = document.getElementById("tMaxBtn");
  const input = document.getElementById("terminalInput");
  const logContainer = document.getElementById("terminalLogContainer");
  const terminalBody = document.getElementById("terminalBody");

  let commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: `
Available commands:
  <span class="t-badge">about</span>       - Summary of background, degree & current role
  <span class="t-badge">skills</span>      - Technical stack, frameworks, tools & DSA
  <span class="t-badge">projects</span>    - Featured production applications & repos
  <span class="t-badge">experience</span>  - Software engineering roles & milestones
  <span class="t-badge">certs</span>       - 15+ verified credentials & certifications
  <span class="t-badge">contact</span>     - Email, Phone, LinkedIn & WhatsApp
  <span class="t-badge">sudo hire</span>   - 🎉 Direct hiring hotline & fast-track collaboration
  <span class="t-badge">theme</span>       - Toggle between Dark and Bright mode
  <span class="t-badge">whoami</span>      - Display current visitor session info
  <span class="t-badge">clear</span>       - Clear the terminal screen
  <span class="t-badge">exit</span>        - Close the CLI window
    `,
    about: `
<strong>Mohd Kashif Ahrari</strong> — Software Engineer & Full-Stack Developer
• <strong>Current Role:</strong> Software Engineer at Dhira Software Labs (promoted from Full-Stack Intern)
• <strong>Education:</strong> B.E in Computer Science & Engineering from Cambridge Institute of Technology (8.66 CGPA / 86.6%)
• <strong>Author:</strong> Published Technical Author on GeeksforGeeks with <strong>61,000+ readers</strong>
• <strong>Specialization:</strong> React 19, TypeScript, React Flow, Node.js, Express, Java (DSA), SQL & MongoDB
    `,
    skills: `
<strong>Core Technical Stack:</strong>
  • <strong>Languages:</strong> JavaScript (ES6+), TypeScript, Java, Python, SQL, HTML5, CSS3/SCSS
  • <strong>Frontend:</strong> React 19, React Flow (@xyflow/react), TanStack Query, Vite, Tailwind CSS, Bootstrap 5
  • <strong>Backend & APIs:</strong> Node.js, Express.js, RESTful APIs, JWT Auth, Passport.js, Appwrite
  • <strong>Databases:</strong> MongoDB, MySQL, PostgreSQL
  • <strong>Tools & DevOps:</strong> Git, GitHub, Postman, jsPDF, Webpack, Vercel, VS Code
    `,
    projects: `
<strong>Featured Production Projects:</strong>
  1. <strong>CBSE Aakalan (CBA Platform)</strong> — Assessment management system for CBSE at Dhira Software Labs.
  2. <strong>Stay Ease Rental Platform</strong> — Full-stack rental web app with Passport.js authentication & CRUD listings.
  3. <strong>Mega-Vlog</strong> — Modern blogging platform powered by React & Appwrite backend.
  4. <strong>Student Attendance Management System</strong> — Real-time attendance calculation engine in PHP & MySQL.
    `,
    experience: `
<strong>Professional Experience:</strong>
  • <strong>Software Engineer</strong> @ Dhira Software Labs (Feb 2026 – Present)
    - Promoted from Full-Stack Intern to full-time Software Engineer.
    - Engineered CBSE Aakalan platform with TanStack Query and client-side PDF generation.
  • <strong>Web Developer Intern</strong> @ Rooman Technologies (Aug 2023 – Sep 2023)
    - Built responsive web modules and backend API integrations.
    `,
    certs: `
<strong>Verified Industry Credentials (15 Total):</strong>
  • IBM — API Development & Backend Architecture
  • Rooman Technologies — Web Development Internship
  • GeeksforGeeks — Technical Content Writing Internship
  • NIPAM (Govt of India) — Intellectual Property Rights
  • IIT Allahabad — Android App Development & Blockchain Foundations
  • DSCI — Cyber Security Awareness
    `,
    contact: `
<strong>Get in Touch:</strong>
  • 📧 Email: <a href="mailto:kashifahrari12345@gmail.com" class="t-link">kashifahrari12345@gmail.com</a>
  • 📱 Phone: <a href="tel:+917905291957" class="t-link">+91 7905291957</a>
  • 💬 WhatsApp: <a href="https://wa.me/917905291957" target="_blank" class="t-link">+91 7905291957</a>
  • 🔗 LinkedIn: <a href="https://www.linkedin.com/in/mohd-kashif-9096a4227" target="_blank" class="t-link">linkedin.com/in/mohd-kashif-9096a4227</a>
  • 🐙 GitHub: <a href="https://github.com/Kashifahrari" target="_blank" class="t-link">github.com/Kashifahrari</a>
    `,
    whoami: `
User: <span style="color: #10b981;">Awesome Recruiter / Tech Explorer</span>
Platform: ${navigator.userAgent.split(' ')[0]}
Session: Active (Guest Access Granted)
    `,
    "sudo hire": `
<div style="padding: 1rem; background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; border-radius: 1rem;">
  <h3 style="color: #10b981; margin-bottom: 0.5rem;">🎉 ACCESS GRANTED: Fast-Track Hiring Sequence Initiated!</h3>
  <p>Thank you for your interest! Mohd Kashif is actively available for high-impact Software Engineering roles.</p>
  <p style="margin-top: 0.5rem;">👉 Direct WhatsApp: <a href="https://wa.me/917905291957?text=Hi%20Kashif,%20I%20used%20your%20CLI%20terminal%20and%20want%20to%20hire%20you!" target="_blank" class="t-link" style="color: #ffd166; font-weight: 700;">+91 7905291957 (Click to Chat)</a></p>
</div>
    `,
    theme: () => {
      const toggle = document.getElementById("theme-toggle");
      if (toggle) toggle.click();
      return `Theme switched! (Current: ${document.documentElement.classList.contains("light-theme") ? "Light" : "Dark"})`;
    },
    clear: () => {
      logContainer.innerHTML = "";
      return null;
    },
    exit: () => {
      closeTerminal();
      return null;
    }
  };

  function openTerminal() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    setTimeout(() => input.focus(), 150);
  }

  function closeTerminal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  if (launcherBtn) launcherBtn.addEventListener("click", openTerminal);
  if (closeBtn) closeBtn.addEventListener("click", closeTerminal);
  if (minBtn) minBtn.addEventListener("click", () => { logContainer.innerHTML = ""; });
  if (maxBtn) maxBtn.addEventListener("click", () => handleCommand("help"));

  // Outside click to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeTerminal();
  });

  // Global Shortcut: Backtick (~) or Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "`" || e.key === "~") {
      // Ignore if user is currently typing in an input/textarea outside terminal
      if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") && document.activeElement !== input) {
        return;
      }
      e.preventDefault();
      if (modal.classList.contains("active")) {
        closeTerminal();
      } else {
        openTerminal();
      }
    } else if (e.key === "Escape" && modal.classList.contains("active")) {
      closeTerminal();
    }
  });

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(cmdRaw);
    historyIndex = commandHistory.length;

    // Create prompt line in log
    const outputBlock = document.createElement("div");
    outputBlock.className = "t-output-block";

    outputBlock.innerHTML = `
      <div class="t-prompt-row">
        <span class="t-prompt-user">visitor</span><span class="t-prompt-at">@</span><span class="t-prompt-host">kashif.dev</span>:<span class="t-prompt-path">~</span>$
        <span class="t-command-text">${cmdRaw}</span>
      </div>
    `;

    if (COMMANDS[cmd]) {
      let result = typeof COMMANDS[cmd] === "function" ? COMMANDS[cmd]() : COMMANDS[cmd];
      if (result !== null) {
        const respDiv = document.createElement("div");
        respDiv.className = "t-response";
        respDiv.innerHTML = result;
        outputBlock.appendChild(respDiv);
        logContainer.appendChild(outputBlock);
      }
    } else {
      const respDiv = document.createElement("div");
      respDiv.className = "t-response";
      respDiv.innerHTML = `<span style="color: #ff6b6b;">Command not found: '${cmdRaw}'. Type <strong style="color: #00abf0;">'help'</strong> for a list of commands.</span>`;
      outputBlock.appendChild(respDiv);
      logContainer.appendChild(outputBlock);
    }

    input.value = "";
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Input events
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleCommand(input.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex] || "";
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = input.value.trim().toLowerCase();
      const keys = Object.keys(COMMANDS);
      const match = keys.find((k) => k.startsWith(current));
      if (match) input.value = match;
    }
  });
})();
