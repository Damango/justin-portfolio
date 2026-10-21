import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { keys, tones, type SectionId } from '../data';
import { Pointer } from './Icons';

const OUTLINE = '#26262b';

/** Stacked box-shadows that fake an isometric extrusion of depth `d`. */
function extrude(d: number, side: string) {
  const fill: string[] = [];
  const edge: string[] = [];
  const n = 8;
  for (let i = 1; i <= n; i++) {
    const k = ((d * i) / n).toFixed(2);
    fill.push(`${k}px ${k}px 0px 0px ${side}`);
    edge.push(`${k}px ${k}px 0px 1.5px ${OUTLINE}`);
  }
  return fill.concat(edge).join(', ');
}

const BASE_SHADOW = extrude(18, '#dcdce1');
const KNOB_SHADOW = extrude(14, '#dcdce1');
const keySpring = { type: 'spring', stiffness: 700, damping: 30, mass: 0.6 } as const;

const IDLE = {
  name: 'Hover the keys',
  tag: 'Ready',
  badge: 'b-gray',
  line: 'Each key is part of my stack — press one to see where I use it.',
  glyph: '{ }',
  top: '#ffffff',
  side: '#cfcfd5',
};

export function KeyboardStage({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const touched = useRef(false);

  // Fit the 3D keyboard to whatever size the stage is.
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 640, h: 540 });
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.max(0.42, Math.min(1, size.w / 570, (size.h - 150) / 300));
  const roomy = size.w >= 520;

  // Subtle parallax tilt that follows the mouse.
  const rx = useMotionValue(58);
  const rz = useMotionValue(45);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 18 });
  const rotateZ = useSpring(rz, { stiffness: 120, damping: 18 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    rz.set(45 + nx * 7);
    rx.set(58 - ny * 7);
  };
  const onLeave = () => {
    rz.set(45);
    rx.set(58);
  };

  // A short "typing" intro so visitors notice the keys are alive.
  useEffect(() => {
    if (reduce) return;
    const seq = ['ts', 'go', 'rs', 'py', 'k8s', 'aws', 'gql', 'sql'];
    const timers = seq.map((id, i) =>
      window.setTimeout(() => {
        if (!touched.current) setActive(id);
      }, 900 + i * 130),
    );
    timers.push(
      window.setTimeout(() => {
        if (!touched.current) setActive(null);
      }, 900 + seq.length * 130 + 260),
    );
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  const [canHover] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches);

  const press = (id: string) => {
    touched.current = true;
    setActive(id);
  };

  const idx = keys.findIndex((k) => k.id === active);
  const key = idx >= 0 ? keys[idx] : null;
  const cur = key
    ? { name: key.name, tag: key.tag, badge: tones[key.tone].badge, line: key.line, glyph: key.glyph, top: tones[key.tone].top, side: tones[key.tone].side }
    : canHover
      ? IDLE
      : { ...IDLE, name: 'Tap the keys', line: 'Each key is part of my stack — tap one to see where I use it.' };
  const pos = String(idx + 1).padStart(2, '0');

  const bars = Array.from({ length: 18 }, (_, i) => ({
    h: idx < 0 ? 6 + (i % 3) * 3 : 10 + ((i * 29 + (idx + 3) * 47) % 54),
    c: i < 10 ? '#f08a4b' : '#7ad874',
  }));

  return (
    <div className="stage" ref={stageRef} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="stage-dots" aria-hidden="true" />

      <motion.div
        className="chip stage-hint"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          style={{ display: 'inline-flex' }}
          animate={reduce ? undefined : { x: [0, 3, 0], y: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Pointer size={15} />
        </motion.span>
        {canHover ? "Hover the keys — it's my stack" : "Tap the keys — it's my stack"}
      </motion.div>

      {roomy && (
        <svg
          width="230"
          height="140"
          viewBox="0 0 230 140"
          fill="none"
          aria-hidden="true"
          style={{ position: 'absolute', right: 112, top: 182 }}
        >
          <path className="marching" d="M220 0 V40 L8 136" stroke="#9c9ca4" strokeWidth="1.5" strokeDasharray="5 5" />
        </svg>
      )}

      {/* Keyboard */}
      <div className="kb-anchor">
        <motion.div
          className="kb-scale"
          initial={{ opacity: 0, y: 40, scale: scale * 0.94 }}
          animate={{ opacity: 1, y: 0, scale }}
          transition={{ type: 'spring', stiffness: 140, damping: 20, delay: 0.15 }}
        >
          <motion.div className="plane" style={{ rotateX, rotateZ, boxShadow: BASE_SHADOW }}>
            {keys.map((k) => {
              const on = active === k.id;
              const hire = k.tone === 'green';
              const face = hire ? (on ? '#8fe489' : '#7ad874') : on ? tones[k.tone].light : '#ffffff';
              const side = hire ? '#43a03e' : '#d7d7dd';
              return (
                <motion.button
                  key={k.id}
                  type="button"
                  className="key"
                  aria-label={k.action ? `${k.name} — go to ${k.action}` : k.name}
                  style={{ left: k.x, top: k.y, width: k.w, height: k.h }}
                  initial={false}
                  animate={{
                    x: on ? 7 : 0,
                    y: on ? 7 : 0,
                    boxShadow: extrude(on ? 3 : 10, side),
                    backgroundColor: face,
                  }}
                  transition={keySpring}
                  onHoverStart={() => press(k.id)}
                  onFocus={() => press(k.id)}
                  onTapStart={() => press(k.id)}
                  onClick={() => k.action && onNavigate(k.action)}
                >
                  {k.label}
                </motion.button>
              );
            })}

            <div className="knob" aria-hidden="true" style={{ boxShadow: KNOB_SHADOW }}>
              <motion.div
                className="knob-hand"
                animate={{ rotate: idx < 0 ? -135 : -135 + idx * 30 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              />
            </div>

            <div className="leds" aria-hidden="true">
              <motion.div className="led" animate={{ backgroundColor: idx < 0 ? '#cfcfd4' : '#7ad874' }} />
              <div className="led" style={{ background: '#f6b26b' }} />
              <div className="led blink" style={{ background: '#8ab8ff' }} />
            </div>
            <div className="serial" aria-hidden="true">
              JST-26
            </div>

            <div className="screen" aria-hidden="true">
              <div className="bars">
                {bars.map((b, i) => (
                  <motion.div
                    key={i}
                    style={{ background: b.c }}
                    initial={false}
                    animate={{ height: b.h }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: i * 0.012 }}
                  />
                ))}
              </div>
              <div className="dots">
                {keys.map((_, j) => (
                  <div key={j} style={{ background: j === idx ? '#7ad874' : j < idx ? '#3f6f3c' : '#3a3a41' }} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Selected tile, design-tool style */}
      {roomy && (
        <motion.div
          className="tile"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, ...{ type: 'spring', stiffness: 220, damping: 20 } }}
        >
          <div className="handle" style={{ left: -5, top: -5 }} />
          <div className="handle" style={{ right: -5, top: -5 }} />
          <div className="handle" style={{ left: -5, bottom: -5 }} />
          <div className="handle" style={{ right: -5, bottom: -5 }} />
          <motion.div
            style={{ position: 'absolute', inset: 0 }}
            animate={reduce ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={cur.glyph + cur.name}
                style={{ position: 'absolute', inset: 0 }}
                initial={{ opacity: 0, y: -22, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
              >
                <div className="tile-block" style={{ background: cur.top, boxShadow: extrude(14, cur.side) }}>
                  {cur.glyph}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <motion.div className="tile-label" layout transition={{ type: 'spring', stiffness: 500, damping: 34 }}>
            {cur.name}
          </motion.div>
          <motion.svg
            key={active ?? 'idle'}
            className="cursor"
            width="30"
            height="34"
            viewBox="0 0 30 34"
            initial={{ x: -10, y: -10, scale: 0.9 }}
            animate={{ x: 0, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
          >
            <path d="M3 2 L26 18 L15.5 20 L10 31 Z" fill="#fff" stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>
      )}

      {/* Readout */}
      <motion.div
        className="readout"
        aria-live="polite"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 200, damping: 22 }}
      >
        <motion.div
          className="readout-swatch"
          animate={{ backgroundColor: cur.top, boxShadow: `0 3px 0 0px ${cur.side}, 0 3px 0 1.5px ${OUTLINE}` }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={cur.glyph}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.12 }}
            >
              {cur.glyph}
            </motion.span>
          </AnimatePresence>
        </motion.div>
        <div className="readout-body">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cur.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.14 }}
            >
              <div className="readout-title">
                <span>{cur.name}</span>
                <span className={`badge badge-sm ${cur.badge}`}>{cur.tag}</span>
              </div>
              <div className="readout-line">{cur.line}</div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="readout-count" aria-hidden="true">
          <span className="kbd">{idx < 0 ? '00' : pos}</span>
          <span className="kbd">/</span>
          <span className="kbd">{String(keys.length).padStart(2, '0')}</span>
        </div>
      </motion.div>
    </div>
  );
}
