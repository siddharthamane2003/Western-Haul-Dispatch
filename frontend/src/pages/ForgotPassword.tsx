import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const LOGO = '/western-haul-logo.jpg'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setIsLoading(false)
    toast.success('Reset link sent!')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={LOGO} alt="Logo" style={{ height: '140px', width: '140px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', background: '#fff', padding: '10px' }} />
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📧</div>
              <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>Check Your Email</h2>
              <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <Link to="/login" style={{ display: 'block', padding: '12px', background: '#1a2744', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', textAlign: 'center' }}>
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Forgot Password?</h1>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', lineHeight: 1.5 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Email Address</label>
                  <input type="email" required placeholder="your@company.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => (e.target.style.borderColor = '#1a2744')}
                    onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
                  />
                </div>
                <button type="submit" disabled={isLoading} style={{
                  width: '100%', padding: '13px', background: isLoading ? '#9ca3af' : '#1a2744',
                  color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#666' }}>
                Remember your password?{' '}
                <Link to="/login" style={{ color: '#b8952a', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
