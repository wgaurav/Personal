import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { DialRoot } from 'dialkit'
import 'dialkit/styles.css'
import { NotificationToast } from './NotificationToast'
import CardDemo from './CardDemo'
import GalleryPage from './GalleryPage'

function ToastDemo() {
  const [replay, setReplay] = useState(0)

  return (
    <div style={styles.page}>
      <DialRoot position="top-right" />
      <Link to="/" style={styles.backLink}>← All interactions</Link>

      <div style={styles.canvas}>
        <NotificationToast replayTrigger={replay} />
      </div>

      <button style={styles.replayBtn} onClick={() => setReplay(n => n + 1)}>
        Replay toast
      </button>

      <p style={styles.hint}>Adjust spring, opacity &amp; offset in the DialKit panel →</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<GalleryPage />} />
        <Route path="/toast"     element={<ToastDemo />}   />
        <Route path="/card-demo" element={<CardDemo />}    />
      </Routes>
    </BrowserRouter>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
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
