import React from "react";
import { useModal } from "../../context/ModalContext";

const PROJECTS_DATA = {
  cba: {
    title: "CBSE Aakalan (CBA Platform)",
    category: "Enterprise Assessment Architecture",
    company: "Dhira Software Labs",
    tagline: "High-concurrency assessment management and dynamic blueprint calculation system for educational institutions.",
    architecture: [
      { title: "Frontend Layer", desc: "React 19 + TanStack Query" },
      { title: "API Gateway", desc: "Express RESTful Endpoints" },
      { title: "Synthesis Engine", desc: "jsPDF Client Document Synthesizer" },
      { title: "Data Storage", desc: "SQL Relational Schemas" }
    ],
    problemSolved: "Manual blueprint assessment creation was error-prone, slow, and non-standardized across hundreds of test centers.",
    highlights: [
      "Architected reactive assessment management workflows using React 19 and TanStack Query with optimistic UI updates.",
      "Engineered client-side high-precision question paper & blueprint PDF synthesizer using jsPDF, reducing server computation load by 60%.",
      "Implemented secure JWT authentication rotation and role-based access control for educators and administrators.",
      "Built responsive data grids with automated marks calculation, weightage distribution, and validation rules."
    ],
    techStack: ["React 19", "TypeScript", "TanStack Query", "Node.js", "Express", "jsPDF", "REST APIs", "CSS Modules"],
    github: "https://github.com/Kashifahrari"
  },
  stayease: {
    title: "Stay Ease Rental Platform",
    category: "Full-Stack Web Architecture",
    company: "Full-Stack Production App",
    tagline: "Comprehensive property rental and short-term booking platform with secure session authentication and geolocation listing.",
    architecture: [
      { title: "Client Layer", desc: "Interactive UI + EJS/Tailwind" },
      { title: "Auth & Security", desc: "Passport.js Session / Bcrypt" },
      { title: "API Controllers", desc: "Node.js & Express REST" },
      { title: "Database", desc: "MongoDB Atlas Document Cluster" }
    ],
    problemSolved: "Travelers and property hosts needed a seamless, secure portal to manage listings, customer reviews, and dynamic pricing without third-party commission overhead.",
    highlights: [
      "Engineered complete CRUD listing pipeline with multi-image cloud uploads and real-time form validation.",
      "Implemented session-based user authentication using Passport.js with encrypted cookie persistence and flash notification alerts.",
      "Designed MongoDB schemas with relational embedding for user reviews, star ratings, and host author verification.",
      "Implemented search and filter algorithms for location-based and price-range property discovery."
    ],
    techStack: ["Node.js", "Express.js", "MongoDB", "Mongoose", "Passport.js", "Tailwind CSS", "RESTful APIs"],
    github: "https://github.com/Kashifahrari"
  },
  megavlog: {
    title: "Mega-Vlog Platform",
    category: "Cloud BaaS & React SPA",
    company: "Cloud Blogging Platform",
    tagline: "Modern scalable blogging ecosystem powered by Appwrite Cloud Backend-as-a-Service and Redux Toolkit state management.",
    architecture: [
      { title: "React SPA", desc: "React 19 + Redux Toolkit" },
      { title: "Editor Pipeline", desc: "TinyMCE WYSIWYG Engine" },
      { title: "Cloud BaaS", desc: "Appwrite Cloud SDK Service" },
      { title: "Media Bucket", desc: "Encrypted Storage & CDN" }
    ],
    problemSolved: "Content creators needed a lightning-fast, distraction-free blogging portal with instant media uploads, draft persistence, and responsive reading views.",
    highlights: [
      "Integrated TinyMCE rich-text editor with markdown compatibility and client-side image compression.",
      "Architected centralized global state with Redux Toolkit, providing instantaneous post feed hydration and state rollback.",
      "Implemented secure Appwrite BaaS authentication with session cookies and fine-grained collection read/write permissions.",
      "Engineered slug-based dynamic routing and responsive dark-mode optimized reading views."
    ],
    techStack: ["React.js", "Redux Toolkit", "Appwrite Cloud", "Tailwind CSS", "TinyMCE", "JavaScript (ES6+)"],
    github: "https://github.com/Kashifahrari"
  },
  attendance: {
    title: "Student Attendance Management System",
    category: "Real-Time Academic Engine",
    company: "Academic Management System",
    tagline: "Automated student attendance tracking, percentage calculation, and exam eligibility evaluation engine.",
    architecture: [
      { title: "Frontend UI", desc: "HTML5/CSS3 + Interactive JS Grid" },
      { title: "Processing Scripts", desc: "PHP Server-Side Handlers" },
      { title: "Database Layer", desc: "Normalized MySQL Relations" },
      { title: "Report Export", desc: "CSV & Summary Generators" }
    ],
    problemSolved: "Manual pen-and-paper attendance calculations often caused miscalculations and delayed exam eligibility determination.",
    highlights: [
      "Engineered automated percentage calculation algorithms that instantly flag students below the 75% mandatory attendance threshold.",
      "Designed normalized MySQL database schema with foreign keys connecting students, subjects, semesters, and attendance logs.",
      "Built subject-wise attendance filtering and automated warning notice generation for faculty and students.",
      "Implemented admin dashboard with real-time class statistics and exportable CSV reports."
    ],
    techStack: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
    github: "https://github.com/Kashifahrari"
  }
};

const ProjectModal = () => {
  const { activeProjectKey, closeProject } = useModal();

  if (!activeProjectKey) return null;

  const data = PROJECTS_DATA[activeProjectKey];
  if (!data) return null;

  return (
    <div
      className="project-modal-overlay active"
      id="projectModalOverlay"
      role="dialog"
      aria-hidden="false"
      onClick={(e) => e.target === e.currentTarget && closeProject()}
    >
      <div className="project-modal-dialog">
        {/* Header */}
        <div className="project-modal-header">
          <div>
            <div className="project-modal-badge-row">
              <span className="project-modal-category" id="pmCategory">{data.category}</span>
              <span className="project-modal-company-tag" id="pmCompany">{data.company}</span>
            </div>
            <h2 className="project-modal-title" id="pmTitle">{data.title}</h2>
          </div>
          <button className="project-modal-close" id="pmCloseBtn" aria-label="Close modal" onClick={closeProject}>
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Body */}
        <div className="project-modal-body">
          {/* Tagline & Overview */}
          <div className="project-modal-section">
            <h3 className="project-section-heading"><i className="bx bx-info-circle"></i> Project Overview</h3>
            <p id="pmTagline" style={{ color: "#cbd5e1", fontSize: "1.4rem" }}>{data.tagline}</p>
          </div>

          {/* System Architecture Pipeline */}
          <div className="project-modal-section">
            <h3 className="project-section-heading"><i className="bx bx-sitemap"></i> System Architecture & Data Flow</h3>
            <div className="architecture-pipeline" id="pmArchPipeline">
              {data.architecture.map((node, idx) => (
                <React.Fragment key={idx}>
                  <div className="arch-node">
                    <span className="arch-node-title">{node.title}</span>
                    <span className="arch-node-desc">{node.desc}</span>
                  </div>
                  {idx < data.architecture.length - 1 && <span className="arch-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Problem & Engineering Highlights */}
          <div className="project-modal-section">
            <h3 className="project-section-heading"><i className="bx bx-bulb"></i> Problem Solved & Engineering Highlights</h3>
            <p id="pmProblemSolved" style={{ color: "#ffd166", fontSize: "1.35rem", fontWeight: 500, marginBottom: "0.5rem" }}>
              🛠️ Core Problem: {data.problemSolved}
            </p>
            <ul className="project-highlights-list" id="pmHighlightsList">
              {data.highlights.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="project-modal-section">
            <h3 className="project-section-heading"><i className="bx bx-layer"></i> Technologies & Libraries Used</h3>
            <div className="project-tech-badges" id="pmTechBadges">
              {data.techStack.map((t) => <span key={t} className="project-tech-pill">{t}</span>)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="project-modal-footer">
          <div style={{ fontSize: "1.3rem", color: "#94a3b8" }}>
            <span>💻 Architecture & Implementation by <strong>Mohd Kashif Ahrari</strong></span>
          </div>
          <div className="project-modal-actions">
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary" id="pmGithubBtn">
              <i className="bx bxl-github"></i> View GitHub Source ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

