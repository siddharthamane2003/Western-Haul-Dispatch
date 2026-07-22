import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AlignJustify, Search, MoreHorizontal, X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useSidebarStore } from '@/store/sidebarStore'

const LOGO = '/western-haul-logo.jpg'

export function RootLayout() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [setMobileOpen])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f5f5' }}>
      {/* Desktop Sidebar */}
      <div style={{ display: 'none' }} className="lg-sidebar">
        <Sidebar />
      </div>
      <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
        }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <Sidebar />
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '-40px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{
          height: '56px',
          background: '#ffffff',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          {/* Left: Hamburger + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileOpen(!isMobileOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1a2744',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              className="mobile-hamburger"
            >
              <AlignJustify size={24} />
            </button>
            {/* Logo for mobile headers */}
            <div className="mobile-logo" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/app/dashboard')}>
              <img src={LOGO} alt="Logo" style={{ height: '36px', objectFit: 'contain', borderRadius: '4px', background: '#fff', padding: '2px' }} />
            </div>
          </div>

          {/* Right: Empty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          </div>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          background: '#f5f5f5',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0' }}>
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-hamburger { display: none !important; }
          .mobile-logo { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}
