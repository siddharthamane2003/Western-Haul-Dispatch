import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { ArrowLeft, Truck, Calendar, ShieldAlert, CheckCircle2, Wrench, Settings } from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>()

  // Mock vehicle resolver
  const vehicle = {
    id: id || '1',
    vehicle_number: 'Truck-A2',
    license_plate: 'TX-4921',
    status: 'active',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2021,
    mileage: 49450,
    capacity_weight: 40000,
    insurance_expiry: '2026-12-05',
    registration_expiry: '2027-01-10',
    last_service: '2024-06-12',
    next_service: '2024-09-12',
    maintenance_logs: [
      { id: '1', service_type: 'Oil & Filter Change', cost: 350, odometer: 48100, completed_at: '2024-06-12', status: 'completed' },
      { id: '2', service_type: 'Tire Rotation & Alignment', cost: 680, odometer: 42000, completed_at: '2024-04-05', status: 'completed' },
      { id: '3', service_type: 'Brake Pad Replacement', cost: 420, odometer: 35400, completed_at: '2023-11-20', status: 'completed' },
    ]
  }

  const columns = [
    { key: 'service_type', label: 'Service Type', sortable: true },
    { key: 'cost', label: 'Billing Cost', render: (v: any) => `$${v}` },
    { key: 'odometer', label: 'Odometer (mi)', render: (v: any) => v.toLocaleString() },
    { key: 'completed_at', label: 'Date Completed', render: (v: any) => formatDate(v) },
    { key: 'status', label: 'State', render: (v: any) => <StatusBadge status={v} /> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Vehicle Profile: ${vehicle.vehicle_number}`}
        description="Monitor vehicle registration timelines, payload limits, and maintenance logs."
        breadcrumbs={[
          { label: 'Fleet', href: '/vehicles' },
          { label: vehicle.vehicle_number },
        ]}
        actions={
          <Link to="/vehicles">
            <Button variant="outline" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Vehicle Specifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted">Vehicle ID</p>
                  <p className="text-sm font-semibold text-primary mt-0.5 flex items-center gap-1.5">
                    <Truck className="w-4.5 h-4.5 text-blue-500" />
                    {vehicle.vehicle_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Specs / Make & Model</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Odometer Mileage</p>
                  <p className="text-sm text-secondary mt-0.5">
                    {formatNumber(vehicle.mileage)} miles
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted">License Plate Number</p>
                  <p className="text-sm font-mono font-semibold text-primary mt-0.5">{vehicle.license_plate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Max Weight Capacity</p>
                  <p className="text-sm text-secondary mt-0.5">
                    {formatNumber(vehicle.capacity_weight)} lbs
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Active Roster Status</p>
                  <div className="mt-1">
                    <StatusBadge status={vehicle.status} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Maintenance logs */}
          <Card title="Vehicle Maintenance Log History">
            <DataTable data={vehicle.maintenance_logs} columns={columns} />
          </Card>
        </div>

        {/* Expirations & Schedule */}
        <div className="space-y-6">
          <Card title="Compliance Check">
            <div className="space-y-3">
              {[
                { label: 'Carrier Insurance', date: vehicle.insurance_expiry, ok: true },
                { label: 'Vehicle State Registration', date: vehicle.registration_expiry, ok: true },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl border bg-surface-secondary space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-primary">{item.label}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Expires: {formatDate(item.date)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Service scheduler */}
          <Card title="Service Scheduling">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted">Next Scheduled Service</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{formatDate(vehicle.next_service)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted">Last Service Completed</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{formatDate(vehicle.last_service)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export { VehicleDetail }
