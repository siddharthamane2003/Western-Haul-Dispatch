import React, { useState } from 'react'
import { FREIGHT_BROKERS } from '@/lib/data'

export default function Customers() {
  const [search, setSearch] = useState('')

  const filtered = FREIGHT_BROKERS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a2744' }}>Customers (Brokers)</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>Manage your freight brokers and their employees.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#b8952a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>➕</span> Add Customer
        </button>
      </div>

      {/* Controls Row */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }}>🔍</span>
          <input 
            placeholder="Search customer name..." 
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map(b => (
          <div key={b.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '20px', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a2744, #0d1b3e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: '800' }}>
                {b.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: '#1a1a1a' }}>{b.name}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>ID: CUST-{b.id.toString().padStart(4, '0')}</p>
              </div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: '700', color: '#666', textTransform: 'uppercase' }}>Employees / Contacts</p>
              {b.employees && b.employees.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {b.employees.map(emp => (
                    <span key={emp} style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#475569' }}>
                      {emp}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>No contacts listed</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>Edit</button>
              <button style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px' }}>👥</p>
          <p style={{ fontSize: '15px', fontWeight: '600' }}>No customers found matching your search.</p>
        </div>
      )}
    </div>
  )
}
