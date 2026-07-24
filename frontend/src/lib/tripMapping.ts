/** Shared order → trip UI mapping (Trip ID = order_number, Load = load_number). */

export interface MappedStop {
  id: string
  sequence: number
  locationId?: number | null
  locationName: string
  address: string
  pdy: string
  receiver: string
  commodity: string
  weight: string
  qty: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  appt: string
  apptDate: string
  apptTime: string
  notes: string
}

export function parseFreightBrokerFromNotes(
  internalNotes: string | null | undefined,
  customer?: { company_name?: string } | null,
  customerName?: string | null,
): string {
  let freightBroker = '—'
  const notes = internalNotes || ''
  if (notes.startsWith('{')) {
    try {
      const parsed = JSON.parse(notes) as Record<string, string>
      freightBroker = parsed.freightBrokerName || parsed.freight_broker || '—'
    } catch {
      /* ignore */
    }
  } else if (notes) {
    freightBroker = notes
  }
  if (freightBroker === '—') {
    freightBroker = customer?.company_name || customerName || '—'
  }
  return freightBroker
}

/** Map API locations to stops sorted by sequence (1st = pickup, 2nd = delivery). */
export function mapApiLocationsToStops(locations: unknown[]): MappedStop[] {
  return (locations || [])
    .map((raw: any, idx: number) => ({
      id: raw.id?.toString() || '',
      sequence: raw.sequence ?? idx + 1,
      locationId: raw.location_id ?? null,
      locationName: raw.name || raw.locationName || '',
      address: raw.address || '',
      pdy: raw.location_type
        ? raw.location_type.charAt(0).toUpperCase() + raw.location_type.slice(1)
        : raw.pdy || 'Pickup',
      receiver: raw.contact_person || raw.receiver || '—',
      commodity: raw.commodity || '',
      weight: raw.weight?.toString() || '',
      qty: raw.qty?.toString() || '',
      startDate: raw.start_date || raw.startDate || '',
      startTime: raw.start_time || raw.startTime || '',
      endDate: raw.end_date || raw.endDate || '',
      endTime: raw.end_time || raw.endTime || '',
      appt: raw.appt ? 'Yes' : 'No',
      apptDate: raw.appt_date || raw.apptDate || '',
      apptTime: raw.appt_time || raw.apptTime || '',
      notes: raw.notes || '',
    }))
    .sort((a, b) => a.sequence - b.sequence)
}

/** 1st location = pickup, 2nd = delivery/receiver, 3+ = extra stops. */
export function getStopsByPosition(stops: MappedStop[]) {
  const first = stops[0]
  const second = stops[1]
  const extra = stops.slice(2)
  return {
    pickupLocationName: first?.locationName || '—',
    /** Receiver column = 2nd location name (PDY Delivery). */
    deliveryLocationName: second?.locationName || '—',
    deliveryReceiver: second?.locationName || '—',
    extraStopsLabel:
      extra.length > 0
        ? extra.map(s => s.locationName).filter(Boolean).join(', ')
        : 'None',
    startStopName: first?.locationName || '',
    endStopName: second?.locationName || '',
  }
}

export function mapOrderToTripDisplay(item: any) {
  const stops = mapApiLocationsToStops(item.locations || [])
  const pos = getStopsByPosition(stops)

  const mapped = {
    id: item.id,
    /** Trip ID = system order_number (e.g. WH-000001). */
    tripId: item.order_number || '—',
    /** Load = user-entered load_number (e.g. LD-001). */
    loadNumber: item.load_number || '—',
    freightBrokerName: parseFreightBrokerFromNotes(
      item.internal_notes,
      item.customer,
      item.customer_name,
    ),
    amount: item.freight_amount?.toString() || item.total_amount?.toString() || '0',
    paymentType: item.payment_mode || 'CAD',
    status: item.status || 'pending',
    stops,
    pickupLocationName: pos.pickupLocationName,
    deliveryLocationName: pos.deliveryLocationName,
    deliveryReceiver: pos.deliveryReceiver,
    extraStopsLabel: pos.extraStopsLabel,
    startStopName: pos.startStopName,
    endStopName: pos.endStopName,
    comment: item.internal_notes || '',
    customerId: item.customer_id,
    customerName: item.customer?.company_name || item.customer_name || '—',
  }

  // #region agent log
  fetch('http://127.0.0.1:7683/ingest/9880e8b7-d01d-4c70-b168-7c4233b2b147',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a44aee'},body:JSON.stringify({sessionId:'a44aee',location:'tripMapping.ts:mapOrderToTripDisplay',message:'trip mapped',data:{tripId:mapped.tripId,loadNumber:mapped.loadNumber,pickup:mapped.pickupLocationName,delivery:mapped.deliveryReceiver,stopCount:stops.length},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  return mapped
}
