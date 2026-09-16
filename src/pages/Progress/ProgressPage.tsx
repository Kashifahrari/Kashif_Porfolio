import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../../styles/progress.css";
import { useLanguage } from "../../context/LanguageContext";
import MilestoneRoadmap from "../../components/interactive/MilestoneRoadmap";

type LogCategory = "all" | "fullstack" | "backend" | "dsa" | "learning";

interface DevLog {
  id: string;
  date: string;
  category: Exclude<LogCategory, "all">;
  categoryLabel: string;
  title: string;
  highlights: string[];
  tech: string[];
  link: string;
}

const DEFAULT_LOGS: DevLog[] = [
  { id: "log1", date: "2026-08-15", category: "fullstack", categoryLabel: "Full-Stack Web 💻", title: "CBSE Aakalan v2.0 — TanStack Query Migration",
    highlights: ["Migrated all server state to TanStack Query with staleTime and cacheTime optimization", "Reduced unnecessary re-renders by 60% across assessment dashboard", "Implemented optimistic updates for instant UI feedback on mark submissions", "Added React Query DevTools for debug visibility in staging"],
    tech: ["React 19", "TanStack Query", "TypeScript", "Node.js"], link: "https://github.com/Kashifahrari" },
  { id: "log2", date: "2026-08-10", category: "fullstack", categoryLabel: "Full-Stack Web 💻", title: "Portfolio v2 — React 19 + TypeScript Migration",
    highlights: ["Migrating full HTML/CSS/JS portfolio to React 19 + Vite + TypeScript SPA", "Implemented ThemeContext, LanguageContext and ModalContext for global state", "Built interactive CLI terminal with all commands from scratch in React", "Added code-splitting with lazy() + Suspense for optimal bundle size"],
    tech: ["React 19", "Vite", "TypeScript", "react-router-dom"], link: "https://kashifahrari.github.io/Kashif_Porfolio/" },
  { id: "log3", date: "2026-08-05", category: "backend", categoryLabel: "Backend & APIs ⚙️", title: "JWT Auth Rotation System",
    highlights: ["Built access token + refresh token rotation system in Express.js", "Implemented httpOnly cookie storage for refresh tokens (XSS protection)", "Added token blacklist with Redis-compatible in-memory store", "Tested full auth lifecycle with Postman automated test suites"],
    tech: ["Node.js", "Express.js", "JWT", "Postman"], link: "https://github.com/Kashifahrari" },
  { id: "log4", date: "2026-07-28", category: "dsa", categoryLabel: "DSA & Problem Solving 🧠", title: "Graph Algorithms Mastery — Dijkstra & BFS",
    highlights: ["Solved 20+ graph problems on LeetCode using Dijkstra's shortest path", "Implemented BFS level-order traversal and DFS backtracking patterns", "Published GeeksforGeeks article: 'Fundamentals of Graph Theory'", "Optimized time complexity from O(V²) to O(E log V) using priority queue"],
    tech: ["Java", "DSA", "LeetCode", "GeeksforGeeks"], link: "https://www.geeksforgeeks.org/user/kashifahrari/" },
  { id: "log5", date: "2026-07-20", category: "fullstack", categoryLabel: "Full-Stack Web 💻", title: "React Flow — Custom Node Architecture",
    highlights: ["Built custom node types with handles, validation states and action menus", "Implemented drag-to-connect with type-safe edge data using @xyflow/react v12", "Added minimap, zoom controls and keyboard navigation for accessibility", "State persistence using localStorage with JSON serialization"],
    tech: ["React Flow", "@xyflow/react", "TypeScript", "React 19"], link: "https://www.geeksforgeeks.org/user/kashifahrari/" },
  { id: "log6", date: "2026-07-15", category: "learning", categoryLabel: "Research & Notes 📚", title: "TypeScript Advanced Patterns — Generics & Utility Types",
    highlights: ["Deep-dived into TypeScript Generics: T extends, conditional types, mapped types", "Built type-safe API client using Record<K,V>, Partial<T>, Pick<T,K>", "Implemented discriminated unions for exhaustive type narrowing", "Published cheatsheet: 'TypeScript Utility Types in Real Projects'"],
    tech: ["TypeScript", "Advanced Types", "Generics"], link: "https://www.geeksforgeeks.org/user/kashifahrari/" },
];

const FILTERS: { key: LogCategory; label: string }[] = [
  { key: "all",        label: "All Logs" },
  { key: "fullstack",  label: "Full-Stack" },
  { key: "backend",    label: "Backend" },
  { key: "dsa",        label: "DSA" },
  { key: "learning",   label: "Learning" },
];

const ProgressPage = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<LogCategory>("all");
  const [customLogs, setCustomLogs] = useState<DevLog[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formDate, setFormDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [formCategory, setFormCategory] = useState<Exclude<LogCategory, "all">>("fullstack");
  const [formTitle, setFormTitle] = useState("");
  const [formHighlights, setFormHighlights] = useState("");
  const [formTech, setFormTech] = useState("");
  const [formLink, setFormLink] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kashif_dev_logs");
      if (stored) setCustomLogs(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const onMilestone = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.category) {
        setFilter(detail.category as LogCategory);
        showToast("Filtered logs for: " + detail.title);
        const feed = document.querySelector(".logs-feed");
        if (feed) feed.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("milestoneSelected", onMilestone);
    return () => window.removeEventListener("milestoneSelected", onMilestone);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  }, []);

  const allLogs = [...customLogs, ...DEFAULT_LOGS];
  const visible = allLogs.filter(l => filter === "all" || l.category === filter);

  const streak = 14 + customLogs.length;
  const totalShipped = 42 + customLogs.length;

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const categoryLabels: Record<Exclude<LogCategory, "all">, string> = {
      fullstack: "Full-Stack Web 💻",
      backend: "Backend & APIs ⚙️",
      dsa: "DSA & Problem Solving 🧠",
      learning: "Research & Notes 📚"
    };

    const parsedHighlights = formHighlights
      .split("\n")
      .map(s => s.replace(/^[-*•]\s*/, "").trim())
      .filter(s => s.length > 0);

    const parsedTech = formTech
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newLog: DevLog = {
      id: "custom-" + Date.now(),
      date: formDate,
      category: formCategory,
      categoryLabel: categoryLabels[formCategory],
      title: formTitle,
      highlights: parsedHighlights,
      tech: parsedTech,
      link: formLink
    };

    const updated = [newLog, ...customLogs];
    setCustomLogs(updated);
    try {
      localStorage.setItem("kashif_dev_logs", JSON.stringify(updated));
    } catch {}

    setFormTitle("");
    setFormHighlights("");
    setFormTech("");
    setFormLink("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setShowPostModal(false);
    showToast("Daily progress logged successfully! 🎉");
  };

  const handleDeleteLog = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this log entry?")) return;
    const updated = customLogs.filter(l => id !== l.id);
    setCustomLogs(updated);
    try {
      localStorage.setItem("kashif_dev_logs", JSON.stringify(updated));
    } catch {}
    showToast("Log entry removed! 🗑️");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "progress.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("progress.json exported! 📂");
  };

  return (
    <main className="progress-main">
      <div className="progress-container">
        
        {/* Hero Section */}
        <section className="progress-hero">
          <div className="status-badge">
            <span className="pulse-ring"></span>
            <span className="pulse-dot"></span>
            <span>{t("progress.badge") || "Live Build-in-Public Engineering Log"}</span>
          </div>

          <h1 className="hero-title">
            <span dangerouslySetInnerHTML={{ __html: t("progress.heading") || "Daily <span>Dev Log</span> & Roadmap" }} />
          </h1>

          <p className="hero-subtitle">
            {t("progress.subtitle") || "Tracking my day-to-day engineering progress, solved challenges, and interactive milestone roadmap."}
          </p>

          <div className="top-action-bar">
            <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
              <i className="bx bx-plus-circle"></i>
              <span>{t("progress.postBtn") || "Post Today's Update 🚀"}</span>
            </button>
            <button className="btn btn-glass" onClick={handleExportJSON}>
              <i className="bx bx-download"></i>
              <span>{t("progress.modal.export") || "Export JSON 📂"}</span>
            </button>
          </div>

          {/* Bento Stats Grid */}
          <div className="stats-grid">
            <div className="glass-card stat-card">
              <div className="stat-icon-wrap streak"><i className="bx bxs-flame"></i></div>
              <div className="stat-content">
                <h3 className="stat-val">{streak}-Day Streak</h3>
                <p className="stat-label">Continuous Daily Shipping</p>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon-wrap tasks"><i className="bx bx-check-double"></i></div>
              <div className="stat-content">
                <h3 className="stat-val">{totalShipped}+ Shipped</h3>
                <p className="stat-label">Completed Tasks & Features</p>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon-wrap reviews"><i className="bx bx-git-pull-request"></i></div>
              <div className="stat-content">
                <h3 className="stat-val">120+ Pulls</h3>
                <p className="stat-label">Production Commits</p>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon-wrap ratings"><i className="bx bx-award"></i></div>
              <div className="stat-content">
                <h3 className="stat-val">61K+ Reads</h3>
                <p className="stat-label">Authorship Influence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive React Flow Roadmap Section */}
        <section className="roadmap-section" style={{ margin: "5rem 0" }}>
          <div className="section-header" style={{ marginBottom: "2.5rem" }}>
            <h2 className="section-title"><span>Interactive <span>Roadmap</span></span></h2>
            <p className="section-subtitle">
              Explore my learning trajectory and production engineering milestones powered by <strong>React Flow</strong>. Drag, pan, zoom, or click any node to filter related logs!
            </p>
          </div>
          <div className="glass-card flow-canvas-container" style={{ padding: "1.5rem", position: "relative" }}>
            <MilestoneRoadmap />
          </div>
        </section>

        {/* Filter Wrapper */}
        <div className="filter-wrapper" role="group" aria-label="Filter dev logs">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-btn${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Logs Feed */}
        <div className="logs-feed">
          {visible.map((log) => {
            const isCustom = log.id.startsWith("custom-");
            const formattedDate = new Date(log.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            });

            return (
              <div key={log.id} className="glass-card log-card" data-category={log.category}>
                <div className="log-header">
                  <div className="log-header-left">
                    <span className={`log-category-pill ${log.category}`}>{log.categoryLabel}</span>
                    <span className="log-date"><i className="bx bx-calendar"></i> {formattedDate}</span>
                  </div>
                  {isCustom && (
                    <button className="log-delete-btn" onClick={() => handleDeleteLog(log.id)} title="Delete this log entry">
                      <i className="bx bx-trash"></i>
                    </button>
                  )}
                </div>

                <h3 className="log-title">{log.title}</h3>
                
                <ul className="log-highlights">
                  {log.highlights.map((h, i) => (
                    <li key={i}>
                      <i className="bx bx-check-circle"></i>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="log-footer">
                  <div className="log-tags">
                    {log.tech.map((t) => (
                      <span key={t} className="log-tag">{t}</span>
                    ))}
                  </div>
                  {log.link && (
                    <a href={log.link} target="_blank" rel="noopener noreferrer" className="log-link">
                      <span>View Demo / Repo</span> <i className="bx bx-link-external"></i>
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {visible.length === 0 && (
            <div className="glass-card" style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
              <i className="bx bx-folder-open" style={{ fontSize: "4rem", color: "var(--main-color)", marginBottom: "1rem", display: "block" }}></i>
              <h3>No logs found in this category yet.</h3>
            </div>
          )}
        </div>

        {/* Roadmap Portal CTA Section */}
        <div className="glass-card devlog-roadmap-cta" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "3rem", padding: "4rem", marginTop: "5rem" }}>
          <div className="roadmap-cta-content" style={{ flex: "1 1 500px" }}>
            <div className="status-badge" style={{ marginBottom: "1.2rem" }}>
              <span className="pulse-ring"></span><span className="pulse-dot"></span>
              <span>Private Portal — Password Required</span>
            </div>
            <h2 className="roadmap-cta-title" style={{ fontSize: "2.8rem", color: "var(--text-color)", marginBottom: "1rem" }}>Road to 24 LPA 🎯</h2>
            <p className="roadmap-cta-desc" style={{ fontSize: "1.45rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "2rem" }}>
              A detailed 6-month structured roadmap tracking daily DSA, System Design, TypeScript, and Full-Stack milestones toward a ₹24 LPA engineering role.
            </p>
            <Link to="/portal" className="btn btn-primary" style={{ display: "inline-flex" }}>
              <i className="bx bx-lock-alt"></i> Access Roadmap Portal (Private)
            </Link>
          </div>
          <div className="roadmap-cta-visual" style={{ flex: "0 0 140px", display: "flex", justifyContent: "center" }}>
            <div className="roadmap-progress-ring" style={{ position: "relative", width: "120px", height: "120px" }}>
              <svg viewBox="0 0 120 120" style={{ width: "120px", height: "120px" }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(0,171,240,0.15)" strokeWidth="8" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#00abf0" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="339" strokeDashoffset="237" transform="rotate(-90 60 60)" />
              </svg>
              <div className="ring-label" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", display: "flex", flexDirection: "column" }}>
                <span className="ring-num" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-color)" }}>30%</span>
                <span className="ring-text" style={{ fontSize: "1rem", color: "var(--text-muted)" }}>Month 2</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Posting Modal Form */}
      {showPostModal && (
        <div className="modal-overlay active" id="postModalOverlay" role="dialog" onClick={(e) => e.target === e.currentTarget && setShowPostModal(false)}>
          <div className="glass-card modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="bx bx-edit-alt"></i>
                <span>Log Daily Progress</span>
              </h2>
              <button className="modal-close" onClick={() => setShowPostModal(false)} aria-label="Close modal">
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handlePostSubmit} id="progressForm" className="progress-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="logDate">Date</label>
                  <input type="date" id="logDate" required value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="logCategory">Category</label>
                  <select id="logCategory" required value={formCategory} onChange={(e) => setFormCategory(e.target.value as Exclude<LogCategory, "all">)}>
                    <option value="fullstack">Full-Stack Web 💻</option>
                    <option value="backend">Backend & APIs ⚙️</option>
                    <option value="dsa">DSA & Problem Solving 🧠</option>
                    <option value="learning">Research & Notes 📚</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="logTitle">Update Title</label>
                <input type="text" id="logTitle" required placeholder="e.g. Optimized SQL Indexing Query Speed" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="logHighlights">Engineering Highlights (One bullet per line)</label>
                <textarea id="logHighlights" rows={4} required placeholder="- Designed composite keys for faster multi-join query performance&#10;- Monitored logs in Postgres explain analyzer" value={formHighlights} onChange={(e) => setFormHighlights(e.target.value)}></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="logTech">Technologies Used (comma separated)</label>
                <input type="text" id="logTech" placeholder="PostgreSQL, Express, Node" value={formTech} onChange={(e) => setFormTech(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="logLink">Demo or GitHub Link (Optional)</label>
                <input type="url" id="logLink" placeholder="https://github.com/..." value={formLink} onChange={(e) => setFormLink(e.target.value)} />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-glass" onClick={() => setShowPostModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Update 🚀</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating toast notification wrapper */}
      <div id="toastContainer" className={`cyber-toast-container${toastMessage ? " active" : ""}`} aria-live="polite">
        {toastMessage && (
          <div className="cyber-toast">
            <i className="bx bx-check-shield" aria-hidden="true"></i>
            <span className="cyber-toast-highlight">{toastMessage}</span>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProgressPage;
