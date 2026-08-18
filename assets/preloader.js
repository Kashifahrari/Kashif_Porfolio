/**
 * ===================================================
 * CYBER STARGATE PRELOADER INITIALIZER
 * ===================================================
 */

(function () {
  // Prevent duplicate insertion
  if (document.getElementById("cyber-preloader")) return;

  // Show on first visit to the website and on Contact page
  const isFirstVisit = !sessionStorage.getItem("kashif_preloader_seen");
  const isContactPage = window.location.pathname.toLowerCase().includes("contact");
  
  if (!isFirstVisit && !isContactPage) {
    return;
  }
  sessionStorage.setItem("kashif_preloader_seen", "true");

  // Create Preloader HTML element
  const preloader = document.createElement("div");
  preloader.id = "cyber-preloader";
  preloader.setAttribute("aria-hidden", "false");
  preloader.setAttribute("role", "status");

  preloader.innerHTML = `
    <div class="preloader-ambient-glow"></div>
    
    <!-- Concentric Cyber Stargate Rings -->
    <div class="stargate-wrapper">
      <svg class="stargate-svg" viewBox="0 0 300 300">
        <defs>
          <!-- Cyan Node Glow Filter -->
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <!-- Golden Fusion Glow Filter -->
          <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- Core Radial Gradient -->
          <radialGradient id="reactorGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00abf0" stop-opacity="0.35" />
            <stop offset="60%" stop-color="#00abf0" stop-opacity="0.1" />
            <stop offset="100%" stop-color="transparent" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Reactor Radial Fill -->
        <circle cx="150" cy="150" r="135" fill="url(#reactorGradient)" />

        <!-- Outer Ring (Clockwise) with Cyan Nodes -->
        <g class="ring-outer">
          <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(0, 171, 240, 0.25)" stroke-width="1.5" stroke-dasharray="8 6 18 4" />
          <!-- 12 Cyan Orbit Lights -->
          <circle cx="150" cy="15" r="3.5" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="217" cy="33" r="3" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="267" cy="83" r="3.5" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="285" cy="150" r="4" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="267" cy="217" r="3.5" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="217" cy="267" r="3" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="150" cy="285" r="4" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="83" cy="267" r="3" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="33" cy="217" r="3.5" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="15" cy="150" r="4" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="33" cy="83" r="3.5" fill="#00abf0" filter="url(#cyanGlow)" />
          <circle cx="83" cy="33" r="3" fill="#00abf0" filter="url(#cyanGlow)" />
        </g>

        <!-- Middle Ring (Counter-Clockwise) with Golden Fusion Nodes -->
        <g class="ring-middle">
          <circle cx="150" cy="150" r="102" fill="none" stroke="rgba(255, 209, 102, 0.3)" stroke-width="2" stroke-dasharray="14 10 4 10" />
          <!-- 6 Golden Fusion Fire Nodes -->
          <circle cx="150" cy="48" r="4.5" fill="#ffd166" filter="url(#goldGlow)" />
          <circle cx="238" cy="99" r="4" fill="#ff9f43" filter="url(#goldGlow)" />
          <circle cx="238" cy="201" r="4.5" fill="#ffd166" filter="url(#goldGlow)" />
          <circle cx="150" cy="252" r="5" fill="#ff9f43" filter="url(#goldGlow)" />
          <circle cx="62" cy="201" r="4.5" fill="#ffd166" filter="url(#goldGlow)" />
          <circle cx="62" cy="99" r="4" fill="#ffd166" filter="url(#goldGlow)" />
        </g>

        <!-- Inner Gyroscope Ring (Fast Clockwise) -->
        <g class="ring-inner">
          <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(0, 171, 240, 0.45)" stroke-width="1.8" stroke-dasharray="30 8 10 8" />
          <circle cx="150" cy="80" r="2.8" fill="#4ecdc4" filter="url(#cyanGlow)" />
          <circle cx="210" cy="185" r="2.8" fill="#4ecdc4" filter="url(#cyanGlow)" />
          <circle cx="90" cy="185" r="2.8" fill="#4ecdc4" filter="url(#cyanGlow)" />
        </g>

        <!-- Center Core Glow Ring -->
        <circle class="core-pulse" cx="150" cy="150" r="50" fill="none" stroke="rgba(0, 171, 240, 0.8)" stroke-width="2.5" />
      </svg>

      <!-- Center Monogram -->
      <div class="stargate-center-logo">
        <span class="stargate-monogram">MK</span>
        <span class="stargate-subtag">SYSTEM 2.0</span>
      </div>
    </div>

    <!-- HUD Telemetry & Progress Display -->
    <div class="preloader-telemetry">
      <div class="preloader-status-text" id="preloaderStatus">INITIALIZING CORE ENCLAVE...</div>
      
      <div class="preloader-bar-wrap">
        <div class="preloader-bar-fill" id="preloaderFill"></div>
      </div>
      
      <div class="preloader-counter" id="preloaderCounter">
        [ <span id="preloaderPct">00</span>% ]
      </div>
    </div>
  `;

  // Prepend to body immediately
  if (document.body) {
    document.body.prepend(preloader);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.prepend(preloader);
    });
  }

  // Animation sequence
  const statusEl = preloader.querySelector("#preloaderStatus");
  const fillEl = preloader.querySelector("#preloaderFill");
  const pctEl = preloader.querySelector("#preloaderPct");

  const statusMessages = [
    { threshold: 0, text: "INITIALIZING CORE ENCLAVE..." },
    { threshold: 28, text: "CALIBRATING 3D SHADERS & PARTICLES..." },
    { threshold: 62, text: "ESTABLISHING SECURE PROTOCOLS..." },
    { threshold: 90, text: "FINALIZING SYSTEM ARCHITECTURE..." },
    { threshold: 100, text: "SYSTEM STATUS: READY 🚀" }
  ];

  let currentPercent = 0;
  const durationMs = 1350; // Total loader duration
  const intervalMs = 25;
  const increment = 100 / (durationMs / intervalMs);

  const loaderInterval = setInterval(() => {
    currentPercent += increment;

    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(loaderInterval);
      
      if (fillEl) fillEl.style.width = "100%";
      if (pctEl) pctEl.textContent = "100";
      if (statusEl) {
        statusEl.textContent = "SYSTEM STATUS: READY 🚀";
        statusEl.classList.add("ready");
      }

      // Smooth dismiss
      setTimeout(() => {
        preloader.classList.add("loaded");
        preloader.setAttribute("aria-hidden", "true");
        setTimeout(() => {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 650);
      }, 400);
    } else {
      const rounded = Math.floor(currentPercent);
      if (fillEl) fillEl.style.width = rounded + "%";
      if (pctEl) pctEl.textContent = rounded < 10 ? "0" + rounded : rounded;

      // Update status message
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (rounded >= statusMessages[i].threshold) {
          if (statusEl && statusEl.textContent !== statusMessages[i].text) {
            statusEl.textContent = statusMessages[i].text;
          }
          break;
        }
      }
    }
  }, intervalMs);

  // Absolute fail-safe timeout: always dismiss after 2.2s
  setTimeout(() => {
    clearInterval(loaderInterval);
    preloader.classList.add("loaded");
    preloader.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 650);
  }, 2200);
})();
