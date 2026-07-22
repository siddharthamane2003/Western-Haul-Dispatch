import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { tokenManager, apiPost, apiGet } from '@/lib/api'
import toast from 'react-hot-toast'

const LOGO = '/western-haul-logo.jpg'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) { toast.error('Please enter username and password'); return }
    setIsLoading(true)

    try {
      const response = await apiPost<{ access_token: string; refresh_token: string }>('/auth/login', {
        email: username,
        password: password,
      })

      const { access_token, refresh_token } = response
      tokenManager.set(access_token)
      tokenManager.setRefresh(refresh_token)
      
      // Fetch user profile info since auth/login returns just tokens
      const user = await apiGet<any>('/auth/me')
      
      login(user, access_token, refresh_token)
      toast.success(`Welcome back, ${user.first_name || user.username || 'User'}!`)
      navigate('/app/dashboard', { replace: true })
    } catch (error: any) {
      // The api interceptor will already show a toast for standard errors,
      // but we can catch auth specific errors here if needed.
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', color: '#1a1a1a', background: '#fff', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ background: '#fff', borderRadius: '14px', padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '24px', textAlign: 'center' }}>
            Log in to your account
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Username</label>
              <input id="login-username" type="text" required value={username} onChange={e => setUsername(e.target.value)}
                style={inputStyle} autoComplete="username"
                onFocus={e => (e.target.style.borderColor = '#1a2744')}
                onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Password</label>
              <input id="login-password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                style={inputStyle} autoComplete="current-password"
                onFocus={e => (e.target.style.borderColor = '#1a2744')}
                onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button onClick={() => navigate('/forgot-password')} style={{ background: 'none', border: 'none', padding: 0, fontSize: '12px', color: '#b8952a', textDecoration: 'none', fontWeight: '600', cursor: 'pointer' }}>Forgot password?</button>
            </div>

            <button id="login-submit" type="submit" disabled={isLoading} style={{
              width: '100%', padding: '13px', background: isLoading ? '#9ca3af' : '#1a2744',
              color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
            }}>
              {isLoading ? 'Logging in...' : 'Continue'}
            </button>
          </form>


        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#aaa', marginTop: '20px' }}>
          copyrighted by Techno Creators Inc.<br />Developed with Love and Care 💙
        </p>
      </div>
    </div>
  )
}
