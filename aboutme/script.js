/**
 * ===================================================
 * ABOUT ME - ADVANCED INTERACTIONS & ANIMATIONS
 * ===================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initMobileNavbar();
  initSkillsProgressObserver();
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
   3. SKILLS PROGRESS OBSERVER
   =================================================== */
function initSkillsProgressObserver() {
  const skillCards = document.querySelectorAll(".skills-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show-progress");
        }
      });
    },
    { threshold: 0.2 }
  );

  skillCards.forEach((card) => observer.observe(card));
}

/* ===================================================
   4. 3D TILT EFFECT FOR GLASS CARDS
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

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
      });
    });
  }
}
