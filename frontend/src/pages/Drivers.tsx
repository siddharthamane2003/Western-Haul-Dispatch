import React, { useState } from 'react'
import { DRIVERS } from '@/lib/data'

export default function Drivers() {
  const [search, setSearch] = useState('')

  const filtered = DRIVERS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a2744' }}>Drivers Directory</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>Manage driver profiles and assignments.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#b8952a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>➕</span> Add Driver
        </button>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }}>🔍</span>
          <input 
            placeholder="Search driver name..." 
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8e8e8' }}>
              {['Driver Name', 'Status', 'License', 'Action'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                  No drivers found.
                </td>
              </tr>
            ) : (
              filtered.map((driver, i) => (
                <tr key={driver.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f5f5f5' : 'none', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0f4ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800' }}>
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>{driver.name}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>ID: DRV-{driver.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', background: '#22c55e15', color: '#22c55e' }}>Active</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555', fontFamily: 'monospace' }}>
                    CDL-***{driver.id}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
