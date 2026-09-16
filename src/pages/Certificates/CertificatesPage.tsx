import React, { useState, useEffect, useCallback, useRef } from "react";
import "../../styles/certificate.css";
import { useLanguage } from "../../context/LanguageContext";

type CertCategory = "all" | "web" | "internship" | "security" | "course";

interface Cert {
  id: number;
  img: string;
  category: Exclude<CertCategory, "all">;
  org: string;
  title: string;
  desc: string;
}

const CERTS: Cert[] = [
  { id: 1,  img: "cert1.png",       category: "web",        org: "IBM",                    title: "API Development",                    desc: "RESTful API design, HTTP methods, authentication patterns and integration testing." },
  { id: 2,  img: "cert2.png",       category: "internship", org: "Rooman Technologies",    title: "Web Developer Internship",           desc: "Full-stack web development internship with focus on HTML, CSS, JavaScript & Node.js." },
  { id: 3,  img: "cert3.png",       category: "internship", org: "SM Web Solutions",       title: "Backend Intern Certificate",         desc: "Backend development internship — Express.js APIs, MySQL, performance optimization." },
  { id: 4,  img: "cert4.png",       category: "web",        org: "IIT Allahabad",          title: "Web Development",                    desc: "Comprehensive web development course by IIT Allahabad covering modern web technologies." },
  { id: 5,  img: "cert5.png",       category: "internship", org: "GeeksforGeeks",          title: "Content Writer Intern",              desc: "Technical authorship of in-depth articles across JavaScript, DSA, React and Discrete Math." },
  { id: 6,  img: "cert6.png",       category: "security",   org: "NIPAM",                  title: "IPR & Blockchain",                   desc: "Intellectual property rights, blockchain fundamentals and digital innovation protection." },
  { id: 7,  img: "cert7.png",       category: "course",     org: "NPTEL",                  title: "Python Programming",                 desc: "Python fundamentals, OOP, data structures and algorithms using Python." },
  { id: 8,  img: "cert8.png",       category: "security",   org: "Cisco",                  title: "Cybersecurity Essentials",           desc: "Network security fundamentals, threat identification, encryption and security best practices." },
  { id: 9,  img: "cert12 (1).png",  category: "web",        org: "HackerRank",             title: "React.js (5-Star)",                  desc: "Advanced React component architecture, hooks, context API and performance optimization." },
  { id: 10, img: "cert12 (2).png",  category: "course",     org: "HackerRank",             title: "Problem Solving",                    desc: "Data structures, algorithms, and competitive programming problem-solving skills." },
  { id: 11, img: "cert12 (3).png",  category: "internship", org: "Dhira Software Labs",    title: "Full-Stack Intern",                  desc: "Full-stack development internship building the CBSE Aakalan (CBA) assessment platform." },
  { id: 12, img: "cert12 (4).png",  category: "security",   org: "NIPAM",                  title: "Design Rights",                      desc: "Design rights, copyright protection and industrial design in the digital age." },
  { id: 13, img: "cert13.png",      category: "internship", org: "Dhira Software Labs",    title: "Software Engineer Promotion",        desc: "Promoted from Full-Stack Intern to Software Engineer. Recognition for engineering excellence." },
  { id: 14, img: "cert14.png",      category: "course",     org: "HackerRank",             title: "JavaScript",                         desc: "JavaScript ES6+ programming, closures, async/await and DOM manipulation." },
  { id: 15, img: "cert15.png",      category: "course",     org: "HackerRank",             title: "SQL",                                desc: "SQL queries, joins, aggregations, subqueries and database design fundamentals." },
];

const FILTERS: { key: CertCategory; label: string; countKey: string }[] = [
  { key: "all",        label: "All Credentials", countKey: "all" },
  { key: "internship", label: "Internships",     countKey: "internships" },
  { key: "web",        label: "Web & APIs",      countKey: "web" },
  { key: "security",   label: "Cyber & IP",      countKey: "security" },
  { key: "course",     label: "Foundations",     countKey: "courses" },
];

const CertificatesPage = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<CertCategory>("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const touchStartX = useRef(0);

  const visible = CERTS.filter(c => filter === "all" || c.category === filter);

  const openLightbox = (certId: number) => {
    const idx = visible.findIndex(c => c.id === certId);
    setLightboxIdx(idx);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxIdx(null);
    document.body.style.overflow = "";
  }, []);

  const prevCert = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + visible.length) % visible.length);
  }, [lightboxIdx, visible.length]);

  const nextCert = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % visible.length);
  }, [lightboxIdx, visible.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevCert();
      if (e.key === "ArrowRight") nextCert();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, closeLightbox, prevCert, nextCert]);

  const base = import.meta.env.BASE_URL;
  const activeCert = lightboxIdx !== null ? visible[lightboxIdx] : null;

  return (
    <main className="cert-main">
      <div className="cert-container">
        
        {/* Hero Header */}
        <section className="cert-hero">
          <div className="status-badge">
            <i className="bx bx-award"></i>
            <span>{t("cert.badge") || "15+ Verified Professional Credentials & Internships"}</span>
          </div>

          <h1 className="hero-title">
            <span dangerouslySetInnerHTML={{ __html: t("cert.heading") || "My <span>Certificates</span>" }} />
          </h1>

          <p className="hero-subtitle">
            {t("cert.subtitle") || "Industry-recognized credentials in Full-Stack Web Development, Backend APIs, Python, Cybersecurity, and Blockchain."}
          </p>

          {/* Filter Bar */}
          <div className="filter-wrapper" role="group" aria-label="Filter certificates">
            {FILTERS.map(f => {
              const count = f.key === "all" ? CERTS.length : CERTS.filter(c => c.category === f.key).length;
              return (
                <button
                  key={f.key}
                  className={`filter-btn${filter === f.key ? " active" : ""}`}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                >
                  {f.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Certificate Grid */}
          <div className="cert-grid" id="certGrid">
            {visible.map((cert) => (
              <div
                key={cert.id}
                className="glass-card cert-card"
                data-category={cert.category}
                onClick={() => openLightbox(cert.id)}
                role="button"
                tabIndex={0}
                aria-label={`View ${cert.title} certificate`}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(cert.id)}
              >
                <div className="cert-img-wrap">
                  <img
                    src={`${base}certi/${cert.img}`}
                    alt={cert.title}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="cert-overlay">
                    <i className="bx bx-zoom-in cert-zoom-icon"></i>
                  </div>
                </div>
                <div className="cert-info">
                  <span className="cert-org-tag">{cert.org}</span>
                  <h3 className="cert-title">{cert.title}</h3>
                  <p className="cert-desc">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {visible.length === 0 && (
            <div className="cert-empty-state" style={{ textAlign: "center", padding: "4rem 0" }}>
              <i className="bx bx-search-alt-2" style={{ fontSize: "5rem", color: "var(--main-color)", marginBottom: "1.5rem" }}></i>
              <p style={{ fontSize: "1.6rem", color: "var(--text-muted)" }}>No certificates in this category.</p>
            </div>
          )}
        </section>

      </div>

      {/* Fullscreen Lightbox Modal Overlay */}
      {activeCert && (
        <div
          className="modal-overlay active"
          id="lightboxModal"
          role="dialog"
          aria-label="Certificate viewer"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (diff > 50) nextCert();
            else if (diff < -50) prevCert();
          }}
        >
          <div className="lightbox-dialog">
            {/* Close Button */}
            <button className="lightbox-close" id="lightboxClose" onClick={closeLightbox} aria-label="Close lightbox">
              <i className="bx bx-x"></i>
            </button>

            {/* Navigation Buttons */}
            <button className="lightbox-nav prev-btn" id="lightboxPrev" onClick={prevCert} aria-label="Previous certificate">
              <i className="bx bx-chevron-left"></i>
            </button>
            <button className="lightbox-nav next-btn" id="lightboxNext" onClick={nextCert} aria-label="Next certificate">
              <i className="bx bx-chevron-right"></i>
            </button>

            {/* Content Container */}
            <div className="lightbox-content">
              <img
                src={`${base}certi/${activeCert.img}`}
                alt={activeCert.title}
                id="lightboxImg"
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <span className="lightbox-org" id="lightboxOrg">{activeCert.org}</span>
                <h3 className="lightbox-title" id="lightboxTitle">{activeCert.title}</h3>
                <p className="lightbox-counter" id="lightboxCounter">
                  {lightboxIdx! + 1} / {visible.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CertificatesPage;
