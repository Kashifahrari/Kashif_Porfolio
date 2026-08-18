/**
 * ===================================================
 * CONTACT PAGE - ADVANCED INTERACTIONS & PARTICLES
 * ===================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initMobileNavbar();
  initLiveClock();
  initCopyActions();
  initTopicPills();
  initFormInteractions();
  init3DTilt();
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
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.6,
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
          grab: { distance: 160, line_linked: { opacity: 0.6 } },
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

    // Close on navigation link click
    document.querySelectorAll(".navbar a").forEach((link) => {
      link.addEventListener("click", () => {
        menuIcon.classList.remove("bx-x");
        navbar.classList.remove("active");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
        menuIcon.classList.remove("bx-x");
        navbar.classList.remove("active");
      }
    });
  }
}

/* ===================================================
   3. LIVE BANGALORE / IST CLOCK
   =================================================== */
function initLiveClock() {
  const timeEl = document.getElementById("currentTime");
  if (!timeEl) return;

  function updateClock() {
    const now = new Date();
    // Format to Asia/Kolkata (IST, UTC+5:30)
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    try {
      timeEl.textContent = `${now.toLocaleTimeString("en-US", options)} IST`;
    } catch (e) {
      timeEl.textContent = now.toLocaleTimeString() + " IST";
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ===================================================
   4. COPY-TO-CLIPBOARD WITH TOAST NOTIFICATION
   =================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll(".copy-btn");
  const toast = document.getElementById("toastNotification");
  const toastMsg = document.getElementById("toastMsg");
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add("active");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("active");
    }, 2800);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="bx bx-check"></i> <span class="btn-text">Copied! ✨</span>`;
        btn.style.borderColor = "#10b981";
        btn.style.color = "#10b981";

        showToast(`Copied ${textToCopy} to clipboard! ✨`);

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.borderColor = "";
          btn.style.color = "";
        }, 2200);
      } catch (err) {
        showToast(`Could not copy automatically. Text: ${textToCopy}`);
      }
    });
  });
}

/* ===================================================
   5. TOPIC SELECTOR PILLS
   =================================================== */
function initTopicPills() {
  const pills = document.querySelectorAll(".topic-pill");
  const hiddenInput = document.getElementById("selectedTopic");
  const customSubject = document.getElementById("customSubject");

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const topic = pill.getAttribute("data-topic");
      if (hiddenInput) hiddenInput.value = topic;
      if (customSubject && !customSubject.value) {
        customSubject.placeholder = `Regarding: ${topic}`;
      }
    });
  });
}

/* ===================================================
   6. FORM VALIDATION & CELEBRATION MODAL
   =================================================== */
function initFormInteractions() {
  const form = document.getElementById("contactForm");
  const messageInput = document.getElementById("userMessage");
  const charCount = document.getElementById("charCount");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const successModal = document.getElementById("successModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // Character Counter
  if (messageInput && charCount) {
    messageInput.addEventListener("input", () => {
      const length = messageInput.value.length;
      charCount.textContent = length;
      if (length >= 480) {
        charCount.style.color = "#ff6b6b";
      } else {
        charCount.style.color = "";
      }
    });
  }

  // Real-time input error removal on typing
  const inputs = form ? form.querySelectorAll("input, textarea") : [];
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const wrap = input.closest(".input-wrap");
      const group = input.closest(".form-group");
      if (wrap) wrap.classList.remove("error");
      if (group) group.classList.remove("has-error");
    });
  });

  // Modal Close Handlers
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener("click", () => {
      successModal.classList.remove("active");
    });
    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) {
        successModal.classList.remove("active");
      }
    });
  }

  // Form Submit Handling
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById("userName");
      const emailInput = document.getElementById("userEmail");
      const msgInput = document.getElementById("userMessage");

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        isValid = false;
        showFieldError(nameInput, "Please enter your name (at least 2 characters)");
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        showFieldError(emailInput, "Please enter a valid email address");
      }

      // Validate Message
      if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
        isValid = false;
        showFieldError(msgInput, "Please write a message (at least 10 characters)");
      }

      if (!isValid) return;

      // Extract and format message data
      const customSubVal = document.getElementById("customSubject") ? document.getElementById("customSubject").value.trim() : "";
      const selectedTopicVal = document.getElementById("selectedTopic") ? document.getElementById("selectedTopic").value.trim() : "";
      
      const newContactMessage = {
        id: "msg_" + Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: customSubVal || selectedTopicVal || "General Web & Full-Stack Inquiry",
        message: msgInput.value.trim(),
        timestamp: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        read: false,
      };

      // Persist to local message logger
      try {
        const existing = JSON.parse(localStorage.getItem("kashif_contact_messages") || "[]");
        localStorage.setItem("kashif_contact_messages", JSON.stringify([newContactMessage, ...existing]));
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.warn("Local message logging error:", err);
      }

      // Immediately reset all form fields & UI state
      form.reset();
      nameInput.value = "";
      emailInput.value = "";
      if (msgInput) msgInput.value = "";
      if (document.getElementById("customSubject")) document.getElementById("customSubject").value = "";
      if (charCount) {
        charCount.textContent = "0";
        charCount.style.color = "";
      }

      // Reset topic pills
      const topicPills = document.querySelectorAll(".topic-pill");
      topicPills.forEach((p, idx) => {
        if (idx === 0) p.classList.add("active");
        else p.classList.remove("active");
      });
      const hiddenTopic = document.getElementById("selectedTopic");
      if (hiddenTopic) hiddenTopic.value = "Web Dev";

      // Start Loading Animation
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      // Complete submission animation & show celebration modal
      setTimeout(() => {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;

        // Open Success Modal with Confetti
        if (successModal) {
          successModal.classList.add("active");
          triggerConfetti();
        }
      }, 1000);
    });
  }

  function showFieldError(input, message) {
    const wrap = input.closest(".input-wrap");
    const group = input.closest(".form-group");
    if (wrap) wrap.classList.add("error");
    if (group) {
      group.classList.add("has-error");
      const err = group.querySelector(".error-msg");
      if (err && message) err.textContent = message;
    }
  }
}

/* ===================================================
   7. 3D TILT EFFECT ON CARDS
   =================================================== */
function init3DTilt() {
  // Only enable on desktop with hover capability
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cards = document.querySelectorAll("[data-tilt]");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
      });
    });
  }
}

/* ===================================================
   8. CELEBRATORY CANVAS CONFETTI
   =================================================== */
function triggerConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const pieces = [];
  const colors = ["#00abf0", "#4ecdc4", "#ff6b6b", "#ffd166", "#10b981", "#ffffff"];

  for (let i = 0; i < 70; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 3,
      gravity: 0.2,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRotation;
      p.opacity -= 0.015;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}
