import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, login } = useAuthStore()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const updatedUser = { ...user, full_name: form.fullName, email: form.email, phone: form.phone }
      // In a real app we'd call an API here. For now update store.
      login(updatedUser, localStorage.getItem('auth_token') || '', localStorage.getItem('refresh_token') || '')
      toast.success('Profile updated successfully')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8',
    borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', background: '#f8fafc',
    outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px',
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a2744' }}>Profile Settings</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>Manage your account information and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Profile Form */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#b8952a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              {(form.fullName || user?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>{form.fullName}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#888', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" style={inputStyle} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Phone Number</label>
              <input style={inputStyle} placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
              Save Changes
            </button>
          </form>
        </div>

        {/* Security & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '800', color: '#1a1a1a' }}>Security</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#666', lineHeight: 1.5 }}>Keep your account secure by using a strong password. Change it regularly.</p>
            <button onClick={() => navigate('/app/change-password')} style={{ width: '100%', padding: '12px', background: '#f8fafc', color: '#1a2744', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
              Change Password
            </button>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '800', color: '#1a1a1a' }}>Preferences</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Email Notifications</span>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>SMS Alerts</span>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
