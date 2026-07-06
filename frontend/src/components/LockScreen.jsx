import { useState } from 'react'
import { loginSite } from '../services/api'

export default function LockScreen({ onUnlocked }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUnlock = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Please enter your passkey.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await loginSite(password)
      if (res.success) {
        onUnlocked()
      } else {
        setError(res.message || 'Invalid passkey. Access denied.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid passkey. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lock-screen-overlay">
      <div className="lock-screen-card">
        <div className="lock-screen-emblem">
          <span className="lock-icon">🔒</span>
        </div>
        <h1 className="lock-screen-title">Confidential Desk Ledger</h1>
        <p className="lock-screen-subtitle">
          This archival notes suite is securely locked. Enter your executive passkey to open your ledger sheet archives.
        </p>

        <form onSubmit={handleUnlock} className="lock-screen-form">
          <div className="lock-field">
            <label htmlFor="desk-passkey">Desk Passkey</label>
            <input
              id="desk-passkey"
              type="password"
              className="lock-input"
              placeholder="Enter confidential passkey..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          {error && <div className="lock-error" role="alert">{error}</div>}

          <button
            type="submit"
            className="btn-save lock-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Unlocking Vault...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Unlock Desk Ledger
              </>
            )}
          </button>
        </form>

        <div className="lock-screen-footer">
          <p>Inkwell Notes Suite &bull; Private Executive Edition</p>
        </div>
      </div>
    </div>
  )
}
