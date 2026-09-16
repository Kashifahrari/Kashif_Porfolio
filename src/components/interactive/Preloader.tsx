import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PreloaderProps {
  forceShow?: boolean;
}

const STATUS_STEPS = [
  "INITIALIZING CORE ENCLAVE...",
  "LOADING ASSETS...",
  "MOUNTING NEURAL INTERFACE...",
  "BOOTING SYSTEM 2.0...",
  "READY.",
];

const Preloader = ({ forceShow = false }: PreloaderProps) => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(STATUS_STEPS[0]);
  const [percent, setPercent] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const seen = sessionStorage.getItem("kashif_preloader_seen");
    const isContact = location.pathname === "/contact";
    const shouldShow = !seen || isContact || forceShow;

    if (!shouldShow) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem("kashif_preloader_seen", "true");
    setVisible(true);
    setPercent(0);
    setStatus(STATUS_STEPS[0]);
    setFadeOut(false);

    // Animate loading sequence
    const steps = [
      { delay: 200,  pct: 15, statusIdx: 0 },
      { delay: 600,  pct: 35, statusIdx: 1 },
      { delay: 1000, pct: 60, statusIdx: 2 },
      { delay: 1400, pct: 82, statusIdx: 3 },
      { delay: 1800, pct: 100, statusIdx: 4 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach(({ delay, pct, statusIdx }) => {
      timers.push(
        setTimeout(() => {
          setPercent(pct);
          setStatus(STATUS_STEPS[statusIdx]);
        }, delay)
      );
    });

    timers.push(
      setTimeout(() => {
        setFadeOut(true);
        const exitTimer = setTimeout(() => setVisible(false), 400);
        timers.push(exitTimer);
      }, 2400)
    );

    return () => timers.forEach(clearTimeout);
  }, [location.pathname, forceShow]);

  if (!visible) return null;

  return (
    <div
      id="cyber-preloader"
      aria-hidden={fadeOut}
      role="status"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#060f1a",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      <div className="preloader-ambient-glow" />

      <div className="stargate-wrapper">
        <svg className="stargate-svg" viewBox="0 0 300 300">
          <defs>
            <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="reactorGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00abf0" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#00abf0" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="150" cy="150" r="135" fill="url(#reactorGradient)" />

          {/* Outer Ring */}
          <g className="ring-outer">
            <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(0,171,240,0.25)" strokeWidth="1.5" strokeDasharray="8 6 18 4" />
            {[[150,15,3.5],[217,33,3],[267,83,3.5],[285,150,4],[267,217,3.5],[217,267,3],[150,285,4],[83,267,3],[33,217,3.5],[15,150,4],[33,83,3.5],[83,33,3]].map(([cx,cy,r],i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="#00abf0" filter="url(#cyanGlow)" />
            ))}
          </g>

          {/* Middle Ring */}
          <g className="ring-middle">
            <circle cx="150" cy="150" r="102" fill="none" stroke="rgba(255,209,102,0.3)" strokeWidth="2" strokeDasharray="14 10 4 10" />
            {[[150,48,"#ffd166",4.5],[238,99,"#ff9f43",4],[238,201,"#ffd166",4.5],[150,252,"#ff9f43",5],[62,201,"#ffd166",4.5],[62,99,"#ffd166",4]].map(([cx,cy,fill,r],i) => (
              <circle key={i} cx={cx as number} cy={cy as number} r={r as number} fill={fill as string} filter="url(#goldGlow)" />
            ))}
          </g>

          {/* Inner Ring */}
          <g className="ring-inner">
            <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(0,171,240,0.45)" strokeWidth="1.8" strokeDasharray="30 8 10 8" />
            {[[150,80],[210,185],[90,185]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r="2.8" fill="#4ecdc4" filter="url(#cyanGlow)" />
            ))}
          </g>

          <circle className="core-pulse" cx="150" cy="150" r="50" fill="none" stroke="rgba(0,171,240,0.8)" strokeWidth="2.5" />
        </svg>

        <div className="stargate-center-logo">
          <span className="stargate-monogram">MK</span>
          <span className="stargate-subtag">SYSTEM 2.0</span>
        </div>
      </div>

      <div className="preloader-telemetry">
        <div className="preloader-status-text" id="preloaderStatus">{status}</div>
        <div className="preloader-bar-wrap">
          <div className="preloader-bar-fill" id="preloaderFill" style={{ width: `${percent}%` }} />
        </div>
        <div className="preloader-counter" id="preloaderCounter">
          [ <span id="preloaderPct">{String(percent).padStart(2, "0")}</span>% ]
        </div>
      </div>
    </div>
  );
};

export default Preloader;
