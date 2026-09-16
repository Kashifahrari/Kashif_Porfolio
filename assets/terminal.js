/**
 * ===================================================
 * KASHIF CLI v2.0 - DEVELOPER INTERACTIVE TERMINAL
 * Powered by Groq AI Agent & Real-Time Token Streaming
 * ===================================================
 */

(function () {
  if (document.getElementById("kashif-terminal-root")) return;

  // Backend API URL: automatically switches between localhost and production cloud backend
  const PROD_BACKEND_URL = "https://kashif-porfolio.onrender.com";
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
  const API_ENDPOINT = isLocal ? "http://localhost:5000/api/chat" : `${PROD_BACKEND_URL}/api/chat`;

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
          <p style="color: #94a3b8;">Welcome to <strong>Mohd Kashif Ahrari's AI Terminal & Portfolio CLI</strong> [v2.0.26].</p>
          <p class="t-hint">
            🤖 <strong>AI Assistant Active:</strong> Ask any query about Kashif's experience, paste a <strong>Job Description</strong> for candidate fit analysis, or type <strong style="color: #00abf0;">'help'</strong> for built-in commands (<strong style="color: #10b981;">'sudo hire'</strong> to collaborate).
          </p>
          <hr style="border: 0; border-top: 1px solid rgba(0, 171, 240, 0.2); margin: 0.5rem 0;" />
          
          <div id="terminalLogContainer"></div>

          <!-- Active Input Row -->
          <div class="terminal-input-row">
            <div class="t-prompt-row">
              <span class="t-prompt-user">visitor</span><span class="t-prompt-at">@</span><span class="t-prompt-host">kashif.dev</span>:<span class="t-prompt-path">~</span>$
            </div>
            <input type="text" class="t-input-field" id="terminalInput" autocomplete="off" spellcheck="false" placeholder="Ask a question, paste a JD, or type a command..." />
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
  let isGenerating = false;

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
  • 📧 Email: <a href="mailto:ahrarikashif@gmail.com" class="t-link">ahrarikashif@gmail.com</a>
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

  // Simple Markdown to HTML formatter for terminal output
  function formatTerminalText(rawText) {
    let formatted = rawText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #00abf0;">$1</strong>');
    
    // Inline code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: rgba(0,171,240,0.15); padding: 2px 6px; border-radius: 4px; color: #38bdf8;">$1</code>');

    // Bullet points
    formatted = formatted.replace(/^[•\-\*]\s+(.*)$/gm, '<div style="margin-left: 1rem; margin-bottom: 0.25rem;">• $1</div>');

    // URLs to clickable links
    formatted = formatted.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" class="t-link">$1</a>');

    // Guardrail alerts highlighting
    formatted = formatted.replace(/\[GUARDRAIL\]/g, '<span style="background: rgba(239,68,68,0.2); color: #f87171; padding: 2px 6px; border-radius: 4px; font-weight: 700;">[GUARDRAIL]</span>');

    // Convert newlines to breaks
    formatted = formatted.replace(/\n/g, "<br />");

    return formatted;
  }

  // Handle LLM Streaming from Flask Backend
  async function streamAIResponse(promptText, responseContainer) {
    isGenerating = true;
    input.disabled = true;
    responseContainer.innerHTML = `<span style="color: #ffd166;">⚡ ahrari-ai thinking<span class="t-cursor">...</span></span>`;

    let accumulatedText = "";

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: promptText })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      // Clear the "thinking..." indicator
      responseContainer.innerHTML = "";

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Render formatted text with streaming cursor
        responseContainer.innerHTML = formatTerminalText(accumulatedText) + ` <span class="t-cursor" style="color: #00abf0; font-weight: 700;">▌</span>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }

      // Final render without cursor
      responseContainer.innerHTML = formatTerminalText(accumulatedText);

    } catch (err) {
      console.warn("AI Backend unreachable or returned error:", err);
      responseContainer.innerHTML = `
        <div style="color: #f87171; margin-bottom: 0.5rem;">
          ⚠️ <strong>AI Agent Backend Offline:</strong> Unable to connect to <code>${API_ENDPOINT}</code>
        </div>
        <div style="color: #94a3b8; font-size: 0.9em; margin-bottom: 0.5rem;">
          To activate the live Groq AI Agent & JD Matcher locally:
          <ol style="margin: 0.5rem 0 0.5rem 1.5rem; color: #cbd5e1;">
            <li>Ensure dependencies are installed: <code style="color: #38bdf8;">pip install -r requirements.txt</code></li>
            <li>Add your free Groq key in <code style="color: #38bdf8;">.env</code></li>
            <li>Start backend: <code style="color: #38bdf8;">python server.py</code></li>
          </ol>
          You can still use static commands like <strong style="color: #00abf0;">'about'</strong>, <strong style="color: #00abf0;">'skills'</strong>, <strong style="color: #00abf0;">'projects'</strong>, or <strong style="color: #10b981;">'sudo hire'</strong>.
        </div>
      `;
    } finally {
      isGenerating = false;
      input.disabled = false;
      input.focus();
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  function handleCommand(cmdRaw) {
    if (isGenerating) return;

    const trimmed = cmdRaw.trim();
    const cmdKey = trimmed.toLowerCase();
    if (!trimmed) return;

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

    const respDiv = document.createElement("div");
    respDiv.className = "t-response";
    outputBlock.appendChild(respDiv);
    logContainer.appendChild(outputBlock);

    input.value = "";
    terminalBody.scrollTop = terminalBody.scrollHeight;

    // 1. Check if it's a static built-in command
    if (COMMANDS[cmdKey]) {
      let result = typeof COMMANDS[cmdKey] === "function" ? COMMANDS[cmdKey]() : COMMANDS[cmdKey];
      if (result !== null) {
        respDiv.innerHTML = result;
      } else {
        // null result means command handled its own DOM (like clear or exit)
        outputBlock.remove();
      }
      terminalBody.scrollTop = terminalBody.scrollHeight;
    } else {
      // 2. Otherwise, treat as natural language question / JD and stream from AI Agent!
      streamAIResponse(trimmed, respDiv);
    }
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
