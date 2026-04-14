import { useEffect, useState } from 'react'

/**
 * Toast – notifikace.
 */
export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 350)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  return (
    <div className={`kh-toast ${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button
        onClick={() => { setVisible(false); onClose(); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--kh-text-muted)', marginLeft: 'auto', padding: '0.25rem',
          fontFamily: 'var(--kh-font)', fontSize: '0.9rem'
        }}
        aria-label="Zavřít oznámení"
      >
        ✕
      </button>
    </div>
  )
}
