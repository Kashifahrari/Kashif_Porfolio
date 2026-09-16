import React, { useEffect, useRef, useCallback, useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useTheme } from "../../context/ThemeContext";
import { streamAIReply, checkBackendHealth, DEFAULT_BACKEND_URL } from "../../services/aiAgentService";
import type { AIAgentMessage, AIBackendStatus } from "../../types";

const COMMANDS: Record<string, string> = {
  help: `<strong>Available CLI &amp; AI Agent Commands:</strong>
  <span class="t-badge t-badge-ai">ai &lt;query&gt;</span>   - 🤖 Stream live AI response from Render agent (e.g. <span class="t-hint-cmd">ai why hire Kashif?</span>)
  <span class="t-badge t-badge-ai">ask &lt;query&gt;</span>  - 🤖 Alias for AI streaming prompt
  <span class="t-badge t-badge-ai">ai status</span>    - ⚡ Check Render backend connection &amp; latency
  <span class="t-badge">about</span>         - Summary of background, degree &amp; current role
  <span class="t-badge">skills</span>        - Technical stack, frameworks, tools &amp; DSA
  <span class="t-badge">projects</span>      - Featured production applications &amp; repos
  <span class="t-badge">experience</span>    - Software engineering roles &amp; milestones
  <span class="t-badge">certs</span>         - 15+ verified credentials &amp; certifications
  <span class="t-badge">contact</span>       - Email, Phone, LinkedIn &amp; WhatsApp
  <span class="t-badge">sudo hire</span>     - 🎉 Direct hiring hotline &amp; fast-track collaboration
  <span class="t-badge">theme</span>         - Toggle between Dark and Bright mode
  <span class="t-badge">whoami</span>        - Display current visitor session info
  <span class="t-badge">clear</span>         - Clear the terminal screen
  <span class="t-badge">abort</span>         - Stop current AI streaming response (or Ctrl+C)
  <span class="t-badge">exit</span>          - Close the CLI window`,
  about: `<strong>Mohd Kashif Ahrari</strong> — Software Engineer &amp; Full-Stack Developer
• <strong>Current Role:</strong> Software Engineer at Dhira Software Labs (promoted from Full-Stack Intern)
• <strong>Education:</strong> B.E in Computer Science &amp; Engineering from Cambridge Institute of Technology (8.66 CGPA / 86.6%)
• <strong>Author:</strong> Published Technical Author on GeeksforGeeks with <strong>61,000+ readers</strong>
• <strong>Specialization:</strong> React 19, TypeScript, React Flow, Node.js, Express, Java (DSA), SQL &amp; MongoDB`,
  skills: `<strong>Core Technical Stack:</strong>
  • <strong>Languages:</strong> JavaScript (ES6+), TypeScript, Java, Python, SQL, HTML5, CSS3/SCSS
  • <strong>Frontend:</strong> React 19, React Flow (@xyflow/react), TanStack Query, Vite, Tailwind CSS, Bootstrap 5
  • <strong>Backend &amp; APIs:</strong> Node.js, Express.js, RESTful APIs, JWT Auth, Passport.js, Appwrite
  • <strong>Databases:</strong> MongoDB, MySQL, PostgreSQL
  • <strong>Tools &amp; DevOps:</strong> Git, GitHub, Postman, jsPDF, Webpack, Vercel, VS Code`,
  projects: `<strong>Featured Production Projects:</strong>
  1. <strong>CBSE Aakalan (CBA Platform)</strong> — Assessment management system for CBSE at Dhira Software Labs.
  2. <strong>Stay Ease Rental Platform</strong> — Full-stack rental web app with Passport.js authentication &amp; CRUD listings.
  3. <strong>Mega-Vlog</strong> — Modern blogging platform powered by React &amp; Appwrite backend.
  4. <strong>Student Attendance Management System</strong> — Real-time attendance calculation engine in PHP &amp; MySQL.`,
  experience: `<strong>Professional Experience:</strong>
  • <strong>Software Engineer</strong> @ Dhira Software Labs (Feb 2026 – Present)
    - Promoted from Full-Stack Intern to full-time Software Engineer.
    - Engineered CBSE Aakalan platform with TanStack Query and client-side PDF generation.
    - Implemented JWT authentication rotation and secure RESTful middleware.
  • <strong>Backend Intern</strong> @ SM Web Solutions (Oct 2024 – Nov 2024)
    - Built RESTful APIs with Express.js and MySQL; optimized slow DB queries by 40%.
  • <strong>Technical Content Writer</strong> @ GeeksforGeeks (May 2024 – Present)
    - Published 10+ in-depth technical articles reaching 61,000+ global readers.`,
  certs: `<strong>15+ Verified Credentials:</strong>
  1. IBM - API Development
  2. Rooman Technologies - Web Developer Internship
  3. SM Web Solutions - Backend Intern Certificate
  4. IIT Allahabad - Web Development
  5. GeeksforGeeks - Content Writer Intern
  6. NIPAM - IPR &amp; Blockchain
  7. NPTEL - Python Programming
  8. Cisco - Cybersecurity Essentials
  9. HackerRank - React.js (5-Star)
  10. HackerRank - Problem Solving
  11. Dhira Software Labs - Full-Stack Intern
  12. NIPAM - Design Rights
  13. Dhira Software Labs - Software Engineer Promotion
  14. HackerRank - JavaScript
  15. HackerRank - SQL`,
  contact: `<strong>Contact Information:</strong>
  • <strong>Email:</strong> <a href="mailto:ahrarikashif@gmail.com" style="color:#00abf0">ahrarikashif@gmail.com</a>
  • <strong>Phone:</strong> +91 79052 91957
  • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/mohd-kashif-9096a4227" target="_blank" style="color:#00abf0">linkedin.com/in/mohd-kashif</a>
  • <strong>WhatsApp:</strong> <a href="https://wa.me/917905291957" target="_blank" style="color:#25D366">Chat on WhatsApp</a>`,
  "sudo hire": `🎉 <strong>HIRING MODE ACTIVATED!</strong>
  ┌─────────────────────────────────────────────┐
  │  You&apos;ve unlocked the fast-track hiring hotline  │
  │  Mohd Kashif Ahrari is open to:              │
  │  • Full-time Software Engineering roles       │
  │  • Full-Stack / React / Node.js projects      │
  │  • Remote &amp; On-site opportunities (India)     │
  └─────────────────────────────────────────────┘
  📧 <a href="mailto:ahrarikashif@gmail.com" style="color:#ffd166">ahrarikashif@gmail.com</a>
  📱 <a href="https://wa.me/917905291957" target="_blank" style="color:#25D366">+91 79052 91957 (WhatsApp)</a>`,
  whoami: `visitor@kashif.dev — Guest Session
  • Browser: ${typeof navigator !== "undefined" ? navigator.userAgent.split(" ").slice(-1)[0] : "Unknown"}
  • Time: ${new Date().toLocaleString("en-IN")}
  • Location: kashif.dev terminal
  • Access Level: Public (AI Streaming Active)`,
};

/**
 * Format markdown text safely into terminal HTML
 */
function formatTerminalMarkdown(text: string): string {
  if (!text) return "";
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Fenced code blocks ```...```
  formatted = formatted.replace(
    /```(?:[a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g,
    '<div class="t-code-block">$1</div>'
  );

  // Bold **text**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Inline `code`
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="t-inline-code">$1</code>');
  // Markdown links [text](url)
  formatted = formatted.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="t-link">$1</a>'
  );
  // Auto-link naked URLs
  formatted = formatted.replace(
    /(^|[^"'])(https?:\/\/[^\s<]+)/g,
    '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="t-link">$2</a>'
  );
  // Bullet points
  formatted = formatted.replace(/^[•\-\*]\s+(.*)$/gm, "• $1");
  // Linebreaks
  formatted = formatted.replace(/\n/g, "<br/>");

  return formatted;
}


const TerminalModal: React.FC = () => {
  const { isTerminalOpen, toggleTerminal, closeTerminal } = useModal();
  const { toggleTheme } = useTheme();

  const [backendStatus, setBackendStatus] = useState<AIBackendStatus>("connecting");
  const [isStreaming, setIsStreaming] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef(-1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const conversationHistoryRef = useRef<AIAgentMessage[]>([]);

  // Health check on opening modal
  useEffect(() => {
    let isMounted = true;
    if (isTerminalOpen) {
      checkBackendHealth(5000).then(({ status, latencyMs }) => {
        if (!isMounted) return;
        setBackendStatus(status);
        if (latencyMs !== undefined) setLatency(latencyMs);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isTerminalOpen]);

  // Global ~ key shortcut and Ctrl+C abort
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "~" || e.key === "`") {
        e.preventDefault();
        toggleTerminal();
      }
      if (e.key === "Escape" && isTerminalOpen) {
        if (isStreaming && abortControllerRef.current) {
          abortControllerRef.current.abort();
        } else {
          closeTerminal();
        }
      }
      if (e.ctrlKey && e.key.toLowerCase() === "c" && isStreaming) {
        e.preventDefault();
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isTerminalOpen, isStreaming, toggleTerminal, closeTerminal]);

  // Auto-focus input on open
  useEffect(() => {
    if (isTerminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isTerminalOpen]);

  const scrollToBottom = useCallback(() => {
    const body = logRef.current?.closest(".terminal-body");
    if (body) body.scrollTop = body.scrollHeight;
  }, []);

  const appendLog = useCallback((cmd: string, output: string) => {
    if (!logRef.current) return;
    const entry = document.createElement("div");
    entry.className = "t-log-entry";
    entry.innerHTML = `
      <div class="t-prompt-row">
        <span class="t-prompt-user">visitor</span><span class="t-prompt-at">@</span><span class="t-prompt-host">kashif.dev</span>:<span class="t-prompt-path">~</span>$ ${cmd}
      </div>
      <div class="t-output">${output}</div>
    `;
    logRef.current.appendChild(entry);
    scrollToBottom();
  }, [scrollToBottom]);

  /**
   * Handle streaming AI query from Render backend
   */
  const handleAIStream = useCallback(
    async (rawPrompt: string) => {
      const prompt = rawPrompt.trim();
      if (!prompt) return;

      if (!logRef.current) return;

      // Abort previous streaming request if running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsStreaming(true);
      setBackendStatus("streaming");

      // Create stream entry in DOM
      const entry = document.createElement("div");
      entry.className = "t-log-entry t-ai-entry";

      const promptHeader = document.createElement("div");
      promptHeader.className = "t-prompt-row";
      promptHeader.innerHTML = `
        <span class="t-prompt-user">visitor</span><span class="t-prompt-at">@</span><span class="t-prompt-host">kashif.dev</span>:<span class="t-prompt-path">~</span>$ <span class="t-cmd-hl">${rawPrompt}</span>
      `;

      const outputContainer = document.createElement("div");
      outputContainer.className = "t-output t-ai-output";
      
      const badge = document.createElement("div");
      badge.className = "t-ai-status-badge";
      badge.innerHTML = `<span class="t-ai-dot"></span> <span class="t-ai-tag">AI STREAMING</span> <span class="t-ai-origin">[Render Backend: ${DEFAULT_BACKEND_URL}]</span>`;
      
      const contentElem = document.createElement("div");
      contentElem.className = "t-ai-content";
      contentElem.innerHTML = `<span class="t-stream-cursor">▊</span>`;

      outputContainer.appendChild(badge);
      outputContainer.appendChild(contentElem);
      entry.appendChild(promptHeader);
      entry.appendChild(outputContainer);
      logRef.current.appendChild(entry);
      scrollToBottom();

      try {
        const fullResponse = await streamAIReply({
          prompt,
          history: conversationHistoryRef.current,
          onChunk: (_chunk, accumulated) => {
            contentElem.innerHTML = `${formatTerminalMarkdown(accumulated)}<span class="t-stream-cursor">▊</span>`;
            scrollToBottom();
          },
          onStatusChange: (status) => {
            setBackendStatus(status);
            if (status === "waking_up") {
              badge.innerHTML = `<span class="t-ai-dot warning"></span> <span class="t-ai-tag">WAKING UP RENDER BACKEND...</span> (Free-tier spinup: ~30s)`;
            } else if (status === "streaming") {
              badge.innerHTML = `<span class="t-ai-dot live"></span> <span class="t-ai-tag">AI STREAMING</span> <span class="t-ai-origin">[Render SSE]</span>`;
            } else if (status === "offline") {
              badge.innerHTML = `<span class="t-ai-dot done"></span> <span class="t-ai-tag">PORTFOLIO AI AGENT</span> <span class="t-ai-origin">[Knowledge Base]</span>`;
            }
          },
          signal: controller.signal,
        });

        // Finalize completed output
        contentElem.innerHTML = formatTerminalMarkdown(fullResponse);
        const originLabel = backendStatus === "online" || backendStatus === "streaming" ? "Render Live API" : "Portfolio Knowledge Engine";
        badge.innerHTML = `<span class="t-ai-dot done"></span> <span class="t-ai-tag">AI AGENT</span> <span class="t-ai-origin">[${originLabel}]</span>`;

        // Add to history
        conversationHistoryRef.current.push(
          { role: "user", content: prompt },
          { role: "assistant", content: fullResponse }
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          contentElem.innerHTML += `<br/><span style="color:#ffbd2e; font-style: italic;">[Stream cancelled by user (Ctrl+C / ESC)]</span>`;
          badge.innerHTML = `<span class="t-ai-dot warning"></span> <span class="t-ai-tag">STREAM ABORTED</span>`;
        } else {
          const message = err instanceof Error ? err.message : String(err);
          contentElem.innerHTML = `<span style="color:#ff6b6b">⚠️ Error connecting to AI backend: ${message}</span><br/><span style="color:#94a3b8">Using local fallback agent...</span>`;
          badge.innerHTML = `<span class="t-ai-dot offline"></span> <span class="t-ai-tag">ERROR</span>`;
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
        setBackendStatus("online");
        scrollToBottom();
      }
    },
    [scrollToBottom]
  );

  const processCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const lower = trimmed.toLowerCase();
      historyRef.current.unshift(raw);
      historyIdxRef.current = -1;

      // Handle AI Commands
      if (lower.startsWith("ai ") || lower.startsWith("ask ") || lower.startsWith("agent ")) {
        const query = trimmed.replace(/^(ai|ask|agent)\s+/i, "");
        if (query.trim() === "status" || query.trim() === "ping") {
          checkBackendStatus();
          return;
        }
        handleAIStream(query);
        return;
      }

      if (lower === "ai" || lower === "ask" || lower === "agent") {
        appendLog(
          raw,
          `🤖 <strong>AI Streaming Agent Usage:</strong><br/>Type <code class="t-inline-code">ai &lt;your question&gt;</code> to chat with Kashif's live AI agent.<br/>Examples:<br/>• <span class="t-link" onclick="window.dispatchCliPrompt && window.dispatchCliPrompt('ai summarize Kashif\\'s experience')">ai summarize Kashif's experience</span><br/>• <span class="t-link" onclick="window.dispatchCliPrompt && window.dispatchCliPrompt('ai how was CBSE Aakalan built?')">ai how was CBSE Aakalan built?</span><br/>• <span class="t-link" onclick="window.dispatchCliPrompt && window.dispatchCliPrompt('ai what are his strengths in React 19?')">ai what are his strengths in React 19?</span>`
        );
        return;
      }

      if (lower === "ai status" || lower === "ai ping") {
        checkBackendStatus();
        return;
      }

      if (lower === "abort" || lower === "cancel") {
        if (isStreaming && abortControllerRef.current) {
          abortControllerRef.current.abort();
          appendLog(raw, "🛑 In-flight AI stream cancelled.");
        } else {
          appendLog(raw, "No active AI streaming request to abort.");
        }
        return;
      }

      if (lower === "clear") {
        if (logRef.current) logRef.current.innerHTML = "";
        return;
      }
      if (lower === "exit") {
        closeTerminal();
        return;
      }
      if (lower === "theme") {
        toggleTheme();
        appendLog(raw, "Theme toggled! 🎨");
        return;
      }

      // Check standard dictionary
      if (COMMANDS[lower] || COMMANDS[trimmed]) {
        appendLog(raw, COMMANDS[lower] || COMMANDS[trimmed]);
        return;
      }

      // If unrecognized, route to AI Streaming Agent naturally!
      handleAIStream(trimmed);
    },
    [appendLog, closeTerminal, handleAIStream, isStreaming, toggleTheme]
  );

  const checkBackendStatus = async () => {
    appendLog("ai status", `🔄 Pinging Render AI Backend at <span class="t-link">${DEFAULT_BACKEND_URL}</span>...`);
    const { status, latencyMs } = await checkBackendHealth(7000);
    setBackendStatus(status);
    if (latencyMs !== undefined) setLatency(latencyMs);

    let statusHtml = "";
    if (status === "online") {
      statusHtml = `🟢 <strong>Render AI Backend is ONLINE!</strong><br/>• URL: <code class="t-inline-code">${DEFAULT_BACKEND_URL}</code><br/>• Latency: <strong style="color:#10b981">${latencyMs}ms</strong><br/>• Ready to stream AI responses via <code class="t-inline-code">ai &lt;query&gt;</code>`;
    } else if (status === "waking_up") {
      statusHtml = `🟡 <strong>Render AI Backend is WAKING UP</strong> (Free-tier spin-up active).<br/>• Cold-start takes ~30-50s on initial ping.<br/>• Client will automatically stream and fall back seamlessly.`;
    } else {
      statusHtml = `🔴 <strong>Render AI Backend is currently unreachable.</strong><br/>• Local grounding AI knowledge base active as fallback.<br/>• Set <code class="t-inline-code">VITE_AI_BACKEND_URL</code> in your environment to point to your live instance.`;
    }
    appendLog("ai status", statusHtml);
  };

  // Expose global prompt trigger for clickable sample questions
  useEffect(() => {
    (window as unknown as { dispatchCliPrompt?: (prompt: string) => void }).dispatchCliPrompt = (prompt: string) => {
      if (inputRef.current) {
        inputRef.current.value = prompt;
      }
      processCommand(prompt);
      if (inputRef.current) inputRef.current.value = "";
    };
    return () => {
      delete (window as unknown as { dispatchCliPrompt?: (prompt: string) => void }).dispatchCliPrompt;
    };
  }, [processCommand]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(e.currentTarget.value);
      e.currentTarget.value = "";
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      historyIdxRef.current = Math.min(historyIdxRef.current + 1, historyRef.current.length - 1);
      if (inputRef.current) inputRef.current.value = historyRef.current[historyIdxRef.current] || "";
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      historyIdxRef.current = Math.max(historyIdxRef.current - 1, -1);
      if (inputRef.current) inputRef.current.value = historyIdxRef.current >= 0 ? historyRef.current[historyIdxRef.current] : "";
    }
  };

  const getStatusBadge = () => {
    switch (backendStatus) {
      case "streaming":
        return <span className="terminal-status-pill streaming">● AI Streaming...</span>;
      case "online":
        return (
          <span className="terminal-status-pill online" title={`Render Live: ${DEFAULT_BACKEND_URL}`}>
            ● AI Live {latency ? `(${latency}ms)` : "[Render]"}
          </span>
        );
      case "waking_up":
        return <span className="terminal-status-pill waking">🟡 Waking Backend...</span>;
      case "offline":
      default:
        return <span className="terminal-status-pill offline" title="Offline - Using Local Fallback">⚪ AI Fallback</span>;
    }
  };

  if (!isTerminalOpen) {
    return (
      <button
        className="terminal-launcher-btn"
        id="terminalLauncherBtn"
        title="Open Interactive Developer CLI & AI Agent (Press ~ or click)"
        onClick={toggleTerminal}
        aria-label="Open Terminal"
      >
        <span className="cli-dot"></span>
        <span>&gt;_ AI CLI</span>
      </button>
    );
  }

  return (
    <>
      <button
        className="terminal-launcher-btn"
        id="terminalLauncherBtn"
        onClick={toggleTerminal}
        title="Toggle Terminal"
        aria-label="Toggle Terminal"
      >
        <span className="cli-dot"></span>
        <span>&gt;_ AI CLI</span>
      </button>

      <div
        className="terminal-modal-overlay active"
        id="terminalModal"
        role="dialog"
        aria-label="Interactive CLI Terminal"
        aria-hidden="false"
      >
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-controls">
              <button className="t-btn t-close" id="tCloseBtn" title="Close" onClick={closeTerminal}></button>
              <button
                className="t-btn t-min"
                id="tMinBtn"
                title="Clear screen"
                onClick={() => {
                  if (logRef.current) logRef.current.innerHTML = "";
                }}
              ></button>
              <button
                className="t-btn t-max"
                id="tMaxBtn"
                title="Help"
                onClick={() => processCommand("help")}
              ></button>
            </div>
            <div className="terminal-title">
              <span>kashif@ahrari-ai-agent</span>: ~ (v2.1)
              {getStatusBadge()}
            </div>
            <div className="terminal-shortcut-hint">ESC or ~ to exit</div>
          </div>

          <div className="terminal-body" id="terminalBody">
            <div className="t-welcome-banner">
  ███╗   ███╗██╗  ██╗    ████████╗███████╗██████╗ ███╗   ███╗
  ████╗ ████║██║ ██╔╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
  ██╔████╔██║█████═╝        ██║   █████╗  ██████╔╝██╔████╔██║
  ██║╚██╔╝██║██╔═██╗        ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
  ██║ ╚═╝ ██║██║  ██╗       ██║   ███████╗██║  ██║██║ ╚═╝ ██║
  ╚═╝     ╚═╝╚═╝  ╚═╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
            </div>
            <p style={{ color: "#94a3b8" }}>
              Welcome to <strong>Mohd Kashif Ahrari&apos;s AI Streaming Terminal</strong> [v2.1.0].
            </p>
            <p className="t-hint">
              ⚡ Powered by live Render backend streaming agent. Type{" "}
              <strong style={{ color: "#00abf0" }}>&apos;ai &lt;question&gt;&apos;</strong> or choose a quick prompt:
            </p>

            <div className="t-quick-prompts">
              <button
                type="button"
                className="t-prompt-chip"
                onClick={() => processCommand("ai What makes Kashif an exceptional Software Engineer?")}
              >
                🤖 Why hire Kashif?
              </button>
              <button
                type="button"
                className="t-prompt-chip"
                onClick={() => processCommand("ai Explain the CBSE Aakalan architecture")}
              >
                🏗️ CBSE Aakalan Architecture
              </button>
              <button
                type="button"
                className="t-prompt-chip"
                onClick={() => processCommand("ai Tell me about his React 19 & TypeScript experience")}
              >
                ⚡ React 19 &amp; TypeScript
              </button>
              <button
                type="button"
                className="t-prompt-chip"
                onClick={() => processCommand("ai status")}
              >
                📡 Check Render API Status
              </button>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid rgba(0,171,240,0.2)", margin: "0.5rem 0" }} />

            <div id="terminalLogContainer" ref={logRef}></div>

            <div className="terminal-input-row">
              <div className="t-prompt-row">
                <span className="t-prompt-user">visitor</span>
                <span className="t-prompt-at">@</span>
                <span className="t-prompt-host">kashif.dev</span>:
                <span className="t-prompt-path">~</span>$
              </div>
              <input
                ref={inputRef}
                type="text"
                className="t-input-field"
                id="terminalInput"
                autoComplete="off"
                spellCheck={false}
                placeholder={isStreaming ? "AI is streaming response... (Ctrl+C to abort)" : "Type 'ai <question>' or command..."}
                onKeyDown={handleKeyDown}
                disabled={false}
              />
              {isStreaming && (
                <button
                  type="button"
                  className="t-abort-btn"
                  title="Abort Stream (Ctrl+C)"
                  onClick={() => abortControllerRef.current?.abort()}
                >
                  ■ Abort
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TerminalModal;
