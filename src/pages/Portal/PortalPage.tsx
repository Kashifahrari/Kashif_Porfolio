import { Link } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import "../../styles/portal.css";
import { INITIAL_ROADMAP_DATA, INITIAL_SCOREBOARD } from "../../data/roadmapData";
import { DayTaskCard } from "./DayTaskCard";
import { AuthLockScreen } from "./AuthLockScreen";

const STORAGE_KEY_ROADMAP = "kashif_24lpa_roadmap_v1";
const STORAGE_KEY_SCOREBOARD = "kashif_24lpa_scoreboard_v1";
const STORAGE_KEY_AUTH = "kashif_24lpa_auth_state";
const STORAGE_KEY_PIN = "kashif_24lpa_pin";
const STORAGE_KEY_MESSAGES = "contactMessages";
const DEFAULT_PASSWORD = "if allah wills";

interface Day {
  id: string;
  dayNumber: number | string;
  title: string;
  duration: string;
  objective: string;
  completed: boolean;
  learnItems?: string[];
  buildItems?: string[];
  dsaItems?: string[];
  extraItems?: string[];
  extraNotes?: string;
  completedAt?: string;
  notes?: string;
}

interface Week {
  weekNumber: number;
  title: string;
  focus: string;
  days: Day[];
}

interface Month {
  monthNumber: number;
  title: string;
  subtitle: string;
  objective: string;
  weekdayTime: string;
  weekendTime: string;
  isLighter?: boolean;
  weeks: Week[];
}

interface Scoreboard {
  typescript: number;
  backend: number;
  sql: number;
  systemDesign: number;
  cloud: number;
  devOps: number;
  aiEngineering: number;
  frontend: number;
  dsa: number;
  communication: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  dateFormatted: string;
  read: boolean;
}

const PortalPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem(STORAGE_KEY_AUTH) === "true"; }
    catch { return false; }
  });
  const [enteredPin, setEnteredPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState("");
  const [customPin] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_PASSWORD; }
    catch { return DEFAULT_PASSWORD; }
  });

  const [roadmap, setRoadmap] = useState<Month[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROADMAP);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ROADMAP_DATA;
  });

  const [scoreboard, setScoreboard] = useState<Scoreboard>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCOREBOARD);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SCOREBOARD;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [activeTab, setActiveTab] = useState("roadmap");
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 1: true });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true });
  const [searchQuery, setSearchQuery] = useState("");

  const [timerMode, setTimerMode] = useState("normal");
  const [timerSeconds, setTimerSeconds] = useState(20 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTimerStep, setActiveTimerStep] = useState("learn");

  useEffect(() => {
    const htmlEl = document.documentElement;
    const hasLight = htmlEl.classList.contains("light-theme");
    if (hasLight) {
      htmlEl.classList.remove("light-theme");
    }
    return () => {
      if (hasLight) {
        htmlEl.classList.add("light-theme");
      }
    };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_ROADMAP, JSON.stringify(roadmap)); } catch {}
  }, [roadmap]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_SCOREBOARD, JSON.stringify(scoreboard)); } catch {}
  }, [scoreboard]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    const syncMessages = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
        if (saved) setMessages(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener("storage", syncMessages);
    window.addEventListener("focus", syncMessages);
    return () => {
      window.removeEventListener("storage", syncMessages);
      window.removeEventListener("focus", syncMessages);
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert("?? Timer completed!");
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning, timerSeconds]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = (enteredPin || "").trim().toLowerCase();
    const cleanTarget = (customPin || "").trim().toLowerCase();
    if (cleanInput === cleanTarget || cleanInput === DEFAULT_PASSWORD || cleanInput === "if allah wills") {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, "true");
      setPinError("");
    } else {
      setPinError("Incorrect Password. Access restricted.");
      setEnteredPin("");
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const toggleDayTask = (monthNum: number, weekNum: number, dayId: string) => {
    setRoadmap((prev) =>
      prev.map((m) => {
        if (m.monthNumber !== monthNum) return m;
        return {
          ...m,
          weeks: m.weeks.map((w) => {
            if (w.weekNumber !== weekNum) return w;
            return {
              ...w,
              days: w.days.map((d) => {
                if (d.id !== dayId) return d;
                const nextState = !d.completed;
                return { ...d, completed: nextState, completedAt: nextState ? new Date().toISOString() : undefined };
              })
            };
          })
        };
      })
    );
  };

  const addDayExtraItem = (monthNum: number, weekNum: number, dayId: string, itemText: string) => {
    setRoadmap((prev) =>
      prev.map((m) => {
        if (m.monthNumber !== monthNum) return m;
        return {
          ...m,
          weeks: m.weeks.map((w) => {
            if (w.weekNumber !== weekNum) return w;
            return {
              ...w,
              days: w.days.map((d) => {
                if (d.id !== dayId) return d;
                const currentExtras = d.extraItems || [];
                return { ...d, extraItems: [...currentExtras, itemText] };
              })
            };
          })
        };
      })
    );
  };

  const removeDayExtraItem = (monthNum: number, weekNum: number, dayId: string, itemIdx: number) => {
    setRoadmap((prev) =>
      prev.map((m) => {
        if (m.monthNumber !== monthNum) return m;
        return {
          ...m,
          weeks: m.weeks.map((w) => {
            if (w.weekNumber !== weekNum) return w;
            return {
              ...w,
              days: w.days.map((d) => {
                if (d.id !== dayId) return d;
                const currentExtras = d.extraItems || [];
                return { ...d, extraItems: currentExtras.filter((_, idx) => idx !== itemIdx) };
              })
            };
          })
        };
      })
    );
  };

  const updateDayExtraNotes = (monthNum: number, weekNum: number, dayId: string, newNotes: string) => {
    setRoadmap((prev) =>
      prev.map((m) => {
        if (m.monthNumber !== monthNum) return m;
        return {
          ...m,
          weeks: m.weeks.map((w) => {
            if (w.weekNumber !== weekNum) return w;
            return {
              ...w,
              days: w.days.map((d) => {
                if (d.id !== dayId) return d;
                return { ...d, extraNotes: newNotes };
              })
            };
          })
        };
      })
    );
  };

  const updateDayNotes = (monthNum: number, weekNum: number, dayId: string, newNotes: string) => {
    setRoadmap((prev) =>
      prev.map((m) => {
        if (m.monthNumber !== monthNum) return m;
        return {
          ...m,
          weeks: m.weeks.map((w) => {
            if (w.weekNumber !== weekNum) return w;
            return {
              ...w,
              days: w.days.map((d) => {
                if (d.id !== dayId) return d;
                return { ...d, notes: newNotes };
              })
            };
          })
        };
      })
    );
  };

  const toggleMonth = (mNum: number) => {
    setExpandedMonths((prev) => ({ ...prev, [mNum]: !prev[mNum] }));
  };

  const toggleWeek = (wNum: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [wNum]: !prev[wNum] }));
  };

  const expandAll = () => {
    const allM: Record<number, boolean> = {};
    const allW: Record<number, boolean> = {};
    roadmap.forEach((m) => {
      allM[m.monthNumber] = true;
      m.weeks.forEach((w) => { allW[w.weekNumber] = true; });
    });
    setExpandedMonths(allM);
    setExpandedWeeks(allW);
  };

  const collapseAll = () => {
    setExpandedMonths({});
    setExpandedWeeks({});
  };

  const refreshMessages = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  };

  const deleteMessage = (msgId: string) => {
    if (window.confirm("Delete permanently?")) {
      const updated = messages.filter((m) => m.id !== msgId);
      setMessages(updated);
      try { localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated)); } catch {}
    }
  };

  const markAllMessagesRead = () => {
    const updated = messages.map((m) => ({ ...m, read: true }));
    setMessages(updated);
    try { localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated)); } catch {}
  };

  const clearAllMessages = () => {
    if (window.confirm("Clear all messages?")) {
      setMessages([]);
      try { localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify([])); } catch {}
    }
  };

  const toggleMessageRead = (msgId: string) => {
    const updated = messages.map((m) => (m.id === msgId ? { ...m, read: !m.read } : m));
    setMessages(updated);
    try { localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated)); } catch {}
  };

  const exportMessagesCSV = () => {
    if (messages.length === 0) return;
    const headers = ["ID", "Date", "Name", "Email", "Subject", "Message", "Status"];
    const rows = messages.map((m) => [
      '\"' + m.id + '\"',
      '\"' + (m.dateFormatted || m.timestamp) + '\"',
      '\"' + (m.name || "").replace(/"/g, '""') + '\"',
      '\"' + (m.email || "") + '\"',
      '\"' + (m.subject || "").replace(/"/g, '""') + '\"',
      '\"' + (m.message || "").replace(/"/g, '""') + '\"',
      '\"' + (m.read ? "Read" : "Unread") + '\"',
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inquiries_export.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return mins.toString().padStart(2, "0") + ":" + rem.toString().padStart(2, "0");
  };

  const setTimerPreset = (step: string, minutes: number) => {
    setActiveTimerStep(step);
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(false);
  };

  const progressStats = useMemo(() => {
    let totalDays = 0;
    let completedDays = 0;
    let extraCount = 0;
    roadmap.forEach((m) => {
      m.weeks.forEach((w) => {
        w.days.forEach((d) => {
          totalDays++;
          if (d.completed) completedDays++;
          if (d.extraItems && d.extraItems.length > 0) extraCount += d.extraItems.length;
        });
      });
    });
    const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    return { totalDays, completedDays, extraCount, percentage };
  }, [roadmap]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleExportBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      user: "Mohd Kashif",
      roadmap,
      scoreboard,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "road_to_24lpa_backup_" + new Date().toISOString().split("T")[0] + ".json");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (!isAuthenticated) {
    return (
      <AuthLockScreen
        handleUnlock={handleUnlock}
        enteredPin={enteredPin}
        setEnteredPin={setEnteredPin}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        pinError={pinError}
      />
    );
  }

  return (
    <div className="os-portal-container">
      <header className="os-topbar">
        <div className="os-logo-group">
          <span className="os-badge-pulse">STEALTH</span>
          <h1 className="os-main-title">PROJECT TITAN // STEALTH OS ??</h1>
          <span className="os-user-tag">Mohd Kashif's Autonomous Engine</span>
        </div>
        <div className="os-top-actions">
          <button className="btn btn-glass btn-sm" onClick={handleExportBackup} title="Backup JSON">
            <i className="bx bx-download"></i> Backup JSON
          </button>
          <button className="btn btn-glass btn-sm" onClick={handleLock} title="Lock Portal">
            <i className="bx bx-lock"></i> Lock
          </button>
          <Link to="/" className="btn btn-primary btn-sm" title="Return to Portfolio">
            <i className="bx bx-arrow-back"></i> Return to Portfolio
          </Link>
        </div>
      </header>

      <section className="os-stats-bento">
        <div className="glass-card os-stat-card">
          <div className="stat-num-row">
            <h3>{progressStats.percentage}%</h3>
            <span className="badge">Overall</span>
          </div>
          <div className="os-progress-bar-wrap">
            <div className="os-progress-fill" style={{ width: progressStats.percentage + "%" }}></div>
          </div>
          <p className="stat-desc">
            {progressStats.completedDays} / {progressStats.totalDays} Days Shipped
            {progressStats.extraCount > 0 && " + ?? " + progressStats.extraCount + " Extra Bonus"}
          </p>
        </div>
        <div className="glass-card os-stat-card">
          <div className="stat-num-row">
            <h3>12 Months</h3>
            <span className="badge active">Structured</span>
          </div>
          <p className="stat-desc">TypeScript � Backend � DB � Docker � AWS � System Design � AI</p>
        </div>
        <div className="glass-card os-stat-card">
          <div className="stat-num-row">
            <h3>90 Min/Day</h3>
            <span className="badge">Formula</span>
          </div>
          <p className="stat-desc">20m Learn � 50m Build � 20m Recall</p>
        </div>
        <div className="glass-card os-stat-card">
          <div className="stat-num-row">
            <h3>?24 LPA+</h3>
            <span className="badge gold">Target</span>
          </div>
          <p className="stat-desc">Senior Full-Stack & Production AI Offer</p>
        </div>
      </section>

      <div className="os-tabs-strip">
        <button className={"os-tab-btn " + (activeTab === "roadmap" ? "active" : "")} onClick={() => setActiveTab("roadmap")}>
          <i className="bx bx-list-check"></i> 12-Month Curriculum & Checklists
        </button>
        <button className={"os-tab-btn " + (activeTab === "timer" ? "active" : "")} onClick={() => setActiveTab("timer")}>
          <i className="bx bx-timer"></i> Daily 90-Min Formula Timer
        </button>
        <button className={"os-tab-btn " + (activeTab === "scoreboard" ? "active" : "")} onClick={() => setActiveTab("scoreboard")}>
          <i className="bx bx-bar-chart-alt-2"></i> Sunday Scoreboard (Out of 10)
        </button>
        <button className={"os-tab-btn " + (activeTab === "project" ? "active" : "")} onClick={() => setActiveTab("project")}>
          <i className="bx bx-cube"></i> One Serious Flagship Project Rule
        </button>
        <button className={"os-tab-btn " + (activeTab === "inbox" ? "active" : "")} onClick={() => setActiveTab("inbox")}>
          <i className="bx bx-envelope"></i> Client Inquiries & Messages
          {unreadCount > 0 && <span className="tab-badge-count">{unreadCount}</span>}
        </button>
      </div>

      {activeTab === "roadmap" && (
        <div className="os-roadmap-tab-content">
          <div className="roadmap-controls-bar">
            <input
              type="text"
              placeholder="Search topics, DSA, PostgreSQL, Docker, Redis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="os-search-input"
            />
            <div className="btn-group">
              <button className="btn btn-glass btn-sm" onClick={expandAll}>Expand All</button>
              <button className="btn btn-glass btn-sm" onClick={collapseAll}>Collapse All</button>
            </div>
          </div>

          <div className="months-accordion-container">
            {roadmap.map((month) => {
              const isExpanded = !!expandedMonths[month.monthNumber];
              const monthCompleted = month.weeks.reduce((acc, w) => acc + w.days.filter((d) => d.completed).length, 0);
              const monthTotal = month.weeks.reduce((acc, w) => acc + w.days.length, 0);
              const mPct = monthTotal > 0 ? Math.round((monthCompleted / monthTotal) * 100) : 0;

              return (
                <div key={month.monthNumber} className={"month-accordion-card " + (isExpanded ? "open" : "")}>
                  <div className="month-accordion-header" onClick={() => toggleMonth(month.monthNumber)}>
                    <div className="month-title-wrap">
                      <i className={"bx " + (isExpanded ? "bx-chevron-down" : "bx-chevron-right") + " toggle-caret"}></i>
                      <div>
                        <div className="month-headline">
                          <h2>{month.title}</h2>
                          {month.isLighter && <span className="badge-lighter">Lighter / Habit Month</span>}
                        </div>
                        <p className="month-sub">{month.subtitle}</p>
                      </div>
                    </div>
                    <div className="month-header-meta">
                      <span className="month-time-badge">Weekdays: {month.weekdayTime} � Weekend: {month.weekendTime}</span>
                      <span className="month-pct-badge">{mPct}%</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="month-accordion-body">
                      <div className="month-objective-callout">
                        <strong>?? Monthly Objective: </strong>
                        {month.objective}
                      </div>

                      {month.weeks.map((week) => {
                        const isWeekOpen = !!expandedWeeks[week.weekNumber];
                        const wTotal = week.days.length;
                        const wDone = week.days.filter((d) => d.completed).length;

                        return (
                          <div key={week.weekNumber} className={"week-accordion-wrapper " + (isWeekOpen ? "open" : "")}>
                            <div className="week-accordion-header" onClick={() => toggleWeek(week.weekNumber)}>
                              <div className="week-title-wrap">
                                <i className={"bx " + (isWeekOpen ? "bx-folder-open" : "bx-folder") + " week-icon"}></i>
                                <h3>{week.title}</h3>
                                <span className="week-focus-text">({week.focus})</span>
                              </div>
                              <span className="week-count-badge">{wDone}/{wTotal} Done</span>
                            </div>

                            {isWeekOpen && (
                              <div className="week-days-list">
                                {week.days
                                  .filter((d) => {
                                    if (!searchQuery) return true;
                                    const query = searchQuery.toLowerCase();
                                    return (
                                      d.title.toLowerCase().includes(query) ||
                                      (d.learnItems && d.learnItems.some((l) => l.toLowerCase().includes(query))) ||
                                      (d.buildItems && d.buildItems.some((b) => b.toLowerCase().includes(query))) ||
                                      (d.dsaItems && d.dsaItems.some((ds) => ds.toLowerCase().includes(query)))
                                    );
                                  })
                                  .map((day) => (
                                    <DayTaskCard
                                      key={day.id}
                                      day={day}
                                      monthNumber={month.monthNumber}
                                      weekNumber={week.weekNumber}
                                      toggleDayTask={toggleDayTask}
                                      addDayExtraItem={addDayExtraItem}
                                      removeDayExtraItem={removeDayExtraItem}
                                      updateDayExtraNotes={updateDayExtraNotes}
                                    />
                                  ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "timer" && (
        <div className="os-timer-view">
          <div className="glass-card timer-main-card">
            <h2 className="timer-heading">Daily 90-Minute Engineering Formula</h2>
            <p className="timer-sub">Don't watch 90-minute tutorials. Execute deliberate engineering practice.</p>

            <div className="timer-mode-selector">
              <button
                className={"mode-btn " + (timerMode === "normal" ? "active" : "")}
                onClick={() => {
                  setTimerMode("normal");
                  setTimerPreset("learn", 20);
                }}
              >
                Normal Weekday (90m)
              </button>
              <button
                className={"mode-btn " + (timerMode === "minimum" ? "active" : "")}
                onClick={() => {
                  setTimerMode("minimum");
                  setTimerPreset("minimum", 20);
                }}
              >
                Exhausted Minimum Mode (20m)
              </button>
              <button
                className={"mode-btn " + (timerMode === "weekend" ? "active" : "")}
                onClick={() => {
                  setTimerMode("weekend");
                  setTimerPreset("project", 90);
                }}
              >
                Weekend Deep Work (2.5h)
              </button>
            </div>

            {timerMode === "normal" && (
              <div className="timer-steps-row">
                <button className={"step-pill " + (activeTimerStep === "learn" ? "active" : "")} onClick={() => setTimerPreset("learn", 20)}>
                  1. Learn (20m)
                </button>
                <button className={"step-pill " + (activeTimerStep === "build" ? "active" : "")} onClick={() => setTimerPreset("build", 50)}>
                  2. Build Code (50m)
                </button>
                <button className={"step-pill " + (activeTimerStep === "recall" ? "active" : "")} onClick={() => setTimerPreset("recall", 20)}>
                  3. Recall / Explain (20m)
                </button>
              </div>
            )}

            <div className="timer-clock-display">{formatTime(timerSeconds)}</div>

            <div className="timer-controls-row">
              <button
                className={"btn " + (isTimerRunning ? "btn-secondary" : "btn-primary") + " btn-lg"}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? "?? Pause Session" : "?? Start Timer"}
              </button>
              <button
                className="btn btn-glass btn-lg"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(20 * 60);
                }}
              >
                ?? Reset
              </button>
            </div>

            <div className="timer-rule-callout">
              <h4>?? The Golden Rule for Exhausted Days:</h4>
              <p>"Never let one bad day become a bad week. Do 20 minutes minimum (read yesterday's notes, solve 1 easy problem, or fix 1 bug) and keep your streak alive."</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "scoreboard" && (
        <div className="os-scoreboard-view">
          <div className="glass-card scoreboard-card">
            <h2>Sunday Engineering Scoreboard</h2>
            <p className="scoreboard-sub">Every Sunday, give yourself an honest score out of 10. Don't chase 10/10 everywhere � target strong employability.</p>

            <div className="scoreboard-grid">
              {Object.keys(scoreboard).map((key) => {
                const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
                const val = scoreboard[key as keyof Scoreboard];
                return (
                  <div key={key} className="score-slider-item">
                    <div className="score-label-row">
                      <span className="score-name">{label}</span>
                      <span className="score-val-badge">{val} / 10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={val}
                      onChange={(e) => setScoreboard({ ...scoreboard, [key]: Number(e.target.value) })}
                      className="score-slider"
                    />
                  </div>
                );
              })}
            </div>

            <div className="benchmark-target-box">
              <h4>?? Target Employability Benchmark for ?24 LPA:</h4>
              <p>Backend: 9/10 � TypeScript: 9/10 � SQL: 8/10 � Architecture: 8/10 � Cloud: 7/10 � DevOps: 7/10 � AI Engineering: 8/10 � Frontend: 8/10 � DSA: 6/10</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "project" && (
        <div className="os-project-view">
          <div className="glass-card project-evolution-card">
            <h2>The "One Serious Project" Rule</h2>
            <p className="sub">Do not build 15 shallow tutorial clones. Build 1 serious production-grade platform and continuously upgrade its architecture.</p>

            <div className="evolution-timeline">
              {[
                { v: "V1", title: "Core Full-Stack System", tech: "React 19 + Node.js + PostgreSQL Relational Schema" },
                { v: "V2", title: "Security & Caching", tech: "TypeScript + Redis Cache-Aside + Silent JWT Refresh" },
                { v: "V3", title: "Async Queues & Testing", tech: "BullMQ Workers + Retries + Vitest Integration Tests" },
                { v: "V4", title: "Containerization & Cloud", tech: "Multi-stage Dockerfiles + AWS (EC2/RDS/S3) + GitHub Actions" },
                { v: "V5", title: "Observability & Scale", tech: "Prometheus metrics + Structured Winston logs + 1M rows tuning" },
                { v: "V6", title: "Autonomous AI Layer", tech: "pgvector RAG + Autonomous Tool Calling Database Agent" },
                { v: "V7", title: "Distributed Systems", tech: "Idempotent Webhooks + Redlock Distributed Locking" },
              ].map((item, idx) => (
                <div key={idx} className="evolution-item">
                  <span className="v-tag">{item.v}</span>
                  <div className="evolution-content">
                    <h4>{item.title}</h4>
                    <p>{item.tech}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "inbox" && (
        <div className="os-inbox-view">
          <div className="glass-card inbox-card">
            <div className="inbox-header-row">
              <div>
                <h2 className="inbox-title">Client Inquiries & Message Logger ??</h2>
                <p className="inbox-subtitle">Confidential inbox. Every submission from your Contact Us page is securely logged here.</p>
              </div>
              <div className="inbox-actions-group">
                <button className="btn btn-glass btn-sm" onClick={refreshMessages} title="Refresh Inbox">
                  <i className="bx bx-refresh"></i> Refresh Inbox
                </button>
                <button className="btn btn-glass btn-sm" onClick={exportMessagesCSV} title="Export leads to CSV">
                  <i className="bx bx-export"></i> Export CSV
                </button>
                <button className="btn btn-glass btn-sm" onClick={markAllMessagesRead}>
                  <i className="bx bx-check-double"></i> Mark All Read
                </button>
                {messages.length > 0 && (
                  <button className="btn btn-secondary btn-sm" onClick={clearAllMessages} title="Clear Inbox">
                    <i className="bx bx-trash"></i> Delete All Junk
                  </button>
                )}
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="inbox-empty-state">
                <i className="bx bx-envelope-open empty-icon"></i>
                <h3>No Inquiries Logged Yet</h3>
                <p>When visitors send messages through your Contact Us form, they will appear here in real-time.</p>
              </div>
            ) : (
              <div className="inbox-messages-list">
                {messages.map((msg) => (
                  <div key={msg.id} className={"inbox-message-item " + (msg.read ? "read" : "unread")}>
                    <div className="msg-top-row">
                      <div className="msg-sender-group">
                        <div className="msg-avatar">{(msg.name || "U").charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="msg-name-row">
                            <h4 className="msg-sender-name">{msg.name || "Anonymous Visitor"}</h4>
                            {!msg.read && <span className="msg-new-badge">NEW ?</span>}
                            {msg.read && <span className="msg-read-badge">READ ?</span>}
                          </div>
                          <span className="msg-email-text">{msg.email}</span>
                        </div>
                      </div>
                      <div className="msg-date-col">
                        <span className="msg-time-stamp">{msg.dateFormatted || msg.timestamp}</span>
                      </div>
                    </div>

                    <div className="msg-subject-row">
                      <span className="msg-subject-tag">Topic: {msg.subject || "General Inquiry"}</span>
                    </div>
                    <div className="msg-body-text">{msg.message}</div>

                    <div className="msg-actions-bar">
                      <div className="msg-reply-links">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Inquiry")}`}
                          className="btn btn-primary btn-sm"
                        >
                          <i className="bx bx-reply"></i> Reply via Email
                        </a>
                        <button
                          type="button"
                          className="btn btn-glass btn-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(msg.email);
                            alert(`Copied ${msg.email} to clipboard!`);
                          }}
                        >
                          <i className="bx bx-copy"></i> Copy Email
                        </button>
                      </div>
                      <div className="msg-admin-tools">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm btn-delete-junk"
                          style={{ background: "rgba(255, 107, 107, 0.15)", borderColor: "rgba(255, 107, 107, 0.35)", color: "var(--accent-coral)" }}
                          onClick={() => deleteMessage(msg.id)}
                        >
                          <i className="bx bx-trash"></i> Delete Junk
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action"
                          onClick={() => toggleMessageRead(msg.id)}
                          title={msg.read ? "Mark as Unread" : "Mark as Read"}
                        >
                          <i className={"bx " + (msg.read ? "bx-envelope" : "bx-envelope-open")}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalPage;


