import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../../styles/home.css";
import { useLanguage } from "../../context/LanguageContext";
import { useModal } from "../../context/ModalContext";
import { useTilt } from "../../hooks/useTilt";
import type { ProjectKey } from "../../types";

declare const Typed: new (el: string, opts: object) => { destroy: () => void };

// ─── Hero Section ───────────────────────────────────────────────
const HeroSection = () => {
  const { t, tArray } = useLanguage();
  const { openResume } = useModal();
  const typedRef = useRef<{ destroy: () => void } | null>(null);
  const cubeSceneRef = useRef<HTMLDivElement>(null);
  const heroCubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof Typed === "undefined") return;
    if (typedRef.current) typedRef.current.destroy();
    const strings = tArray("typed").length > 0 ? tArray("typed") : ["React Developer", "TypeScript Engineer", "Node.js Builder", "Java DSA Solver"];
    typedRef.current = new Typed(".multiText", {
      strings,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
    });
    return () => { typedRef.current?.destroy(); };
  }, [tArray]);

  useEffect(() => {
    const scene = cubeSceneRef.current;
    const cube = heroCubeRef.current;
    if (!scene || !cube) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = scene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cube.style.animationPlayState = "paused";
      cube.style.transform = `rotateY(${x * 180}deg) rotateX(${-y * 180}deg)`;
    };
    const onLeave = () => {
      cube.style.animationPlayState = "running";
      cube.style.transform = "";
    };
    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    return () => {
      scene.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-wrapper">
        <div className="hero-content">
          <div className="status-badge">
            <span className="pulse-ring"></span>
            <span className="pulse-dot"></span>
            <span>{t("hero.badge") || "Available for freelance projects & full-time roles"}</span>
          </div>

          <h4 className="hero-greeting">{t("hero.greeting") || "Hi, I'm"}</h4>
          <h1 className="hero-title">{t("hero.name") || "Mohd Kashif Ahrari"}</h1>

          <h3 className="hero-typing">
            <span>{t("hero.im_a") || "I build"}&nbsp;</span>
            <span className="multiText" aria-live="polite"></span>
          </h3>

          <p className="hero-desc">
            {t("hero.description") || "Passionate Computer Science Engineer & Full-Stack Developer with 8.66 CGPA. Experienced in Java, React, Node.js, SQL, and building scalable cloud-ready web applications."}
          </p>

          <div className="hero-cta-group">
            <a href="#projects" className="btn btn-primary">
              <i className="bx bx-code-block"></i> {t("hero.explore") || "Explore My Work ⚡"}
            </a>
            <button className="btn btn-glass" onClick={openResume} title="Open ATS Resume Modal">
              <i className="bx bx-file"></i> View Resume (ATS)
            </button>
            <Link to="/contact" className="btn btn-secondary">
              <i className="bx bx-envelope"></i> {t("hero.contact") || "Get in Touch ✉️"}
            </Link>
            <Link to="/about" className="btn btn-glass">
              <i className="bx bx-user"></i> {t("hero.resume") || "About Me 🚀"}
            </Link>
          </div>

          <div className="hero-socials">
            <a href="https://www.linkedin.com/in/mohd-kashif-9096a4227" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a>
            <a href="https://github.com/Kashifahrari" target="_blank" rel="noopener noreferrer" className="social-icon-btn github" aria-label="GitHub"><i className="bx bxl-github"></i></a>
            <a href="https://www.geeksforgeeks.org/profile/mohd_kashif_ahrari?tab=articles&page=1" target="_blank" rel="noopener noreferrer" className="social-icon-btn gfg" aria-label="GeeksforGeeks"><i className="bx bx-code-alt"></i></a>
            <a href="https://www.youtube.com/@kashifahrari" target="_blank" rel="noopener noreferrer" className="social-icon-btn youtube" aria-label="YouTube"><i className="bx bxl-youtube"></i></a>
            <a href="https://www.instagram.com/kashif_ahrari" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" aria-label="Instagram"><i className="bx bxl-instagram"></i></a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="cube-scene" id="cubeScene" ref={cubeSceneRef}>
            <div className="cube-glow"></div>
            <div className="cube" id="heroCube" ref={heroCubeRef}>
              <div className="cube-face front"><i className="bx bxl-react"></i><span>REACT</span></div>
              <div className="cube-face back"><i className="bx bxl-nodejs"></i><span>NODE.JS</span></div>
              <div className="cube-face right"><i className="bx bxl-java"></i><span>JAVA DSA</span></div>
              <div className="cube-face left"><i className="bx bxl-python"></i><span>PYTHON</span></div>
              <div className="cube-face top"><i className="bx bxl-mongodb"></i><span>MONGODB</span></div>
              <div className="cube-face bottom"><i className="bx bxs-data"></i><span>SQL DB</span></div>
            </div>
            <div className="floating-badge badge-1"><i className="bx bxl-react"></i><span>React & Node</span></div>
            <div className="floating-badge badge-2"><i className="bx bxl-java"></i><span>Java & DSA</span></div>
            <div className="floating-badge badge-3"><i className="bx bxs-data"></i><span>SQL & MongoDB</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Stats Section ────────────────────────────────────────────────
const StatsSection = () => {
  const { t } = useLanguage();
  return (
    <section className="stats-section">
      <div className="stats-grid">
        {[
          { icon: "bx-award", color: "gold", num: t("stats.cgpa") || "8.66 CGPA (86.6%)", label: t("stats.cgpa_desc") || "Cambridge Institute of Tech" },
          { icon: "bx-briefcase-alt-2", color: "teal", num: t("stats.internships") || "Software Engineer", label: t("stats.internships_desc") || "Dhira Software Labs & SM Web Solutions" },
          { icon: "bx-book-reader", color: "green", num: t("stats.readers") || "61,000+ Reads", label: t("stats.readers_desc") || "GeeksforGeeks Top Tech Author" },
          { icon: "bx-code-block", color: "cyan", num: t("stats.projects") || "10+ Projects", label: t("stats.projects_desc") || "Full-Stack, React Flow & APIs" },
        ].map((s, i) => (
          <div key={i} className="glass-card stat-card" data-tilt>
            <div className={`stat-icon-wrap ${s.color}`}><i className={`bx ${s.icon}`}></i></div>
            <div className="stat-info">
              <h3 className="stat-number">{s.num}</h3>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── About Preview Section ────────────────────────────────────────
const AboutPreview = () => {
  const { t } = useLanguage();
  const profileRef = useRef<HTMLDivElement>(null);
  useTilt(profileRef);

  return (
    <section className="about-section" id="about">
      <div className="section-header">
        <h2 className="section-title">
          <span dangerouslySetInnerHTML={{ __html: t("about.heading") || "About <span>Me</span>" }} />
        </h2>
        <p className="section-subtitle">{t("about.subtitle") || "Software Engineer & Full-Stack Developer"}</p>
      </div>
      <div className="about-grid">
        <div className="glass-card profile-card" ref={profileRef}>
          <div className="profile-img-wrap">
            <img src={`${import.meta.env.BASE_URL}kashif.jpg`} alt="Mohd Kashif Ahrari" loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}kashif.jpg`; }} />
            <div className="experience-pill"><i className="bx bx-badge-check"></i><span>Software Engineer @ Dhira</span></div>
          </div>
        </div>
        <div className="glass-card about-info-card">
          <h3 className="about-greeting">{t("about.greeting") || "Hi there! Glad to see you here."}</h3>
          <p className="about-bio" dangerouslySetInnerHTML={{ __html: t("about.bio") || "Hello! I am Mohd Kashif..." }} />
          <div className="skills-chips-wrapper">
            {["⚛️ React 19 & React Flow", "💡 TypeScript & ES6+", "🚀 Node.js & Express", "🔄 TanStack Query", "☕ Java & DSA", "🎨 Tailwind CSS & SCSS", "🗄️ MySQL & MongoDB", "🤖 AI-Assisted Productivity"].map((chip) => (
              <span key={chip} className="skill-chip">{chip}</span>
            ))}
          </div>
          <div className="about-card-action">
            <Link to="/about" className="btn btn-primary">{t("about.learn_more") || "Learn More About Me 🚀"}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Projects Section ─────────────────────────────────────────────
const PROJECTS = [
  { key: "cba" as ProjectKey, icon: "bx-buildings", color: "#00abf0", category: "Enterprise System", title: "CBSE Aakalan (CBA Platform)", desc: "Assessment management system at Dhira Software Labs. Automated formula parsing, PDF export, TanStack Query caching & JWT auth.", tags: ["React 19", "TypeScript", "Node.js", "TanStack Query", "jsPDF"] },
  { key: "stayease" as ProjectKey, icon: "bx-home-alt", color: "#4ecdc4", category: "Full-Stack Web App", title: "Stay Ease Rental Platform", desc: "Full-stack rental listing platform with Passport.js authentication, CRUD operations, and a modern UI.", tags: ["Node.js", "Express.js", "MongoDB", "Passport.js", "EJS"] },
  { key: "megavlog" as ProjectKey, icon: "bx-pencil", color: "#ffd166", category: "Content Platform", title: "Mega-Vlog", desc: "Modern full-stack blogging platform powered by React and Appwrite backend with real-time data.", tags: ["React", "Appwrite", "TailwindCSS", "React Router"] },
  { key: "attendance" as ProjectKey, icon: "bx-user-check", color: "#10b981", category: "Management System", title: "Student Attendance System", desc: "Real-time attendance calculation engine for educational institutions built in PHP and MySQL.", tags: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript"] },
];

const ProjectsSection = () => {
  const { t } = useLanguage();
  const { openProject } = useModal();
  return (
    <section className="projects-section" id="projects">
      <div className="section-header">
        <h2 className="section-title"><span>Featured <span>Projects</span></span></h2>
        <p className="section-subtitle">{t("projects.subtitle") || "A showcase of enterprise platforms, full-stack systems, and production engineering solutions."}</p>
      </div>
      <div className="projects-grid">
        {PROJECTS.map((p) => {
          const iconClassMap: Record<string, string> = {
            cba: "web",
            stayease: "backend",
            megavlog: "data",
            attendance: "web"
          };
          const categoryMap: Record<string, string> = {
            cba: "Enterprise Platform",
            stayease: "Rental Platform",
            megavlog: "Full-Stack Web",
            attendance: "Management System"
          };
          const iconGlyphMap: Record<string, string> = {
            cba: "bx-layer",
            stayease: "bx-home-heart",
            megavlog: "bx-news",
            attendance: "bx-user-check"
          };
          return (
            <div key={p.key} className="glass-card project-card" data-project-key={p.key} onClick={() => openProject(p.key)} style={{ cursor: "pointer" }}>
              <div className="project-header">
                <div className={`project-icon-wrap ${iconClassMap[p.key] || "web"}`}>
                  <i className={`bx ${iconGlyphMap[p.key] || p.icon}`}></i>
                </div>
                <span className="project-category">{categoryMap[p.key] || p.category}</span>
              </div>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">{p.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
              <div className="project-actions">
                <button
                  className="project-link"
                  onClick={(e) => { e.stopPropagation(); openProject(p.key); }}
                  style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span>View Architecture & Specs ⚡</span>
                  <i className="bx bx-right-arrow-alt"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── Tech Marquee ─────────────────────────────────────────────────
const TECH_ITEMS = ["TypeScript", "React.js", "JavaScript", "Node.js", "Java", "Python", "MongoDB", "MySQL", "HTML5 & CSS3", "Git & GitHub", "Data Structures"];

const TechMarquee = () => (
  <section className="marquee-section" aria-label="Technology stack">
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...TECH_ITEMS, ...TECH_ITEMS].map((item, i) => (
          <div key={i} className="tech-item">
            <i className="bx bx-code-alt"></i>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Publications ─────────────────────────────────────────────────
const PUBS = [
  { cat: "JavaScript", stat: "12K+ Reads", title: "JavaScript Closures Deep Dive", desc: "Comprehensive guide on closures, scope chains, and practical patterns in modern JS.", tags: ["JavaScript", "ES6+", "Closures"], url: "https://www.geeksforgeeks.org/user/kashifahrari/", featured: false },
  { cat: "JavaScript", stat: "61K+ Reads 🔥", title: "JavaScript HTML DOM Manipulation", desc: "In-depth technical guide on DOM manipulation and Event Flow architecture. Reached 61K+ global readers.", tags: ["JavaScript", "DOM", "Events", "Web APIs"], url: "https://www.geeksforgeeks.org/javascript-html-dom/", featured: true },
  { cat: "React", stat: "8K+ Reads", title: "React Flow: Custom Node Editor", desc: "Building interactive node-based editors with @xyflow/react with drag, zoom and state persistence.", tags: ["React Flow", "TypeScript", "xyflow"], url: "https://www.geeksforgeeks.org/user/kashifahrari/", featured: false },
  { cat: "Node.js", stat: "5K+ Reads", title: "JWT Authentication with Express", desc: "Complete guide to JWT authentication rotation and secure middleware patterns.", tags: ["Node.js", "Express", "JWT", "Security"], url: "https://www.geeksforgeeks.org/user/kashifahrari/", featured: false },
  { cat: "DSA", stat: "4K+ Reads", title: "Graph Algorithms in Java", desc: "BFS, DFS, Dijkstra's algorithm and Dynamic Programming solutions for technical interviews.", tags: ["Java", "DSA", "Graphs", "DP"], url: "https://www.geeksforgeeks.org/user/kashifahrari/", featured: false },
];

const Publications = () => (
  <section className="publications-section" id="publications">
    <div className="section-header">
      <h2 className="section-title"><span>Technical <span>Authorship</span></span></h2>
      <p className="section-subtitle">In-depth technical articles published on GeeksforGeeks reaching 61,000+ global readers.</p>
    </div>
    <div className="publications-grid">
      {PUBS.map((p, i) => (
        <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className={`glass-card pub-card${p.featured ? " featured-pub" : ""}`}>
          <div className="pub-card-top">
            <span className="pub-category-tag">{p.cat}</span>
            <span className={`pub-stat-pill${p.featured ? " highlight" : ""}`}>{p.stat}</span>
          </div>
          <h3 className="pub-title">{p.title}</h3>
          <p className="pub-desc">{p.desc}</p>
          <div className="pub-tags-row">{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
          <span className="pub-read-link">Read on GFG →</span>
        </a>
      ))}
      <div className="glass-card pub-card author-hub-card">
        <div className="pub-card-top"><span className="pub-category-tag">Author Hub</span><span className="pub-stat-pill highlight">Top Contributor</span></div>
        <h3 className="pub-title">Mohd Kashif Ahrari — GFG Author Hub</h3>
        <p className="pub-desc">Explore the full library of in-depth technical articles across JavaScript, React, Node.js, DSA, and modern web engineering.</p>
        <a href="https://www.geeksforgeeks.org/profile/mohd_kashif_ahrari?tab=articles&page=1" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          <i className="bx bx-link-external"></i> View All Articles on GFG ↗
        </a>
      </div>
    </div>
  </section>
);

const DevLogTeaser = () => (
  <section className="devlog-teaser-section" style={{ marginBottom: "6rem" }}>
    <div className="glass-card" style={{ padding: "4rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "2.5rem" }}>
      <div style={{ flex: 1, minWidth: "280px", textAlign: "left" }}>
        <div className="status-badge" style={{ marginBottom: "1.5rem" }}>
          <span className="pulse-ring"></span>
          <span className="pulse-dot"></span>
          <span>Live Dev Feed — Updated Daily</span>
        </div>
        <h2 style={{ fontSize: "2.8rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-color)", marginBottom: "1rem" }}>
          See What I'm Building Today 🔥
        </h2>
        <p style={{ fontSize: "1.5rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          Real-time engineering activity feed tracking daily progress, solved challenges, and milestone roadmap.
        </p>
      </div>
      <Link to="/progress" className="btn btn-primary">
        <i className="bx bx-trending-up"></i> View Dev Log
      </Link>
    </div>
  </section>
);

const CTASection = () => (
  <section className="cta-section">
    <div className="glass-card cta-card">
      <h2 className="cta-title">Ready to Build Something <span>Extraordinary?</span></h2>
      <p className="cta-desc">Let's discuss your project, team up on something impactful, or just have a great tech conversation!</p>
      <div className="cta-actions">
        <Link to="/contact" className="btn btn-primary"><i className="bx bx-send"></i> Start a Conversation 🚀</Link>
        <a href="https://wa.me/917905291957?text=Hi%20Kashif,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          <i className="bx bxl-whatsapp"></i> Chat on WhatsApp 💬
        </a>
      </div>
    </div>
  </section>
);

// ─── HomePage Assembly ────────────────────────────────────────────
const HomePage = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const scrollTarget = searchParams.get("scroll");
    if (scrollTarget === "projects" || window.location.hash === "#projects") {
      setTimeout(() => {
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [searchParams]);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutPreview />
      <ProjectsSection />
      <TechMarquee />
      <Publications />
      <DevLogTeaser />
      <CTASection />
    </>
  );
};

export default HomePage;


