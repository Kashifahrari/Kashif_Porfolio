import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/contact.css";
import { useLanguage } from "../../context/LanguageContext";
import { useClipboard } from "../../hooks/useClipboard";
import { useLiveClock } from "../../hooks/useLiveClock";

interface FormData { name: string; email: string; subject: string; message: string; }
interface FormErrors { name?: string; email?: string; message?: string; }

const ContactPage = () => {
  const { t } = useLanguage();
  const { copyToClipboard, isCopied } = useClipboard();
  const liveTime = useLiveClock();

  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Please enter your name";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email address";
    if (form.message.trim().length < 3) newErrors.message = "Please write a message (at least 3 characters)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const msgs = JSON.parse(localStorage.getItem("contactMessages") || "[]");
      const now = new Date();
      msgs.push({
        id: "msg_" + Date.now(),
        name: form.name,
        email: form.email,
        subject: form.subject || "General Inquiry",
        message: form.message,
        timestamp: now.toISOString(),
        dateFormatted: now.toLocaleString("en-IN"),
        read: false,
      });
      localStorage.setItem("contactMessages", JSON.stringify(msgs));
    } catch {}

    await new Promise(r => setTimeout(r, 1400));
    setIsSubmitting(false);
    setShowSuccess(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setCharCount(0);
  };

  return (
    <main className="contact-main">
      <div className="contact-container">
        
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="status-badge">
            <span className="pulse-ring"></span>
            <span className="pulse-dot"></span>
            <span>{t("contact.badge") || "Available for freelance projects & full-time roles"}</span>
          </div>

          <h1 className="hero-title">
            <span dangerouslySetInnerHTML={{ __html: t("contact.heading") || "Get In <span>Touch</span>" }} />
          </h1>

          <p className="hero-subtitle">
            {t("contact.subtitle") || "Have a project in mind, an internship or full-time opportunity, or just want to say hi? I'd love to connect!"}
          </p>
        </section>

        {/* Main Grid: Info Cards (Left) + Contact Form (Right) */}
        <div className="contact-grid">
          
          {/* Left Column: Contact Cards */}
          <div className="contact-info-column">
            
            {/* Email Card */}
            <div className="glass-card info-card">
              <div className="card-icon-wrap email-icon">
                <i className="bx bx-envelope"></i>
              </div>
              <div className="card-text">
                <span className="card-label">{t("contact.cards.email_title") || "Email Address"}</span>
                <a href="mailto:ahrarikashif@gmail.com" className="card-val" id="emailVal">ahrarikashif@gmail.com</a>
                <p className="card-desc">{t("contact.cards.email_desc") || "Direct inbox • quick response"}</p>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="action-btn copy-btn"
                  onClick={() => copyToClipboard("ahrarikashif@gmail.com")}
                  aria-label="Copy email address"
                >
                  <i className="bx bx-copy"></i>
                  <span className="btn-text">{isCopied ? "Copied" : (t("contact.cards.copy_btn") || "Copy")}</span>
                </button>
                <a href="mailto:ahrarikashif@gmail.com" className="action-btn primary-action" aria-label="Send Email">
                  <i className="bx bx-send"></i>
                </a>
              </div>
            </div>

            {/* Phone / WhatsApp Card */}
            <div className="glass-card info-card">
              <div className="card-icon-wrap phone-icon">
                <i className="bx bxl-whatsapp"></i>
              </div>
              <div className="card-text">
                <span className="card-label">{t("contact.cards.phone_title") || "Phone & WhatsApp"}</span>
                <a href="tel:+917905291957" className="card-val" id="phoneVal">+91 79052 91957</a>
                <p className="card-desc">{t("contact.cards.phone_desc") || "Available Mon - Sat (9 AM - 8 PM IST)"}</p>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="action-btn copy-btn"
                  onClick={() => copyToClipboard("+917905291957")}
                  aria-label="Copy phone number"
                >
                  <i className="bx bx-copy"></i>
                  <span className="btn-text">{isCopied ? "Copied" : (t("contact.cards.copy_btn") || "Copy")}</span>
                </button>
                <a
                  href="https://wa.me/917905291957?text=Hi%20Kashif,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn whatsapp-action"
                  aria-label="Chat on WhatsApp"
                >
                  <i className="bx bxl-whatsapp"></i>
                  <span className="btn-text">{t("contact.cards.whatsapp_btn") || "Chat"}</span>
                </a>
              </div>
            </div>

            {/* Location Card with Live Clock */}
            <div className="glass-card info-card">
              <div className="card-icon-wrap location-icon">
                <i className="bx bx-map-pin"></i>
              </div>
              <div className="card-text">
                <span className="card-label">{t("contact.cards.location_title") || "Location"}</span>
                <span className="card-val">Bengaluru, Karnataka, India</span>
                <p className="card-desc">{t("contact.cards.location_desc") || "BTM Layout 2nd Stage (Silk Board)"}</p>
              </div>
              <div className="card-badge live-time-badge" id="liveTimeBadge">
                <i className="bx bx-time-five"></i>
                <span id="currentTime">{liveTime || "--:--:-- IST"}</span>
              </div>
            </div>

            {/* Social Profiles Card */}
            <div className="glass-card info-card socials-card">
              <div className="social-header">
                <div className="card-icon-wrap social-icon">
                  <i className="bx bx-share-alt"></i>
                </div>
                <div>
                  <span className="card-label">{t("contact.cards.social_title") || "Social Profiles"}</span>
                  <p className="card-desc">{t("contact.cards.social_desc") || "Let's connect on professional networks"}</p>
                </div>
              </div>

              <div className="social-badges-grid">
                <a
                  href="https://www.linkedin.com/in/mohd-kashif-9096a4227"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill linkedin"
                  aria-label="LinkedIn"
                >
                  <i className="bx bxl-linkedin"></i>
                  <span>LinkedIn</span>
                  <i className="bx bx-up-arrow-alt arrow"></i>
                </a>

                <a
                  href="https://github.com/Kashifahrari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill github"
                  aria-label="GitHub"
                >
                  <i className="bx bxl-github"></i>
                  <span>GitHub</span>
                  <i className="bx bx-up-arrow-alt arrow"></i>
                </a>

                <a
                  href="https://www.geeksforgeeks.org/profile/mohd_kashif_ahrari?tab=articles&page=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-pill gfg"
                  aria-label="GeeksforGeeks"
                >
                  <i className="bx bx-code-alt"></i>
                  <span>GFG Author</span>
                  <i className="bx bx-up-arrow-alt arrow"></i>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form Card */}
          <div className="glass-card form-card">
            <div className="form-header">
              <h2 className="form-title" dangerouslySetInnerHTML={{ __html: t("contact.form.title") || "Send Me a <span>Message</span>" }} />
              <p className="form-subtitle">{t("contact.form.subtitle") || "Fill out the form below and I'll get back to you within 24 hours."}</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className={`form-group ${errors.name ? "has-error" : ""}`}>
                  <label htmlFor="userName" className="field-label">{t("contact.form.nameLabel") || "Your Name"}</label>
                  <div className={`input-wrap ${errors.name ? "error" : ""}`}>
                    <i className="bx bx-user input-icon"></i>
                    <input
                      type="text"
                      id="userName"
                      name="name"
                      required
                      placeholder={t("contact.form.namePlaceholder") || "Mohd Kashif"}
                      value={form.name}
                      onChange={handleChange}
                      className={errors.name ? "error" : ""}
                    />
                  </div>
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>

                <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                  <label htmlFor="userEmail" className="field-label">{t("contact.form.emailLabel") || "Email Address"}</label>
                  <div className={`input-wrap ${errors.email ? "error" : ""}`}>
                    <i className="bx bx-envelope input-icon"></i>
                    <input
                      type="email"
                      id="userEmail"
                      name="email"
                      required
                      placeholder={t("contact.form.emailPlaceholder") || "you@example.com"}
                      value={form.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                    />
                  </div>
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="customSubject" className="field-label">{t("contact.form.subjectLabel") || "Project Title / Headline"}</label>
                <div className="input-wrap">
                  <i className="bx bx-bookmark-alt input-icon"></i>
                  <input
                    type="text"
                    id="customSubject"
                    name="subject"
                    placeholder={t("contact.form.subjectPlaceholder") || "Web Development / Full-Stack Project / Hiring"}
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={`form-group ${errors.message ? "has-error" : ""}`}>
                <div className="label-with-counter">
                  <label htmlFor="userMessage" className="field-label">{t("contact.form.messageLabel") || "Your Message"}</label>
                  <span className="char-counter"><span>{charCount}</span>/500</span>
                </div>
                <div className={`input-wrap textarea-wrap ${errors.message ? "error" : ""}`}>
                  <i className="bx bx-message-square-detail input-icon textarea-icon"></i>
                  <textarea
                    id="userMessage"
                    name="message"
                    rows={4}
                    maxLength={500}
                    required
                    placeholder={t("contact.form.messagePlaceholder") || "Tell me about your project, timeline, or just say hello..."}
                    value={form.message}
                    onChange={handleChange}
                    className={errors.message ? "error" : ""}
                  ></textarea>
                </div>
                {errors.message && <span className="error-msg">{errors.message}</span>}
              </div>

              <button type="submit" className={`submit-btn${isSubmitting ? " loading" : ""}`} disabled={isSubmitting}>
                <span className="btn-content">
                  <span className="btn-text">
                    {t("contact.form.send") || "Send Message ??"}
                  </span>
                  <i className="bx bx-paper-plane btn-icon"></i>
                </span>
                <span className="spinner" id="btnSpinner"></span>
              </button>
            </form>
          </div>
        </div>

        {/* Quick Connect Direct Bar */}
        <section className="quick-connect-section glass-card">
          <div className="quick-connect-content">
            <div className="quick-connect-text">
              <h3>{t("contact.quickConnect.title") || "Prefer Direct Communication?"}</h3>
              <p>{t("contact.quickConnect.desc") || "Skip the form and reach out directly through WhatsApp, Email, or LinkedIn."}</p>
            </div>
            <div className="quick-connect-buttons">
              <a
                href="https://wa.me/917905291957?text=Hi%20Kashif,%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="direct-btn whatsapp"
              >
                <i className="bx bxl-whatsapp"></i>
                <span>WhatsApp</span>
              </a>
              <a href="mailto:ahrarikashif@gmail.com" className="direct-btn email">
                <i className="bx bx-envelope"></i>
                <span>Email</span>
              </a>
              <a
                href="https://www.linkedin.com/in/mohd-kashif-9096a4227"
                target="_blank"
                rel="noopener noreferrer"
                className="direct-btn linkedin"
              >
                <i className="bx bxl-linkedin"></i>
                <span>LinkedIn</span>
              </a>
              <Link
                to="/portal?tab=inbox"
                className="direct-btn inbox-link"
                style={{ borderColor: "rgba(255, 107, 107, 0.4)", background: "rgba(255, 107, 107, 0.08)", color: "var(--accent-coral)" }}
                title="View All Received Inquiries (Password Protected)"
              >
                <i className="bx bx-envelope"></i>
                <span>Messages ??</span>
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* Success Modal Popup */}
      {showSuccess && (
        <div className="modal-overlay active" role="dialog" onClick={(e) => e.target === e.currentTarget && setShowSuccess(false)}>
          <div className="modal-card">
            <div className="modal-icon-wrap">
              <i className="bx bx-check"></i>
            </div>
            <h3 className="modal-title">{t("contact.form.successTitle") || "Thank You! ??"}</h3>
            <p className="modal-msg">{t("contact.form.successMsg") || "Your message has been sent successfully. I will get back to you as soon as possible!"}</p>
            <button className="modal-close-btn" onClick={() => setShowSuccess(false)}>{t("contact.form.closeModal") || "Close"}</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ContactPage;

