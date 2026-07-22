// ─────────────────────────────────────────────────────────
// MASTER DATA STORE — All dropdown lists matching client app
// ─────────────────────────────────────────────────────────

export const FREIGHT_BROKERS = [
  { id: 1, name: 'B2B TRANSPORTATION SERVICES, INC.', employees: ['CHRISTIAN', 'MICHAEL', 'SARAH'] },
  { id: 2, name: 'CI CALLA FARMS SAS', employees: ['JOHN', 'MARIA'] },
  { id: 3, name: 'integrity Express Logistics', employees: ['DAVID', 'EMILY'] },
  { id: 4, name: 'The GTI Group', employees: ['ROBERT', 'LISA'] },
  { id: 5, name: ': Kevin Warren', employees: ['KEVIN WARREN'] },
  { id: 6, name: '3 Rivers Logistics, Inc', employees: ['JAMES', 'ANNA'] },
  { id: 7, name: 'ABC Transportation, INC', employees: ['MARK', 'SUSAN'] },
  { id: 8, name: 'Absolute transport ltd', employees: ['PAUL', 'HELEN'] },
  { id: 9, name: 'AGX', employees: ['GEORGE', 'PATRICIA'] },
  { id: 10, name: 'Redwood Multimodal', employees: ['THOMAS', 'BARBARA'] },
  { id: 11, name: 'BBI LOGISTIC', employees: ['CHARLES', 'MARGARET'] },
  { id: 12, name: 'Medallion Transport & Logistics', employees: ['HENRY', 'DOROTHY'] },
  { id: 14, name: 'BBL Logistics', employees: ['JOHN', 'BRAD'] },
  { id: 15, name: 'Medetaloition Transport & Logistics', employees: ['DAVE', 'STEVE'] },
]

export const LOCATIONS = [
  { id: 1, name: 'ABC Supply-Brandenton', address: '1234 Supply Dr, Bradenton, FL 34205, USA' },
  { id: 2, name: 'ALDI - WEBBERVILLE', address: '5678 Main St, Webberville, MI 48892, USA' },
  { id: 3, name: 'BALL CORPORATION', address: '9101 Ball Way, Muncie, IN 47302, USA' },
  { id: 4, name: 'BASF CORP. C/O MIDWEST', address: '1122 Chemical Blvd, Midwest City, OK 73110, USA' },
  // Buffalo to Canada Cartage removed (id 5 to 9)
  { id: 10, name: 'CASE OHIO', address: '222 Case Ave, Columbus, OH 43215, USA' },
  // CASEY'S DC removed
  // CCCI to Champaign removed (id 12 to 15)
  { id: 16, name: 'COBRA PLASTICS', address: '888 Plastic Way, Youngstown, OH 44501, USA' },
  { id: 17, name: 'DIANA BROOKS', address: '2 Sorbello Rd Pedricktown, NJ, 08067 Pedricktown, NJ, USA' },
  { id: 18, name: 'FENIX MARINE TERMINAL', address: '999 Terminal Dr, Los Angeles, CA 90731, USA' },
  { id: 19, name: 'HOOD CONTAINER JACKSONVILLE', address: '100 Container Blvd, Jacksonville, FL 32099, USA' },
  { id: 20, name: 'INNO PAK', address: '200 Inno Dr, Plymouth, WI 53073, USA' },
  { id: 21, name: 'Kimberly-Clark', address: '300 KC Blvd, Neenah, WI 54956, USA' },
]

export const DRIVERS = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'Ali' },
  { id: 3, name: 'Anthony' },
  { id: 4, name: 'balhar chahal' },
  { id: 5, name: 'Deigo' },
  { id: 6, name: 'FRANCISCO' },
  { id: 7, name: 'GIORGI LHABEISHVILL' },
  { id: 8, name: 'JARMAN DHALIWAL' },
  { id: 9, name: 'John Smith' },
  { id: 10, name: 'Jane Doe' },
]

export const TRUCKS = [
  { id: 1, number: '256', name: 'Truck 256' },
  { id: 2, number: 'TRK-001', name: 'TRK-001' },
  { id: 3, number: 'TRK-002', name: 'TRK-002' },
  { id: 4, number: 'TRK-003', name: 'TRK-003' },
]

export const TRAILERS = [
  { id: 1, number: 'KF105', name: 'KF105' },
  { id: 2, number: 'TRL-201', name: 'TRL-201' },
  { id: 3, number: 'TRL-202', name: 'TRL-202' },
  { id: 4, number: 'TRL-203', name: 'TRL-203' },
]

export const TRIP_STATUSES = [
  'going for pickup',
  'Invoiced',
  'New',
  'Onsite for pickup',
  'Paid',
]

// Maps frontend display label → backend OrderStatus enum value
export const STATUS_MAP: Record<string, string> = {
  'going for pickup': 'going_for_pickup',
  'Invoiced':         'invoiced',
  'New':              'pending',
  'Onsite for pickup':'onsite_for_pickup',
  'Paid':             'paid',
  'pending':          'pending',
  'assigned':         'assigned',
}

export const PDY_TYPES = [
  'Cross Dock',
  'Delivery',
  'Pickup',
  'Yard',
]

export const PAYMENT_TYPES = ['CAD', 'USD']

// Types
export interface TripStop {
  id: string
  locationId: number | null
  locationName: string
  address: string
  pdy: string
  commodity: string
  weight: string
  qty: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  appt: 'Yes' | 'No'
  apptDate: string
  apptTime: string
  notes: string
}

export interface Trip {
  id: string
  loadNumber: string
  freightBrokerId: number | null
  freightBrokerName: string
  freightBrokerEmployee: string
  amount: string
  paymentType: string
  status: string
  comment: string
  stops: TripStop[]
  assignedDriverId: number | null
  assignedDriverName: string
  assignedCoDriverId: number | null
  assignedCoDriverName: string
  assignedTruckId: number | null
  assignedTruckNumber: string
  assignedTrailerId: number | null
  assignedTrailerNumber: string
  dispatchSummaryGenerated: boolean
  createdAt: string
}

// In-memory trip store (replaces backend for now)
let trips: Trip[] = [
  {
    id: '1',
    loadNumber: '85852',
    freightBrokerId: 1,
    freightBrokerName: 'B2B TRANSPORTATION SERVICES, INC.',
    freightBrokerEmployee: 'CHRISTIAN',
    amount: '1800',
    paymentType: 'USD',
    status: 'going for pickup',
    comment: '',
    stops: [
      {
        id: 's1',
        locationId: 17,
        locationName: 'DIANA BROOKS',
        address: '2 Sorbello Rd Pedricktown, NJ, 08067 Pedricktown, NJ, USA',
        pdy: 'Pickup',
        commodity: 'Empty can',
        weight: '3450',
        qty: '50',
        startDate: '06/02/2026',
        startTime: '09:00',
        endDate: '06/02/2026',
        endTime: '09:00',
        appt: 'No',
        apptDate: '',
        apptTime: '',
        notes: '',
      },
      {
        id: 's2',
        locationId: 9,
        locationName: 'Canada Cartage',
        address: '111 Industrial Rd, Nisku, AB T9E 0V4, Canada',
        pdy: 'Delivery',
        commodity: 'Empty can',
        weight: '3450',
        qty: '50',
        startDate: '06/03/2026',
        startTime: '16:00',
        endDate: '06/03/2026',
        endTime: '16:00',
        appt: 'No',
        apptDate: '',
        apptTime: '',
        notes: '',
      },
    ],
    assignedDriverId: 2,
    assignedDriverName: 'Ali',
    assignedCoDriverId: null,
    assignedCoDriverName: 'None',
    assignedTruckId: 1,
    assignedTruckNumber: '256',
    assignedTrailerId: 1,
    assignedTrailerNumber: 'KF105',
    dispatchSummaryGenerated: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    loadNumber: '1201',
    freightBrokerId: 11,
    freightBrokerName: 'BBI LOGISTIC',
    freightBrokerEmployee: 'CHARLES',
    amount: '1800',
    paymentType: 'USD',
    status: 'New',
    comment: '',
    stops: [],
    assignedDriverId: null,
    assignedDriverName: '',
    assignedCoDriverId: null,
    assignedCoDriverName: 'None',
    assignedTruckId: null,
    assignedTruckNumber: '',
    assignedTrailerId: null,
    assignedTrailerNumber: '',
    dispatchSummaryGenerated: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    loadNumber: '1485',
    freightBrokerId: 7,
    freightBrokerName: 'ABC Transportation, INC',
    freightBrokerEmployee: 'MARK',
    amount: '1500',
    paymentType: 'USD',
    status: 'Invoiced',
    comment: '',
    stops: [],
    assignedDriverId: 1,
    assignedDriverName: 'Alex',
    assignedCoDriverId: null,
    assignedCoDriverName: 'None',
    assignedTruckId: 2,
    assignedTruckNumber: 'TRK-001',
    assignedTrailerId: 2,
    assignedTrailerNumber: 'TRL-201',
    dispatchSummaryGenerated: true,
    createdAt: new Date().toISOString(),
  },
]

export const tripStore = {
  getAll: () => trips,
  getById: (id: string) => trips.find(t => t.id === id) || null,
  add: (trip: Omit<Trip, 'id' | 'createdAt'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    trips = [newTrip, ...trips]
    return newTrip
  },
  update: (id: string, updates: Partial<Trip>) => {
    trips = trips.map(t => t.id === id ? { ...t, ...updates } : t)
    return trips.find(t => t.id === id) || null
  },
  delete: (id: string) => {
    trips = trips.filter(t => t.id !== id)
  },
}
