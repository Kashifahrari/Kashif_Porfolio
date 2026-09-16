import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleProjectsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/?scroll=projects");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <Link to="/" className="footer-logo">
          Kashif<span>.dev</span>
        </Link>
        <p className="footer-bio">
          Full-Stack Web Developer & Software Engineer passionate about creating fast, scalable, and delightful digital experiences.
        </p>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/mohd-kashif-9096a4227" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="bx bxl-linkedin"></i>
          </a>
          <a href="https://github.com/Kashifahrari" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="bx bxl-github"></i>
          </a>
          <a href="https://www.geeksforgeeks.org/profile/mohd_kashif_ahrari?tab=articles&page=1" target="_blank" rel="noopener noreferrer" aria-label="GeeksforGeeks">
            <i className="bx bx-code-alt"></i>
          </a>
          <a href="https://www.youtube.com/@kashifahrari" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <i className="bx bxl-youtube"></i>
          </a>
          <a href="https://www.instagram.com/kashif_ahrari" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="bx bxl-instagram"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p data-i18n="footer.copyright">
          {t("footer.copyright") || "Copyright © 2025 | Designed and Maintained by Mohd Kashif | All Rights Reserved"}
        </p>
        <div className="footer-links">
          <Link to="/">{t("nav.home") || "Home"}</Link>
          <span>•</span>
          <Link to="/about">{t("nav.about") || "About"}</Link>
          <span>•</span>
          <a href="#projects" onClick={handleProjectsClick}>{t("nav.projects") || "Projects"}</a>
          <span>•</span>
          <Link to="/certificates">{t("nav.certificates") || "Certificates"}</Link>
          <span>•</span>
          <Link to="/progress">{t("nav.progress") || "Dev Log"}</Link>
          <span>•</span>
          <Link to="/contact">{t("nav.contact") || "Contact"}</Link>
          <span>•</span>
          <Link to="/portal" title="Private Area" style={{ color: "var(--accent-gold)", fontWeight: 600 }}>
            (Not for you) 🔒
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
