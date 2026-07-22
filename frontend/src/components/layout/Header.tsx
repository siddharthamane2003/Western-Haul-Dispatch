import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  LogOut,
  User,
  Settings,
  ChevronDown,
  X,
} from 'lucide-react'
import { cn, formatTimeAgo } from '@/lib/utils'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

export function Header() {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const { toggleMobile } = useSidebarStore()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Demo notifications
  const notifications = [
    { id: '1', title: 'New order received', message: 'Order #WH-2024-1045 from Apex Logistics', time: new Date(Date.now() - 5 * 60000).toISOString(), read: false },
    { id: '2', title: 'Driver arrived', message: 'John Smith arrived at pickup location', time: new Date(Date.now() - 15 * 60000).toISOString(), read: false },
    { id: '3', title: 'Delivery completed', message: 'Order #WH-2024-1038 delivered successfully', time: new Date(Date.now() - 60 * 60000).toISOString(), read: true },
  ]
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header
      className="h-14 flex items-center justify-between px-4 gap-4 border-b sticky top-0 z-30"
      style={{
        background: 'var(--sidebar-bg)',
        borderColor: 'var(--border-color)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Left: Mobile menu toggle + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onClick={toggleMobile}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className={cn('relative flex-1 max-w-md transition-all duration-200', searchFocused && 'max-w-lg')}>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search orders, drivers, customers..."
            className={cn(
              'w-full pl-9 pr-20 py-1.5 rounded-lg text-sm transition-all duration-200 outline-none',
            )}
            style={{
              background: 'var(--bg-secondary)',
              border: `1.5px solid ${searchFocused ? '#3b82f6' : 'var(--border-color)'}`,
              color: 'var(--text-primary)',
              boxShadow: searchFocused ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
            }}
          />
          {searchQuery ? (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded"
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd
              className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded border"
              style={{
                color: 'var(--text-muted)',
                borderColor: 'var(--border-color)',
                background: 'var(--bg-tertiary)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-surface-secondary"
          style={{ color: 'var(--text-muted)' }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-surface-secondary relative"
            style={{ color: 'var(--text-muted)' }}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-lg z-50 overflow-hidden animate-scale-in"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="blue" size="sm">{unreadCount} new</Badge>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={cn(
                      'px-4 py-3 border-b cursor-pointer transition-colors hover:bg-surface-secondary',
                      !n.read && 'bg-blue-500/5',
                    )}
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex items-start gap-3">
                      {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                      <div className={cn(!n.read && '', 'flex-1')}>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatTimeAgo(n.time)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 text-center">
                <Link
                  to="/notifications"
                  className="text-xs font-medium text-blue-500 hover:text-blue-400"
                  onClick={() => setNotifOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all hover:bg-surface-secondary"
          >
            <Avatar
              name={user?.full_name || 'U'}
              src={user?.avatar_url || undefined}
              size="sm"
              status="online"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {user?.first_name || 'User'}
              </p>
              <p className="text-xs leading-tight capitalize" style={{ color: 'var(--text-muted)' }}>
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden md:block" style={{ color: 'var(--text-muted)' }} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl border shadow-lg z-50 overflow-hidden animate-scale-in py-2"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="px-4 py-2 border-b mb-1" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.full_name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              {[
                { label: 'Profile', icon: User, href: '/settings' },
                { label: 'Settings', icon: Settings, href: '/settings' },
              ].map(item => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-surface-secondary"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <item.icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  {item.label}
                </Link>
              ))}
              <div className="border-t mt-1" style={{ borderColor: 'var(--border-color)' }} />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors hover:bg-red-500/10 text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
