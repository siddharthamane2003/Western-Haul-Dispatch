import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { tripStore } from '@/lib/data'

export default function Reports() {
  const allTrips = tripStore.getAll()

  // Fake monthly data for visual purposes + real revenue from trips
  const monthlyData = [
    { name: 'Jan', revenue: 4000, trips: 24 },
    { name: 'Feb', revenue: 3000, trips: 18 },
    { name: 'Mar', revenue: 2000, trips: 12 },
    { name: 'Apr', revenue: 2780, trips: 16 },
    { name: 'May', revenue: 1890, trips: 10 },
    { name: 'Jun', revenue: 2390, trips: 14 },
    { name: 'Jul', revenue: allTrips.reduce((sum, t) => sum + (parseFloat(t.amount)||0), 0), trips: allTrips.length },
  ]

  const statusData = [
    { name: 'Pending', value: allTrips.filter(t => ['New', 'going for pickup', 'Onsite for pickup'].includes(t.status)).length },
    { name: 'Invoiced', value: allTrips.filter(t => t.status === 'Invoiced').length },
    { name: 'Paid', value: allTrips.filter(t => t.status === 'Paid').length },
  ].filter(d => d.value > 0)

  const COLORS = ['#f59e0b', '#8b5cf6', '#22c55e']

  const totalRev = monthlyData.reduce((acc, curr) => acc + curr.revenue, 0)
  
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a2744' }}>Analytics & Reports</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>Performance metrics and revenue tracking.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Total Revenue YTD</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>${totalRev.toLocaleString()}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Total Dispatches YTD</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>{monthlyData.reduce((a,c)=>a+c.trips, 0)}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Avg Revenue / Trip</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>
            ${Math.round(totalRev / (monthlyData.reduce((a,c)=>a+c.trips, 0) || 1)).toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Bar Chart */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '800', color: '#1a2744' }}>Revenue Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={val => `$${val}`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '800', color: '#1a2744' }}>Status Breakdown</h3>
          <div style={{ height: '200px' }}>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '13px' }}>
                No active dispatches
              </div>
            )}
          </div>
          <div style={{ marginTop: '20px' }}>
            {statusData.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[index % COLORS.length] }} />
                  <span style={{ fontSize: '13px', color: '#555' }}>{entry.name}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
