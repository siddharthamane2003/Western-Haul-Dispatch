import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TRIP_STATUSES } from '@/lib/data'
import { apiGet } from '@/lib/api'
import { AssignDispatchModal } from './AddTrip'

// ─── Status colors ────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  'going for pickup': '#f59e0b',
  'Invoiced': '#8b5cf6',
  'New': '#3b82f6',
  'Onsite for pickup': '#10b981',
  'Paid': '#22c55e',
  'assigned': '#10b981',
  'pending': '#f59e0b',
}

export default function DispatchHistory() {
  const navigate = useNavigate()
  const [allTrips, setAllTrips] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<any>(null)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await apiGet<any>('/orders/')
        const mapped = data.items.map((item: any) => ({
          id: item.id,
          loadNumber: item.order_number || 'WH-000001',
          freightBrokerName: item.customer?.company_name || item.customer?.name || item.customer_name || '—',
          locationName: item.locations?.find((l: any) => l.location_type === 'pickup')?.name
                     || item.locations?.[0]?.name || '—',
          receiver: item.locations?.find((l: any) => l.location_type === 'delivery')?.name
                 || item.locations?.[item.locations.length - 1]?.name || '—',
          ps: item.payment_mode || 'CAD',
          status: item.status || 'New',
          amount: item.total_amount?.toString() || '0.00',
          stops: item.locations || [],
          comment: item.internal_notes || '',
        }))
        setAllTrips(mapped)
      } catch { /* api interceptor handles */ }
    }
    fetchTrips()
  }, [])

  const filteredTrips = useMemo(() => {
    return allTrips.filter(t => {
      const matchSearch =
        t.loadNumber.toLowerCase().includes(search.toLowerCase()) ||
        t.freightBrokerName.toLowerCase().includes(search.toLowerCase()) ||
        t.locationName.toLowerCase().includes(search.toLowerCase()) ||
        t.receiver.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || t.status === statusFilter
      return matchSearch && matchStatus
    }).reverse()
  }, [allTrips, search, statusFilter])

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage)
  const currentTrips = filteredTrips.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleAssign = (trip: any) => {
    setSelectedTrip(trip)
    setShowAssignModal(true)
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px', minHeight: '100vh', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1a2744' }}>Search Trip</h2>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }}>🔍</span>
          <input
            placeholder="Search Load#, Freight Broker, Location..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{
              width: '100%', padding: '10px 14px 10px 36px',
              border: '1.5px solid #e8e8e8', borderRadius: '8px',
              fontSize: '13px', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          style={{
            padding: '10px 14px', border: '1.5px solid #e8e8e8',
            borderRadius: '8px', fontSize: '13px', outline: 'none',
            background: '#fff', minWidth: '150px',
          }}
        >
          <option value="All">All Statuses</option>
          {TRIP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: '12px',
        border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        overflowX: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8e8e8' }}>
              {['TRIP ID', 'FREIGHT BROKER', 'LOAD #', 'AMOUNT', 'LOCATION NAME', 'RECEIVER', 'STATUS', 'ACTION'].map(h => (
                <th key={h} style={{
                  padding: '14px 16px', fontSize: '12px', fontWeight: '700',
                  color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentTrips.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                  No trips found.
                </td>
              </tr>
            ) : (
              currentTrips.map(trip => {
                const color = STATUS_COLORS[trip.status] || '#6b7280'
                return (
                  <tr key={trip.id}
                    style={{ borderBottom: '1px solid #f5f5f5', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>#{String(trip.id).slice(-5)}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#1a2744', fontWeight: '600' }}>{trip.freightBrokerName}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#444' }}>{trip.loadNumber}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>{trip.amount} {trip.ps}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{trip.locationName}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{trip.receiver}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '700', padding: '4px 10px',
                        borderRadius: '20px', background: `${color}15`, color,
                        whiteSpace: 'nowrap',
                      }}>{trip.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleAssign(trip)}
                        style={{
                          padding: '8px 16px', background: '#7c3aed', color: '#fff',
                          border: 'none', borderRadius: '6px',
                          fontSize: '12px', fontWeight: '800', cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(124,58,237,0.2)',
                          whiteSpace: 'nowrap'
                        }}>
                        Assign Dispatch
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '14px 20px', borderTop: '1px solid #f0f0f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredTrips.length)} of {filteredTrips.length}
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                style={{ padding: '6px 12px', border: '1px solid #e8e8e8', background: page === 1 ? '#f5f5f5' : '#fff', color: page === 1 ? '#aaa' : '#333', borderRadius: '6px', fontSize: '12px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                style={{ padding: '6px 12px', border: '1px solid #e8e8e8', background: page === totalPages ? '#f5f5f5' : '#fff', color: page === totalPages ? '#aaa' : '#333', borderRadius: '6px', fontSize: '12px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
            </div>
          </div>
        )}
      </div>

      {showAssignModal && (
        <AssignDispatchModal trip={selectedTrip} onClose={() => setShowAssignModal(false)} />
      )}
    </div>
  )
}

