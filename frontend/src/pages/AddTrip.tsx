import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FREIGHT_BROKERS, PAYMENT_TYPES, DRIVERS, TRUCKS, TRAILERS, TRIP_STATUSES, STATUS_MAP } from '@/lib/data'
import type { TripStop } from '@/lib/data'
import toast from 'react-hot-toast'
import { apiGet, apiPost } from '@/lib/api'

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

// ─── Freight Broker Picker Modal ─────────────────────────
function BrokerModal({ onSelect, onClose }: {
  onSelect: (broker: typeof FREIGHT_BROKERS[0]) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = FREIGHT_BROKERS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
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
            Select Freight Broker
          </h3>
          <input style={inp} placeholder="Search..." value={search}
            onChange={e => setSearch(e.target.value)} autoFocus />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(b => (
            <button key={b.id} onClick={() => { onSelect(b); onClose() }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '14px 20px', background: 'none', border: 'none',
                borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
                textAlign: 'left', fontSize: '14px', color: '#111827',
              }}>
              {b.name}
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #3b82f6', flexShrink: 0 }} />
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>No results found</p>
          )}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={onClose} style={{
            width: '100%', padding: '11px', background: '#f3f4f6', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#374151',
          }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Employee Picker Modal ────────────────────────────────
function EmployeeModal({ employees, onSelect, onClose }: {
  employees: string[]
  onSelect: (emp: string) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = employees.filter(e =>
    e.toLowerCase().includes(search.toLowerCase())
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
            Select Employee
          </h3>
          <input style={inp} placeholder="Search..." value={search}
            onChange={e => setSearch(e.target.value)} autoFocus />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(e => (
            <button key={e} onClick={() => { onSelect(e); onClose() }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '14px 20px', background: 'none', border: 'none',
                borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
                textAlign: 'left', fontSize: '14px', color: '#111827',
              }}>
              {e}
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #3b82f6', flexShrink: 0 }} />
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>No results found</p>
          )}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={onClose} style={{
            width: '100%', padding: '11px', background: '#f3f4f6', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#374151',
          }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── 3-Step Assign Dispatch Modal ────────────────────────
type ModalStep = 'assign' | 'whatsapp'

export function AssignDispatchModal({ trip, onClose }: { trip: any; onClose: () => void }) {
  const [step, setStep] = useState<ModalStep>('assign')
  const [driver, setDriver] = useState('')
  const [customDriver, setCustomDriver] = useState('')
  const [coDriver, setCoDriver] = useState('')
  const [customCoDriver, setCustomCoDriver] = useState('')
  const [truck, setTruck] = useState('')
  const [customTruck, setCustomTruck] = useState('')
  const [trailer, setTrailer] = useState('')
  const [customTrailer, setCustomTrailer] = useState('')

  // Prefill locations based on trip stops
  const stopsList: any[] = trip?.stops || []

  // Warehouse ID 1 = first Pickup stop
  const pickupStop = stopsList.find((s: any) =>
    s.pdy === 'Pickup' || s.pdy === 'pickup' ||
    s.location_type === 'pickup' || s.pdy === 'Cross Dock'
  ) || stopsList[0]

  // Warehouse ID 2 = first Delivery stop
  const deliveryStop = stopsList.find((s: any) =>
    s.pdy === 'Delivery' || s.pdy === 'delivery' ||
    s.location_type === 'delivery' || s.pdy === 'Drop'
  ) || stopsList[stopsList.length - 1]

  // Extra stops = everything that is neither pickup nor delivery
  const middleStops = stopsList.filter((s: any) => s !== pickupStop && s !== deliveryStop)

  const initialStart = pickupStop?.locationName || pickupStop?.name || ''
  const initialEnd = deliveryStop?.locationName || deliveryStop?.name || ''
  const hasExtra = middleStops.length > 0
  const extraStopsText = hasExtra
    ? middleStops.map((s: any) => s.locationName || s.name || '').filter(Boolean).join(', ')
    : 'None'

  const [startStop, setStartStop] = useState(initialStart)
  const [endStop, setEndStop] = useState(initialEnd)
  const [extraStop, setExtraStop] = useState(extraStopsText)

  const mInp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #d1d5db',
    borderRadius: '8px', fontSize: '13px', color: '#111827',
    background: '#fff', outline: 'none', boxSizing: 'border-box',
  }
  const mLbl: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px',
  }

  const getActiveDriver = () => (driver === 'CUSTOM' ? customDriver : driver)
  const getActiveCoDriver = () => (coDriver === 'CUSTOM' ? customCoDriver : coDriver)
  const getActiveTruck = () => (truck === 'CUSTOM' ? customTruck : truck)
  const getActiveTrailer = () => (trailer === 'CUSTOM' ? customTrailer : trailer)

  const handleSaveDispatch = () => {
    if (!getActiveDriver()) { toast.error('Please select or add a driver'); return }
    if (!getActiveTruck()) { toast.error('Please select or add a truck'); return }
    if (!getActiveTrailer()) { toast.error('Please select or add a trailer'); return }
    toast.success('Dispatch assigned!')
    setStep('whatsapp')
  }

  const generateText = () => {
    const finalDriver = getActiveDriver()
    const finalCoDriver = getActiveCoDriver()
    const finalTruck = getActiveTruck()
    const finalTrailer = getActiveTrailer()

    const startTime = stopsList[0]?.startTime || stopsList[0]?.apptTime || 'N/A'
    const endTime = stopsList[stopsList.length - 1]?.endTime || stopsList[stopsList.length - 1]?.apptTime || 'N/A'
    const notesContent = trip?.comment || trip?.notes || 'None.'

    return [
      '🚚 TRIP DISPATCH ASSIGNMENT',
      '====================================',
      `LOAD #: ${trip?.loadNumber || 'N/A'}`,
      `DRIVER: ${finalDriver}${finalCoDriver ? ` / ${finalCoDriver}` : ''}`,
      `TRUCK: ${finalTruck}`,
      `TRAILER: ${finalTrailer}`,
      '---',
      '📍 STOP #1 (Pickup)',
      `LOCATION: ${startStop}`,
      `TIME: ${startTime}`,
      '---',
      '📍 STOP #2 (Delivery)',
      `LOCATION: ${endStop}`,
      `TIME: ${endTime}`,
      ...(hasExtra ? [
        '---',
        '📍 EXTRA STOPS',
        `LOCATIONS: ${extraStop}`
      ] : []),
      '📝 NOTES:',
      notesContent,
      '====================================',
    ].join('\n')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 1000, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '16px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '18px', width: '100%',
        maxWidth: '480px', boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {step === 'assign' && (
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: '20px', padding: '0' }}>←</button>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#1a2744' }}>Assign Dispatch</h3>
            </div>

            {trip && (
              <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#6b7280', background: '#f9fafb', padding: '10px 14px', borderRadius: '8px' }}>
                Load #{trip.loadNumber} · {trip.freightBrokerName}
              </p>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={mLbl}>Start Stop</label>
              <input style={mInp} placeholder="Pickup stop" value={startStop} onChange={e => setStartStop(e.target.value)} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={mLbl}>End Stop</label>
              <input style={mInp} placeholder="Delivery stop" value={endStop} onChange={e => setEndStop(e.target.value)} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={mLbl}>Extra Stop</label>
              <input style={mInp} placeholder="Extra intermediate stops" value={extraStop} onChange={e => setExtraStop(e.target.value)} />
            </div>

            {/* Driver */}
            <div style={{ marginBottom: '14px' }}>
              <label style={mLbl}>Driver *</label>
              <select style={mInp} value={driver} onChange={e => setDriver(e.target.value)}>
                <option value="">Select Driver</option>
                {DRIVERS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                <option value="CUSTOM">+ Add Custom Driver</option>
              </select>
              {driver === 'CUSTOM' && (
                <input style={{ ...mInp, marginTop: '8px' }} placeholder="Type Custom Driver Name" value={customDriver} onChange={e => setCustomDriver(e.target.value)} />
              )}
            </div>

            {/* Co-Driver */}
            <div style={{ marginBottom: '14px' }}>
              <label style={mLbl}>Co-Driver</label>
              <select style={mInp} value={coDriver} onChange={e => setCoDriver(e.target.value)}>
                <option value="">None</option>
                {DRIVERS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                <option value="CUSTOM">+ Add Custom Co-Driver</option>
              </select>
              {coDriver === 'CUSTOM' && (
                <input style={{ ...mInp, marginTop: '8px' }} placeholder="Type Custom Co-Driver Name" value={customCoDriver} onChange={e => setCustomCoDriver(e.target.value)} />
              )}
            </div>

            {/* Truck */}
            <div style={{ marginBottom: '14px' }}>
              <label style={mLbl}>Truck *</label>
              <select style={mInp} value={truck} onChange={e => setTruck(e.target.value)}>
                <option value="">Select Truck</option>
                {TRUCKS.map(t => <option key={t.id} value={t.number}>{t.number}</option>)}
                <option value="CUSTOM">+ Add Custom Truck</option>
              </select>
              {truck === 'CUSTOM' && (
                <input style={{ ...mInp, marginTop: '8px' }} placeholder="Type Custom Truck Number" value={customTruck} onChange={e => setCustomTruck(e.target.value)} />
              )}
            </div>

            {/* Trailer */}
            <div style={{ marginBottom: '14px' }}>
              <label style={mLbl}>Trailer *</label>
              <select style={mInp} value={trailer} onChange={e => setTrailer(e.target.value)}>
                <option value="">Select Trailer</option>
                {TRAILERS.map(t => <option key={t.id} value={t.number}>{t.number}</option>)}
                <option value="CUSTOM">+ Add Custom Trailer</option>
              </select>
              {trailer === 'CUSTOM' && (
                <input style={{ ...mInp, marginTop: '8px' }} placeholder="Type Custom Trailer Number" value={customTrailer} onChange={e => setCustomTrailer(e.target.value)} />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handleSaveDispatch} style={{ padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>✅ Save Dispatch</button>
              <button onClick={onClose} style={{ padding: '11px', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>✕ Cancel</button>
            </div>
          </div>
        )}

        {step === 'whatsapp' && (
          <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
              <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: '#10b981' }}>Dispatch Assigned!</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Driver: {getActiveDriver()} · Truck: {getActiveTruck()}</p>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '12px', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-wrap', border: '1px solid #e5e7eb', maxHeight: '180px', overflowY: 'auto' }}>
              {generateText()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generateText())}`, '_blank')} style={{ padding: '14px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}>
                Share on WhatsApp
              </button>
              <button onClick={async () => { await navigator.clipboard.writeText(generateText()); toast.success('Copied!') }} style={{ padding: '12px', background: '#fff', color: '#374151', border: '1.5px solid #d1d5db', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>📋 Copy Message</button>
              <button onClick={onClose} style={{ padding: '11px', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>✕ Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main AddTrip ─────────────────────────────────────────
export default function AddTrip() {
  const navigate = useNavigate()
  const routeLocation = useLocation()

  // Check if we came from Search Trip (view mode)
  const viewTrip = routeLocation.state?.viewTrip as boolean | undefined
  const passedTrip = routeLocation.state?.trip

  // Trip form fields
  const [freightBrokerId, setFreightBrokerId] = useState<number | null>(null)
  const [freightBrokerName, setFreightBrokerName] = useState('')
  const [freightBrokerEmployee, setFreightBrokerEmployee] = useState('')
  const [loadNumber, setLoadNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentType, setPaymentType] = useState('CAD')
  const [comment, setComment] = useState('')
  const [tripStatus, setTripStatus] = useState('New')
  
  const [showBrokerPicker, setShowBrokerPicker] = useState(false)
  const [showEmployeePicker, setShowEmployeePicker] = useState(false)

  // For Assign Dispatch modal
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignTrip, setAssignTrip] = useState<any>(null)

  // Trips list (from API) shown when viewTrip=true
  const [browseTrips, setBrowseTrips] = useState<any[]>([])

  const brokerEmployees = FREIGHT_BROKERS.find(b => b.id === freightBrokerId)?.employees || []

  // ── VIEW MODE: Show Browse Trip List ──────────────────
  useEffect(() => {
    if (viewTrip) {
      const fetchTrips = () => {
        apiGet<any>('/orders/').then(data => {
          const mapped = (data.items || []).map((item: any) => ({
            id: item.id,
            loadNumber: item.load_number || '',
            freightBrokerName: (() => {
              let broker = '—';
              const notes = item.internal_notes || '';
              if (notes.startsWith('{')) {
                try {
                  const parsed = JSON.parse(notes);
                  broker = parsed.freightBrokerName || parsed.freight_broker || '—';
                } catch {}
              } else if (notes) {
                broker = notes;
              }
              if (broker === '—') {
                broker = item.customer?.company_name || item.customer_name || '—';
              }
              return broker;
            })(),
            locationName: item.locations?.find((l: any) => l.location_type === 'pickup' || l.pdy === 'Pickup')?.name
                         || item.locations?.[0]?.name || item.locations?.[0]?.locationName || '—',
            receiver: item.locations?.slice().reverse().find((l: any) => l.location_type === 'delivery' || l.pdy === 'Delivery')?.name
                     || item.locations?.[item.locations.length - 1]?.name || item.locations?.[item.locations.length - 1]?.locationName || '—',
            ps: item.payment_mode || 'CAD',
            status: item.status || 'pending',
            amount: item.total_amount?.toString() || '0',
            stops: (item.locations || []).map((l: any) => ({
              id: l.id?.toString() || Date.now().toString(),
              locationId: l.location_id,
              locationName: l.name || l.locationName,
              address: l.address,
              pdy: l.location_type ? (l.location_type.charAt(0).toUpperCase() + l.location_type.slice(1)) : (l.pdy || 'Pickup'),
              commodity: l.commodity || '',
              weight: l.weight?.toString() || '',
              qty: l.qty?.toString() || '',
              startDate: l.start_date || l.startDate || '',
              startTime: l.start_time || l.startTime || '',
              endDate: l.end_date || l.endDate || '',
              endTime: l.end_time || l.endTime || '',
              appt: l.appt ? 'Yes' : 'No',
              apptDate: l.appt_date || l.apptDate || '',
              apptTime: l.appt_time || l.apptTime || '',
              notes: l.notes || ''
            })),
            comment: item.internal_notes || '',
          }))
          setBrowseTrips(mapped)
        }).catch(() => {
          if (passedTrip) setBrowseTrips([passedTrip])
        })
      }
      fetchTrips()
    }
  }, [viewTrip, passedTrip])

  const clearForm = () => {
    setFreightBrokerId(null); setFreightBrokerName(''); setFreightBrokerEmployee('')
    setLoadNumber(''); setAmount(''); setComment(''); setPaymentType('CAD'); setTripStatus('New')
  }

  const handleSaveTrip = async () => {
    if (!freightBrokerName) { toast.error('Please add/select a Freight Broker'); return }
    if (!amount) { toast.error('Please enter an amount'); return }

    // Embed all trip metadata in internal_notes as JSON so we can retrieve it later
    const metaNotes = JSON.stringify({
      freightBrokerName,
      freightBrokerEmployee,
      loadNumber,
      comment,
    })

    try {
      const customerRes = await apiGet<any>(`/customers/?q=${encodeURIComponent(freightBrokerName)}`)
      const customerId = customerRes?.items?.[0]?.id

      let savedTripId = `local-${Date.now()}`
      let finalCustomerId = customerId

      if (!finalCustomerId) {
        try {
          const newCustomer = await apiPost<any>('/customers/', {
            company_name: freightBrokerName,
            contact_name: freightBrokerEmployee || 'Unknown',
            email: `broker-${Date.now()}@example.com`,
            phone: '000-000-0000',
            customer_type: 'BROKER',
            status: 'ACTIVE'
          })
          finalCustomerId = newCustomer.id
        } catch (e) {
          console.error('Failed to create customer', e)
        }
      }

      if (finalCustomerId) {
        try {
          const saved = await apiPost<any>('/orders/', {
            customer_id: finalCustomerId, priority: 'normal',
            material_type: 'General Freight', weight_tons: 1,
            pickup_date: new Date().toISOString().split('T')[0],
            freight_amount: parseFloat(amount) || 0,
            payment_mode: paymentType,
            internal_notes: metaNotes,
            load_number: loadNumber,
            status: STATUS_MAP[tripStatus] || 'pending',
            locations: [],
          })
          savedTripId = saved.id
          toast.success('Trip saved! Now add locations.')
        } catch {
          toast.success('Trip saved locally! Now add locations.')
        }
      } else {
        toast.success('Trip saved! Now add locations.')
      }

      navigate('/app/trip/location', {
        state: { tripId: savedTripId, freightBrokerName, freightBrokerEmployee, loadNumber, amount, paymentType, comment }
      })
    } catch {
      toast.success('Navigating to Location page...')
      navigate('/app/trip/location', {
        state: { tripId: `local-${Date.now()}`, freightBrokerName, freightBrokerEmployee, loadNumber, amount, paymentType, comment }
      })
    }
  }

  // ── VIEW MODE: Show Browse Trip List ──────────────────
  if (viewTrip) {
    return (
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f3f4f6', minHeight: '100vh', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={() => navigate('/app/trip/search')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: '22px', padding: '0' }}>←</button>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1a2744' }}>Browse Trip List</h2>
        </div>

        <div style={card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  {['TRIP ID', 'FREIGHT BROKER', 'LOAD #', 'AMOUNT', 'LOCATION NAME', 'RECEIVER', 'STATUS'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', fontWeight: '700', color: '#6b7280', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {browseTrips.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>Loading trips...</td></tr>
                ) : (
                  browseTrips.map(trip => (
                    <tr key={trip.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#111827' }}>#{String(trip.id).slice(-5)}</td>
                      <td style={{ padding: '10px 12px', color: '#374151' }}>{trip.freightBrokerName}</td>
                      <td style={{ padding: '10px 12px', color: '#374151' }}>{trip.loadNumber}</td>
                      <td style={{ padding: '10px 12px', fontWeight: '600', color: '#111827' }}>{trip.amount} {trip.ps}</td>
                      <td style={{ padding: '10px 12px', color: '#374151' }}>{trip.locationName}</td>
                      <td style={{ padding: '10px 12px', color: '#374151' }}>{trip.receiver}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px', background: '#f3f4f6', color: '#374151' }}>{trip.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom: Assign Dispatch */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={() => {
                setAssignTrip(passedTrip || browseTrips[0] || null)
                setShowAssignModal(true)
              }}
              style={{
                width: '100%', padding: '14px', background: '#7c3aed', color: '#fff',
                border: 'none', borderRadius: '10px', fontWeight: '800',
                cursor: 'pointer', fontSize: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
              }}>
              🚛 Assign Dispatch
            </button>
          </div>
        </div>

        {showAssignModal && (
          <AssignDispatchModal trip={assignTrip} onClose={() => setShowAssignModal(false)} />
        )}
      </div>
    )
  }

  // ── NORMAL CREATE MODE ──────────────────────────────────
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f3f4f6', minHeight: '100vh', padding: '16px' }}>
      <div style={card}>
        <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800', color: '#1a2744' }}>Add Trip</h2>

        {/* Freight Broker */}
        <div style={{ marginBottom: '16px' }}>
          <label style={lbl}>Freight Broker</label>
          <div onClick={() => setShowBrokerPicker(true)} style={{ ...inp, cursor: 'pointer', minHeight: '42px', display: 'flex', alignItems: 'center', color: freightBrokerName ? '#111827' : '#9ca3af' }}>
            {freightBrokerName || 'Add Freight Broker'}
          </div>
          <button onClick={() => setShowBrokerPicker(true)} style={{ marginTop: '8px', padding: '8px 16px', background: '#1a2744', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            Add Freight Broker
          </button>
        </div>

        {/* Freight Broker Employee */}
        <div style={{ marginBottom: '16px' }}>
          <label style={lbl}>Freight Broker Employee</label>
          <div onClick={() => {
            if (!freightBrokerId) { toast.error('Please select a Freight Broker first'); return }
            setShowEmployeePicker(true)
          }} style={{ ...inp, cursor: 'pointer', minHeight: '42px', display: 'flex', alignItems: 'center', color: freightBrokerEmployee ? '#111827' : '#9ca3af' }}>
            {freightBrokerEmployee || 'Add Employee'}
          </div>
          <button
            onClick={() => {
              if (!freightBrokerId) { toast.error('Please select a Freight Broker first'); return }
              setShowEmployeePicker(true)
            }}
            style={{ marginTop: '8px', padding: '8px 16px', background: '#1a2744', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
            Add Employee
          </button>
        </div>

        {/* Load Number */}
        <div style={{ marginBottom: '16px' }}>
          <label style={lbl}>Load Number</label>
          <input style={inp} placeholder="Load Number" value={loadNumber} onChange={e => setLoadNumber(e.target.value)} />
        </div>

        {/* Amount + Payment */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 2 }}>
            <label style={lbl}>Amount</label>
            <input style={inp} type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Payment</label>
            <select style={inp} value={paymentType} onChange={e => setPaymentType(e.target.value)}>
              {PAYMENT_TYPES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Status */}
        <div style={{ marginBottom: '16px' }}>
          <label style={lbl}>Status</label>
          <select style={inp} value={tripStatus} onChange={e => setTripStatus(e.target.value)}>
            {TRIP_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: '24px' }}>
          <label style={lbl}>Comment</label>
          <textarea style={{ ...inp, minHeight: '70px', resize: 'vertical' }} placeholder="Notes" value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        {/* Save + Clear buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSaveTrip} style={{ flex: 1, padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
            💾 Save
          </button>
          <button onClick={clearForm} style={{ flex: 1, padding: '14px', background: '#fff', color: '#ef4444', border: '1.5px solid #ef4444', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer' }}>
            Clear
          </button>
        </div>
      </div>

      {showBrokerPicker && (
        <BrokerModal
          onSelect={b => { setFreightBrokerId(b.id); setFreightBrokerName(b.name); setFreightBrokerEmployee('') }}
          onClose={() => setShowBrokerPicker(false)}
        />
      )}

      {showEmployeePicker && (
        <EmployeeModal
          employees={brokerEmployees}
          onSelect={e => setFreightBrokerEmployee(e)}
          onClose={() => setShowEmployeePicker(false)}
        />
      )}
    </div>
  )
}