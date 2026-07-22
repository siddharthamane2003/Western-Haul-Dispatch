import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { tokenManager, apiGet, apiPost } from '@/lib/api'
import toast from 'react-hot-toast'

const LOGO = '/western-haul-logo.jpg'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ fullName: '', username: '', email: '', company: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.username || !form.email || !form.password) {
      toast.error('Please fill all required fields'); return
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match'); return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters'); return
    }
    setIsLoading(true)

    try {
      // Direct registration using the seeded company UUID (seeded inside the DB)
      const companyId = '11a7b195-6b15-48af-8a02-4aa341357a7c'

      // 2. Call register API
      await apiPost('/auth/register', {
        email: form.email,
        username: form.username,
        full_name: form.fullName,
        password: form.password,
        role: 'dispatcher',
        company_id: companyId
      })

      // 3. Authenticate and log in the user immediately
      const authResponse = await apiPost<{ access_token: string; refresh_token: string }>('/auth/login', {
        email: form.email,
        password: form.password,
      })

      const { access_token, refresh_token } = authResponse
      tokenManager.set(access_token)
      tokenManager.setRefresh(refresh_token)

      // Fetch newly registered user detail profile
      const user = await apiGet<any>('/auth/me')
      login(user, access_token, refresh_token)

      toast.success(`Welcome, ${form.fullName}! Account created and logged in.`)
      navigate('/app/dashboard', { replace: true })
    } catch (error: any) {
      // Error handled by interceptor toast
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', color: '#1a1a1a', background: '#fff',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={LOGO} alt="Western Haul Dispatch" style={{ height: '140px', width: '140px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', background: '#fff', padding: '10px' }} />
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '24px', textAlign: 'center' }}>Create your account</h1>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name *', key: 'fullName', type: 'text', placeholder: 'John Smith' },
              { label: 'Username *', key: 'username', type: 'text', placeholder: 'johnsmith' },
              { label: 'Email *', key: 'email', type: 'email', placeholder: 'john@company.com' },
              { label: 'Company Name', key: 'company', type: 'text', placeholder: 'Western Freight LLC' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '5px' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} required={f.label.includes('*')}
                  value={(form as any)[f.key]} onChange={set(f.key as keyof typeof form)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#1a2744')}
                  onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
                />
              </div>
            ))}

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '5px' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" required
                  value={form.password} onChange={set('password')}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => (e.target.style.borderColor = '#1a2744')}
                  onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '5px' }}>Confirm Password *</label>
              <input type="password" placeholder="Repeat password" required
                value={form.confirm} onChange={set('confirm')} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = form.confirm && form.confirm !== form.password ? '#ef4444' : '#1a2744')}
                onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
              />
              {form.confirm && form.password !== form.confirm && (
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} style={{
              width: '100%', padding: '13px', background: isLoading ? '#9ca3af' : '#1a2744',
              color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#b8952a', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#aaa', marginTop: '20px' }}>
          Techno Creators Inc. — Developed with Love 💙
        </p>
      </div>
    </div>
  )
}