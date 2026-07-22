import React, { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Bell, Check, Trash2, MailOpen, AlertTriangle, CheckCircle2, ShieldAlert, Info } from 'lucide-react'
import toast from 'react-hot-toast'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  category: 'order' | 'dispatch' | 'driver' | 'vehicle' | 'system'
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'important'>('all')
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'New order created', message: 'Order #WH-2024-1045 has been created from Apex Logistics.', time: new Date(Date.now() - 5 * 60000).toISOString(), category: 'order', type: 'info', isRead: false },
    { id: '2', title: 'Driver arrived at pickup', message: 'John Smith has checked in at Dallas Warehouse.', time: new Date(Date.now() - 15 * 60000).toISOString(), category: 'dispatch', type: 'success', isRead: false },
    { id: '3', title: 'Vehicle maintenance due', message: 'Vehicle Truck-A2 (License Plate TX-4921) requires inspection.', time: new Date(Date.now() - 4 * 3600000).toISOString(), category: 'vehicle', type: 'warning', isRead: false },
    { id: '4', title: 'Critical WebSocket disconnected', message: 'GPS gateway tracking API reports offline latency.', time: new Date(Date.now() - 10 * 3600000).toISOString(), category: 'system', type: 'error', isRead: true },
    { id: '5', title: 'Invoice payment confirmed', message: 'Payment for order #WH-2024-1038 received successfully.', time: new Date(Date.now() - 24 * 3600000).toISOString(), category: 'system', type: 'success', isRead: true },
  ])

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead
    if (activeTab === 'important') return n.type === 'warning' || n.type === 'error'
    return true
  })

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const handleMarkSingleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    toast.success('Notification marked as read')
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notification deleted')
  }

  const getIcon = (type: NotificationItem['type']) => {
    if (type === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-400" />
    if (type === 'error') return <ShieldAlert className="w-5 h-5 text-red-400" />
    return <Info className="w-5 h-5 text-blue-400" />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="View real-time alerts, critical system events, and task completions."
        actions={
          notifications.some(n => !n.isRead) && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Mark All Read
            </Button>
          )
        }
      />

      <div className="flex items-center gap-2 border-b mb-4 pb-2" style={{ borderColor: 'var(--border-color)' }}>
        {[
          { id: 'all', label: 'All Alerts', count: notifications.length },
          { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
          { id: 'important', label: 'Important', count: notifications.filter(n => n.type === 'warning' || n.type === 'error').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-surface-secondary text-primary'
                : 'text-muted hover:text-primary'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-3">
              <Bell className="w-5 h-5 text-muted" />
            </div>
            <h3 className="font-semibold text-sm">All clean!</h3>
            <p className="text-xs text-muted mt-1">No alerts found matching this filter.</p>
          </Card>
        ) : (
          filteredNotifs.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !notif.isRead ? 'bg-blue-500/5' : 'bg-surface'
              }`}
              style={{
                borderColor: !notif.isRead ? 'rgba(59, 130, 246, 0.2)' : 'var(--border-color)',
                background: !notif.isRead ? 'linear-gradient(135deg, rgba(59,130,246,0.04) 0%, transparent 100%)' : 'var(--card-bg)',
              }}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-0.5 flex-shrink-0">{getIcon(notif.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-primary">{notif.title}</p>
                    <Badge variant={notif.category === 'system' ? 'red' : 'blue'} size="sm">
                      {notif.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-secondary mt-1">{notif.message}</p>
                  <p className="text-[10px] text-muted mt-2">
                    {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                    on {new Date(notif.time).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkSingleRead(notif.id)}
                    className="p-1.5 rounded-lg hover:bg-surface-secondary text-muted hover:text-primary transition-all"
                    title="Mark as read"
                  >
                    <MailOpen className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNotification(notif.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-all"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
export { Notifications }
