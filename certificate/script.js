/**
 * ===================================================
 * CERTIFICATES SHOWCASE - ADVANCED INTERACTIONS
 * ===================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initMobileNavbar();
  initFilterTabs();
  initLightboxModal();
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
   3. CATEGORY FILTER TABS
   =================================================== */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const certCards = document.querySelectorAll(".cert-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      certCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("hidden");
          card.style.animation = "fadeInCard 0.4s ease forwards";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

/* ===================================================
   4. FULLSCREEN LIGHTBOX MODAL
   =================================================== */
let currentCertIndex = 0;
let visibleCertCards = [];

function initLightboxModal() {
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const modalOrg = document.getElementById("lightboxOrg");
  const modalTitle = document.getElementById("lightboxTitle");
  const modalCounter = document.getElementById("lightboxCounter");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  const certCards = Array.from(document.querySelectorAll(".cert-card"));

  function updateModalContent(index) {
    visibleCertCards = certCards.filter((c) => !c.classList.contains("hidden"));
    if (visibleCertCards.length === 0) return;

    if (index < 0) index = visibleCertCards.length - 1;
    if (index >= visibleCertCards.length) index = 0;
    currentCertIndex = index;

    const card = visibleCertCards[currentCertIndex];
    const img = card.querySelector(".cert-img-wrap img");
    const org = card.querySelector(".cert-org");
    const title = card.querySelector(".cert-title");

    if (modalImg && img) modalImg.src = img.src;
    if (modalOrg && org) modalOrg.textContent = org.textContent;
    if (modalTitle && title) modalTitle.textContent = title.textContent;
    if (modalCounter) modalCounter.textContent = `${currentCertIndex + 1} / ${visibleCertCards.length}`;
  }

  function openModal(cardElement) {
    visibleCertCards = certCards.filter((c) => !c.classList.contains("hidden"));
    currentCertIndex = visibleCertCards.indexOf(cardElement);
    if (currentCertIndex === -1) currentCertIndex = 0;

    updateModalContent(currentCertIndex);
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // Card click triggers modal
  certCards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  // Modal navigation handlers
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (prevBtn) prevBtn.addEventListener("click", () => updateModalContent(currentCertIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => updateModalContent(currentCertIndex + 1));

  // Outside click to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") updateModalContent(currentCertIndex - 1);
    if (e.key === "ArrowRight") updateModalContent(currentCertIndex + 1);
  });

  // Mobile Touch Swipe Handlers
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) updateModalContent(currentCertIndex - 1); // Swipe right -> Prev
      else updateModalContent(currentCertIndex + 1); // Swipe left -> Next
    }
  }
}

/* ===================================================
   5. 3D TILT EFFECT FOR CERTIFICATE CARDS
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
