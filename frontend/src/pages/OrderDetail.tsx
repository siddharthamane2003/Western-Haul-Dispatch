import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { MapPin, Calendar, Truck, DollarSign, ArrowLeft, Layers, FileText, CheckCircle2 } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()

  // Mock order resolver
  const orderNumber = id || 'WH-2024-1045'
  const order = {
    order_number: orderNumber,
    customer: 'Apex Logistics',
    freight_type: 'General Cargo',
    weight: 14200,
    volume: 38,
    pieces: 24,
    description: 'Industrial machinery components and metal fittings.',
    special_instructions: 'Keep dry. Do not double stack. Require liftgate at delivery.',
    pickup_date: '2024-07-19',
    delivery_date: '2024-07-21',
    base_rate: 3800,
    fuel_surcharge: 450,
    accessorial_charges: 0,
    total_amount: 4250,
    status: 'in_transit',
    pickup_address: '1400 Industrial Blvd, Dallas, TX 75201',
    delivery_address: '8900 Port of Houston Gate 4, Houston, TX 77029',
    timeline: [
      { id: '1', status: 'Booked', desc: 'Order received and confirmed.', time: '2024-07-17 10:30 AM', active: true },
      { id: '2', status: 'Assigned', desc: 'Assigned to driver John Smith and Truck-A2.', time: '2024-07-18 02:15 PM', active: true },
      { id: '3', status: 'Dispatched', desc: 'Load dispatched from terminal.', time: '2024-07-19 07:00 AM', active: true },
      { id: '4', status: 'In Transit', desc: 'Shipment is currently en route.', time: '2024-07-19 09:30 AM', active: true },
      { id: '5', status: 'Delivered', desc: 'Signed POD received.', time: 'Pending Delivery', active: false },
    ],
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order Details: ${order.order_number}`}
        description="Detailed freight route, status logs, financial audits, and cargo contents."
        breadcrumbs={[
          { label: 'Orders', href: '/orders' },
          { label: order.order_number },
        ]}
        actions={
          <Link to="/orders">
            <Button variant="outline" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core details */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Freight Route & Schedule">
            <div className="space-y-6">
              {/* Pickup / Delivery Points */}
              <div className="relative pl-8 space-y-8">
                {/* Visual Line */}
                <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-dashed border-l-2 border-dashed" style={{ borderColor: 'var(--border-color)' }} />

                {/* Pickup Point */}
                <div className="relative">
                  <div className="absolute -left-8 w-7 h-7 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">PICKUP</span>
                    <p className="text-sm font-semibold text-primary mt-1.5">{order.pickup_address}</p>
                    <p className="text-xs text-muted mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Scheduled: {formatDate(order.pickup_date)}
                    </p>
                  </div>
                </div>

                {/* Delivery Point */}
                <div className="relative">
                  <div className="absolute -left-8 w-7 h-7 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">DELIVERY</span>
                    <p className="text-sm font-semibold text-primary mt-1.5">{order.delivery_address}</p>
                    <p className="text-xs text-muted mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Scheduled: {formatDate(order.delivery_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Cargo information */}
          <Card title="Cargo Contents & Specs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-4 mb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <p className="text-xs text-muted">Material Type</p>
                <p className="text-sm font-semibold text-primary mt-0.5">{order.freight_type}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Total Weight</p>
                <p className="text-sm font-semibold text-primary mt-0.5">{order.weight.toLocaleString()} lbs</p>
              </div>
              <div>
                <p className="text-xs text-muted">Cargo Size</p>
                <p className="text-sm font-semibold text-primary mt-0.5">{order.pieces} pieces • {order.volume} CBM</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted">Description</p>
              <p className="text-xs text-secondary mt-1">{order.description}</p>
            </div>
            {order.special_instructions && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs font-semibold text-amber-500">Special Instructions</p>
                <p className="text-[11px] text-secondary mt-1">{order.special_instructions}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Status Timeline & Pricing */}
        <div className="space-y-6">
          {/* Status badge */}
          <Card title="Current Status">
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <StatusBadge status={order.status} />
              <Link to="/dispatch" className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold">
                <Truck className="w-3.5 h-3.5" />
                Live Center
              </Link>
            </div>

            {/* Timeline progression */}
            <div className="space-y-4">
              {order.timeline.map((t, idx) => (
                <div key={t.id} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        t.active
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-slate-400 dark:border-slate-600 bg-transparent text-slate-400'
                      }`}
                    >
                      {t.active && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    {idx < order.timeline.length - 1 && (
                      <div className="w-0.5 h-10 bg-slate-300 dark:bg-slate-700" />
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${t.active ? 'text-primary' : 'text-muted'}`}>
                      {t.status}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">{t.desc}</p>
                    <p className="text-[9px] text-muted mt-1 leading-none font-medium">{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pricing Audit */}
          <Card title="Billing Details">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-secondary">Base Rate</span>
                <span className="font-semibold text-primary">{formatCurrency(order.base_rate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Fuel Surcharge</span>
                <span className="font-semibold text-primary">{formatCurrency(order.fuel_surcharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Accessorial Charges</span>
                <span className="font-semibold text-primary">{formatCurrency(order.accessorial_charges)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-sm font-bold">
                <span>Total Amount</span>
                <span className="text-blue-500">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export { OrderDetail }
