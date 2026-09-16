import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ModalProvider } from "./context/ModalContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import App from "./App";

// Global CSS — ORDER MATTERS
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/preloader.css";
import "./styles/cursor.css";
import "./styles/terminal.css";
import "./styles/scroll-tools.css";
import "./styles/resume-modal.css";
import "./styles/project-modal.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/Kashif_Porfolio">
      <ThemeProvider>
        <LanguageProvider>
          <ModalProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </ModalProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
