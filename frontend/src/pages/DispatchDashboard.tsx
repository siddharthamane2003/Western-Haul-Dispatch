import React, { useState, useEffect, useRef } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { SearchBar } from '@/components/ui/SearchBar'
import {
  MapPin,
  Calendar,
  Truck,
  Users,
  Radio,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { tokenManager } from '@/lib/api'
import toast from 'react-hot-toast'

interface DispatchItem {
  id: string
  dispatch_number: string
  order_number: string
  customer: string
  driver: string | null
  driver_id: string | null
  vehicle: string | null
  vehicle_id: string | null
  status: 'queued' | 'dispatched' | 'in_transit' | 'arrived' | 'completed'
  pickup: string
  delivery: string
  weight: number
  amount: number
  date: string
  last_location?: string
}

export default function DispatchDashboard() {
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [activeDispatch, setActiveDispatch] = useState<DispatchItem | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)

  // Driver/vehicle assignment selection
  const [selectedDriverId, setSelectedDriverId] = useState('1')
  const [selectedVehicleId, setSelectedVehicleId] = useState('1')

  // Live WebSocket references
  const wsRef = useRef<WebSocket | null>(null)

  // Roster lists
  const availableDrivers = [
    { label: 'John Smith (CDL A)', value: '1', name: 'John Smith' },
    { label: 'Jane Doe (CDL A)', value: '2', name: 'Jane Doe' },
    { label: 'David Miller (CDL B)', value: '3', name: 'David Miller' },
  ]

  const availableVehicles = [
    { label: 'Truck-A2 (Freightliner Cascadia)', value: '1', name: 'Truck-A2' },
    { label: 'Truck-B5 (Kenworth T680)', value: '2', name: 'Truck-B5' },
    { label: 'Truck-C1 (Peterbilt 579)', value: '3', name: 'Truck-C1' },
  ]

  // Board list
  const [dispatches, setDispatches] = useState<DispatchItem[]>([
    { id: '1', dispatch_number: 'DSP-0045', order_number: 'WH-1045', customer: 'Apex Logistics', driver: 'John Smith', driver_id: '1', vehicle: 'Truck-A2', vehicle_id: '1', status: 'in_transit', pickup: 'Dallas, TX', delivery: 'Houston, TX', weight: 14200, amount: 4250, date: '2024-07-19', last_location: 'Interstate 45, Buffalo, TX' },
    { id: '2', dispatch_number: 'DSP-0044', order_number: 'WH-1044', customer: 'Summit Freight', driver: 'Jane Doe', driver_id: '2', vehicle: 'Truck-B5', vehicle_id: '2', status: 'dispatched', pickup: 'Phoenix, AZ', delivery: 'Los Angeles, CA', weight: 24800, amount: 6800, date: '2024-07-18', last_location: 'Terminal Yard, Phoenix, AZ' },
    { id: '3', dispatch_number: 'DSP-0043', order_number: 'WH-1043', customer: 'Pacific Transport', driver: null, driver_id: null, vehicle: null, vehicle_id: null, status: 'queued', pickup: 'Seattle, WA', delivery: 'Portland, OR', weight: 8900, amount: 3100, date: '2024-07-18' },
    { id: '4', dispatch_number: 'DSP-0042', order_number: 'WH-1042', customer: 'Rocky Mountain Cargo', driver: 'David Miller', driver_id: '3', vehicle: 'Truck-C1', vehicle_id: '3', status: 'arrived', pickup: 'Denver, CO', delivery: 'Salt Lake City, UT', weight: 32000, amount: 7500, date: '2024-07-17', last_location: 'Salt Lake Delivery Dock' },
    { id: '5', dispatch_number: 'DSP-0041', order_number: 'WH-1041', customer: 'Gulf Coast Shipping', driver: 'John Smith', driver_id: '1', vehicle: 'Truck-A2', vehicle_id: '1', status: 'completed', pickup: 'New Orleans, LA', delivery: 'Tampa, FL', weight: 45000, amount: 2900, date: '2024-07-17', last_location: 'Tampa Bay Logistics Port' },
  ])

  // WebSocket connection effect
  useEffect(() => {
    const token = tokenManager.get() || 'demo-token'
    let wsHost = window.location.host
    let wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    
    if (import.meta.env.VITE_API_URL) {
      try {
        const urlObj = new URL(import.meta.env.VITE_API_URL)
        wsHost = urlObj.host
        wsProtocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:'
      } catch (e) {
        wsHost = import.meta.env.VITE_API_URL.replace(/^(https?:\/\/)?/, '')
        wsProtocol = import.meta.env.VITE_API_URL.startsWith('https') ? 'wss:' : 'ws:'
      }
    }
    const wsUrl = `${wsProtocol}//${wsHost}/api/v1/ws/connect?token=${token}`

    const connectWS = () => {
      try {
        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
          setWsConnected(true)
          loggerInfo('WebSocket connected')
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            handleIncomingWSMessage(message)
          } catch (err) {
            console.error('Error parsing WebSocket message', err)
          }
        }

        ws.onclose = () => {
          setWsConnected(false)
          loggerInfo('WebSocket disconnected')
          // Auto-reconnect after 5 seconds
          setTimeout(connectWS, 5000)
        }

        ws.onerror = () => {
          setWsConnected(false)
          ws.close()
        }
      } catch {
        setWsConnected(false)
      }
    }

    connectWS()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Mock live coordinates simulation for "in_transit" drivers when in local/demo mode
  useEffect(() => {
    const interval = setInterval(() => {
      setDispatches(prev =>
        prev.map(d => {
          if (d.status === 'in_transit') {
            const locations = [
              'Interstate 45, Buffalo, TX',
              'I-45 South, Huntsville, TX',
              'Conroe Expressway, Conroe, TX',
              'North Loop 610, Houston, TX',
            ]
            const currIdx = locations.indexOf(d.last_location || '')
            const nextIdx = (currIdx + 1) % locations.length
            return {
              ...d,
              last_location: locations[nextIdx],
            }
          }
          return d
        })
      )
    }, 15000) // update locations every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const handleIncomingWSMessage = (msg: any) => {
    if (msg.type === 'dispatch_update') {
      const data = msg.data
      setDispatches(prev =>
        prev.map(d => (d.id === data.id ? { ...d, ...data } : d))
      )
      toast.success(`Dispatch ${data.dispatch_number} updated via live gateway`)
    }
  }

  const loggerInfo = (msg: string) => {
    console.log(`[WebSocket] ${msg}`)
  }

  // Kanban update handler
  const handleUpdateStatus = (id: string, newStatus: DispatchItem['status']) => {
    setDispatches(prev =>
      prev.map(d => {
        if (d.id === id) {
          // Send update via WebSocket if connected
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: 'dispatch_update',
                data: { id, status: newStatus },
              })
            )
          }
          return { ...d, status: newStatus }
        }
        return d
      })
    )
    toast.success(`Dispatch updated to ${newStatus}`)
    setIsDetailModalOpen(false)
  }

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeDispatch) return

    const selectedDrv = availableDrivers.find(d => d.value === selectedDriverId)
    const selectedVeh = availableVehicles.find(v => v.value === selectedVehicleId)

    setDispatches(prev =>
      prev.map(d => {
        if (d.id === activeDispatch.id) {
          return {
            ...d,
            driver: selectedDrv?.name || null,
            driver_id: selectedDriverId,
            vehicle: selectedVeh?.name || null,
            vehicle_id: selectedVehicleId,
            status: 'dispatched',
          }
        }
        return d
      })
    )

    toast.success(`Assigned ${selectedDrv?.name} & ${selectedVeh?.name} to order ${activeDispatch.order_number}`)
    setIsAssignModalOpen(false)
  }

  const openAssignModal = (disp: DispatchItem) => {
    setActiveDispatch(disp)
    setSelectedDriverId(disp.driver_id || '1')
    setSelectedVehicleId(disp.vehicle_id || '1')
    setIsAssignModalOpen(true)
  }

  const openDetailModal = (disp: DispatchItem) => {
    setActiveDispatch(disp)
    setIsDetailModalOpen(true)
  }

  const columns: Array<{ id: DispatchItem['status']; title: string; color: string }> = [
    { id: 'queued', title: 'Queued Loadings', color: 'border-slate-500/20' },
    { id: 'dispatched', title: 'Dispatched Out', color: 'border-blue-500/20' },
    { id: 'in_transit', title: 'In Transit', color: 'border-purple-500/20' },
    { id: 'arrived', title: 'Arrived Dock', color: 'border-amber-500/20' },
    { id: 'completed', title: 'Completed Deliveries', color: 'border-emerald-500/20' },
  ]

  const filteredDispatches = dispatches.filter(d => {
    return (
      d.dispatch_number.toLowerCase().includes(search.toLowerCase()) ||
      d.order_number.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      d.pickup.toLowerCase().includes(search.toLowerCase()) ||
      d.delivery.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Dispatch Board"
        description="Drag, drop, and track en-route drivers, active vehicles, and shipment timelines."
        actions={
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold select-none border bg-surface-secondary',
                wsConnected ? 'text-emerald-400 border-emerald-500/10' : 'text-slate-400 border-slate-500/10'
              )}
            >
              <Radio className={cn('w-4 h-4', wsConnected && 'animate-pulse')} />
              {wsConnected ? 'WebSockets Live' : 'Offline Mock Mode'}
            </span>
          </div>
        }
      />

      {/* Roster availability quick panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Driver Availability', count: '12 available', detail: '3 on trip • 2 off duty', icon: Users, color: '#10b981' },
          { title: 'Vehicle Availability', count: '18 ready', detail: '2 in shop • 2 retired', icon: Truck, color: '#3b82f6' },
          { title: 'Active Trips Count', count: `${dispatches.filter(d => d.status === 'in_transit').length} active`, detail: 'All running on schedule', icon: Radio, color: '#7c3aed' },
          { title: 'Queued Loadings', count: `${dispatches.filter(d => d.status === 'queued').length} loads`, detail: 'Pending dispatcher assignment', icon: Clock, color: '#f59e0b' },
        ].map(item => (
          <div
            key={item.title}
            className="glass-card p-4 rounded-xl relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${item.color}08 0%, ${item.color}02 100%)` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{item.title}</p>
                <p className="text-lg font-bold text-primary mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.count}</p>
                <p className="text-[10px] text-muted mt-1">{item.detail}</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}15` }}>
                <item.icon className="w-4.5 h-4.5" style={{ color: item.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Quick Filters */}
      <div className="flex gap-4 items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter board by dispatch ID, customer name, route destination..."
          className="max-w-md"
        />
        <Button variant="outline" className="flex items-center gap-1 text-xs select-none">
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        {columns.map(col => {
          const colDispatches = filteredDispatches.filter(d => d.status === col.id)
          return (
            <div
              key={col.id}
              className="flex flex-col gap-3 p-3 rounded-2xl border min-h-[500px]"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)', fontFamily: 'Outfit, sans-serif' }}>
                  {col.title}
                </h3>
                <Badge variant="blue" size="sm">{colDispatches.length}</Badge>
              </div>

              {/* Cards wrapper */}
              <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                {colDispatches.map(disp => (
                  <div
                    key={disp.id}
                    onClick={() => openDetailModal(disp)}
                    className="glass-card p-4 flex flex-col gap-3 cursor-pointer group hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                          {disp.dispatch_number}
                        </span>
                        <span className="text-[9px] font-mono text-muted uppercase">
                          Order {disp.order_number}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-primary mt-1.5">{disp.customer}</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-secondary">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-muted" />
                        <span className="truncate">
                          {disp.pickup.split(',')[0]} → {disp.delivery.split(',')[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-secondary">
                        <Truck className="w-3.5 h-3.5 flex-shrink-0 text-muted" />
                        <span className="truncate">
                          {disp.vehicle ? disp.vehicle : <span className="text-muted italic">No vehicle</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-secondary">
                        <Users className="w-3.5 h-3.5 flex-shrink-0 text-muted" />
                        <span className="truncate">
                          {disp.driver ? disp.driver : <span className="text-muted italic">No driver</span>}
                        </span>
                      </div>
                    </div>

                    {disp.last_location && (
                      <div className="pt-2 border-t mt-1 flex items-start gap-1" style={{ borderColor: 'var(--border-subtle)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1 flex-shrink-0 animate-ping-soft" />
                        <p className="text-[10px] text-muted truncate">
                          Live: {disp.last_location}
                        </p>
                      </div>
                    )}

                    {!disp.driver && (
                      <Button
                        type="button"
                        variant="primary"
                        className="w-full text-xs font-semibold py-1 h-8 mt-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          openAssignModal(disp)
                        }}
                      >
                        Assign Driver
                      </Button>
                    )}
                  </div>
                ))}

                {colDispatches.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-slate-500/20 text-center min-h-[120px]">
                    <p className="text-[10px] text-muted">No dispatches in this column.</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Assign Driver / Vehicle Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Roster Resources" size="sm">
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <Select
            label="Assign Driver"
            value={selectedDriverId}
            onChange={setSelectedDriverId}
            options={availableDrivers}
          />

          <Select
            label="Assign Vehicle"
            value={selectedVehicleId}
            onChange={setSelectedVehicleId}
            options={availableVehicles}
          />

          <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm Assignment</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Operational dispatch detail" size="md">
        {activeDispatch && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-bold text-primary">{activeDispatch.customer}</h3>
                <StatusBadge status={activeDispatch.status} />
              </div>
              <p className="text-xs text-muted">
                Dispatch Code: <span className="font-mono font-semibold">{activeDispatch.dispatch_number}</span> • Order: <span className="font-mono font-semibold">{activeDispatch.order_number}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y py-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <p className="text-[10px] text-muted uppercase">Pickup Location</p>
                <p className="text-xs font-semibold mt-1">{activeDispatch.pickup}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase">Delivery Location</p>
                <p className="text-xs font-semibold mt-1">{activeDispatch.delivery}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase">Odometer/Roster</p>
                <p className="text-xs font-semibold mt-1">{activeDispatch.vehicle || 'Not Assigned'}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase">Roster Driver</p>
                <p className="text-xs font-semibold mt-1">{activeDispatch.driver || 'Not Assigned'}</p>
              </div>
            </div>

            {activeDispatch.last_location && (
              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1 flex-shrink-0 animate-ping" />
                <div>
                  <p className="text-xs font-bold text-purple-400">Live GPS Coordinate Status</p>
                  <p className="text-xs text-secondary mt-1">{activeDispatch.last_location}</p>
                </div>
              </div>
            )}

            {/* Quick action buttons */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] text-muted uppercase font-semibold">Dispatcher actions</p>
              <div className="flex gap-2 flex-wrap">
                {activeDispatch.status === 'dispatched' && (
                  <Button variant="primary" className="flex items-center gap-1 text-xs py-1.5" onClick={() => handleUpdateStatus(activeDispatch.id, 'in_transit')}>
                    <Play className="w-3.5 h-3.5" />
                    Start Transit
                  </Button>
                )}
                {activeDispatch.status === 'in_transit' && (
                  <Button variant="primary" className="flex items-center gap-1 text-xs py-1.5" onClick={() => handleUpdateStatus(activeDispatch.id, 'arrived')}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Arrive Dock
                  </Button>
                )}
                {activeDispatch.status === 'arrived' && (
                  <Button variant="primary" className="flex items-center gap-1 text-xs py-1.5" onClick={() => handleUpdateStatus(activeDispatch.id, 'completed')}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Complete Delivery
                  </Button>
                )}
                <Button variant="outline" className="text-xs py-1.5 hover:text-red-400 hover:bg-red-500/5 border-slate-500/20" onClick={() => handleUpdateStatus(activeDispatch.id, 'queued')}>
                  Reset to Queue
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
export { DispatchDashboard }
