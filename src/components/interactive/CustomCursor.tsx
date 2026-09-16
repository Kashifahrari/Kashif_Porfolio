import { useEffect } from "react";

const CustomCursor = () => {
  useEffect(() => {
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
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const animate = () => {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;
      outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const onDown = () => outline.classList.add("clicked");
    const onUp = () => outline.classList.remove("clicked");

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Hover detection on interactive elements
    const attachHover = () => {
      const targets = document.querySelectorAll("a, button, input, textarea, select, .btn, .glass-card, .cert-card, .stat-card, .tech-item, .lang-btn, .theme-toggle");
      targets.forEach((el) => {
        el.addEventListener("mouseenter", () => { outline.classList.add("hovered"); dot.classList.add("hovered"); });
        el.addEventListener("mouseleave", () => { outline.classList.remove("hovered"); dot.classList.remove("hovered"); });
      });
    };
    attachHover();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      dot.remove();
      outline.remove();
    };
  }, []);

  return null;
};

export default CustomCursor;
