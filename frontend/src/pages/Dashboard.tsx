import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { apiGet } from '@/lib/api'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  const [allTrips, setAllTrips] = useState<any[]>([])
  
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await apiGet<any>('/orders/')
        const mappedTrips = data.items.map((item: any) => ({
          status: item.status,
          amount: item.total_amount?.toString(),
        }))
        setAllTrips(mappedTrips)
      } catch (e) {
      }
    }
    fetchTrips()
  }, [])
  
  // Calculate dashboard stats
  const totalDispatches = allTrips.length
  const todayDispatches = allTrips.length // Simplified for demo
  const pending = allTrips.filter(t => ['New', 'going for pickup', 'Onsite for pickup'].includes(t.status)).length
  const delivered = allTrips.filter(t => t.status === 'Paid').length
  const revenue = allTrips.reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0)

  const KPICard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => (
    <div style={{
      background: '#fff', borderRadius: '12px', padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0',
      display: 'flex', alignItems: 'center', gap: '16px'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '10px',
        background: `${color}15`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </p>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>
          {value}
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2744 0%, #0d1b3e 100%)',
        borderRadius: '16px', padding: '28px', marginBottom: '24px',
        color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 8px 24px rgba(13,27,62,0.2)', position: 'relative', overflow: 'hidden',
        flexWrap: 'wrap', gap: '20px'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', right: '-20px', top: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(184,149,42,0.1)' }} />
        
        <div style={{ position: 'relative', zIndex: 1, flex: '1 1 300px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '600', color: '#b8952a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Welcome Back
          </p>
          <h1 style={{ margin: '0 0 12px', fontSize: '28px', fontWeight: '800', textTransform: 'capitalize' }}>
            {((user?.full_name || user?.first_name || user?.username || 'Dispatcher').split('@')[0])} 👋
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)', maxWidth: '400px', lineHeight: 1.5 }}>
            Here's what's happening with your dispatch operations today. Track trips, manage drivers, and analyze revenue.
          </p>
        </div>
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/app/trip/search')} style={{
            padding: '12px 20px', background: '#7c3aed', color: '#fff', border: 'none',
            borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span>🚛</span> Assign Dispatch
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard title="Total Dispatches" value={totalDispatches} icon="📋" color="#3b82f6" />
        <KPICard title="Today's Dispatches" value={todayDispatches} icon="📅" color="#8b5cf6" />
        <KPICard title="Pending" value={pending} icon="⏳" color="#f59e0b" />
        <KPICard title="Delivered" value={delivered} icon="✅" color="#10b981" />
        <KPICard title="Revenue" value={`$${revenue.toLocaleString()}`} icon="💰" color="#b8952a" />
      </div>

      {/* Quick Actions & Recent Activity removed */}
    </div>
  )
}
