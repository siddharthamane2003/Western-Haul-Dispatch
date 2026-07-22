import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { tripStore } from '@/lib/data'
import toast from 'react-hot-toast'

export default function DispatchSummary() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  const textRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  // Custom Dispatch Message from user
  const [customMessage, setCustomMessage] = useState('')

  // Check state or database
  const stateTrip = location.state?.trip
  const trip = stateTrip || (id ? tripStore.getById(id) : null)

  const generateSummaryText = () => {
    if (!trip) return ''

    const lines: string[] = []
    
    // Add custom dispatch message at the top if present
    if (customMessage.trim()) {
      lines.push('💬 ADDITIONAL MESSAGE:')
      lines.push(customMessage)
      lines.push('================================')
      lines.push('')
    }

    lines.push('🚛 TRIP DISPATCH ASSIGNMENT')
    lines.push('================================')
    lines.push('')
    lines.push(`LOAD #: ${trip.loadNumber || trip.order_number || 'WH-000001'}`)
    lines.push(`DRIVER: ${trip.assignedDriverName || trip.driver || 'N/A'}`)
    lines.push(`TRUCK/TRAILER: ${trip.assignedTruckNumber || trip.truck || 'N/A'} / ${trip.assignedTrailerNumber || trip.trailer || 'N/A'}`)

    const stopsList = trip.stops || []
    stopsList.forEach((stop: any, idx: number) => {
      lines.push('')
      lines.push('-------------------------------')
      lines.push(`📍 STOP #${idx + 1} (${stop.pdy || stop.location_type || 'Stop'})`)
      lines.push('')
      lines.push(`LOCATION:  ${stop.locationName || stop.name || 'Unknown Location'}`)
      if (stop.address) lines.push(`ADDRESS:   ${stop.address}`)
      if (stop.startDate || stop.pickup_date) lines.push(`TIME: ${stop.startDate || stop.pickup_date}`)
      if (stop.commodity) lines.push(`COMMODITY: ${stop.commodity}`)
      if (stop.weight) lines.push(`WEIGHT: ${stop.weight}`)
      if (stop.qty) lines.push(`QTY: ${stop.qty}`)
    })

    lines.push('')
    lines.push('-------------------------------')
    lines.push('✏ NOTES:')
    lines.push('')
    lines.push(trip.comment || trip.internal_notes || 'None.')
    lines.push('')
    lines.push('================================')

    return lines.join('\n')
  }

  const summaryText = generateSummaryText()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopied(true)
      toast.success('Dispatch summary copied!')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      if (textRef.current) {
        const sel = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(textRef.current)
        sel?.removeAllRanges()
        sel?.addRange(range)
        toast.success('Text selected! Copy it.')
      }
    }
  }

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(summaryText)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  if (!trip) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'system-ui' }}>
        <p style={{ color: '#999', fontSize: '16px' }}>Trip not found.</p>
        <button onClick={() => navigate('/app/trip/search')} style={{
          marginTop: '16px', padding: '10px 24px', background: '#3b82f6',
          color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
        }}>
          Back to Trip List
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* Add Dispatch Message Section at the Top */}
      <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '800', color: '#1a2744' }}>Add Dispatch Message</h3>
        <textarea
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '10px',
            border: '1.5px solid #ddd',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
          placeholder="Type any additional dispatch message or instructions here..."
          value={customMessage}
          onChange={e => setCustomMessage(e.target.value)}
        />
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{
          background: '#fff', borderRadius: '12px', padding: '16px 20px',
          marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
          fontSize: '13px', color: '#555', lineHeight: 1.6,
        }}>
          <p style={{ margin: 0 }}>
            Please select the text below and copy it to send via WhatsApp or click <strong>Share on WhatsApp</strong>.
          </p>
        </div>

        {/* Summary text box */}
        <div style={{
          background: '#fff', borderRadius: '12px', padding: '0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e8e8e8',
          marginBottom: '16px', overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 16px', background: '#f8f8f8', borderBottom: '1px solid #e8e8e8',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Generated Dispatch Summary
            </span>
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 14px', background: copied ? '#22c55e' : '#3b82f6',
                color: '#fff', border: 'none', borderRadius: '6px',
                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <pre
            ref={textRef}
            style={{
              margin: 0,
              padding: '20px',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '1.7',
              color: '#1a1a1a',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              userSelect: 'text',
              cursor: 'text',
              background: '#fff',
            }}
          >
            {summaryText}
          </pre>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button
            onClick={handleWhatsApp}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width: '100%', padding: '14px', background: '#25D366',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
            }}
          >
            Share on WhatsApp
          </button>

          <button
            onClick={() => navigate('/app/trip/search')}
            style={{
              display: 'block', width: '100%', padding: '13px', background: '#3b82f6',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer', textAlign: 'center',
            }}
          >
            Back to Dispatch List
          </button>
        </div>
      </div>
    </div>
  )
}
