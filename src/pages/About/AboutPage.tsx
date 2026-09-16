import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/about.css";
import { useLanguage } from "../../context/LanguageContext";
import { useTilt } from "../../hooks/useTilt";

const AboutPage = () => {
  const { t } = useLanguage();
  const profileCardRef = useRef<HTMLDivElement>(null);
  
  // Ref for the two skills-cards to trigger show-progress class
  const techSkillsCardRef = useRef<HTMLDivElement>(null);
  const profSkillsCardRef = useRef<HTMLDivElement>(null);

  useTilt(profileCardRef);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show-progress");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (techSkillsCardRef.current) observer.observe(techSkillsCardRef.current);
    if (profSkillsCardRef.current) observer.observe(profSkillsCardRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="about-main">
      <div className="about-container">
        
        {/* Hero Summary Section */}
        <section className="about-hero" id="about">
          <div className="status-badge">
            <span className="pulse-ring"></span>
            <span className="pulse-dot"></span>
            <span>{t("hero.badge") || "Available for freelance projects & full-time roles"}</span>
          </div>

          <h1 className="hero-title">
            <span dangerouslySetInnerHTML={{ __html: t("about.heading") || "About <span>Me</span>" }} />
          </h1>

          <p className="hero-subtitle">{t("about.subtitle") || "Developer & Designer"}</p>

          {/* About Bento Presentation */}
          <div className="about-bento-grid">
            {/* Left: Profile Photo Card with 3D Tilt */}
            <div className="glass-card profile-card" ref={profileCardRef}>
              <div className="profile-img-wrap">
                <img
                  src={`${import.meta.env.BASE_URL}kashif2.jpg`}
                  alt="Mohd Kashif"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.src = `${import.meta.env.BASE_URL}kashif.jpg`;
                    img.onerror = null;
                  }}
                />
                <div className="experience-pill">
                  <i className="bx bx-badge-check"></i>
                  <span>Zealous Learner & Dev</span>
                </div>
              </div>
            </div>

            {/* Right: Bio & Quick Facts */}
            <div className="glass-card about-info-card">
              <h2 className="greeting-text">{t("about.greeting") || "Hi there! Glad to see you here."}</h2>
              <p className="bio-text" dangerouslySetInnerHTML={{ __html: t("about.bio") || "Hello! I am Mohd Kashif..." }} />

              {/* Quick Info Chips */}
              <div className="info-chips-grid">
                <div className="info-chip">
                  <i className="bx bx-briefcase-alt-2"></i>
                  <span>Software Engineer @ Dhira</span>
                </div>
                <div className="info-chip">
                  <i className="bx bx-book-reader"></i>
                  <span>61,000+ Reads on GFG</span>
                </div>
                <div className="info-chip">
                  <i className="bx bx-award"></i>
                  <span>8.66 CGPA (86.6% B.E CSE)</span>
                </div>
                <div className="info-chip">
                  <i className="bx bx-code-alt"></i>
                  <span>React 19, React Flow & Node.js</span>
                </div>
              </div>

              <div className="about-actions">
                <Link to="/contact" className="btn btn-primary">
                  {t("about.contact") || "Contact Me 📩"}
                </Link>
                <Link to="/certificates" className="btn btn-glass">
                  {t("cert.title") || "View Certificates 🏅"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section (Education & Experience) */}
        <section className="journey-section" id="education">
          <div className="section-header">
            <h2 className="section-title">
              <span dangerouslySetInnerHTML={{ __html: t("journey.heading") || "My <span>Journey</span>" }} />
            </h2>
            <p className="section-subtitle">Academic foundations, software engineering roles, and career milestones.</p>
          </div>

          <div className="journey-grid">
            {/* Left Column: Education */}
            <div className="journey-column">
              <div className="column-header">
                <div className="column-icon-wrap edu">
                  <i className="bx bx-graduation"></i>
                </div>
                <h3 className="column-title">{t("education.title") || "Education"}</h3>
              </div>

              <div className="timeline">
                {/* Education Item 1: Bachelor's Degree */}
                <div className="glass-card timeline-card">
                  <div className="timeline-dot"></div>
                  <span className="timeline-year"><i className="bx bxs-calendar"></i> 2021 - 2025</span>
                  <h4 className="card-role">{t("education.degree.title") || "Bachelor of Engineering - CSE"}</h4>
                  <h5 className="card-org">{t("education.degree.college") || "Cambridge Institute Of Technology Bangalore"}</h5>
                  <p className="card-details">{t("education.degree.score") || "B.E in Computer Science & Engineering with 8.66 CGPA (86.6%)"}</p>
                </div>

                {/* Education Item 2: Class XII */}
                <div className="glass-card timeline-card">
                  <div className="timeline-dot"></div>
                  <span className="timeline-year"><i className="bx bxs-calendar"></i> 2020</span>
                  <h4 className="card-role">{t("education.class12.title") || "Class XII"}</h4>
                  <h5 className="card-org">{t("education.class12.school") || "ST.JOSEPH'S SCHOOL GORAKHNATH GORAKHPUR"}</h5>
                  <p className="card-details">{t("education.class12.result") || "Passed with 1st division"}</p>
                </div>

                {/* Education Item 3: Class X */}
                <div className="glass-card timeline-card">
                  <div className="timeline-dot"></div>
                  <span className="timeline-year"><i className="bx bxs-calendar"></i> 2018</span>
                  <h4 className="card-role">{t("education.class10.title") || "Class X"}</h4>
                  <h5 className="card-org">{t("education.class10.school") || "ST.JOSEPH'S SCHOOL GORAKHNATH GORAKHPUR"}</h5>
                  <p className="card-details">{t("education.class10.result") || "Passed with 85.25%"}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Experience */}
            <div className="journey-column" id="experience">
              <div className="column-header">
                <div className="column-icon-wrap exp">
                  <i className="bx bx-briefcase-alt-2"></i>
                </div>
                <h3 className="column-title">{t("experience.title") || "Experience"}</h3>
              </div>

              <div className="timeline">
                {/* Experience Item 0: Software Engineer @ Dhira */}
                <div className="glass-card timeline-card">
                  <div className="timeline-dot"></div>
                  <span className="timeline-year">
                    <i className="bx bxs-calendar"></i> <span>{t("experience.exp0.year") || "Sep 2025 - Present"}</span>
                  </span>
                  <h4 className="card-role">{t("experience.exp0.title") || "Software Engineer – Dhira Software Labs Pvt. Ltd"}</h4>
                  <p className="card-details">
                    Promoted from Full-Stack Intern after 3 months. Engineered full-stack web applications with <b>React 19</b> frontend and <b>Node.js</b> backend. Built interactive Canvas Frontend modules using <b>React Flow</b>. Built responsive UIs using <b>Tailwind CSS, SCSS, and Material-UI</b> in agile sprints.
                  </p>
                </div>

                {/* Experience Item 1: Backend Intern */}
                <div className="glass-card timeline-card">
                  <div className="timeline-dot"></div>
                  <span className="timeline-year">
                    <i className="bx bxs-calendar"></i> <span>{t("experience.exp1.year") || "Feb 2025 - Sep 2025"}</span>
                  </span>
                  <h4 className="card-role">{t("experience.exp1.title") || "Backend Intern – SM Web Solutions Pvt. Ltd"}</h4>
                  <p className="card-details">
                    Built and integrated RESTful APIs using <b>Node.js</b> and <b>Express.js</b>. Designed and optimized SQL queries to improve database performance across <b>MySQL and MongoDB</b>.
                  </p>
                </div>

                {/* Experience Item 2: Content Writer Intern */}
                <div className="glass-card timeline-card">
                  <div className="timeline-dot"></div>
                  <span className="timeline-year">
                    <i className="bx bxs-calendar"></i> <span>{t("experience.exp3.year") || "2024 (3 Months)"}</span>
                  </span>
                  <h4 className="card-role">{t("experience.exp3.title") || "Content Writer Intern – GeeksforGeeks"}</h4>
                  <p className="card-details">
                    Published technical articles read by <b>61,000+ readers</b>, covering programming and DOM architecture. Recognized with a certificate of internship for exceptional contribution.
                  </p>
                  <div className="article-link-wrap">
                    <span>{t("experience.exp3.articleHead") || "Top Featured Article:"}</span>&nbsp;
                    <a
                      href="https://www.geeksforgeeks.org/javascript-html-dom/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-link"
                    >
                      JavaScript HTML DOM (61,000+ Reads) <i className="bx bx-link-external"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills-section" id="skills">
          <div className="section-header">
            <h2 className="section-title">
              <span dangerouslySetInnerHTML={{ __html: t("skills.heading") || "My <span>Skills</span>" }} />
            </h2>
            <p className="section-subtitle">Proficiency across programming languages, full-stack technologies, and professional competencies.</p>
          </div>

          <div className="skills-grid">
            {/* Column 1: Technical Skills */}
            <div className="glass-card skills-card" ref={techSkillsCardRef}>
              <div className="skills-card-header">
                <div className="skills-icon-wrap tech">
                  <i className="bx bx-code-block"></i>
                </div>
                <h3 className="skills-card-title">{t("skills.technical") || "Technical Skills"}</h3>
              </div>

              <div className="skills-list">
                {[
                  { key: "skills.items.react_reactflow", defaultVal: "React 19 & React Flow", pct: 90 },
                  { key: "skills.items.nodejs_express", defaultVal: "Node.js & Express.js", pct: 88 },
                  { key: "skills.items.typescript_js", defaultVal: "TypeScript & ES6+", pct: 85 },
                  { key: "skills.items.java_dsa", defaultVal: "Java & DSA", pct: 85 },
                  { key: "skills.items.sql_mongodb", defaultVal: "SQL (MySQL) & MongoDB", pct: 90 },
                  { key: "skills.items.tailwind_css", defaultVal: "Tailwind CSS & SCSS", pct: 92 },
                ].map((s) => (
                  <div className="skill-item" key={s.key}>
                    <div className="skill-label-row">
                      <span className="skill-name">{t(s.key) || s.defaultVal}</span>
                      <span className="skill-percent">{s.pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ "--val": `${s.pct}%` } as React.CSSProperties}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Professional Skills */}
            <div className="glass-card skills-card" ref={profSkillsCardRef}>
              <div className="skills-card-header">
                <div className="skills-icon-wrap prof">
                  <i className="bx bx-cog"></i>
                </div>
                <h3 className="skills-card-title">{t("skills.professional") || "Professional Skills"}</h3>
              </div>

              <div className="skills-list">
                {[
                  { key: "skills.items.web_dev", defaultVal: "Full-Stack Architecture", pct: 90 },
                  { key: "skills.items.backend_api", defaultVal: "RESTful APIs & State Mgmt", pct: 88 },
                  { key: "skills.items.ai_productivity", defaultVal: "AI-Assisted Productivity (Copilot)", pct: 95 },
                  { key: "skills.items.content_writing", defaultVal: "Technical Authoring (61K+ GFG)", pct: 92 },
                  { key: "skills.items.teamwork", defaultVal: "Agile Sprints & Leadership", pct: 100 },
                  { key: "skills.items.leadership", defaultVal: "Contest Organization (Decode to Code)", pct: 95 },
                ].map((s) => (
                  <div className="skill-item" key={s.key}>
                    <div className="skill-label-row">
                      <span className="skill-name">{t(s.key) || s.defaultVal}</span>
                      <span className="skill-percent">{s.pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ "--val": `${s.pct}%` } as React.CSSProperties}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key Achievements & AI Productivity Bento Grid */}
        <section className="achievements-section" style={{ marginBottom: "6rem" }}>
          <div className="section-header">
            <h2 className="section-title">
              <span>Key <span>Achievements</span> & Competencies</span>
            </h2>
            <p className="section-subtitle">Hackathons, technical publications, competition leadership, and AI acceleration.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            {/* Achievement 1: Front-end Competitions */}
            <div className="glass-card stat-card" style={{ padding: "2.5rem" }}>
              <div className="stat-icon-wrap" style={{ color: "var(--accent-gold)", fontSize: "3rem", marginBottom: "1.2rem" }}>
                <i className="bx bxs-trophy"></i>
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "0.6rem" }}>
                Inter-College Winner 🏆
              </h4>
              <p style={{ fontSize: "1.35rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Winner of front-end engineering competitions hosted across inter-college tech fests.
              </p>
            </div>

            {/* Achievement 2: Decode to Code */}
            <div className="glass-card stat-card" style={{ padding: "2.5rem" }}>
              <div className="stat-icon-wrap" style={{ color: "var(--main-color)", fontSize: "3rem", marginBottom: "1.2rem" }}>
                <i className="bx bx-code-curly"></i>
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "0.6rem" }}>
                &quot;DECODE TO CODE&quot; Lead 💻
              </h4>
              <p style={{ fontSize: "1.35rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Organized and spearheaded the flagship college coding competition &quot;DECODE TO CODE&quot; for 100+ students.
              </p>
            </div>

            {/* Achievement 3: GeeksforGeeks Author */}
            <div className="glass-card stat-card" style={{ padding: "2.5rem" }}>
              <div className="stat-icon-wrap" style={{ color: "var(--accent-green)", fontSize: "3rem", marginBottom: "1.2rem" }}>
                <i className="bx bx-book-reader"></i>
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "0.6rem" }}>
                61,000+ Reads on GFG 📚
              </h4>
              <p style={{ fontSize: "1.35rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Published technical author on GeeksforGeeks covering DOM API architecture with 61k+ global readers.
              </p>
            </div>

            {/* Achievement 4: AI-Assisted Productivity */}
            <div className="glass-card stat-card" style={{ padding: "2.5rem" }}>
              <div className="stat-icon-wrap" style={{ color: "var(--accent-teal)", fontSize: "3rem", marginBottom: "1.2rem" }}>
                <i className="bx bx-bot"></i>
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 700, color: "var(--text-color)", marginBottom: "0.6rem" }}>
                AI Velocity & LLMs 🤖
              </h4>
              <p style={{ fontSize: "1.35rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Comfortable using GitHub Copilot and ChatGPT to accelerate development, troubleshoot issues, and elevate shipping speed.
              </p>
            </div>
          </div>
        </section>

        {/* GeeksforGeeks Technical Publications Showcase */}
        <section className="publications-section" id="publications" style={{ marginBottom: "7rem" }}>
          <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="status-badge" style={{ marginBottom: "1.2rem" }}>
              <span className="pulse-ring"></span>
              <span className="pulse-dot"></span>
              <span>{t("publications.badge") || "GeeksforGeeks Author ✍️ 61,000+ Readers"}</span>
            </div>
            <h2 className="section-title">
              <span dangerouslySetInnerHTML={{ __html: t("publications.heading") || "Technical <span>Publications</span>" }} />
            </h2>
            <p className="section-subtitle">
              {t("publications.subtitle") || "Authored in-depth technical guides, web architecture, and mathematical computing articles on GeeksforGeeks."}
            </p>
          </div>

          <div className="publications-grid">
            {[
              { cat: "Statistics & Mathematics", icon: "bx-show", title: "Chi-Square (Χ²) Test in Statistics", desc: "Comprehensive guide to Chi-Square tests, goodness-of-fit, and computational methods.", tags: ["Statistics", "Mathematics", "GFG"], url: "https://www.geeksforgeeks.org/maths/" },
              { cat: "Frontend & Web APIs", icon: "bx-show", title: "JavaScript HTML DOM Architecture", desc: "In-depth guide on Event Flow, capturing, bubbling, and optimal DOM manipulation practices.", tags: ["JavaScript", "HTML DOM", "Web APIs"], url: "https://www.geeksforgeeks.org/javascript-html-dom/" },
              { cat: "JavaScript Engineering", icon: "bx-show", title: "Common Debugging Techniques in JS", desc: "Source map inspection, memory leaks profiling, callstack tracking, and browser devtools debugging.", tags: ["JavaScript", "Debugging", "Performance"], url: "https://www.geeksforgeeks.org/" },
              { cat: "DSA & Discrete Math", icon: "bx-show", title: "Fundamentals of Graph Theory", desc: "Vertices, edges, planar graphs, Eulerian/Hamiltonian cycles, isomorphism, and graph algorithms.", tags: ["Graph Theory", "DSA", "Math"], url: "https://www.geeksforgeeks.org/maths/" },
              { cat: "Mathematical Statistics", icon: "bx-show", title: "Estimation in Statistical Inference", desc: "Point estimation vs confidence intervals, Maximum Likelihood Estimation (MLE), and unbiased estimators.", tags: ["Estimation", "MLE", "Math"], url: "https://www.geeksforgeeks.org/maths/" },
            ].map((p, index) => (
              <a key={index} href={p.url} target="_blank" rel="noopener noreferrer" className="glass-card pub-card">
                <div className="pub-card-top">
                  <span className="pub-category-tag">{p.cat}</span>
                  <span className="pub-stat-pill"><i className={`bx ${p.icon}`}></i> Published</span>
                </div>
                <h3 className="pub-title">{p.title}</h3>
                <p className="pub-desc">{p.desc}</p>
                <div className="pub-tags-row">
                  {p.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <span className="pub-read-link">
                  Read on GeeksforGeeks <i className="bx bx-arrow-back" style={{ transform: "rotate(135deg)" }}></i>
                </span>
              </a>
            ))}

            {/* Card 6: Author Profile Hub */}
            <div className="glass-card pub-card author-hub-card">
              <div className="pub-card-top">
                <span className="pub-category-tag author-tag">Official Author Profile</span>
                <span className="pub-stat-pill highlight">Verified Author ✨</span>
              </div>
              <h3 className="pub-title">Explore Full GeeksforGeeks Author Portfolio</h3>
              <p className="pub-desc">
                Access all published technical research, mathematical computing guides, and web development documentation by Mohd Kashif.
              </p>
              <div className="pub-tags-row">
                <span>61,000+ Reads</span>
                <span>Technical Writing</span>
                <span>GFG Author</span>
              </div>
              <a
                href="https://www.geeksforgeeks.org/profile/mohd_kashif_ahrari?tab=articles&page=1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ marginTop: "1.5rem", width: "100%" }}
              >
                <span>View All on GFG (61K+ Reads) 🚀</span>
                <i className="bx bx-right-arrow-alt"></i>
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="glass-card cta-card">
            <h2 className="cta-title">Interested in building something together?</h2>
            <p className="cta-desc">Let's discuss full-stack projects, internships, or engineering opportunities.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-primary">
                Get in Touch 🚀
              </Link>
              <a
                href="https://wa.me/917905291957?text=Hi%20Kashif,%20I%20saw%20your%20About%20page%20and%20would%20like%20to%20connect!"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <i className="bx bxl-whatsapp"></i>
                <span>Chat on WhatsApp 💬</span>
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AboutPage;
