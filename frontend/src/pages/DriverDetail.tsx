import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { ArrowLeft, Phone, Mail, Award, Calendar, Star, FileText, CheckCircle2 } from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'

export default function DriverDetail() {
  const { id } = useParams<{ id: string }>()

  // Mock driver profile resolver
  const driver = {
    id: id || '1',
    driver_number: 'DRV-0001',
    first_name: 'John',
    last_name: 'Smith',
    full_name: 'John Smith',
    status: 'available',
    license_class: 'A',
    license_number: 'CDL-90412',
    license_expiry: '2027-04-12',
    phone: '(555) 902-1244',
    email: 'j.smith@westernhaul.com',
    hire_date: '2022-03-15',
    total_trips: 184,
    total_miles: 49450,
    rating: 4.8,
    emergency_contact: 'Mary Smith (Wife) - (555) 902-1245',
    recent_trips: [
      { id: '1', order_number: 'WH-2024-1044', vehicle: 'Truck-B5', route: 'Phoenix -> Los Angeles', miles: 380, status: 'completed', date: '2024-07-18' },
      { id: '2', order_number: 'WH-2024-1041', vehicle: 'Truck-A2', route: 'New Orleans -> Tampa', miles: 640, status: 'completed', date: '2024-07-17' },
      { id: '3', order_number: 'WH-2024-1038', vehicle: 'Truck-A2', route: 'Atlanta -> Savannah', miles: 250, status: 'completed', date: '2024-07-15' },
    ]
  }

  const columns = [
    {
      key: 'order_number',
      label: 'Order ID',
      render: (v: any) => (
        <Link to={`/orders/${v}`} className="font-mono font-semibold text-blue-400 hover:underline">
          {v}
        </Link>
      ),
    },
    { key: 'vehicle', label: 'Vehicle Fleet' },
    { key: 'route', label: 'Route Path' },
    { key: 'miles', label: 'Distance', render: (v: any) => `${v.toLocaleString()} mi` },
    { key: 'status', label: 'Status', render: (v: any) => <StatusBadge status={v} /> },
    { key: 'date', label: 'Date Complete', render: (v: any) => formatDate(v) },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Driver Profile: ${driver.full_name}`}
        description="Review licensing compliance, route metrics, and contact sheets."
        breadcrumbs={[
          { label: 'Drivers', href: '/drivers' },
          { label: driver.full_name },
        ]}
        actions={
          <Link to="/drivers">
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
          <Card title="Commercial Driver Specs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted">Driver Code</p>
                  <p className="text-sm font-mono font-semibold text-primary mt-0.5">{driver.driver_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">CDL License Specs</p>
                  <p className="text-sm font-semibold text-primary mt-0.5 flex items-center gap-1.5">
                    <Award className="w-4.5 h-4.5 text-blue-500" />
                    Class {driver.license_class} Commercial ({driver.license_number})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">License Expiration</p>
                  <p className="text-sm text-secondary mt-0.5 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Expires: {formatDate(driver.license_expiry)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted">Contact Info</p>
                  <div className="flex flex-col gap-1.5 mt-1 text-sm text-secondary">
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted" />{driver.email}</span>
                    <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted" />{driver.phone}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted">Active Roster Status</p>
                  <div className="mt-1">
                    <StatusBadge status={driver.status} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Trip log */}
          <Card title="Recent Trip Logs">
            <DataTable data={driver.recent_trips} columns={columns} />
          </Card>
        </div>

        {/* Audit / Compliance */}
        <div className="space-y-6">
          <Card title="Document Compliance">
            <div className="space-y-3">
              {[
                { label: 'Commercial Driver License (CDL)', ok: true },
                { label: 'Medical Card Certificate', ok: true },
                { label: 'DOT Drug & Alcohol Screen', ok: true },
                { label: 'Background Safety Check', ok: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-2 rounded-xl border bg-surface-secondary">
                  <span className="text-xs text-secondary">{item.label}</span>
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                </div>
              ))}
            </div>
          </Card>

          {/* Stats Summary */}
          <Card title="Lifetime Metrics Summary">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-secondary">Hire Date</span>
                <span className="font-semibold text-primary">{formatDate(driver.hire_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Total Trips Booked</span>
                <span className="font-semibold text-primary">{driver.total_trips}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Total Miles Driven</span>
                <span className="font-semibold text-primary">{formatNumber(driver.total_miles)} mi</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold">
                <span>Driver Rating</span>
                <span className="text-amber-500 flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {driver.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export { DriverDetail }
