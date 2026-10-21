import { motion } from 'framer-motion';
import { now, profile, projects, type SectionId } from '../data';
import { ArrowRight, ArrowUpRight, Bell, Book, CheckCircle, Clock, Code, GridIcon, Pin, Spinner } from '../components/Icons';
import { KeyboardStage } from '../components/KeyboardStage';
import { Button, NudgeArrow, StatusBadge, fadeUp, stagger } from '../components/ui';

const nowIcon = { Building: <Spinner size={14} />, Learning: <Bell size={14} />, Reading: <Book size={14} /> };
const toneBadge = { blue: 'b-blue', amber: 'b-amber', gray: 'b-gray' };

const lineReveal = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { type: 'spring', stiffness: 160, damping: 22 } },
} as const;

export function Home({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  return (
    <div className="section" style={{ gap: 48 }}>
      <section className="hero" aria-labelledby="hero-title">
        <motion.div className="hero-copy" initial="hidden" animate="show" variants={stagger(0.08)}>
          <motion.div className="tags" variants={fadeUp}>
            <span className="badge b-green">
              <span className="pulse-dot" aria-hidden="true" />
              Available
            </span>
            <span className="chip">
              <Pin size={14} />
              {profile.city}
            </span>
            <span className="chip">{profile.timezone}</span>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <motion.h1 id="hero-title" className="hero-title" variants={stagger(0.12, 0.05)}>
              <span className="line">
                <motion.span variants={lineReveal}>Clean code.</motion.span>
              </span>
              <span className="line">
                <motion.span variants={lineReveal}>Zero friction.</motion.span>
              </span>
            </motion.h1>
            <motion.p className="hero-lede" variants={fadeUp}>
              I'm {profile.name} — a software engineer who builds fast, reliable products end to end, from the database to the
              last pixel.
            </motion.p>
            <motion.div className="hero-ctas" variants={fadeUp}>
              <Button variant="go" size="lg" onClick={() => onNavigate('projects')}>
                View projects
                <NudgeArrow>
                  <ArrowRight size={18} />
                </NudgeArrow>
              </Button>
              <Button variant="soft" size="lg" onClick={() => onNavigate('contact')}>
                Get in touch
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <KeyboardStage onNavigate={onNavigate} />
      </section>

      <motion.section
        className="now-grid"
        aria-label="Right now"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger(0.08)}
      >
        {now.map((n) => (
          <motion.div
            key={n.label}
            className="card card-lift now-card"
            variants={fadeUp}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          >
            <span className={`badge ${toneBadge[n.tone]}`}>
              {nowIcon[n.label]}
              {n.label}
            </span>
            {n.text}
          </motion.div>
        ))}
      </motion.section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }} aria-labelledby="selected-title">
        <div className="row-head">
          <div>
            <h2 id="selected-title" className="h2-sm">
              Selected work
            </h2>
            <p className="sub">A few things I'm proud of. The full list lives in Projects.</p>
          </div>
          <Button onClick={() => onNavigate('projects')}>
            All projects
            <NudgeArrow>
              <ArrowUpRight size={16} />
            </NudgeArrow>
          </Button>
        </div>

        <div className="table">
          <div className="table-scroll">
            <div className="thead cols-featured">
              <span>
                <GridIcon size={16} />
                Project
              </span>
              <span>
                <Code size={16} />
                Stack
              </span>
              <span>
                <Clock size={16} />
                Year
              </span>
              <span>
                <CheckCircle size={16} />
                Status
              </span>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger(0.07)}>
              {projects.slice(0, 3).map((p, i) => (
                <motion.div key={p.name} className="trow cols-featured" variants={fadeUp}>
                  <div className="proj-cell">
                    <motion.div
                      className="mini-tile"
                      style={{ background: p.tile[0] }}
                      whileHover={{ rotate: -6, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </motion.div>
                    <div style={{ minWidth: 0 }}>
                      <div className="proj-name">{p.name}</div>
                      <div className="proj-blurb">{p.blurb}</div>
                    </div>
                  </div>
                  <div className="stack">
                    {p.stack.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mono">{p.year}</div>
                  <div>
                    <StatusBadge status={p.status} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
