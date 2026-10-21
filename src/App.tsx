import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { profile, sections, type SectionId } from './data';
import { Close, Download, MailIcon, Menu, Share } from './components/Icons';
import { Brand, Sidebar } from './components/Sidebar';
import { Button, LinkButton, ToastProvider, useToast } from './components/ui';
import { Blog } from './sections/Blog';
import { Contact } from './sections/Contact';
import { Home } from './sections/Home';
import { Projects } from './sections/Projects';
import { Work } from './sections/Work';

const ids = sections.map((s) => s.id) as readonly string[];
const fromHash = (): SectionId => {
  const h = window.location.hash.replace(/^#\/?/, '');
  return (ids.includes(h) ? h : 'home') as SectionId;
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </MotionConfig>
  );
}

function Shell() {
  const [section, setSection] = useState<SectionId>(fromHash);
  const [drawer, setDrawer] = useState(false);
  const toast = useToast();

  // Keep the URL in sync so sections are linkable and Back works.
  useEffect(() => {
    const onPop = () => setSection(fromHash());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback(
    (s: SectionId) => {
      setDrawer(false);
      if (s === section) return;
      setSection(s);
      window.history.pushState(null, '', s === 'home' ? window.location.pathname : `#${s}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [section],
  );

  useEffect(() => {
    const label = sections.find((s) => s.id === section)?.label;
    document.title = section === 'home' ? `${profile.name} — ${profile.role}` : `${label} · ${profile.name}`;
  }, [section]);

  // Drawer: close on Escape, lock page scroll while open.
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [drawer]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
    toast('Link copied to clipboard');
  };

  const label = sections.find((s) => s.id === section)?.label ?? 'Home';

  return (
    <div className="app">
      {/* Mobile header */}
      <header className="mobilebar">
        <Brand onClick={() => navigate('home')} />
        <div className="right">
          <span className="badge b-green hide-sm">
            <span className="pulse-dot" aria-hidden="true" />
            Available
          </span>
          <Button icon aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}>
            <Menu size={18} />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              key="scrim"
              className="scrim"
              onClick={() => setDrawer(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              key="drawer"
              className="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: '-110%' }}
              animate={{ x: 0 }}
              exit={{ x: '-110%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              <Sidebar current={section} onNavigate={navigate} idPrefix="m" className="sidebar" />
              <Button
                icon
                aria-label="Close menu"
                onClick={() => setDrawer(false)}
                style={{ position: 'absolute', top: 14, right: 12 }}
                autoFocus
              >
                <Close size={18} />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Sidebar current={section} onNavigate={navigate} idPrefix="d" />

      <main className="main">
        <div className="topbar">
          <div className="crumbs">
            <span className="muted">Portfolio</span>
            <span className="sep">/</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={label}
                className="current"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {label}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="actions">
            <Button icon aria-label="Share this page" onClick={share}>
              <Share size={18} />
            </Button>
            <LinkButton icon href={profile.resumeUrl} download aria-label="Download résumé">
              <Download size={18} />
            </LinkButton>
            <Button onClick={() => navigate('contact')}>
              <motion.span
                style={{ display: 'inline-flex', transformOrigin: '50% 50%' }}
                variants={{ rest: { rotate: 0 }, hover: { rotate: [0, -10, 8, 0], transition: { duration: 0.5 } } }}
              >
                <MailIcon size={18} />
              </motion.span>
              Get in touch
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {section === 'home' && <Home onNavigate={navigate} />}
            {section === 'projects' && <Projects />}
            {section === 'work' && <Work />}
            {section === 'blog' && <Blog />}
            {section === 'contact' && <Contact />}
          </motion.div>
        </AnimatePresence>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>
            Built with care <span className="kbd">v1.0</span>
          </span>
        </footer>
      </main>
    </div>
  );
}
