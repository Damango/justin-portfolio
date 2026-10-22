import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { projects, statusLabels, type Status } from '../data';
import { ArrowUpRight, Code, Search } from '../components/Icons';
import { LinkButton, NudgeArrow, StatusBadge, fadeUp, stagger } from '../components/ui';

type Filter = Status | 'all';
const filters: Filter[] = ['all', 'live', 'beta', 'progress', 'archived'];

export function Projects() {
  const [status, setStatus] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return projects
      .map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0') }))
      .filter((p) => status === 'all' || p.status === status)
      .filter((p) => !ql || `${p.name} ${p.blurb} ${p.stack.join(' ')}`.toLowerCase().includes(ql));
  }, [status, q]);

  return (
    <motion.div className="section" initial="hidden" animate="show" variants={stagger(0.06)}>
      <motion.div className="section-head" variants={fadeUp}>
        <h2>Projects</h2>
        <p>Things I've designed, built and shipped — products, libraries and experiments.</p>
      </motion.div>

      <motion.div className="toolbar" variants={fadeUp}>
        <LayoutGroup id="filters">
          <div className="segmented" role="group" aria-label="Filter by status">
            {filters.map((f) => {
              const on = status === f;
              const count = f === 'all' ? projects.length : projects.filter((p) => p.status === f).length;
              return (
                <motion.button
                  key={f}
                  type="button"
                  className={`pill${on ? ' on' : ''}`}
                  aria-pressed={on}
                  onClick={() => setStatus(f)}
                  whileTap={{ scale: 0.96 }}
                >
                  {on && (
                    <motion.span
                      layoutId="filter-pill"
                      className="pill-bg"
                      transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    />
                  )}
                  <span>{statusLabels[f]}</span>
                  <span className="kbd">{count}</span>
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>
        <div className="search">
          <Search size={17} />
          <label htmlFor="proj-q" className="sr-only">
            Search projects
          </label>
          <input
            id="proj-q"
            className="field"
            type="search"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div className="proj-grid" layout>
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.article
              key={p.name}
              layout
              className="card card-lift proj-card"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24, delay: 0.1 + i * 0.05 } }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.16 } }}
              whileHover={{ y: -4 }}
            >
              <div className="proj-card-top">
                <motion.div
                  className="big-tile"
                  style={{ background: p.tile[0], boxShadow: `0 4px 0 0px ${p.tile[1]}, 0 4px 0 1.5px #26262b` }}
                  whileHover={{ rotate: -8, y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {p.num}
                </motion.div>
                <StatusBadge status={p.status} />
              </div>
              <div style={{ flex: 1 }}>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
              </div>
              <div className="proj-meta">
                <div className="stack">
                  {p.stack.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mono" style={{ fontSize: 13, color: 'var(--muted-2)' }}>
                  {p.year}
                </span>
              </div>
              {(p.caseStudy || p.source || p.live) && (
                <div className="proj-actions">
                  {p.caseStudy && (
                    <LinkButton href={p.caseStudy} style={{ flex: 1 }}>
                      Case study
                    </LinkButton>
                  )}
                  {p.source && (
                    <LinkButton href={p.source} target="_blank" rel="noreferrer" icon aria-label={`${p.name} source code`}>
                      <Code size={17} />
                    </LinkButton>
                  )}
                  {p.live && (
                    <LinkButton
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      variant="go"
                      style={{ flex: 1 }}
                      aria-label={`Visit ${p.name} (opens in a new tab)`}
                    >
                      Visit
                      <NudgeArrow>
                        <ArrowUpRight size={17} />
                      </NudgeArrow>
                    </LinkButton>
                  )}
                </div>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {list.length === 0 && (
          <motion.div className="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            No projects match that search.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
