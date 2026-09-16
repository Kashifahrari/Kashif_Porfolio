import { useEffect, useRef } from "react";

/**
 * ThreeBackground
 * ─────────────────────────────────────────────────────────────────────
 * Renders multiple slowly rotating 3D wireframe triangles (tetrahedra)
 * fixed in the page background using Three.js r128 from CDN.
 * z-index: -1, pointer-events: none — fully transparent to interaction.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const THREE: any;

const THREE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

// Each triangle shape config: position, rotation speed, scale
const SHAPES = [
  { x: -4.5, y:  2.5, z: -6,  rx: 0.003, ry: 0.005, rz: 0.002, scale: 1.1 },
  { x:  4.0, y: -1.5, z: -8,  rx: 0.002, ry: 0.004, rz: 0.003, scale: 1.4 },
  { x:  0.5, y:  3.5, z: -10, rx: 0.004, ry: 0.002, rz: 0.001, scale: 1.8 },
  { x: -3.0, y: -3.0, z: -7,  rx: 0.001, ry: 0.003, rz: 0.004, scale: 0.9 },
  { x:  5.5, y:  1.0, z: -5,  rx: 0.005, ry: 0.001, rz: 0.003, scale: 0.7 },
  { x: -1.5, y: -4.0, z: -9,  rx: 0.002, ry: 0.006, rz: 0.002, scale: 1.3 },
  { x:  2.0, y:  5.0, z: -12, rx: 0.003, ry: 0.002, rz: 0.005, scale: 2.0 },
  { x: -5.5, y:  0.0, z: -6,  rx: 0.004, ry: 0.003, rz: 0.001, scale: 0.8 },
];

export const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animFrameId: number;
    let cleanup: (() => void) | null = null;

    const init = () => {
      if (!mountRef.current || typeof THREE === "undefined") return;
      const container = mountRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Renderer — transparent background
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const canvas = renderer.domElement;
      canvas.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
      container.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.background = null;
      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
      camera.position.z = 5;

      // Build wireframe tetrahedron (triangle-based shape)
      const geo = new THREE.TetrahedronGeometry(1, 0);
      const edges = new THREE.EdgesGeometry(geo);
      const mat = new THREE.LineBasicMaterial({
        color: 0x00abf0,
        transparent: true,
        opacity: 0.45,
      });

      // Create multiple instances
      const meshes = SHAPES.map((cfg) => {
        const mesh = new THREE.LineSegments(edges, mat.clone());
        mesh.position.set(cfg.x, cfg.y, cfg.z);
        mesh.scale.setScalar(cfg.scale);
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        scene.add(mesh);
        return { mesh, cfg };
      });

      // Animate
      const animate = () => {
        animFrameId = requestAnimationFrame(animate);
        meshes.forEach(({ mesh, cfg }) => {
          mesh.rotation.x += cfg.rx;
          mesh.rotation.y += cfg.ry;
          mesh.rotation.z += cfg.rz;
        });
        renderer.render(scene, camera);
      };
      animate();

      // Resize
      const onResize = () => {
        const nw = window.innerWidth;
        const nh = window.innerHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(animFrameId);
        window.removeEventListener("resize", onResize);
        try { renderer.dispose(); } catch {}
        if (container.contains(canvas)) container.removeChild(canvas);
      };
    };

    // Lazily load Three.js CDN if not already present
    if (typeof THREE !== "undefined") {
      init();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${THREE_CDN}"]`
      );
      if (existing) {
        existing.addEventListener("load", init, { once: true });
      } else {
        const script = document.createElement("script");
        script.src = THREE_CDN;
        script.async = true;
        script.addEventListener("load", init, { once: true });
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: -1 }}
    />
  );
};

export default ThreeBackground;
