// ─────────────────────────────────────────────────────────────
//  All site content lives here. Replace every [bracketed] value
//  with your own details — nothing else needs to change.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Justin',
  initial: 'J',
  role: 'Software Engineer',
  city: 'Florida',
  timezone: 'Eastern Time',
  email: 'justinkesslerio@protonmail.com',
  resumeUrl: '/resume.pdf', // drop your PDF into /public as resume.pdf
  github: '', // leave empty to hide the button
  linkedin: '', // leave empty to hide the button
  availability: 'Full-time or contract. Usually replies within 1–2 business days.',
  replyTime: 'Replies within 1–2 business days',
};

export const now = [
  { label: 'Building', tone: 'blue', text: 'An agentic AI project manager' },
  { label: 'Learning', tone: 'amber', text: 'Technical art for games' },
  { label: 'Reading', tone: 'gray', text: 'Reinforcement Learning: An Introduction by Sutton & Barto' },
] as const;

// ── Keyboard (hero) ──────────────────────────────────────────
export type Tone = 'blue' | 'amber' | 'gray' | 'green';

export const tones: Record<Tone, { top: string; side: string; light: string; badge: string }> = {
  blue: { top: '#8ab8ff', side: '#3f78d4', light: '#e8f1ff', badge: 'b-blue' },
  amber: { top: '#f6b26b', side: '#cf7a2e', light: '#fff3e3', badge: 'b-amber' },
  gray: { top: '#f3f3f5', side: '#b5b5be', light: '#f3f3f5', badge: 'b-gray' },
  green: { top: '#7ad874', side: '#43a03e', light: '#e9f9e8', badge: 'b-green' },
};

export type KeyDef = {
  id: string;
  label: string;
  glyph: string;
  name: string;
  tag: string;
  tone: Tone;
  line: string;
  x: number;
  y: number;
  w: number;
  h: number;
  action?: 'projects' | 'contact';
};

// Positions are in the keyboard's own (un-rotated) 520 × 244 plane.
export const keys: KeyDef[] = [
  { id: 'ts', label: 'TS', glyph: 'TS', name: 'TypeScript', tag: 'Language', tone: 'blue', line: 'Typed frontends, tooling and APIs.', x: 20, y: 20, w: 60, h: 60 },
  { id: 'cpp', label: 'C++', glyph: 'C++', name: 'C++', tag: 'Language', tone: 'blue', line: 'Performance-critical code and simulations.', x: 92, y: 20, w: 60, h: 60 },
  { id: 'py', label: 'PY', glyph: 'PY', name: 'Python', tag: 'Language', tone: 'blue', line: 'AI agents, data work, scripts and glue.', x: 164, y: 20, w: 60, h: 60 },
  { id: 'react', label: 'REACT', glyph: 'JSX', name: 'React', tag: 'Frontend', tone: 'blue', line: 'Interactive, animated interfaces.', x: 236, y: 20, w: 60, h: 60 },
  { id: 'node', label: 'NODE', glyph: 'JS', name: 'Node.js', tag: 'Runtime', tone: 'amber', line: 'APIs, real-time WebSockets and servers.', x: 20, y: 92, w: 60, h: 60 },
  { id: 'sql', label: 'SQL', glyph: 'SQL', name: 'PostgreSQL', tag: 'Data', tone: 'amber', line: 'Schemas that age well, queries that stay fast.', x: 92, y: 92, w: 60, h: 60 },
  { id: 'aws', label: 'AWS', glyph: 'AWS', name: 'AWS', tag: 'Cloud', tone: 'gray', line: 'Hosting, storage and serverless on demand.', x: 164, y: 92, w: 60, h: 60 },
  { id: 'gc', label: 'GC', glyph: 'GC', name: 'Google Cloud', tag: 'Cloud', tone: 'gray', line: 'Deploying and scaling apps on GCP.', x: 236, y: 92, w: 60, h: 60 },
  { id: 'ship', label: 'DEPLOY', glyph: '▲', name: 'Deploy', tag: 'Action', tone: 'green', line: 'CI/CD from commit to production. Press to see projects.', x: 20, y: 164, w: 132, h: 60, action: 'projects' },
  { id: 'hire', label: 'HIRE ME', glyph: '→', name: 'Hire me', tag: 'Action', tone: 'green', line: 'Press to start a conversation.', x: 164, y: 164, w: 132, h: 60, action: 'contact' },
];

// ── Projects ─────────────────────────────────────────────────
export type Status = 'live' | 'beta' | 'progress' | 'archived';

export const statusLabels: Record<Status | 'all', string> = {
  all: 'All',
  live: 'Live',
  beta: 'Beta',
  progress: 'In progress',
  archived: 'Archived',
};

export type Project = {
  name: string;
  blurb: string;
  stack: string[];
  status: Status;
  year: string;
  tile: [string, string];
  caseStudy?: string;
  source?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    name: 'Fable — AI Project Manager',
    blurb: 'Local-first kanban boards that scaffold starter repos, run their dev servers, and send any task straight to Claude Code or Cursor as a prompt.',
    stack: ['TS', 'React', 'Tailwind', 'Zustand'],
    status: 'progress',
    year: '2026',
    tile: ['#8ab8ff', '#3f78d4'],
  },
  {
    name: 'Afterhours',
    blurb: "Real-time multiplayer No-Limit Hold'em with side pots, bots and timers, plus roulette, baccarat and blackjack on one play-money wallet.",
    stack: ['TS', 'Bun', 'WebSockets'],
    status: 'beta',
    year: '2026',
    tile: ['#7ad874', '#43a03e'],
  },
  {
    name: 'Income Atlas',
    blurb: 'An explorable map of U.S. household income built on Census ACS data: click a state to fly in to its counties and compare trends since 2010.',
    stack: ['TS', 'React', 'D3'],
    status: 'beta',
    year: '2026',
    tile: ['#f6b26b', '#cf7a2e'],
  },
  {
    name: 'Aphelion One',
    blurb: 'A landing page for a fictional quantum computer, with a ray-marched WebGL hero and hand-built dithered canvas animations.',
    stack: ['JS', 'WebGL', 'Canvas'],
    status: 'progress',
    year: '2026',
    tile: ['#f3f3f5', '#b5b5be'],
  },
  {
    name: 'Pizza Boyz',
    blurb: 'A fast, mobile-first menu site for a local pizza restaurant, with the menu loaded live from Supabase.',
    stack: ['React', 'Tailwind', 'Supabase'],
    status: 'live',
    year: '2026',
    tile: ['#8ab8ff', '#3f78d4'],
  },
  {
    name: 'Pizza Boyz Menu Admin',
    blurb: "An admin dashboard for editing the restaurant's live menu, locked down so only the owner account can write, enforced by Postgres row-level security.",
    stack: ['React', 'Supabase', 'Postgres'],
    status: 'live',
    year: '2026',
    tile: ['#f6b26b', '#cf7a2e'],
  },
];

// ── Work history ─────────────────────────────────────────────
export const jobs = [
  {
    mark: 'F',
    role: 'Independent Software Engineer',
    company: 'Freelance',
    dates: '2023 — Now',
    location: 'Remote',
    current: true,
    notes: [
      'Design, build and deploy full-stack web apps end to end, from PostgreSQL schema and auth to UI and hosting.',
      'Build real-time, data-visualization and AI-tooling products. See Projects.',
    ],
  },
  {
    mark: 'L',
    role: 'Full Stack Developer',
    company: 'Launch That · Media & SEO',
    dates: '2021 — 2023',
    location: 'Orlando, FL',
    current: false,
    notes: [
      'Led Disavowl, a web app for categorizing and filtering millions of backlink URLs, built on AWS and MySQL.',
      'Optimized Reportaroo to pull from hundreds of thousands of financial data points and turn them into insights.',
      'Led the move from jQuery to vanilla JavaScript across sites with millions of visitors.',
    ],
  },
];

// ── Blog ─────────────────────────────────────────────────────
export const posts = [
  { title: '[A hard bug, and how you finally found it]', date: '[Sep 12, 2026]', mins: '[6] min', tag: 'Debugging', badge: 'b-red', href: '#' },
  { title: '[Why you chose boring technology]', date: '[Aug 03, 2026]', mins: '[8] min', tag: 'Architecture', badge: 'b-blue', href: '#' },
  { title: '[What shipping every week taught you]', date: '[Jun 21, 2026]', mins: '[5] min', tag: 'Process', badge: 'b-amber', href: '#' },
  { title: '[Notes from a talk you gave]', date: '[May 02, 2026]', mins: '[9] min', tag: 'Talks', badge: 'b-green', href: '#' },
];

export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'work', label: 'Work History' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];
