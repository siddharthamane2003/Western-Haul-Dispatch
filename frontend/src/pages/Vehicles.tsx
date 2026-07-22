import React, { useState } from 'react'
import { TRUCKS, TRAILERS } from '@/lib/data'

export default function Vehicles() {
  const [tab, setTab] = useState<'trucks'|'trailers'>('trucks')
  const [search, setSearch] = useState('')

  const trucksFiltered = TRUCKS.filter(t => t.number.toLowerCase().includes(search.toLowerCase()))
  const trailersFiltered = TRAILERS.filter(t => t.number.toLowerCase().includes(search.toLowerCase()))

  const items = tab === 'trucks' ? trucksFiltered : trailersFiltered

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a2744' }}>Fleet Vehicles</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>Manage trucks and trailers.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#b8952a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>➕</span> Add Vehicle
        </button>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', background: '#fff', borderRadius: '8px', padding: '4px', border: '1px solid #e8e8e8' }}>
          <button onClick={() => setTab('trucks')} style={{ padding: '8px 24px', background: tab === 'trucks' ? '#1a2744' : 'transparent', color: tab === 'trucks' ? '#fff' : '#666', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>
            Trucks
          </button>
          <button onClick={() => setTab('trailers')} style={{ padding: '8px 24px', background: tab === 'trailers' ? '#1a2744' : 'transparent', color: tab === 'trailers' ? '#fff' : '#666', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>
            Trailers
          </button>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }}>🔍</span>
          <input 
            placeholder={`Search ${tab}...`} 
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {items.map(v => (
          <div key={v.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              {tab === 'trucks' ? '🚛' : '🛞'}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {tab === 'trucks' ? 'Truck Unit' : 'Trailer Unit'}
              </p>
              <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>#{v.number}</h3>
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', background: '#22c55e15', color: '#22c55e' }}>Active</span>
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '15px', fontWeight: '600' }}>No {tab} found matching your search.</p>
        </div>
      )}
    </div>
  )
}
