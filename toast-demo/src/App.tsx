import { useState } from 'react'
import { DialRoot } from 'dialkit'
import 'dialkit/styles.css'
import { NotificationToast } from './NotificationToast'

export default function App() {
  const [replay, setReplay] = useState(0)

  return (
    <div style={styles.page}>
      {/* DialKit panel — top-right corner */}
      <DialRoot position="top-right" />

      {/* Demo canvas */}
      <div style={styles.canvas}>
        <NotificationToast replayTrigger={replay} />
      </div>

      {/* Replay button */}
      <button style={styles.replayBtn} onClick={() => setReplay(n => n + 1)}>
        Replay toast
      </button>

      <p style={styles.hint}>Adjust spring, opacity &amp; offset in the DialKit panel →</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    background: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  canvas: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 80,
    paddingTop: 24,
  },
  replayBtn: {
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    background: '#6366f1',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  hint: {
    fontSize: 13,
    color: '#9ca3af',
    margin: 0,
  },
}
