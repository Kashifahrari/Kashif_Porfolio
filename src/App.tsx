import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout";

// Lazy load all pages for optimal code splitting
const HomePage = lazy(() => import("./pages/Home/HomePage"));
const AboutPage = lazy(() => import("./pages/About/AboutPage"));
const CertificatesPage = lazy(() => import("./pages/Certificates/CertificatesPage"));
const ProgressPage = lazy(() => import("./pages/Progress/ProgressPage"));
const ContactPage = lazy(() => import("./pages/Contact/ContactPage"));
const PortalPage = lazy(() => import("./pages/Portal/PortalPage"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));
const UnderDevelopmentPage = lazy(() => import("./pages/UnderDevelopment/UnderDevelopmentPage"));
const NotFoundPage = lazy(() => import("./pages/NotFound/NotFoundPage"));

const LoadingFallback = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg-color)" }}>
    <div style={{ width: "48px", height: "48px", border: "3px solid rgba(0,171,240,0.2)", borderTopColor: "#00abf0", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Pages with full layout: Header, Footer, Particles, all widgets */}
        <Route path="/" element={<PageLayout><HomePage /></PageLayout>} />
        <Route path="/about" element={<PageLayout><AboutPage /></PageLayout>} />
        <Route path="/certificates" element={<PageLayout><CertificatesPage /></PageLayout>} />
        <Route path="/progress" element={<PageLayout><ProgressPage /></PageLayout>} />
        {/* Contact page: preloader shows on EVERY visit */}
        <Route path="/contact" element={<PageLayout showPreloaderAlways><ContactPage /></PageLayout>} />
        {/* Portal: no public footer */}
        <Route path="/portal" element={<PageLayout noHeader noFooter><PortalPage /></PageLayout>} />
        {/* Minimal layout pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/under-development" element={<UnderDevelopmentPage />} />
        <Route path="/roadmap-24lpa" element={<UnderDevelopmentPage />} />
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;

