import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LOCATIONS, PDY_TYPES, type TripStop } from '@/lib/data'
import { apiGet, apiPost } from '@/lib/api'
import toast from 'react-hot-toast'

// ─── Styles ─────────────────────────────────────────────
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: '700',
  color: '#1a1a1a', marginBottom: '6px',
}
const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #d1d5db',
  borderRadius: '8px', fontSize: '13px', color: '#111827',
  background: '#ffffff', outline: 'none', boxSizing: 'border-box',
}
const card: React.CSSProperties = {
  background: '#fff', borderRadius: '12px', padding: '20px',
  marginBottom: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
  border: '1px solid #e5e7eb',
}

// ─── Location Picker Modal ────────────────────────────────
function LocationModal({ onSelect, onClose }: {
  onSelect: (loc: typeof LOCATIONS[0]) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px 16px 0 0', width: '100%',
        maxWidth: '520px', maxHeight: '78vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -6px 32px rgba(0,0,0,0.16)'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '800', color: '#111827' }}>
            Select Location
          </h3>
          <input
            style={inp} placeholder="Search locations..."
            value={search} onChange={e => setSearch(e.target.value)} autoFocus
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(loc => (
            <button key={loc.id} onClick={() => { onSelect(loc); onClose() }}
              style={{
                display: 'flex', flexDirection: 'column', width: '100%',
                padding: '12px 20px', background: 'none', border: 'none',
                borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left',
              }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{loc.name}</span>
              <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{loc.address}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>
              No results found
            </p>
          )}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={onClose} style={{
            width: '100%', padding: '11px', background: '#f3f4f6', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', color: '#374151'
          }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Location Page ───────────────────────────────────
export default function LocationPage() {
  const navigate = useNavigate()
  const routeLocation = useLocation()
  const tripData = routeLocation.state || {}

  // Form state
  const [locationId, setLocationId] = useState<number | null>(null)
  const [locationName, setLocationName] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [pdy, setPdy] = useState('Pickup')
  const [commodity, setCommodity] = useState('')
  const [weight, setWeight] = useState('')
  const [qty, setQty] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [app, setApp] = useState<'Yes' | 'No'>('No')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [apptDate, setAppDate] = useState('')
  const [apptTime, setAppTime] = useState('')
  const [notes, setNotes] = useState('')

  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [editingStopId, setEditingStopId] = useState<string | null>(null)
  const [stops, setStops] = useState<TripStop[]>([])

  const tripId = routeLocation.state?.tripId
  useEffect(() => {
    if (tripId) {
      setLoading(true)
      apiGet<any>(`/orders/${tripId}/locations`)
        .then(data => {
          const loadedStops = data.map((l: any) => ({
            id: l.id?.toString() || Date.now().toString(),
            locationId: l.location_id,
            locationName: l.name,
            address: l.address,
            pdy: l.location_type.charAt(0).toUpperCase() + l.location_type.slice(1),
            commodity: l.commodity || '',
            weight: l.weight?.toString() || '',
            qty: l.qty?.toString() || '',
            startDate: l.start_date || '',
            startTime: l.start_time || '',
            endDate: l.end_date || '',
            endTime: l.end_time || '',
            appt: l.appt || 'No',
            apptDate: l.appt_date || '',
            apptTime: l.appt_time || '',
            notes: l.notes || ''
          }))
          setStops(loadedStops)
        })
        .catch(err => setError('Failed to load stops'))
        .finally(() => setLoading(false))
    }
  }, [tripId])

  const clearForm = () => {
    setLocationId(null); setLocationName(''); setLocationAddress('')
    setPdy('Pickup'); setCommodity(''); setWeight(''); setQty('')
    setApp('No');
    setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('')
    setAppDate(''); setAppTime(''); setNotes('')
    setEditingStopId(null)
  }

  const handleSaveStop = async () => {
    if (!locationName) { toast.error('Please select a location'); return }
    const stop: TripStop = {
      id: editingStopId || Date.now().toString(),
      locationId,
      locationName,
      address: locationAddress,
      pdy,
      commodity,
      weight,
      qty,
      startDate,
      startTime,
      endDate,
      endTime,
      appt: app,
      apptDate,
      apptTime,
      notes,
    };
    const newStops = editingStopId
      ? stops.map(s => s.id === editingStopId ? stop : s)
      : [...stops, stop];
    setStops(newStops);
    clearForm();
    toast.success('Stop saved!');
    // Persist to backend if we have an order id
    const orderId = routeLocation.state?.tripId;
    if (orderId) {
      // Transform to backend schema — sequence by index
      const pdyToType = (pdy: string): string => {
        const p = pdy.toLowerCase()
        if (p === 'pickup' || p === 'cross dock') return 'pickup'
        if (p === 'delivery' || p === 'drop') return 'delivery'
        return 'extra'
      }
      const payload = newStops.map((s, idx) => ({
        name: s.locationName,
        address: s.address || '—',
        location_type: pdyToType(s.pdy),
        sequence: idx + 1,
        commodity: s.commodity || undefined,
        weight: s.weight ? parseFloat(s.weight) : undefined,
        qty: s.qty ? parseInt(s.qty) : undefined,
        start_date: s.startDate || undefined,
        start_time: s.startTime || undefined,
        end_date: s.endDate || undefined,
        end_time: s.endTime || undefined,
        appt: s.appt === 'Yes',
        appt_date: s.apptDate || undefined,
        appt_time: s.apptTime || undefined,
        notes: s.notes || undefined,
      }));
      try {
        await apiPost(`/orders/${orderId}/locations`, payload);
        toast.success('Stops synced to server');
      } catch (e) {
        console.error(e);
        toast.error('Failed to sync stops');
      }
    }
  }

  const handleEditStop = (stop: TripStop) => {
    setEditingStopId(stop.id)
    setLocationId(stop.locationId); setLocationName(stop.locationName)
    setLocationAddress(stop.address); setPdy(stop.pdy)
    setCommodity(stop.commodity); setWeight(stop.weight); setQty(stop.qty)
    setApp(stop.appt); // corrected from setStatus

    setStartDate(stop.startDate); setStartTime(stop.startTime || '')
    setEndDate(stop.endDate)
    setEndTime(stop.endTime); setAppDate(stop.apptDate); setAppTime(stop.apptTime)
    setNotes(stop.notes)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#f3f4f6', minHeight: '100vh', padding: '16px'
    }}>
      {/* Back header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '16px',
      }}>
        <button
          onClick={() => navigate('/app/dispatch/new')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#3b82f6', fontSize: '22px', padding: '0',
          }}>
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1a2744' }}>
          Location
        </h2>
        {tripData.freightBrokerName && (
          <span style={{
            marginLeft: 'auto', fontSize: '12px', color: '#6b7280',
            fontWeight: '600', background: '#f3f4f6',
            padding: '4px 10px', borderRadius: '20px', border: '1px solid #e5e7eb',
          }}>
            {tripData.freightBrokerName}
          </span>
        )}
      </div>

      {/* Location Stop Form */}
      <div style={card}>
        <h3 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: '800', color: '#1a2744' }}>
          {editingStopId ? '✏️ Edit Stop' : '📍 Add Location Stop'}
        </h3>

        {/* Location */}
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>Location</label>
          <div
            onClick={() => setShowLocationPicker(true)}
            style={{
              ...inp, cursor: 'pointer', minHeight: '42px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
            {locationName
              ? <><strong>{locationName}</strong><small style={{ color: '#6b7280', fontSize: '11px' }}>{locationAddress}</small></>
              : <span style={{ color: '#9ca3af' }}>Tap to add location</span>
            }
          </div>
          <button
            onClick={() => setShowLocationPicker(true)}
            style={{
              marginTop: '8px', padding: '8px 16px', background: '#1a2744',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            }}>
            Add Location
          </button>
        </div>

        {/* PDY */}
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>PDY</label>
          <select style={inp} value={pdy} onChange={e => setPdy(e.target.value)}>
            {PDY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Commodity */}
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>Commodity</label>
          <input style={inp} placeholder="Commodity" value={commodity} onChange={e => setCommodity(e.target.value)} />
        </div>

        {/* Weight + Qty */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Weight</label>
            <input style={inp} type="number" placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Qty</label>
            <input style={inp} type="number" placeholder="Qty" value={qty} onChange={e => setQty(e.target.value)} />
          </div>
        </div>





        {/* Dates */}
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>Start Date</label>
          <input style={inp} type="date" placeholder="Start Date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>Start Time</label>
          <input style={inp} type="time" placeholder="Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>End Date</label>
          <input style={inp} type="date" placeholder="End Date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>End Time</label>
          <input style={inp} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </div>

        {/* App */}
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>App</label>
          <select style={inp} value={app} onChange={e => setApp(e.target.value as 'Yes' | 'No')}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Appointment fields - only when App = Yes */}
        {app === 'Yes' && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <label style={lbl}>AppDate</label>
              <input style={inp} type="date" placeholder="AppDate" value={apptDate} onChange={e => setAppDate(e.target.value)} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={lbl}>AppTime</label>
              <input style={inp} type="time" placeholder="AppTime" value={apptTime} onChange={e => setAppTime(e.target.value)} />
            </div>
          </>
        )}




        {/* Notes */}
        <div style={{ marginBottom: '20px' }}>
          <label style={lbl}>Notes</label>
          <textarea
            style={{ ...inp, minHeight: '64px', resize: 'vertical' }}
            placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSaveStop} style={{
            flex: 1, padding: '12px', background: '#10b981', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
          }}>Save Stop</button>
          <button onClick={clearForm} style={{
            flex: 1, padding: '12px', background: '#fff', color: '#ef4444',
            border: '1.5px solid #ef4444', borderRadius: '8px', fontWeight: '700',
            cursor: 'pointer', fontSize: '14px',
          }}>Clear Form</button>
        </div>
      </div>

      {/* Trip Summary and Browse Trip List */}
      {stops.length > 0 && (
        <>
          {/* Trip Summary */}
          <div style={card}>
            <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '800', color: '#1a2744' }}>Trip Summary</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    {['TRIP ID', 'START STOP', 'END STOP', 'EXTRA STOP'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', fontWeight: '700', color: '#6b7280', textAlign: 'left', fontSize: '11px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px', fontWeight: '600', color: '#111827' }}>{tripId ? `#${String(tripId).slice(-5)}` : '—'}</td>
                    <td style={{ padding: '10px', color: '#374151' }}>{stops[0]?.locationName || '—'}</td>
                    <td style={{ padding: '10px', color: '#374151' }}>{stops[stops.length - 1]?.locationName || '—'}</td>
                    <td style={{ padding: '10px', color: '#374151' }}>{stops.length > 2 ? stops.slice(1, -1).map(s => s.locationName).join(', ') : 'None'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Browse Trip List */}
          <div style={card}>
            <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '800', color: '#1a2744' }}>
              Browse Trip List
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    {['WAREHOUSE ID', 'P/D', 'WEIGHT', 'QTY', 'START DATE', 'START TIME', 'END DATE', 'END TIME', 'APP', 'APPDATE', 'APPTIME'].map(h => (
                      <th key={h} style={{
                        padding: '10px 10px', fontWeight: '700', color: '#6b7280',
                        textAlign: 'left', fontSize: '11px', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stops.map(stop => (
                    <tr key={stop.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap' }}>{stop.locationName}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>{stop.pdy}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>{stop.weight || '—'}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>{stop.qty || '—'}</td>
                      <td style={{ padding: '10px', color: '#374151', whiteSpace: 'nowrap' }}>{stop.startDate || '—'}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>{stop.startTime || '—'}</td>
                      <td style={{ padding: '10px', color: '#374151', whiteSpace: 'nowrap' }}>{stop.endDate || '—'}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>{stop.endTime || '—'}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>{stop.appt}</td>
                      <td style={{ padding: '10px', color: '#374151', whiteSpace: 'nowrap' }}>{stop.apptDate || '—'}</td>
                      <td style={{ padding: '10px', color: '#374151' }}>{stop.apptTime || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Location picker modal */}
      {showLocationPicker && (
        <LocationModal
          onSelect={loc => {
            setLocationId(loc.id)
            setLocationName(loc.name)
            setLocationAddress(loc.address)
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </div>
  )
}
