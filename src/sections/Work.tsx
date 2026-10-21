import { motion } from 'framer-motion';
import { jobs, profile } from '../data';
import { BriefcaseIcon, CheckCircle, Clock, Download, Pin } from '../components/Icons';
import { LinkButton, fadeUp, stagger } from '../components/ui';

export function Work() {
  return (
    <motion.div className="section" initial="hidden" animate="show" variants={stagger(0.07)}>
      <motion.div className="row-head" variants={fadeUp}>
        <div className="section-head">
          <h2>Work History</h2>
          <p>Where I've worked, what I owned, and what shipped because of it.</p>
        </div>
        <LinkButton href={profile.resumeUrl} download>
          <Download size={17} />
          Résumé PDF
        </LinkButton>
      </motion.div>

      <motion.div className="table" variants={fadeUp}>
        <div className="table-scroll">
          <div className="thead cols-work">
            <span>
              <BriefcaseIcon size={16} />
              Role
            </span>
            <span>
              <Clock size={16} />
              Dates
            </span>
            <span>
              <Pin size={16} />
              Location
            </span>
            <span>
              <CheckCircle size={16} />
              Status
            </span>
          </div>
          <motion.div variants={stagger(0.09, 0.1)}>
            {jobs.map((j) => (
              <motion.div key={j.role + j.dates} className="trow cols-work job-row" variants={fadeUp}>
                <div className="job-main">
                  <motion.div
                    className="job-mark"
                    whileHover={{ rotate: -6, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                  >
                    {j.mark}
                  </motion.div>
                  <div style={{ minWidth: 0 }}>
                    <div className="job-role">{j.role}</div>
                    <div className="job-co">{j.company}</div>
                    <ul className="job-notes">
                      {j.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mono" style={{ paddingTop: 4, color: 'var(--ink)' }}>
                  {j.dates}
                </div>
                <div>
                  <span className="chip">{j.location}</span>
                </div>
                <div>
                  {j.current ? (
                    <span className="badge b-green">
                      <span className="pulse-dot" aria-hidden="true" />
                      Current
                    </span>
                  ) : (
                    <span className="badge b-gray">Past</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
