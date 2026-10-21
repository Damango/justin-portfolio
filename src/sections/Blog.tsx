import { motion } from 'framer-motion';
import { posts } from '../data';
import { ArrowRight } from '../components/Icons';
import { fadeUp, stagger } from '../components/ui';

export function Blog() {
  return (
    <motion.div className="section" initial="hidden" animate="show" variants={stagger(0.07)}>
      <motion.div className="section-head" variants={fadeUp}>
        <h2>Blog</h2>
        <p>Notes on building software — bugs, trade-offs and lessons learned the hard way.</p>
      </motion.div>

      <motion.div className="table" variants={stagger(0.07, 0.05)}>
        {posts.map((b) => (
          <motion.a key={b.title} className="post" href={b.href} variants={fadeUp} whileHover="hover">
            <div className="post-date">{b.date}</div>
            <motion.div
              className="post-title"
              variants={{ hidden: { x: 0 }, show: { x: 0 }, hover: { x: 4 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              {b.title}
            </motion.div>
            <div className="post-meta">
              <span className={`badge ${b.badge}`}>{b.tag}</span>
              <span className="chip">{b.mins}</span>
              <motion.span
                style={{ display: 'inline-flex' }}
                variants={{ hidden: { x: 0 }, show: { x: 0 }, hover: { x: 4 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
}
