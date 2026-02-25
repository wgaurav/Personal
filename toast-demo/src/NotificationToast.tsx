/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after trigger.
 *
 *    0ms   toast enters — slides down from above, fades in
 *  150ms   icon pops in with a snappy spring
 * 3000ms   toast fades out and slides back up
 * ───────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useDialKit } from 'dialkit'

/* ── Timing ───────────────────────────────────────────────── */
const TIMING = {
  iconPop:    150,   // icon scales in after toast appears
  autoDismiss: 3000, // ms until toast slides back out
}

/* ── Toast config ─────────────────────────────────────────── */
const TOAST = {
  initialScale: 0.88,  // icon scale before it pops in
  finalScale:   1.0,   // icon resting scale
  iconSpring: { type: 'spring' as const, stiffness: 500, damping: 25 },
}

/* ── Component ────────────────────────────────────────────── */
export function NotificationToast({ replayTrigger = 0 }: { replayTrigger?: number }) {
  const [stage, setStage]     = useState(0)
  const [visible, setVisible] = useState(true)

  /* DialKit panel — spring, opacity, offsetY */
  const params = useDialKit('Toast', {
    spring: {
      type: 'spring' as const,
      visualDuration: 0.45,
      bounce: 0.35,
    },
    opacity:  [1,  0, 1],
    offsetY:  [-56, -120, 0],
    replay: { type: 'action' as const },
  }, {
    onAction: (action: string) => {
      if (action === 'replay') {
        setStage(0)
        setVisible(false)
        setTimeout(() => { setVisible(true); setStage(0) }, 80)
      }
    },
  })

  useEffect(() => {
    setStage(0)
    setVisible(true)
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setStage(1), TIMING.iconPop))
    timers.push(setTimeout(() => setVisible(false), TIMING.autoDismiss))

    return () => timers.forEach(clearTimeout)
  }, [replayTrigger])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: params.offsetY }}
          animate={{ opacity: params.opacity, y: 0 }}
          exit={{ opacity: 0, y: params.offsetY }}
          transition={params.spring}
          style={styles.toast}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: TOAST.initialScale, opacity: 0 }}
            animate={{
              scale:   stage >= 1 ? TOAST.finalScale : TOAST.initialScale,
              opacity: stage >= 1 ? 1 : 0,
            }}
            transition={TOAST.iconSpring}
            style={styles.iconWrap}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#22c55e" />
              <path
                d="M6 10.5l2.5 2.5 5.5-5.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Text */}
          <div style={styles.textWrap}>
            <p style={styles.title}>Payment successful</p>
            <p style={styles.body}>Your order has been confirmed.</p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setVisible(false)}
            style={styles.close}
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Styles ───────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
    width: 320,
    willChange: 'transform, opacity',
    cursor: 'default',
    userSelect: 'none',
  },
  iconWrap: {
    flexShrink: 0,
    lineHeight: 0,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.3,
  },
  body: {
    margin: '2px 0 0',
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  close: {
    flexShrink: 0,
    background: 'none',
    border: 'none',
    padding: 4,
    cursor: 'pointer',
    lineHeight: 0,
    borderRadius: 4,
  },
}
