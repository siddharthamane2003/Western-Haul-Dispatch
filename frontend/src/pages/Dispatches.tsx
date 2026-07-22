import React, { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchBar } from '@/components/ui/SearchBar'
import { Select } from '@/components/ui/Select'
import { Link } from 'react-router-dom'
import { Eye, Radio } from 'lucide-react'
import { formatShortDate, formatCurrency } from '@/lib/utils'

export default function Dispatches() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const dispatches = [
    { id: '1', dispatch_number: 'DSP-2024-0045', order_number: 'WH-2024-1045', customer: 'Apex Logistics', driver: 'John Smith', vehicle: 'Truck-A2', status: 'dispatched', pickup: 'Dallas, TX', delivery: 'Houston, TX', date: '2024-07-19' },
    { id: '2', dispatch_number: 'DSP-2024-0044', order_number: 'WH-2024-1044', customer: 'Summit Freight', driver: 'Jane Doe', vehicle: 'Truck-B5', status: 'completed', pickup: 'Phoenix, AZ', delivery: 'Los Angeles, CA', date: '2024-07-18' },
    { id: '3', dispatch_number: 'DSP-2024-0043', order_number: 'WH-2024-1043', customer: 'Pacific Transport', status: 'queued', pickup: 'Seattle, WA', delivery: 'Portland, OR', date: '2024-07-18' },
    { id: '4', dispatch_number: 'DSP-2024-0042', order_number: 'WH-2024-1042', customer: 'Rocky Mountain Cargo', driver: 'Robert Wilson', vehicle: 'Truck-C1', status: 'in_transit', pickup: 'Denver, CO', delivery: 'Salt Lake City, UT', date: '2024-07-17' },
  ]

  const filteredDispatches = dispatches.filter(d => {
    const matchesSearch =
      d.dispatch_number.toLowerCase().includes(search.toLowerCase()) ||
      d.order_number.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      (d.driver && d.driver.toLowerCase().includes(search.toLowerCase())) ||
      (d.vehicle && d.vehicle.toLowerCase().includes(search.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' ? true : d.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'dispatch_number',
      label: 'Dispatch ID',
      sortable: true,
      render: (v: any) => (
        <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
          {v}
        </span>
      ),
    },
    {
      key: 'order_number',
      label: 'Order Link',
      render: (v: any) => (
        <Link to={`/orders/${v}`} className="text-blue-400 hover:underline font-mono">
          {v}
        </Link>
      ),
    },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'driver', label: 'Assigned Driver', render: (v: any) => v || <span className="text-muted">Unassigned</span> },
    { key: 'vehicle', label: 'Vehicle Fleet', render: (v: any) => v || <span className="text-muted">Unassigned</span> },
    {
      key: 'status',
      label: 'Status State',
      sortable: true,
      render: (v: any) => <StatusBadge status={v} />,
    },
    {
      key: 'pickup',
      label: 'Route Path',
      render: (_: any, row: any) => (
        <span className="text-xs text-secondary">
          {row.pickup.split(',')[0]} → {row.delivery.split(',')[0]}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date Created',
      sortable: true,
      render: (v: any) => formatShortDate(v),
    },
    {
      key: 'actions',
      label: 'Details',
      render: (_: any, row: any) => (
        <Link
          to={`/orders/${row.order_number}`}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch History"
        description="Monitor driver vehicle assignments, status checkpoints, and operational queues."
      />

      <Card className="p-4">
        {/* Search / Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search dispatch ID, driver name, vehicle plate..."
            className="w-full md:max-w-md"
          />

          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Queued', value: 'queued' },
                { label: 'Dispatched', value: 'dispatched' },
                { label: 'In Transit', value: 'in_transit' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable data={filteredDispatches} columns={columns} />
      </Card>
    </div>
  )
}
export { Dispatches }
