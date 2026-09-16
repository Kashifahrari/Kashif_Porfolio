import type { AIAgentMessage, AIBackendStatus } from "../types";

export const DEFAULT_BACKEND_URL =
  (import.meta.env.VITE_AI_BACKEND_URL as string) || "https://kashif-porfolio.onrender.com";

export interface StreamOptions {
  prompt: string;
  history?: AIAgentMessage[];
  onChunk: (chunk: string, fullText: string) => void;
  onStatusChange?: (status: AIBackendStatus) => void;
  signal?: AbortSignal;
}

// Comprehensive Portfolio Grounding Knowledge
const KASHIF_KNOWLEDGE = {
  about: `Mohd Kashif Ahrari is a Software Engineer at Dhira Software Labs (promoted from Full-Stack Intern).
• Education: B.E in Computer Science & Engineering from Cambridge Institute of Technology (8.66 CGPA / 86.6%)
• Published Technical Author on GeeksforGeeks with 61,000+ global readers.
• Specialization: React 19, TypeScript, React Flow (@xyflow/react), TanStack Query, Node.js, Express, Java (DSA), MongoDB, and SQL.`,

  articles: `Mohd Kashif Ahrari is a published Technical Author on GeeksforGeeks with 61,000+ readers across in-depth guides:
1. "JavaScript HTML DOM Manipulation & Architecture" (61K+ Reads 🔥) — Comprehensive guide on Event Flow, Capturing, Bubbling, and DOM Web APIs. (https://www.geeksforgeeks.org/javascript-html-dom/)
2. "Chi-Square (Χ²) Test in Statistics" — In-depth guide to goodness-of-fit, test of independence, and mathematical computing.
3. "Fundamentals of Graph Theory" — Vertices, edges, planar graphs, Eulerian/Hamiltonian cycles, and graph algorithms.
4. "Estimation in Statistical Inference" — Point estimation vs confidence intervals and Maximum Likelihood Estimation (MLE).
5. "JavaScript Closures Deep Dive" (12K+ Reads) — Scope chains, lexical environments, and modern JS memory patterns.
6. "React Flow: Custom Node Editor" (8K+ Reads) — Interactive node-based editors with @xyflow/react.
7. "Common Debugging Techniques in JS" — Source maps, memory leak profiling, and callstack analysis.

GFG Author Profile: https://www.geeksforgeeks.org/profile/mohd_kashif_ahrari?tab=articles&page=1`,

  projects: `Featured Production Projects engineered by Kashif:
1. CBSE Aakalan (CBA Platform) — Assessment management system for CBSE at Dhira Software Labs built with React 19, TypeScript, TanStack Query, and client-side dynamic PDF generation.
2. Stay Ease Rental Platform — Full-stack rental web app with Passport.js authentication, MongoDB, and full CRUD listings.
3. Mega-Vlog — Modern blogging platform powered by React 19, Appwrite backend-as-a-service, and responsive UI.
4. Student Attendance Management System — Real-time attendance calculation and reporting engine in PHP & MySQL.`,

  skills: `Core Technical Competencies:
• Languages: JavaScript (ES6+), TypeScript, Java, Python, SQL, HTML5, CSS3/SCSS
• Frontend: React 19, React Flow (@xyflow/react), TanStack Query, Vite, Tailwind CSS, Bootstrap 5
• Backend & APIs: Node.js, Express.js, RESTful APIs, JWT Auth, Passport.js, Appwrite
• Databases: MongoDB, MySQL, PostgreSQL
• Tools & DevOps: Git, GitHub, Postman, jsPDF, Webpack, Vercel, VS Code
• DSA & Problem Solving: 5-Star Problem Solving & React on HackerRank, LeetCode (Graph theory, Dijkstra, BFS/DFS, DP).`,

  experience: `Professional Experience:
1. Software Engineer @ Dhira Software Labs (Feb 2026 – Present)
   - Promoted from Full-Stack Intern to full-time Software Engineer.
   - Engineered CBSE Aakalan platform with TanStack Query and client-side PDF generation.
   - Implemented JWT authentication rotation and secure RESTful middleware.
2. Backend Intern @ SM Web Solutions (Oct 2024 – Nov 2024)
   - Built RESTful APIs with Express.js and MySQL; optimized slow DB queries by 40%.
3. Technical Content Writer @ GeeksforGeeks (May 2024 – Present)
   - Published in-depth technical guides reaching 61,000+ global readers.`,

  education: `Educational Qualifications:
• B.E in Computer Science & Engineering (2021 – 2025)
  Cambridge Institute of Technology, Bangalore
  CGPA: 8.66 / 10 (86.6%)
• Focus Areas: Data Structures & Algorithms, Database Management Systems, Computer Networks, Operating Systems, Web Technologies.`,

  certs: `Verified Certifications & Credentials:
1. IBM - API Development
2. Rooman Technologies - Web Developer Internship
3. SM Web Solutions - Backend Intern Certificate
4. IIT Allahabad - Web Development
5. GeeksforGeeks - Content Writer Intern
6. NIPAM - IPR & Blockchain
7. NPTEL - Python Programming
8. Cisco - Cybersecurity Essentials
9. HackerRank - React.js (5-Star)
10. HackerRank - Problem Solving
11. Dhira Software Labs - Software Engineer Promotion
12. HackerRank - JavaScript & SQL`,

  contact: `Contact & Collaboration Details:
• Email: ahrarikashif@gmail.com
• Phone / WhatsApp: +91 79052 91957 (https://wa.me/917905291957)
• LinkedIn: https://www.linkedin.com/in/mohd-kashif-9096a4227
• GeeksforGeeks: https://www.geeksforgeeks.org/profile/mohd_kashif_ahrari?tab=articles&page=1
• GitHub: https://github.com/mohd-kashif-ahrari`,

  hire: `Why Hire Mohd Kashif Ahrari?
1. Production Proven: Fast-tracked promotion to Software Engineer at Dhira Software Labs delivering real enterprise applications (CBSE Aakalan).
2. Deep Technical Knowledge: 61K+ global readers on GeeksforGeeks, demonstrating clear architectural thinking and communication.
3. Modern Stack: React 19, TypeScript, React Flow, Node.js, Express, TanStack Query, and robust SQL/NoSQL databases.
4. Fast Learner & Problem Solver: 8.66 CGPA, 5-Star HackerRank in React and Problem Solving.
5. Immediate Availability: Open for full-time roles & engineering collaborations!
Contact directly: ahrarikashif@gmail.com | +91 79052 91957`,
};

/**
 * Health check to detect if Render backend is online, waking up, or unreachable
 */
export async function checkBackendHealth(
  timeoutMs = 7000
): Promise<{ status: AIBackendStatus; latencyMs?: number }> {
  const url = DEFAULT_BACKEND_URL.replace(/\/+$/, "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  try {
    const res = await fetch(`${url}/api/chat`, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Accept: "*/*" },
      body: JSON.stringify({ message: "ping", prompt: "ping" }),
    }).catch(() =>
      fetch(`${url}/health`, {
        method: "GET",
        signal: controller.signal,
      })
    );

    clearTimeout(timer);
    const latencyMs = Date.now() - startTime;

    if (res && (res.ok || res.status === 405 || res.status === 200)) {
      return { status: "online", latencyMs };
    }
    return { status: "offline" };
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return { status: "waking_up" };
    }
    return { status: "offline" };
  }
}


/**
 * Streams AI completion from the live Render backend or intelligent fallback
 */
export async function streamAIReply({
  prompt,
  history = [],
  onChunk,
  onStatusChange,
  signal,
}: StreamOptions): Promise<string> {
  const baseUrl = DEFAULT_BACKEND_URL.replace(/\/+$/, "");
  const endpoints = [
    `${baseUrl}/api/chat`,
    `${baseUrl}/api/agent/stream`,
    `${baseUrl}/chat`,
    `${baseUrl}/api/agent`,
  ];

  onStatusChange?.("connecting");

  let accumulated = "";

  // Attempt live Render backend connection if valid external URL is configured
  if (!baseUrl.includes("example.com") && !baseUrl.includes("localhost:0")) {
    for (const endpoint of endpoints) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream, application/json, text/plain, */*",
          },
          body: JSON.stringify({
            prompt,
            message: prompt,
            messages: [...history, { role: "user", content: prompt }],
            stream: true,
          }),
          signal,
        });

        if (!response.ok && response.status !== 404) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        if (response.status === 404) continue;

        onStatusChange?.("streaming");

        // Handle SSE / chunk stream
        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let doneReading = false;

          while (!doneReading) {
            const { value, done } = await reader.read();
            if (done) {
              doneReading = true;
              break;
            }

            const rawChunk = decoder.decode(value, { stream: true });
            const parsedText = parseStreamChunk(rawChunk);

            if (parsedText) {
              accumulated += parsedText;
              onChunk(parsedText, accumulated);
            }
          }

          if (accumulated.trim().length > 0) {
            onStatusChange?.("online");
            return accumulated;
          }
        }

        // Fallback JSON response
        const jsonData = await response.json().catch(() => null);
        if (jsonData) {
          const text =
            jsonData.response ||
            jsonData.reply ||
            jsonData.message ||
            jsonData.content ||
            JSON.stringify(jsonData);
          accumulated = text;
          onChunk(text, accumulated);
          onStatusChange?.("online");
          return accumulated;
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") throw err;
        // Continue trying fallback endpoints
      }
    }
  }

  // Local Grounded AI Knowledge Streamer
  onStatusChange?.("offline");
  return streamLocalFallback(prompt, onChunk, signal);
}

function parseStreamChunk(chunk: string): string {
  if (!chunk.includes("data:")) {
    return chunk;
  }

  const lines = chunk.split("\n");
  let result = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(":")) continue;

    if (trimmed.startsWith("data:")) {
      const dataStr = trimmed.replace(/^data:\s*/, "");
      if (dataStr === "[DONE]") continue;

      try {
        const parsed = JSON.parse(dataStr);
        if (parsed.choices?.[0]?.delta?.content) {
          result += parsed.choices[0].delta.content;
        } else if (parsed.text) {
          result += parsed.text;
        } else if (parsed.response) {
          result += parsed.response;
        } else if (parsed.content) {
          result += parsed.content;
        } else if (typeof parsed === "string") {
          result += parsed;
        }
      } catch {
        result += dataStr;
      }
    }
  }

  return result || chunk;
}

/**
 * Intelligent Semantic / Keyword Answer Generator for Local Knowledge Engine
 */
async function streamLocalFallback(
  prompt: string,
  onChunk: (chunk: string, full: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const p = prompt.toLowerCase();
  let response = "";

  if (
    p.includes("article") ||
    p.includes("wrote") ||
    p.includes("write") ||
    p.includes("writer") ||
    p.includes("geeks") ||
    p.includes("gfg") ||
    p.includes("publish") ||
    p.includes("publication") ||
    p.includes("dom") ||
    p.includes("chi-square") ||
    p.includes("graph theory")
  ) {
    response = `✍️ **GeeksforGeeks Technical Publications & Articles**\n\nMohd Kashif Ahrari has published multiple high-impact technical articles on GeeksforGeeks reaching **over 61,000+ readers**:\n\n1. **"JavaScript HTML DOM Manipulation & Architecture"** (61K+ Reads 🔥)\n   • Detailed guide covering Event Bubbling, Event Capturing, and optimal DOM Web API rendering patterns.\n   • Link: [Read on GeeksforGeeks](https://www.geeksforgeeks.org/javascript-html-dom/)\n\n2. **"Chi-Square (Χ²) Test in Statistics"**\n   • In-depth mathematical statistics guide on Goodness-of-Fit and hypothesis testing.\n\n3. **"Fundamentals of Graph Theory"**\n   • Comprehensive breakdown of graph traversal (BFS, DFS), Dijkstra's shortest path, Eulerian cycles, and tree structures.\n\n4. **"JavaScript Closures Deep Dive"** (12K+ Reads)\n   • Explaining execution contexts, lexical scoping, and memory management.\n\n5. **"React Flow: Custom Node Editor"** (8K+ Reads)\n   • Building interactive node editors with state persistence in @xyflow/react.\n\n👉 *View his complete author portfolio:* [geeksforgeeks.org/profile/mohd_kashif_ahrari](https://www.geeksforgeeks.org/profile/mohd_kashif_ahrari?tab=articles&page=1)`;
  } else if (
    p.includes("why hire") ||
    p.includes("hire") ||
    p.includes("recruit") ||
    p.includes("candidate") ||
    p.includes("strength") ||
    p.includes("exceptional")
  ) {
    response = `🌟 **Why Hire Mohd Kashif Ahrari?**\n\n${KASHIF_KNOWLEDGE.hire}`;
  } else if (
    p.includes("project") ||
    p.includes("cbse") ||
    p.includes("aakalan") ||
    p.includes("stay ease") ||
    p.includes("stayease") ||
    p.includes("vlog") ||
    p.includes("attendance") ||
    p.includes("build")
  ) {
    response = `🚀 **Featured Production Projects Engineered by Kashif:**\n\n${KASHIF_KNOWLEDGE.projects}\n\n*Tip: You can ask me for a deeper architectural breakdown of any project (e.g. CBSE Aakalan)!*`;
  } else if (
    p.includes("skill") ||
    p.includes("stack") ||
    p.includes("tech") ||
    p.includes("react") ||
    p.includes("typescript") ||
    p.includes("node") ||
    p.includes("dsa") ||
    p.includes("java")
  ) {
    response = `⚡ **Technical Stack & Core Competencies:**\n\n${KASHIF_KNOWLEDGE.skills}`;
  } else if (
    p.includes("experience") ||
    p.includes("role") ||
    p.includes("dhira") ||
    p.includes("work") ||
    p.includes("job") ||
    p.includes("company") ||
    p.includes("intern")
  ) {
    response = `💼 **Work Experience & Milestones:**\n\n${KASHIF_KNOWLEDGE.experience}`;
  } else if (
    p.includes("education") ||
    p.includes("college") ||
    p.includes("degree") ||
    p.includes("university") ||
    p.includes("cgpa") ||
    p.includes("cambridge") ||
    p.includes("b.e") ||
    p.includes("study")
  ) {
    response = `🎓 **Education & Academic Background:**\n\n${KASHIF_KNOWLEDGE.education}`;
  } else if (
    p.includes("cert") ||
    p.includes("certificate") ||
    p.includes("hackerrank") ||
    p.includes("ibm") ||
    p.includes("cisco") ||
    p.includes("nptel")
  ) {
    response = `🏆 **Certifications & Verified Credentials:**\n\n${KASHIF_KNOWLEDGE.certs}`;
  } else if (
    p.includes("contact") ||
    p.includes("email") ||
    p.includes("phone") ||
    p.includes("whatsapp") ||
    p.includes("linkedin") ||
    p.includes("github") ||
    p.includes("message") ||
    p.includes("reach")
  ) {
    response = `📬 **Get in Touch with Kashif:**\n\n${KASHIF_KNOWLEDGE.contact}`;
  } else if (
    p.includes("who are you") ||
    p.includes("who is") ||
    p.includes("about") ||
    p.includes("summary") ||
    p.includes("intro") ||
    p.includes("hello") ||
    p.includes("hi")
  ) {
    response = `👋 **Hello! I'm Kashif's Interactive Portfolio AI Assistant.**\n\n${KASHIF_KNOWLEDGE.about}\n\nAsk me anything about his projects, technical stack, GeeksforGeeks articles, or why you should hire him!`;
  } else {
    response = `🤖 **Mohd Kashif Ahrari — Software Engineer**\n\nRegarding: *"${prompt}"*\n\n• **Current Role:** Software Engineer at Dhira Software Labs (React 19, TypeScript, TanStack Query, Node.js)\n• **Author:** 61,000+ reads on GeeksforGeeks covering DOM architecture & JavaScript\n• **Key Projects:** CBSE Aakalan Assessment Platform, Stay Ease, Mega-Vlog\n\n💡 *Try asking:*\n• \`ai what articles has he written?\`\n• \`ai tell me about the CBSE Aakalan architecture\`\n• \`ai why hire Kashif?\`\n• \`ai what are his top technical skills?\``;
  }

  let accumulated = "";
  const tokens = response.split(/(\s+|\n)/);

  for (const token of tokens) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    accumulated += token;
    onChunk(token, accumulated);
    await new Promise((resolve) => setTimeout(resolve, 14));
  }

  return accumulated;
}
