import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8',
    borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', background: '#f0f4ff',
    outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Password changed successfully!')
    setIsLoading(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ padding: '16px 20px', background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>Change Password</h2>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{
          background: '#fff', borderRadius: '12px', padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password" style={inputStyle} required
                value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>New Password</label>
              <input
                type="password" style={inputStyle} required
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password" style={inputStyle} required
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={isLoading} style={{
                flex: 1, padding: '13px', background: isLoading ? '#a0b4e8' : '#3b82f6',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer',
              }}>
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} style={{
                flex: 1, padding: '13px', background: 'transparent',
                color: '#3b82f6', border: '1.5px solid #3b82f6', borderRadius: '8px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              }}>
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
