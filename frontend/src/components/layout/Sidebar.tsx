import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useSidebarStore } from '@/store/sidebarStore'

const LOGO = '/western-haul-logo.jpg'

const NAV = [
  { label: 'Dashboard',    href: '/app/dashboard',    icon: '🏠' },
  { label: 'Add Trip',     href: '/app/dispatch/new', icon: '➕' },
  { label: 'Search Trip',  href: '/app/trip/search',  icon: '🔍' },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const { isCollapsed, toggleCollapse, setMobileOpen } = useSidebarStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const handleLinkClick = () => {
    // Automatically close mobile sidebar on navigation click
    setMobileOpen(false)
  }

  const sidebarStyle: React.CSSProperties = {
    width: isCollapsed ? '80px' : '240px',
    minHeight: '100vh',
    background: '#0d1b3e',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    flexShrink: 0,
    transition: 'width 0.2s ease',
  }

  return (
    <aside style={sidebarStyle}>
      {/* Logo header */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        {isCollapsed ? (
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#b8952a' }}>W</span>
        ) : (
          <img src={LOGO} alt="Western Haul Dispatch" style={{ width: '100%', maxWidth: '180px', height: 'auto', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '8px' }} />
        )}
      </div>

      {/* User profile */}
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#b8952a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: '#fff', flexShrink: 0, textTransform: 'uppercase' }}>
          {((user?.full_name || user?.first_name || user?.username || 'D').split('@')[0]).charAt(0)}
        </div>
        {!isCollapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
              {((user?.full_name || user?.first_name || user?.username || 'Dispatcher').split('@')[0])}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>
              {user?.role?.replace('_', ' ') || 'dispatcher'}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {NAV.map(item => (
          <NavLink key={item.href} to={item.href} onClick={handleLinkClick}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '10px', marginBottom: '6px',
              fontSize: '14px', fontWeight: isActive ? '700' : '500',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              background: isActive ? '#b8952a' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
            })}
            title={item.label}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
            {!isCollapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* Collapse button */}
      <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={toggleCollapse} style={{
          background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px',
          color: '#fff', cursor: 'pointer', padding: '8px 12px', width: '100%',
          fontSize: '12px', fontWeight: '600'
        }}>
          {isCollapsed ? '▶' : '◀ Collapse'}
        </button>
      </div>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
          padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)',
          border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
          color: '#f87171', textAlign: 'left', justifyContent: isCollapsed ? 'center' : 'flex-start',
        }} title="Logout">
          <span style={{ fontSize: '18px' }}>🚪</span> {!isCollapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}
