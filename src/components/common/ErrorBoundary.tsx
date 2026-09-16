import React from "react";

interface State { hasError: boolean; error?: Error }

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught:", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "var(--bg-color)", color: "var(--text-color)",
          fontFamily: "Outfit, sans-serif", gap: "1.5rem", padding: "2rem"
        }}>
          <span style={{ fontSize: "4rem" }}>⚠️</span>
          <h2 style={{ fontSize: "2.4rem", color: "var(--main-color)" }}>Something went wrong</h2>
          <p style={{ fontSize: "1.4rem", color: "var(--text-muted)", maxWidth: "480px", textAlign: "center" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = "/Kashif_Porfolio/"; }}
            style={{ padding: "1rem 2.4rem", background: "var(--main-color)", color: "#081b29", border: "none",
              borderRadius: "10px", fontSize: "1.5rem", fontWeight: 700, cursor: "pointer" }}
          >
            🏠 Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
