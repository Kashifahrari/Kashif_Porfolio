/**
 * ===================================================
 * MAGNETIC CYBER CURSOR - SMOOTH PHYSICS ENGINE
 * ===================================================
 */

(function () {
  // Disable on touch devices
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
  if (document.querySelector(".cyber-cursor-dot")) return;

  const dot = document.createElement("div");
  dot.className = "cyber-cursor-dot";

  const outline = document.createElement("div");
  outline.className = "cyber-cursor-outline";

  document.body.appendChild(dot);
  document.body.appendChild(outline);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth lerp animation loop
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;

    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateOutline);
  }
  requestAnimationFrame(animateOutline);

  // Click animation
  window.addEventListener("mousedown", () => {
    outline.classList.add("clicked");
  });
  window.addEventListener("mouseup", () => {
    outline.classList.remove("clicked");
  });

  // Hover detection on interactive elements
  function attachHoverListeners() {
    const targets = document.querySelectorAll("a, button, input, textarea, select, .btn, .glass-card, .cert-card, .stat-card, .tech-item, .lang-btn, .theme-toggle");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        outline.classList.add("hovered");
        dot.classList.add("hovered");
      });
      el.addEventListener("mouseleave", () => {
        outline.classList.remove("hovered");
        dot.classList.remove("hovered");
      });
    });
  }

  attachHoverListeners();
  document.addEventListener("DOMContentLoaded", attachHoverListeners);
})();
