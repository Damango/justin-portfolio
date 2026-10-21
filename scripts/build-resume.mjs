// Prints resume/resume.html to public/resume.pdf with headless Chrome or Edge.
// Usage: npm run resume   (set CHROME_PATH to use a different browser)

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const src = join(root, 'resume', 'resume.html');
const out = join(root, 'public', 'resume.pdf');

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('No Chrome or Edge found. Set CHROME_PATH to a Chromium-based browser.');
  process.exit(1);
}

// A throwaway profile keeps this from touching your real browser session.
const profile = mkdtempSync(join(tmpdir(), 'resume-chrome-'));
try {
  execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${profile}`,
    '--no-pdf-header-footer',
    '--virtual-time-budget=5000', // give the web fonts time to load
    `--print-to-pdf=${out}`,
    pathToFileURL(src).href,
  ], { stdio: 'ignore' });
} finally {
  rmSync(profile, { recursive: true, force: true });
}

console.log(`Wrote ${out}`);
