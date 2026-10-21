import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { posts, profile, projects, sections, type SectionId } from '../data';
import { BriefcaseIcon, CheckCircle, Download, GridIcon, HomeIcon, MailIcon, PenIcon } from './Icons';
import { LinkButton } from './ui';

const icons: Record<SectionId, ReactNode> = {
  home: <HomeIcon />,
  projects: <GridIcon />,
  work: <BriefcaseIcon />,
  blog: <PenIcon />,
  contact: <MailIcon />,
};

const counts: Partial<Record<SectionId, number>> = {
  projects: projects.length,
  blog: posts.length,
};

export function Brand({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      className="brand"
      onClick={onClick}
      aria-label={`${profile.name} — home`}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        className="brand-mark"
        variants={{ hover: { rotate: -8, y: -1 } }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      >
        {profile.initial}
      </motion.span>
      <span className="brand-name">{profile.name}</span>
    </motion.button>
  );
}

type Props = {
  current: SectionId;
  onNavigate: (s: SectionId) => void;
  idPrefix: string;
  className?: string;
};

export function Sidebar({ current, onNavigate, idPrefix, className = 'sidebar' }: Props) {
  const [hovered, setHovered] = useState<SectionId | null>(null);

  return (
    <aside className={className}>
      <Brand onClick={() => onNavigate('home')} />

      <nav aria-label="Main" className="nav-list" onMouseLeave={() => setHovered(null)}>
        {sections.map((s, i) => {
          const on = current === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              className={`nav${on ? ' on' : ''}`}
              aria-current={on ? 'page' : undefined}
              onClick={() => onNavigate(s.id)}
              onMouseEnter={() => setHovered(s.id)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04, type: 'spring', stiffness: 300, damping: 26 }}
              whileTap={{ scale: 0.98 }}
            >
              {hovered === s.id && !on && (
                <motion.span
                  layoutId={`${idPrefix}-nav-hover`}
                  className="nav-hover"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              {on && (
                <motion.span
                  layoutId={`${idPrefix}-nav-pill`}
                  className="nav-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <motion.span
                style={{ display: 'inline-flex' }}
                animate={on ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                {icons[s.id]}
              </motion.span>
              <span style={{ flex: 1 }}>{s.label}</span>
              {counts[s.id] !== undefined && <span className="kbd">{counts[s.id]}</span>}
            </motion.button>
          );
        })}
      </nav>

      <motion.div
        className="status-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 220, damping: 24 }}
      >
        <span className="badge b-green" style={{ alignSelf: 'flex-start' }}>
          <CheckCircle size={15} />
          Open to new roles
        </span>
        <p>{profile.availability}</p>
        <LinkButton href={profile.resumeUrl} download style={{ width: '100%' }}>
          <motion.span
            style={{ display: 'inline-flex' }}
            variants={{ rest: { y: 0 }, hover: { y: [0, 3, 0], transition: { duration: 0.5 } } }}
          >
            <Download size={17} />
          </motion.span>
          Download résumé
        </LinkButton>
      </motion.div>
    </aside>
  );
}
