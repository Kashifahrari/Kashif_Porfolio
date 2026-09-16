import React, { useState } from "react";

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

interface DayTaskCardProps {
  day: Day;
  monthNumber: number;
  weekNumber: number;
  toggleDayTask: (m: number, w: number, id: string) => void;
  addDayExtraItem: (m: number, w: number, id: string, text: string) => void;
  removeDayExtraItem: (m: number, w: number, id: string, idx: number) => void;
  updateDayExtraNotes: (m: number, w: number, id: string, notes: string) => void;
}

export const DayTaskCard: React.FC<DayTaskCardProps> = ({
  day,
  monthNumber,
  weekNumber,
  toggleDayTask,
  addDayExtraItem,
  removeDayExtraItem,
  updateDayExtraNotes,
}) => {
  const [extraInput, setExtraInput] = useState("");
  const [showExtraForm, setShowExtraForm] = useState(false);

  const handleAddExtra = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!extraInput.trim()) return;
    addDayExtraItem(monthNumber, weekNumber, day.id, extraInput);
    setExtraInput("");
  };

  const handleQuickTag = (tagText: string) => {
    addDayExtraItem(monthNumber, weekNumber, day.id, tagText);
  };

  const extraCount = (day.extraItems || []).length + (day.extraNotes && day.extraNotes.trim() ? 1 : 0);

  return (
    <div className={"day-task-card " + (day.completed ? "completed" : "")}>
      <div className="day-task-top">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={day.completed}
            onChange={() => toggleDayTask(monthNumber, weekNumber, day.id)}
          />
          <span className="checkmark"></span>
        </label>
        <div className="day-main-info">
          <div className="day-badge-row">
            <span className="day-number-tag">
              {typeof day.dayNumber === "number" ? "Day " + day.dayNumber : day.dayNumber}
            </span>
            <span className="day-time-tag">⏱️ {day.duration}</span>
            {day.completed && <span className="day-shipped-tag">SHIPPED ✓</span>}
            {extraCount > 0 && <span className="day-extra-badge">🚀 {extraCount} Extra Shipped</span>}
          </div>
          <h4 className="day-task-title">{day.title}</h4>
          <p className="day-task-obj">{day.objective}</p>
        </div>
      </div>

      <div className="day-breakdown-grid">
        {day.learnItems && day.learnItems.length > 0 && (
          <div className="breakdown-block learn">
            <h5>💡 20 Min · Learn & Understand</h5>
            <ul>
              {day.learnItems.map((li, idx) => <li key={idx}>{li}</li>)}
            </ul>
          </div>
        )}
        {day.buildItems && day.buildItems.length > 0 && (
          <div className="breakdown-block build">
            <h5>🛠️ 50 Min · Build & Produce Code</h5>
            <ul>
              {day.buildItems.map((bi, idx) => <li key={idx}>{bi}</li>)}
            </ul>
          </div>
        )}
        {day.dsaItems && day.dsaItems.length > 0 && (
          <div className="breakdown-block dsa">
            <h5>🚀 Weekend DSA Dose</h5>
            <ul>
              {day.dsaItems.map((di, idx) => <li key={idx}>Solve: {di}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="day-extra-section">
        <div className="extra-section-header" onClick={() => setShowExtraForm(!showExtraForm)}>
          <div className="extra-header-left">
            <i className="bx bxs-zap extra-zap-icon"></i>
            <span className="extra-heading">Extra Mileage & Over-Delivery</span>
            {extraCount > 0 && <span className="extra-count-pill">+{extraCount} Bonus</span>}
          </div>
          <button type="button" className="btn-toggle-extra">
            <i className={"bx " + (showExtraForm ? "bx-chevron-up" : "bx-plus")}></i>
            {showExtraForm ? " Close" : " Log Extra"}
          </button>
        </div>

        {day.extraItems && day.extraItems.length > 0 && (
          <div className="extra-items-list">
            {day.extraItems.map((item, idx) => (
              <div key={idx} className="extra-item-row">
                <span className="extra-bullet">⚡</span>
                <span className="extra-text">{item}</span>
                <button
                  type="button"
                  className="extra-del-btn"
                  title="Remove item"
                  onClick={() => removeDayExtraItem(monthNumber, weekNumber, day.id, idx)}
                >
                  <i className="bx bx-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {showExtraForm && (
          <div className="extra-input-box">
            <form onSubmit={handleAddExtra} className="extra-form-row">
              <input
                type="text"
                placeholder='Add extra work done...'
                value={extraInput}
                onChange={(e) => setExtraInput(e.target.value)}
                className="extra-input-field"
              />
              <button type="submit" className="btn btn-primary btn-sm">+ Log Extra</button>
            </form>
            <div className="extra-quick-tags">
              <span className="quick-tag-label">Quick Add: </span>
              <button type="button" className="quick-chip" onClick={() => handleQuickTag("Solved +1 Extra LeetCode Problem")}>+1 Extra DSA</button>
              <button type="button" className="quick-chip" onClick={() => handleQuickTag("Built +1 Extra API Endpoint & Unit Test")}>+1 API Test</button>
              <button type="button" className="quick-chip" onClick={() => handleQuickTag("Read 20m Deep Architecture Documentation")}>+20m Docs</button>
            </div>
            <textarea
              placeholder="Extra notes / insights..."
              value={day.extraNotes || ""}
              onChange={(e) => updateDayExtraNotes(monthNumber, weekNumber, day.id, e.target.value)}
              className="extra-notes-textarea"
              rows={2}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};
