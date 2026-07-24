import React, { useState, useEffect } from 'react'
import { apiGet } from '@/lib/api'
import { mapOrderToTripDisplay } from '@/lib/tripMapping'

interface TripCustomerRow {
  id: string
  tripId: string
  loadNumber: string
  freightBrokerName: string
  customerName: string
  pickupLocation: string
  deliveryReceiver: string
}

export default function Customers() {
  const [search, setSearch] = useState('')
  const [trips, setTrips] = useState<TripCustomerRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const ordersRes = await apiGet<any>('/orders/?size=100')
        const rows: TripCustomerRow[] = (ordersRes?.items || []).map((order: any) => {
          const row = mapOrderToTripDisplay(order)
          return {
            id: row.id,
            tripId: row.tripId,
            loadNumber: row.loadNumber,
            freightBrokerName: row.freightBrokerName,
            customerName: row.customerName,
            pickupLocation: row.pickupLocationName,
            deliveryReceiver: row.deliveryReceiver,
          }
        })
        if (!cancelled) setTrips(rows)
      } catch (e) {
        console.error('Customers/trips load failed', e)
        if (!cancelled) setTrips([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = trips.filter(t =>
    t.freightBrokerName.toLowerCase().includes(search.toLowerCase()) ||
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.tripId.toLowerCase().includes(search.toLowerCase()) ||
    t.loadNumber.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a2744' }}>Customers & Trips</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
            Each trip shows its own Freight Name from saved trip data.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }}>🔍</span>
          <input
            placeholder="Search freight name, trip, load..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid #e8e8e8', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#888' }}>Loading trips...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                {['TRIP ID', 'LOAD', 'FREIGHT NAME', 'CUSTOMER', 'LOCATION (1ST)', 'RECEIVER (2ND)', ''].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>{t.tripId}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '600', color: '#b45309' }}>{t.loadNumber}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1a2744' }}>{t.freightBrokerName}</td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{t.customerName}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{t.pickupLocation}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{t.deliveryReceiver}</td>
                  <td style={{ padding: '12px 14px' }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px' }}>👥</p>
          <p style={{ fontSize: '15px', fontWeight: '600' }}>No trips found.</p>
        </div>
      )}
    </div>
  )
}
