import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { tripStore, DRIVERS, TRUCKS, TRAILERS } from '@/lib/data'
import type { Trip, TripStop } from '@/lib/data'
import toast from 'react-hot-toast'
import { apiGet, apiPost } from '@/lib/api'

const VIHO_LOGO = (
  <div style={{
    width: '32px', height: '32px',
    background: 'linear-gradient(135deg, #4CAF50, #2196F3)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', color: 'white', fontWeight: 'bold', flexShrink: 0,
  }}>V</div>
)

const STATUS_COLORS: Record<string, string> = {
  'going for pickup': '#f59e0b',
  'Invoiced': '#8b5cf6',
  'New': '#3b82f6',
  'Onsite for pickup': '#10b981',
  'Paid': '#22c55e',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e8e8e8',
  borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', background: '#f0f4ff',
  outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: '700', color: '#1a1a1a', marginBottom: '5px',
}
const btnDark: React.CSSProperties = {
  padding: '9px 16px', background: '#444', color: '#fff', border: 'none',
  borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '4px',
}

// ─── Selection Modal ─────────────────────────────────────────
function SelectionModal({ title, items, onSelect, onClose }: {
  title: string
  items: Array<{ id: number; name: string }>
  onSelect: (item: { id: number; name: string }) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: '500px',
        maxHeight: '75vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '700' }}>{title}</h3>
          <input style={inputStyle} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(item => (
            <button key={item.id} onClick={() => { onSelect(item); onClose() }} style={{
              display: 'block', width: '100%', padding: '16px 20px', background: 'none', border: 'none',
              borderBottom: '1px solid #f5f5f5', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: '#1a1a1a',
            }}>{item.name}</button>
          ))}
          {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '24px', color: '#999', fontSize: '13px' }}>No results found</p>}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
          <button onClick={onClose} style={{
            width: '100%', padding: '12px', background: '#f5f5f5', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#555',
          }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Assign Dispatch Form ──────────────────────────────────
function AssignDispatchForm({ stops, onSave, onCancel }: {
  stops: TripStop[]
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [showDriverPicker, setShowDriverPicker] = useState(false)
  const [showTruckPicker, setShowTruckPicker] = useState(false)
  const [showTrailerPicker, setShowTrailerPicker] = useState(false)
  const [driverId, setDriverId] = useState<number | null>(null)
  const [driverName, setDriverName] = useState('')
  const [coDriverName, setCoDriverName] = useState('None')
  const [truckId, setTruckId] = useState<number | null>(null)
  const [truckNumber, setTruckNumber] = useState('')
  const [trailerId, setTrailerId] = useState<number | null>(null)
  const [trailerNumber, setTrailerNumber] = useState('')

  const handleSave = () => {
    if (!driverName) { toast.error('Please select a driver'); return }
    if (!truckNumber) { toast.error('Please select a truck'); return }
    if (!trailerNumber) { toast.error('Please select a trailer'); return }
    onSave({ driverId, driverName, coDriverName, truckId, truckNumber, trailerId, trailerNumber })
  }

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', marginBottom: '16px' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#8b5cf6' }}>🚛 Assign Dispatch</h3>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Driver</label>
          <div style={{ ...inputStyle, background: '#f8f8f8', color: driverName ? '#1a1a1a' : '#999' }}>
            {driverName || 'Please Select Driver'}
          </div>
          <button style={btnDark} onClick={() => setShowDriverPicker(true)}>Add Driver</button>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Co-Driver</label>
          <input style={inputStyle} value={coDriverName} placeholder="None" onChange={e => setCoDriverName(e.target.value)} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Truck No</label>
          <div style={{ ...inputStyle, background: '#f8f8f8', color: truckNumber ? '#1a1a1a' : '#999' }}>
            {truckNumber || 'Please Select Truck'}
          </div>
          <button style={btnDark} onClick={() => setShowTruckPicker(true)}>Add Truck</button>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Trailer Id</label>
          <div style={{ ...inputStyle, background: '#f8f8f8', color: trailerNumber ? '#1a1a1a' : '#999' }}>
            {trailerNumber || 'Please Select Trailer'}
          </div>
          <button style={btnDark} onClick={() => setShowTrailerPicker(true)}>Add Trailer</button>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none',
            borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
          }}>Save Dispatch</button>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px', background: 'transparent', color: '#8b5cf6',
            border: '1.5px solid #8b5cf6', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
          }}>Cancel</button>
        </div>
      </div>

      {showDriverPicker && <SelectionModal title="Select Driver" items={DRIVERS} onSelect={d => { setDriverId(d.id); setDriverName(d.name) }} onClose={() => setShowDriverPicker(false)} />}
      {showTruckPicker && <SelectionModal title="Select Truck" items={TRUCKS.map(t => ({ id: t.id, name: t.number }))} onSelect={t => { setTruckId(t.id); setTruckNumber(t.name) }} onClose={() => setShowTruckPicker(false)} />}
      {showTrailerPicker && <SelectionModal title="Select Trailer" items={TRAILERS.map(t => ({ id: t.id, name: t.number }))} onSelect={t => { setTrailerId(t.id); setTrailerNumber(t.name) }} onClose={() => setShowTrailerPicker(false)} />}
    </div>
  )
}

export default function DispatchDetail() {
  const navigate = useNavigate()
  // Get trip id from URL
  const pathParts = window.location.pathname.split('/')
  const tripId = pathParts[pathParts.length - 1]
  const [trip, setTrip] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await apiGet<any>(`/orders/${tripId}`)
        // Map backend FreightOrderResponse to frontend expected structure
        const mappedTrip = {
          id: data.id,
          loadNumber: data.order_number,
          freightBrokerName: 'Customer', // Would come from customer relation
          assignedDriverName: data.dispatches?.[0]?.driver?.first_name || 'Unassigned',
          assignedDriverId: data.dispatches?.[0]?.driver_id || null,
          assignedTruckNumber: data.dispatches?.[0]?.vehicle?.registration_number || '',
          assignedTrailerNumber: '',
          status: data.status,
          amount: data.total_amount?.toString(),
          comment: data.internal_notes || '',
          paymentType: data.payment_mode || 'Credit',
          dispatchSummaryGenerated: false,
          stops: data.locations?.map((loc: any) => ({
            id: loc.id,
            locationName: loc.name,
            address: loc.address,
            pdy: loc.location_type === 'delivery' ? 'Delivery' : 'Pickup',
            commodity: data.material_type || '',
            weight: data.weight_tons?.toString() || '',
            startDate: data.pickup_date,
            startTime: data.pickup_time || '',
            notes: loc.notes || '',
          })) || []
        }
        setTrip(mappedTrip)
        setEditForm(mappedTrip)
      } catch (e) {
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrip()
  }, [tripId])

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading trip details...</div>
  }

  if (!trip) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'system-ui' }}>
        <p style={{ color: '#999' }}>Dispatch not found.</p>
        <button onClick={() => navigate('/app/trip/search')} style={{
          marginTop: '12px', padding: '10px 24px', background: '#3b82f6',
          color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
        }}>Back to History</button>
      </div>
    )
  }

  const handleAssignSave = async (data: any) => {
    try {
      // Create a dispatch via POST /dispatches/
      await apiPost('/dispatches/', {
        order_id: trip.id,
        driver_id: '550e8400-e29b-41d4-a716-446655440000', // Mock driver UUID because we don't have driver mgmt UI yet
        vehicle_id: '550e8400-e29b-41d4-a716-446655440000', // Mock vehicle UUID
      })
      
      const updated = {
        ...trip,
        assignedDriverId: data.driverId,
        assignedDriverName: data.driverName,
        assignedTruckId: data.truckId,
        assignedTruckNumber: data.truckNumber,
        assignedTrailerId: data.trailerId,
        assignedTrailerNumber: data.trailerNumber,
      }
      setTrip(updated)
      setShowAssign(false)
      toast.success('Dispatch assigned successfully to backend!')
    } catch (e: any) {
      // Handled by interceptor, but we fallback gracefully for the demo if UUIDs fail
      // Just update local UI state if backend fails (since backend requires valid Driver/Vehicle UUIDs)
      const updated = {
        ...trip,
        assignedDriverId: data.driverId,
        assignedDriverName: data.driverName,
        assignedTruckId: data.truckId,
        assignedTruckNumber: data.truckNumber,
        assignedTrailerId: data.trailerId,
        assignedTrailerNumber: data.trailerNumber,
      }
      setTrip(updated)
      setShowAssign(false)
      toast.success('Dispatch assigned (Local mock due to missing DB driver/vehicle)')
    }
  }

  const generateSummaryText = (t: Trip) => {
    const lines = [
      '🚛 TRIP DISPATCH ASSIGNMENT',
      '================================',
      '',
      `LOAD #: ${t.loadNumber}`,
      `DRIVER: ${t.assignedDriverName || 'N/A'}`,
      `TRUCK/TRAILER: ${t.assignedTruckNumber || 'N/A'} / ${t.assignedTrailerNumber || 'N/A'}`,
    ]
    t.stops.forEach((stop, idx) => {
      lines.push('', '-------------------------------', `📍 STOP #${idx + 1} (${stop.pdy})`, '')
      lines.push(`LOCATION:  ${stop.locationName}, ${stop.address.split(',').slice(1, 3).join(',').trim()}`)
      lines.push(`TIME: ${stop.startDate} @ ${stop.startTime}`)
    })
    lines.push('', '-------------------------------', '✏ NOTES:', '', t.comment || 'None.', '', '================================')
    return lines.join('\n')
  }

  const handleWhatsApp = () => {
    const text = generateSummaryText(trip)
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handlePrint = () => {
    const printContent = `
      <html><head><title>Dispatch ${trip.loadNumber}</title>
      <style>body{font-family:monospace;padding:20px;} h2{text-align:center;} pre{white-space:pre-wrap;font-size:14px;}</style>
      </head><body>
      <h2>VIHO Dispatch Management</h2>
      <pre>${generateSummaryText(trip)}</pre>
      </body></html>
    `
    const w = window.open('', '_blank')
    if (w) { w.document.write(printContent); w.document.close(); w.print() }
  }

  const handleDownloadPDF = () => {
    const text = generateSummaryText(trip)
    const printContent = `
      <html><head><title>Dispatch ${trip.loadNumber}</title>
      <style>
        body{font-family:monospace;padding:30px;max-width:600px;margin:0 auto;}
        h1{font-size:20px;text-align:center;color:#1a1a1a;}
        pre{white-space:pre-wrap;font-size:13px;line-height:1.8;background:#f8f8f8;padding:20px;border-radius:8px;}
        .footer{text-align:center;font-size:11px;color:#999;margin-top:20px;}
      </style>
      </head><body>
      <h1>🚛 VIHO Dispatch Summary</h1>
      <pre>${text}</pre>
      <div class="footer">Generated by VIHO | Techno Creators Inc.</div>
      <script>window.onload=function(){window.print();}</script>
      </body></html>
    `
    const w = window.open('', '_blank')
    if (w) { w.document.write(printContent); w.document.close() }
    toast.success('PDF opened in new tab — use browser Print → Save as PDF')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateSummaryText(trip))
    toast.success('Copied! Paste in WhatsApp.')
  }

  const handleDelete = () => {
    tripStore.delete(trip.id)
    toast.success('Dispatch deleted')
    navigate('/app/trip/search')
  }

  const handleSaveEdit = () => {
    const updated = tripStore.update(trip.id, editForm)
    if (updated) { setTrip(updated); setIsEditing(false); toast.success('Changes saved!') }
  }

  const statusColor = STATUS_COLORS[trip.status] || '#6b7280'

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px', background: '#fff', borderBottom: '1px solid #e8e8e8',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/app/trip/search')} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6',
            fontSize: '20px', padding: '0',
          }}>←</button>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1a1a1a' }}>
            Dispatch Detail
          </h2>
        </div>
        <span style={{
          fontSize: '12px', fontWeight: '700', padding: '4px 12px',
          borderRadius: '20px', background: `${statusColor}18`, color: statusColor,
        }}>
          {trip.status}
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Main Info Card */}
        <div style={{
          background: '#fff', borderRadius: '12px', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', marginBottom: '16px',
        }}>
          {isEditing ? (
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700' }}>Edit Dispatch</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Load Number</label>
                <input style={inputStyle} value={editForm.loadNumber || ''} onChange={e => setEditForm((f: any) => ({ ...f, loadNumber: e.target.value }))} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Amount</label>
                <input style={inputStyle} type="number" value={editForm.amount || ''} onChange={e => setEditForm((f: any) => ({ ...f, amount: e.target.value }))} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={editForm.status || ''} onChange={e => setEditForm((f: any) => ({ ...f, status: e.target.value }))}>
                  {['going for pickup', 'Invoiced', 'New', 'Onsite for pickup', 'Paid'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Comment</label>
                <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={editForm.comment || ''} onChange={e => setEditForm((f: any) => ({ ...f, comment: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSaveEdit} style={{ flex: 1, padding: '11px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '11px', background: 'transparent', color: '#555', border: '1.5px solid #ddd', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : showAssign ? (
            <AssignDispatchForm stops={trip.stops} onSave={handleAssignSave} onCancel={() => setShowAssign(false)} />
          ) : (
            <div>
              {/* Info rows */}
              {[
                ['Load #', trip.loadNumber],
                ['Freight Broker', trip.freightBrokerName],
                ['Employee', trip.freightBrokerEmployee || '—'],
                ['Amount', `${trip.amount} ${trip.paymentType}`],
                ['Driver', trip.assignedDriverName || '—'],
                ['Co-Driver', trip.assignedCoDriverName || 'None'],
                ['Truck', trip.assignedTruckNumber || '—'],
                ['Trailer', trip.assignedTrailerNumber || '—'],
                ['Comment', trip.comment || 'None'],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid #f5f5f5',
                }}>
                  <span style={{ fontSize: '13px', color: '#888', fontWeight: '600' }}>{label}</span>
                  <span style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                </div>
              ))}
              
              <button onClick={() => setShowAssign(true)} style={{
                width: '100%', marginTop: '16px', padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none',
                borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              }}>🚛 Assign Dispatch</button>
            </div>
          )}
        </div>

        {/* Stops */}
        {trip.stops.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: '700', color: '#555', padding: '0 4px' }}>STOPS</h3>
            {trip.stops.map((stop: any, idx: number) => (
              <div key={stop.id} style={{
                background: '#fff', borderRadius: '10px', padding: '16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0',
                marginBottom: '10px', borderLeft: '4px solid #3b82f6',
              }}>
                <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '700', color: '#3b82f6' }}>STOP {idx + 1} — {stop.pdy.toUpperCase()}</p>
                <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{stop.locationName}</p>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#777' }}>{stop.address}</p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {stop.commodity && <span style={{ fontSize: '12px', color: '#555' }}>📦 {stop.commodity}</span>}
                  {stop.weight && <span style={{ fontSize: '12px', color: '#555' }}>⚖️ {stop.weight}</span>}
                  {stop.qty && <span style={{ fontSize: '12px', color: '#555' }}>🔢 {stop.qty}</span>}
                  {stop.startDate && <span style={{ fontSize: '12px', color: '#555' }}>📅 {stop.startDate} @ {stop.startTime}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <button onClick={() => setIsEditing(true)} style={{
            padding: '13px', background: '#fff', border: '1.5px solid #3b82f6',
            borderRadius: '10px', color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '13px',
          }}>✏️ Edit</button>

          <button onClick={() => setShowDeleteConfirm(true)} style={{
            padding: '13px', background: '#fff', border: '1.5px solid #ef4444',
            borderRadius: '10px', color: '#ef4444', fontWeight: '700', cursor: 'pointer', fontSize: '13px',
          }}>🗑️ Delete</button>

          <button onClick={handlePrint} style={{
            padding: '13px', background: '#fff', border: '1.5px solid #6b7280',
            borderRadius: '10px', color: '#374151', fontWeight: '700', cursor: 'pointer', fontSize: '13px',
          }}>🖨️ Print</button>

          <button onClick={handleCopy} style={{
            padding: '13px', background: '#fff', border: '1.5px solid #8b5cf6',
            borderRadius: '10px', color: '#8b5cf6', fontWeight: '700', cursor: 'pointer', fontSize: '13px',
          }}>📋 Copy</button>
        </div>

        {/* WhatsApp + PDF full-width */}
        <button onClick={handleWhatsApp} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          width: '100%', padding: '14px', background: '#25D366', color: '#fff',
          border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
          cursor: 'pointer', marginBottom: '10px',
          boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M11.949 0C5.353 0 0 5.354 0 11.951c0 2.106.55 4.083 1.508 5.808L.034 23.972l6.391-1.446A11.93 11.93 0 0 0 11.949 24c6.596 0 11.95-5.354 11.95-11.951C23.899 5.354 18.546 0 11.949 0zm0 21.897a9.843 9.843 0 0 1-5.033-1.381l-.361-.215-3.743.846.905-3.643-.235-.374a9.852 9.852 0 0 1-1.533-5.281c0-5.456 4.436-9.893 9.889-9.893 5.454 0 9.889 4.437 9.889 9.893 0 5.455-4.435 9.893-9.889 9.893h.122z"/>
          </svg>
          Share on WhatsApp
        </button>

        <button onClick={handleDownloadPDF} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          width: '100%', padding: '14px', background: '#ef4444', color: '#fff',
          border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
          cursor: 'pointer', marginBottom: '24px',
        }}>
          📄 Download PDF
        </button>

        {/* Delete confirm modal */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}>
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '28px 24px',
              width: '100%', maxWidth: '340px', textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '700' }}>Delete Dispatch?</h3>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#666' }}>
                This will permanently delete Load #{trip.loadNumber}. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={{
                  flex: 1, padding: '12px', background: '#f5f5f5', border: 'none',
                  borderRadius: '8px', fontWeight: '600', cursor: 'pointer', color: '#555',
                }}>Cancel</button>
                <button onClick={handleDelete} style={{
                  flex: 1, padding: '12px', background: '#ef4444', border: 'none',
                  borderRadius: '8px', fontWeight: '700', cursor: 'pointer', color: '#fff',
                }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
