import React, { useCallback } from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { useModal } from "../../context/ModalContext";

const CIRCUMFERENCE = 138;

const ScrollTools = () => {
  const { scrollPercent, showScrollTop } = useScrollProgress();
  const { toastMessage } = useModal();

  const dashOffset = CIRCUMFERENCE - (CIRCUMFERENCE * scrollPercent) / 100;

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Scroll to Top with Circular Progress Ring */}
      <div
        className={`scroll-top-wrap${showScrollTop ? " visible" : ""}`}
        onClick={scrollToTop}
        role="button"
        aria-label="Scroll to top"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToTop()}
      >
        <svg className="scroll-progress-svg" viewBox="0 0 48 48">
          <circle className="scroll-progress-bg" cx="24" cy="24" r="22" />
          <circle
            className="scroll-progress-bar"
            cx="24"
            cy="24"
            r="22"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <i className="bx bx-chevrons-up scroll-top-icon" aria-hidden="true"></i>
      </div>

      {/* Copy Toast Notification */}
      <div className={`cyber-toast-container${toastMessage ? " active" : ""}`} aria-live="polite">
        {toastMessage && (
          <div className="cyber-toast">
            <i className="bx bx-check-circle" aria-hidden="true"></i>
            <span className="cyber-toast-highlight">{toastMessage}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ScrollTools;

