import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent, type ReactNode } from 'react';
import { profile } from '../data';
import { ArrowRight, Check, CheckCircle, Copy, MailIcon } from '../components/Icons';
import { Turnstile, turnstileSiteKey } from '../components/Turnstile';
import { Button, LinkButton, NudgeArrow, fadeUp, stagger, useToast } from '../components/ui';

type Errors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

// Keep in sync with LIMITS in api/contact.ts.
const MAX = { name: 100, email: 254, subject: 150, message: 5000 };
const empty = { name: '', email: '', subject: '', message: '', website: '' };

export function Contact() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [failure, setFailure] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState(0); // bump to get a fresh Turnstile token

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      /* clipboard can be blocked; still give feedback */
    }
    setCopied(true);
    toast('Email copied to clipboard');
    window.setTimeout(() => setCopied(false), 1800);
  };

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k as keyof Errors]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const fail = (msg: string) => {
    setFailure(msg);
    setState('error');
    toast(msg);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    const next: Errors = {};
    if (!form.name.trim()) next.name = 'Please add your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Please add a valid email.';
    if (!form.subject.trim()) next.subject = "Please say what it's about.";
    if (form.message.trim().length < 10) next.message = 'A sentence or two helps.';
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!turnstileSiteKey) return fail(`The form isn't set up yet. Please email ${profile.email}.`);
    if (!token) return fail('Still checking you’re not a bot. Try again in a second.');

    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken: token }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        fail(data.error ?? `Couldn't send. Please email ${profile.email}.`);
      } else {
        setState('sent');
        setForm(empty);
      }
    } catch {
      fail(`Couldn't send. Please email ${profile.email}.`);
    } finally {
      // Tokens are single-use, so always fetch a fresh one.
      setToken(null);
      setCaptcha((n) => n + 1);
    }
  };

  return (
    <motion.div className="section contact" initial="hidden" animate="show" variants={stagger(0.08)}>
      <motion.div className="contact-copy" variants={stagger(0.08)}>
        <motion.h2 className="contact-title" variants={fadeUp}>
          Let's build
          <br />
          something.
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--muted)', maxWidth: '28em' }}>
          Have a role, a project, or a gnarly problem? Send a note — I read every message.
        </motion.p>
        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="email-row">
            <MailIcon size={18} />
            <span>{profile.email}</span>
            <Button size="sm" onClick={copy} aria-label="Copy email address" style={{ minWidth: 92 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'ok' : 'copy'}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                >
                  {copied ? <Check size={15} style={{ color: '#157a3a' }} /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy'}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
          <div className="links">
            {profile.github && (
              <LinkButton href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </LinkButton>
            )}
            {profile.linkedin && (
              <LinkButton href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </LinkButton>
            )}
            <LinkButton href={profile.resumeUrl} download>
              Résumé
            </LinkButton>
          </div>
        </motion.div>
      </motion.div>

      <motion.form className="form" onSubmit={submit} noValidate variants={fadeUp}>
        <div className="form-row">
          <Field id="c-name" label="Name" error={errors.name}>
            <input id="c-name" className="field" type="text" placeholder="Ada Lovelace" autoComplete="name" maxLength={MAX.name} value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-err' : undefined} />
          </Field>
          <Field id="c-email" label="Email" error={errors.email}>
            <input id="c-email" className="field" type="email" placeholder="ada@company.com" autoComplete="email" maxLength={MAX.email} value={form.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'c-email-err' : undefined} />
          </Field>
        </div>
        <Field id="c-subject" label="What's it about?" error={errors.subject}>
          <input id="c-subject" className="field" type="text" placeholder="A role, a project, or just saying hi" maxLength={MAX.subject} value={form.subject} onChange={set('subject')} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'c-subject-err' : undefined} />
        </Field>
        <Field id="c-msg" label="Message" error={errors.message}>
          <textarea id="c-msg" className="field" rows={5} placeholder="Tell me a little about what you're working on." maxLength={MAX.message} value={form.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-msg-err' : undefined} />
        </Field>

        {/* Honeypot: hidden from people and screen readers; bots that fill it get silently dropped. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}>
          <label htmlFor="c-website">Website (leave this empty)</label>
          <input id="c-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
        </div>

        {turnstileSiteKey && <Turnstile key={captcha} siteKey={turnstileSiteKey} onToken={setToken} />}

        <div className="form-foot">
          <AnimatePresence mode="wait" initial={false}>
            {state === 'sent' ? (
              <motion.span
                key="sent"
                className="badge b-green"
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <CheckCircle size={14} />
                Message sent — talk soon
              </motion.span>
            ) : state === 'error' ? (
              <motion.span
                key="error"
                className="badge b-red"
                role="alert"
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                style={{ whiteSpace: 'normal', lineHeight: 1.35 }}
              >
                {failure}
              </motion.span>
            ) : (
              <motion.span key="note" className="note" exit={{ opacity: 0 }}>
                {profile.replyTime}
              </motion.span>
            )}
          </AnimatePresence>
          <Button type="submit" variant="go" size="lg" disabled={state === 'sending'}>
            {state === 'sending' ? (
              <>
                <motion.span
                  style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', display: 'inline-block' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                />
                Sending…
              </>
            ) : (
              <>
                Send message
                <NudgeArrow>
                  <ArrowRight size={18} />
                </NudgeArrow>
              </>
            )}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <motion.div
      className="form-field"
      animate={error ? { x: [0, -6, 5, -3, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <label htmlFor={id}>{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            id={`${id}-err`}
            className="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
