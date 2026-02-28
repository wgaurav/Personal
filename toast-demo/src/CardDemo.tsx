import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

/* ── Card definitions ─────────────────────────────────────── */
const CARDS = [
  { id: 'a', rotate: -8, x: -240, y: -10 },
  { id: 'b', rotate:  4, x: -120, y:  20 },
  { id: 'c', rotate: -2, x:    0, y:   0 },
  { id: 'd', rotate:  1, x:  120, y:  15 },
  { id: 'e', rotate:  5, x:  240, y:  -5 },
]

const CARD_W = 228
const CARD_H = 288
const FOCUSED_W = 360
const FOCUSED_H = 464

/* Diagonal cascade positions for the 4 non-focused cards when one is focused */
const CLUSTER_OFFSETS = [
  { x: -60, y:   0 },
  { x: -20, y:  20 },
  { x:  20, y:  40 },
  { x:  60, y:  60 },
]
const CLUSTER_BASE_Y = 210

const spring = { type: 'spring' as const, visualDuration: 0.4, bounce: 0.15 }

/* ── Component ────────────────────────────────────────────── */
export default function CardDemo() {
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const toggle = (id: string) =>
    setFocusedId(prev => (prev === id ? null : id))

  return (
    <div
      style={styles.page}
      onClick={() => setFocusedId(null)}
    >
      <Link to="/" style={styles.backLink} onClick={e => e.stopPropagation()}>
        ← All interactions
      </Link>
      {/* ── Card stage ──────────────────────────────────────── */}
      <div
        style={styles.stage}
        onClick={e => e.stopPropagation()}
      >
        {CARDS.map((card, i) => {
          const isFocused    = focusedId === card.id
          const otherFocused = focusedId !== null && !isFocused

          /* Assign cluster index among the 4 non-focused cards */
          const clusterIdx = CARDS
            .filter(c => c.id !== focusedId)
            .findIndex(c => c.id === card.id)

          /* Compute target (x, y) in motion's coordinate space.
             Origin is the card's top-left corner starting at (50%, 50%)
             so we subtract half-dimensions to center each card. */
          const tx = isFocused
            ? -(FOCUSED_W / 2)
            : otherFocused
              ? CLUSTER_OFFSETS[clusterIdx].x - CARD_W / 2
              : card.x - CARD_W / 2

          const ty = isFocused
            ? -(FOCUSED_H / 2)
            : otherFocused
              ? CLUSTER_BASE_Y + CLUSTER_OFFSETS[clusterIdx].y - CARD_H / 2
              : card.y - CARD_H / 2

          return (
            <motion.div
              key={card.id}
              style={{
                ...styles.card,
                zIndex: isFocused ? 10 : i + 1,
              }}
              initial={false}
              animate={{
                x:      tx,
                y:      ty,
                rotate: isFocused ? 0 : otherFocused ? card.rotate * 0.3 : card.rotate,
                scale:  otherFocused ? 0.7 : 1,
                width:  isFocused ? FOCUSED_W : CARD_W,
                height: isFocused ? FOCUSED_H : CARD_H,
              }}
              whileHover={
                !focusedId
                  ? {
                      scale:  1.03,
                      y:      card.y - CARD_H / 2 - 8,
                      zIndex: 20,
                    }
                  : undefined
              }
              transition={spring}
              onClick={e => { e.stopPropagation(); toggle(card.id) }}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ── Styles ───────────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  backLink: {
    position: 'absolute',
    top: 24,
    left: 24,
    fontSize: 13,
    fontWeight: 500,
    color: '#6b7280',
    textDecoration: 'none',
  },
  stage: {
    position: 'relative',
    width:  700,
    height: 600,
  },
  card: {
    position: 'absolute',
    left: '50%',
    top:  '50%',
    background: 'white',
    borderRadius: 16,
    boxShadow: [
      '0 10px 15px -3px rgba(0,0,0,0.10)',
      '0  4px  6px -4px rgba(0,0,0,0.10)',
    ].join(', '),
    cursor: 'pointer',
    willChange: 'transform',
  },
}
