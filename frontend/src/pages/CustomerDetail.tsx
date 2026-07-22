import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { ArrowLeft, Mail, Phone, DollarSign, Package, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()

  // Mock customer info
  const customer = {
    id: id || '1',
    customer_number: 'CUST-0001',
    name: 'Apex Logistics',
    status: 'active',
    email: 'billing@apex.com',
    phone: '(555) 019-2831',
    credit_limit: 50000,
    outstanding_balance: 14200,
    total_orders: 45,
    address: '1400 Industrial Blvd, Dallas, TX 75201',
    contact_person: 'Sarah Connor (Accounts Mgr)',
    recent_orders: [
      { id: '1', order_number: 'WH-2024-1045', route: 'Dallas -> Houston', weight: 14200, status: 'in_transit', total_amount: 4250, date: '2024-07-19' },
      { id: '2', order_number: 'WH-2024-1041', route: 'New Orleans -> Tampa', weight: 45000, status: 'delivered', total_amount: 2900, date: '2024-07-17' },
      { id: '3', order_number: 'WH-2024-1038', route: 'Atlanta -> Savannah', weight: 22000, status: 'delivered', total_amount: 3200, date: '2024-07-15' },
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
    { key: 'route', label: 'Route Path' },
    { key: 'weight', label: 'Weight (lbs)', render: (v: any) => v.toLocaleString() },
    { key: 'total_amount', label: 'Billing Rate', render: (v: any) => formatCurrency(v) },
    { key: 'status', label: 'Status', render: (v: any) => <StatusBadge status={v} /> },
    { key: 'date', label: 'Pickup Date', render: (v: any) => formatDate(v) },
  ]

  const creditUsedPercent = Math.min(100, Math.round((customer.outstanding_balance / customer.credit_limit) * 100))

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Customer Profile: ${customer.name}`}
        description="Billing details, credit standing, and shipping activity tracker."
        breadcrumbs={[
          { label: 'Customers', href: '/customers' },
          { label: customer.name },
        ]}
        actions={
          <Link to="/customers">
            <Button variant="outline" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Billing Account Specs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted">Customer Code</p>
                  <p className="text-sm font-mono font-semibold text-primary mt-0.5">{customer.customer_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Primary Contact Person</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{customer.contact_person}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Billing Address</p>
                  <p className="text-sm text-secondary mt-0.5">{customer.address}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted">Contact Info</p>
                  <div className="flex flex-col gap-1.5 mt-1 text-sm text-secondary">
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted" />{customer.email}</span>
                    <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted" />{customer.phone}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted">Account Status</p>
                  <div className="mt-1">
                    <StatusBadge status={customer.status} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity grid */}
          <Card title="Recent Orders History">
            <DataTable data={customer.recent_orders} columns={columns} />
          </Card>
        </div>

        {/* Credit details */}
        <div className="space-y-6">
          <Card title="Credit Audit Dashboard">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-secondary">Credit Limit</span>
                <span className="text-sm font-bold text-primary">{formatCurrency(customer.credit_limit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-secondary">Outstanding Balance</span>
                <span className="text-sm font-bold text-amber-500">{formatCurrency(customer.outstanding_balance)}</span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted font-medium">
                  <span>Credit Utilized</span>
                  <span>{creditUsedPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"
                    style={{ width: `${creditUsedPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-3 mt-2">
                <span className="text-xs text-secondary">Available Billing Credit</span>
                <span className="text-sm font-bold text-emerald-400">
                  {formatCurrency(customer.credit_limit - customer.outstanding_balance)}
                </span>
              </div>
            </div>
          </Card>

          {/* Core metrics count */}
          <Card title="Account Engagement">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl border bg-surface-secondary text-center">
                <Package className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <p className="text-xs text-muted">Total Orders</p>
                <p className="text-base font-bold text-primary mt-1">{customer.total_orders}</p>
              </div>
              <div className="p-3 rounded-xl border bg-surface-secondary text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <p className="text-xs text-muted">Gross Billing</p>
                <p className="text-base font-bold text-primary mt-1">{formatCurrency(194500)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export { CustomerDetail }
