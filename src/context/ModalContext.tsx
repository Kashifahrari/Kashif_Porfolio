import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { ProjectKey } from "../types";

interface ModalContextType {
  isResumeOpen: boolean;
  openResume: () => void;
  closeResume: () => void;
  activeProjectKey: ProjectKey | null;
  openProject: (key: ProjectKey) => void;
  closeProject: () => void;
  activeCertIndex: number | null;
  openCert: (index: number) => void;
  closeCert: () => void;
  isTerminalOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  toastMessage: string;
  showToast: (message: string) => void;
}

const ModalContext = createContext<ModalContextType>({
  isResumeOpen: false, openResume: () => {}, closeResume: () => {},
  activeProjectKey: null, openProject: () => {}, closeProject: () => {},
  activeCertIndex: null, openCert: () => {}, closeCert: () => {},
  isTerminalOpen: false, openTerminal: () => {}, closeTerminal: () => {}, toggleTerminal: () => {},
  toastMessage: "", showToast: () => {},
});

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [activeProjectKey, setActiveProjectKey] = useState<ProjectKey | null>(null);
  const [activeCertIndex, setActiveCertIndex] = useState<number | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const openResume = useCallback(() => { setIsResumeOpen(true); document.body.style.overflow = "hidden"; }, []);
  const closeResume = useCallback(() => { setIsResumeOpen(false); document.body.style.overflow = ""; }, []);
  const openProject = useCallback((key: ProjectKey) => { setActiveProjectKey(key); document.body.style.overflow = "hidden"; }, []);
  const closeProject = useCallback(() => { setActiveProjectKey(null); document.body.style.overflow = ""; }, []);
  const openCert = useCallback((index: number) => { setActiveCertIndex(index); document.body.style.overflow = "hidden"; }, []);
  const closeCert = useCallback(() => { setActiveCertIndex(null); document.body.style.overflow = ""; }, []);
  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);
  const toggleTerminal = useCallback(() => setIsTerminalOpen((p) => !p), []);
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2800);
  }, []);

  // Global backward compat
  if (typeof window !== "undefined") {
    window.openProjectModal = (key: string) => openProject(key as ProjectKey);
  }

  return (
    <ModalContext.Provider value={{
      isResumeOpen, openResume, closeResume,
      activeProjectKey, openProject, closeProject,
      activeCertIndex, openCert, closeCert,
      isTerminalOpen, openTerminal, closeTerminal, toggleTerminal,
      toastMessage, showToast,
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
