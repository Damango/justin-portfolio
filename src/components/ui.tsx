import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import type { Status } from '../data';
import { Archive, Bell, CheckCircle, Spinner } from './Icons';

export const spring = { type: 'spring', stiffness: 520, damping: 32 } as const;
export const softSpring = { type: 'spring', stiffness: 260, damping: 28 } as const;

type Variant = 'go' | 'soft' | undefined;
type Size = 'lg' | 'sm' | undefined;

function cls(variant: Variant, size: Size, icon?: boolean, extra?: string) {
  return ['btn', variant && `btn-${variant}`, size && `btn-${size}`, icon && 'ibtn', extra].filter(Boolean).join(' ');
}

// Variant labels (not objects) so children like <NudgeArrow> react to the parent's hover.
const press = {
  variants: { rest: { y: 0, scale: 1 }, hover: { y: -1, scale: 1 }, tap: { y: 2, scale: 0.985 } },
  initial: 'rest',
  whileHover: 'hover',
  whileTap: 'tap',
  transition: spring,
} as const;

type ButtonProps = HTMLMotionProps<'button'> & { variant?: Variant; size?: Size; icon?: boolean };

export function Button({ variant, size, icon, className, type = 'button', ...rest }: ButtonProps) {
  return <motion.button type={type} className={cls(variant, size, icon, className)} {...press} {...rest} />;
}

type LinkProps = HTMLMotionProps<'a'> & { variant?: Variant; size?: Size; icon?: boolean };

export function LinkButton({ variant, size, icon, className, ...rest }: LinkProps) {
  return <motion.a className={cls(variant, size, icon, className)} {...press} {...rest} />;
}

/** Arrow that nudges forward when its parent button is hovered. */
export function NudgeArrow({ children }: { children: ReactNode }) {
  return (
    <motion.span
      style={{ display: 'inline-flex' }}
      variants={{ rest: { x: 0 }, hover: { x: 3 } }}
      transition={spring}
    >
      {children}
    </motion.span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const map = {
    live: { c: 'b-green', icon: <CheckCircle size={14} />, label: 'Live' },
    beta: { c: 'b-blue', icon: <Spinner size={14} />, label: 'Beta' },
    progress: { c: 'b-amber', icon: <Bell size={14} />, label: 'In progress' },
    archived: { c: 'b-gray', icon: <Archive size={14} />, label: 'Archived' },
  }[status];
  return (
    <span className={`badge ${map.c}`}>
      {status === 'beta' ? (
        <motion.span
          style={{ display: 'inline-flex' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          {map.icon}
        </motion.span>
      ) : status === 'progress' ? (
        <motion.span
          style={{ display: 'inline-flex', transformOrigin: '50% 10%' }}
          animate={{ rotate: [0, -14, 12, -8, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 3.2 }}
        >
          {map.icon}
        </motion.span>
      ) : (
        map.icon
      )}
      {map.label}
    </span>
  );
}

/* ── Toast ─────────────────────────────────────────────── */
const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2200);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 16, x: '-50%', scale: 0.96 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.98 }}
            transition={softSpring}
          >
            <CheckCircle size={16} />
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </ToastCtx.Provider>
  );
}

/* ── Reveal on scroll ──────────────────────────────────── */
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: softSpring },
};

export const stagger = (gap = 0.06, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
