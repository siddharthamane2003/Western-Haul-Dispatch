import React, { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SearchBar } from '@/components/ui/SearchBar'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Link } from 'react-router-dom'
import { Plus, Eye, Truck } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function Orders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form states
  const [customer, setCustomer] = useState('Apex Logistics')
  const [pickup, setPickup] = useState('')
  const [delivery, setDelivery] = useState('')
  const [weight, setWeight] = useState('')
  const [rate, setRate] = useState('')

  const [orders, setOrders] = useState([
    { id: '1', order_number: 'WH-2024-1045', customer: 'Apex Logistics', freight_type: 'general', weight: 14200, total_amount: 4250, status: 'in_transit', pickup: 'Dallas, TX', delivery: 'Houston, TX', date: '2024-07-19' },
    { id: '2', order_number: 'WH-2024-1044', customer: 'Summit Freight', freight_type: 'hazmat', weight: 24800, total_amount: 6800, status: 'delivered', pickup: 'Phoenix, AZ', delivery: 'Los Angeles, CA', date: '2024-07-18' },
    { id: '3', order_number: 'WH-2024-1043', customer: 'Pacific Transport', freight_type: 'refrigerated', weight: 8900, total_amount: 3100, status: 'pending', pickup: 'Seattle, WA', delivery: 'Portland, OR', date: '2024-07-18' },
    { id: '4', order_number: 'WH-2024-1042', customer: 'Rocky Mountain Cargo', freight_type: 'general', weight: 32000, total_amount: 7500, status: 'confirmed', pickup: 'Denver, CO', delivery: 'Salt Lake City, UT', date: '2024-07-17' },
    { id: '5', order_number: 'WH-2024-1041', customer: 'Gulf Coast Shipping', freight_type: 'bulk', weight: 45000, total_amount: 2900, status: 'delivered', pickup: 'New Orleans, LA', delivery: 'Tampa, FL', date: '2024-07-17' },
  ])

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.pickup.toLowerCase().includes(search.toLowerCase()) ||
      o.delivery.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !delivery || !weight || !rate) {
      toast.error('Please fill in all fields')
      return
    }

    const newOrder = {
      id: String(orders.length + 1),
      order_number: `WH-2024-${1046 + orders.length}`,
      customer,
      freight_type: 'general',
      weight: Number(weight),
      total_amount: Number(rate),
      status: 'pending',
      pickup,
      delivery,
      date: new Date().toISOString().split('T')[0],
    }

    setOrders([newOrder, ...orders])
    setIsModalOpen(false)
    toast.success('Order created successfully')

    // Reset inputs
    setPickup('')
    setDelivery('')
    setWeight('')
    setRate('')
  }

  const columns = [
    {
      key: 'order_number',
      label: 'Order ID',
      sortable: true,
      render: (v: any) => (
        <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
          {v}
        </span>
      ),
    },
    { key: 'customer', label: 'Customer', sortable: true },
    {
      key: 'route',
      label: 'Pickup → Delivery',
      render: (_: any, row: any) => (
        <span className="text-xs text-secondary">
          {row.pickup} → {row.delivery}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status State',
      sortable: true,
      render: (v: any) => <StatusBadge status={v} />,
    },
    {
      key: 'weight',
      label: 'Cargo Weight',
      sortable: true,
      render: (v: any) => `${v.toLocaleString()} lbs`,
    },
    {
      key: 'total_amount',
      label: 'Total Rate',
      sortable: true,
      render: (v: any) => formatCurrency(v),
    },
    {
      key: 'date',
      label: 'Pickup Date',
      sortable: true,
      render: (v: any) => formatDate(v),
    },
    {
      key: 'actions',
      label: 'View',
      render: (_: any, row: any) => (
        <Link
          to={`/orders/${row.order_number}`}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
        >
          <Eye className="w-3.5 h-3.5" />
          Details
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Freight Orders"
        description="Book freight shipments, manage status progressions, and review invoices."
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Book Load
          </Button>
        }
      />

      <Card className="p-4">
        {/* Search / Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search order ID, client name, routes..."
            className="w-full md:max-w-md"
          />

          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'All Statuses', value: 'all' },
                { label: 'Pending Bookings', value: 'pending' },
                { label: 'Confirmed', value: 'confirmed' },
                { label: 'In Transit', value: 'in_transit' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable data={filteredOrders} columns={columns} />
      </Card>

      {/* Book Load Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book New Freight Load" size="md">
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <Select
            label="Customer Client"
            value={customer}
            onChange={setCustomer}
            options={[
              { label: 'Apex Logistics', value: 'Apex Logistics' },
              { label: 'Summit Freight', value: 'Summit Freight' },
              { label: 'Pacific Transport', value: 'Pacific Transport' },
              { label: 'Rocky Mountain Cargo', value: 'Rocky Mountain Cargo' },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Pickup Location" placeholder="City, ST (e.g. Chicago, IL)" value={pickup} onChange={e => setPickup(e.target.value)} required />
            <Input label="Delivery Location" placeholder="City, ST (e.g. Atlanta, GA)" value={delivery} onChange={e => setDelivery(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="number" label="Cargo Weight (lbs)" placeholder="e.g. 15000" value={weight} onChange={e => setWeight(e.target.value)} required />
            <Input type="number" label="Flat Billing Rate ($)" placeholder="e.g. 3500" value={rate} onChange={e => setRate(e.target.value)} required />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Confirm Booking</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
export { Orders }
