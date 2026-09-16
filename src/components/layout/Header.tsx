import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isContact = location.pathname === "/contact";

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const nav = document.querySelector(".navbar");
      const icon = document.getElementById("menu-icon");
      if (nav && icon && !nav.contains(e.target as Node) && !icon.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleProjectsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById("projects");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/?scroll=projects");
    }
  };

  return (
    <header className="header">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Link to="/" className="logo" aria-label="Kashif Portfolio Home">
        Kashif<span>.dev</span>
      </Link>

      <nav className={`navbar${menuOpen ? " active" : ""}`} role="navigation" aria-label="Main Navigation">
        <Link to="/" className={isActive("/") ? "active" : ""} onClick={() => setMenuOpen(false)}>{t("nav.home") || "Home"}</Link>
        <Link to="/about" className={isActive("/about") ? "active" : ""} onClick={() => setMenuOpen(false)}>{t("nav.about") || "About"}</Link>
        <a href="#projects" onClick={handleProjectsClick}>{t("nav.projects") || "Projects"}</a>
        <Link to="/certificates" className={isActive("/certificates") ? "active" : ""} onClick={() => setMenuOpen(false)}>{t("nav.certificates") || "Certificates"}</Link>
        <Link to="/progress" className={isActive("/progress") ? "active" : ""} onClick={() => setMenuOpen(false)}>{t("nav.progress") || "Dev Log"}</Link>
        <Link to="/contact" className={isActive("/contact") ? "active" : ""} onClick={() => setMenuOpen(false)}>{t("nav.contact") || "Contact"}</Link>
      </nav>

      <div className="nav-right">
        {/* Language Switcher */}
        <div className="lang-switcher" role="group" aria-label="Language switcher">
          <button
            id="lang-en"
            className="lang-btn"
            aria-pressed={lang === "en"}
            onClick={() => setLanguage("en")}
          >EN</button>
          <button
            id="lang-hi"
            className="lang-btn"
            aria-pressed={lang === "hi"}
            onClick={() => setLanguage("hi")}
          >HI</button>
        </div>

        {/* Theme Toggle */}
        <button
          className="theme-toggle"
          id="theme-toggle"
          aria-label="Toggle light/dark theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌙" : "🌞"}
        </button>

        {/* LinkedIn Follow (non-contact pages) */}
        {!isContact && (
          <a
            href="https://www.linkedin.com/in/mohd-kashif-9096a4227"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-follow-btn"
            aria-label="Follow on LinkedIn"
          >
            <i className="bx bxl-linkedin"></i> Follow Me
          </a>
        )}

        {/* Portal Lock Link */}
        <Link
          to={isContact ? "/portal?tab=inbox" : "/portal"}
          className="nav-roadmap-link"
          aria-label={isContact ? "View Messages" : "Private Portal"}
          style={isContact ? { color: "var(--accent-coral)", borderColor: "rgba(255,107,107,0.35)", background: "rgba(255,107,107,0.1)" } : undefined}
        >
          <i className="bx bx-lock-alt"></i>
          {isContact ? "Messages 🔒" : "(Not for you) 🔒"}
        </Link>

        {/* Mobile hamburger */}
        <i
          id="menu-icon"
          className={`bx ${menuOpen ? "bx-x" : "bx-menu"}`}
          onClick={() => setMenuOpen((p) => !p)}
          role="button"
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setMenuOpen((p) => !p)}
        ></i>
      </div>
    </header>
  );
};

export default Header;
