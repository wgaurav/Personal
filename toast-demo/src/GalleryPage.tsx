import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Gallery entrance
 *
 *    0ms   page mounts
 *  120ms   heading fades up + slides in
 *  380ms   card[0] slides up  (Toast Notification)
 *  460ms   card[1] slides up  (Card Fan)   ← +80ms stagger
 *  …each new interaction stacks at +80ms
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  heading:     0.12,   // s
  firstCard:   0.38,
  cardStagger: 0.08,
}

const SPRING      = { type: 'spring', visualDuration: 0.5, bounce: 0.2 } as const
const SPRING_FAST = { type: 'spring', visualDuration: 0.3, bounce: 0.1 } as const

/* ─────────────────────────────────────────────────────────
 * INTERACTIONS REGISTRY
 * Add one entry here for every new interaction. That's it.
 * ───────────────────────────────────────────────────────── */
const INTERACTIONS = [
  {
    id:          'toast',
    title:       'Toast Notification',
    description: 'Spring-animated toast with DialKit-tunable spring physics and vertical offset.',
    path:        '/toast',
    accent:      '#6366f1',
  },
  {
    id:          'card-fan',
    title:       'Card Fan',
    description: 'Five cards in a fanned spread — click to focus, the rest cluster into a neat stack.',
    path:        '/card-demo',
    accent:      '#f59e0b',
  },
]

/* ── Variants ──────────────────────────────────────────── */

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...SPRING, delay: TIMING.firstCard + i * TIMING.cardStagger },
  }),
  hover: {
    y: -6,
    backgroundColor: '#18182a',
    boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
  },
}

const arrowVariants = {
  visible: { x: 0, opacity: 0.35 },
  hover:   { x: 6, opacity: 1    },
}

/* ── Component ─────────────────────────────────────────── */

export default function GalleryPage() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      {/* ── Heading ── */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: TIMING.heading }}
      >
        <h1 style={styles.heading}>Interactions</h1>
        <p style={styles.tagline}>A growing collection of polished UI interactions.</p>
      </motion.div>

      {/* ── Grid ── */}
      <div style={styles.grid}>
        {INTERACTIONS.map((item, i) => (
          <motion.div
            key={item.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={SPRING_FAST}
            style={styles.card}
            onClick={() => navigate(item.path)}
          >
            {/* Accent bar */}
            <div style={{ ...styles.accentBar, background: item.accent }} />

            {/* Index */}
            <span style={styles.index}>{String(i + 1).padStart(2, '0')}</span>

            {/* Content */}
            <h2 style={styles.title}>{item.title}</h2>
            <p style={styles.description}>{item.description}</p>

            {/* Arrow */}
            <motion.span
              variants={arrowVariants}
              transition={SPRING_FAST}
              style={styles.arrow}
            >
              →
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── Styles ───────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    padding: '80px 40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: 'border-box',
  },
  header: {
    maxWidth: 640,
    margin: '0 auto 56px',
    textAlign: 'center',
  },
  heading: {
    margin: '0 0 12px',
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: '-0.03em',
    color: '#ffffff',
  },
  tagline: {
    margin: 0,
    fontSize: 16,
    color: '#6b7280',
    letterSpacing: '-0.01em',
  },
  grid: {
    maxWidth: 720,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  card: {
    position: 'relative',
    backgroundColor: '#13131a',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '28px 28px 24px',
    cursor: 'pointer',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  index: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#374151',
  },
  title: {
    margin: '4px 0 0',
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: '#f9fafb',
  },
  description: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: '#6b7280',
  },
  arrow: {
    marginTop: 8,
    fontSize: 18,
    display: 'inline-block',
    color: '#9ca3af',
  },
}
