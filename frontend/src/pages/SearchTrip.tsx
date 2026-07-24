import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet } from '@/lib/api'
import { mapOrderToTripDisplay } from '@/lib/tripMapping'
import { AssignDispatchModal } from './AddTrip'

interface TripRow {
  id: string
  tripId: string
  loadNumber: string
  freightBrokerName: string
  amount: string
  paymentType: string
  status: string
  stops: ReturnType<typeof mapOrderToTripDisplay>['stops']
  pickupLocationName: string
  deliveryLocationName: string
  deliveryReceiver: string
}

export default function SearchTrip() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [trips, setTrips] = useState<TripRow[]>([])
  const [loading, setLoading] = useState(true)
  const [assignTrip, setAssignTrip] = useState<any>(null)
  const [showAssign, setShowAssign] = useState(false)

  useEffect(() => {
    setLoading(true)
    apiGet<any>('/orders/').then(data => {
      const items = data.items || []
      const mapped: TripRow[] = items.map((item: any) => {
        const row = mapOrderToTripDisplay(item)
        return {
          id: row.id,
          tripId: row.tripId,
          loadNumber: row.loadNumber,
          freightBrokerName: row.freightBrokerName,
          amount: row.amount,
          paymentType: row.paymentType,
          status: row.status,
          stops: row.stops,
          pickupLocationName: row.pickupLocationName,
          deliveryLocationName: row.deliveryLocationName,
          deliveryReceiver: row.deliveryReceiver,
        }
      })
      // #region agent log
      fetch('http://127.0.0.1:7683/ingest/9880e8b7-d01d-4c70-b168-7c4233b2b147',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a44aee'},body:JSON.stringify({sessionId:'a44aee',location:'SearchTrip.tsx:fetch',message:'trips mapped',data:{count:mapped.length,sample:mapped[0]},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      setTrips(mapped)
    }).catch(() => setTrips([]))
    .finally(() => setLoading(false))
  }, [])

  const filtered = trips.filter(t =>
    t.tripId.toLowerCase().includes(search.toLowerCase()) ||
    t.loadNumber.toLowerCase().includes(search.toLowerCase()) ||
    t.freightBrokerName.toLowerCase().includes(search.toLowerCase()) ||
    t.status.toLowerCase().includes(search.toLowerCase()) ||
    t.pickupLocationName.toLowerCase().includes(search.toLowerCase()) ||
    t.deliveryReceiver.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors: Record<string, string> = {
    'going_for_pickup': '#f59e0b',
    'going for pickup': '#f59e0b',
    'invoiced': '#8b5cf6',
    'Invoiced': '#8b5cf6',
    'pending': '#3b82f6',
    'New': '#3b82f6',
    'onsite_for_pickup': '#10b981',
    'Onsite for pickup': '#10b981',
    'paid': '#22c55e',
    'Paid': '#22c55e',
    'in_transit': '#7c3aed',
    'delivered': '#22c55e',
    'cancelled': '#ef4444',
  }

  const openAssign = (trip: TripRow) => {
    // Build trip object compatible with AssignDispatchModal
    const assignObj = {
      id: trip.id,
      tripId: trip.tripId,
      loadNumber: trip.loadNumber,
      freightBrokerName: trip.freightBrokerName,
      stops: trip.stops,
    }
    setAssignTrip(assignObj)
    setShowAssign(true)
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Search bar */}
      <div style={{ padding: '14px 16px', background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px',
          background: '#f5f5f5', borderRadius: '10px', padding: '10px 14px', border: '1px solid #e8e8e8' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Trip"
            style={{ border: 'none', background: 'transparent', outline: 'none',
              fontSize: '14px', color: '#3b82f6', fontWeight: '500', flex: 1 }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '14px' }}>
          Loading trips...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontSize: '14px' }}>
          No trips found. Create a trip first.
        </div>
      ) : (
        <>
          {/* ── Table 1: Trip ID, Freight Broker, Load # ── */}
          <div style={{ background: '#fff', margin: '12px', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr',
              padding: '12px 16px', background: '#f8f8f8', borderBottom: '1px solid #e8e8e8' }}>
              {['TRIP ID', 'FREIGHT BROKER', 'LOAD #'].map(h => (
                <span key={h} style={{ fontSize: '12px', fontWeight: '700', color: '#888',
                  textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {filtered.map((trip, idx) => (
              <div
                key={trip.id}
                style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr',
                  padding: '14px 16px', borderBottom: idx < filtered.length - 1 ? '1px solid #f5f5f5' : 'none',
                  alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fbff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => openAssign(trip)}
              >
                {/* Trip ID = order_number (e.g. WH-000001) */}
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#3b82f6' }}>
                    {trip.tripId}
                  </span>
                </div>
                {/* Freight Broker */}
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>
                    {trip.freightBrokerName}
                  </span>
                </div>
                {/* Load = user load_number (e.g. LD-001) */}
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#f59e0b' }}>
                    {trip.loadNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Table 2: Trip ID, Warehouse ID 1, Warehouse ID 2, Status ── */}
          <div style={{ background: '#fff', margin: '12px', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 1.5fr 1fr',
              padding: '12px 16px', background: '#f8f8f8', borderBottom: '1px solid #e8e8e8' }}>
              {['TRIP ID', 'LOCATION NAME (PICKUP)', 'RECEIVER (DELIVERY)', 'STATUS'].map(h => (
                <span key={h} style={{ fontSize: '12px', fontWeight: '700', color: '#888',
                  textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {filtered.map((trip, idx) => {
              const statusColor = statusColors[trip.status] || '#6b7280'
              return (
                <div
                  key={trip.id}
                  style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 1.5fr 1fr',
                    padding: '14px 16px', borderBottom: idx < filtered.length - 1 ? '1px solid #f5f5f5' : 'none',
                    alignItems: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fbff')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => openAssign(trip)}
                >
                  {/* Trip ID */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>{trip.tripId}</span>
                  </div>
                  {/* Warehouse ID 1 = Pickup location */}
                  <div>
                    <span style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>{trip.pickupLocationName}</span>
                  </div>
                  {/* Delivery warehouse receiver */}
                  <div>
                    <span style={{ fontSize: '13px', color: '#333', fontWeight: '600' }}>{trip.deliveryReceiver}</span>
                  </div>
                  {/* Status */}
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px',
                      borderRadius: '20px', background: `${statusColor}18`, color: statusColor,
                      whiteSpace: 'nowrap' }}>
                      {trip.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Assign Dispatch Buttons ── */}
          <div style={{ padding: '0 12px 24px' }}>
            {filtered.map(trip => (
              <button
                key={trip.id}
                onClick={() => openAssign(trip)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '14px 16px', background: '#fff',
                  border: '1px solid #e8e8e8', borderRadius: '10px', cursor: 'pointer',
                  marginBottom: '8px', textAlign: 'left' }}
              >
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>
                    Load #{trip.loadNumber} — {trip.freightBrokerName}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                    {trip.pickupLocationName} → {trip.deliveryLocationName}
                  </p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed',
                  padding: '6px 12px', background: '#7c3aed18', borderRadius: '8px' }}>
                  🚛 Assign
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Assign Dispatch Modal */}
      {showAssign && assignTrip && (
        <AssignDispatchModal trip={assignTrip} onClose={() => setShowAssign(false)} />
      )}
    </div>
  )
}
