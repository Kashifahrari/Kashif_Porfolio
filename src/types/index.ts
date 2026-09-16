// ===================================================
// SHARED TYPESCRIPT INTERFACES & TYPES
// ===================================================

// --- Road to 24 LPA Portal Types ---
export interface DayTask {
  id: string;
  dayNumber: number | string;
  title: string;
  duration: string;
  objective: string;
  learnItems: string[];
  buildItems: string[];
  dsaItems?: string[];
  extraItems?: string[];
  extraNotes?: string;
  completed: boolean;
  notes?: string;
  completedAt?: string;
}

export interface WeekPlan {
  weekNumber: number;
  title: string;
  focus: string;
  days: DayTask[];
}

export interface MonthPlan {
  monthNumber: number;
  title: string;
  subtitle: string;
  objective: string;
  weekdayTime: string;
  weekendTime: string;
  isLighter?: boolean;
  weeks: WeekPlan[];
}

export interface Scoreboard {
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

// --- Project Modal Types ---
export interface ArchNode {
  title: string;
  desc: string;
}

export interface ProjectData {
  title: string;
  category: string;
  company: string;
  tagline: string;
  architecture: ArchNode[];
  problemSolved: string;
  highlights: string[];
  techStack: string[];
  github: string;
}

export type ProjectKey = 'cba' | 'stayease' | 'megavlog' | 'attendance';

// --- Certificate Types ---
export type CertCategory = 'web' | 'internship' | 'security' | 'course';

export interface Certificate {
  id: number;
  img: string;
  category: CertCategory;
  org: string;
  title: string;
  desc: string;
}

// --- Dev Log Types ---
export type LogCategory = 'fullstack' | 'backend' | 'dsa' | 'learning';

export interface DevLog {
  id: string;
  date: string;
  category: LogCategory;
  categoryLabel: string;
  title: string;
  highlights: string[];
  tech: string[];
  link: string;
}

// --- Publication Types ---
export interface Publication {
  id: string;
  category: string;
  statLabel: string;
  statClass: string;
  title: string;
  desc: string;
  tags: string[];
  url: string;
  isFeatured?: boolean;
  isAuthorHub?: boolean;
}

// --- Contact Message Types ---
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  dateFormatted: string;
  read: boolean;
}

// --- AI Streaming Terminal Agent Types ---
export type AIBackendStatus = 'connecting' | 'online' | 'waking_up' | 'streaming' | 'offline';

export interface AIAgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface AIStreamChunk {
  text?: string;
  delta?: string;
  done?: boolean;
  error?: string;
}

// --- Window extensions for CDN globals ---
declare global {
  interface Window {
    particlesJS: (elementId: string, config: object) => void;
    pJSDom: Array<{ pJS: { fn: { vendors: { destroypJS: () => void } } } }>;
    openProjectModal?: (key: string) => void;
  }
}

