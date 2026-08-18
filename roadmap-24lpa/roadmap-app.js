import React, { useState, useEffect, useMemo } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { INITIAL_ROADMAP_DATA, INITIAL_SCOREBOARD } from './roadmap-data.js';

// Storage keys
const STORAGE_KEY_ROADMAP = 'kashif_24lpa_roadmap_v1';
const STORAGE_KEY_SCOREBOARD = 'kashif_24lpa_scoreboard_v1';
const STORAGE_KEY_AUTH = 'kashif_24lpa_auth_state';
const STORAGE_KEY_PIN = 'kashif_24lpa_pin';
const DEFAULT_PASSWORD = 'if allah wills';

/**
 * Individual Day Task Card with Planned items + Extra Work & Over-Delivery Section
 */
const DayTaskCard = ({
  day,
  monthNumber,
  weekNumber,
  toggleDayTask,
  updateDayNotes,
  addDayExtraItem,
  removeDayExtraItem,
  updateDayExtraNotes,
}) => {
  const [extraInput, setExtraInput] = useState('');
  const [showExtraForm, setShowExtraForm] = useState(false);

  const handleAddExtra = (e) => {
    if (e) e.preventDefault();
    if (!extraInput.trim()) return;
    addDayExtraItem(monthNumber, weekNumber, day.id, extraInput);
    setExtraInput('');
  };

  const handleQuickTag = (tagText) => {
    addDayExtraItem(monthNumber, weekNumber, day.id, tagText);
  };

  const extraCount = (day.extraItems || []).length + (day.extraNotes && day.extraNotes.trim() ? 1 : 0);

  return React.createElement(
    'div',
    { className: `day-task-card ${day.completed ? 'completed' : ''}` },
    // Day Checkbox & Title
    React.createElement(
      'div',
      { className: 'day-task-top' },
      React.createElement(
        'label',
        { className: 'checkbox-container' },
        React.createElement('input', {
          type: 'checkbox',
          checked: day.completed,
          onChange: () => toggleDayTask(monthNumber, weekNumber, day.id),
        }),
        React.createElement('span', { className: 'checkmark' })
      ),
      React.createElement(
        'div',
        { className: 'day-main-info' },
        React.createElement(
          'div',
          { className: 'day-badge-row' },
          React.createElement('span', { className: 'day-number-tag' }, typeof day.dayNumber === 'number' ? `Day ${day.dayNumber}` : day.dayNumber),
          React.createElement('span', { className: 'day-time-tag' }, `⏱️ ${day.duration}`),
          day.completed && React.createElement('span', { className: 'day-shipped-tag' }, 'SHIPPED ✅'),
          extraCount > 0 && React.createElement('span', { className: 'day-extra-badge' }, `🔥 ${extraCount} Extra Shipped`)
        ),
        React.createElement('h4', { className: 'day-task-title' }, day.title),
        React.createElement('p', { className: 'day-task-obj' }, day.objective)
      )
    ),

    // Planned Breakdown: Learn, Build, DSA
    React.createElement(
      'div',
      { className: 'day-breakdown-grid' },
      day.learnItems &&
        day.learnItems.length > 0 &&
        React.createElement(
          'div',
          { className: 'breakdown-block learn' },
          React.createElement('h5', null, '📖 20 Min — Learn & Understand'),
          React.createElement(
            'ul',
            null,
            day.learnItems.map((li, idx) => React.createElement('li', { key: idx }, li))
          )
        ),
      day.buildItems &&
        day.buildItems.length > 0 &&
        React.createElement(
          'div',
          { className: 'breakdown-block build' },
          React.createElement('h5', null, '💻 50 Min — Build & Produce Code'),
          React.createElement(
            'ul',
            null,
            day.buildItems.map((bi, idx) => React.createElement('li', { key: idx }, bi))
          )
        ),
      day.dsaItems &&
        day.dsaItems.length > 0 &&
        React.createElement(
          'div',
          { className: 'breakdown-block dsa' },
          React.createElement('h5', null, '🧠 Weekend DSA Dose'),
          React.createElement(
            'ul',
            null,
            day.dsaItems.map((di, idx) => React.createElement('li', { key: idx }, `Solve: ${di}`))
          )
        )
    ),

    // EXTRA MILEAGE / OVER-DELIVERY SECTION
    React.createElement(
      'div',
      { className: 'day-extra-section' },
      React.createElement(
        'div',
        { className: 'extra-section-header', onClick: () => setShowExtraForm(!showExtraForm) },
        React.createElement(
          'div',
          { className: 'extra-header-left' },
          React.createElement('i', { className: 'bx bxs-zap extra-zap-icon' }),
          React.createElement('span', { className: 'extra-heading' }, 'Extra Mileage & Over-Delivery (Did Something Extra Today?)'),
          extraCount > 0 && React.createElement('span', { className: 'extra-count-pill' }, `+${extraCount} Bonus`)
        ),
        React.createElement(
          'button',
          { type: 'button', className: 'btn-toggle-extra' },
          React.createElement('i', { className: `bx ${showExtraForm ? 'bx-chevron-up' : 'bx-plus'}` }),
          showExtraForm ? ' Close' : ' Log Extra Done'
        )
      ),

      // List of logged Extra items
      (day.extraItems || []).length > 0 &&
        React.createElement(
          'div',
          { className: 'extra-items-list' },
          day.extraItems.map((item, idx) =>
            React.createElement(
              'div',
              { key: idx, className: 'extra-item-row' },
              React.createElement('span', { className: 'extra-bullet' }, '⚡'),
              React.createElement('span', { className: 'extra-text' }, item),
              React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'extra-del-btn',
                  title: 'Remove this extra item',
                  onClick: () => removeDayExtraItem(monthNumber, weekNumber, day.id, idx),
                },
                React.createElement('i', { className: 'bx bx-trash' })
              )
            )
          )
        ),

      // Extra Input Form & Quick Chips
      (showExtraForm || (day.extraItems && day.extraItems.length > 0)) &&
        React.createElement(
          'div',
          { className: 'extra-input-box' },
          React.createElement(
            'form',
            { onSubmit: handleAddExtra, className: 'extra-form-row' },
            React.createElement('input', {
              type: 'text',
              placeholder: 'Add extra work done (e.g. "Solved 1 extra LeetCode DP", "Refactored Redis caching", "Read AWS docs")...',
              value: extraInput,
              onChange: (e) => setExtraInput(e.target.value),
              className: 'extra-input-field',
            }),
            React.createElement('button', { type: 'submit', className: 'btn btn-primary btn-sm' }, '+ Log Extra')
          ),
          // Quick Suggested Tag Chips
          React.createElement(
            'div',
            { className: 'extra-quick-tags' },
            React.createElement('span', { className: 'quick-tag-label' }, 'Quick Add: '),
            React.createElement('button', { type: 'button', className: 'quick-chip', onClick: () => handleQuickTag('⚡ Solved +1 Extra LeetCode Problem') }, '+1 Extra DSA'),
            React.createElement('button', { type: 'button', className: 'quick-chip', onClick: () => handleQuickTag('⚡ Built +1 Extra API Endpoint & Unit Test') }, '+1 API Test'),
            React.createElement('button', { type: 'button', className: 'quick-chip', onClick: () => handleQuickTag('⚡ Read 20m Deep Architecture Documentation') }, '+20m Deep Docs'),
            React.createElement('button', { type: 'button', className: 'quick-chip', onClick: () => handleQuickTag('⚡ Refactored Clean Code & Reduced Tech Debt') }, '+Clean Refactor')
          ),
          // Extra Notes Textarea
          React.createElement('textarea', {
            placeholder: 'Extra notes / bonus insights / breakthroughs achieved beyond daily plan...',
            value: day.extraNotes || '',
            onChange: (e) => updateDayExtraNotes(monthNumber, weekNumber, day.id, e.target.value),
            className: 'extra-notes-textarea',
            rows: 2,
          })
        )
    ),

    // Standard Day Notes Input
    React.createElement(
      'div',
      { className: 'day-notes-wrapper' },
      React.createElement('textarea', {
        placeholder: 'Write standard daily execution notes, solved bugs, interview takeaways...',
        value: day.notes || '',
        onChange: (e) => updateDayNotes(monthNumber, weekNumber, day.id, e.target.value),
        className: 'day-notes-textarea',
        rows: 2,
      })
    )
  );
};

const RoadTo24LPAApp = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState('');
  const [customPin, setCustomPin] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_PASSWORD;
  });

  // Roadmap & Scoreboard State
  const [roadmap, setRoadmap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROADMAP);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ROADMAP_DATA;
  });

  const [scoreboard, setScoreboard] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCOREBOARD);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SCOREBOARD;
  });

  // Client Messages Inbox State
  const STORAGE_KEY_MESSAGES = 'kashif_contact_messages';
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Accordion Expand / Collapse States
  const [expandedMonths, setExpandedMonths] = useState({ 1: true });
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true });
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['roadmap', 'inbox', 'timer', 'scoreboard', 'project'].includes(tabParam)) {
        return tabParam;
      }
    } catch (e) {}
    return 'roadmap';
  }); // 'roadmap' | 'inbox' | 'timer' | 'scoreboard' | 'project'
  const [searchQuery, setSearchQuery] = useState('');

  // Daily Timer State
  const [timerMode, setTimerMode] = useState('normal'); // 'normal' | 'minimum' | 'weekend'
  const [timerSeconds, setTimerSeconds] = useState(20 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTimerStep, setActiveTimerStep] = useState('learn'); // 'learn' | 'build' | 'recall'

  // Persist Roadmap
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROADMAP, JSON.stringify(roadmap));
    } catch (e) {}
  }, [roadmap]);

  // Persist Scoreboard
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCOREBOARD, JSON.stringify(scoreboard));
    } catch (e) {}
  }, [scoreboard]);

  // Persist Messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Live storage event listener to auto-sync messages across open tabs & focus
  useEffect(() => {
    const syncMessages = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          setMessages([]);
        }
      } catch (e) {}
    };

    window.addEventListener('storage', syncMessages);
    window.addEventListener('focus', syncMessages);
    return () => {
      window.removeEventListener('storage', syncMessages);
      window.removeEventListener('focus', syncMessages);
    };
  }, []);

  // Sync latest messages whenever user switches to inbox tab
  useEffect(() => {
    if (activeTab === 'inbox') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
        if (saved) setMessages(JSON.parse(saved));
      } catch (e) {}
    }
  }, [activeTab]);

  // Count Unread Messages
  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.read).length;
  }, [messages]);

  // Message Actions Handlers
  const toggleMessageRead = (msgId) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, read: !m.read } : m))
    );
  };

  const deleteMessage = (msgId) => {
    if (confirm('Delete this message permanently?')) {
      const updated = messages.filter((m) => m.id !== msgId);
      setMessages(updated);
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const markAllMessagesRead = () => {
    const updated = messages.map((m) => ({ ...m, read: true }));
    setMessages(updated);
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
    } catch (e) {}
  };

  const clearAllMessages = () => {
    if (confirm('Delete all messages and junk inquiries? This cannot be undone.')) {
      setMessages([]);
      try {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify([]));
      } catch (e) {}
    }
  };

  const refreshMessages = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        setMessages(JSON.parse(saved));
        alert('📬 Inbox refreshed! Latest messages loaded.');
      } else {
        setMessages([]);
        alert('📬 No messages found in local storage.');
      }
    } catch (e) {}
  };

  const exportMessagesCSV = () => {
    if (messages.length === 0) {
      alert('No messages to export.');
      return;
    }
    const headers = ['ID', 'Date', 'Name', 'Email', 'Subject', 'Message', 'Status'];
    const rows = messages.map((m) => [
      `"${m.id}"`,
      `"${m.dateFormatted || m.timestamp}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${m.email || ''}"`,
      `"${(m.subject || '').replace(/"/g, '""')}"`,
      `"${(m.message || '').replace(/"/g, '""')}"`,
      `"${m.read ? 'Read' : 'Unread'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contact_inquiries_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert(`⏱️ Timer completed for: ${activeTimerStep.toUpperCase()} phase!`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activeTimerStep]);

  // Overall Progress Calculation
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

  // Handle Password Login
  const handlePinSubmit = (e) => {
    e.preventDefault();
    const cleanInput = (enteredPin || '').trim().toLowerCase();
    const cleanTarget = (customPin || '').trim().toLowerCase();
    const defaultClean = DEFAULT_PASSWORD.trim().toLowerCase();

    if (cleanInput === cleanTarget || cleanInput === defaultClean || cleanInput === 'if allah wills') {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      setPinError('');
    } else {
      setPinError('Incorrect Password. Access restricted to Mohd Kashif.');
      setEnteredPin('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  };

  // Toggle Day Completion
  const toggleDayTask = (monthNum, weekNum, dayId) => {
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
                return {
                  ...d,
                  completed: nextState,
                  completedAt: nextState ? new Date().toISOString() : undefined,
                };
              }),
            };
          }),
        };
      })
    );
  };

  // Update Day Notes
  const updateDayNotes = (monthNum, weekNum, dayId, newNotes) => {
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
              }),
            };
          }),
        };
      })
    );
  };

  // Add Extra Item to Day
  const addDayExtraItem = (monthNum, weekNum, dayId, extraText) => {
    if (!extraText || !extraText.trim()) return;
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
                return {
                  ...d,
                  extraItems: [...currentExtras, extraText.trim()],
                };
              }),
            };
          }),
        };
      })
    );
  };

  // Remove Extra Item
  const removeDayExtraItem = (monthNum, weekNum, dayId, itemIdx) => {
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
                return {
                  ...d,
                  extraItems: currentExtras.filter((_, idx) => idx !== itemIdx),
                };
              }),
            };
          }),
        };
      })
    );
  };

  // Update Day Extra Notes
  const updateDayExtraNotes = (monthNum, weekNum, dayId, newExtraNotes) => {
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
                return { ...d, extraNotes: newExtraNotes };
              }),
            };
          }),
        };
      })
    );
  };

  // Expand / Collapse Helpers
  const toggleMonth = (mNum) => {
    setExpandedMonths((prev) => ({ ...prev, [mNum]: !prev[mNum] }));
  };

  const toggleWeek = (wNum) => {
    setExpandedWeeks((prev) => ({ ...prev, [wNum]: !prev[wNum] }));
  };

  const expandAll = () => {
    const allM = {};
    const allW = {};
    roadmap.forEach((m) => {
      allM[m.monthNumber] = true;
      m.weeks.forEach((w) => (allW[w.weekNumber] = true));
    });
    setExpandedMonths(allM);
    setExpandedWeeks(allW);
  };

  const collapseAll = () => {
    setExpandedMonths({});
    setExpandedWeeks({});
  };

  // Export / Backup JSON
  const handleExportBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      user: 'Mohd Kashif',
      roadmap,
      scoreboard,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `road_to_24lpa_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Format Timer
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const setTimerPreset = (step, minutes) => {
    setActiveTimerStep(step);
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(false);
  };

  // Render Passcode Lock Screen if not authenticated
  if (!isAuthenticated) {
    return React.createElement(
      'div',
      { className: 'auth-lock-screen' },
      React.createElement(
        'div',
        { className: 'glass-card auth-card' },
        React.createElement('div', { className: 'auth-icon-wrap' }, React.createElement('i', { className: 'bx bxs-lock-alt' })),
        React.createElement('h2', { className: 'auth-title' }, 'Road to 24 LPA 🎯'),
        React.createElement('p', { className: 'auth-subtitle' }, 'Confidential 12-Month Operating System & Execution Tracker. Access restricted to Mohd Kashif.'),
        React.createElement(
          'form',
          { onSubmit: handlePinSubmit, className: 'auth-form' },
          React.createElement(
            'div',
            { className: 'password-input-group' },
            React.createElement('input', {
              type: showPassword ? 'text' : 'password',
              placeholder: 'Enter Secret Password...',
              value: enteredPin,
              onChange: (e) => setEnteredPin(e.target.value),
              className: 'auth-input',
              autoFocus: true,
            }),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'password-toggle-btn',
                onClick: () => setShowPassword(!showPassword),
                title: showPassword ? 'Hide password' : 'Show password',
              },
              React.createElement('i', { className: `bx ${showPassword ? 'bx-hide' : 'bx-show'}` })
            )
          ),
          pinError && React.createElement('p', { className: 'auth-error' }, pinError),
          React.createElement('button', { type: 'submit', className: 'btn btn-primary auth-submit-btn' }, 'Unlock Operating System 🚀')
        ),
        React.createElement(
          'div',
          { className: 'auth-hint' },
          React.createElement('span', null, '🔒 Private engineering portal • Password Protected')
        )
      )
    );
  }

  // Render Full Operating System Portal
  return React.createElement(
    'div',
    { className: 'os-portal-container' },
    // Top Bar
    React.createElement(
      'header',
      { className: 'os-topbar' },
      React.createElement(
        'div',
        { className: 'os-logo-group' },
        React.createElement('span', { className: 'os-badge-pulse' }, 'PRIVATE'),
        React.createElement('h1', { className: 'os-main-title' }, 'Road to ₹24 LPA 🎯'),
        React.createElement('span', { className: 'os-user-tag' }, 'Mohd Kashif\'s 12-Month OS')
      ),
      React.createElement(
        'div',
        { className: 'os-top-actions' },
        React.createElement(
          'button',
          { className: 'btn btn-glass btn-sm', onClick: handleExportBackup, title: 'Backup Progress' },
          React.createElement('i', { className: 'bx bx-download' }),
          ' Backup JSON'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-glass btn-sm', onClick: handleLogout, title: 'Lock Portal' },
          React.createElement('i', { className: 'bx bx-lock' }),
          ' Lock'
        ),
        React.createElement(
          'a',
          { href: '../index.html', className: 'btn btn-primary btn-sm' },
          React.createElement('i', { className: 'bx bx-arrow-back' }),
          ' Portfolio'
        )
      )
    ),

    // Master Stats Bento Bar
    React.createElement(
      'section',
      { className: 'os-stats-bento' },
      React.createElement(
        'div',
        { className: 'glass-card os-stat-card' },
        React.createElement('div', { className: 'stat-num-row' }, React.createElement('h3', null, `${progressStats.percentage}%`), React.createElement('span', { className: 'badge' }, 'Overall')),
        React.createElement('div', { className: 'os-progress-bar-wrap' }, React.createElement('div', { className: 'os-progress-fill', style: { width: `${progressStats.percentage}%` } })),
        React.createElement('p', { className: 'stat-desc' }, `${progressStats.completedDays} / ${progressStats.totalDays} Days Shipped${progressStats.extraCount > 0 ? ` • 🔥 ${progressStats.extraCount} Extra Bonus Shipped` : ''}`)
      ),
      React.createElement(
        'div',
        { className: 'glass-card os-stat-card' },
        React.createElement('div', { className: 'stat-num-row' }, React.createElement('h3', null, '12 Months'), React.createElement('span', { className: 'badge active' }, 'Structured')),
        React.createElement('p', { className: 'stat-desc' }, 'TypeScript → Backend → DB → Docker → AWS → System Design → AI')
      ),
      React.createElement(
        'div',
        { className: 'glass-card os-stat-card' },
        React.createElement('div', { className: 'stat-num-row' }, React.createElement('h3', null, '90 Min/Day'), React.createElement('span', { className: 'badge' }, 'Formula')),
        React.createElement('p', { className: 'stat-desc' }, '20m Learn • 50m Build • 20m Recall (No tech-hopping)')
      ),
      React.createElement(
        'div',
        { className: 'glass-card os-stat-card' },
        React.createElement('div', { className: 'stat-num-row' }, React.createElement('h3', null, '₹24 LPA+'), React.createElement('span', { className: 'badge gold' }, 'Target')),
        React.createElement('p', { className: 'stat-desc' }, 'Senior Full-Stack & Production AI Engineer Offer')
      )
    ),

    // Navigation Tabs
    React.createElement(
      'div',
      { className: 'os-tabs-strip' },
      React.createElement(
        'button',
        { className: `os-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`, onClick: () => setActiveTab('roadmap') },
        React.createElement('i', { className: 'bx bx-list-check' }),
        ' 12-Month Curriculum & Checklists'
      ),
      React.createElement(
        'button',
        { className: `os-tab-btn ${activeTab === 'timer' ? 'active' : ''}`, onClick: () => setActiveTab('timer') },
        React.createElement('i', { className: 'bx bx-timer' }),
        ' Daily 90-Min Formula Timer'
      ),
      React.createElement(
        'button',
        { className: `os-tab-btn ${activeTab === 'scoreboard' ? 'active' : ''}`, onClick: () => setActiveTab('scoreboard') },
        React.createElement('i', { className: 'bx bx-bar-chart-alt-2' }),
        ' Sunday Scoreboard (Out of 10)'
      ),
      React.createElement(
        'button',
        { className: `os-tab-btn ${activeTab === 'project' ? 'active' : ''}`, onClick: () => setActiveTab('project') },
        React.createElement('i', { className: 'bx bx-cube' }),
        ' One Serious Flagship Project Rule'
      ),
      React.createElement(
        'button',
        { className: `os-tab-btn ${activeTab === 'inbox' ? 'active' : ''}`, onClick: () => setActiveTab('inbox') },
        React.createElement('i', { className: 'bx bx-envelope' }),
        ' Client Inquiries & Messages',
        unreadCount > 0 && React.createElement('span', { className: 'tab-badge-count' }, unreadCount)
      )
    ),

    // Tab 1: Roadmap & Nested Accordions
    activeTab === 'roadmap' &&
      React.createElement(
        'div',
        { className: 'os-roadmap-tab-content' },
        // Controls Row
        React.createElement(
          'div',
          { className: 'roadmap-controls-bar' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search topics, DSA, PostgreSQL, Docker, Redis...',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: 'os-search-input',
          }),
          React.createElement(
            'div',
            { className: 'btn-group' },
            React.createElement('button', { className: 'btn btn-glass btn-sm', onClick: expandAll }, 'Expand All'),
            React.createElement('button', { className: 'btn btn-glass btn-sm', onClick: collapseAll }, 'Collapse All')
          )
        ),

        // Months List
        React.createElement(
          'div',
          { className: 'months-accordion-container' },
          roadmap.map((month) => {
            const isExpanded = !!expandedMonths[month.monthNumber];
            // Calculate month progress
            let mTotal = 0;
            let mDone = 0;
            month.weeks.forEach((w) =>
              w.days.forEach((d) => {
                mTotal++;
                if (d.completed) mDone++;
              })
            );
            const mPct = mTotal > 0 ? Math.round((mDone / mTotal) * 100) : 0;

            return React.createElement(
              'div',
              { key: month.monthNumber, className: `glass-card month-accordion-card ${isExpanded ? 'open' : ''}` },
              // Month Accordion Header
              React.createElement(
                'div',
                { className: 'month-accordion-header', onClick: () => toggleMonth(month.monthNumber) },
                React.createElement(
                  'div',
                  { className: 'month-title-wrap' },
                  React.createElement('i', { className: `bx ${isExpanded ? 'bx-chevron-down' : 'bx-chevron-right'} toggle-caret` }),
                  React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'div',
                      { className: 'month-headline' },
                      React.createElement('h2', null, month.title),
                      month.isLighter && React.createElement('span', { className: 'badge-lighter' }, 'Lighter / Habit Month')
                    ),
                    React.createElement('p', { className: 'month-sub' }, month.subtitle)
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'month-header-meta' },
                  React.createElement('span', { className: 'month-time-badge' }, `Weekdays: ${month.weekdayTime} • Weekend: ${month.weekendTime}`),
                  React.createElement('span', { className: 'month-pct-badge' }, `${mPct}%`)
                )
              ),

              // Month Body (Weeks)
              isExpanded &&
                React.createElement(
                  'div',
                  { className: 'month-accordion-body' },
                  React.createElement(
                    'div',
                    { className: 'month-objective-callout' },
                    React.createElement('strong', null, '🎯 Monthly Objective: '),
                    month.objective
                  ),
                  month.weeks.map((week) => {
                    const isWeekOpen = !!expandedWeeks[week.weekNumber];
                    let wTotal = week.days.length;
                    let wDone = week.days.filter((d) => d.completed).length;

                    return React.createElement(
                      'div',
                      { key: week.weekNumber, className: `week-accordion-wrapper ${isWeekOpen ? 'open' : ''}` },
                      // Week Header
                      React.createElement(
                        'div',
                        { className: 'week-accordion-header', onClick: () => toggleWeek(week.weekNumber) },
                        React.createElement(
                          'div',
                          { className: 'week-title-wrap' },
                          React.createElement('i', { className: `bx ${isWeekOpen ? 'bx-folder-open' : 'bx-folder'} week-icon` }),
                          React.createElement('h3', null, week.title),
                          React.createElement('span', { className: 'week-focus-text' }, `(${week.focus})`)
                        ),
                        React.createElement('span', { className: 'week-count-badge' }, `${wDone}/${wTotal} Done`)
                      ),

                      // Week Days List
                      isWeekOpen &&
                        React.createElement(
                          'div',
                          { className: 'week-days-list' },
                          week.days
                            .filter((d) => {
                              if (!searchQuery) return true;
                              const query = searchQuery.toLowerCase();
                              return (
                                d.title.toLowerCase().includes(query) ||
                                d.learnItems.some((l) => l.toLowerCase().includes(query)) ||
                                d.buildItems.some((b) => b.toLowerCase().includes(query)) ||
                                (d.dsaItems && d.dsaItems.some((ds) => ds.toLowerCase().includes(query)))
                              );
                            })
                            .map((day) =>
                              React.createElement(DayTaskCard, {
                                key: day.id,
                                day,
                                monthNumber: month.monthNumber,
                                weekNumber: week.weekNumber,
                                toggleDayTask,
                                updateDayNotes,
                                addDayExtraItem,
                                removeDayExtraItem,
                                updateDayExtraNotes,
                              })
                            )
                        )
                    );
                  })
                )
            );
          })
        )
      ),

    // Tab 2: Daily 90-Minute Formula Timer
    activeTab === 'timer' &&
      React.createElement(
        'div',
        { className: 'os-timer-view' },
        React.createElement(
          'div',
          { className: 'glass-card timer-main-card' },
          React.createElement('h2', { className: 'timer-heading' }, 'Daily 90-Minute Engineering Formula'),
          React.createElement('p', { className: 'timer-sub' }, 'Don\'t watch 90-minute tutorials. Execute deliberate engineering practice.'),

          // Mode Selector
          React.createElement(
            'div',
            { className: 'timer-mode-selector' },
            React.createElement(
              'button',
              {
                className: `mode-btn ${timerMode === 'normal' ? 'active' : ''}`,
                onClick: () => {
                  setTimerMode('normal');
                  setTimerPreset('learn', 20);
                },
              },
              'Normal Weekday (90m)'
            ),
            React.createElement(
              'button',
              {
                className: `mode-btn ${timerMode === 'minimum' ? 'active' : ''}`,
                onClick: () => {
                  setTimerMode('minimum');
                  setTimerPreset('minimum', 20);
                },
              },
              'Exhausted Minimum Mode (20m)'
            ),
            React.createElement(
              'button',
              {
                className: `mode-btn ${timerMode === 'weekend' ? 'active' : ''}`,
                onClick: () => {
                  setTimerMode('weekend');
                  setTimerPreset('project', 90);
                },
              },
              'Weekend Deep Work (2.5h)'
            )
          ),

          // Stage Pills
          timerMode === 'normal' &&
            React.createElement(
              'div',
              { className: 'timer-steps-row' },
              React.createElement(
                'button',
                {
                  className: `step-pill ${activeTimerStep === 'learn' ? 'active' : ''}`,
                  onClick: () => setTimerPreset('learn', 20),
                },
                '1. Learn (20m)'
              ),
              React.createElement(
                'button',
                {
                  className: `step-pill ${activeTimerStep === 'build' ? 'active' : ''}`,
                  onClick: () => setTimerPreset('build', 50),
                },
                '2. Build Code (50m)'
              ),
              React.createElement(
                'button',
                {
                  className: `step-pill ${activeTimerStep === 'recall' ? 'active' : ''}`,
                  onClick: () => setTimerPreset('recall', 20),
                },
                '3. Recall / Explain (20m)'
              )
            ),

          // Digital Clock Display
          React.createElement('div', { className: 'timer-clock-display' }, formatTime(timerSeconds)),

          // Controls
          React.createElement(
            'div',
            { className: 'timer-controls-row' },
            React.createElement(
              'button',
              {
                className: `btn ${isTimerRunning ? 'btn-secondary' : 'btn-primary'} btn-lg`,
                onClick: () => setIsTimerRunning(!isTimerRunning),
              },
              isTimerRunning ? '⏸️ Pause Session' : '▶️ Start Timer'
            ),
            React.createElement(
              'button',
              {
                className: 'btn btn-glass btn-lg',
                onClick: () => {
                  setIsTimerRunning(false);
                  setTimerSeconds(20 * 60);
                },
              },
              '🔄 Reset'
            )
          ),

          // Rule Callout
          React.createElement(
            'div',
            { className: 'timer-rule-callout' },
            React.createElement('h4', null, '⚡ The Golden Rule for Exhausted Days:'),
            React.createElement('p', null, '"Never let one bad day become a bad week. Do 20 minutes minimum (read yesterday\'s notes, solve 1 easy problem, or fix 1 bug) and keep your streak alive."')
          )
        )
      ),

    // Tab 3: Sunday Scoreboard
    activeTab === 'scoreboard' &&
      React.createElement(
        'div',
        { className: 'os-scoreboard-view' },
        React.createElement(
          'div',
          { className: 'glass-card scoreboard-card' },
          React.createElement('h2', null, 'Sunday Engineering Scoreboard'),
          React.createElement('p', { className: 'scoreboard-sub' }, 'Every Sunday, give yourself an honest score out of 10. Don\'t chase 10/10 everywhere — target strong employability.'),

          // Scoreboard Sliders Grid
          React.createElement(
            'div',
            { className: 'scoreboard-grid' },
            Object.keys(scoreboard).map((key) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
              const val = scoreboard[key];
              return React.createElement(
                'div',
                { key, className: 'score-slider-item' },
                React.createElement(
                  'div',
                  { className: 'score-label-row' },
                  React.createElement('span', { className: 'score-name' }, label),
                  React.createElement('span', { className: 'score-val-badge' }, `${val} / 10`)
                ),
                React.createElement('input', {
                  type: 'range',
                  min: 1,
                  max: 10,
                  value: val,
                  onChange: (e) => setScoreboard({ ...scoreboard, [key]: Number(e.target.value) }),
                  className: 'score-slider',
                })
              );
            })
          ),

          // Target Profile Benchmark
          React.createElement(
            'div',
            { className: 'benchmark-target-box' },
            React.createElement('h4', null, '🎯 Target Employability Benchmark for ₹24 LPA:'),
            React.createElement('p', null, 'Backend: 9/10 • TypeScript: 9/10 • SQL: 8/10 • Architecture: 8/10 • Cloud: 7/10 • DevOps: 7/10 • AI Engineering: 8/10 • Frontend: 8/10 • DSA: 6/10')
          )
        )
      ),

    // Tab 4: The 1 Serious Flagship Project Rule
    activeTab === 'project' &&
      React.createElement(
        'div',
        { className: 'os-project-view' },
        React.createElement(
          'div',
          { className: 'glass-card project-evolution-card' },
          React.createElement('h2', null, 'The "One Serious Project" Rule'),
          React.createElement('p', { className: 'sub' }, 'Do not build 15 shallow tutorial clones. Build 1 serious production-grade platform and continuously upgrade its architecture.'),

          React.createElement(
            'div',
            { className: 'evolution-timeline' },
            [
              { v: 'V1', title: 'Core Full-Stack System', tech: 'React 19 + Node.js + PostgreSQL Relational Schema' },
              { v: 'V2', title: 'Security & Caching', tech: 'TypeScript + Redis Cache-Aside + Silent JWT Refresh' },
              { v: 'V3', title: 'Async Queues & Testing', tech: 'BullMQ Workers + Retries + Vitest Integration Tests' },
              { v: 'V4', title: 'Containerization & Cloud', tech: 'Multi-stage Dockerfiles + AWS (EC2/RDS/S3) + GitHub Actions' },
              { v: 'V5', title: 'Observability & Scale', tech: 'Prometheus metrics + Structured Winston logs + 1M rows tuning' },
              { v: 'V6', title: 'Autonomous AI Layer', tech: 'pgvector RAG + Autonomous Tool Calling Database Agent' },
              { v: 'V7', title: 'Distributed Systems', tech: 'Idempotent Webhooks + Redlock Distributed Locking' },
            ].map((item, idx) =>
              React.createElement(
                'div',
                { key: idx, className: 'evolution-item' },
                React.createElement('span', { className: 'v-tag' }, item.v),
                React.createElement(
                  'div',
                  { className: 'evolution-content' },
                  React.createElement('h4', null, item.title),
                  React.createElement('p', null, item.tech)
                )
              )
            )
          )
        )
      ),

    // Tab 5: Private Client Inquiries & Messages Inbox
    activeTab === 'inbox' &&
      React.createElement(
        'div',
        { className: 'os-inbox-view' },
        React.createElement(
          'div',
          { className: 'glass-card inbox-card' },
          // Header
          React.createElement(
            'div',
            { className: 'inbox-header-row' },
            React.createElement(
              'div',
              null,
              React.createElement('h2', { className: 'inbox-title' }, 'Client Inquiries & Message Logger 📬'),
              React.createElement(
                'p',
                { className: 'inbox-subtitle' },
                `Confidential inbox. Every submission from your Contact Us page is securely captured and logged here.`
              )
            ),
            React.createElement(
              'div',
              { className: 'inbox-actions-group' },
              React.createElement(
                'button',
                { className: 'btn btn-glass btn-sm', onClick: refreshMessages, title: 'Sync and refresh messages from storage' },
                React.createElement('i', { className: 'bx bx-refresh' }),
                ' Refresh Inbox'
              ),
              React.createElement(
                'button',
                { className: 'btn btn-glass btn-sm', onClick: exportMessagesCSV, title: 'Download all leads to CSV' },
                React.createElement('i', { className: 'bx bx-export' }),
                ' Export CSV'
              ),
              React.createElement(
                'button',
                { className: 'btn btn-glass btn-sm', onClick: markAllMessagesRead },
                React.createElement('i', { className: 'bx bx-check-double' }),
                ' Mark All Read'
              ),
              messages.length > 0 &&
                React.createElement(
                  'button',
                  { className: 'btn btn-secondary btn-sm', onClick: clearAllMessages, title: 'Clear and delete all messages' },
                  React.createElement('i', { className: 'bx bx-trash' }),
                  ' Delete All Junk'
                )
            )
          ),

          // Message Cards or Empty State
          messages.length === 0
            ? React.createElement(
                'div',
                { className: 'inbox-empty-state' },
                React.createElement('i', { className: 'bx bx-envelope-open empty-icon' }),
                React.createElement('h3', null, 'No Inquiries Logged Yet'),
                React.createElement(
                  'p',
                  null,
                  'When visitors send messages through your Contact Us form, they will appear here instantly in real-time with their email, topic, and message.'
                ),
                React.createElement(
                  'div',
                  { style: { display: 'flex', gap: '1.2rem', marginTop: '1.8rem', flexWrap: 'wrap', justifyContent: 'center' } },
                  React.createElement(
                    'a',
                    { href: '../contact/contact.html', target: '_blank', className: 'btn btn-primary btn-sm' },
                    'Open Contact Us Page ↗'
                  ),
                  React.createElement(
                    'button',
                    {
                      className: 'btn btn-glass btn-sm',
                      onClick: () => {
                        const sample = {
                          id: 'msg_' + Date.now(),
                          name: 'Dr. Sarah Jenkins',
                          email: 'sarah.jenkins@edutech-global.org',
                          subject: 'Full-Stack Web & Assessment Software Consultation',
                          message: 'Hello Kashif! Saw your portfolio and CBSE Aakalan architecture. We are hiring senior engineers and would love to connect with you regarding full-stack roles.',
                          timestamp: new Date().toISOString(),
                          dateFormatted: new Date().toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          }),
                          read: false,
                        };
                        const updated = [sample, ...messages];
                        setMessages(updated);
                        try {
                          localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
                        } catch (e) {}
                      },
                    },
                    '🧪 Add Sample Test Message'
                  )
                )
              )
            : React.createElement(
                'div',
                { className: 'inbox-messages-list' },
                messages.map((msg) => {
                  return React.createElement(
                    'div',
                    { key: msg.id, className: `inbox-message-item ${msg.read ? 'read' : 'unread'}` },
                    // Top Sender Info
                    React.createElement(
                      'div',
                      { className: 'msg-top-row' },
                      React.createElement(
                        'div',
                        { className: 'msg-sender-group' },
                        React.createElement('div', { className: 'msg-avatar' }, (msg.name || 'U').charAt(0).toUpperCase()),
                        React.createElement(
                          'div',
                          null,
                          React.createElement(
                            'div',
                            { className: 'msg-name-row' },
                            React.createElement('h4', { className: 'msg-sender-name' }, msg.name || 'Anonymous Visitor'),
                            !msg.read && React.createElement('span', { className: 'msg-new-badge' }, 'NEW 🔴'),
                            msg.read && React.createElement('span', { className: 'msg-read-badge' }, 'READ ✅')
                          ),
                          React.createElement('span', { className: 'msg-email-text' }, msg.email)
                        )
                      ),
                      React.createElement(
                        'div',
                        { className: 'msg-date-col' },
                        React.createElement('span', { className: 'msg-time-stamp' }, msg.dateFormatted || msg.timestamp)
                      )
                    ),

                    // Subject Pill & Body
                    React.createElement(
                      'div',
                      { className: 'msg-subject-row' },
                      React.createElement('span', { className: 'msg-subject-tag' }, `Topic: ${msg.subject || 'General Inquiry'}`)
                    ),
                    React.createElement('div', { className: 'msg-body-text' }, msg.message),

                    // Actions Bar
                    React.createElement(
                      'div',
                      { className: 'msg-actions-bar' },
                      React.createElement(
                        'div',
                        { className: 'msg-reply-links' },
                        React.createElement(
                          'a',
                          {
                            href: `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Inquiry')}&body=Hi ${encodeURIComponent(msg.name || '')},%0D%0A%0D%0AThank you for reaching out through my portfolio website!`,
                            className: 'btn btn-primary btn-sm',
                          },
                          React.createElement('i', { className: 'bx bx-reply' }),
                          ' Reply via Email'
                        ),
                        React.createElement(
                          'button',
                          {
                            type: 'button',
                            className: 'btn btn-glass btn-sm',
                            onClick: () => {
                              navigator.clipboard.writeText(msg.email);
                              alert(`Copied ${msg.email} to clipboard!`);
                            },
                          },
                          React.createElement('i', { className: 'bx bx-copy' }),
                          ' Copy Email'
                        )
                      ),
                      React.createElement(
                        'div',
                        { className: 'msg-admin-tools' },
                        React.createElement(
                          'button',
                          {
                            type: 'button',
                            className: 'btn btn-secondary btn-sm btn-delete-junk',
                            style: { background: 'rgba(255, 107, 107, 0.15)', borderColor: 'rgba(255, 107, 107, 0.35)', color: 'var(--accent-coral)' },
                            onClick: () => deleteMessage(msg.id),
                            title: 'Delete this junk message permanently',
                          },
                          React.createElement('i', { className: 'bx bx-trash' }),
                          ' Delete Junk'
                        ),
                        React.createElement(
                          'button',
                          {
                            type: 'button',
                            className: 'btn-icon-action',
                            onClick: () => toggleMessageRead(msg.id),
                            title: msg.read ? 'Mark as Unread' : 'Mark as Read',
                          },
                          React.createElement('i', { className: `bx ${msg.read ? 'bx-envelope' : 'bx-envelope-open'}` })
                        )
                      )
                    )
                  );
                })
              )
        )
      )
  );
};

// Mount App into root
const rootEl = document.getElementById('road-to-24lpa-root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(React.createElement(RoadTo24LPAApp));
}
