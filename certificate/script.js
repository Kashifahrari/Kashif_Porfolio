// Initialize particles.js
document.addEventListener("DOMContentLoaded", function () {
  // Check if particles container exists
  const particlesContainer = document.getElementById("particles-js");
  if (particlesContainer) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#00abf0",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.5,
          random: true,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#00abf0",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
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
          onhover: {
            enable: true,
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }

  // Initialize certificate animations
  initCertificateAnimations();

  // Add click events to all certificate images
  initCertificateClicks();
});

// Initialize certificate animations
function initCertificateAnimations() {
  const certificates = document.querySelectorAll(".certificate");

  certificates.forEach((cert, index) => {
    // Set animation delay based on position
    cert.style.animationDelay = `${0.1 + index * 0.1}s`;
  });
}

// Add click events to all certificate images
function initCertificateClicks() {
  const certificateImages = document.querySelectorAll(".certificate img");

  certificateImages.forEach((img) => {
    img.addEventListener("click", function () {
      openModal(this);
    });
  });
}

// Modal functionality
let currentModalImage = null;

// Open the modal and display the clicked image
function openModal(imgElement) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const caption = document.getElementById("caption");

  if (!modal || !modalImg || !caption) return;

  modal.style.display = "flex";
  modalImg.src = imgElement.src;
  caption.textContent = imgElement.alt;
  currentModalImage = imgElement;

  // Prevent background scrolling when modal is open
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";

  // Center modal
  centerModal();

  // Add animation class
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);

  // Add event listeners for modal
  addModalEventListeners();
}

// Center modal function
function centerModal() {
  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    modalContent.style.margin = "auto";
  }
}

// Close the modal
function closeModal() {
  const modal = document.getElementById("imageModal");
  if (!modal) return;

  modal.classList.remove("active");

  // Wait for animation to complete before hiding
  setTimeout(() => {
    modal.style.display = "none";

    // Re-enable scrolling
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";

    currentModalImage = null;
  }, 300);
}

// Add event listeners for modal
function addModalEventListeners() {
  // Close button
  const closeBtn = document.querySelector(".modal .close");
  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }

  // Remove any existing listeners to prevent duplicates
  document.removeEventListener("keydown", handleKeyDown);
  document
    .getElementById("imageModal")
    .removeEventListener("click", handleModalClick);

  // Add new listeners
  document.addEventListener("keydown", handleKeyDown);
  document
    .getElementById("imageModal")
    .addEventListener("click", handleModalClick);
}

// Handle keydown events
function handleKeyDown(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

// Handle modal click events
function handleModalClick(e) {
  if (e.target === this) {
    closeModal();
  }
}

// Handle window resize to keep modal centered
window.addEventListener("resize", centerModal);

// Image loading error handling
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".certificate img");

  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
      this.alt = "Image not available";
    });
  });
});

// Preload images for better performance
function preloadImages() {
  const images = document.querySelectorAll(".certificate img");

  images.forEach((img) => {
    const src = img.getAttribute("src");
    if (src) {
      const image = new Image();
      image.src = src;
    }
  });
}

// Initialize image preloading when page loads
window.addEventListener("load", preloadImages);

// Add smooth scrolling for navigation
document.addEventListener("DOMContentLoaded", function () {
  const navButton = document.querySelector(".nav-button");

  if (navButton) {
    navButton.addEventListener("click", function (e) {
      // If it's a hash link, smooth scroll to target
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  }
});

// Add intersection observer for animations
function initScrollAnimations() {
  const certificates = document.querySelectorAll(".certificate");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  certificates.forEach((cert) => {
    observer.observe(cert);
  });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener("DOMContentLoaded", initScrollAnimations);

// Add touch event support for mobile devices
document.addEventListener("DOMContentLoaded", function () {
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    function (e) {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;

      // Handle swipe down to close modal
      if (document.getElementById("imageModal").style.display === "flex") {
        const deltaY = Math.abs(touchEndY - touchStartY);

        if (deltaY > 100 && touchEndY > touchStartY) {
          closeModal();
        }
      }
    },
    { passive: true }
  );
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    centerModal();
  }, 250);
});

// Export functions for potential external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    openModal,
    closeModal,
    centerModal,
    initCertificateAnimations,
  };
}
