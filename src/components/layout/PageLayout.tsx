import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useParticles } from "../../hooks/useParticles";
import { useSecurityGuard } from "../../hooks/useSecurityGuard";
import Preloader from "../interactive/Preloader";
import CustomCursor from "../interactive/CustomCursor";
import TerminalModal from "../interactive/TerminalModal";
import ScrollTools from "../interactive/ScrollTools";
import ATSResumeModal from "../interactive/ATSResumeModal";
import ProjectModal from "../interactive/ProjectModal";

interface PageLayoutProps {
  children: React.ReactNode;
  showPreloaderAlways?: boolean;
  noHeader?: boolean;
  noFooter?: boolean;
}

const PageLayout = ({ children, showPreloaderAlways = false, noHeader = false, noFooter = false }: PageLayoutProps) => {
  useParticles();
  useSecurityGuard();
  const location = useLocation();

  return (
    <>
      {/* Cyber Stargate Preloader */}
      <Preloader forceShow={showPreloaderAlways} />
      {/* Ambient Particle Background */}
      <div id="particles-js" aria-hidden="true" />
      <div className="ambient-glow glow-1" aria-hidden="true" />
      <div className="ambient-glow glow-2" aria-hidden="true" />
      <div className="ambient-glow glow-3" aria-hidden="true" />

      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Sticky Header */}
      {!noHeader && <Header />}

      {/* Main Content */}
      <main id="main-content">
        {children}
      </main>

      {/* Footer */}
      {!noFooter && <Footer />}

      {/* Global Floating Widgets */}
      <TerminalModal />
      <ScrollTools />

      {/* Global Modals (singletons, opened via ModalContext) */}
      <ATSResumeModal />
      <ProjectModal />
    </>
  );
};

export default PageLayout;

