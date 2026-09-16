import { Link } from "react-router-dom";
import React from "react";

interface AuthLockScreenProps {
  handleUnlock: (e: React.FormEvent) => void;
  enteredPin: string;
  setEnteredPin: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  pinError: string;
}

export const AuthLockScreen: React.FC<AuthLockScreenProps> = ({
  handleUnlock,
  enteredPin,
  setEnteredPin,
  showPassword,
  setShowPassword,
  pinError,
}) => {
  return (
    <div className="auth-lock-screen">
      <div className="glass-card auth-card">
        <div className="auth-icon-wrap">
          <i className="bx bxs-lock-alt"></i>
        </div>
        <h2 className="auth-title">PROJECT TITAN // CLASSIFIED ??</h2>
        <p className="auth-subtitle">
          Next-Generation Autonomous Architecture & Quantum Execution Engine. Stealth deployment in progress. Access restricted to Founder & Core Engineering.
        </p>
        <form className="auth-form" onSubmit={handleUnlock}>
          <div className="password-input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Enter Secret Passcode..."
              required
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={"bx " + (showPassword ? "bx-hide" : "bx-show")}></i>
            </button>
          </div>
          {pinError && <div className="auth-error-msg" style={{ color: 'var(--accent-coral)', fontSize: '1.25rem', marginTop: '0.5rem', fontWeight: 600 }}>{pinError}</div>}
          <button type="submit" className="btn btn-primary btn-lg">
            Decrypt Classified Terminal ??
          </button>
        </form>
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link to="/" className="btn btn-glass btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <i className="bx bx-arrow-back"></i> Return to Portfolio
          </Link>
        </div>
        <div className="auth-hint">
          <span>??? Level-5 Cryptographic Enclave � Stealth R&D Vault</span>
        </div>
      </div>
    </div>
  );
};
