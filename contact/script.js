// Initialize particles.js
document.addEventListener("DOMContentLoaded", function () {
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

  // Initialize form validation
  initFormValidation();

  // Initialize 3D effects
  init3DEffects();

  // Initialize rotating names
  initRotatingNames();
});

// Initialize form validation
function initFormValidation() {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll(
    ".inputbox input, .inputbox textarea"
  );

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value !== "") {
        this.classList.add("has-value");
      } else {
        this.classList.remove("has-value");
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    inputs.forEach((input) => {
      if (input.value === "") {
        isValid = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });

    if (isValid) {
      // Form is valid, you can submit it or show success message
      showSuccessMessage();
      form.reset();
      inputs.forEach((input) => input.classList.remove("has-value"));
    }
  });
}

// Show success message
function showSuccessMessage() {
  const button = document.querySelector(".button");
  const originalText = button.querySelector(".actual-text").textContent;

  button.querySelector(".actual-text").textContent = "SENT!";
  button.querySelector(".hover-text").textContent = "SENT!";

  setTimeout(() => {
    button.querySelector(".actual-text").textContent = originalText;
    button.querySelector(".hover-text").textContent = originalText;
  }, 2000);
}

// Initialize 3D effects
function init3DEffects() {
  const infoItems = document.querySelectorAll(".info-item");
  const messageBox = document.querySelector(".message-box");

  // Add mousemove effects to info items
  infoItems.forEach((item) => {
    item.addEventListener("mousemove", function (e) {
      const x = e.offsetX;
      const y = e.offsetY;
      const rotateY = (-1 / 5) * x + 20;
      const rotateX = (4 / 30) * y - 20;

      this.style.transform = `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    item.addEventListener("mouseout", function () {
      this.style.transform = "perspective(350px) rotateY(0deg) rotateX(0deg)";
    });
  });

  // Add mousemove effect to message box
  messageBox.addEventListener("mousemove", function (e) {
    const x = e.offsetX;
    const y = e.offsetY;
    const rotateY = (-1 / 5) * x + 20;
    const rotateX = (4 / 30) * y - 20;

    this.style.transform = `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  messageBox.addEventListener("mouseout", function () {
    this.style.transform = "perspective(350px) rotateY(0deg) rotateX(0deg)";
  });
}

// Initialize rotating names with better visibility
function initRotatingNames() {
  const rotatingNames = document.querySelectorAll(".rotating-name span");

  rotatingNames.forEach((letter, index) => {
    // Add a slight delay to each letter for a wave effect
    letter.style.animationDelay = `${index * 0.2}s`;

    // Add hover effect to make letters more visible
    letter.addEventListener("mouseover", function () {
      this.style.color = "rgba(255, 255, 255, 1)";
      this.style.textShadow = "0 0 20px rgba(255, 215, 0, 1)";
      this.style.transform = "scale(1.5) translateZ(30px)";
      this.style.background = "rgba(0, 0, 0, 0.7)";
    });

    letter.addEventListener("mouseout", function () {
      this.style.color = "";
      this.style.textShadow = "";
      this.style.transform = "";
      this.style.background = "";
    });
  });
}

// Add floating shapes to the background
function addFloatingShapes() {
  const floatingShapes = document.createElement("div");
  floatingShapes.className = "floating-shapes";

  for (let i = 1; i <= 4; i++) {
    const shape = document.createElement("div");
    shape.className = `shape shape-${i}`;
    floatingShapes.appendChild(shape);
  }

  document.body.appendChild(floatingShapes);
}

// Initialize everything when window loads
window.addEventListener("load", function () {
  addFloatingShapes();
});
