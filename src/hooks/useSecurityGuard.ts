import { useEffect } from "react";

export const useSecurityGuard = () => {
  useEffect(() => {
    const showToast = (msg: string) => {
      let toast = document.getElementById("security-toast-guard");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "security-toast-guard";
        Object.assign(toast.style, {
          position: "fixed", bottom: "24px", right: "24px", zIndex: "999999",
          background: "rgba(11,30,51,0.92)", backdropFilter: "blur(16px)",
          webkitBackdropFilter: "blur(16px)", border: "1px solid rgba(0,171,240,0.4)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 15px rgba(0,171,240,0.2)",
          color: "#e2e8f0", padding: "12px 20px", borderRadius: "12px",
          fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: "600",
          letterSpacing: "0.02em", opacity: "0", transition: "opacity 0.3s ease",
          display: "flex", alignItems: "center", gap: "10px",
        });
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.style.opacity = "1";
      setTimeout(() => { if (toast) toast.style.opacity = "0"; }, 2500);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showToast("🔒 Right-click is disabled to protect source assets.");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      if (e.key === "F12") { e.preventDefault(); showToast("🔒 Developer Tools shortcut (F12) is disabled."); return; }
      if (isCtrl && isShift && ["I","i","J","j","C","c"].includes(e.key)) { e.preventDefault(); showToast("🔒 Element inspection is protected."); return; }
      if (isCtrl && ["U","u"].includes(e.key)) { e.preventDefault(); showToast("🔒 Source view shortcut (Ctrl+U) is disabled."); return; }
      if (isCtrl && ["S","s"].includes(e.key)) { e.preventDefault(); showToast("🔒 Page saving is disabled."); return; }
    };

    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);
};
