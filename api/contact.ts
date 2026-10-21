// ─────────────────────────────────────────────────────────────
//  POST /api/contact — delivers a contact-form message to your
//  inbox through Resend. Runs as a Vercel Function in production
//  and through the Vite dev server locally (see vite.config.ts).
//
//  Defenses, in order:
//    1. Same-origin check (blocks other sites posting to it)
//    2. JSON only, 16 KB cap
//    3. Honeypot field (bots fill it, people never see it)
//    4. Per-IP rate limit (5 / hour)
//    5. Cloudflare Turnstile verification
//    6. Daily cap (50 / day) so a flood can't burn your Resend quota
//    7. Strict field validation; the email is plain text only, so
//       nothing a visitor types is ever rendered as HTML
// ─────────────────────────────────────────────────────────────

const LIMITS = { name: 100, email: 254, subject: 150, message: 5000 };
const MAX_BODY_BYTES = 16 * 1024;
const MAX_LINKS = 5;
const PER_IP = { max: 5, windowSec: 60 * 60 };
const DAILY = { max: 50, windowSec: 24 * 60 * 60 };

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;

type Fields = { name: string; email: string; subject: string; message: string };

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function POST(request: Request) {
  return handleContact(request, clientIp(request));
}

export async function handleContact(request: Request, ip: string): Promise<Response> {
  const env = process.env;

  if (!sameOrigin(request, env.ALLOWED_ORIGINS)) return json(403, { error: 'Forbidden.' });

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return json(415, { error: 'Unsupported request.' });
  }
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return json(413, { error: 'That message is too long.' });
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: 'That message is too long.' });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  // Honeypot: pretend it worked so the bot moves on without learning anything.
  if (typeof body.website === 'string' && body.website.trim() !== '') return json(200, { ok: true });

  const fields = validate(body);
  if ('error' in fields) return json(400, { error: fields.error });

  if (!(await allow(`contact:ip:${ip}`, PER_IP))) {
    return json(429, { error: 'Too many messages. Please try again in an hour.' });
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip, env.TURNSTILE_SECRET_KEY))) {
    return json(403, { error: 'Spam check failed. Please try again.' });
  }

  if (!(await allow('contact:daily', DAILY))) {
    return json(429, { error: 'The inbox is busy today. Please email me directly.' });
  }

  return send(fields, env);
}

// ── Validation ───────────────────────────────────────────────
function clean(value: unknown, max: number, singleLine: boolean): string | null {
  if (typeof value !== 'string') return '';
  // Strip control characters (keeping \t \n \r), and newlines in single-line
  // fields so nothing can break out of the subject line.
  let s = value.normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  if (singleLine) s = s.replace(/[\r\n\u2028\u2029\t]+/g, ' ');
  s = s.trim();
  return s.length > max ? null : s;
}

function validate(body: Record<string, unknown>): Fields | { error: string } {
  const name = clean(body.name, LIMITS.name, true);
  const email = clean(body.email, LIMITS.email, true);
  const subject = clean(body.subject, LIMITS.subject, true);
  const message = clean(body.message, LIMITS.message, false);

  if (name === null || email === null || subject === null || message === null) {
    return { error: 'One of the fields is too long.' };
  }
  if (!name) return { error: 'Please add your name.' };
  if (!EMAIL.test(email)) return { error: 'Please add a valid email.' };
  if (!subject) return { error: "Please say what it's about." };
  if (message.length < 10) return { error: 'A sentence or two helps.' };
  if ((message.match(/https?:\/\/|www\./gi)?.length ?? 0) > MAX_LINKS) {
    return { error: 'Please include fewer links.' };
  }
  return { name, email, subject, message };
}

// ── Origin ───────────────────────────────────────────────────
function sameOrigin(request: Request, allowed?: string): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  if (allowed) {
    return allowed
      .split(',')
      .map((o) => o.trim())
      .includes(origin);
  }
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function clientIp(request: Request): string {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

// ── Turnstile ────────────────────────────────────────────────
async function verifyTurnstile(token: unknown, ip: string, secret?: string): Promise<boolean> {
  if (!secret) {
    console.error('[contact] TURNSTILE_SECRET_KEY is not set');
    return false;
  }
  if (typeof token !== 'string' || !token || token.length > 2048) return false;

  const form = new URLSearchParams({ secret, response: token });
  if (ip !== 'unknown') form.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean; action?: string };
    return data.success === true && (!data.action || data.action === 'contact');
  } catch (err) {
    console.error('[contact] Turnstile verification failed', err);
    return false;
  }
}

// ── Rate limiting ────────────────────────────────────────────
// Uses Upstash Redis when it's configured, so limits hold across every
// serverless instance. Without it, falls back to per-instance memory,
// which still slows down a single attacker but resets on cold starts.
const memory = new Map<string, { count: number; resetAt: number }>();

async function allow(key: string, { max, windowSec }: { max: number; windowSec: number }): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, String(windowSec), 'NX'],
        ]),
      });
      const out = (await res.json()) as { result?: unknown }[];
      if (typeof out[0]?.result === 'number') return out[0].result <= max;
    } catch (err) {
      console.error('[contact] Upstash rate limit failed, using memory', err);
    }
  }

  const now = Date.now();
  if (memory.size > 5000) for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  const hit = memory.get(key);
  if (!hit || hit.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  hit.count += 1;
  return hit.count <= max;
}

// ── Delivery ─────────────────────────────────────────────────
async function send(f: Fields, env: NodeJS.ProcessEnv): Promise<Response> {
  const subject = `Portfolio: ${f.subject}`;
  const text = `${f.message}\n\n— ${f.name} <${f.email}>\n\nSent from your portfolio contact form. Reply to this email to answer ${f.name} directly.`;

  if (env.CONTACT_DRY_RUN === '1') {
    console.info(`[contact] DRY RUN, not sent\nSubject: ${subject}\nReply-To: ${f.email}\n\n${text}`);
    return json(200, { ok: true });
  }

  const key = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.error('[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set');
    return json(500, { error: "Email isn't set up yet. Please email me directly." });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: f.email,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error('[contact] Resend rejected the message', res.status, await res.text());
      return json(502, { error: "Couldn't send right now. Please email me directly." });
    }
  } catch (err) {
    console.error('[contact] Resend request failed', err);
    return json(502, { error: "Couldn't send right now. Please email me directly." });
  }

  return json(200, { ok: true });
}
