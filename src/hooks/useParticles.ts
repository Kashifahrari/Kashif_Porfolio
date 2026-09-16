import { useEffect } from "react";

const DEFAULT_PARTICLES_CONFIG = {
  particles: {
    number: { value: 70, density: { enable: true, value_area: 800 } },
    color: { value: "#00abf0" },
    shape: { type: "circle" },
    opacity: { value: 0.45, random: true },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 140, color: "#00abf0", opacity: 0.35, width: 1 },
    move: { enable: true, speed: 1.8, direction: "none", random: true, straight: false, out_mode: "out", bounce: false },
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: { grab: { distance: 150, line_linked: { opacity: 0.6 } }, push: { particles_nb: 3 } },
  },
  retina_detect: true,
};

export const useParticles = (elementId = "particles-js", config = DEFAULT_PARTICLES_CONFIG) => {
  useEffect(() => {
    let initialized = false;
    let retryTimer: ReturnType<typeof setTimeout>;

    const initParticles = () => {
      try {
        if (initialized) return;
        if (typeof window.particlesJS !== "function") return;
        const el = document.getElementById(elementId);
        if (!el) return;

        // particles.js v2 stores instances in window.pJSDom — must be an array
        // If it's null/undefined (can happen after HMR teardown), reset it
        if (!Array.isArray(window.pJSDom)) {
          window.pJSDom = [];
        }

        // Destroy any leftover instances first
        if (window.pJSDom.length > 0) {
          try {
            window.pJSDom.forEach((instance: any) => {
              if (instance?.pJS?.fn?.vendors?.destroypJS) {
                instance.pJS.fn.vendors.destroypJS();
              }
            });
          } catch {}
          window.pJSDom = [];
        }

        window.particlesJS(elementId, config);
        initialized = true;
      } catch (err) {
        console.warn("[useParticles] init failed:", err);
      }
    };

    // Small delay so the CDN script has time to execute after DOM is ready
    retryTimer = setTimeout(initParticles, 300);
    window.addEventListener("load", initParticles, { once: true });

    return () => {
      clearTimeout(retryTimer);
      window.removeEventListener("load", initParticles);
      try {
        if (Array.isArray(window.pJSDom) && window.pJSDom.length > 0) {
          window.pJSDom.forEach((instance: any) => {
            if (instance?.pJS?.fn?.vendors?.destroypJS) {
              instance.pJS.fn.vendors.destroypJS();
            }
          });
          window.pJSDom = [];
        }
      } catch {}
    };
  }, [elementId]);
};
